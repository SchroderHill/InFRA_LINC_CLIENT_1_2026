const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoic2Nocm9kZXItaGlsbCIsImEiOiJjbHpmdW5ibXUxY3I1MmtvbXU3c2t0aHhoIn0.D_W59ZKzQSJf7WF8Cfhm3w';
const DEFAULT_CENTER = [173.701210123035, -41.4259289278591];
const DEFAULT_ZOOM = 10;
const BASEMAP_STYLE = 'mapbox://styles/mapbox/satellite-v9';
const BASEMAP_LABEL = 'Mapbox Satellite';
const RAINFALL_TIMEZONE = 'Pacific/Auckland';
const RAINFALL_ARCHIVE_DELAY_DAYS = 5;
const RAINFALL_FETCH_TIMEOUT_MS = 15000;
const ESC_SUMMARY_URL = './data/esc_summaries.json';
const ESC_OVERLAY_URL = './data/esc_clipped.geojson';
const ROAD_CORRIDOR_SOURCE_ID = 'road-corridor-source';
const ROAD_CORRIDOR_FILL_LAYER_ID = 'road-corridor-fill';
const ROAD_CORRIDOR_3D_LAYER_ID = 'road-corridor-3d';
const ROAD_CORRIDOR_LINE_LAYER_ID = 'road-corridor-line';
const ESC_OVERLAY_SOURCE_ID = 'esc-overlay-source';
const ESC_OVERLAY_FILL_LAYER_ID = 'esc-overlay-fill';
const ESC_OVERLAY_LINE_LAYER_ID = 'esc-overlay-line';
const KMZ_POINT_SOURCE_ID = 'infra-linc-kmz-points';
const KMZ_POINT_HALO_LAYER_ID = 'infra-linc-kmz-points-halo';
const KMZ_POINT_LAYER_ID = 'infra-linc-kmz-points-layer';
const KMZ_POINT_SOURCE_LABEL = 'Past 6 months displacement threshold point layer';
const KMZ_PLUNKETT_SOURCE_URLS = [
  './timeseries_burst_asc_path154_run1_int20_past6mo_20251223_to_20260528_lightblue20opacity_lodfixed.kmz',
  '../timeseries_burst_asc_path154_run1_int20_past6mo_20251223_to_20260528_lightblue20opacity_lodfixed.kmz',
  '/timeseries_burst_asc_path154_run1_int20_past6mo_20251223_to_20260528_lightblue20opacity_lodfixed.kmz'
];
const KMZ_HADLEY_LATEST_SOURCE_URLS = [
  './timeseries_burst_desc_312777_run1_int20_jun2025_may2026_lodfixed_v2.kmz',
  '../timeseries_burst_desc_312777_run1_int20_jun2025_may2026_lodfixed_v2.kmz',
  '/timeseries_burst_desc_312777_run1_int20_jun2025_may2026_lodfixed_v2.kmz'
];
const KMZ_DEFAULT_SOURCE_FOREST_ID = 'plunkett';
const KMZ_POINT_SOURCE_URLS_BY_FOREST = {
  plunkett: KMZ_PLUNKETT_SOURCE_URLS,
  hadley: KMZ_HADLEY_LATEST_SOURCE_URLS
};
const KMZ_VELOCITY_LIMITS_CM_YR = [-8, 8];
const KMZ_DEFAULT_REFERENCE_INDEX = 0;
const KMZ_DEFAULT_THRESHOLD_ID = 'bottom25';
const KMZ_THRESHOLD_OPTIONS = [
  { id: 'bottom10', label: 'lowest 10%', quantile: 0.1 },
  { id: 'bottom25', label: 'lowest 25%', quantile: 0.25 },
  { id: 'bottom50', label: 'lowest 50%', quantile: 0.5 },
  { id: 'all', label: 'all points', quantile: null }
];
const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
const TERRAIN_SOURCE_ID = 'mapbox-terrain-dem';
const MAP_3D_PITCH = 62;
const MAP_3D_BEARING = -22;
const MAP_3D_TERRAIN_EXAGGERATION = 1.35;

const BOUNDARY_DATA_SOURCES = {
  roadCorridor: {
    label: 'Road corridor boundary',
    geojson: './data/road_corridor.geojson'
  }
};

const FOREST_LIBRARY = [
  {
    id: 'hadley',
    name: 'Hadley',
    reportAreaHa: '',
    reportRoadKm: '',
    description: 'Primary Hadley estate monitoring area.'
  },
  {
    id: 'plunkett',
    name: 'Plunkett',
    reportAreaHa: '',
    reportRoadKm: '',
    description: 'Primary Plunkett estate monitoring area.'
  }
];

const PERIOD_LIBRARY = [
  {
    id: 'latest',
    label: 'Latest available imagery',
    sortOrder: 10
  }
];

const RASTER_LIBRARY = [
  {
    id: 'hadley-latest-sentinel',
    forestId: 'hadley',
    periodId: 'latest',
    title: 'Hadley Sentinel imagery',
    description: 'Phase 2 reference raster for Hadley. This entry is structured to support future monthly or product variants.',
    rasterUrl: 'https://schroderhill.github.io/Client1/Tiff_Hadley.tif',
    layerGroup: 'Sentinel imagery',
    layerType: 'Optical raster',
    basemapLabel: BASEMAP_LABEL,
    fallbackBounds: null,
    maxDisplacementLabel: 'Awaiting data',
    sourceStatus: 'Reference-ready',
    sourceName: 'GitHub-hosted GeoTIFF',
    reportAreaHa: '',
    reportRoadKm: ''
  },
  {
    id: 'plunkett-latest-sentinel',
    forestId: 'plunkett',
    periodId: 'latest',
    title: 'Plunkett Sentinel imagery',
    description: 'Phase 2 reference raster for Plunkett. The catalog can now support more period-specific entries without UI rewrites.',
    rasterUrl: 'https://schroderhill.github.io/Client1/Tiff_Plunkett.tif',
    layerGroup: 'Sentinel imagery',
    layerType: 'Optical raster',
    basemapLabel: BASEMAP_LABEL,
    fallbackBounds: null,
    maxDisplacementLabel: 'Awaiting data',
    sourceStatus: 'Reference-ready',
    sourceName: 'GitHub-hosted GeoTIFF',
    reportAreaHa: '',
    reportRoadKm: ''
  }
];

const ESC_PLACEHOLDER = {
  all: [1, 1, 100, 1],
  hadley: [1, 1, 100, 1],
  plunkett: [1, 1, 100, 1]
};

let rainfallDebounceId = null;
let mapImageDataUrl = null;
let reportPhotoDataUrl = null;
const dashboardState = {
  filters: {
    periodId: 'all',
    forestId: 'all'
  },
  sentinelEnabled: true,
  escOverlayEnabled: false,
  threeDEnabled: false,
  mapLoaded: false,
  selectionSummary: null,
  corridorBoundary: {
    loaded: false,
    featureCount: 0,
    areaHa: null,
    features: [],
    rawGeojson: null,
    areaByForest: {},
    error: null
  },
  escSummaries: {
    loaded: false,
    sourceStatus: 'placeholder',
    sourceLabel: 'Placeholder',
    sourceVersion: '',
    generatedAt: '',
    classes: ['Low', 'Medium', 'High', 'Very High'],
    scopes: {},
    error: null
  },
  escOverlay: {
    loaded: false,
    error: null
  },
  kmzPoints: {
    loaded: false,
    loading: false,
    sourceUrl: '',
    sourceLabel: KMZ_POINT_SOURCE_LABEL,
    sourceForestId: KMZ_DEFAULT_SOURCE_FOREST_ID,
    featureCount: 0,
    validVelocityCount: 0,
    minVelocityCmYr: null,
    maxVelocityCmYr: null,
    maxAbsVelocityCmYr: null,
    maxNegativeVelocityCmYr: null,
    medianVelocityCmYr: null,
    medianDisplacementCm: null,
    positiveCount: 0,
    negativeCount: 0,
    dates: [],
    referenceIndex: KMZ_DEFAULT_REFERENCE_INDEX,
    cutoffIndex: null,
    thresholdId: KMZ_DEFAULT_THRESHOLD_ID,
    thresholdValueCmYr: null,
    displayFeatureCount: 0,
    visibleFeatureCount: 0,
    visibleMaxAbsVelocityCmYr: null,
    visibleMaxNegativeVelocityCmYr: null,
    hoveredPointId: '',
    selectedPointId: '',
    activeSeriesPointId: '',
    activeSeriesPointMode: '',
    geojson: null,
    statusMessage: '',
    error: null
  },
  rainfall: {
    lastTarget: null,
    requestId: 0,
    locationLabel: 'Awaiting map sample',
    latestValue: '—',
    dataEndDate: '',
    monthlyPeriods: [],
    monthlyLabels: [],
    monthlyValues: [],
    windowed: false,
    max24hrByPeriod: {},
    max24hrValue: null
  }
};

const rasterCache = new Map();
const rasterPromises = new Map();
const kmzPointDetails = new Map();

const monthFilterSelect = document.getElementById('monthFilter');
const forestFilterSelect = document.getElementById('forestFilter');
const kmzReferenceSlider = document.getElementById('kmzReferenceSlider');
const kmzCutoffSlider = document.getElementById('kmzCutoffSlider');
const kmzReferenceDateValue = document.getElementById('kmzReferenceDateValue');
const kmzThresholdSelect = document.getElementById('kmzThresholdSelect');
const sentinelToggleBtn = document.getElementById('sentinelToggleBtn');
const threeDToggleBtn = document.getElementById('threeDToggleBtn');
const escToggleBtn = document.getElementById('escToggleBtn');
const mapStatusEl = document.getElementById('mapStatus');
const datasetCardsEl = document.getElementById('datasetCards');
const datasetSummaryTextEl = document.getElementById('datasetSummaryText');
const rainfallLocationNoteEl = document.getElementById('rainfallLocationNote');
const mapSelectionNoteEl = document.getElementById('mapSelectionNote');
const kmzTimeSeriesNoteEl = document.getElementById('kmzTimeSeriesNote');
const kmzTimeSeriesStatEl = document.getElementById('kmzTimeSeriesStat');
let kmzPointEventsBound = false;

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const map = new mapboxgl.Map({
  container: 'dashboardMap',
  style: BASEMAP_STYLE,
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
  pitch: 0,
  bearing: 0,
  antialias: true,
  projection: 'mercator'
});

const mobileViewportQuery = window.matchMedia('(max-width: 820px)');
const mapContainerEl = document.getElementById('dashboardMap');
const mapShellEl = mapContainerEl?.closest('.map-shell');

function isMobileViewport() {
  return mobileViewportQuery.matches;
}

function getResponsiveMapPadding(padding) {
  if (!isMobileViewport()) {
    return padding;
  }

  if (typeof padding === 'number') {
    return Math.min(padding, 32);
  }

  if (Array.isArray(padding)) {
    return padding.map(value => Math.min(Number(value) || 0, 32));
  }

  if (padding && typeof padding === 'object') {
    return Object.fromEntries(
      Object.entries(padding).map(([key, value]) => [key, Math.min(Number(value) || 0, 32)])
    );
  }

  return padding;
}

function resizeMapForViewport() {
  window.requestAnimationFrame(() => {
    map.resize();
  });
}

window.addEventListener('resize', resizeMapForViewport);
if (typeof mobileViewportQuery.addEventListener === 'function') {
  mobileViewportQuery.addEventListener('change', resizeMapForViewport);
} else if (typeof mobileViewportQuery.addListener === 'function') {
  mobileViewportQuery.addListener(resizeMapForViewport);
}
if ('ResizeObserver' in window && mapShellEl) {
  const mapResizeObserver = new ResizeObserver(resizeMapForViewport);
  mapResizeObserver.observe(mapShellEl);
}

const kmzTimeSeriesCanvasEl = document.getElementById('kmzTimeSeriesChart');
const kmzTimeSeriesDragState = {
  isDragging: false,
  startIndex: null
};

const kmzTimeSeriesChart = new Chart(kmzTimeSeriesCanvasEl.getContext('2d'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Displacement (cm)',
        data: [],
        borderColor: '#b3147f',
        backgroundColor: 'rgba(179, 20, 127, 0.10)',
        pointBackgroundColor: '#b3147f',
        pointBorderColor: '#15191f',
        pointRadius: 3.5,
        pointHoverRadius: 5,
        fill: true,
        tension: 0.42,
        spanGaps: true,
        order: 2
      },
      {
        label: 'Reference date',
        data: [],
        borderColor: 'rgba(255, 255, 255, 0.9)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        pointBackgroundColor: 'rgba(255, 255, 255, 0.9)',
        pointBorderColor: '#15191f',
        pointRadius: 5,
        pointHoverRadius: 5,
        showLine: false,
        order: 1
      },
      {
        label: 'Final date',
        data: [],
        borderColor: '#f4d35e',
        backgroundColor: '#f4d35e',
        pointBackgroundColor: '#f4d35e',
        pointBorderColor: '#15191f',
        pointRadius: 5,
        pointHoverRadius: 5,
        showLine: false,
        order: 1
      },
      {
        label: 'Trend',
        data: [],
        borderColor: 'rgba(179, 20, 127, 0.45)',
        borderWidth: 1.5,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false,
        tension: 0,
        spanGaps: true,
        order: 3
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: {
          color: '#aeb6c2',
          maxRotation: 45,
          minRotation: 30,
          font: { size: 11 }
        }
      },
      y: {
        grid: {
          color: ctx => ctx?.tick?.value === 0
            ? 'rgba(255, 255, 255, 0.22)'
            : 'rgba(255, 255, 255, 0.06)'
        },
        ticks: {
          color: '#aeb6c2',
          font: { size: 11 }
        },
        title: {
          display: true,
          text: 'cm',
          color: '#aeb6c2',
          font: { size: 11 }
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#aeb6c2',
          boxWidth: 12,
          font: { size: 11 },
          filter: item => item.text !== 'Reference date' && item.text !== 'Final date'
        }
      },
      tooltip: {
        callbacks: {
          title: items => items[0]?.label || '',
          label: item => {
            if (item.datasetIndex !== 0) return null;
            const val = item.parsed?.y;
            return val !== null && val !== undefined && Number.isFinite(val)
              ? `${val >= 0 ? '+' : ''}${val.toFixed(2)} cm`
              : null;
          }
        },
        displayColors: false,
        backgroundColor: 'rgba(27, 30, 35, 0.92)',
        titleColor: '#aeb6c2',
        bodyColor: '#f3f5f7',
        borderColor: 'rgba(74, 81, 92, 0.8)',
        borderWidth: 1,
        padding: 8,
        titleFont: { size: 11 },
        bodyFont: { size: 13, weight: '600' }
      }
    }
  },
  plugins: [
    {
      id: 'kmzRefLine',
      afterDraw(chart) {
        const refDataset = chart.data.datasets[1];
        if (!refDataset) return;
        const refIndex = refDataset.data.findIndex(v => v !== null && v !== undefined);
        if (refIndex < 0) return;
        const meta = chart.getDatasetMeta(0);
        const point = meta.data[refIndex];
        if (!point) return;
        if (!chart.chartArea) return;
        const { top, bottom } = chart.chartArea;
        const ctx = chart.ctx;
        if (!ctx) return;
        ctx.save();
        ctx.strokeStyle = 'rgba(220, 100, 100, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(point.x, top);
        ctx.lineTo(point.x, bottom);
        ctx.stroke();
        ctx.restore();
      }
    }
  ]
});

kmzTimeSeriesCanvasEl.addEventListener('mouseenter', () => {
  const sel = dashboardState.kmzPoints.selectedPointId;
  if (sel) {
    updateKmzTimeSeriesChart(sel, { force: true, source: 'locked' });
  }
});

function getKmzTimeSeriesIndexFromMouseEvent(event) {
  if (!kmzTimeSeriesChart?.scales?.x) {
    return null;
  }

  const labels = kmzTimeSeriesChart.data.labels || [];
  if (!labels.length) {
    return null;
  }

  const rect = kmzTimeSeriesCanvasEl.getBoundingClientRect();
  const pixelX = event.clientX - rect.left;
  const rawIndex = Number(kmzTimeSeriesChart.scales.x.getValueForPixel(pixelX));
  const index = Math.round(rawIndex);
  if (!Number.isFinite(index)) {
    return null;
  }
  return Math.max(0, Math.min(labels.length - 1, index));
}

function applyKmzTimeSeriesWindow(startIndex, endIndex) {
  const labels = kmzTimeSeriesChart.data.labels || [];
  if (!labels.length) {
    return;
  }

  const clampedStart = Math.max(0, Math.min(labels.length - 1, startIndex));
  const clampedEnd = Math.max(0, Math.min(labels.length - 1, endIndex));
  if (clampedEnd - clampedStart < 1) {
    return;
  }

  kmzTimeSeriesChart.options.scales.x.min = clampedStart;
  kmzTimeSeriesChart.options.scales.x.max = clampedEnd;
  kmzTimeSeriesChart.update('none');
  applyRainfallChartWindow(labels[clampedStart], labels[clampedEnd]);
}

function resetLinkedChartWindows() {
  const hasKmzWindow = kmzTimeSeriesChart?.options?.scales?.x
    && (kmzTimeSeriesChart.options.scales.x.min !== undefined || kmzTimeSeriesChart.options.scales.x.max !== undefined);
  const hasRainfallWindow = dashboardState.rainfall.windowed;
  if (!hasKmzWindow && !hasRainfallWindow) {
    return;
  }

  if (kmzTimeSeriesChart?.options?.scales?.x) {
    delete kmzTimeSeriesChart.options.scales.x.min;
    delete kmzTimeSeriesChart.options.scales.x.max;
    kmzTimeSeriesChart.update('none');
  }
  resetRainfallChartWindow();
}

kmzTimeSeriesCanvasEl.addEventListener('mousedown', event => {
  if (event.button !== 0) {
    return;
  }
  const startIndex = getKmzTimeSeriesIndexFromMouseEvent(event);
  if (startIndex === null) {
    return;
  }
  kmzTimeSeriesDragState.isDragging = true;
  kmzTimeSeriesDragState.startIndex = startIndex;
});

window.addEventListener('mouseup', event => {
  if (!kmzTimeSeriesDragState.isDragging) {
    return;
  }

  const startIndex = kmzTimeSeriesDragState.startIndex;
  kmzTimeSeriesDragState.isDragging = false;
  kmzTimeSeriesDragState.startIndex = null;

  const endIndex = getKmzTimeSeriesIndexFromMouseEvent(event);
  if (startIndex === null || endIndex === null) {
    return;
  }

  applyKmzTimeSeriesWindow(Math.min(startIndex, endIndex), Math.max(startIndex, endIndex));
});

document.addEventListener('mousedown', event => {
  if (kmzTimeSeriesCanvasEl.contains(event.target)) {
    return;
  }
  resetLinkedChartWindows();
});

const lineChart = new Chart(document.getElementById('lineChart').getContext('2d'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Monthly Rainfall (mm)',
        data: [],
        borderColor: '#49abff',
        backgroundColor: 'rgba(73, 171, 255, 0.12)',
        fill: true,
        tension: 0.3
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: { ticks: { color: '#d3dae3' } },
        y: {
          beginAtZero: true,
          min: 0,
          max: 300,
          ticks: {
            color: '#d3dae3',
            stepSize: 50
          },
          title: {
            display: true,
            text: 'Rainfall (mm)',
            color: '#d3dae3'
          }
      }
    },
    plugins: {
      legend: { labels: { color: '#d3dae3' } }
    }
  }
});

