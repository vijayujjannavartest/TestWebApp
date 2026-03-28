const companyData = {
  apple: {
    name: 'Apple Inc.',
    ticker: 'AAPL',
    sector: 'Technology Hardware',
    marketCap: '$2.9T',
    revenueGrowth: 4,
    grossMargin: 45,
    operatingMargin: 30,
    freeCashFlowMargin: 26,
    currentRatio: 1.0,
    debtToEquity: 1.7,
    returnOnEquity: 145,
    peRatio: 29,
    analystNote:
      'Apple combines elite cash generation, premium pricing power, and an exceptionally sticky installed base, though upside depends on refreshing growth beyond the iPhone cycle.',
    catalysts: [
      'Services mix expansion supports recurring, high-margin revenue.',
      'Capital returns remain substantial thanks to durable free cash flow.',
      'Brand strength and ecosystem lock-in protect pricing power.'
    ],
    risks: [
      'Mature hardware categories limit top-line acceleration.',
      'Supply-chain concentration and regulation can pressure execution.',
      'Premium valuation leaves less room for operational missteps.'
    ]
  },
  microsoft: {
    name: 'Microsoft Corp.',
    ticker: 'MSFT',
    sector: 'Software & Cloud',
    marketCap: '$3.1T',
    revenueGrowth: 15,
    grossMargin: 69,
    operatingMargin: 45,
    freeCashFlowMargin: 34,
    currentRatio: 1.7,
    debtToEquity: 0.4,
    returnOnEquity: 39,
    peRatio: 35,
    analystNote:
      'Microsoft offers one of the market’s cleanest combinations of cloud scale, earnings resilience, and AI monetization pathways, supporting a premium but justified multiple.',
    catalysts: [
      'Azure and AI demand provide a long runway for enterprise growth.',
      'High-margin software mix drives strong incremental profitability.',
      'Balance-sheet strength supports continued strategic investment.'
    ],
    risks: [
      'Premium expectations increase sensitivity to slower cloud growth.',
      'Antitrust or bundling scrutiny could affect product packaging.',
      'Large-cap size makes outsized growth harder to sustain indefinitely.'
    ]
  },
  nvidia: {
    name: 'NVIDIA Corp.',
    ticker: 'NVDA',
    sector: 'Semiconductors',
    marketCap: '$2.3T',
    revenueGrowth: 65,
    grossMargin: 75,
    operatingMargin: 62,
    freeCashFlowMargin: 48,
    currentRatio: 3.5,
    debtToEquity: 0.2,
    returnOnEquity: 91,
    peRatio: 58,
    analystNote:
      'NVIDIA is executing at a rare level with exceptional growth and profitability, although the stock already prices in a large portion of future AI leadership.',
    catalysts: [
      'AI accelerator demand remains structurally strong.',
      'Industry-leading margins provide substantial earnings leverage.',
      'Net cash positioning adds strategic flexibility.'
    ],
    risks: [
      'Valuation is elevated and vulnerable to any sign of normalization.',
      'Customer concentration can amplify order timing volatility.',
      'Competitive silicon and sovereign AI initiatives could compress moat over time.'
    ]
  },
  amazon: {
    name: 'Amazon.com, Inc.',
    ticker: 'AMZN',
    sector: 'E-Commerce & Cloud',
    marketCap: '$1.9T',
    revenueGrowth: 12,
    grossMargin: 49,
    operatingMargin: 11,
    freeCashFlowMargin: 9,
    currentRatio: 1.1,
    debtToEquity: 0.5,
    returnOnEquity: 24,
    peRatio: 42,
    analystNote:
      'Amazon’s investment case is anchored by margin expansion potential and AWS durability, but consolidated profitability still trails software-heavy peers.',
    catalysts: [
      'AWS remains a foundational profit engine with AI upside.',
      'Retail efficiency gains are improving margin structure.',
      'Advertising continues to scale as a higher-margin revenue stream.'
    ],
    risks: [
      'Retail operations remain exposed to consumer softness and fulfillment costs.',
      'Valuation assumes continued margin improvement.',
      'Regulatory scrutiny could affect marketplace practices.'
    ]
  },
  alphabet: {
    name: 'Alphabet Inc.',
    ticker: 'GOOGL',
    sector: 'Internet Platforms',
    marketCap: '$2.0T',
    revenueGrowth: 13,
    grossMargin: 58,
    operatingMargin: 32,
    freeCashFlowMargin: 24,
    currentRatio: 1.8,
    debtToEquity: 0.1,
    returnOnEquity: 31,
    peRatio: 26,
    analystNote:
      'Alphabet pairs robust margins and a fortress balance sheet with a valuation that remains comparatively reasonable for a dominant digital platform.',
    catalysts: [
      'Search and YouTube maintain deep monetization advantages.',
      'Net cash and high cash conversion support optionality.',
      'Cloud profitability is improving and diversifying earnings.'
    ],
    risks: [
      'AI disruption to search behavior remains a strategic watchpoint.',
      'Antitrust remedies could influence distribution economics.',
      'Advertising demand can soften during macro slowdowns.'
    ]
  },
  meta: {
    name: 'Meta Platforms, Inc.',
    ticker: 'META',
    sector: 'Digital Advertising',
    marketCap: '$1.2T',
    revenueGrowth: 16,
    grossMargin: 81,
    operatingMargin: 42,
    freeCashFlowMargin: 29,
    currentRatio: 2.7,
    debtToEquity: 0.3,
    returnOnEquity: 34,
    peRatio: 28,
    analystNote:
      'Meta has rebuilt investor confidence through disciplined cost management and superior ad monetization, while still carrying execution risk around long-dated metaverse spending.',
    catalysts: [
      'Ad efficiency and engagement trends remain healthy.',
      'Profitability has meaningfully improved after cost discipline.',
      'AI tools are enhancing monetization across apps.'
    ],
    risks: [
      'Reality Labs spending can dilute consolidated returns.',
      'Platform regulation and privacy changes remain persistent risks.',
      'Advertising cyclicality can hit sentiment quickly.'
    ]
  },
  tesla: {
    name: 'Tesla, Inc.',
    ticker: 'TSLA',
    sector: 'Automotive & Energy',
    marketCap: '$560B',
    revenueGrowth: 3,
    grossMargin: 18,
    operatingMargin: 8,
    freeCashFlowMargin: 5,
    currentRatio: 1.6,
    debtToEquity: 0.2,
    returnOnEquity: 18,
    peRatio: 62,
    analystNote:
      'Tesla still benefits from brand, scale, and optionality in energy and autonomy, but near-term automotive margin compression creates a more balanced risk/reward profile.',
    catalysts: [
      'Strong balance sheet and manufacturing scale provide resilience.',
      'Energy storage and software options offer upside beyond autos.',
      'Long-term autonomy ambitions could expand earnings power if executed.'
    ],
    risks: [
      'Automotive pricing pressure has materially reduced margins.',
      'Valuation remains aggressive relative to current earnings growth.',
      'Execution on autonomy and new models is uncertain and timing-sensitive.'
    ]
  },
  jpmorgan: {
    name: 'JPMorgan Chase & Co.',
    ticker: 'JPM',
    sector: 'Banking',
    marketCap: '$560B',
    revenueGrowth: 10,
    grossMargin: 57,
    operatingMargin: 36,
    freeCashFlowMargin: 28,
    currentRatio: 0.9,
    debtToEquity: 1.3,
    returnOnEquity: 17,
    peRatio: 14,
    analystNote:
      'JPMorgan stands out for earnings durability, scale advantages, and capital strength, with valuation still modest compared with many mega-cap peers.',
    catalysts: [
      'Diversified revenue streams improve resilience across cycles.',
      'Capital strength supports shareholder returns and strategic flexibility.',
      'Reasonable valuation adds downside support.'
    ],
    risks: [
      'Credit costs can rise if the macro backdrop weakens.',
      'Bank regulation and capital rules can constrain returns.',
      'Net interest income is sensitive to rate-cycle shifts.'
    ]
  }
};

