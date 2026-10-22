import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Smartphone, X, CheckCircle2, Share2, PlusSquare } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running in standalone mode, show subtle badge or hide
  if (isInstalled) {
    return (
      <span className="hidden lg:inline-flex items-center gap-1 bg-emerald-950/70 border border-emerald-700/80 text-emerald-200 px-2 py-0.5 rounded-md text-[10px] font-mono">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        <span>Installed App</span>
      </span>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2.5 py-1 rounded-md text-[11px] shadow-sm transition-all active:scale-95 cursor-pointer"
        title="Install Shuhadae Islamic SS App on this device"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
          title="Install on iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-300" />
          <span>Add to Home</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-slate-800 shadow-2xl border border-emerald-900/20">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <span>Install on iPhone / iPad</span>
                </h4>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">1</div>
                  <p>In Safari, tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline text-blue-600" /> in the browser bar.</p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">2</div>
                  <p>Scroll down and select <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-slate-800" />.</p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">3</div>
                  <p>Tap <strong>Add</strong> in the top right. Shuhadae Islamic SS will now run completely offline on your home screen!</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  const [showDesktopGuide, setShowDesktopGuide] = useState(false);

  // Fallback desktop install guidance button
  return (
    <>
      <button
        onClick={() => setShowDesktopGuide(true)}
        className="hidden md:flex items-center gap-1.5 bg-emerald-800/60 hover:bg-emerald-700 text-emerald-100 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
        title="Installable Progressive Web App"
      >
        <Download className="w-3 h-3 text-amber-300" />
        <span>Install PWA</span>
      </button>

      {showDesktopGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-slate-800 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-700" />
                <h3 className="font-extrabold text-sm">Install App to Desktop</h3>
              </div>
              <button
                onClick={() => setShowDesktopGuide(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              To install Shuhadae Islamic SS as an offline application, click the <strong>Install</strong> icon in your browser's address bar (Chrome, Edge, or Brave) or choose <strong>Install / Add to Home Screen</strong> from the browser settings menu.
            </p>

            <button
              onClick={() => setShowDesktopGuide(false)}
              className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
