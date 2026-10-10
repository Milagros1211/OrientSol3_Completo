import type { ClimateDataRecord } from './climate';

export interface AppInfo {
  appName: string;
  version: string;
  electronVersion: string;
  chromeVersion: string;
  nodeVersion: string;
  platform: string;
  cacheFilePath: string;
  isOnline: boolean;
}

export interface ElectronAPI {
  isElectron: boolean;
  platform: string;
  checkNetworkStatus: () => Promise<boolean>;
  fetchExternalUrl?: (url: string) => Promise<{ ok: boolean; status: number; data?: string; error?: string }>;
  onNetworkStatusChanged: (callback: (isOnline: boolean) => void) => () => void;
  getOfflineClimateCache: () => Promise<ClimateDataRecord[]>;
  saveOfflineClimateRecord: (record: ClimateDataRecord) => Promise<boolean>;
  getOfflineRecordByCoords: (lat: number, lon: number, toleranceDeg?: number) => Promise<ClimateDataRecord | null>;
  getAppInfo: () => Promise<AppInfo>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
    isElectron?: boolean;
  }
}