const aliases = {
  aapl: 'apple',
  apple: 'apple',
  msft: 'microsoft',
  microsoft: 'microsoft',
  nvda: 'nvidia',
  nvidia: 'nvidia',
  amzn: 'amazon',
  amazon: 'amazon',
  googl: 'alphabet',
  google: 'alphabet',
  alphabet: 'alphabet',
  meta: 'meta',
  facebook: 'meta',
  tsla: 'tesla',
  tesla: 'tesla',
  jpm: 'jpmorgan',
  'jpmorgan chase': 'jpmorgan',
  jpmorgan: 'jpmorgan'
};

const form = document.getElementById('analysis-form');
const companyInput = document.getElementById('company-input');
const emptyState = document.getElementById('empty-state');
const analysisView = document.getElementById('analysis-view');
const metricsGrid = document.getElementById('metrics-grid');
const assessmentList = document.getElementById('assessment-list');
const bullList = document.getElementById('bull-list');
const riskList = document.getElementById('risk-list');
const detailGrid = document.getElementById('detail-grid');

const scoreMetric = (value, ranges) => {
  if (value >= ranges.excellent) return 95;
  if (value >= ranges.good) return 80;
  if (value >= ranges.ok) return 65;
  if (value >= ranges.soft) return 45;
  return 25;
};

