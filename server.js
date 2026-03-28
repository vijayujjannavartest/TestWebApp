const http = require('http');
const { readFile } = require('fs/promises');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 4173;
const ROOT = __dirname;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function normalizeNumber(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (typeof value === 'object') {
    if (typeof value.raw === 'number') return value.raw;
    if (typeof value.fmt === 'string') {
      const parsed = Number(value.fmt.replace(/,/g, ''));
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

function displayValue(value, fallback = 'N/A') {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'object') return value.fmt || value.longFmt || value.raw || fallback;
  return String(value);
}

function percentFromDecimal(value) {
  const numeric = normalizeNumber(value);
  return numeric === null ? null : numeric * 100;
}

function scoreRange(value, thresholds) {
  if (value === null) return 50;
  if (value >= thresholds.excellent) return 95;
  if (value >= thresholds.good) return 80;
  if (value >= thresholds.ok) return 65;
  if (value >= thresholds.soft) return 45;
  return 25;
}

function scoreInverseRange(value, thresholds) {
  if (value === null) return 50;
  if (value <= thresholds.excellent) return 95;
  if (value <= thresholds.good) return 80;
  if (value <= thresholds.ok) return 65;
  if (value <= thresholds.soft) return 45;
  return 20;
}

function classifyRecommendation(score) {
  if (score >= 78) return 'Buy';
  if (score >= 55) return 'Hold';
  return 'Sell';
}

function formatPercent(value) {
  return value === null ? 'N/A' : `${value.toFixed(1)}%`;
}

function formatMoney(value, currency = 'USD') {
  if (value === null) return 'N/A';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString('en-US')}`;
  }
}

function describeStrength(score, label) {
  if (score >= 85) return `excellent ${label}`;
  if (score >= 70) return `solid ${label}`;
  if (score >= 55) return `adequate ${label}`;
  return `weak ${label}`;
}

function buildAnalysis(data) {
  const profitabilityInputs = [
    percentFromDecimal(data.grossMargins),
    percentFromDecimal(data.operatingMargins),
    percentFromDecimal(data.profitMargins),
    percentFromDecimal(data.returnOnEquity)
  ];

  const profitability = Math.round(
    [
      scoreRange(profitabilityInputs[0], { excellent: 60, good: 45, ok: 25, soft: 10 }),
      scoreRange(profitabilityInputs[1], { excellent: 30, good: 20, ok: 10, soft: 4 }),
      scoreRange(profitabilityInputs[2], { excellent: 22, good: 15, ok: 8, soft: 3 }),
      scoreRange(profitabilityInputs[3], { excellent: 24, good: 16, ok: 10, soft: 5 })
    ].reduce((sum, score) => sum + score, 0) / 4
  );

  const growth = Math.round(
    [
      scoreRange(percentFromDecimal(data.revenueGrowth), { excellent: 22, good: 12, ok: 6, soft: 2 }),
      scoreRange(percentFromDecimal(data.earningsGrowth), { excellent: 22, good: 12, ok: 6, soft: 2 })
    ].reduce((sum, score) => sum + score, 0) / 2
  );

  const liquidity = Math.round(
    [
      scoreRange(normalizeNumber(data.currentRatio), { excellent: 2.2, good: 1.5, ok: 1.1, soft: 0.9 }),
      scoreRange(normalizeNumber(data.quickRatio), { excellent: 1.8, good: 1.2, ok: 0.9, soft: 0.7 })
    ].reduce((sum, score) => sum + score, 0) / 2
  );

  const leverage = Math.round(
    scoreInverseRange(normalizeNumber(data.debtToEquity), { excellent: 30, good: 70, ok: 120, soft: 200 })
  );

  const cashFlow = Math.round(
    [
      scoreRange(percentFromDecimal(data.freeCashflowMargin), { excellent: 18, good: 10, ok: 5, soft: 1 }),
      scoreRange(percentFromDecimal(data.operatingCashflowMargin), { excellent: 20, good: 12, ok: 6, soft: 2 })
    ].reduce((sum, score) => sum + score, 0) / 2
  );

  const valuation = Math.round(
    scoreInverseRange(normalizeNumber(data.trailingPE) || normalizeNumber(data.forwardPE), {
      excellent: 15,
      good: 24,
      ok: 32,
      soft: 45
    })
  );

  const composite = Math.round(
    profitability * 0.24 +
      growth * 0.18 +
      liquidity * 0.14 +
      leverage * 0.12 +
      cashFlow * 0.18 +
      valuation * 0.14
  );

  const recommendation = classifyRecommendation(composite);
  const analystRecommendationMean = normalizeNumber(data.recommendationMean);
  const streetSignal = analystRecommendationMean === null
    ? displayValue(data.recommendationKey, 'N/A')
    : `${analystRecommendationMean.toFixed(2)} / 5.00`;

  const valuationLabel = valuation >= 85 ? 'Compelling' : valuation <= 40 ? 'Demanding' : 'Balanced';
  const targetUpside = normalizeNumber(data.targetMeanPrice) && normalizeNumber(data.currentPrice)
    ? ((normalizeNumber(data.targetMeanPrice) - normalizeNumber(data.currentPrice)) / normalizeNumber(data.currentPrice)) * 100
    : null;

  const narratives = [
    `${data.companyName} currently screens with a composite financial-health score of ${composite}/100, supported by ${describeStrength(profitability, 'profitability')} and ${describeStrength(cashFlow, 'cash generation')}.`,
    `Growth indicators show revenue growth of ${formatPercent(percentFromDecimal(data.revenueGrowth))} and earnings growth of ${formatPercent(percentFromDecimal(data.earningsGrowth))}, while leverage/liquidity metrics imply ${describeStrength(Math.round((liquidity + leverage) / 2), 'balance-sheet quality')}.`,
    `Valuation looks ${valuationLabel.toLowerCase()} on current earnings multiples, and ${targetUpside === null ? 'consensus price-target upside is unavailable' : `consensus target pricing implies ${targetUpside.toFixed(1)}% potential upside`}.`
  ];

  const positives = [
    `Gross margin: ${formatPercent(percentFromDecimal(data.grossMargins))}`,
    `Operating margin: ${formatPercent(percentFromDecimal(data.operatingMargins))}`,
    `Revenue growth: ${formatPercent(percentFromDecimal(data.revenueGrowth))}`,
    `Free cash flow: ${formatMoney(normalizeNumber(data.freeCashflow), data.currency)}`
  ].filter((value) => !value.includes('N/A'));

  const risks = [
    `Debt / equity: ${normalizeNumber(data.debtToEquity) === null ? 'N/A' : normalizeNumber(data.debtToEquity).toFixed(1)}`,
    `Current ratio: ${normalizeNumber(data.currentRatio) === null ? 'N/A' : normalizeNumber(data.currentRatio).toFixed(2)}`,
    `Trailing P/E: ${normalizeNumber(data.trailingPE) === null ? 'N/A' : normalizeNumber(data.trailingPE).toFixed(1)}`,
    `Beta: ${normalizeNumber(data.beta) === null ? 'N/A' : normalizeNumber(data.beta).toFixed(2)}`
  ].filter((value) => !value.endsWith('N/A'));

  return {
    recommendation,
    composite,
    valuationLabel,
    streetSignal,
    targetUpside,
    narratives,
    positives,
    risks,
    scorecards: [
      { title: 'Profitability', score: profitability },
      { title: 'Growth', score: growth },
      { title: 'Liquidity', score: liquidity },
      { title: 'Leverage', score: leverage },
      { title: 'Cash flow', score: cashFlow },
      { title: 'Valuation', score: valuation }
    ]
  };
}

function filterResultsByExchange(quotes, exchange) {
  if (exchange === 'sensex') {
    return quotes.filter((quote) => {
      const exchangeText = `${quote.exchange || ''} ${quote.exchDisp || ''}`.toUpperCase();
      return quote.symbol?.endsWith('.BO') || exchangeText.includes('BSE');
    });
  }

  return quotes.filter((quote) => {
    const exchangeText = `${quote.exchange || ''} ${quote.exchDisp || ''}`.toUpperCase();
    return exchangeText.includes('NASDAQ') || ['NMS', 'NGM', 'NGS'].includes((quote.exchange || '').toUpperCase());
  });
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Upstream request failed with ${response.status}`);
  }

  return response.json();
}