function getForestMeta(forestId) {
  return FOREST_LIBRARY.find(entry => entry.id === forestId) || null;
}

  function getPeriodMeta(periodId) {
    return PERIOD_LIBRARY.find(entry => entry.id === periodId) || null;
  }

  function getRainfallAxisMax(values) {
    const numericValues = values
      .map(value => Number(value))
      .filter(value => Number.isFinite(value));
    const peak = Math.max(0, ...numericValues);
    const paddedPeak = peak * 1.12;
    const comparisonBaseline = 300;
    return Math.ceil(Math.max(comparisonBaseline, paddedPeak) / 50) * 50;
  }

  function hasRainfallChartData() {
    const labels = lineChart.data.labels || [];
    const values = lineChart.data.datasets[0]?.data || [];
    return labels.length > 0 && values.length > 0;
  }

  function clearRainfallChart() {
    lineChart.data.labels = [];
    lineChart.data.datasets[0].data = [];
    lineChart.options.scales.y.max = getRainfallAxisMax([]);
    lineChart.update();
    dashboardState.rainfall.monthlyPeriods = [];
    dashboardState.rainfall.monthlyLabels = [];
    dashboardState.rainfall.monthlyValues = [];
    dashboardState.rainfall.windowed = false;
    dashboardState.rainfall.latestValue = '—';
  }

  function formatApiDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function parseApiDate(dateString) {
    const [year, month, day] = String(dateString).split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  function formatRainfallDataDate(dateString) {
    const date = parseApiDate(dateString);
    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString('en-NZ', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  function getRainfallArchiveEndDate(referenceDate = new Date()) {
    const date = new Date(referenceDate);
    date.setDate(date.getDate() - RAINFALL_ARCHIVE_DELAY_DAYS);
    return date;
  }

function getRainfallPeriodKeyFromDate(dateString) {
  const match = String(dateString || '').match(/^(\d{4}-\d{2})-\d{2}$/);
  return match ? match[1] : null;
}

function applyRainfallChartWindow(startDate, endDate) {
  const startPeriod = getRainfallPeriodKeyFromDate(startDate);
  const endPeriod = getRainfallPeriodKeyFromDate(endDate);
  const periods = dashboardState.rainfall.monthlyPeriods || [];
  const labels = dashboardState.rainfall.monthlyLabels || [];
  const values = dashboardState.rainfall.monthlyValues || [];

  if (!startPeriod || !endPeriod || !periods.length || !labels.length || !values.length) {
    return;
  }

  const rangeStart = startPeriod <= endPeriod ? startPeriod : endPeriod;
  const rangeEnd = startPeriod <= endPeriod ? endPeriod : startPeriod;
  const windowLabels = [];
  const windowValues = [];

  periods.forEach((period, index) => {
    if (period >= rangeStart && period <= rangeEnd) {
      windowLabels.push(labels[index]);
      windowValues.push(values[index]);
    }
  });

  if (!windowLabels.length || !windowValues.length) {
    return;
  }

  lineChart.data.labels = windowLabels;
  lineChart.data.datasets[0].data = windowValues;
  lineChart.options.scales.y.max = getRainfallAxisMax(windowValues);
  lineChart.update('none');
  dashboardState.rainfall.windowed = true;
}

function resetRainfallChartWindow() {
  const labels = dashboardState.rainfall.monthlyLabels || [];
  const values = dashboardState.rainfall.monthlyValues || [];

  if (!labels.length || !values.length) {
    dashboardState.rainfall.windowed = false;
    return;
  }

  lineChart.data.labels = [...labels];
  lineChart.data.datasets[0].data = [...values];
  lineChart.options.scales.y.max = getRainfallAxisMax(values);
  lineChart.update('none');
  dashboardState.rainfall.windowed = false;
}

function getForestLabel(forestId) {
  return getForestMeta(forestId)?.name || forestId;
}

function getPeriodLabel(periodId) {
  return getPeriodMeta(periodId)?.label || periodId;
}







function getRasterLoadStatus(cacheEntry) {
  if (cacheEntry?.error) {
    return { label: 'Failed to load', className: 'status-error' };
  }
  if (cacheEntry?.loaded) {
    return { label: 'Loaded', className: 'status-loaded' };
  }
  return { label: 'Pending load', className: 'status-pending' };
}

function getOverlayStateLabel(activeEntries) {
  if (!activeEntries.length) {
    return dashboardState.threeDEnabled ? '3D terrain active' : 'No raster selected';
  }

  const labels = [
    dashboardState.sentinelEnabled ? 'Sentinel visible' : 'Sentinel ready on toggle'
  ];

  if (dashboardState.threeDEnabled) {
    labels.push('3D terrain active');
  }

  if (dashboardState.escOverlayEnabled) {
    labels.push('ESC visible');
  }

  return labels.join(' / ');
}

function buildSelectionSummary(activeEntries) {
  const forestLabel = dashboardState.filters.forestId === 'all'
    ? 'All forests'
    : getForestLabel(dashboardState.filters.forestId);
  const periodLabel = dashboardState.filters.periodId === 'all'
    ? 'All periods'
    : getPeriodLabel(dashboardState.filters.periodId);
  const uniqueForestIds = Array.from(new Set(activeEntries.map(entry => entry.forestId)));
  const forestMeta = uniqueForestIds.length === 1 ? getForestMeta(uniqueForestIds[0]) : null;
  const layerGroups = Array.from(new Set(activeEntries.map(entry => entry.layerGroup).filter(Boolean)));
  const layerTypes = Array.from(new Set(activeEntries.map(entry => entry.layerType).filter(Boolean)));
  const sourceNames = Array.from(new Set(activeEntries.map(entry => entry.sourceName).filter(Boolean)));

  const corridorAreaHa = dashboardState.corridorBoundary.areaHa;
  const mappedForestAreaHa = dashboardState.filters.forestId !== 'all'
    ? dashboardState.corridorBoundary.areaByForest?.[dashboardState.filters.forestId]
    : null;
  const monitoredAreaHa = activeEntries.length === 1
    ? (activeEntries[0].reportAreaHa || forestMeta?.reportAreaHa || mappedForestAreaHa || '')
    : (forestMeta?.reportAreaHa || corridorAreaHa || '');

  let loadedCount = 0;
  let failedCount = 0;
  activeEntries.forEach(entry => {
    const cacheEntry = rasterCache.get(entry.id);
    if (cacheEntry?.error) {
      failedCount += 1;
    } else if (cacheEntry?.loaded) {
      loadedCount += 1;
    }
  });
  const pendingCount = Math.max(0, activeEntries.length - loadedCount - failedCount);
  const basemapLabel = activeEntries[0]?.basemapLabel || BASEMAP_LABEL;
  const selectionScope = activeEntries.length === 1
    ? activeEntries[0].title
    : `${forestLabel} / ${periodLabel}`;

  return {
    forestLabel,
    periodLabel,
    activeRasterCount: activeEntries.length,
    monitoredAreaHa,
    maxDisplacement: getMaxDisplacementLabel(activeEntries),
    basemapLabel,
    overlayLabel: getOverlayStateLabel(activeEntries),
    layerSummary: activeEntries.length
      ? `${activeEntries.length} selected${layerGroups.length ? ` / ${layerGroups.join(', ')}` : ''}`
      : '0 selected',
    selectionScope,
    rainfallLabel: dashboardState.rainfall.locationLabel,
    rainfallValue: getRainfallValueForPeriod(dashboardState.filters.periodId),
    max24hrValue: getMax24hrValueForPeriod(dashboardState.filters.periodId),
    sourceSummary: sourceNames.join(', ') || 'Awaiting raster source',
    reportAreaHa: monitoredAreaHa,
    reportRoadKm: activeEntries.length === 1
      ? (activeEntries[0].reportRoadKm || forestMeta?.reportRoadKm || '')
      : (forestMeta?.reportRoadKm || ''),
    loadedCount,
    pendingCount,
    failedCount,
    layerGroups,
    layerTypes,
    sourceNames
  };
}

monthFilterSelect.addEventListener('change', async (event) => {
  dashboardState.filters.periodId = event.target.value || 'all';
  await applyFilters({ fitView: false });
});

forestFilterSelect.addEventListener('change', async (event) => {
  const newForest = event.target.value || 'all';
  dashboardState.filters.forestId = newForest;
  await applyFilters({ fitView: false });
  // Update data layers without competing fly-to; fly explicitly to the selected forest
  if (newForest !== 'all') {
    fitMapToForest(newForest);
  }
});

if (kmzReferenceSlider) {
  kmzReferenceSlider.addEventListener('input', event => {
    updateKmzReferenceIndex(event.target.value);
  });
}

if (kmzCutoffSlider) {
  kmzCutoffSlider.addEventListener('input', event => {
    updateKmzCutoffIndex(event.target.value);
  });
}

if (kmzThresholdSelect) {
  kmzThresholdSelect.addEventListener('change', event => {
    dashboardState.kmzPoints.thresholdId = event.target.value || KMZ_DEFAULT_THRESHOLD_ID;
    refreshKmzThresholding({ updateStatus: true });
  });
}

sentinelToggleBtn.addEventListener('click', async () => {
  dashboardState.sentinelEnabled = !dashboardState.sentinelEnabled;
  updateSentinelButton();
  await renderRasterSelection({ fitView: false });
});

if (threeDToggleBtn) {
  threeDToggleBtn.addEventListener('click', () => {
    setThreeDMode(!dashboardState.threeDEnabled, { animate: true });
    refreshMapStatusMessage();
  });
}


map.on('load', async () => {
  dashboardState.mapLoaded = true;
  resizeMapForViewport();
  initializeThreeDMapStyle();
  // Always-on 3D terrain — applied after initializeThreeDMapStyle so it is never overridden by the toggle default
  try {
    if (!map.getSource('mapbox-dem')) {
      map.addSource('mapbox-dem', { type: 'raster-dem', url: 'mapbox://mapbox.mapbox-terrain-dem-v1', tileSize: 512, maxzoom: 14 });
    }
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.1 });
  } catch (e) { console.warn('3D terrain init failed', e); }
  populateFilterOptions();
  updateSentinelButton();
  updateThreeDToggleButton();
  setMapStatus('Loading raster library, corridor boundary, and displacement threshold point layer...');
  await loadRoadCorridorBoundary();
  await applyFilters({ fitView: false });
  if (isMobileViewport()) {
    fitMapToForest(getInitialMobileForestId());
  }
  resizeMapForViewport();
});

map.on('moveend', () => {
  if (!dashboardState.mapLoaded) {
    return;
  }
  scheduleRainfallRefresh();
});

function initializeThreeDMapStyle() {
  try {
    if (!map.getSource(TERRAIN_SOURCE_ID)) {
      map.addSource(TERRAIN_SOURCE_ID, {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      });
    }
  } catch (error) {
    console.warn('Unable to initialize terrain source', error);
  }

  updateTerrainForThreeDMode();
  updateThreeDLayerVisibility();
}

function setThreeDMode(isEnabled, { animate = false } = {}) {
  dashboardState.threeDEnabled = Boolean(isEnabled);
  updateThreeDToggleButton();

  if (dashboardState.mapLoaded) {
    updateTerrainForThreeDMode();
    updateThreeDLayerVisibility();

    const cameraOptions = withMapCameraMode({
      duration: animate ? 750 : 0
    });

    if (animate) {
      map.easeTo(cameraOptions);
    } else {
      map.jumpTo(withMapCameraMode());
    }
  }

  const selectionSummary = buildSelectionSummary(getActiveEntries());
  dashboardState.selectionSummary = selectionSummary;
  updateStatCards(selectionSummary);
}

function updateTerrainForThreeDMode() {
  if (!dashboardState.mapLoaded || typeof map.setTerrain !== 'function') {
    return;
  }

  try {
    map.setTerrain(dashboardState.threeDEnabled && map.getSource(TERRAIN_SOURCE_ID)
      ? { source: TERRAIN_SOURCE_ID, exaggeration: MAP_3D_TERRAIN_EXAGGERATION }
      : null);
  } catch (error) {
    console.warn('Unable to update terrain mode', error);
  }

  updateMapAtmosphere();
}

function updateMapAtmosphere() {
  if (typeof map.setFog !== 'function') {
    return;
  }

  map.setFog(dashboardState.threeDEnabled
    ? {
      color: 'rgb(18, 21, 25)',
      'high-color': 'rgb(62, 82, 92)',
      'horizon-blend': 0.16,
      'space-color': 'rgb(7, 10, 14)',
      'star-intensity': 0.08
    }
    : {
      color: 'rgb(18, 21, 25)',
      'high-color': 'rgb(34, 43, 50)',
      'horizon-blend': 0.04,
      'space-color': 'rgb(7, 10, 14)',
      'star-intensity': 0
    });
}

function updateThreeDLayerVisibility() {
  if (!dashboardState.mapLoaded) {
    return;
  }

  const visibility = dashboardState.threeDEnabled ? 'visible' : 'none';
  [ROAD_CORRIDOR_3D_LAYER_ID].forEach(layerId => {
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', visibility);
    }
  });
}

function withMapCameraMode(options = {}) {
  const cameraOptions = { ...options };
  if (Object.prototype.hasOwnProperty.call(cameraOptions, 'padding')) {
    cameraOptions.padding = getResponsiveMapPadding(cameraOptions.padding);
  }

  return {
    ...cameraOptions,
    pitch: dashboardState.threeDEnabled ? MAP_3D_PITCH : 0,
    bearing: dashboardState.threeDEnabled ? MAP_3D_BEARING : 0
  };
}

function populateFilterOptions() {
  const selectedPeriodId = dashboardState.filters.periodId || 'all';
  const selectedForestId = dashboardState.filters.forestId || 'all';
  const periodIds = new Set(RASTER_LIBRARY.map(entry => entry.periodId));
  const periods = PERIOD_LIBRARY
    .filter(entry => periodIds.has(entry.id))
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const forests = [...FOREST_LIBRARY].sort((a, b) => a.name.localeCompare(b.name));

  monthFilterSelect.innerHTML = '<option value="all">All periods</option>';
  periods.forEach(period => {
    const option = document.createElement('option');
    option.value = period.id;
    option.textContent = period.label;
    monthFilterSelect.appendChild(option);
  });

  forestFilterSelect.innerHTML = '<option value="all">All forests</option>';
  forests.forEach(forest => {
    const option = document.createElement('option');
    option.value = forest.id;
    option.textContent = forest.name;
    forestFilterSelect.appendChild(option);
  });

  monthFilterSelect.value = Array.from(monthFilterSelect.options).some(option => option.value === selectedPeriodId)
    ? selectedPeriodId
    : 'all';
  forestFilterSelect.value = Array.from(forestFilterSelect.options).some(option => option.value === selectedForestId)
    ? selectedForestId
    : 'all';
}

function getActiveEntries() {
  return RASTER_LIBRARY.filter(entry => {
    const selectedPeriodId = dashboardState.filters.periodId || 'all';
    const periodMatch = selectedPeriodId === 'all' || entry.periodId === selectedPeriodId;
    const forestMatch = dashboardState.filters.forestId === 'all' || entry.forestId === dashboardState.filters.forestId;
    return periodMatch && forestMatch;
  });
}






















function getLocalFetchUrl(url) {
  if (/^(https?:)?\/\//i.test(url) || url.startsWith('./') || url.startsWith('/')) {
    return url;
  }
  return `./${url.replace(/^\/+/, '')}`;
}



















async function loadKmzPointLayer({ fitView = true } = {}) {
  if (!dashboardState.mapLoaded) {
    return;
  }
  if (!window.JSZip) {
    const error = new Error('JSZip is unavailable, so the displacement threshold point layer cannot be parsed.');
    dashboardState.kmzPoints.error = error;
    setKmzPointStatus(error.message, true);
    return;
  }

  dashboardState.kmzPoints.loading = true;
  dashboardState.kmzPoints.error = null;
  const previousSourceForestId = normalizeScopeKey(dashboardState.kmzPoints.sourceForestId || '');
  const sourceForestId = getKmzSourceForestIdForSelection(dashboardState.filters.forestId);
  const requestedSourceForestId = normalizeScopeKey(sourceForestId);
  const resetRangeForNewSource = !dashboardState.kmzPoints.loaded || previousSourceForestId !== requestedSourceForestId;
  if (resetRangeForNewSource) {
    // New source loads should default to the full available date range.
    dashboardState.kmzPoints.referenceIndex = KMZ_DEFAULT_REFERENCE_INDEX;
    dashboardState.kmzPoints.cutoffIndex = null;
  }
  dashboardState.kmzPoints.sourceForestId = sourceForestId;
  updateKmzReferenceControls();
  updateKmzThresholdControls();
  setKmzTimeSeriesPlaceholder(`Loading ${dashboardState.kmzPoints.sourceLabel} time series...`);
  setKmzPointStatus(`Loading ${dashboardState.kmzPoints.sourceLabel}...`);

  try {
    const { arrayBuffer, url, forestId } = await fetchFirstAvailableKmz(sourceForestId);
    const zip = await JSZip.loadAsync(arrayBuffer);
    const geojson = await buildKmzPointGeoJson(zip);
    const features = Array.isArray(geojson.features) ? geojson.features : [];

    if (!features.length) {
      throw new Error('No usable point time series were found in the displacement threshold source.');
    }

    const dates = geojson.properties?.dates || [];
    const initialReferenceIndex = resetRangeForNewSource
      ? KMZ_DEFAULT_REFERENCE_INDEX
      : dashboardState.kmzPoints.referenceIndex;
    const initialCutoffIndex = resetRangeForNewSource
      ? null
      : dashboardState.kmzPoints.cutoffIndex;

    const referenceIndex = coerceKmzReferenceIndex(initialReferenceIndex, dates);
    dashboardState.kmzPoints.referenceIndex = referenceIndex;
    const cutoffIndex = coerceKmzCutoffIndex(initialCutoffIndex, dates);
    dashboardState.kmzPoints.cutoffIndex = cutoffIndex;
    const metrics = refreshKmzPointCalculations(geojson, referenceIndex, cutoffIndex);
    addOrUpdateKmzPointLayer(geojson);

    dashboardState.kmzPoints.loaded = true;
    dashboardState.kmzPoints.loading = false;
    dashboardState.kmzPoints.sourceUrl = url;
    dashboardState.kmzPoints.sourceForestId = forestId;
    dashboardState.kmzPoints.geojson = geojson;
    dashboardState.kmzPoints.featureCount = features.length;
    dashboardState.kmzPoints.dates = dates;
    dashboardState.kmzPoints.error = null;
    applyKmzPointMetrics(metrics);
    updateKmzReferenceControls();
    refreshKmzThresholding();

    if (fitView) {
      fitMapToKmzPoints(geojson);
    }

    setKmzTimeSeriesPlaceholder(`${features.length.toLocaleString()} displacement threshold points loaded. Hover over a point to inspect its time series.`);
    setKmzPointStatus(buildKmzPointStatusMessage(metrics));
    const selectionSummary = buildSelectionSummary(getActiveEntries());
    dashboardState.selectionSummary = selectionSummary;
    updateStatCards(selectionSummary);
  } catch (error) {
    console.error('Failed to load displacement threshold point layer', error);
    dashboardState.kmzPoints.loaded = false;
    dashboardState.kmzPoints.loading = false;
    dashboardState.kmzPoints.error = error;
    updateKmzReferenceControls();
    updateKmzThresholdControls();
    setKmzTimeSeriesPlaceholder('Displacement threshold point time series unavailable. Check the source path and browser console.');
    setKmzPointStatus(`${error.message || 'Displacement threshold point layer failed to load'} Check the source path and browser console.`, true);
    const selectionSummary = buildSelectionSummary(getActiveEntries());
    dashboardState.selectionSummary = selectionSummary;
    updateStatCards(selectionSummary);
  }
}

function getKmzSourceForestIdForSelection(selectedForestId = dashboardState.filters.forestId) {
  const normalizedForestId = normalizeScopeKey(selectedForestId);
  if (normalizedForestId !== 'all' && KMZ_POINT_SOURCE_URLS_BY_FOREST[normalizedForestId]) {
    return normalizedForestId;
  }

  if (KMZ_POINT_SOURCE_URLS_BY_FOREST[KMZ_DEFAULT_SOURCE_FOREST_ID]) {
    return KMZ_DEFAULT_SOURCE_FOREST_ID;
  }

  return Object.keys(KMZ_POINT_SOURCE_URLS_BY_FOREST)[0] || 'all';
}

function getKmzSourceUrlsForForest(forestId) {
  const normalizedForestId = normalizeScopeKey(forestId);
  if (KMZ_POINT_SOURCE_URLS_BY_FOREST[normalizedForestId]) {
    return {
      forestId: normalizedForestId,
      urls: KMZ_POINT_SOURCE_URLS_BY_FOREST[normalizedForestId]
    };
  }

  const fallbackForestId = getKmzSourceForestIdForSelection(forestId);
  return {
    forestId: fallbackForestId,
    urls: KMZ_POINT_SOURCE_URLS_BY_FOREST[fallbackForestId] || []
  };
}

async function fetchFirstAvailableKmz(forestId = dashboardState.kmzPoints.sourceForestId) {
  const { forestId: resolvedForestId, urls } = getKmzSourceUrlsForForest(forestId);
  if (!urls.length) {
    const forestLabel = resolvedForestId === 'all'
      ? 'the selected forest'
      : getForestLabel(resolvedForestId);
    throw new Error(`No displacement threshold source is configured for ${forestLabel}.`);
  }

  const attempts = [];
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        attempts.push(`${url} (${response.status})`);
        continue;
      }
      return {
        forestId: resolvedForestId,
        url,
        arrayBuffer: await response.arrayBuffer()
      };
    } catch (error) {
      attempts.push(`${url} (${error.message || 'request failed'})`);
    }
  }

  throw new Error(`Unable to fetch displacement threshold source for ${getForestLabel(resolvedForestId)} from: ${attempts.join(', ')}`);
}