const inverseScoreMetric = (value, ranges) => {
  if (value <= ranges.excellent) return 95;
  if (value <= ranges.good) return 80;
  if (value <= ranges.ok) return 65;
  if (value <= ranges.soft) return 45;
  return 20;
};

function analyzeCompany(company) {
  const profitability = Math.round(
    (scoreMetric(company.grossMargin, { excellent: 65, good: 50, ok: 35, soft: 20 }) +
      scoreMetric(company.operatingMargin, { excellent: 35, good: 22, ok: 12, soft: 5 }) +
      scoreMetric(company.returnOnEquity, { excellent: 30, good: 20, ok: 12, soft: 6 })) /
      3
  );

  const growth = Math.round(
    scoreMetric(company.revenueGrowth, { excellent: 25, good: 15, ok: 8, soft: 3 })
  );

  const cashFlow = Math.round(
    scoreMetric(company.freeCashFlowMargin, { excellent: 28, good: 18, ok: 10, soft: 4 })
  );

  const balanceSheet = Math.round(
    (scoreMetric(company.currentRatio, { excellent: 2.2, good: 1.5, ok: 1.1, soft: 0.9 }) +
      inverseScoreMetric(company.debtToEquity, { excellent: 0.25, good: 0.6, ok: 1.1, soft: 1.8 })) /
      2
  );

  const valuation = Math.round(
    inverseScoreMetric(company.peRatio, { excellent: 18, good: 25, ok: 32, soft: 45 })
  );

  const resilience = Math.round(
    (profitability * 0.35 + cashFlow * 0.25 + balanceSheet * 0.25 + growth * 0.15)
  );

  const composite = Math.round(
    profitability * 0.24 +
      growth * 0.18 +
      cashFlow * 0.18 +
      balanceSheet * 0.16 +
      valuation * 0.12 +
      resilience * 0.12
  );

  let recommendation = 'Hold';
  if (composite >= 78) recommendation = 'Buy';
  if (composite < 55) recommendation = 'Sell';

  let valuationView = 'Fairly valued';
  if (valuation >= 85) valuationView = 'Compelling';
  else if (valuation <= 40) valuationView = 'Demanding';

  const narratives = [
    `${company.name} scores ${composite}/100 overall, reflecting ${describeScore(profitability, 'profitability')} and ${describeScore(balanceSheet, 'balance-sheet discipline')}.`,
    `Revenue growth of ${company.revenueGrowth}% and free-cash-flow margin of ${company.freeCashFlowMargin}% indicate ${growth >= 80 ? 'strong business momentum' : growth >= 60 ? 'steady operating momentum' : 'more modest operating momentum'} relative to quality expectations.`,
    `Valuation at roughly ${company.peRatio}x earnings appears ${valuationView.toLowerCase()}, so upside potential depends on the company’s ability to ${recommendation === 'Buy' ? 'sustain premium execution' : recommendation === 'Hold' ? 'convert stable execution into renewed acceleration' : 'repair fundamentals or re-rate materially lower'}.`
  ];

  const rationale =
    recommendation === 'Buy'
      ? 'Financial quality is high enough to support a constructive view, and the fundamental setup still offers attractive risk-adjusted upside.'
      : recommendation === 'Hold'
        ? 'The business remains investable, but current fundamentals and valuation suggest a balanced risk/reward rather than a clear entry point.'
        : 'Current operating trends and/or valuation do not adequately compensate for the downside risks in the present setup.';

  return {
    recommendation,
    composite,
    valuationView,
    rationale,
    narratives,
    scorecards: [
      { title: 'Profitability', score: profitability, note: `${company.operatingMargin}% operating margin` },
      { title: 'Growth', score: growth, note: `${company.revenueGrowth}% revenue growth` },
      { title: 'Cash generation', score: cashFlow, note: `${company.freeCashFlowMargin}% FCF margin` },
      { title: 'Balance sheet', score: balanceSheet, note: `${company.debtToEquity}x debt/equity` },
      { title: 'Valuation', score: valuation, note: `${company.peRatio}x P/E` },
      { title: 'Resilience', score: resilience, note: `${company.currentRatio} current ratio` }
    ]
  };
}

