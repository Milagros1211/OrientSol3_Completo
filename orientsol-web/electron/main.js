import { app, BrowserWindow, ipcMain, session, net } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default seed data for 100% offline standalone execution
const DEFAULT_SEED_DATASETS = [
  {
    id: 'seed-madrid',
    source: 'local_database',
    locationName: 'Madrid (Retiro)',
    country: 'España',
    latitude: 40.4168,
    longitude: -3.7038,
    elevationM: 667,
    monthlyGdm0: [2.12, 3.05, 4.25, 5.45, 6.55, 7.47, 7.78, 6.76, 5.18, 3.49, 2.32, 1.92],
    monthlyTemperature: [3.8, 4.7, 7.9, 11.2, 15.7, 21.8, 25.3, 24.8, 20.0, 14.1, 7.6, 4.4],
    fetchedAt: new Date().toISOString(),
    metadata: { is_verified: true, notes: 'Dataset base IDAE / OrientSol 3' },
  },
  {
    id: 'seed-barcelona',
    source: 'local_database',
    locationName: 'Barcelona (Fabra)',
    country: 'España',
    latitude: 41.3879,
    longitude: 2.1699,
    elevationM: 415,
    monthlyGdm0: [2.05, 2.85, 3.95, 5.15, 6.2, 6.95, 7.25, 6.35, 4.85, 3.35, 2.2, 1.85],
    monthlyTemperature: [8.9, 9.5, 11.8, 13.9, 17.5, 21.6, 24.8, 25.1, 21.8, 17.6, 12.8, 9.7],
    fetchedAt: new Date().toISOString(),
    metadata: { is_verified: true, notes: 'Dataset base IDAE / OrientSol 3' },
  },
  {
    id: 'seed-sevilla',
    source: 'local_database',
    locationName: 'Sevilla (San Pablo)',
    country: 'España',
    latitude: 37.3891,
    longitude: -5.9845,
    elevationM: 34,
    monthlyGdm0: [2.45, 3.4, 4.75, 5.95, 7.15, 8.1, 8.25, 7.35, 5.65, 3.95, 2.7, 2.15],
    monthlyTemperature: [11.0, 12.5, 15.6, 17.9, 21.8, 26.5, 29.2, 29.1, 25.4, 20.7, 15.2, 11.9],
    fetchedAt: new Date().toISOString(),
    metadata: { is_verified: true, notes: 'Dataset base IDAE / OrientSol 3' },
  },
  {
    id: 'seed-valencia',
    source: 'local_database',
    locationName: 'Valencia (Viveros)',
    country: 'España',
    latitude: 39.4699,
    longitude: -0.3763,
    elevationM: 11,
    monthlyGdm0: [2.35, 3.25, 4.45, 5.65, 6.75, 7.45, 7.65, 6.75, 5.25, 3.75, 2.55, 2.05],
    monthlyTemperature: [11.8, 12.6, 14.8, 17.1, 20.6, 24.5, 27.2, 27.7, 24.6, 20.5, 15.5, 12.4],
    fetchedAt: new Date().toISOString(),
    metadata: { is_verified: true, notes: 'Dataset base IDAE / OrientSol 3' },
  },
  {
    id: 'seed-bilbao',
    source: 'local_database',
    locationName: 'Bilbao (Aeropuerto)',
    country: 'España',
    latitude: 43.263,
    longitude: -2.935,
    elevationM: 42,
    monthlyGdm0: [1.45, 2.15, 3.25, 4.25, 5.15, 5.65, 5.85, 5.15, 4.05, 2.75, 1.75, 1.3],
    monthlyTemperature: [9.3, 9.7, 11.5, 12.9, 16.1, 19.0, 20.9, 21.4, 19.6, 16.3, 12.2, 9.9],
    fetchedAt: new Date().toISOString(),
    metadata: { is_verified: true, notes: 'Dataset base IDAE / OrientSol 3' },
  },
  {
    id: 'seed-tenerife',
    source: 'local_database',
    locationName: 'Santa Cruz de Tenerife',
    country: 'España',
    latitude: 28.4636,
    longitude: -16.2518,
    elevationM: 35,
    monthlyGdm0: [3.45, 4.35, 5.45, 6.45, 7.25, 7.75, 7.95, 7.45, 6.25, 4.85, 3.75, 3.15],
    monthlyTemperature: [18.2, 18.3, 19.0, 20.0, 21.3, 23.4, 25.1, 25.8, 25.3, 23.8, 21.4, 19.3],
    fetchedAt: new Date().toISOString(),
    metadata: { is_verified: true, notes: 'Dataset base IDAE / OrientSol 3' },
  },
];