async function buildKmzPointGeoJson(zip) {
  const entryNames = Object.keys(zip.files)
    .filter(name => /kml_data\/1by1\/region_\d+\.kml$/i.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const fallbackKmlNames = Object.keys(zip.files)
    .filter(name => name.toLowerCase().endsWith('.kml'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const kmlNames = entryNames.length ? entryNames : fallbackKmlNames;
  if (!kmlNames.length) {
    throw new Error('The displacement threshold archive does not contain any KML files.');
  }

  kmzPointDetails.clear();
  const features = [];
  let commonDates = [];

  for (const name of kmlNames) {
    const text = await zip.files[name].async('string');
    const parsed = parseKmzRegionKmlText(text, name);
    if (!commonDates.length && parsed.dates.length) {
      commonDates = parsed.dates;
    }
    parsed.features.forEach(feature => features.push(feature));
  }

  return {
    type: 'FeatureCollection',
    properties: {
      sourceLabel: KMZ_POINT_SOURCE_LABEL,
      dates: commonDates
    },
    features
  };
}

function parseKmzRegionKmlText(kmlText, sourceRegion) {
  const xml = new DOMParser().parseFromString(kmlText, 'application/xml');
  if (xml.querySelector('parsererror')) {
    return { dates: [], features: [] };
  }

  const placemarks = Array.from(xml.getElementsByTagName('Placemark'));
  const features = [];
  let layerDates = [];

  placemarks.forEach(placemark => {
    const description = placemark.getElementsByTagName('description')[0]?.textContent || '';
    const coordinatesText = placemark.getElementsByTagName('coordinates')[0]?.textContent || '';
    const coordinateParts = coordinatesText.trim().split(',');
    if (coordinateParts.length < 2) {
      return;
    }

    const lon = Number(coordinateParts[0]);
    const lat = Number(coordinateParts[1]);
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
      return;
    }

    const series = parseKmzDateSeriesFromDescription(description);
    if (!series.dates.length || !series.values.length) {
      return;
    }

    if (!layerDates.length) {
      layerDates = series.dates;
    }

    const row = extractKmzNumber(description, /Row:\s*([0-9]+)/i, -1);
    const column = extractKmzNumber(description, /Column:\s*([0-9]+)/i, -1);
    const temporalCoherence = extractKmzNumber(description, /Temporal\s+coherence:\s*([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)/i, NaN);
    const referenceIndex = coerceKmzReferenceIndex(dashboardState.kmzPoints.referenceIndex, series.dates);
    const velocityCmYr = computeKmzVelocity(series.values, series.dates, referenceIndex);
    const displacementCm = computeKmzFinalDisplacement(series.values, referenceIndex);
    const sourceKey = String(sourceRegion || 'region').replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'region';
    const pointId = `kmz-point-${sourceKey}-${features.length}-${Math.abs(Math.round(lon * 1e6))}-${Math.abs(Math.round(lat * 1e6))}`;

    kmzPointDetails.set(pointId, {
      dates: series.dates,
      values: series.values,
      sourceRegion
    });

    const properties = {
      point_id: pointId,
      row,
      column,
      longitude: Number(lon.toFixed(8)),
      latitude: Number(lat.toFixed(8)),
      temporal_coherence: Number.isFinite(temporalCoherence) ? Number(temporalCoherence.toFixed(4)) : null,
      displacement_cm: Number.isFinite(displacementCm) ? Number(displacementCm.toFixed(4)) : null,
      date_start: series.dates[referenceIndex] || series.dates[0] || '',
      date_end: series.dates[series.dates.length - 1] || '',
      source_region: sourceRegion
    };

    if (Number.isFinite(velocityCmYr)) {
      properties.velocity_cm_yr = Number(velocityCmYr.toFixed(4));
    }

    features.push({
      type: 'Feature',
      id: pointId,
      geometry: {
        type: 'Point',
        coordinates: [Number(lon.toFixed(8)), Number(lat.toFixed(8))]
      },
      properties
    });
  });

  return { dates: layerDates, features };
}

function parseKmzDateSeriesFromDescription(description) {
  const dates = [];
  const values = [];
  const pattern = /(\d{4}-\d{2}-\d{2})\s*,\s*([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)/g;
  let match;
  while ((match = pattern.exec(description)) !== null) {
    const date = match[1];
    const value = Number(match[2]);
    if (date && Number.isFinite(value)) {
      dates.push(date);
      values.push(value);
    }
  }
  return { dates, values };
}

function extractKmzNumber(text, pattern, fallback = NaN) {
  const match = String(text || '').match(pattern);
  if (!match) {
    return fallback;
  }
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : fallback;
}

function computeKmzVelocity(series, dates, startIndex, endIndex) {
  const y0 = Number(series?.[startIndex]);
  if (!Array.isArray(series) || !Array.isArray(dates) || !Number.isFinite(y0)) {
    return NaN;
  }

  const startMs = parseKmzDateMs(dates[startIndex]);
  if (!Number.isFinite(startMs)) {
    return NaN;
  }

  const loopEnd = (endIndex !== undefined) ? Math.min(endIndex + 1, series.length, dates.length) : Math.min(series.length, dates.length);
  const xs = [];
  const ys = [];
  for (let index = startIndex; index < loopEnd; index += 1) {
    const value = Number(series[index]);
    const dateMs = parseKmzDateMs(dates[index]);
    if (!Number.isFinite(value) || !Number.isFinite(dateMs)) {
      continue;
    }
    xs.push((dateMs - startMs) / MS_PER_YEAR);
    ys.push(value - y0);
  }

  if (xs.length < 2 || xs[xs.length - 1] === 0) {
    return NaN;
  }

  const meanX = xs.reduce((sum, value) => sum + value, 0) / xs.length;
  const meanY = ys.reduce((sum, value) => sum + value, 0) / ys.length;
  let numerator = 0;
  let denominator = 0;
  for (let index = 0; index < xs.length; index += 1) {
    const dx = xs[index] - meanX;
    numerator += dx * (ys[index] - meanY);
    denominator += dx * dx;
  }
  return denominator === 0 ? NaN : numerator / denominator;
}

function computeKmzFinalDisplacement(series, startIndex, endIndex) {
  if (!Array.isArray(series) || series.length <= startIndex) {
    return NaN;
  }
  const startValue = Number(series[startIndex]);
  const effectiveEnd = (endIndex !== undefined && endIndex < series.length) ? endIndex : series.length - 1;
  const endValue = Number(series[effectiveEnd]);
  return Number.isFinite(startValue) && Number.isFinite(endValue) ? endValue - startValue : NaN;
}

function parseKmzDateMs(date) {
  const value = Date.parse(`${date}T00:00:00Z`);
  return Number.isFinite(value) ? value : NaN;
}

// Ray-casting point-in-polygon (handles Polygon and MultiPolygon, respects holes).
function raycastInRing(px, py, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    const intersect = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function pointInPolygonGeom(lng, lat, geometry) {
  if (!geometry?.type || !geometry?.coordinates) return false;
  const type = geometry.type;

  if (type === 'Polygon') {
    const rings = geometry.coordinates;
    if (!raycastInRing(lng, lat, rings[0])) return false;
    for (let h = 1; h < rings.length; h++) {
      if (raycastInRing(lng, lat, rings[h])) return false;
    }
    return true;
  }

  if (type === 'MultiPolygon') {
    return geometry.coordinates.some(poly => {
      if (!raycastInRing(lng, lat, poly[0])) return false;
      for (let h = 1; h < poly.length; h++) {
        if (raycastInRing(lng, lat, poly[h])) return false;
      }
      return true;
    });
  }

  return false;
}

function filterKmzByCorridor(geojson) {
  const corridorFeatures = dashboardState.corridorBoundary.rawGeojson?.features;
  if (!Array.isArray(corridorFeatures) || !corridorFeatures.length) {
    return geojson;
  }
  const filtered = (geojson.features || []).filter(feature => {
    const coords = feature?.geometry?.coordinates;
    if (!coords) return false;
    const lng = coords[0];
    const lat = coords[1];
    return corridorFeatures.some(cf => pointInPolygonGeom(lng, lat, cf.geometry));
  });
  return { ...geojson, features: filtered };
}

function getKmzDisplayGeoJson(geojson = dashboardState.kmzPoints.geojson) {
  if (!geojson) {
    return { type: 'FeatureCollection', features: [] };
  }

  const corridorFilteredGeojson = filterKmzByCorridor(geojson);
  const selectedForestId = normalizeScopeKey(dashboardState.filters.forestId);
  const sourceForestId = normalizeScopeKey(dashboardState.kmzPoints.sourceForestId || 'all');

  if (selectedForestId === 'all' || sourceForestId === 'all' || selectedForestId === sourceForestId) {
    return corridorFilteredGeojson;
  }

  return {
    ...corridorFilteredGeojson,
    features: []
  };
}

function updateKmzPointSourceData(geojson = dashboardState.kmzPoints.geojson) {
  const displayGeojson = getKmzDisplayGeoJson(geojson);
  const source = map.getSource(KMZ_POINT_SOURCE_ID);
  if (source?.setData) {
    source.setData(displayGeojson);
  }
  refreshKmzThresholding({ displayGeojson });
  return displayGeojson;
}

function refreshKmzThresholding({ displayGeojson = null, updateStatus = false } = {}) {
  updateKmzThresholdControls();
  const displayFeatures = (displayGeojson || getKmzDisplayGeoJson()).features || [];
  const option = getKmzThresholdOption();
  const velocities = displayFeatures
    .map(feature => Number(feature?.properties?.velocity_cm_yr))
    .filter(value => Number.isFinite(value))
    .sort((a, b) => a - b);

  dashboardState.kmzPoints.displayFeatureCount = displayFeatures.length;

  if (!displayFeatures.length) {
    dashboardState.kmzPoints.thresholdValueCmYr = null;
    dashboardState.kmzPoints.visibleFeatureCount = 0;
    dashboardState.kmzPoints.visibleMaxAbsVelocityCmYr = null;
    dashboardState.kmzPoints.visibleMaxNegativeVelocityCmYr = null;
    applyKmzThresholdFilter();
  } else if (option.id === 'all') {
    const displayMetrics = getKmzPointMetrics(displayFeatures);
    dashboardState.kmzPoints.thresholdValueCmYr = null;
    dashboardState.kmzPoints.visibleFeatureCount = displayFeatures.length;
    dashboardState.kmzPoints.visibleMaxAbsVelocityCmYr = displayMetrics.maxAbsVelocityCmYr;
    dashboardState.kmzPoints.visibleMaxNegativeVelocityCmYr = displayMetrics.maxNegativeVelocityCmYr;
    applyKmzThresholdFilter();
  } else {
    const thresholdValue = velocities.length ? quantileSorted(velocities, option.quantile) : null;
    dashboardState.kmzPoints.thresholdValueCmYr = Number.isFinite(thresholdValue) ? thresholdValue : null;
    const visibleFeatures = displayFeatures.filter(feature => kmzFeaturePassesCurrentThreshold(feature));
    const visibleMetrics = getKmzPointMetrics(visibleFeatures);
    dashboardState.kmzPoints.visibleFeatureCount = visibleFeatures.length;
    dashboardState.kmzPoints.visibleMaxAbsVelocityCmYr = visibleMetrics.maxAbsVelocityCmYr;
    dashboardState.kmzPoints.visibleMaxNegativeVelocityCmYr = visibleMetrics.maxNegativeVelocityCmYr;
    applyKmzThresholdFilter();
  }

  reconcileKmzTimeSeriesSelectionWithThreshold();

  if (updateStatus && dashboardState.kmzPoints.loaded) {
    setKmzPointStatus(buildKmzPointStatusMessage());
    const selectionSummary = buildSelectionSummary(getActiveEntries());
    dashboardState.selectionSummary = selectionSummary;
    updateStatCards(selectionSummary);
    refreshMapStatusMessage();
  }
}

function updateKmzThresholdControls() {
  if (!kmzThresholdSelect) {
    return;
  }
  const selectedOption = getKmzThresholdOption();
  dashboardState.kmzPoints.thresholdId = selectedOption.id;
  kmzThresholdSelect.value = selectedOption.id;
  kmzThresholdSelect.disabled = !dashboardState.kmzPoints.loaded || dashboardState.kmzPoints.loading;
}

function getKmzThresholdOption(thresholdId = dashboardState.kmzPoints.thresholdId) {
  return KMZ_THRESHOLD_OPTIONS.find(option => option.id === thresholdId)
    || KMZ_THRESHOLD_OPTIONS.find(option => option.id === KMZ_DEFAULT_THRESHOLD_ID)
    || KMZ_THRESHOLD_OPTIONS[0];
}

function getKmzThresholdFilterExpression() {
  const option = getKmzThresholdOption();
  const thresholdValue = dashboardState.kmzPoints.thresholdValueCmYr;
  if (option.id === 'all') {
    return null;
  }
  if (!Number.isFinite(thresholdValue)) {
    return ['==', ['get', 'point_id'], '__no_threshold_match__'];
  }
  return [
    'all',
    ['has', 'velocity_cm_yr'],
    ['<=', ['to-number', ['get', 'velocity_cm_yr'], 999999], thresholdValue]
  ];
}

function applyKmzThresholdFilter() {
  const filterExpression = getKmzThresholdFilterExpression();
  [KMZ_POINT_HALO_LAYER_ID, KMZ_POINT_LAYER_ID].forEach(layerId => {
    if (map.getLayer(layerId)) {
      map.setFilter(layerId, filterExpression);
    }
  });

  const activePointId = dashboardState.kmzPoints.activeSeriesPointId
    || dashboardState.kmzPoints.selectedPointId
    || dashboardState.kmzPoints.hoveredPointId;
  updateKmzPointFocusDisplay(activePointId, dashboardState.kmzPoints.activeSeriesPointMode);
}

function updateKmzPointFocusDisplay(pointId = '', mode = '') {
  const normalizedPointId = pointId ? String(pointId) : '';
  const resolvedMode = normalizedPointId
    ? (mode || (dashboardState.kmzPoints.selectedPointId === normalizedPointId ? 'locked' : 'hover'))
    : '';

  dashboardState.kmzPoints.activeSeriesPointId = normalizedPointId;
  dashboardState.kmzPoints.activeSeriesPointMode = resolvedMode;
}

function kmzFeaturePassesCurrentThreshold(featureOrProperties) {
  const option = getKmzThresholdOption();
  if (option.id === 'all') {
    return true;
  }
  const properties = featureOrProperties?.properties || featureOrProperties || {};
  const velocity = Number(properties.velocity_cm_yr);
  const thresholdValue = dashboardState.kmzPoints.thresholdValueCmYr;
  return Number.isFinite(velocity) && Number.isFinite(thresholdValue) && velocity <= thresholdValue;
}

function reconcileKmzTimeSeriesSelectionWithThreshold() {
  const selectedPointId = dashboardState.kmzPoints.selectedPointId;
  if (!selectedPointId) {
    return;
  }
  const properties = getKmzFeatureProperties(selectedPointId);
  if (properties && kmzFeaturePassesCurrentThreshold(properties)) {
    return;
  }
  setKmzTimeSeriesPlaceholder('Selected point is hidden by the current threshold. Hover over a visible displacement threshold point to inspect its time series.');
}

function buildKmzThresholdStatusText() {
  const option = getKmzThresholdOption();
  const displayCount = dashboardState.kmzPoints.displayFeatureCount || 0;
  const visibleCount = dashboardState.kmzPoints.visibleFeatureCount || 0;
  if (!displayCount) {
    return '';
  }
  if (option.id === 'all') {
    return ` Showing all ${displayCount.toLocaleString()} map points.`;
  }
  const thresholdLabel = Number.isFinite(dashboardState.kmzPoints.thresholdValueCmYr)
    ? ` at or below ${formatVelocityCmYr(dashboardState.kmzPoints.thresholdValueCmYr)}`
    : '';
  return ` Showing ${visibleCount.toLocaleString()} of ${displayCount.toLocaleString()} map points (${option.label}${thresholdLabel}).`;
}

function addOrUpdateKmzPointLayer(geojson) {
  const displayGeojson = getKmzDisplayGeoJson(geojson);
  const existingSource = map.getSource(KMZ_POINT_SOURCE_ID);
  if (existingSource?.setData) {
    existingSource.setData(displayGeojson);
  } else {
    map.addSource(KMZ_POINT_SOURCE_ID, {
      type: 'geojson',
      data: displayGeojson
    });
  }

  const velocityExpression = ['to-number', ['get', 'velocity_cm_yr'], 0];
  const velocityColorExpression = [
    'case',
    ['has', 'velocity_cm_yr'],
    [
      'interpolate',
      ['linear'],
      velocityExpression,
      KMZ_VELOCITY_LIMITS_CM_YR[0], '#800000',
      -5, '#ff0000',
      -2, '#ffff00',
      2, '#00ffff',
      5, '#0000ff',
      KMZ_VELOCITY_LIMITS_CM_YR[1], '#000080'
    ],
    '#69c7ff'
  ];

  if (!map.getLayer(KMZ_POINT_HALO_LAYER_ID)) {
    map.addLayer({
      id: KMZ_POINT_HALO_LAYER_ID,
      type: 'circle',
      source: KMZ_POINT_SOURCE_ID,
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          8, 2.8,
          12, 4.6,
          16, 7.5
        ],
        'circle-color': '#101419',
        'circle-opacity': 0.62
      }
    });
  }

  if (!map.getLayer(KMZ_POINT_LAYER_ID)) {
    map.addLayer({
      id: KMZ_POINT_LAYER_ID,
      type: 'circle',
      source: KMZ_POINT_SOURCE_ID,
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          8, 1.9,
          12, 3.3,
          16, 6.1
        ],
        'circle-color': velocityColorExpression,
        'circle-opacity': 0.9,
        'circle-stroke-color': 'rgba(255, 255, 255, 0.82)',
        'circle-stroke-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          8, 0.25,
          14, 0.85
        ]
      }
    });
  }

  bindKmzPointMapEvents();
  refreshKmzThresholding({ displayGeojson });
  moveKmzPointLayerToFront();
  updateKmzPointFocusDisplay(
    dashboardState.kmzPoints.activeSeriesPointId
      || dashboardState.kmzPoints.selectedPointId
      || dashboardState.kmzPoints.hoveredPointId,
    dashboardState.kmzPoints.activeSeriesPointMode
  );
}

