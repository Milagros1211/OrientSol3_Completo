/**
 * OrientSol 3 - Electron Preload Script
 */
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('isElectron', true);

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,

  // Network & Connectivity
  checkNetworkStatus: () => ipcRenderer.invoke('network:check-status'),
  fetchExternalUrl: (url) => ipcRenderer.invoke('network:fetch-url', url),
  onNetworkStatusChanged: (callback) => {
    const subscription = (_event, isOnline) => callback(isOnline);
    ipcRenderer.on('network:status-changed', subscription);
    return () => ipcRenderer.removeListener('network:status-changed', subscription);
  },

  // Offline Climate Cache
  getOfflineClimateCache: () => ipcRenderer.invoke('offline-cache:get-all'),
  saveOfflineClimateRecord: (record) => ipcRenderer.invoke('offline-cache:save-record', record),
  getOfflineRecordByCoords: (lat, lon, toleranceDeg = 0.5) =>
    ipcRenderer.invoke('offline-cache:get-by-coords', lat, lon, toleranceDeg),

  // Application Info
  getAppInfo: () => ipcRenderer.invoke('app:get-info'),
});
