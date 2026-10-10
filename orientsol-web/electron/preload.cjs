/**
 * OrientSol 3 - Electron Preload Script
 * Securely exposes safe IPC methods to the renderer process via contextBridge.
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('isElectron', true);

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,

  // Network & Connectivity
  checkNetworkStatus: () => ipcRenderer.invoke('network:check-status'),
  onNetworkStatusChanged: (callback) => {
    const subscription = (_event, isOnline) => callback(isOnline);
    ipcRenderer.on('network:status-changed', subscription);
    return () => ipcRenderer.removeListener('network:status-changed', subscription);
  },

  // Offline Climate Cache (Local Disk JSON Persistence)
  getOfflineClimateCache: () => ipcRenderer.invoke('offline-cache:get-all'),
  saveOfflineClimateRecord: (record) => ipcRenderer.invoke('offline-cache:save-record', record),
  getOfflineRecordByCoords: (lat, lon, toleranceDeg = 0.5) =>
    ipcRenderer.invoke('offline-cache:get-by-coords', lat, lon, toleranceDeg),

  // Application Info & Cache Path
  getAppInfo: () => ipcRenderer.invoke('app:get-info'),
});