function bindKmzPointMapEvents() {
  if (kmzPointEventsBound) {
    return;
  }

  let kmzPointPopup = null;
  let kmzPointPopupHovered = false;
  let kmzPointPopupGraceUntil = 0;

  const closeKmzPointPopup = () => {
    if (!kmzPointPopup) {
      return;
    }
    kmzPointPopup.remove();
    kmzPointPopup = null;
    kmzPointPopupHovered = false;
    kmzPointPopupGraceUntil = 0;
  };

  map.on('click', KMZ_POINT_LAYER_ID, event => {
    const feature = event.features?.[0];
    if (!feature) {
      return;
    }

    const pointId = feature.properties?.point_id;
    if (pointId) {
      dashboardState.kmzPoints.selectedPointId = pointId;
      updateKmzTimeSeriesChart(pointId, { force: true, source: 'locked' });
    }

    const popupProperties = feature.properties || {};
    const orbitDirection = inferKmzOrbitDirection(popupProperties.source_region, dashboardState.kmzPoints.sourceUrl);
    const lookDirection = inferKmzLookDirection(orbitDirection);
    const popupRows = [
      ['Coordinates', formatLatLon(popupProperties)],
      ['Displacement', formatCentimetres(popupProperties.displacement_cm)],
      ['Velocity', formatVelocityCmYr(popupProperties.velocity_cm_yr)],
      ['Coherence', formatNumberValue(popupProperties.temporal_coherence)],
      ['Orbit direction', orbitDirection],
      ['Viewing direction', lookDirection]
    ];

    closeKmzPointPopup();
    kmzPointPopup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      maxWidth: '220px'
    })
      .setLngLat(event.lngLat)
      .setHTML(`
        <div class="kmz-popup">
          <h4>${escapeHtml(getKmzPointDisplayLabel(popupProperties))}</h4>
          <dl>
            ${popupRows.map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value || '-')}</dd>`).join('')}
          </dl>
        </div>
      `)
      .addTo(map);
    kmzPointPopupGraceUntil = Date.now() + 450;

    const popupEl = kmzPointPopup.getElement();
    if (popupEl) {
      popupEl.addEventListener('mouseenter', () => {
        kmzPointPopupHovered = true;
      });
      popupEl.addEventListener('mouseleave', () => {
        kmzPointPopupHovered = false;
        closeKmzPointPopup();
      });
    }

    kmzPointPopup.on('close', () => {
      kmzPointPopup = null;
      kmzPointPopupHovered = false;
      kmzPointPopupGraceUntil = 0;
    });
  });

  map.on('mousemove', event => {
    if (!kmzPointPopup) {
      return;
    }
    if (kmzPointPopupHovered || Date.now() < kmzPointPopupGraceUntil) {
      return;
    }
    const isHoveringPoint = map.queryRenderedFeatures(event.point, { layers: [KMZ_POINT_LAYER_ID] }).length > 0;
    if (isHoveringPoint) {
      return;
    }
    const popupEl = kmzPointPopup.getElement();
    if (popupEl?.matches(':hover')) {
      return;
    }
    closeKmzPointPopup();
  });

  map.on('mouseenter', KMZ_POINT_LAYER_ID, () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mousemove', KMZ_POINT_LAYER_ID, event => {
    const feature = event.features?.[0];
    if (!feature?.properties?.point_id) {
      return;
    }
    updateKmzTimeSeriesChart(feature.properties.point_id, { source: 'hover' });
  });

  map.on('mouseleave', KMZ_POINT_LAYER_ID, () => {
    map.getCanvas().style.cursor = '';

    const sel = dashboardState.kmzPoints.selectedPointId;
    if (sel) {
      updateKmzTimeSeriesChart(sel, { force: true, source: 'locked' });
    }
  });

  kmzPointEventsBound = true;
}

function computeLinearTrend(values) {
  const indexed = values.map((y, x) => [x, y]).filter(([, y]) => y !== null && Number.isFinite(y));
  if (indexed.length < 2) return values.map(() => null);
  const n = indexed.length;
  const sumX = indexed.reduce((s, [x]) => s + x, 0);
  const sumY = indexed.reduce((s, [, y]) => s + y, 0);
  const sumXY = indexed.reduce((s, [x, y]) => s + x * y, 0);
  const sumXX = indexed.reduce((s, [x]) => s + x * x, 0);
  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return values.map(() => null);
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  return values.map((_, i) => Number((slope * i + intercept).toFixed(4)));
}

function updateKmzTimeSeriesChart(pointId, { force = false, source = '' } = {}) {
  if (!pointId || !kmzTimeSeriesChart) {
    return;
  }
  if (!force && dashboardState.kmzPoints.hoveredPointId === pointId) {
    return;
  }

  const detail = kmzPointDetails.get(pointId);
  const properties = getKmzFeatureProperties(pointId);
  const dates = Array.isArray(detail?.dates) ? detail.dates : [];
  const values = Array.isArray(detail?.values) ? detail.values : [];
  if (!dates.length || !values.length) {
    setKmzTimeSeriesPlaceholder('This displacement threshold point does not include a usable time series.');
    return;
  }

  const sourceMode = source || (dashboardState.kmzPoints.selectedPointId === pointId ? 'locked' : 'hover');
  dashboardState.kmzPoints.hoveredPointId = pointId;
  updateKmzPointFocusDisplay(pointId, sourceMode);
  const referenceIndex = coerceKmzReferenceIndex(dashboardState.kmzPoints.referenceIndex, dates);
  const cutoffIndex = coerceKmzCutoffIndex(dashboardState.kmzPoints.cutoffIndex, dates);
  const referenceValue = Number(values[referenceIndex]);
  const relativeValues = values.map(value => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) && Number.isFinite(referenceValue)
      ? Number((numericValue - referenceValue).toFixed(4))
      : null;
  });

  const referenceMarkers = new Array(relativeValues.length).fill(null);
  const finalMarkers = new Array(relativeValues.length).fill(null);
  referenceMarkers[referenceIndex] = 0;
  finalMarkers[cutoffIndex] = relativeValues[cutoffIndex] ?? null;

  const windowedValues = relativeValues.map((v, i) =>
    (i >= referenceIndex && i <= cutoffIndex) ? v : null
  );

  kmzTimeSeriesChart.data.labels = dates;
  kmzTimeSeriesChart.data.datasets[0].data = relativeValues;
  kmzTimeSeriesChart.data.datasets[1].data = referenceMarkers;
  kmzTimeSeriesChart.data.datasets[2].data = finalMarkers;
  kmzTimeSeriesChart.data.datasets[3].data = computeLinearTrend(windowedValues);
  const axisLimit = getKmzTimeSeriesAxisLimit(relativeValues);
  kmzTimeSeriesChart.options.scales.y.min = -axisLimit;
  kmzTimeSeriesChart.options.scales.y.max = axisLimit;
  kmzTimeSeriesChart.update('none');

  if (kmzTimeSeriesStatEl) {
    const pointLabel = getKmzPointDisplayLabel(properties);
    const lat = Number(properties?.latitude);
    const lon = Number(properties?.longitude);
    const coordStr = Number.isFinite(lat) && Number.isFinite(lon)
      ? `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`
      : '';
    const velStr = formatVelocityCmYr(properties?.velocity_cm_yr) || '';
    const sourceLabel = sourceMode === 'locked' ? 'Locked point' : 'Hover point';
    const detailBits = [coordStr, velStr].filter(Boolean);
    kmzTimeSeriesStatEl.textContent = `${sourceLabel}: ${pointLabel}${detailBits.length ? `  ·  ${detailBits.join('  ·  ')}` : ''}`;
  }

  if (kmzTimeSeriesNoteEl) {
    const rangeLabel = formatDateRange(dates[referenceIndex], dates[cutoffIndex]);
    const modeCopy = sourceMode === 'locked'
      ? 'Map click has locked this point.'
      : 'Hovering over a map point to preview its graph.';
    kmzTimeSeriesNoteEl.textContent = rangeLabel
      ? `${modeCopy} Reference period: ${rangeLabel}`
      : modeCopy;
  }
}

function setKmzTimeSeriesPlaceholder(message = 'Hover over a displacement threshold point to preview its displacement graph, or click to lock a point.') {
  if (!kmzTimeSeriesChart) {
    return;
  }
  kmzTimeSeriesDragState.isDragging = false;
  kmzTimeSeriesDragState.startIndex = null;
  dashboardState.kmzPoints.hoveredPointId = '';
  dashboardState.kmzPoints.selectedPointId = '';
  updateKmzPointFocusDisplay('', '');
  kmzTimeSeriesChart.data.labels = [];
  kmzTimeSeriesChart.data.datasets.forEach(dataset => {
    dataset.data = [];
  });
  delete kmzTimeSeriesChart.options.scales.x.min;
  delete kmzTimeSeriesChart.options.scales.x.max;
  delete kmzTimeSeriesChart.options.scales.y.min;
  delete kmzTimeSeriesChart.options.scales.y.max;
  kmzTimeSeriesChart.update('none');
  resetRainfallChartWindow();
  if (kmzTimeSeriesStatEl) {
    kmzTimeSeriesStatEl.textContent = '';
  }
  if (kmzTimeSeriesNoteEl) {
    kmzTimeSeriesNoteEl.textContent = message;
  }
}

function getKmzFeatureProperties(pointId) {
  const features = dashboardState.kmzPoints.geojson?.features || [];
  return features.find(feature => feature?.properties?.point_id === pointId)?.properties || null;
}

function getKmzPointDisplayLabel(properties) {
  const latLon = formatLatLon(properties);
  return latLon ? `Point ${latLon}` : 'Displacement threshold point';
}

function inferKmzOrbitDirection(sourceRegion = '', sourceUrl = '') {
  const sourceText = String(sourceRegion || '').toLowerCase();
  const urlText = String(sourceUrl || '').toLowerCase();
  if (/(^|[_\-])asc([_\-]|$)|ascending/.test(sourceText) || /(^|[_\-])asc([_\-]|$)|ascending/.test(urlText)) {
    return 'Ascending';
  }
  if (/(^|[_\-])desc([_\-]|$)|descending/.test(sourceText) || /(^|[_\-])desc([_\-]|$)|descending/.test(urlText)) {
    return 'Descending';
  }
  return 'Unknown';
}

function inferKmzLookDirection(orbitDirection = '') {
  if (orbitDirection === 'Ascending') {
    return 'East (right-looking)';
  }
  if (orbitDirection === 'Descending') {
    return 'West (right-looking)';
  }
  return 'Unknown';
}

function getKmzTimeSeriesAxisLimit(values) {
  const maxAbs = Math.max(
    0,
    ...values
      .map(value => Math.abs(Number(value)))
      .filter(value => Number.isFinite(value))
  );
  // Snap to fixed brackets so axis scale reflects actual magnitude.
  // Using moderate brackets to balance detail with layout stability (prevents x-axis jumping).
  const brackets = [5, 10, 25, 50, 100];
  for (const bracket of brackets) {
    if (maxAbs <= bracket * 0.9) {
      return bracket;
    }
  }
  // Beyond 100 cm: round up to nearest 50
  return Math.ceil(maxAbs * 1.1 / 50) * 50;
}

function formatLatLon(properties) {
  const coords = properties?.longitude !== undefined && properties?.latitude !== undefined
    ? [Number(properties.longitude), Number(properties.latitude)]
    : null;
  if (!coords) {
    return '';
  }
  const [lon, lat] = coords;
  return Number.isFinite(lat) && Number.isFinite(lon) ? `${lat.toFixed(6)} / ${lon.toFixed(6)}` : '';
}

function formatDateRange(start, end) {
  return start && end ? `${start} to ${end}` : '';
}

function setKmzPointStatus(message, isError = false) {
  dashboardState.kmzPoints.statusMessage = message || '';
  if (message) {
    setMapStatus(message, isError);
  }
}

function updateKmzReferenceIndex(value) {
  if (!dashboardState.kmzPoints.loaded || !dashboardState.kmzPoints.geojson) {
    updateKmzReferenceControls();
    return;
  }

  const dates = dashboardState.kmzPoints.dates || dashboardState.kmzPoints.geojson.properties?.dates || [];
  const cutoffIndex = coerceKmzCutoffIndex(dashboardState.kmzPoints.cutoffIndex, dates);
  const rawIndex = coerceKmzReferenceIndex(value, dates);
  const referenceIndex = Math.min(rawIndex, Math.max(0, cutoffIndex - 1));
  dashboardState.kmzPoints.referenceIndex = referenceIndex;

  const metrics = refreshKmzPointCalculations(dashboardState.kmzPoints.geojson, referenceIndex, cutoffIndex);
  applyKmzPointMetrics(metrics);
  updateKmzPointSourceData(dashboardState.kmzPoints.geojson);

  const activePointId = dashboardState.kmzPoints.selectedPointId || dashboardState.kmzPoints.hoveredPointId;
  if (activePointId && kmzFeaturePassesCurrentThreshold(getKmzFeatureProperties(activePointId))) {
    updateKmzTimeSeriesChart(activePointId, {
      force: true,
      source: dashboardState.kmzPoints.selectedPointId === activePointId ? 'locked' : 'hover'
    });
  }

  updateKmzReferenceControls();
  setKmzPointStatus(buildKmzPointStatusMessage(metrics));

  const selectionSummary = buildSelectionSummary(getActiveEntries());
  dashboardState.selectionSummary = selectionSummary;
  updateStatCards(selectionSummary);
  refreshMapStatusMessage();
}

function updateKmzCutoffIndex(value) {
  if (!dashboardState.kmzPoints.loaded || !dashboardState.kmzPoints.geojson) {
    updateKmzReferenceControls();
    return;
  }

  const dates = dashboardState.kmzPoints.dates || dashboardState.kmzPoints.geojson.properties?.dates || [];
  const referenceIndex = coerceKmzReferenceIndex(dashboardState.kmzPoints.referenceIndex, dates);
  const rawCutoff = coerceKmzCutoffIndex(value, dates);
  const cutoffIndex = Math.max(rawCutoff, referenceIndex + 1);
  dashboardState.kmzPoints.cutoffIndex = cutoffIndex;

  const metrics = refreshKmzPointCalculations(dashboardState.kmzPoints.geojson, referenceIndex, cutoffIndex);
  applyKmzPointMetrics(metrics);
  updateKmzPointSourceData(dashboardState.kmzPoints.geojson);

  const activePointId = dashboardState.kmzPoints.selectedPointId || dashboardState.kmzPoints.hoveredPointId;
  if (activePointId && kmzFeaturePassesCurrentThreshold(getKmzFeatureProperties(activePointId))) {
    updateKmzTimeSeriesChart(activePointId, {
      force: true,
      source: dashboardState.kmzPoints.selectedPointId === activePointId ? 'locked' : 'hover'
    });
  }

  updateKmzReferenceControls();
  setKmzPointStatus(buildKmzPointStatusMessage(metrics));

  const selectionSummary = buildSelectionSummary(getActiveEntries());
  dashboardState.selectionSummary = selectionSummary;
  updateStatCards(selectionSummary);
  refreshMapStatusMessage();
}

function refreshKmzPointCalculations(geojson, referenceIndex, cutoffIndex) {
  const features = Array.isArray(geojson?.features) ? geojson.features : [];

  features.forEach(feature => {
    const properties = feature.properties || {};
    feature.properties = properties;
    const detail = kmzPointDetails.get(properties.point_id);
    const dates = Array.isArray(detail?.dates) ? detail.dates : [];
    const values = Array.isArray(detail?.values) ? detail.values : [];
    const featureReferenceIndex = coerceKmzReferenceIndex(referenceIndex, dates);
    const featureCutoffIndex = coerceKmzCutoffIndex(cutoffIndex, dates);
    const velocityCmYr = computeKmzVelocity(values, dates, featureReferenceIndex, featureCutoffIndex);
    const displacementCm = computeKmzFinalDisplacement(values, featureReferenceIndex, featureCutoffIndex);

    properties.date_start = dates[featureReferenceIndex] || dates[0] || '';
    properties.date_end = dates[featureCutoffIndex] || dates[dates.length - 1] || '';
    properties.displacement_cm = Number.isFinite(displacementCm) ? Number(displacementCm.toFixed(4)) : null;

    if (Number.isFinite(velocityCmYr)) {
      properties.velocity_cm_yr = Number(velocityCmYr.toFixed(4));
    } else {
      delete properties.velocity_cm_yr;
    }
  });

  return getKmzPointMetrics(features);
}

function applyKmzPointMetrics(metrics) {
  dashboardState.kmzPoints.validVelocityCount = metrics.validVelocityCount;
  dashboardState.kmzPoints.minVelocityCmYr = metrics.minVelocityCmYr;
  dashboardState.kmzPoints.maxVelocityCmYr = metrics.maxVelocityCmYr;
  dashboardState.kmzPoints.maxAbsVelocityCmYr = metrics.maxAbsVelocityCmYr;
  dashboardState.kmzPoints.maxNegativeVelocityCmYr = metrics.maxNegativeVelocityCmYr;
  dashboardState.kmzPoints.medianVelocityCmYr = metrics.medianVelocityCmYr;
  dashboardState.kmzPoints.medianDisplacementCm = metrics.medianDisplacementCm;
  dashboardState.kmzPoints.positiveCount = metrics.positiveCount;
  dashboardState.kmzPoints.negativeCount = metrics.negativeCount;
}

function updateKmzReferenceControls() {
  if (!kmzReferenceSlider || !kmzCutoffSlider || !kmzReferenceDateValue) {
    return;
  }

  const dates = dashboardState.kmzPoints.dates || [];
  const maxIndex = dates.length > 0 ? dates.length - 1 : 0;
  const hasReferenceDates = dashboardState.kmzPoints.loaded && dates.length >= 2;
  const referenceIndex = coerceKmzReferenceIndex(dashboardState.kmzPoints.referenceIndex, dates);
  const cutoffIndex = coerceKmzCutoffIndex(dashboardState.kmzPoints.cutoffIndex, dates);
  dashboardState.kmzPoints.referenceIndex = referenceIndex;
  // Only persist cutoffIndex once real dates are available; without this guard the
  // pre-load call (dates=[]) coerces null→0 and the full-range default is lost.
  if (hasReferenceDates) {
    dashboardState.kmzPoints.cutoffIndex = cutoffIndex;
  }

  kmzReferenceSlider.min = '0';
  kmzReferenceSlider.max = String(Math.max(0, cutoffIndex - 1));
  kmzReferenceSlider.value = String(referenceIndex);
  kmzReferenceSlider.disabled = !hasReferenceDates;

  kmzCutoffSlider.min = String(referenceIndex + 1);
  kmzCutoffSlider.max = String(maxIndex);
  kmzCutoffSlider.value = String(cutoffIndex);
  kmzCutoffSlider.disabled = !hasReferenceDates;

  updateKmzSliderTrack(referenceIndex, cutoffIndex, maxIndex);

  if (hasReferenceDates) {
    const rangeLabel = getKmzReferenceRangeLabel(dates, referenceIndex, cutoffIndex);
    kmzReferenceDateValue.textContent = rangeLabel || 'Reference unavailable';
    kmzReferenceDateValue.title = rangeLabel || '';
    return;
  }

  kmzReferenceDateValue.textContent = dashboardState.kmzPoints.loading ? 'Loading displacement threshold' : 'Awaiting displacement threshold';
  kmzReferenceDateValue.title = '';
  updateKmzSliderTrack(0, 0, 0);
}

function updateKmzSliderTrack(referenceIndex, cutoffIndex, maxIndex) {
  const trackEl = document.getElementById('kmzSliderTrack');
  if (!trackEl) {
    return;
  }
  if (maxIndex <= 0) {
    trackEl.style.background = '#363c45';
    return;
  }
  const leftPct = (referenceIndex / maxIndex) * 100;
  const rightPct = (cutoffIndex / maxIndex) * 100;
  trackEl.style.background =
    `linear-gradient(to right, #363c45 ${leftPct}%, #b3147f ${leftPct}%, #b3147f ${rightPct}%, #363c45 ${rightPct}%)`;
}

function coerceKmzReferenceIndex(value, dates) {
  const maxIndex = getKmzReferenceMaxIndex(dates);
  const numericValue = Number(value);
  const fallback = Math.min(KMZ_DEFAULT_REFERENCE_INDEX, maxIndex);
  const index = Number.isFinite(numericValue) ? Math.round(numericValue) : fallback;
  return Math.max(0, Math.min(maxIndex, index));
}

function coerceKmzCutoffIndex(value, dates) {
  const maxIndex = Array.isArray(dates) && dates.length > 0 ? dates.length - 1 : 0;
  if (value === null || value === undefined) {
    return maxIndex;
  }
  const numericValue = Number(value);
  const index = Number.isFinite(numericValue) ? Math.round(numericValue) : maxIndex;
  return Math.max(0, Math.min(maxIndex, index));
}

function getKmzReferenceMaxIndex(dates) {
  return Array.isArray(dates) && dates.length >= 2 ? dates.length - 2 : 0;
}

function getKmzReferenceRangeLabel(
  dates = dashboardState.kmzPoints.dates,
  referenceIndex = dashboardState.kmzPoints.referenceIndex,
  cutoffIndex = dashboardState.kmzPoints.cutoffIndex
) {
  if (!Array.isArray(dates) || !dates.length) {
    return '';
  }

  const coercedIndex = coerceKmzReferenceIndex(referenceIndex, dates);
  const coercedCutoff = coerceKmzCutoffIndex(cutoffIndex, dates);
  const referenceDate = dates[coercedIndex] || dates[0] || '';
  const endDate = dates[coercedCutoff] || '';
  return referenceDate && endDate ? `${referenceDate} to ${endDate}` : referenceDate;
}

function buildKmzPointStatusMessage(metrics = {}) {
  const pointCount = dashboardState.kmzPoints.featureCount || dashboardState.kmzPoints.geojson?.features?.length || 0;
  const rangeLabel = getKmzReferenceRangeLabel();
  const maxNegativeLabel = formatKmzSummaryNegativeVelocity(metrics);
  const rangeText = rangeLabel ? ` Reference ${rangeLabel}.` : '';
  const thresholdText = buildKmzThresholdStatusText();
  return `${pointCount.toLocaleString()} displacement threshold points loaded.${thresholdText}${rangeText} Max negative LOS ${maxNegativeLabel}.`;
}

function getKmzSummaryNegativeVelocity(metrics = {}) {
  if (dashboardState.kmzPoints.loaded && dashboardState.kmzPoints.geojson) {
    const displayFeatures = getKmzDisplayGeoJson(dashboardState.kmzPoints.geojson).features || [];
    if (!displayFeatures.length) {
      return null;
    }

    const thresholdedFeatures = displayFeatures.filter(feature => kmzFeaturePassesCurrentThreshold(feature));
    const visibleFeatures = thresholdedFeatures.length ? thresholdedFeatures : displayFeatures;
    return getKmzPointMetrics(visibleFeatures).maxNegativeVelocityCmYr;
  }

  return metrics.maxNegativeVelocityCmYr ?? dashboardState.kmzPoints.maxNegativeVelocityCmYr;
}

function formatKmzSummaryNegativeVelocity(metrics = {}) {
  const velocity = getKmzSummaryNegativeVelocity(metrics);
  return Number.isFinite(velocity) ? formatVelocityCmYr(velocity) : 'no negative values';
}

function getKmzPointMetrics(features) {
  const velocities = [];
  const displacements = [];
  let positiveCount = 0;
  let negativeCount = 0;

  features.forEach(feature => {
    const velocity = Number(feature?.properties?.velocity_cm_yr);
    const displacement = Number(feature?.properties?.displacement_cm);
    if (Number.isFinite(velocity)) {
      velocities.push(velocity);
      if (velocity > 0) {
        positiveCount += 1;
      } else if (velocity < 0) {
        negativeCount += 1;
      }
    }
    if (Number.isFinite(displacement)) {
      displacements.push(displacement);
    }
  });

  const sortedVelocities = velocities.sort((a, b) => a - b);
  const sortedNegativeVelocities = sortedVelocities.filter(value => value < 0);
  const sortedAbsVelocities = velocities.map(Math.abs).sort((a, b) => a - b);
  const sortedDisplacements = displacements.sort((a, b) => a - b);

  return {
    validVelocityCount: sortedVelocities.length,
    minVelocityCmYr: sortedVelocities.length ? sortedVelocities[0] : null,
    maxVelocityCmYr: sortedVelocities.length ? sortedVelocities[sortedVelocities.length - 1] : null,
    maxAbsVelocityCmYr: sortedAbsVelocities.length ? sortedAbsVelocities[sortedAbsVelocities.length - 1] : null,
    maxNegativeVelocityCmYr: sortedNegativeVelocities.length ? sortedNegativeVelocities[0] : null,
    medianVelocityCmYr: quantileSorted(sortedVelocities, 0.5),
    medianDisplacementCm: quantileSorted(sortedDisplacements, 0.5),
    positiveCount,
    negativeCount
  };
}

function quantileSorted(sortedValues, q) {
  if (!Array.isArray(sortedValues) || !sortedValues.length) {
    return null;
  }
  const position = (sortedValues.length - 1) * q;
  const low = Math.floor(position);
  const high = Math.ceil(position);
  if (low === high) {
    return sortedValues[low];
  }
  return sortedValues[low] * (high - position) + sortedValues[high] * (position - low);
}

function formatVelocityCmYr(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? `${numericValue.toFixed(2)} cm/yr` : '';
}

function fitMapToKmzPoints(geojson) {
  const displayGeojson = getKmzDisplayGeoJson(geojson);
  const visibleFeatures = (displayGeojson.features || []).filter(feature => kmzFeaturePassesCurrentThreshold(feature));
  const features = visibleFeatures.length ? visibleFeatures : (displayGeojson.features || []);
  const bounds = new mapboxgl.LngLatBounds();
  let coordinateCount = 0;

  features.forEach(feature => {
    const coordinates = feature?.geometry?.coordinates;
    const lng = Number(coordinates?.[0]);
    const lat = Number(coordinates?.[1]);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      return;
    }
    bounds.extend([lng, lat]);
    coordinateCount += 1;
  });

  if (!coordinateCount) {
    return;
  }

  if (coordinateCount === 1) {
    const center = bounds.getCenter();
    map.flyTo(withMapCameraMode({ center: [center.lng, center.lat], zoom: 15, duration: 900 }));
    return;
  }

  map.fitBounds(bounds, withMapCameraMode({
    padding: 58,
    duration: 900,
    maxZoom: 15
  }));
}

function getInitialMobileForestId() {
  const selectedForestId = dashboardState.filters.forestId;
  if (selectedForestId && selectedForestId !== 'all') {
    return selectedForestId;
  }

  const largestForestId = Object.entries(dashboardState.corridorBoundary.areaByForest || {})
    .filter(([forestId, area]) => forestId && forestId !== 'all' && Number.isFinite(Number(area)))
    .sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0];

  if (largestForestId) {
    return largestForestId;
  }

  return FOREST_LIBRARY.find(entry => entry.id && entry.id !== 'all')?.id || 'hadley';
}

function fitMapToForest(forestId) {
  if (!dashboardState.mapLoaded) {
    return;
  }

  // Do not move camera when "all forests" is selected.
  if (!forestId || forestId === 'all') {
    return;
  }

  // For a specific forest, use the corridor boundary polygons
  const rawFeatures = (dashboardState.corridorBoundary.rawGeojson?.features || [])
    .filter(f => normalizeScopeKey(f?.properties?.forest_id || '') === forestId);

  if (rawFeatures.length) {
    const bounds = new mapboxgl.LngLatBounds();
    let coordinateCount = 0;
    rawFeatures.forEach(feature => {
      walkGeometryCoordinates(feature?.geometry?.coordinates, coord => {
        const lng = Number(coord[0]);
        const lat = Number(coord[1]);
        if (Number.isFinite(lng) && Number.isFinite(lat)) {
          bounds.extend([lng, lat]);
          coordinateCount++;
        }
      });
    });
    if (coordinateCount > 0) {
      map.fitBounds(bounds, withMapCameraMode({ padding: 58, duration: 1200, maxZoom: 14 }));
      return;
    }
  }

  // Fallback: fly to all displacement threshold points
  if (dashboardState.kmzPoints.loaded && dashboardState.kmzPoints.geojson) {
    const kmzDisplayGeojson = getKmzDisplayGeoJson(dashboardState.kmzPoints.geojson);
    if ((kmzDisplayGeojson.features || []).length) {
      fitMapToKmzPoints(kmzDisplayGeojson);
      return;
    }
  }

  map.flyTo(withMapCameraMode({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM, duration: 1200 }));
}

function moveKmzPointLayerToFront() {
  if (map.getLayer(KMZ_POINT_HALO_LAYER_ID)) {
    map.moveLayer(KMZ_POINT_HALO_LAYER_ID);
  }
  if (map.getLayer(KMZ_POINT_LAYER_ID)) {
    map.moveLayer(KMZ_POINT_LAYER_ID);
  }
}

function moveCorridorLayersToFront() {
  if (map.getLayer(ROAD_CORRIDOR_3D_LAYER_ID)) {
    map.moveLayer(ROAD_CORRIDOR_3D_LAYER_ID);
  }
  if (map.getLayer(ROAD_CORRIDOR_LINE_LAYER_ID)) {
    map.moveLayer(ROAD_CORRIDOR_LINE_LAYER_ID);
  }
}

function getNumericProperty(properties, names) {
  for (const name of names) {
    const value = Number(properties?.[name]);
    if (Number.isFinite(value)) {
      return value;
    }
  }
  return NaN;
}

function formatDetectedIn(hitCount, observationCount) {
  const hasHitCount = Number.isFinite(hitCount);
  const hasObservationCount = Number.isFinite(observationCount);

  if (hasHitCount && hasObservationCount) {
    return `${Math.round(hitCount)} of ${Math.round(observationCount)} observations`;
  }
  if (hasHitCount) {
    return `${Math.round(hitCount)} observations`;
  }
  return '';
}

function formatPercentage(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return '';
  }

  const percentage = Math.abs(numericValue) <= 1 ? numericValue * 100 : numericValue;
  const rounded = Number.isInteger(percentage) ? percentage.toFixed(0) : percentage.toFixed(1);
  return `${rounded}%`;
}