let mainWindow = null;
let networkStatusInterval = null;

function getOfflineCacheFilePath() {
  const userDataDir = app.getPath('userData');
  return path.join(userDataDir, 'orientsol_climate_cache.json');
}

/**
 * Initializes and reads the local persistent JSON file cache.
 */
function readOfflineCache() {
  const cacheFile = getOfflineCacheFilePath();
  try {
    if (!fs.existsSync(cacheFile)) {
      console.log('[Electron Main] Seeding initial offline climate cache at:', cacheFile);
      fs.writeFileSync(cacheFile, JSON.stringify(DEFAULT_SEED_DATASETS, null, 2), 'utf-8');
      return DEFAULT_SEED_DATASETS;
    }
    const content = fs.readFileSync(cacheFile, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SEED_DATASETS;
  } catch (err) {
    console.error('[Electron Main] Error reading offline cache, falling back to defaults:', err);
    return DEFAULT_SEED_DATASETS;
  }
}

/**
 * Saves or updates a climate record in the offline JSON file.
 */
function saveRecordToOfflineCache(record) {
  const cacheFile = getOfflineCacheFilePath();
  try {
    const existing = readOfflineCache();
    const updated = [
      record,
      ...existing.filter(
        (item) => item.id !== record.id && item.locationName.toLowerCase() !== record.locationName.toLowerCase()
      ),
    ];
    fs.writeFileSync(cacheFile, JSON.stringify(updated, null, 2), 'utf-8');
    console.log('[Electron Main] Persisted record to offline cache:', record.locationName);
    return true;
  } catch (err) {
    console.error('[Electron Main] Failed to write offline cache:', err);
    return false;
  }
}

/**
 * Tests actual online status by pinging or checking net.isOnline().
 */
function checkNetworkConnectivity() {
  return net.isOnline();
}

/**
 * Register IPC handlers for offline resilience and communication.
 */
function setupIpcHandlers() {
  ipcMain.handle('offline-cache:get-all', async () => {
    return readOfflineCache();
  });

  ipcMain.handle('offline-cache:save-record', async (_event, record) => {
    return saveRecordToOfflineCache(record);
  });

  ipcMain.handle('offline-cache:get-by-coords', async (_event, lat, lon, toleranceDeg = 0.5) => {
    const all = readOfflineCache();
    let bestMatch = null;
    let minDistance = Infinity;

    for (const item of all) {
      const dist = Math.hypot(item.latitude - lat, item.longitude - lon);
      if (dist <= toleranceDeg && dist < minDistance) {
        minDistance = dist;
        bestMatch = item;
      }
    }
    return bestMatch;
  });

  ipcMain.handle('network:check-status', async () => {
    return checkNetworkConnectivity();
  });

  // Whitelist of approved meteorological APIs and cloud services for OrientSol
  const ALLOWED_METEO_HOSTS = [
    're.jrc.ec.europa.eu',        // European Commission JRC PVGIS (v5.2, v5.3)
    'power.larc.nasa.gov',        // NASA Langley Research Center POWER Project
    'archive-api.open-meteo.com', // Open-Meteo Historical Climate Reanalysis
    'api.open-meteo.com'          // Open-Meteo Weather APIs
  ];

  /**
   * Strictly validates outbound URLs to prevent Server-Side Request Forgery (SSRF)
   */
  function validateOutboundUrl(targetUrl) {
    if (typeof targetUrl !== 'string' || !targetUrl.trim()) {
      return { allowed: false, reason: 'URL vacía o no válida.' };
    }

    let parsed;
    try {
      parsed = new URL(targetUrl.trim());
    } catch {
      return { allowed: false, reason: 'Formato de URL inválido.' };
    }

    // 1. Enforce HTTPS only (prohibit file://, http://, gopher://, etc.)
    if (parsed.protocol !== 'https:') {
      return { allowed: false, reason: `Protocolo no permitido (${parsed.protocol}). Se exige estrictamente HTTPS.` };
    }

    // 2. Reject embedded credentials (e.g. https://user:pass@host)
    if (parsed.username || parsed.password) {
      return { allowed: false, reason: 'Credenciales incrustadas en URL no permitidas.' };
    }

    // 3. Prohibit non-standard ports
    if (parsed.port && parsed.port !== '443') {
      return { allowed: false, reason: `Puerto no estándar denegado (${parsed.port}). Solo puerto 443.` };
    }

    const hostname = parsed.hostname.toLowerCase();

    // 4. Strict block for localhost, loopback, private RFC1918 subnets, and cloud metadata (169.254.x.x)
    const privateIpPatterns = [
      /^localhost$/,
      /^127\./,
      /^0\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^169\.254\./,
      /^::1$/,
      /^fc00:/,
      /^fe80:/
    ];
    if (privateIpPatterns.some((pattern) => pattern.test(hostname))) {
      return { allowed: false, reason: `Destino de red local o privada denegado (${hostname}).` };
    }

    // 5. Enforce approved meteorological domains or Supabase instances
    const isApprovedHost =
      ALLOWED_METEO_HOSTS.includes(hostname) ||
      hostname.endsWith('.supabase.co');

    if (!isApprovedHost) {
      return { allowed: false, reason: `Dominio no autorizado (${hostname}). Solo proveedores meteorológicos verificados y Supabase.` };
    }

    return { allowed: true, url: parsed.toString() };
  }

  ipcMain.handle('network:fetch-url', async (_event, targetUrl) => {
    const check = validateOutboundUrl(targetUrl);
    if (!check.allowed) {
      console.warn(`[Electron IPC Security] Intento de SSRF bloqueado: ${check.reason} (URL: ${targetUrl})`);
      return { ok: false, status: 403, error: `Acceso denegado (SSRF Guard): ${check.reason}` };
    }

    try {
      // 10-second request timeout via AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const resp = await net.fetch(check.url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json, text/plain, */*'
        }
      });
      clearTimeout(timeoutId);

      const text = await resp.text();
      return { ok: resp.ok, status: resp.status, data: text };
    } catch (err) {
      const isTimeout = err?.name === 'AbortError';
      return {
        ok: false,
        status: isTimeout ? 504 : 500,
        error: isTimeout ? 'Tiempo de espera de conexión agotado (10s)' : (err?.message || String(err))
      };
    }
  });

  ipcMain.handle('app:get-info', async () => {
    return {
      appName: 'OrientSol 3 Web & Desktop',
      version: app.getVersion(),
      electronVersion: process.versions.electron,
      chromeVersion: process.versions.chrome,
      nodeVersion: process.versions.node,
      platform: process.platform,
      cacheFilePath: getOfflineCacheFilePath(),
      isOnline: checkNetworkConnectivity(),
    };
  });
}

