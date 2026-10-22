import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  HardDrive, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Database,
  FileText,
  RefreshCw
} from 'lucide-react';
import { 
  getOfflineStorageDiagnostics, 
  exportOfflineArchive
} from '../services/offlineStorage';

export const OfflineStatusBar: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);
  const [diagnostics, setDiagnostics] = useState(getOfflineStorageDiagnostics());
  const [dismissedBanner, setDismissedBanner] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setDismissedBanner(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setDismissedBanner(false);
      setDiagnostics(getOfflineStorageDiagnostics());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const refreshStats = () => {
    setDiagnostics(getOfflineStorageDiagnostics());
  };

  return (
    <>
      {/* Offline Alert Strip when disconnected */}
      {!isOnline && !dismissedBanner && (
        <div className="bg-amber-600 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md border-b border-amber-700 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 max-w-4xl mx-auto flex-1">
            <WifiOff className="w-4 h-4 text-slate-950 shrink-0" />
            <span>
              <strong>Offline Mode Active:</strong> No internet connection detected. The Shuhadae platform is running 100% from your browser's local cache.
            </span>
            <button
              onClick={() => {
                refreshStats();
                setShowDiagnostics(true);
              }}
              className="ml-2 underline font-black hover:text-white cursor-pointer"
            >
              Inspect Local Storage
            </button>
          </div>
          <button
            onClick={() => setDismissedBanner(true)}
            className="text-slate-950 hover:text-white p-0.5 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Offline Diagnostics Modal */}
      {showDiagnostics && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 text-slate-800 dark:text-slate-100 shadow-2xl border border-emerald-900/20 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-800 dark:text-emerald-400 font-bold border border-transparent dark:border-emerald-800/60">
                  <Database className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Browser Local Storage & Offline Status
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isOnline ? '🟢 Connected to Internet' : '⚡ Disconnected (100% Offline)'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDiagnostics(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>PWA & Service Worker Precaching</span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  All pages, CSS, fonts, and school images are cached locally and remain accessible without internet.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Offline Admissions</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">{diagnostics.admissionsCount}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Saved in browser</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Fee Payments</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">{diagnostics.paymentsCount}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Cached slips</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Local Storage Used:</span>
                  <strong className="font-mono text-slate-900 dark:text-slate-200">~{diagnostics.approxSizeKb} KB</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Student Portal Records:</span>
                  <strong className="text-emerald-700 dark:text-emerald-400">Preloaded & Verified</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Offline Voice Reading:</span>
                  <strong className="text-emerald-700 dark:text-emerald-400">Web Speech API Fallback Active</strong>
                </div>
              </div>

              <div className="pt-1 space-y-2">
                <button
                  onClick={exportOfflineArchive}
                  className="w-full py-2 bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-300" />
                  <span>Download Offline Data Backup (JSON)</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowDiagnostics(false)}
              className="w-full py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </>
  );
};