function formatBooleanValue(value) {
  if (typeof value === 'boolean') {
    return value ? 'yes' : 'no';
  }
  if (typeof value === 'number') {
    return value ? 'yes' : 'no';
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', 'yes', 'y', '1'].includes(normalized)) {
      return 'yes';
    }
    if (['false', 'no', 'n', '0'].includes(normalized)) {
      return 'no';
    }
  }
  return '';
}

function formatListValue(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(', ');
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return '';
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean).join(', ');
      }
    } catch {
      // Fall through to the raw string; catalogue exports are not all JSON arrays.
    }

    return trimmed;
  }
  return '';
}















































function formatCentimetres(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? `${numericValue.toFixed(2)} cm` : '';
}

function formatNumberValue(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(2) : '';
}


async function loadRoadCorridorBoundary() {
  try {
    const response = await fetch(BOUNDARY_DATA_SOURCES.roadCorridor.geojson);
    if (!response.ok) {
      throw new Error(`Boundary request failed with ${response.status}`);
    }

    const geojson = await response.json();
    const featureCount = Array.isArray(geojson.features) ? geojson.features.length : 0;
    const corridorFeatures = Array.isArray(geojson.features)
      ? geojson.features
        .map((feature, index) => normalizeCorridorFeature(feature, index))
        .filter(Boolean)
      : [];
    const areaHa = corridorFeatures.reduce((total, feature) => total + feature.areaHa, 0);

    dashboardState.corridorBoundary.loaded = true;
    dashboardState.corridorBoundary.featureCount = featureCount;
    dashboardState.corridorBoundary.areaHa = areaHa;
    dashboardState.corridorBoundary.features = corridorFeatures;
    dashboardState.corridorBoundary.rawGeojson = geojson;
    dashboardState.corridorBoundary.error = null;
    updateCorridorForestAssignments();

    if (!map.getSource(ROAD_CORRIDOR_SOURCE_ID)) {
      map.addSource(ROAD_CORRIDOR_SOURCE_ID, {
        type: 'geojson',
        data: geojson
      });
    }

    if (!map.getLayer(ROAD_CORRIDOR_FILL_LAYER_ID)) {
      map.addLayer({
        id: ROAD_CORRIDOR_FILL_LAYER_ID,
        type: 'fill',
        source: ROAD_CORRIDOR_SOURCE_ID,
        paint: {
          'fill-color': '#d14ba0',
          'fill-opacity': 0.05
        }
      });
    }

    if (!map.getLayer(ROAD_CORRIDOR_3D_LAYER_ID)) {
      const corridorAreaExpression = ['to-number', ['coalesce', ['get', 'area_ha_calc'], ['get', 'area'], 1]];
      map.addLayer({
        id: ROAD_CORRIDOR_3D_LAYER_ID,
        type: 'fill-extrusion',
        source: ROAD_CORRIDOR_SOURCE_ID,
        layout: {
          visibility: dashboardState.threeDEnabled ? 'visible' : 'none'
        },
        paint: {
          'fill-extrusion-color': [
            'match',
            ['get', 'forest_id'],
            'hadley', '#49abff',
            'plunkett', '#d14ba0',
            '#f2a9d7'
          ],
          'fill-extrusion-base': 0,
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            corridorAreaExpression,
            0, 24,
            20, 58,
            80, 118
          ],
          'fill-extrusion-opacity': 0.52,
          'fill-extrusion-vertical-gradient': true
        }
      });
    }

    if (!map.getLayer(ROAD_CORRIDOR_LINE_LAYER_ID)) {
      map.addLayer({
        id: ROAD_CORRIDOR_LINE_LAYER_ID,
        type: 'line',
        source: ROAD_CORRIDOR_SOURCE_ID,
        paint: {
          'line-color': '#f2a9d7',
          'line-width': 1.6,
          'line-opacity': 0.8
        }
      });
    }

    updateThreeDLayerVisibility();
    moveCorridorLayersToFront();
  } catch (error) {
    console.error('Failed to load road corridor boundary', error);
    dashboardState.corridorBoundary.loaded = false;
    dashboardState.corridorBoundary.areaHa = null;
    dashboardState.corridorBoundary.features = [];
    dashboardState.corridorBoundary.areaByForest = {};
    dashboardState.corridorBoundary.error = error;
  }
}

async function loadEscSummaries() {
  try {
    const response = await fetch(ESC_SUMMARY_URL);
    if (!response.ok) {
      throw new Error(`ESC summary request failed with ${response.status}`);
    }

    const payload = await response.json();
    dashboardState.escSummaries.loaded = true;
    dashboardState.escSummaries.sourceStatus = payload?.source?.status || 'loaded';
    dashboardState.escSummaries.sourceLabel = payload?.source?.label || 'ESC summary';
    dashboardState.escSummaries.sourceVersion = payload?.source?.version || '';
    dashboardState.escSummaries.generatedAt = payload?.source?.generated_at || '';
    dashboardState.escSummaries.classes = Array.isArray(payload?.classes) && payload.classes.length
      ? payload.classes
      : ['Low', 'Medium', 'High', 'Very High'];
    dashboardState.escSummaries.scopes = payload?.scopes || {};
    dashboardState.escSummaries.error = null;
  } catch (error) {
    console.error('Failed to load ESC summaries', error);
    dashboardState.escSummaries.loaded = false;
    dashboardState.escSummaries.error = error;
  }
}

async function loadEscOverlay() {
  try {
    const response = await fetch(ESC_OVERLAY_URL);
    if (!response.ok) {
      throw new Error(`ESC overlay request failed with ${response.status}`);
    }

    const geojson = await response.json();
    dashboardState.escOverlay.loaded = true;
    dashboardState.escOverlay.error = null;

    if (!map.getSource(ESC_OVERLAY_SOURCE_ID)) {
      map.addSource(ESC_OVERLAY_SOURCE_ID, {
        type: 'geojson',
        data: geojson
      });
    }

    if (!map.getLayer(ESC_OVERLAY_FILL_LAYER_ID)) {
      map.addLayer({
        id: ESC_OVERLAY_FILL_LAYER_ID,
        type: 'fill',
        source: ESC_OVERLAY_SOURCE_ID,
        paint: {
          'fill-color': [
            'match',
            ['get', 'ESC2018'],
            'Low', '#8fe36f',
            'Medium', '#f7ea57',
            'High', '#f3a633',
            'Very High', '#ef5a5a',
            'rgba(0,0,0,0)'
          ],
          'fill-opacity': 0.32
        },
        layout: {
          visibility: 'none'
        }
      });
    }

    if (!map.getLayer(ESC_OVERLAY_LINE_LAYER_ID)) {
      map.addLayer({
        id: ESC_OVERLAY_LINE_LAYER_ID,
        type: 'line',
        source: ESC_OVERLAY_SOURCE_ID,
        paint: {
          'line-color': [
            'match',
            ['get', 'ESC2018'],
            'Low', '#8fe36f',
            'Medium', '#f7ea57',
            'High', '#f3a633',
            'Very High', '#ef5a5a',
            '#c9d1db'
          ],
          'line-width': 0.7,
          'line-opacity': 0.5
        },
        layout: {
          visibility: 'none'
        }
      });
    }

    updateEscOverlayPresentation();
  } catch (error) {
    console.error('Failed to load ESC overlay', error);
    dashboardState.escOverlay.loaded = false;
    dashboardState.escOverlay.error = error;
  }
}

function updateEscOverlayPresentation() {
  if (!dashboardState.mapLoaded || !dashboardState.escOverlay.loaded) {
    return;
  }

  const isVisible = dashboardState.escOverlayEnabled;
  const layoutVisibility = isVisible ? 'visible' : 'none';
  const forestFilter = dashboardState.filters.forestId === 'all'
    ? null
    : ['==', ['get', 'forest_id'], dashboardState.filters.forestId];

  [ESC_OVERLAY_FILL_LAYER_ID, ESC_OVERLAY_LINE_LAYER_ID].forEach(layerId => {
    if (!map.getLayer(layerId)) {
      return;
    }
    map.setLayoutProperty(layerId, 'visibility', layoutVisibility);
    map.setFilter(layerId, forestFilter);
  });

  if (map.getLayer(ESC_OVERLAY_FILL_LAYER_ID)) {
    map.moveLayer(ESC_OVERLAY_FILL_LAYER_ID);
  }
  if (map.getLayer(ESC_OVERLAY_LINE_LAYER_ID)) {
    map.moveLayer(ESC_OVERLAY_LINE_LAYER_ID);
  }
  moveCorridorLayersToFront();
}

function normalizeScopeKey(value) {
  return (value || 'all')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'all';
}

function getEscSummaryForSelection() {
  const scopes = dashboardState.escSummaries.scopes || {};
  const forestKey = dashboardState.filters.forestId === 'all'
    ? 'all'
    : normalizeScopeKey(dashboardState.filters.forestId);

  if (forestKey !== 'all' && scopes[forestKey]) {
    return { scopeKey: forestKey, summary: scopes[forestKey], usedFallback: false };
  }

  if (scopes.all) {
    return { scopeKey: 'all', summary: scopes.all, usedFallback: forestKey !== 'all' };
  }

  return { scopeKey: null, summary: null, usedFallback: false };
}

async function applyFilters({ fitView = true } = {}) {
  const targetKmzSourceForestId = getKmzSourceForestIdForSelection(dashboardState.filters.forestId);
  const activeKmzSourceForestId = normalizeScopeKey(dashboardState.kmzPoints.sourceForestId || '');
  const needsKmzSourceReload = !dashboardState.kmzPoints.loaded
    || !dashboardState.kmzPoints.geojson
    || activeKmzSourceForestId !== targetKmzSourceForestId;

  if (needsKmzSourceReload && !dashboardState.kmzPoints.loading) {
    await loadKmzPointLayer({ fitView: false });
  } else if (dashboardState.kmzPoints.loaded && dashboardState.kmzPoints.geojson) {
    updateKmzPointSourceData(dashboardState.kmzPoints.geojson);
  }

  const activeEntries = getActiveEntries();
  const selectionSummary = buildSelectionSummary(activeEntries);
  dashboardState.selectionSummary = selectionSummary;
  updateStatCards(selectionSummary);
  renderDatasetCards(activeEntries, selectionSummary);
  await renderRasterSelection({ fitView });
}

function updateStatCards(selectionSummary) {
  document.getElementById('activeForestValue').textContent = selectionSummary.forestLabel;
  document.getElementById('activePeriodValue').textContent = selectionSummary.periodLabel;
  document.getElementById('monitoredAreaValue').textContent = formatAreaHa(selectionSummary.monitoredAreaHa);
  document.getElementById('maxDisplacementValue').textContent = selectionSummary.maxDisplacement;

  const kmzStatus = dashboardState.kmzPoints.statusMessage
    ? ` ${dashboardState.kmzPoints.statusMessage}`
    : '';
  mapSelectionNoteEl.textContent = selectionSummary.activeRasterCount
    ? `${selectionSummary.selectionScope}. ${selectionSummary.loadedCount} loaded, ${selectionSummary.pendingCount} pending, ${selectionSummary.failedCount} failed.${dashboardState.corridorBoundary.loaded ? ` Corridor boundary loaded (${dashboardState.corridorBoundary.featureCount} feature${dashboardState.corridorBoundary.featureCount === 1 ? '' : 's'}).` : ''}${kmzStatus}`
    : `No raster set is currently available for this filter combination.${kmzStatus}`;
}

function formatAreaHa(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return '—';
  }
  return `${numericValue.toFixed(1)} ha`;
}

function normalizeCorridorFeature(feature, index) {
  const center = getFeatureCenter(feature?.geometry);
  const areaHa = getCorridorFeatureAreaHa(feature);
  if (!center || !Number.isFinite(areaHa) || areaHa <= 0) {
    return null;
  }

  return {
    id: feature?.properties?.id ?? `feature-${index + 1}`,
    areaHa,
    center,
    forestId: normalizeScopeKey(feature?.properties?.forest_id || ''),
    forestName: feature?.properties?.forest_name || '',
    properties: feature?.properties || {}
  };
}

function getCorridorFeatureAreaHa(feature) {
  const calculated = Number(feature?.properties?.area_ha_calc);
  if (Number.isFinite(calculated) && calculated > 0) {
    return calculated;
  }

  const stored = Number(feature?.properties?.area);
  if (Number.isFinite(stored) && stored > 0) {
    return stored;
  }

  return NaN;
}

function getFeatureCenter(geometry) {
  const bounds = getGeometryBounds(geometry);
  if (!bounds) {
    return null;
  }
  return [
    (bounds.minLng + bounds.maxLng) / 2,
    (bounds.minLat + bounds.maxLat) / 2
  ];
}

function getGeometryBounds(geometry) {
  if (!geometry?.type || !geometry?.coordinates) {
    return null;
  }

  const bounds = {
    minLng: Infinity,
    minLat: Infinity,
    maxLng: -Infinity,
    maxLat: -Infinity
  };

  walkGeometryCoordinates(geometry.coordinates, coord => {
    const [lng, lat] = coord;
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      return;
    }
    bounds.minLng = Math.min(bounds.minLng, lng);
    bounds.minLat = Math.min(bounds.minLat, lat);
    bounds.maxLng = Math.max(bounds.maxLng, lng);
    bounds.maxLat = Math.max(bounds.maxLat, lat);
  });

  if (!Number.isFinite(bounds.minLng)) {
    return null;
  }

  return bounds;
}

function walkGeometryCoordinates(value, callback) {
  if (!Array.isArray(value) || !value.length) {
    return;
  }

  if (typeof value[0] === 'number' && typeof value[1] === 'number') {
    callback(value);
    return;
  }

  value.forEach(child => walkGeometryCoordinates(child, callback));
}

function updateCorridorForestAssignments() {
  const corridorFeatures = dashboardState.corridorBoundary.features || [];
  if (!corridorFeatures.length) {
    dashboardState.corridorBoundary.areaByForest = {};
    return;
  }

  const explicitAssignments = corridorFeatures.reduce((accumulator, feature) => {
    if (!feature.forestId || feature.forestId === 'all') {
      return accumulator;
    }
    accumulator[feature.forestId] = (accumulator[feature.forestId] || 0) + feature.areaHa;
    return accumulator;
  }, {});

  if (Object.keys(explicitAssignments).length) {
    dashboardState.corridorBoundary.areaByForest = explicitAssignments;
    return;
  }

  const rasterCenters = Array.from(rasterCache.values())
    .filter(entry => entry?.loaded && Array.isArray(entry.center) && entry.forestId)
    .reduce((accumulator, entry) => {
      if (!accumulator[entry.forestId]) {
        accumulator[entry.forestId] = entry.center;
      }
      return accumulator;
    }, {});

  const forestIds = Object.keys(rasterCenters);
  if (!forestIds.length) {
    dashboardState.corridorBoundary.areaByForest = {};
    return;
  }

  const assignments = {};
  const remainingFeatures = [...corridorFeatures];
  const remainingForestIds = [...forestIds];

  while (remainingFeatures.length && remainingForestIds.length) {
    let bestMatch = null;

    remainingForestIds.forEach(forestId => {
      const rasterCenter = rasterCenters[forestId];
      remainingFeatures.forEach(feature => {
        const distance = getDistanceBetweenPoints(feature.center, rasterCenter);
        if (!bestMatch || distance < bestMatch.distance) {
          bestMatch = { forestId, feature, distance };
        }
      });
    });

    if (!bestMatch) {
      break;
    }

    assignments[bestMatch.forestId] = bestMatch.feature.areaHa;
    remainingForestIds.splice(remainingForestIds.indexOf(bestMatch.forestId), 1);
    remainingFeatures.splice(remainingFeatures.indexOf(bestMatch.feature), 1);
  }

  dashboardState.corridorBoundary.areaByForest = assignments;
}

function getDistanceBetweenPoints(pointA, pointB) {
  if (!Array.isArray(pointA) || !Array.isArray(pointB)) {
    return Number.POSITIVE_INFINITY;
  }
  const dx = pointA[0] - pointB[0];
  const dy = pointA[1] - pointB[1];
  return Math.sqrt(dx * dx + dy * dy);
}

function renderDatasetCards(activeEntries, selectionSummary) {
  datasetCardsEl.innerHTML = '';

  if (!activeEntries.length) {
    datasetCardsEl.innerHTML = '<div class="dataset-card"><h4>No raster available</h4><p class="dataset-description">Add a matching forest / period record to the catalog to make it available here.</p></div>';
    datasetSummaryTextEl.textContent = 'No raster sets matched the current filter selection.';
    return;
  }

  activeEntries.forEach(entry => {
    const cacheEntry = rasterCache.get(entry.id);
    const status = getRasterLoadStatus(cacheEntry);
    const card = document.createElement('div');
    card.className = 'dataset-card';
    card.innerHTML = `
      <div class="dataset-card-topline">
        <span class="dataset-badge">${escapeHtml(entry.layerGroup || 'Raster')}</span>
        <span class="dataset-badge">${escapeHtml(entry.layerType || 'GeoTIFF')}</span>
        <span class="dataset-badge ${status.className}">${escapeHtml(status.label)}</span>
      </div>
      <h4>${escapeHtml(entry.title)}</h4>
      <p class="dataset-description">${escapeHtml(entry.description || 'Metadata-driven raster record ready for future hosted configuration.')}</p>
      <dl>
        <dt>Forest</dt><dd>${escapeHtml(getForestLabel(entry.forestId))}</dd>
        <dt>Period</dt><dd>${escapeHtml(getPeriodLabel(entry.periodId))}</dd>
        <dt>Overlay</dt><dd>${dashboardState.sentinelEnabled ? 'Visible when loaded' : 'Ready on toggle'}</dd>
        <dt>Displacement</dt><dd>${escapeHtml(entry.maxDisplacementLabel || 'Awaiting data')}</dd>
        <dt>Catalog Status</dt><dd>${escapeHtml(entry.sourceStatus || 'Reference-ready')}</dd>
        <dt>Source</dt><dd>${escapeHtml(entry.sourceName)}</dd>
        <dt>Load State</dt><dd>${escapeHtml(status.label)}</dd>
      </dl>
    `;
    datasetCardsEl.appendChild(card);
  });

  datasetSummaryTextEl.textContent = `${selectionSummary.activeRasterCount} raster set(s) for ${selectionSummary.forestLabel} / ${selectionSummary.periodLabel}. ${selectionSummary.loadedCount} loaded, ${selectionSummary.pendingCount} pending, ${selectionSummary.failedCount} failed.`;
}

function refreshMapStatusMessage(activeEntries = getActiveEntries()) {
  const kmzStatus = dashboardState.kmzPoints.statusMessage;
  const terrainStatus = dashboardState.threeDEnabled ? '3D terrain is active. ' : '';
  if (!activeEntries.length) {
    setMapStatus(`${terrainStatus}${kmzStatus ? `${kmzStatus} ` : ''}No raster set found for the selected forest / period.`, true);
    return;
  }

  const overlayMessages = [];
  overlayMessages.push(
    dashboardState.threeDEnabled
      ? '3D terrain is active.'
      : '3D terrain is ready on toggle.'
  );
  overlayMessages.push(
    dashboardState.sentinelEnabled
      ? 'Sentinel imagery is visible.'
      : 'Sentinel imagery is ready on toggle.'
  );

  if (dashboardState.escOverlay.loaded) {
    overlayMessages.push(
      dashboardState.escOverlayEnabled
        ? 'ESC overlay is visible.'
        : 'ESC overlay is ready on toggle.'
    );
  }

  if (kmzStatus) {
    overlayMessages.push(kmzStatus);
  }

  setMapStatus(`${activeEntries.length} raster set(s) selected. ${overlayMessages.join(' ')}`, Boolean(dashboardState.kmzPoints.error));
}

async function renderRasterSelection({ fitView }) {
  if (!dashboardState.mapLoaded) {
    return;
  }

  const activeEntries = getActiveEntries();
  const activeIds = new Set(activeEntries.map(entry => entry.id));

  if (!activeEntries.length) {
    hideAllRasters();
    updateEscOverlayPresentation();
    refreshMapStatusMessage(activeEntries);
    return;
  }

  await Promise.all(activeEntries.map(entry => ensureRasterLoaded(entry)));

  rasterCache.forEach((cacheEntry, id) => {
    if (!cacheEntry.layerId || !map.getLayer(cacheEntry.layerId)) {
      return;
    }

    const shouldShow = activeIds.has(id) && dashboardState.sentinelEnabled && !cacheEntry.error;
    map.setLayoutProperty(cacheEntry.layerId, 'visibility', shouldShow ? 'visible' : 'none');
  });

  const selectionSummary = buildSelectionSummary(activeEntries);
  dashboardState.selectionSummary = selectionSummary;
  updateStatCards(selectionSummary);
  renderDatasetCards(activeEntries, selectionSummary);

  if (fitView) {
    await fitMapToSelection(activeEntries);
  }

  updateEscOverlayPresentation();
  moveCorridorLayersToFront();
  moveKmzPointLayerToFront();

  refreshMapStatusMessage(activeEntries);
}

function hideAllRasters() {
  rasterCache.forEach(cacheEntry => {
    if (cacheEntry.layerId && map.getLayer(cacheEntry.layerId)) {
      map.setLayoutProperty(cacheEntry.layerId, 'visibility', 'none');
    }
  });
}

async function fitMapToSelection(activeEntries) {
  if (!activeEntries.length) {
    map.flyTo(withMapCameraMode({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM, duration: 1200 }));
    return;
  }

  const bounds = new mapboxgl.LngLatBounds();
  let coordinateCount = 0;

  activeEntries.forEach(entry => {
    const cacheEntry = rasterCache.get(entry.id);
    const coordinates = cacheEntry?.coordinates;
    if (!Array.isArray(coordinates)) {
      return;
    }
    coordinates.forEach(coord => {
      bounds.extend(coord);
      coordinateCount += 1;
    });
  });

  if (!coordinateCount) {
    map.flyTo(withMapCameraMode({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM, duration: 1200 }));
    return;
  }

  map.fitBounds(bounds, withMapCameraMode({
    padding: 48,
    duration: 1200,
    maxZoom: activeEntries.length === 1 ? 14 : 12
  }));
}

function updateSentinelButton() {
  sentinelToggleBtn.textContent = `Sentinel Imagery: ${dashboardState.sentinelEnabled ? 'On' : 'Off'}`;
  sentinelToggleBtn.classList.toggle('active-toggle', dashboardState.sentinelEnabled);
}

function updateThreeDToggleButton() {
  if (!threeDToggleBtn) {
    return;
  }

  const isActive = dashboardState.threeDEnabled;
  threeDToggleBtn.classList.toggle('is-active', isActive);
  threeDToggleBtn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  threeDToggleBtn.setAttribute('title', isActive ? '3D terrain on' : '3D terrain off');
  threeDToggleBtn.setAttribute('aria-label', isActive ? 'Turn 3D terrain off' : 'Turn 3D terrain on');
}