function createWindow() {
  // Setup headers for SharedArrayBuffer / Pyodide WebAssembly performance
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Cross-Origin-Opener-Policy': ['same-origin'],
        'Cross-Origin-Embedder-Policy': ['require-corp'],
      },
    });
  });

  const preloadCjs = path.join(__dirname, 'preload.cjs');
  const preloadJs = path.join(__dirname, 'preload.js');
  const actualPreload = fs.existsSync(preloadCjs) ? preloadCjs : preloadJs;

  mainWindow = new BrowserWindow({
    width: 1360,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'OrientSol 3 - Simulación Solar & Fotovoltaica',
    backgroundColor: '#0a0e17',
    show: false,
    webPreferences: {
      preload: actualPreload,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load URL or local dist/index.html
  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  const isDev = process.env.NODE_ENV === 'development' || !!devServerUrl;

  if (isDev && devServerUrl) {
    console.log('[Electron Main] Loading Dev Server:', devServerUrl);
    mainWindow.loadURL(devServerUrl);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    const distPath = path.join(__dirname, '../dist/index.html');
    if (fs.existsSync(distPath)) {
      console.log('[Electron Main] Loading production build from:', distPath);
      mainWindow.loadFile(distPath);
    } else {
      console.warn('[Electron Main] dist/index.html not found, attempting localhost:5173...');
      mainWindow.loadURL('http://localhost:5173');
    }
  }

  // Periodic network monitoring
  let lastOnlineState = checkNetworkConnectivity();
  networkStatusInterval = setInterval(() => {
    const currentState = checkNetworkConnectivity();
    if (currentState !== lastOnlineState) {
      lastOnlineState = currentState;
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('network:status-changed', currentState);
      }
    }
  }, 10000);

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (networkStatusInterval) {
      clearInterval(networkStatusInterval);
    }
  });
}

// App lifecycle
app.whenReady().then(() => {
  setupIpcHandlers();
  readOfflineCache(); // Ensure cache is created/seeded immediately
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (networkStatusInterval) {
    clearInterval(networkStatusInterval);
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
