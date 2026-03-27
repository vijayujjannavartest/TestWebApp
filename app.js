const form = document.getElementById('analysis-form');
const exchangeSelect = document.getElementById('exchange-select');
const companyInput = document.getElementById('company-input');
const statusBanner = document.getElementById('status-banner');
const searchResults = document.getElementById('search-results');
const analysisView = document.getElementById('analysis-view');
const metricsGrid = document.getElementById('metrics-grid');
const assessmentList = document.getElementById('assessment-list');
const bullList = document.getElementById('bull-list');
const riskList = document.getElementById('risk-list');
const detailGrid = document.getElementById('detail-grid');

function setStatus(message, tone = 'default') {
  statusBanner.textContent = message;
  statusBanner.className = 'status-banner';
  if (tone !== 'default') {
    statusBanner.classList.add(tone);
  }
}

function formatMoney(value, currency = 'USD') {
  if (value === null || value === undefined) return 'N/A';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(value);
  } catch {
    return `${currency} ${Number(value).toLocaleString('en-US')}`;
  }
}

function formatPlain(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return 'N/A';
  return Number(value).toFixed(digits);
}

function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return 'N/A';
  return `${Number(value).toFixed(1)}%`;
}

function renderMetricCards(scorecards) {
  metricsGrid.innerHTML = scorecards
    .map(
      (metric) => `
        <article class="metric-card">
          <h3>${metric.title}</h3>
          <p class="score-line"><strong>${metric.score}</strong><span>/ 100</span></p>
          <div class="score-bar"><div class="score-fill" style="width: ${metric.score}%"></div></div>
        </article>
      `
    )
    .join('');
}

function renderList(element, values) {
  element.innerHTML = values.map((value) => `<li>${value}</li>`).join('');
}

function renderDetails(profile, analysis) {
  const rows = [
    ['Sector', profile.sector],
    ['Industry', profile.industry],
    ['52-week range', `${formatMoney(profile.fiftyTwoWeekLow, profile.currency)} - ${formatMoney(profile.fiftyTwoWeekHigh, profile.currency)}`],
    ['Trailing P/E', formatPlain(profile.trailingPE)],
    ['Forward P/E', formatPlain(profile.forwardPE)],
    ['Revenue growth', formatPercent(profile.revenueGrowth * 100)],
    ['Earnings growth', formatPercent(profile.earningsGrowth * 100)],
    ['Gross margin', formatPercent(profile.grossMargins * 100)],
    ['Operating margin', formatPercent(profile.operatingMargins * 100)],
    ['Profit margin', formatPercent(profile.profitMargins * 100)],
    ['Return on equity', formatPercent(profile.returnOnEquity * 100)],
    ['Current ratio', formatPlain(profile.currentRatio, 2)],
    ['Quick ratio', formatPlain(profile.quickRatio, 2)],
    ['Debt / equity', formatPlain(profile.debtToEquity, 1)],
    ['Operating cash flow', formatMoney(profile.operatingCashflow, profile.currency)],
    ['Free cash flow', formatMoney(profile.freeCashflow, profile.currency)],
    ['Market cap', formatMoney(profile.marketCap, profile.currency)],
    ['Target upside', analysis.targetUpside === null ? 'N/A' : formatPercent(analysis.targetUpside)]
  ];

  detailGrid.innerHTML = rows
    .map(
      ([label, value]) => `
        <div class="detail-item">
          <strong>${label}</strong>
          <span>${value}</span>
        </div>
      `
    )
    .join('');
}

function renderAnalysis(payload) {
  const { profile, analysis } = payload;
  analysisView.classList.remove('hidden');

  document.getElementById('company-symbol').textContent = profile.symbol;
  document.getElementById('company-name').textContent = profile.companyName;
  document.getElementById('company-exchange').textContent = `${profile.exchange} • ${profile.sector}`;
  document.getElementById('company-summary').textContent = profile.businessSummary;
  document.getElementById('composite-score').textContent = `${analysis.composite}/100`;
  document.getElementById('current-price').textContent = formatMoney(profile.currentPrice, profile.currency);
  document.getElementById('market-cap').textContent = formatMoney(profile.marketCap, profile.currency);
  document.getElementById('street-signal').textContent = analysis.streetSignal;
  document.getElementById('decision-rationale').textContent =
    `${analysis.recommendation} — ${analysis.valuationLabel} valuation with live scorecards derived from current fundamentals.`;
  document.getElementById('last-updated').textContent = `Live data fetched: ${new Date(profile.updatedAt).toLocaleString()}`;

  const badge = document.getElementById('recommendation-badge');
  badge.textContent = analysis.recommendation;
  badge.className = 'recommendation-badge';
  badge.classList.add(`badge-${analysis.recommendation.toLowerCase()}`);

  document.getElementById('gauge-fill').style.left = `${analysis.composite}%`;

  renderMetricCards(analysis.scorecards);
  assessmentList.innerHTML = analysis.narratives.map((item) => `<p>${item}</p>`).join('');
  renderList(bullList, analysis.positives);
  renderList(riskList, analysis.risks);
  renderDetails(profile, analysis);
}

function renderSearchResults(results) {
  searchResults.innerHTML = results
    .map(
      (result) => `
        <article class="result-card">
          <div>
            <p class="eyebrow">${result.symbol}</p>
            <h3>${result.name}</h3>
            <p class="helper-text">${result.exchange}</p>
          </div>
          <button class="secondary" data-symbol="${result.symbol}">Analyze ${result.symbol}</button>
        </article>
      `
    )
    .join('');

  searchResults.classList.remove('hidden');
}

async function fetchJson(url) {
  const response = await fetch(url);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed');
  }

  return payload;
}

async function analyzeSymbol(symbol) {
  setStatus(`Fetching live financials for ${symbol}...`, 'loading');

  const payload = await fetchJson(`/api/analyze?symbol=${encodeURIComponent(symbol)}`);
  renderAnalysis(payload);
  setStatus(`Live analysis ready for ${payload.profile.companyName} (${payload.profile.symbol}).`);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const company = companyInput.value.trim();
  const exchange = exchangeSelect.value;

  if (!company) {
    setStatus('Please enter a company name first.', 'error');
    companyInput.focus();
    return;
  }

  analysisView.classList.add('hidden');
  searchResults.classList.add('hidden');
  searchResults.innerHTML = '';

  try {
    setStatus(`Searching live ${exchange.toUpperCase()} listings for “${company}”...`, 'loading');
    const payload = await fetchJson(`/api/search?q=${encodeURIComponent(company)}&exchange=${encodeURIComponent(exchange)}`);

    if (!payload.results.length) {
      setStatus(`No ${exchange.toUpperCase()} company matches were found for “${company}”.`, 'error');
      return;
    }

    if (payload.results.length === 1) {
      await analyzeSymbol(payload.results[0].symbol);
      return;
    }

    renderSearchResults(payload.results);
    setStatus(`Found ${payload.results.length} matches. Pick the right listing to analyze it live.`);
  } catch (error) {
    setStatus(error.message, 'error');
  }
});

searchResults.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-symbol]');
  if (!button) return;

  try {
    await analyzeSymbol(button.dataset.symbol);
  } catch (error) {
    setStatus(error.message, 'error');
  }
});