function updateEscToggleButton() {
  if (!escToggleBtn) {
    return;
  }

  const isActive = dashboardState.escOverlayEnabled;
  escToggleBtn.classList.toggle('is-active', isActive);
  escToggleBtn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  escToggleBtn.setAttribute('title', isActive ? 'ESC overlay on' : 'ESC overlay off');
  escToggleBtn.setAttribute('aria-label', isActive ? 'Turn ESC overlay off' : 'Turn ESC overlay on');
}

function getMaxDisplacementLabel(activeEntries) {
  if (dashboardState.kmzPoints.loaded) {
    return formatKmzSummaryNegativeVelocity();
  }

  const values = activeEntries
    .map(entry => entry.maxDisplacementLabel)
    .filter(Boolean);

  if (!values.length) {
    return 'Awaiting data';
  }

  const uniqueValues = Array.from(new Set(values));
  return uniqueValues.length === 1 ? uniqueValues[0] : uniqueValues.join(' / ');
}

function ensureHiddenCanvas(canvasId) {
  let canvas = document.getElementById(canvasId);
  if (canvas) {
    return canvas;
  }

  canvas = document.createElement('canvas');
  canvas.id = canvasId;
  document.getElementById('rasterCanvasHost').appendChild(canvas);
  return canvas;
}

function normalizePixelValue(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  if (value <= 1) {
    return Math.max(0, Math.min(255, Math.round(value * 255)));
  }
  if (value > 255) {
    const scaled = value > 4095 ? value / 16 : value / 256;
    return Math.max(0, Math.min(255, Math.round(scaled)));
  }
  return Math.max(0, Math.min(255, Math.round(value)));
}

function computeChannelStats(raster, samplesPerPixel) {
  if (!raster || !samplesPerPixel) {
    return null;
  }

  const mins = new Array(samplesPerPixel).fill(Infinity);
  const maxs = new Array(samplesPerPixel).fill(-Infinity);

  for (let index = 0; index < raster.length; index += samplesPerPixel) {
    for (let channel = 0; channel < samplesPerPixel; channel += 1) {
      const value = raster[index + channel];
      if (!Number.isFinite(value)) {
        continue;
      }
      if (value < mins[channel]) {
        mins[channel] = value;
      }
      if (value > maxs[channel]) {
        maxs[channel] = value;
      }
    }
  }

  return { mins, maxs };
}

function scaleChannelValue(value, channelIndex, stats) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const min = stats?.mins?.[channelIndex];
  const max = stats?.maxs?.[channelIndex];
  if (typeof min === 'number' && typeof max === 'number' && max > min) {
    const ratio = (value - min) / (max - min);
    return Math.max(0, Math.min(255, Math.round(ratio * 255)));
  }

  return normalizePixelValue(value);
}

function rasterToImageData(raster, samplesPerPixel, width, height, stats) {
  const output = new Uint8ClampedArray(width * height * 4);
  const directCopy = samplesPerPixel === 4 && raster?.BYTES_PER_ELEMENT === 1;

  if (directCopy) {
    output.set(raster);
    return output;
  }

  for (let i = 0, j = 0; i < raster.length; i += samplesPerPixel, j += 4) {
    const red = raster[i];
    const green = samplesPerPixel > 1 ? raster[i + 1] : raster[i];
    const blue = samplesPerPixel > 2 ? raster[i + 2] : raster[i];

    output[j] = scaleChannelValue(red, 0, stats);
    output[j + 1] = scaleChannelValue(green, Math.min(1, samplesPerPixel - 1), stats);
    output[j + 2] = scaleChannelValue(blue, Math.min(2, samplesPerPixel - 1), stats);
    output[j + 3] = 255;
  }

  return output;
}

function deriveGeoTiffCoordinates(image, fallbackBounds) {
  const bbox = image.getBoundingBox?.();
  if (Array.isArray(bbox) && bbox.length === 4 && bbox.every(Number.isFinite)) {
    return [
      [bbox[0], bbox[3]],
      [bbox[2], bbox[3]],
      [bbox[2], bbox[1]],
      [bbox[0], bbox[1]]
    ];
  }

  if (Array.isArray(fallbackBounds) && fallbackBounds.length === 4) {
    return fallbackBounds;
  }

  throw new Error('Unable to derive GeoTIFF bounds for raster.');
}

function getBoundsCenter(coordinates) {
  if (!Array.isArray(coordinates) || !coordinates.length) {
    return DEFAULT_CENTER;
  }

  const bounds = new mapboxgl.LngLatBounds();
  coordinates.forEach(coord => bounds.extend(coord));
  const center = bounds.getCenter();
  return [center.lng, center.lat];
}

async function ensureRasterLoaded(entry) {
  if (rasterPromises.has(entry.id)) {
    return rasterPromises.get(entry.id);
  }

  const loadPromise = (async () => {
    const canvasId = `${entry.id}-canvas`;
    const sourceId = `${entry.id}-source`;
    const layerId = `${entry.id}-layer`;
    const canvas = ensureHiddenCanvas(canvasId);

    try {
      const tiff = await GeoTIFF.fromUrl(entry.rasterUrl, { allowFullFile: true });
      const image = await tiff.getImage();
      const width = image.getWidth();
      const height = image.getHeight();
      const raster = await image.readRasters({ interleave: true });
      const samplesPerPixel = image.getSamplesPerPixel();
      const stats = computeChannelStats(raster, samplesPerPixel);
      const ctx = canvas.getContext('2d');

      canvas.width = width;
      canvas.height = height;

      const imageDataBuffer = rasterToImageData(raster, samplesPerPixel, width, height, stats);
      const imageData = ctx.createImageData(width, height);
      imageData.data.set(imageDataBuffer);
      ctx.putImageData(imageData, 0, 0);

      const coordinates = deriveGeoTiffCoordinates(image, entry.fallbackBounds);
      const cacheEntry = {
        ...entry,
        canvasId,
        sourceId,
        layerId,
        coordinates,
        center: getBoundsCenter(coordinates),
        loaded: true,
        error: null
      };

      rasterCache.set(entry.id, cacheEntry);
      updateCorridorForestAssignments();
      addRasterToMap(cacheEntry);
      return cacheEntry;
    } catch (error) {
      console.error(`Failed to load raster ${entry.id}`, error);
      const cacheEntry = {
        ...entry,
        canvasId,
        sourceId,
        layerId,
        coordinates: null,
        center: DEFAULT_CENTER,
        loaded: false,
        error
      };
      rasterCache.set(entry.id, cacheEntry);
      updateCorridorForestAssignments();
      return cacheEntry;
    }
  })();

  rasterPromises.set(entry.id, loadPromise);
  return loadPromise;
}

function addRasterToMap(cacheEntry) {
  if (!dashboardState.mapLoaded || cacheEntry.error || !cacheEntry.coordinates) {
    return;
  }

  if (!map.getSource(cacheEntry.sourceId)) {
    map.addSource(cacheEntry.sourceId, {
      type: 'canvas',
      canvas: cacheEntry.canvasId,
      coordinates: cacheEntry.coordinates,
      animate: false
    });
  }

  if (!map.getLayer(cacheEntry.layerId)) {
    map.addLayer({
      id: cacheEntry.layerId,
      type: 'raster',
      source: cacheEntry.sourceId,
      layout: {
        visibility: 'none'
      },
      paint: {
        'raster-opacity': 0.92
      }
    });
  }

  moveCorridorLayersToFront();
}

function scheduleRainfallRefresh() {
  clearTimeout(rainfallDebounceId);
  rainfallDebounceId = setTimeout(() => {
    const center = map.getCenter();
    loadMonthlyRainfall(center.lat, center.lng);
  }, 450);
}

async function loadMonthlyRainfall(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return;
  }

  const roundedTarget = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  if (dashboardState.rainfall.lastTarget === roundedTarget && hasRainfallChartData()) {
    updateRainfallLocationNote(lat, lng, false, dashboardState.rainfall.dataEndDate);
    return;
  }

  const requestId = ++dashboardState.rainfall.requestId;
  updateRainfallLocationNote(lat, lng, true);

  const endDate = getRainfallArchiveEndDate();
  const startDate = new Date(endDate);
  startDate.setFullYear(startDate.getFullYear() - 1);
  const endDateString = formatApiDate(endDate);
  const startDateString = formatApiDate(startDate);

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    start_date: startDateString,
    end_date: endDateString,
    daily: 'precipitation_sum',
    timezone: RAINFALL_TIMEZONE
  });
  const url = `https://archive-api.open-meteo.com/v1/archive?${params.toString()}`;
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), RAINFALL_FETCH_TIMEOUT_MS)
    : null;

  try {
    const response = await fetch(url, controller ? { signal: controller.signal } : undefined);
    const data = await response.json();
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (requestId !== dashboardState.rainfall.requestId) {
      return;
    }

    if (!response.ok) {
      throw new Error(data?.reason || `Open-Meteo returned HTTP ${response.status}`);
    }

    const dailyTimes = data?.daily?.time;
    const dailyPrecipitation = data?.daily?.precipitation_sum;
    if (!Array.isArray(dailyTimes) || !Array.isArray(dailyPrecipitation)) {
      throw new Error(data?.reason || 'Open-Meteo response did not include daily precipitation data.');
    }

    const monthlyTotals = {};
    const monthlyMax24ByPeriod = {};
    dailyTimes.forEach((dateString, index) => {
      const date = parseApiDate(dateString);
      const month = date.toLocaleString('en-NZ', { month: 'short', year: '2-digit' });
      const periodKey = typeof dateString === 'string' ? dateString.slice(0, 7) : '';
      const rainfallValue = Number(dailyPrecipitation[index]);
      if (!Number.isFinite(rainfallValue)) {
        return;
      }
      if (periodKey && !monthlyTotals[periodKey]) {
        monthlyTotals[periodKey] = {
          label: month,
          value: 0
        };
      }
      if (periodKey) {
        monthlyTotals[periodKey].value += rainfallValue;
      }
      if (periodKey && /^\d{4}-\d{2}$/.test(periodKey)) {
        monthlyMax24ByPeriod[periodKey] = Number.isFinite(monthlyMax24ByPeriod[periodKey])
          ? Math.max(monthlyMax24ByPeriod[periodKey], rainfallValue)
          : rainfallValue;
      }
    });

    const sortedPeriods = Object.keys(monthlyTotals).sort((a, b) => a.localeCompare(b));
    const sortedLabels = sortedPeriods.map(period => monthlyTotals[period].label);
    const sortedPrecipitation = sortedPeriods.map(period => Number(monthlyTotals[period].value.toFixed(2)));
    if (!sortedLabels.length || !sortedPrecipitation.length) {
      throw new Error('Open-Meteo response contained no finite rainfall values.');
    }

    dashboardState.rainfall.lastTarget = roundedTarget;
    dashboardState.rainfall.dataEndDate = endDateString;
    dashboardState.rainfall.monthlyPeriods = sortedPeriods;
    dashboardState.rainfall.monthlyLabels = sortedLabels;
    dashboardState.rainfall.monthlyValues = sortedPrecipitation;
    dashboardState.rainfall.windowed = false;
    dashboardState.rainfall.max24hrByPeriod = monthlyMax24ByPeriod;
    dashboardState.rainfall.max24hrValue = getMax24hrValueForPeriod(dashboardState.filters.periodId);

    lineChart.data.labels = [...sortedLabels];
    lineChart.data.datasets[0].data = [...sortedPrecipitation];
    lineChart.options.scales.y.max = getRainfallAxisMax(sortedPrecipitation);
    lineChart.update();
    dashboardState.rainfall.latestValue = getCurrentRainfallValue();
    if (dashboardState.selectionSummary) {
      dashboardState.selectionSummary.rainfallValue = getRainfallValueForPeriod(dashboardState.filters.periodId);
      dashboardState.selectionSummary.max24hrValue = getMax24hrValueForPeriod(dashboardState.filters.periodId);
    }

    updateRainfallLocationNote(lat, lng, false, endDateString);
  } catch (error) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (requestId !== dashboardState.rainfall.requestId) {
      return;
    }
    console.error('Error fetching monthly rainfall', error);
    const reason = error?.name === 'AbortError'
      ? `Request timed out after ${Math.round(RAINFALL_FETCH_TIMEOUT_MS / 1000)} seconds.`
      : (error?.message || 'Request failed.');
    rainfallLocationNoteEl.textContent = `Open-Meteo rainfall fetch failed for map centre ${formatLatLng(lat, lng)}. ${reason}`;
    dashboardState.rainfall.locationLabel = 'Rainfall fetch failed';
    dashboardState.rainfall.latestValue = '—';
    dashboardState.rainfall.dataEndDate = '';
    dashboardState.rainfall.max24hrByPeriod = {};
    dashboardState.rainfall.max24hrValue = null;
    clearRainfallChart();
    if (dashboardState.selectionSummary) {
      dashboardState.selectionSummary.rainfallValue = '—';
      dashboardState.selectionSummary.max24hrValue = null;
    }
  }
}

  function updateRainfallLocationNote(lat, lng, isLoading = false, dataEndDate = '') {
    const coordinateLabel = formatLatLng(lat, lng);
    const locationLabel = isLoading
      ? `Updating map centre ${coordinateLabel}`
      : `Map centre ${coordinateLabel}`;
    dashboardState.rainfall.locationLabel = locationLabel;
    if (dashboardState.selectionSummary) {
      dashboardState.selectionSummary.rainfallLabel = locationLabel;
    }
    rainfallLocationNoteEl.innerHTML = isLoading
      ? `Updating Open-Meteo modelled rainfall for ${coordinateLabel}...`
      : `Modelled monthly rainfall totals from the Open-Meteo API<br>Map centre coordinates: ${coordinateLabel}${dataEndDate ? `<br>Archive data through ${formatRainfallDataDate(dataEndDate)}` : ''}`;
  }

function formatLatLng(lat, lng) {
  return `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
}

function setMapStatus(message = '', isError = false) {
  mapStatusEl.textContent = message;
  mapStatusEl.classList.toggle('error', isError);
}

function escapeHtml(value) {
  return (value ?? '')
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getCurrentRainfallValue() {
  const labels = lineChart.data.labels || [];
  const values = lineChart.data.datasets[0]?.data || [];
  if (!labels.length || !values.length) {
    return '—';
  }
  const latestValue = values[values.length - 1];
  return `${Number(latestValue).toFixed(1)} mm`;
}

function getRainfallValueForPeriod(periodId = dashboardState.filters.periodId) {
  const labels = lineChart.data.labels || [];
  const values = lineChart.data.datasets[0]?.data || [];
  if (!labels.length || !values.length) {
    return '—';
  }

  if (typeof periodId === 'string' && /^\d{4}-\d{2}$/.test(periodId)) {
    const lookupLabel = new Date(`${periodId}-01T00:00:00`)
      .toLocaleString('default', { month: 'short', year: '2-digit' });
    const matchIndex = labels.indexOf(lookupLabel);
    if (matchIndex !== -1) {
      const matchedValue = Number(values[matchIndex]);
      if (Number.isFinite(matchedValue)) {
        return `${matchedValue.toFixed(1)} mm`;
      }
    }
  }

  const latestValue = Number(values[values.length - 1]);
  return Number.isFinite(latestValue) ? `${latestValue.toFixed(1)} mm` : '—';
}

function getMax24hrValueForPeriod(periodId = dashboardState.filters.periodId) {
  const valuesByPeriod = dashboardState.rainfall.max24hrByPeriod || {};

  if (typeof periodId === 'string' && /^\d{4}-\d{2}$/.test(periodId)) {
    const matchedValue = Number(valuesByPeriod[periodId]);
    return Number.isFinite(matchedValue) ? Number(matchedValue.toFixed(1)) : null;
  }

  const orderedPeriods = Object.keys(valuesByPeriod).sort((a, b) => a.localeCompare(b));
  const latestPeriod = orderedPeriods[orderedPeriods.length - 1];
  const latestValue = Number(valuesByPeriod[latestPeriod]);
  return Number.isFinite(latestValue) ? Number(latestValue.toFixed(1)) : null;
}

function getMapFocusLabel(selectionSummary = dashboardState.selectionSummary) {
  return selectionSummary?.selectionScope || 'Estate overview';
}

function getKmzVisibleFeaturesForReporting() {
  if (!dashboardState.kmzPoints.loaded || !dashboardState.kmzPoints.geojson) {
    return [];
  }

  const displayFeatures = getKmzDisplayGeoJson(dashboardState.kmzPoints.geojson).features || [];
  const thresholdedFeatures = displayFeatures.filter(feature => kmzFeaturePassesCurrentThreshold(feature));
  return thresholdedFeatures.length ? thresholdedFeatures : displayFeatures;
}

function getKmzReportingWindow() {
  const dates = dashboardState.kmzPoints.dates || [];
  if (!dashboardState.kmzPoints.loaded || dates.length < 2) {
    return null;
  }

  const referenceIndex = coerceKmzReferenceIndex(dashboardState.kmzPoints.referenceIndex, dates);
  const cutoffIndex = Math.max(referenceIndex, coerceKmzCutoffIndex(dashboardState.kmzPoints.cutoffIndex, dates));
  const referenceDate = dates[referenceIndex] || '';
  const cutoffDate = dates[cutoffIndex] || '';
  const referenceMs = parseKmzDateMs(referenceDate);
  const cutoffMs = parseKmzDateMs(cutoffDate);
  const acquisitionCount = Math.max(0, cutoffIndex - referenceIndex + 1);
  const revisitCount = Math.max(0, acquisitionCount - 1);
  const avgIntervalDays = revisitCount > 0 && Number.isFinite(referenceMs) && Number.isFinite(cutoffMs)
    ? (cutoffMs - referenceMs) / (revisitCount * 24 * 60 * 60 * 1000)
    : null;
  const periodId = /^\d{4}-\d{2}-\d{2}$/.test(cutoffDate) ? cutoffDate.slice(0, 7) : null;

  return {
    rangeLabel: getKmzReferenceRangeLabel(dates, referenceIndex, cutoffIndex),
    periodId,
    revisitCount,
    avgIntervalDays: Number.isFinite(avgIntervalDays) ? Number(avgIntervalDays.toFixed(1)) : null
  };
}

function getKmzReportMetrics() {
  const features = getKmzVisibleFeaturesForReporting();
  if (!features.length) {
    return {
      relativeDisplacementCm: null,
      maxVelocityCmYr: null,
      medianTemporalCoherence: null
    };
  }

  let relativeDisplacementCm = null;
  const coherenceValues = [];
  const pointMetrics = getKmzPointMetrics(features);

  features.forEach(feature => {
    const displacementValue = Number(feature?.properties?.displacement_cm);
    if (Number.isFinite(displacementValue)) {
      if (relativeDisplacementCm === null || Math.abs(displacementValue) > Math.abs(relativeDisplacementCm)) {
        relativeDisplacementCm = displacementValue;
      }
    }

    const coherenceValue = Number(feature?.properties?.temporal_coherence);
    if (Number.isFinite(coherenceValue)) {
      coherenceValues.push(coherenceValue);
    }
  });

  const sortedCoherenceValues = coherenceValues.sort((a, b) => a - b);
  return {
    relativeDisplacementCm,
    maxVelocityCmYr: pointMetrics.maxNegativeVelocityCmYr,
    medianTemporalCoherence: quantileSorted(sortedCoherenceValues, 0.5)
  };
}

function populateModalAutoFields() {
  const selectionSummary = buildSelectionSummary(getActiveEntries());
  dashboardState.selectionSummary = selectionSummary;
  const kmzWindow = getKmzReportingWindow();
  const kmzMetrics = getKmzReportMetrics();
  const rainfallPeriodId = kmzWindow?.periodId || dashboardState.filters.periodId;
  const rainfallValue = getRainfallValueForPeriod(rainfallPeriodId);
  const max24hrValue = getMax24hrValueForPeriod(rainfallPeriodId);
  const relativeDisplacementLabel = Number.isFinite(kmzMetrics.relativeDisplacementCm)
    ? `${Number(kmzMetrics.relativeDisplacementCm).toFixed(2)} cm`
    : selectionSummary.maxDisplacement;
  const maxVelocityLabel = Number.isFinite(kmzMetrics.maxVelocityCmYr)
    ? formatVelocityCmYr(kmzMetrics.maxVelocityCmYr)
    : selectionSummary.maxDisplacement;

  document.getElementById('rpt_forest').value = selectionSummary.forestLabel;
  document.getElementById('rpt_month').value = kmzWindow?.rangeLabel || selectionSummary.periodLabel;
  document.getElementById('rpt_total').value = String(selectionSummary.activeRasterCount);
  document.getElementById('rpt_remediated').value = relativeDisplacementLabel;
  document.getElementById('rpt_watching').value = selectionSummary.overlayLabel;
  document.getElementById('rpt_rainfall').value = rainfallValue;
  document.getElementById('rpt_max_velocity').value = maxVelocityLabel;
  document.getElementById('rpt_recurring').value = getMapFocusLabel(selectionSummary);
  document.getElementById('rpt_max24hr').value = Number.isFinite(max24hrValue)
    ? Number(max24hrValue).toFixed(1)
    : '';

  document.getElementById('rpt_area').value = selectionSummary.reportAreaHa || '';
  const satRevisitsEl = document.getElementById('rpt_sat_revisits');
  const satIntervalEl = document.getElementById('rpt_sat_interval');

  satRevisitsEl.readOnly = false;
  satRevisitsEl.classList.remove('field-readonly');
  satIntervalEl.readOnly = false;
  satIntervalEl.classList.remove('field-readonly');
  satRevisitsEl.value = Number.isFinite(kmzWindow?.revisitCount)
    ? String(kmzWindow.revisitCount)
    : '';
  satIntervalEl.value = Number.isFinite(kmzWindow?.avgIntervalDays)
    ? Number(kmzWindow.avgIntervalDays).toFixed(1)
    : '';

  const satCohEl = document.getElementById('rpt_sat_coherence');
  satCohEl.value = Number.isFinite(kmzMetrics.medianTemporalCoherence)
    ? Number(kmzMetrics.medianTemporalCoherence).toFixed(2)
    : '0.7';
  satCohEl.readOnly = true;
  satCohEl.classList.add('field-readonly');
}

const reportModal = document.getElementById('reportModal');
const modalStatusEl = document.getElementById('modalStatus');
const generatePdfBtn = document.getElementById('generatePdfBtn');
let reportAssetsPromise = null;

function parseCssColorToRgb(value, fallback = [31, 41, 55]) {
  const color = String(value || '').trim();
  const hexMatch = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    const hex = hexMatch[1].length === 3
      ? hexMatch[1].split('').map(char => char + char).join('')
      : hexMatch[1];
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16)
    ];
  }

  const rgbMatch = color.match(/^rgba?\(([^)]+)\)$/i);
  if (rgbMatch) {
    const channels = rgbMatch[1]
      .split(',')
      .slice(0, 3)
      .map(channel => Number.parseFloat(channel));
    if (channels.length === 3 && channels.every(Number.isFinite)) {
      return channels.map(channel => Math.max(0, Math.min(255, Math.round(channel))));
    }
  }

  return fallback;
}

function getMapLegendSnapshot() {
  const legendEl = document.querySelector('.kmz-legend');
  if (!legendEl) {
    return null;
  }

  const legendStyle = getComputedStyle(legendEl);
  const titleEl = legendEl.querySelector('.kmz-legend-title');
  const subtitleEl = legendEl.querySelector('.kmz-legend-subtitle');
  const itemEls = Array.from(legendEl.querySelectorAll('.kmz-legend-item'));
  const items = itemEls
    .map(itemEl => {
      const swatchEl = itemEl.querySelector('.kmz-swatch');
      const labelEl = Array.from(itemEl.querySelectorAll('span')).find(span => !span.classList.contains('kmz-swatch'));
      const swatchStyle = swatchEl ? getComputedStyle(swatchEl) : null;
      return {
        label: labelEl?.textContent?.trim() || itemEl.textContent.trim(),
        color: parseCssColorToRgb(swatchStyle?.backgroundColor, [47, 156, 244]),
        borderColor: parseCssColorToRgb(swatchStyle?.borderColor, [255, 255, 255])
      };
    })
    .filter(item => item.label);

  if (!items.length) {
    return null;
  }

  return {
    title: titleEl?.textContent?.trim() || 'Map legend',
    subtitle: subtitleEl?.textContent?.trim() || '',
    backgroundColor: parseCssColorToRgb(legendStyle.backgroundColor, [27, 30, 35]),
    borderColor: parseCssColorToRgb(legendStyle.borderColor, [74, 81, 92]),
    titleColor: parseCssColorToRgb(titleEl ? getComputedStyle(titleEl).color : '', [247, 249, 252]),
    subtitleColor: parseCssColorToRgb(subtitleEl ? getComputedStyle(subtitleEl).color : '', [185, 193, 204]),
    textColor: parseCssColorToRgb(itemEls[0] ? getComputedStyle(itemEls[0]).color : '', [230, 235, 241]),
    items
  };
}

function loadImageDataUrl(src) {
  return fetch(src)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Unable to load report asset: ${src}`);
      }
      return response.blob();
    })
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => resolve(event.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }));
}