function describeScore(score, label) {
  if (score >= 85) return `excellent ${label}`;
  if (score >= 70) return `solid ${label}`;
  if (score >= 55) return `adequate ${label}`;
  return `soft ${label}`;
}

function renderAnalysis(company) {
  const analysis = analyzeCompany(company);
  emptyState.classList.add('hidden');
  analysisView.classList.remove('hidden');

  document.getElementById('company-ticker').textContent = company.ticker;
  document.getElementById('company-name').textContent = company.name;
  document.getElementById('company-summary').textContent = company.analystNote;
  document.getElementById('composite-score').textContent = `${analysis.composite}/100`;
  document.getElementById('sector-name').textContent = company.sector;
  document.getElementById('market-cap').textContent = company.marketCap;
  document.getElementById('valuation-view').textContent = analysis.valuationView;
  document.getElementById('decision-rationale').textContent = analysis.rationale;

  const recommendationBadge = document.getElementById('recommendation-badge');
  recommendationBadge.textContent = analysis.recommendation;
  recommendationBadge.className = 'recommendation-badge';
  recommendationBadge.classList.add(`badge-${analysis.recommendation.toLowerCase()}`);

  document.getElementById('gauge-fill').style.left = `${analysis.composite}%`;

  metricsGrid.innerHTML = analysis.scorecards
    .map(
      (metric) => `
        <article class="metric-card">
          <h3>${metric.title}</h3>
          <div class="score-line">
            <strong>${metric.score}</strong>
            <span>${metric.note}</span>
          </div>
          <div class="score-bar">
            <div class="score-fill" style="width: ${metric.score}%"></div>
          </div>
        </article>
      `
    )
    .join('');

  assessmentList.innerHTML = analysis.narratives.map((item) => `<p>${item}</p>`).join('');
  bullList.innerHTML = company.catalysts.map((item) => `<li>${item}</li>`).join('');
  riskList.innerHTML = company.risks.map((item) => `<li>${item}</li>`).join('');

  detailGrid.innerHTML = [
    ['Revenue growth', `${company.revenueGrowth}%`],
    ['Gross margin', `${company.grossMargin}%`],
    ['Operating margin', `${company.operatingMargin}%`],
    ['Free-cash-flow margin', `${company.freeCashFlowMargin}%`],
    ['Current ratio', company.currentRatio],
    ['Debt / Equity', `${company.debtToEquity}x`],
    ['Return on equity', `${company.returnOnEquity}%`],
    ['P/E ratio', `${company.peRatio}x`]
  ]
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

function showNotFound(query) {
  emptyState.classList.add('hidden');
  analysisView.classList.remove('hidden');

  document.getElementById('company-ticker').textContent = 'No match';
  document.getElementById('company-name').textContent = query;
  document.getElementById('company-summary').textContent =
    'This demo currently includes eight preloaded companies. Try a supported company name or extend the dataset in app.js to cover additional stocks.';
  document.getElementById('composite-score').textContent = '—';
  document.getElementById('sector-name').textContent = '—';
  document.getElementById('market-cap').textContent = '—';
  document.getElementById('valuation-view').textContent = '—';
  document.getElementById('decision-rationale').textContent =
    'No recommendation is available until a supported company profile is selected.';

  const recommendationBadge = document.getElementById('recommendation-badge');
  recommendationBadge.textContent = 'Unavailable';
  recommendationBadge.className = 'recommendation-badge badge-sell';
  document.getElementById('gauge-fill').style.left = '0%';

  metricsGrid.innerHTML = '';
  assessmentList.innerHTML = '<p>Add more company profiles to the embedded dataset to expand coverage.</p>';
  bullList.innerHTML = '<li>Supported examples are shown below the search box.</li>';
  riskList.innerHTML = '<li>Unsupported inputs cannot generate a reliable financial recommendation in this offline demo.</li>';
  detailGrid.innerHTML = '';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const normalized = companyInput.value.trim().toLowerCase();

  if (!normalized) {
    companyInput.focus();
    return;
  }

  const companyKey = aliases[normalized];
  const company = companyKey ? companyData[companyKey] : null;

  if (!company) {
    showNotFound(companyInput.value.trim());
    return;
  }

  renderAnalysis(company);
});

renderAnalysis(companyData.microsoft);