async function searchCompanies(query, exchange) {
  const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=8&newsCount=0`;
  const payload = await fetchJson(url);
  const quotes = filterResultsByExchange(payload.quotes || [], exchange)
    .filter((quote) => quote.quoteType === 'EQUITY')
    .slice(0, 6)
    .map((quote) => ({
      symbol: quote.symbol,
      name: quote.shortname || quote.longname || quote.symbol,
      exchange: quote.exchDisp || quote.exchange || exchange.toUpperCase()
    }));

  return quotes;
}

async function fetchAnalysis(symbol) {
  const modules = [
    'price',
    'summaryDetail',
    'financialData',
    'defaultKeyStatistics',
    'assetProfile'
  ].join(',');

  const summaryUrl = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=${modules}`;
  const quoteUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}`;

  const [summaryPayload, quotePayload] = await Promise.all([fetchJson(summaryUrl), fetchJson(quoteUrl)]);
  const summary = summaryPayload.quoteSummary?.result?.[0] || {};
  const quote = quotePayload.quoteResponse?.result?.[0] || {};

  const price = summary.price || {};
  const detail = summary.summaryDetail || {};
  const financial = summary.financialData || {};
  const stats = summary.defaultKeyStatistics || {};
  const profile = summary.assetProfile || {};

  const currentPrice = normalizeNumber(financial.currentPrice) ?? normalizeNumber(price.regularMarketPrice) ?? normalizeNumber(quote.regularMarketPrice);
  const totalRevenue = normalizeNumber(financial.totalRevenue);
  const operatingCashflow = normalizeNumber(financial.operatingCashflow);
  const freeCashflow = normalizeNumber(financial.freeCashflow);

  const model = {
    symbol,
    companyName: displayValue(price.longName || price.shortName || quote.longName || quote.shortName, symbol),
    exchange: displayValue(quote.fullExchangeName || quote.exchange || price.exchangeName, 'N/A'),
    sector: displayValue(profile.sector, 'N/A'),
    industry: displayValue(profile.industry, 'N/A'),
    currency: displayValue(price.currency || quote.currency, 'USD'),
    marketCap: normalizeNumber(price.marketCap) ?? normalizeNumber(quote.marketCap),
    currentPrice,
    previousClose: normalizeNumber(detail.previousClose),
    trailingPE: normalizeNumber(detail.trailingPE) ?? normalizeNumber(quote.trailingPE),
    forwardPE: normalizeNumber(detail.forwardPE),
    targetMeanPrice: normalizeNumber(financial.targetMeanPrice),
    recommendationMean: normalizeNumber(financial.recommendationMean),
    recommendationKey: displayValue(financial.recommendationKey, 'N/A'),
    grossMargins: normalizeNumber(financial.grossMargins),
    operatingMargins: normalizeNumber(financial.operatingMargins),
    profitMargins: normalizeNumber(financial.profitMargins) ?? normalizeNumber(stats.profitMargins),
    revenueGrowth: normalizeNumber(financial.revenueGrowth),
    earningsGrowth: normalizeNumber(financial.earningsGrowth),
    returnOnEquity: normalizeNumber(financial.returnOnEquity),
    currentRatio: normalizeNumber(financial.currentRatio),
    quickRatio: normalizeNumber(financial.quickRatio),
    debtToEquity: normalizeNumber(financial.debtToEquity),
    freeCashflow,
    operatingCashflow,
    freeCashflowMargin: totalRevenue ? freeCashflow / totalRevenue : null,
    operatingCashflowMargin: totalRevenue ? operatingCashflow / totalRevenue : null,
    totalCash: normalizeNumber(financial.totalCash),
    totalDebt: normalizeNumber(financial.totalDebt),
    fiftyTwoWeekHigh: normalizeNumber(detail.fiftyTwoWeekHigh),
    fiftyTwoWeekLow: normalizeNumber(detail.fiftyTwoWeekLow),
    beta: normalizeNumber(detail.beta),
    website: displayValue(profile.website, 'N/A'),
    businessSummary: displayValue(profile.longBusinessSummary, 'No business summary available.'),
    updatedAt: new Date().toISOString()
  };

  return {
    profile: model,
    analysis: buildAnalysis(model)
  };
}

async function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { 'Content-Type': MIME_TYPES['.json'] });
  response.end(JSON.stringify(payload));
}

async function serveStatic(response, filePath) {
  try {
    const content = await readFile(filePath);
    response.writeHead(200, { 'Content-Type': MIME_TYPES[path.extname(filePath)] || 'text/plain; charset=utf-8' });
    response.end(content);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}

async function requestHandler(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  if (requestUrl.pathname === '/api/search') {
    const query = requestUrl.searchParams.get('q')?.trim();
    const exchange = requestUrl.searchParams.get('exchange') === 'sensex' ? 'sensex' : 'nasdaq';

    if (!query) {
      await sendJson(response, 400, { error: 'Missing query parameter.' });
      return;
    }

    try {
      const results = await searchCompanies(query, exchange);
      await sendJson(response, 200, { results });
    } catch (error) {
      await sendJson(response, 502, {
        error: 'Unable to reach live market data right now. Please try again shortly.',
        detail: error.message
      });
    }
    return;
  }

  if (requestUrl.pathname === '/api/analyze') {
    const symbol = requestUrl.searchParams.get('symbol')?.trim();

    if (!symbol) {
      await sendJson(response, 400, { error: 'Missing symbol parameter.' });
      return;
    }

    try {
      const payload = await fetchAnalysis(symbol);
      await sendJson(response, 200, payload);
    } catch (error) {
      await sendJson(response, 502, {
        error: 'Unable to fetch live financials for that company right now.',
        detail: error.message
      });
    }
    return;
  }

  const requestedFile = requestUrl.pathname === '/' ? 'index.html' : requestUrl.pathname.slice(1);
  const safePath = path.normalize(requestedFile).replace(/^([.][.][\/])+/, '');
  await serveStatic(response, path.join(ROOT, safePath));
}

function startServer() {
  const server = http.createServer((request, response) => {
    requestHandler(request, response).catch((error) => {
      response.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ error: 'Internal server error', detail: error.message }));
    });
  });

  server.listen(PORT, () => {
    console.log(`EquityLens live server listening on http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = {
  buildAnalysis,
  filterResultsByExchange,
  normalizeNumber
};