function loadReportAssets() {
  if (!reportAssetsPromise) {
    reportAssetsPromise = Promise.allSettled([
      loadImageDataUrl('./globev2.png'),
      loadImageDataUrl('./mnr_Crop.PNG')
    ]).then(([infraLogo, mnrLogo]) => ({
      infraLogo: infraLogo.status === 'fulfilled' ? infraLogo.value : null,
      mnrLogo: mnrLogo.status === 'fulfilled' ? mnrLogo.value : null
    }));
  }

  return reportAssetsPromise;
}

document.getElementById('downloadPdfBtn').addEventListener('click', () => {
  populateModalAutoFields();
  reportModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
});

document.getElementById('modalClose').addEventListener('click', closeReportModal);
document.getElementById('modalCancelBtn').addEventListener('click', closeReportModal);

document.getElementById('optionalToggle').addEventListener('click', () => {
  const section = document.getElementById('optionalSection');
  const opening = section.style.display === 'none';
  section.style.display = opening ? '' : 'none';
  document.getElementById('optionalToggle').textContent = opening
    ? '▲ Hide optional details'
    : '▼ Optional details';
});
reportModal.addEventListener('click', (event) => {
  if (event.target === reportModal) {
    closeReportModal();
  }
});

function closeReportModal() {
  reportModal.style.display = 'none';
  document.body.style.overflow = '';
  setModalStatus('');
}

function setModalStatus(message, isError = false) {
  modalStatusEl.textContent = message;
  modalStatusEl.style.color = isError ? '#ff8a8a' : '#c2c8d0';
}

document.getElementById('mapImageInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    mapImageDataUrl = loadEvent.target.result;
    const preview = document.getElementById('mapPreview');
    preview.src = mapImageDataUrl;
    preview.style.display = 'block';
    document.getElementById('uploadPlaceholder').style.display = 'none';
    document.getElementById('clearMapBtn').style.display = 'inline-flex';
  };
  reader.readAsDataURL(file);
});

document.getElementById('clearMapBtn').addEventListener('click', () => {
  mapImageDataUrl = null;
  const preview = document.getElementById('mapPreview');
  preview.style.display = 'none';
  preview.src = '';
  document.getElementById('uploadPlaceholder').style.display = '';
  document.getElementById('clearMapBtn').style.display = 'none';
  document.getElementById('mapImageInput').value = '';
});

document.getElementById('reportPhotoInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    reportPhotoDataUrl = loadEvent.target.result;
    const preview = document.getElementById('photoPreview');
    preview.src = reportPhotoDataUrl;
    preview.style.display = 'block';
    document.getElementById('photoUploadPlaceholder').style.display = 'none';
    document.getElementById('clearPhotoBtn').style.display = 'inline-flex';
  };
  reader.readAsDataURL(file);
});

document.getElementById('clearPhotoBtn').addEventListener('click', () => {
  reportPhotoDataUrl = null;
  const preview = document.getElementById('photoPreview');
  preview.style.display = 'none';
  preview.src = '';
  document.getElementById('photoUploadPlaceholder').style.display = '';
  document.getElementById('clearPhotoBtn').style.display = 'none';
  document.getElementById('reportPhotoInput').value = '';
});

generatePdfBtn.addEventListener('click', async () => {
  setModalStatus('Preparing report assets...');
  generatePdfBtn.disabled = true;

  try {
    let resolvedMapDataUrl, mapNaturalW, mapNaturalH, mapLat = null, mapZoom = null;
    if (mapImageDataUrl) {
      resolvedMapDataUrl = mapImageDataUrl;
      const preview = document.getElementById('mapPreview');
      mapNaturalW = preview.naturalWidth;
      mapNaturalH = preview.naturalHeight;
    } else {
      const mapCanvas = map.getCanvas();
      mapNaturalW = mapCanvas.width;
      mapNaturalH = mapCanvas.height;
      mapLat = map.getCenter().lat;
      mapZoom = map.getZoom();
      resolvedMapDataUrl = await new Promise((resolve) => {
        map.once('render', () => resolve(map.getCanvas().toDataURL('image/png')));
        map.triggerRepaint();
      });
    }
    const reportAssets = await loadReportAssets();
    buildPDF(resolvedMapDataUrl, mapNaturalW, mapNaturalH, reportAssets, mapLat, mapZoom);
    setModalStatus('PDF downloaded successfully.');
    setTimeout(() => setModalStatus(''), 3500);
  } catch (error) {
    console.error('PDF generation error', error);
    setModalStatus('Error generating PDF. See console for details.', true);
  } finally {
    generatePdfBtn.disabled = false;
  }
});

