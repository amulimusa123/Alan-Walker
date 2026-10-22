import React, { useState, useRef } from 'react';
import { Volume2, Play, Pause, Square, Sparkles, X, Loader2, Music } from 'lucide-react';
import { HEADTEACHER_WELCOME_SPEECH, SCHOOL_ANTHEM } from '../data/schoolData';

interface TTSPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TTSPlayer: React.FC<TTSPlayerProps> = ({ isOpen, onClose }) => {
  const [selectedPreset, setSelectedPreset] = useState<'welcome' | 'anthem' | 'custom'>('welcome');
  const [customText, setCustomText] = useState('');
  const [voice, setVoice] = useState<'Puck' | 'Kore' | 'Fenrir' | 'Aoede'>('Puck');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const getTextToRead = () => {
    if (selectedPreset === 'welcome') {
      return HEADTEACHER_WELCOME_SPEECH.slice(0, 450);
    }
    if (selectedPreset === 'anthem') {
      return SCHOOL_ANTHEM.verses.join('\n\n');
    }
    return customText || 'Welcome to Shuhadae Islamic Secondary School, Nyamitanga, Mbarara City.';
  };

  const handleSynthesizeAndPlay = async () => {
    setError(null);
    setIsLoading(true);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }

    const text = getTextToRead();

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          voice: voice,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server TTS synthesis failed');
      }

      const data = await res.json();
      if (!data.audioBase64) {
        throw new Error('No audio returned by server');
      }

      const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
      const audio = new Audio(audioSrc);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => setIsPlaying(false);

      await audio.play();
    } catch (err: any) {
      console.warn('Falling back to browser speech synthesis:', err);
      // Fallback to browser speech if API key is not ready or failed
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } else {
        setError(err.message || 'Speech generation unavailable');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-emerald-900/20 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Header */}
        <div className="bg-emerald-900 dark:bg-emerald-950 text-white p-5 flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 dark:bg-emerald-900 flex items-center justify-center text-amber-300">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                <span>Shuhadae Voice Reader</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-mono font-bold">
                  gemini-3.8-flash-tts
                </span>
              </h3>
              <p className="text-[11px] text-emerald-200">Listen to school speeches and anthems</p>
            </div>
          </div>

          <button
            onClick={() => {
              handleStop();
              onClose();
            }}
            className="text-emerald-300 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-slate-900 dark:text-white">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Select Audio Passage:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedPreset('welcome')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-colors flex flex-col items-center gap-1 cursor-pointer ${
                  selectedPreset === 'welcome'
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-600 dark:border-emerald-500 text-emerald-950 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>🎙️ Headteacher</span>
                <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">Welcome Speech</span>
              </button>

              <button
                onClick={() => setSelectedPreset('anthem')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-colors flex flex-col items-center gap-1 cursor-pointer ${
                  selectedPreset === 'anthem'
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-600 dark:border-emerald-500 text-emerald-950 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>📜 School Anthem</span>
                <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">3 Verses</span>
              </button>

              <button
                onClick={() => setSelectedPreset('custom')}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-colors flex flex-col items-center gap-1 cursor-pointer ${
                  selectedPreset === 'custom'
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-600 dark:border-emerald-500 text-emerald-950 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>✍️ Custom Text</span>
                <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">Your Passage</span>
              </button>
            </div>
          </div>

          {selectedPreset === 'custom' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Enter Text to Read Aloud:</label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type school news, an announcement, or Quranic verse translation..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Voice Model Tone:</label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {(['Puck', 'Kore', 'Fenrir', 'Aoede'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setVoice(v)}
                  className={`py-1.5 px-2 rounded-lg font-bold border text-center transition-colors cursor-pointer ${
                    voice === v
                      ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-500 dark:border-amber-600 text-amber-900 dark:text-amber-200'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Passage Preview */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 max-h-36 overflow-y-auto text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            <span className="font-bold text-slate-800 dark:text-white block mb-1">Passage Preview:</span>
            {getTextToRead()}
          </div>

          {error && (
            <div className="p-2.5 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-xs rounded-lg">
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            {!isPlaying ? (
              <button
                onClick={handleSynthesizeAndPlay}
                disabled={isLoading}
                className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-75 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Audio via Gemini...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play Audio Speech</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="flex-1 py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Audio Playback</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
