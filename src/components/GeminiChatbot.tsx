import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles, X, Minimize2, Maximize2, Loader2, ChevronDown, WifiOff } from 'lucide-react';
import { ChatMessage } from '../types';

export const GeminiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'model',
      content: 'Assalamu Alaikum! Welcome to Shuhadae Islamic Secondary School, Nyamitanga, Mbarara City. I am Ustadh Sulaiman, your Virtual Admissions & Academic Counselor. How may I assist you with admissions, O-Level/A-Level curriculum, boarding facilities, or term fees today?',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview'>('gemini-3.5-flash');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickChips = [
    'What are the S.1 admission requirements?',
    'How much are term fees for boarding?',
    'What A-Level science combinations do you offer?',
    'How do I travel to the school in Nyamitanga?',
  ];

  // Offline Knowledge Base for zero-network resilience
  const getOfflineReply = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('s.1') || q.includes('s1') || q.includes('admission') || q.includes('ple') || q.includes('requirement')) {
      return `Assalamu Alaikum. For Senior One (S.1) admissions at Shuhadae Islamic SS:
• PLE Results: Aggregates 4 to 16 (Division 1 & 2).
• Required Documents: Original PLE result slip, Primary Leaving Certificate, recommendation letter from former headteacher or local Imam, 2 passport photos, and birth certificate.
• Application forms can be filled online right here on the Admissions page (even offline!) and printed directly.`;
    }
    if (q.includes('fee') || q.includes('cost') || q.includes('shilling') || q.includes('ugx') || q.includes('pay') || q.includes('money')) {
      return `Our official termly fee structure is as follows:
• S.1 – S.4 (O-Level) Boarding: UGX 950,000 / term
• S.1 – S.4 (O-Level) Day: UGX 520,000 / term
• S.5 – S.6 (A-Level) Boarding: UGX 1,050,000 / term
• S.5 – S.6 (A-Level) Day: UGX 580,000 / term
Payment Channels: Centenary Bank (A/C: 3100084200), Stanbic Bank, or MTN/Airtel SchoolPay Code: 418290.`;
    }
    if (q.includes('combination') || q.includes('a-level') || q.includes('s.5') || q.includes('science') || q.includes('art')) {
      return `Shuhadae offers premier UNEB UACE combinations:
• Sciences: BCM/ICT (Medicine), PCB/Sub-Math (Biomedical), PEM/ICT (Engineering), PCM/ICT (Technology).
• Arts & Economics: HEG/Div (Law), DEG/Arabic (Islamic Finance/Diplomacy), HEL/Sub-Math (Journalism), MEA/ICT (Architecture & Design).
Subsidiary subjects include General Paper + Sub-Math or Sub-ICT.`;
    }
    if (q.includes('location') || q.includes('where') || q.includes('direction') || q.includes('reach') || q.includes('nyamitanga') || q.includes('mbarara')) {
      return `We are located in Nyamitanga Division, Mbarara City, Western Uganda (about 2 km off the Mbarara–Isingiro Highway).
From Mbarara town center: Cross the River Rwizi bridge, branch onto Isingiro Road, and follow our school direction signposts on Nyamitanga Hill (approx. 5 minutes by car or boda boda).`;
    }
    if (q.includes('contact') || q.includes('phone') || q.includes('call') || q.includes('whatsapp') || q.includes('number')) {
      return `Official School Contacts:
• Administration & Bursar: 0705 705 967
• WhatsApp: +256 705 705 967
• Alumni Executive: 0702 365 176 / 0755 260 894
• Email: info@shuhadaeislamicssmbarara.com`;
    }
    return `Assalamu Alaikum! Shuhadae Islamic Secondary School combines top secular academic excellence with authentic Islamic upbringing in Nyamitanga, Mbarara. You can browse our Admissions page, fee breakdown, or call the administration on 0705 705 967.`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');

    // If offline, respond instantly with local offline knowledge engine
    if (!navigator.onLine) {
      setTimeout(() => {
        const offlineReply = getOfflineReply(text);
        const botMsg: ChatMessage = {
          id: `bot-off-${Date.now()}`,
          role: 'model',
          content: `${offlineReply}\n\n[⚡ Answered via Browser Offline Knowledge Engine]`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 300);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          model: selectedModel,
        }),
      });

      if (!res.ok) {
        throw new Error('Server returned non-200');
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.reply || getOfflineReply(text),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('Network error, using offline knowledge base:', err);
      const fallbackReply = getOfflineReply(text);
      const botMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        role: 'model',
        content: `${fallbackReply}\n\n[⚡ Provided via Local Knowledge Base]`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-12 sm:bottom-14 right-4 sm:right-6 z-40">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white px-4 py-3 rounded-2xl shadow-xl hover:shadow-2xl border-2 border-amber-400 hover:scale-105 active:scale-95 transition-all group cursor-pointer"
          aria-label="Open Admissions AI Counselor"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-1 -right-1 ring-2 ring-emerald-900 animate-pulse"></span>
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-xs font-black tracking-tight">AI School Counselor</span>
            <span className="block text-[10px] text-emerald-200">
              {isOffline ? 'Offline Knowledge Ready' : 'Admissions & Inquiries'}
            </span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-emerald-900/20 w-[92vw] sm:w-[410px] h-[540px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-4 border-b-2 border-amber-400 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-950/80 border border-amber-400/60 flex items-center justify-center text-amber-300">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm leading-tight flex items-center gap-1.5">
                  <span>Ustadh Sulaiman (AI Counselor)</span>
                </h4>
                <div className="flex items-center gap-1 text-[10px] text-emerald-200 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                  <span>{isOffline ? 'Offline Mode (Local Knowledge)' : 'Online • Shuhadae Islamic SS'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Model Selector Menu */}
              <div className="relative group">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as any)}
                  className="bg-emerald-950/80 text-[10px] text-amber-300 font-mono px-2 py-1 rounded-lg border border-emerald-700/80 focus:outline-hidden cursor-pointer"
                  title="Switch Gemini Model"
                >
                  <option value="gemini-3.5-flash">gemini-3.5-flash (Balanced)</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Deep reasoning)</option>
                </select>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-emerald-300 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Thread (Scrollable) */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/70 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3 rounded-2xl shadow-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-800 text-white rounded-br-xs font-medium'
                      : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.role === 'user' ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-slate-500 text-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white p-2.5 rounded-2xl border border-slate-200 text-slate-500 italic">
                  Ustadh Sulaiman is formulating advice...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Chip Suggestions */}
          <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-slate-700 transition-colors shrink-0 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isOffline ? "Ask offline questions (fees, requirements)..." : "Ask about admissions, fees, combinations..."}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-slate-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