function buildPDF(mapDataUrl, mapNaturalW, mapNaturalH, reportAssets = {}, mapLat = null, mapZoom = null) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a3' });
  const selectionSummary = dashboardState.selectionSummary || buildSelectionSummary(getActiveEntries());

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 8;
  const gap = 4;
  const headerHeight = 28;
  const footerHeight = 8;
  const bodyTop = margin + headerHeight;
  const footerTop = pageHeight - margin - footerHeight;
  const bottomHeight = 72;
  const mainHeight = footerTop - bodyTop - bottomHeight - gap;
  const mapWidth = 246;
  const sidebarX = margin + mapWidth + gap;
  const sidebarWidth = pageWidth - sidebarX - margin;
  const bottomY = bodyTop + mainHeight + gap;
  const bottomCardWidth = (pageWidth - margin * 2 - gap * 2) / 3;

  const colors = {
    accent: [211, 22, 133],
    accentSoft: [255, 236, 247],
    text: [16, 24, 40],
    muted: [78, 88, 104],
    softText: [102, 112, 133],
    border: [218, 225, 235],
    paleBorder: [236, 240, 246],
    cardFill: [255, 255, 255],
    softFill: [248, 250, 252],
    rule: [207, 215, 226],
    chartGrid: [226, 232, 240]
  };

  const field = (id, fallback = '-') => {
    const value = document.getElementById(id)?.value?.trim();
    return value || fallback;
  };

  const forestName = field('rpt_forest', 'Estate');
  const monthName = field('rpt_month', 'Report');
  const rasterCount = field('rpt_total');
  const maxDisplacement = field('rpt_remediated');
  const sentinelState = field('rpt_watching');
  const rainfall = field('rpt_rainfall');
  const maxVelocityPerYear = field('rpt_max_velocity');
  const mapFocus = field('rpt_recurring');
  const max24hr = field('rpt_max24hr');
  const siteVisits = field('rpt_sitevisits');
  const remRec = field('rpt_remediationrecorded');
  const area = field('rpt_area');
  const userNotes = field('rpt_notes', '');
  const satRev = field('rpt_sat_revisits');
  const satInt = field('rpt_sat_interval');
  const satCoh = field('rpt_sat_coherence');
  const thresholdOption = getKmzThresholdOption();
  const thresholdValue = dashboardState.kmzPoints.thresholdValueCmYr;
  const displacementThreshold = thresholdOption.id === 'all'
    ? thresholdOption.label
    : (Number.isFinite(thresholdValue)
      ? `${thresholdOption.label} (<= ${formatVelocityCmYr(thresholdValue)})`
      : thresholdOption.label);
  const layerTypes = selectionSummary.layerTypes.join(', ') || '—';
  const sourceSummary = selectionSummary.sourceSummary || '—';
  const hasReportPhoto = Boolean(reportPhotoDataUrl);
  const reportPhotoPreviewEl = document.getElementById('photoPreview');
  const reportPhotoNaturalW = reportPhotoPreviewEl?.naturalWidth || null;
  const reportPhotoNaturalH = reportPhotoPreviewEl?.naturalHeight || null;
  const rainfallLocation = selectionSummary.rainfallLabel || 'Map centre';
  const lineCanvas = document.getElementById('lineChart');
  const timeSeriesCanvas = document.getElementById('kmzTimeSeriesChart');
  const rainfallChartData = captureChartImage(lineChart, lineCanvas);
  const timeSeriesChartData = captureChartImage(kmzTimeSeriesChart, timeSeriesCanvas);

  function applyColor(method, rgb) {
    doc[method](rgb[0], rgb[1], rgb[2]);
  }

  function isBlank(value) {
    return !value || value === '-' || value === '—';
  }

  function withUnit(value, unit) {
    if (isBlank(value)) {
      return '-';
    }
    return /[a-zA-Z%]/.test(value) ? value : `${value} ${unit}`;
  }

  function drawCard(x, y, w, h, options = {}) {
    applyColor('setFillColor', options.fill || colors.cardFill);
    applyColor('setDrawColor', options.border || colors.border);
    doc.setLineWidth(options.lineWidth || 0.35);
    const radius = options.radius ?? 2;
    if (typeof doc.roundedRect === 'function' && radius > 0) {
      doc.roundedRect(x, y, w, h, radius, radius, 'FD');
    } else {
      doc.rect(x, y, w, h, 'FD');
    }
  }

  function drawLogoImage(dataUrl, x, y, w, h, fallbackText = '') {
    if (dataUrl) {
      const format = dataUrl.startsWith('data:image/jpeg') ? 'JPEG' : 'PNG';
      doc.addImage(dataUrl, format, x, y, w, h, undefined, 'FAST');
      return;
    }

    if (fallbackText) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      applyColor('setTextColor', colors.accent);
      doc.text(fallbackText, x + w / 2, y + h / 2 + 2, { align: 'center' });
    }
  }

  function drawIconMark(type, x, y, size = 5) {
    applyColor('setDrawColor', colors.accent);
    applyColor('setTextColor', colors.accent);
    doc.setLineWidth(0.55);

    if (type === 'forest') {
      // Two stylized trees
      const drawTree = (tx, ty, s) => {
        doc.line(tx + s * 0.5, ty, tx, ty + s * 0.75);
        doc.line(tx + s * 0.5, ty, tx + s, ty + s * 0.75);
        doc.line(tx, ty + s * 0.75, tx + s, ty + s * 0.75);
        doc.line(tx + s * 0.5, ty + s * 0.75, tx + s * 0.5, ty + s);
      };
      drawTree(x, y + size * 0.1, size * 0.7);
      drawTree(x + size * 0.4, y + size * 0.25, size * 0.6);
      return;
    }

    if (type === 'calendar') {
      // Calendar frame with top bar
      doc.rect(x, y + size * 0.2, size, size * 0.8, 'S');
      doc.rect(x, y, size, size * 0.2, 'S');
      // Grid lines
      doc.line(x + size * 0.33, y + size * 0.45, x + size * 0.33, y + size * 0.8);
      doc.line(x + size * 0.66, y + size * 0.45, x + size * 0.66, y + size * 0.8);
      doc.line(x + size * 0.15, y + size * 0.55, x + size * 0.85, y + size * 0.55);
      return;
    }

    if (type === 'area') {
      // Solid map pin with a small white center
      const cx = x + size * 0.5;
      const cy = y + size * 0.35;
      const r = size * 0.35;
      
      applyColor('setFillColor', colors.accent);
      // Draw head and pointy bit as solid shapes
      doc.circle(cx, cy, r, 'F'); 
      doc.triangle(cx - r * 0.82, cy + r * 0.4, cx + r * 0.82, cy + r * 0.4, cx, y + size, 'F');
      
      // Draw the small inner "hole" in white
      doc.setFillColor(255, 255, 255);
      doc.circle(cx, cy, r * 0.35, 'F');
      return;
    }

    if (type === 'pulse') {
      // Professional ECG waveform
      doc.line(x, y + size * 0.5, x + size * 0.15, y + size * 0.5);
      doc.line(x + size * 0.15, y + size * 0.5, x + size * 0.25, y + size * 0.1);
      doc.line(x + size * 0.25, y + size * 0.1, x + size * 0.45, y + size * 0.95);
      doc.line(x + size * 0.45, y + size * 0.95, x + size * 0.6, y + size * 0.35);
      doc.line(x + size * 0.6, y + size * 0.35, x + size * 0.75, y + size * 0.5);
      doc.line(x + size * 0.75, y + size * 0.5, x + size, y + size * 0.5);
      return;
    }

    if (type === 'rain') {
      // Draw a simple cloud with rain
      doc.circle(x + size * 0.3, y + size * 0.4, size * 0.25, 'S');
      doc.circle(x + size * 0.5, y + size * 0.25, size * 0.25, 'S');
      doc.circle(x + size * 0.7, y + size * 0.4, size * 0.25, 'S');
      doc.line(x + size * 0.3, y + size * 0.7, x + size * 0.2, y + size * 0.9);
      doc.line(x + size * 0.5, y + size * 0.7, x + size * 0.4, y + size * 0.9);
      doc.line(x + size * 0.7, y + size * 0.7, x + size * 0.6, y + size * 0.9);
      return;
    }

    if (type === 'sat') {
      // Professional satellite icon
      const cx = x + size * 0.5;
      const cy = y + size * 0.5;
      // Solar panels
      doc.rect(x, cy - size * 0.1, size * 0.3, size * 0.2, 'S');
      doc.rect(x + size * 0.7, cy - size * 0.1, size * 0.3, size * 0.2, 'S');
      // Body
      doc.rect(cx - size * 0.15, cy - size * 0.2, size * 0.3, size * 0.4, 'S');
      // Dish/antenna
      doc.line(cx, cy + size * 0.2, cx, cy + size * 0.4);
      doc.ellipse(cx, cy + size * 0.4, size * 0.2, size * 0.1, 'S');
      return;
    }

    if (type === 'alert') {
      // Draw a triangle
      doc.triangle(x + size * 0.5, y, x, y + size, x + size, y + size, 'S');
      // Draw exclamation mark
      doc.line(x + size * 0.5, y + size * 0.3, x + size * 0.5, y + size * 0.65);
      doc.circle(x + size * 0.5, y + size * 0.85, 0.2, 'FD');
      return;
    }

    if (type === 'stack') {
      const rx = size * 0.45;
      const ry = size * 0.12;
      for (let i = 0; i < 3; i++) {
        const ey = y + size * 0.2 + i * (size * 0.28);
        doc.ellipse(x + size * 0.5, ey, rx, ry, 'S');
        if (i < 2) {
          doc.line(x + size * 0.5 - rx, ey, x + size * 0.5 - rx, ey + size * 0.28);
          doc.line(x + size * 0.5 + rx, ey, x + size * 0.5 + rx, ey + size * 0.28);
        }
      }
      return;
    }

    if (type === 'imagery') {
      // Document frame
      doc.rect(x + size * 0.1, y, size * 0.8, size, 'S');
      // Mountain-ish zig-zag
      doc.line(x + size * 0.1, y + size * 0.8, x + size * 0.4, y + size * 0.5);
      doc.line(x + size * 0.4, y + size * 0.5, x + size * 0.6, y + size * 0.7);
      doc.line(x + size * 0.6, y + size * 0.7, x + size * 0.9, y + size * 0.4);
      // Sun/Circle
      doc.circle(x + size * 0.7, y + size * 0.25, size * 0.1, 'S');
      return;
    }

    if (type === 'cog') {
      const cx = x + size * 0.5;
      const cy = y + size * 0.5;
      const rInner = size * 0.15;
      const rOuter = size * 0.35;
      doc.circle(cx, cy, rInner, 'S');
      for (let i = 0; i < 8; i++) {
        const ang = (i * 45) * Math.PI / 180;
        const sa = ang - 0.2;
        const ea = ang + 0.2;
        doc.line(cx + Math.cos(sa) * rOuter, cy + Math.sin(sa) * rOuter, cx + Math.cos(ea) * rOuter, cy + Math.sin(ea) * rOuter);
        doc.line(cx + Math.cos(sa) * rOuter, cy + Math.sin(sa) * rOuter, cx + Math.cos(sa) * (rOuter + size * 0.1), cy + Math.sin(sa) * (rOuter + size * 0.1));
        doc.line(cx + Math.cos(ea) * rOuter, cy + Math.sin(ea) * rOuter, cx + Math.cos(ea) * (rOuter + size * 0.1), cy + Math.sin(ea) * (rOuter + size * 0.1));
        doc.line(cx + Math.cos(sa) * (rOuter + size * 0.1), cy + Math.sin(sa) * (rOuter + size * 0.1), cx + Math.cos(ea) * (rOuter + size * 0.1), cy + Math.sin(ea) * (rOuter + size * 0.1));
      }
      return;
    }

    if (type === 'search_doc') {
      // Document with magnifying glass at bottom right
      doc.rect(x + size * 0.1, y, size * 0.65, size * 0.8, 'S');
      const mcx = x + size * 0.75;
      const mcy = y + size * 0.75;
      doc.circle(mcx, mcy, size * 0.2, 'S');
      doc.line(mcx + size * 0.14, mcy + size * 0.14, x + size, y + size);
      return;
    }

    if (type === 'doc_only') {
      doc.rect(x + size * 0.15, y, size * 0.7, size, 'S');
      // Dog-ear corner
      doc.line(x + size * 0.6, y, x + size * 0.85, y + size * 0.25);
      doc.line(x + size * 0.3, y + size * 0.4, x + size * 0.7, y + size * 0.4);
      doc.line(x + size * 0.3, y + size * 0.6, x + size * 0.7, y + size * 0.6);
      doc.line(x + size * 0.3, y + size * 0.8, x + size * 0.7, y + size * 0.8);
      return;
    }
    
    if (type === 'clipboard') {
      // The "Magenta Canister" icon for operational notes
      doc.rect(x + size * 0.15, y + size * 0.2, size * 0.7, size * 0.8, 'S');
      // Top cap/nozzle
      doc.rect(x + size * 0.35, y, size * 0.3, size * 0.2, 'S');
      // Scale lines inside
      doc.line(x + size * 0.15, y + size * 0.4, x + size * 0.85, y + size * 0.4);
      doc.line(x + size * 0.35, y + size * 0.55, x + size * 0.65, y + size * 0.55);
      doc.line(x + size * 0.35, y + size * 0.72, x + size * 0.65, y + size * 0.72);
      doc.line(x + size * 0.35, y + size * 0.9, x + size * 0.65, y + size * 0.9);
      return;
    }

    if (type === 'image') {
      doc.rect(x, y, size, size, 'S');
      doc.circle(x + size * 0.7, y + size * 0.3, size * 0.15, 'S');
      doc.line(x, y + size * 0.7, x + size * 0.3, y + size * 0.4);
      doc.line(x + size * 0.3, y + size * 0.4, x + size * 0.6, y + size * 0.8);
      doc.line(x + size * 0.6, y + size * 0.8, x + size * 0.8, y + size * 0.6);
      doc.line(x + size * 0.8, y + size * 0.6, x + size, y + size * 0.85);
      return;
    }

    if (type === 'gear') {
      const cx = x + size * 0.5;
      const cy = y + size * 0.5;
      doc.circle(cx, cy, size * 0.25, 'S');
      for (let i = 0; i < 8; i++) {
        const ang = (i * 45) * Math.PI / 180;
        doc.line(
          cx + Math.cos(ang) * size * 0.25, cy + Math.sin(ang) * size * 0.25,
          cx + Math.cos(ang) * size * 0.45, cy + Math.sin(ang) * size * 0.45
        );
      }
      return;
    }

    if (type === 'database_search') {
      const ry = size * 0.12;
      const rx = size * 0.4;
      for (let i = 0; i < 3; i++) {
        doc.ellipse(x + size * 0.4, y + size * 0.2 + i * (size * 0.25), rx, ry, 'S');
      }
      doc.circle(x + size * 0.8, y + size * 0.8, size * 0.2, 'S');
      doc.line(x + size * 0.9, y + size * 0.9, x + size, y + size);
      return;
    }

    if (type === 'file') {
      doc.rect(x + size * 0.1, y, size * 0.8, size, 'S');
      doc.line(x + size * 0.3, y + size * 0.3, x + size * 0.7, y + size * 0.3);
      doc.line(x + size * 0.3, y + size * 0.5, x + size * 0.7, y + size * 0.5);
      doc.line(x + size * 0.3, y + size * 0.7, x + size * 0.7, y + size * 0.7);
      return;
    }

    doc.circle(x + size / 2, y + size / 2, size / 2);
  }

  function drawMetricCard(x, y, w, h, label, value, icon = 'pulse') {
    drawCard(x, y, w, h, { fill: colors.cardFill, border: colors.border, lineWidth: 0.28, radius: 2 });
    drawIconMark(icon, x + 4, y + 4, 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    applyColor('setTextColor', colors.softText);
    const labelLines = doc.splitTextToSize(String(label), w - 12).slice(0, 2);
    doc.text(labelLines, x + 4, y + 14, { lineHeightFactor: 1.05 });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    applyColor('setTextColor', colors.text);
    const lines = doc.splitTextToSize(String(value || '-'), w - 8).slice(0, 2);
    doc.text(lines, x + 4, y + h - 5.5, { lineHeightFactor: 1.05 });
  }

  function drawSectionTitle(x, y, title, width, icon = null) {
    if (icon) {
      drawIconMark(icon, x, y - 4.3, 5);
      x += 8;
      width -= 8;
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    applyColor('setTextColor', colors.accent);
    doc.text(title, x, y);
    applyColor('setDrawColor', colors.paleBorder);
    doc.setLineWidth(0.22);
    doc.line(x, y + 2.5, x + width, y + 2.5);
  }

  function drawBullets(x, startY, lines, maxWidth, options = {}) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(options.fontSize || 6.7);
    applyColor('setTextColor', options.color || colors.text);
    const lineHeight = options.lineHeight || 4.1;
    let y = startY;

    lines.filter(Boolean).forEach(line => {
      const wrapped = doc.splitTextToSize(String(line), maxWidth - 4);
      applyColor('setTextColor', options.bulletColor || colors.accent);
      doc.circle(x + 0.8, y - 1.1, 0.55, 'S');
      applyColor('setTextColor', options.color || colors.text);
      doc.text(wrapped, x + 3.6, y, { lineHeightFactor: 1.12 });
      y += Math.max(lineHeight, wrapped.length * lineHeight) + 1.1;
    });

    return y;
  }

  function fitImage(dataUrl, naturalW, naturalH, boxX, boxY, boxW, boxH) {
    if (!dataUrl) {
      applyColor('setFillColor', colors.softFill);
      applyColor('setDrawColor', colors.paleBorder);
      doc.rect(boxX, boxY, boxW, boxH, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      applyColor('setTextColor', colors.softText);
      doc.text('Image unavailable', boxX + boxW / 2, boxY + boxH / 2, { align: 'center' });
      return { x: boxX, y: boxY, w: boxW, h: boxH };
    }

    const imageAspect = naturalW && naturalH ? naturalW / naturalH : boxW / boxH;
    const boxAspect = boxW / boxH;
    let drawW = boxW;
    let drawH = boxH;
    if (imageAspect > boxAspect) {
      drawH = boxW / imageAspect;
    } else {
      drawW = boxH * imageAspect;
    }
    const drawX = boxX + (boxW - drawW) / 2;
    const drawY = boxY + (boxH - drawH) / 2;
    const format = dataUrl.startsWith('data:image/jpeg') ? 'JPEG' : 'PNG';
    doc.addImage(dataUrl, format, drawX, drawY, drawW, drawH, undefined, 'FAST');
    return { x: drawX, y: drawY, w: drawW, h: drawH };
  }

  function captureChartImage(chart, canvas) {
    if (!chart || !canvas) {
      return null;
    }

    const legendLabels = chart.options.plugins?.legend?.labels;
    const legendColor = legendLabels?.color;
    const scaleSnapshots = Object.entries(chart.options.scales || {}).map(([key, scale]) => ({
      key,
      tickColor: scale.ticks?.color,
      titleColor: scale.title?.color,
      gridColor: scale.grid?.color
    }));

    if (legendLabels) {
      legendLabels.color = '#374151';
    }
    Object.values(chart.options.scales || {}).forEach(scale => {
      if (scale.ticks) {
        scale.ticks.color = '#4b5563';
      }
      if (scale.title) {
        scale.title.color = '#4b5563';
      }
      if (scale.grid) {
        scale.grid.color = '#e5e7eb';
      }
    });

    let dataUrl = null;
    try {
      try { chart.update('none'); } catch (e) { console.warn('captureChartImage: update failed before capture', e); }
      dataUrl = canvas.toDataURL('image/png');
    } finally {
      if (legendLabels) {
        legendLabels.color = legendColor;
      }
      scaleSnapshots.forEach(snapshot => {
        const scale = chart.options.scales?.[snapshot.key];
        if (!scale) {
          return;
        }
        if (scale.ticks) {
          scale.ticks.color = snapshot.tickColor;
        }
        if (scale.title) {
          scale.title.color = snapshot.titleColor;
        }
        if (scale.grid) {
          scale.grid.color = snapshot.gridColor;
        }
      });
      try { chart.update('none'); } catch (e) { console.warn('captureChartImage: update failed after restore', e); }
    }

    return dataUrl;
  }

  function drawMapLegend(legend, imageBounds) {
    if (!legend || !imageBounds || imageBounds.w < 32 || imageBounds.h < 24) {
      return;
    }

    const minWidth = 46;
    const maxWidth = Math.min(76, imageBounds.w - 8);
    const padX = 3.4;
    const padTop = 3.2;
    const padBottom = 3.2;
    const swatch = 3;
    const rowHeight = 4.5;
    const titleLineHeight = 3.4;
    const subtitleLineHeight = 3;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    const titleWidth = doc.getTextWidth(legend.title);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    const subtitleWidth = legend.subtitle ? doc.getTextWidth(legend.subtitle) : 0;

    doc.setFontSize(6.6);
    const itemWidth = legend.items.reduce((max, item) => {
      return Math.max(max, swatch + 2.1 + doc.getTextWidth(item.label));
    }, 0);

    const legendW = Math.max(minWidth, Math.min(maxWidth, Math.max(titleWidth, subtitleWidth, itemWidth) + padX * 2));
    const titleLines = doc.splitTextToSize(legend.title, legendW - padX * 2);
    const subtitleLines = legend.subtitle ? doc.splitTextToSize(legend.subtitle, legendW - padX * 2) : [];
    const legendH = padTop
      + titleLines.length * titleLineHeight
      + (subtitleLines.length ? subtitleLines.length * subtitleLineHeight + 1.3 : 1.1)
      + legend.items.length * rowHeight
      + padBottom;

    const legendX = imageBounds.x + imageBounds.w - legendW - 5;
    const legendY = imageBounds.y + imageBounds.h - legendH - 5;

    applyColor('setFillColor', colors.cardFill);
    applyColor('setDrawColor', colors.border);
    doc.setLineWidth(0.22);
    if (typeof doc.roundedRect === 'function') {
      doc.roundedRect(legendX, legendY, legendW, legendH, 1.8, 1.8, 'FD');
    } else {
      doc.rect(legendX, legendY, legendW, legendH, 'FD');
    }

    let y = legendY + padTop + 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.0);
    applyColor('setTextColor', colors.text);
    doc.text(titleLines, legendX + padX, y, { lineHeightFactor: 1.05 });
    y += titleLines.length * titleLineHeight;

    if (subtitleLines.length) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      applyColor('setTextColor', colors.softText);
      doc.text(subtitleLines, legendX + padX, y, { lineHeightFactor: 1.05 });
      y += subtitleLines.length * subtitleLineHeight + 1.5;
    } else {
      y += 1.2;
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.0);
    applyColor('setTextColor', colors.text);
    legend.items.forEach(item => {
      const swatchY = y - swatch + 0.6;
      applyColor('setFillColor', item.color);
      applyColor('setDrawColor', colors.rule);
      doc.setLineWidth(0.16);
      doc.rect(legendX + padX, swatchY, swatch, swatch, 'FD');
      applyColor('setTextColor', colors.text);
      doc.text(item.label, legendX + padX + swatch + 2.1, y);
      y += rowHeight;
    });
  }

  function drawNorthArrow(x, y) {
    applyColor('setFillColor', colors.cardFill);
    applyColor('setDrawColor', colors.rule);
    doc.circle(x, y + 5.5, 6, 'FD');
    applyColor('setFillColor', [35, 44, 58]);
    doc.triangle(x, y, x - 3.2, y + 8.6, x + 3.2, y + 8.6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.2);
    applyColor('setTextColor', colors.text);
    doc.text('N', x, y - 1.1, { align: 'center' });
  }

  function drawScaleBar(x, y, lat, zoom, canvasPx, imageMm) {
    // Compute metres-per-mm in the PDF image; fall back to a fixed label if no map data.
    let barMm = 40;
    let label0 = '0';
    let labelMid = '250';
    let labelEnd = '500 m';

    if (lat !== null && zoom !== null && canvasPx && imageMm) {
      const metersPerPixel = 156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom);
      const mmPerPixel = imageMm / canvasPx;
      const metersPerMm = metersPerPixel / mmPerPixel;

      // Pick the largest "nice" distance whose bar fits within 20–50 mm.
      const candidates = [10000, 5000, 2000, 1000, 500, 250, 100, 50, 25, 10];
      let targetMeters = candidates[candidates.length - 1];
      for (const d of candidates) {
        const len = d / metersPerMm;
        if (len >= 20 && len <= 50) { targetMeters = d; break; }
      }
      barMm = targetMeters / metersPerMm;
      const half = targetMeters / 2;
      const fmt = v => v >= 1000 ? (v / 1000) + ' km' : v + ' m';
      label0 = '0';
      labelMid = fmt(half);
      labelEnd = fmt(targetMeters);
    }

    const innerW = barMm;
    const totalW = innerW + 12;
    applyColor('setFillColor', [31, 41, 55]);
    doc.rect(x, y, totalW, 10, 'F');
    applyColor('setDrawColor', [255, 255, 255]);
    doc.setLineWidth(0.4);
    const x0 = x + 5;
    const xMid = x0 + innerW / 2;
    const xEnd = x0 + innerW;
    doc.line(x0, y + 6.4, xEnd, y + 6.4);
    doc.line(x0, y + 4.2, x0, y + 7.9);
    doc.line(xMid, y + 4.2, xMid, y + 7.9);
    doc.line(xEnd, y + 4.2, xEnd, y + 7.9);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.6);
    doc.setTextColor(255, 255, 255);
    doc.text(label0, x0, y + 3.5, { align: 'center' });
    doc.text(labelMid, xMid, y + 3.5, { align: 'center' });
    doc.text(labelEnd, xEnd, y + 3.5, { align: 'center' });
  }

  function drawPanelList(x, y, w, h, title, lines, options = {}) {
    drawCard(x, y, w, h, { fill: colors.cardFill, border: colors.border, lineWidth: 0.28, radius: 2 });
    drawSectionTitle(x + 7, y + 10, title, w - 14, options.icon || null);
    return drawBullets(x + 8, y + 18, lines, w - 16, {
      fontSize: options.fontSize || 6.6,
      lineHeight: options.lineHeight || 4,
      color: options.color || colors.text
    });
  }

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  const reportTitle = `${forestName} Infrastructure Monitoring Report`;
  const generatedLabel = new Date().toLocaleDateString('en-NZ');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  applyColor('setTextColor', colors.text);
  drawLogoImage(reportAssets.infraLogo, margin, margin - 0.5, 16, 16, 'IL');
  doc.text('InFRA LINC', margin + 18, margin + 7.8);
  applyColor('setDrawColor', colors.rule);
  doc.setLineWidth(0.28);
  doc.line(margin + 63, margin, margin + 63, margin + 14);

  doc.setFontSize(19);
  applyColor('setTextColor', colors.text);
  doc.text(reportTitle, margin + 70, margin + 6.4);
  const titleWidth = doc.getTextWidth(reportTitle);

  applyColor('setTextColor', colors.rule);
  doc.text(' | ', margin + 70 + titleWidth + 1, margin + 6.4);
  const pipeWidth = doc.getTextWidth(' | ');

  applyColor('setTextColor', colors.accent);
  doc.text(monthName, margin + 70 + titleWidth + 1 + pipeWidth, margin + 6.4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  applyColor('setTextColor', colors.muted);
  doc.text(`${forestName} infrastructure displacement monitoring summary`, margin + 70, margin + 12.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  drawLogoImage(reportAssets.mnrLogo, pageWidth - margin - 17, margin - 0.5, 18, 18, 'M&R');
  applyColor('setDrawColor', colors.rule);
  doc.setLineWidth(0.3);
  doc.line(margin, bodyTop - 4, pageWidth - margin, bodyTop - 4);

  drawCard(margin, bodyTop, mapWidth, mainHeight, { fill: colors.cardFill, border: colors.border, lineWidth: 0.32, radius: 2.2 });
  applyColor('setFillColor', colors.cardFill);
  doc.rect(margin + 0.8, bodyTop + 0.8, mapWidth - 1.6, 14, 'F');
  drawIconMark('area', margin + 6, bodyTop + 5, 5.2);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  applyColor('setTextColor', colors.text);
  doc.text(`${forestName} Monitoring Area`, margin + 14, bodyTop + 8.6);
  applyColor('setDrawColor', colors.rule);
  doc.setLineWidth(0.22);
  doc.line(margin + 70, bodyTop + 4, margin + 70, bodyTop + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  applyColor('setTextColor', colors.muted);
  doc.text('Sentinel-1 InSAR Displacement Threshold Points', margin + 74, bodyTop + 8.4);

  const mapImageBounds = fitImage(mapDataUrl, mapNaturalW, mapNaturalH, margin + 3, bodyTop + 15, mapWidth - 6, mainHeight - 18);
  drawNorthArrow(mapImageBounds.x + mapImageBounds.w - 12, mapImageBounds.y + 5);
  drawScaleBar(mapImageBounds.x + 5, mapImageBounds.y + mapImageBounds.h - 14, mapLat, mapZoom, mapNaturalW, mapImageBounds.w);
  drawMapLegend(getMapLegendSnapshot(), mapImageBounds);

  const metricGap = 3;
  const metricH = 35;
  const metricW = (sidebarWidth - metricGap * 3) / 4;
  const metricY = bodyTop;
  drawMetricCard(sidebarX, metricY, metricW, metricH, 'Active Forest', forestName, 'forest');
  drawMetricCard(sidebarX + (metricW + metricGap), metricY, metricW, metricH, 'Active Month', monthName, 'calendar');
  drawMetricCard(sidebarX + (metricW + metricGap) * 2, metricY, metricW, metricH, 'Monitored Area', withUnit(area, 'ha'), 'area');
  drawMetricCard(sidebarX + (metricW + metricGap) * 3, metricY, metricW, metricH, 'Max Relative Displacement', withUnit(maxDisplacement, 'cm'), 'pulse');

  const notesY = metricY + metricH + gap;
  doc.setFontSize(7.5);
  const userNoteLines = userNotes ? doc.splitTextToSize(userNotes, sidebarWidth - 16) : [];
  const extraNoteHeight = userNoteLines.length > 0 ? userNoteLines.length * 4.5 + 13 : 0;
  const notesH = 62 + extraNoteHeight;
  const notesEndY = drawPanelList(sidebarX, notesY, sidebarWidth, notesH, 'Operational Notes', [
    `Max displacement - ${withUnit(maxDisplacement, 'cm')}`,
    `Site visits recorded - ${siteVisits}`,
    `Remediation recorded - ${remRec}`,
    `Total monitored area - ${withUnit(area, 'ha')}`,
    `Raster source - ${sourceSummary}`
  ], { icon: 'clipboard', fontSize: 8.5, lineHeight: 5.2 });

  if (userNoteLines.length > 0) {
    applyColor('setDrawColor', colors.paleBorder);
    doc.setLineWidth(0.18);
    doc.line(sidebarX + 7, notesEndY + 2, sidebarX + sidebarWidth - 7, notesEndY + 2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    applyColor('setTextColor', colors.accent);
    doc.text('Field Notes', sidebarX + 8, notesEndY + 7.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    applyColor('setTextColor', colors.text);
    doc.text(userNoteLines, sidebarX + 8, notesEndY + 13, { lineHeightFactor: 1.2 });
  }

  const coverageY = notesY + notesH + gap;
  drawPanelList(sidebarX, coverageY, sidebarWidth, bodyTop + mainHeight - coverageY, 'Satellite Coverage', [
    `Satellite revisits - ${satRev}`,
    `Average revisit interval - ${withUnit(satInt, 'days')}`,
    `Radar coherence - ${isBlank(satCoh) ? '-' : `> ${satCoh}`}`,
    `Overlay state - ${sentinelState}`,
    `Displacement threshold - ${displacementThreshold}`,
    `Max LOS velocity - ${maxVelocityPerYear}`
  ], { icon: 'sat', fontSize: 8.5, lineHeight: 5.2 });

  const rainfallX = margin;
  const escX = rainfallX + bottomCardWidth + gap;
  const notesX = escX + bottomCardWidth + gap;
  drawCard(rainfallX, bottomY, bottomCardWidth, bottomHeight, { fill: colors.cardFill, border: colors.border, lineWidth: 0.3, radius: 2 });
  drawCard(escX, bottomY, bottomCardWidth, bottomHeight, { fill: colors.cardFill, border: colors.border, lineWidth: 0.3, radius: 2 });
  drawCard(notesX, bottomY, bottomCardWidth, bottomHeight, { fill: colors.cardFill, border: colors.border, lineWidth: 0.3, radius: 2 });

  drawSectionTitle(rainfallX + 7, bottomY + 10, 'Regional Rainfall Totals', bottomCardWidth - 14, 'rain');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  applyColor('setTextColor', colors.muted);
  doc.text(doc.splitTextToSize(`Modelled monthly rainfall totals from the Open-Meteo API\nMap centre: ${rainfallLocation}`, bottomCardWidth - 18), rainfallX + 7, bottomY + 16, { lineHeightFactor: 1.15 });
  fitImage(rainfallChartData, lineCanvas?.width, lineCanvas?.height, rainfallX + 7, bottomY + 23, bottomCardWidth - 14, bottomHeight - 30);

  drawSectionTitle(escX + 7, bottomY + 10, 'Displacement Threshold Point Time Series', bottomCardWidth - 14, 'alert');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  applyColor('setTextColor', colors.muted);
  doc.text(doc.splitTextToSize('Hovered displacement threshold point displacement relative to the selected\nreference date.', bottomCardWidth - 18), escX + 7, bottomY + 16, { lineHeightFactor: 1.15 });
  fitImage(timeSeriesChartData, timeSeriesCanvas?.width, timeSeriesCanvas?.height, escX + 7, bottomY + 23, bottomCardWidth - 14, bottomHeight - 30);

  drawSectionTitle(notesX + 7, bottomY + 10, hasReportPhoto ? 'Site Photo' : 'Site Photo (Optional)', bottomCardWidth - 14, 'image');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  applyColor('setTextColor', colors.muted);
  const photoIntro = hasReportPhoto
    ? `Uploaded field photo for ${forestName}, ${monthName}.`
    : 'Upload a site photo from the report modal to include field evidence in this panel.';
  doc.text(doc.splitTextToSize(photoIntro, bottomCardWidth - 18), notesX + 7, bottomY + 16, { lineHeightFactor: 1.15 });

  const photoBoxX = notesX + 7;
  const photoBoxY = bottomY + 23;
  const photoBoxW = bottomCardWidth - 14;
  const photoBoxH = bottomHeight - 30;
  drawCard(photoBoxX, photoBoxY, photoBoxW, photoBoxH, {
    fill: colors.softFill,
    border: colors.paleBorder,
    lineWidth: 0.22,
    radius: 1.4
  });

  if (hasReportPhoto) {
    fitImage(reportPhotoDataUrl, reportPhotoNaturalW, reportPhotoNaturalH, photoBoxX + 0.8, photoBoxY + 0.8, photoBoxW - 1.6, photoBoxH - 1.6);
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    applyColor('setTextColor', colors.softText);
    doc.text('No site photo selected', photoBoxX + photoBoxW / 2, photoBoxY + photoBoxH / 2, { align: 'center' });
  }

  applyColor('setDrawColor', colors.rule);
  doc.setLineWidth(0.26);
  doc.line(margin, footerTop + 1, pageWidth - margin, footerTop + 1);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  applyColor('setTextColor', colors.softText);
  const disclaimer = doc.splitTextToSize(
    'Disclaimer: This report is produced for informational purposes only. Results are derived from modelled data and should be validated with field assessment.',
    pageWidth - margin * 2 - 95
  );
  doc.text(disclaimer, margin + 6, footerTop + 5.5, { lineHeightFactor: 1.08 });
  applyColor('setDrawColor', colors.softText);
  doc.circle(margin + 2, footerTop + 4.8, 1.5, 'S');
  doc.setFont('helvetica', 'normal');
  doc.text(`Report generated: ${generatedLabel}`, pageWidth - margin - 36, footerTop + 5.5, { align: 'right' });
  doc.text('Page 1 of 1', pageWidth - margin, footerTop + 5.5, { align: 'right' });

  const safe = (value) => String(value || 'report')
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80) || 'report';
  const filenamePeriod = (() => {
    const value = monthName || 'report';
    const isoMatch = value.match(/\b(20\d{2})[-_/ ](0?[1-9]|1[0-2])\b/);
    if (isoMatch) {
      return `${isoMatch[1]}-${isoMatch[2].padStart(2, '0')}`;
    }

    const monthMap = {
      jan: '01', january: '01',
      feb: '02', february: '02',
      mar: '03', march: '03',
      apr: '04', april: '04',
      may: '05',
      jun: '06', june: '06',
      jul: '07', july: '07',
      aug: '08', august: '08',
      sep: '09', sept: '09', september: '09',
      oct: '10', october: '10',
      nov: '11', november: '11',
      dec: '12', december: '12'
    };
    const monthMatch = value.match(/\b([A-Za-z]+)\s+(20\d{2})\b/) || value.match(/\b(20\d{2})\s+([A-Za-z]+)\b/);
    if (monthMatch) {
      const year = monthMatch[1].startsWith('20') ? monthMatch[1] : monthMatch[2];
      const month = monthMatch[1].startsWith('20') ? monthMatch[2] : monthMatch[1];
      const monthNumber = monthMap[month.toLowerCase()];
      if (monthNumber) {
        return `${year}-${monthNumber}`;
      }
    }

    return safe(value);
  })();

  doc.save(`Infra_Linc_${safe(forestName)}_${filenamePeriod}.pdf`);
}
