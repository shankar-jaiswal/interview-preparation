import React, { useEffect, useRef } from 'react';
import {
  Terminal,
  Bot,
  User,
  Send,
  Loader2,
  TrendingUp,
  CheckCircle,
  Sparkles,
  MessageSquare,
  Volume2,
  Square
} from 'lucide-react';

export default function InterviewScreen({
  history,
  answer,
  setAnswer,
  loading,
  feedback,
  onSubmit,
  onRepeatVoice,
  isSpeaking
}) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <main className="max-w-6xl mx-auto p-6 pt-12">
      <div className="max-w-6xl mx-auto space-y-10 font-mono">
        <div className="grid lg:grid-cols-[1fr_340px] gap-10 items-start">
          <div className="space-y-8">
            <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl h-[600px] flex flex-col overflow-hidden relative">
              <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Terminal size={18} className="text-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Live Transcript Feed
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onRepeatVoice}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
                    title={isSpeaking ? 'Stop audio' : 'Read current question aloud'}
                  >
                    {isSpeaking ? (
                      <Square size={16} className="text-slate-300" />
                    ) : (
                      <Volume2 size={16} className="text-slate-300" />
                    )}
                  </button>

                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-950/30">
                {history.map((msg, i) => (
                  <div
                    key={msg.id || i}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex gap-4 max-w-[85%] ${
                        msg.type === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-lg ${
                          msg.type === 'user'
                            ? 'bg-indigo-600 shadow-indigo-500/20'
                            : 'bg-blue-600 shadow-blue-500/20'
                        }`}
                      >
                        {msg.type === 'user' ? (
                          <User size={18} className="text-white" />
                        ) : (
                          <Bot size={18} className="text-white" />
                        )}
                      </div>

                      <div
                        className={`p-5 rounded-3xl ${
                          msg.type === 'user'
                            ? 'bg-indigo-900/40 border border-indigo-500/30 text-indigo-100'
                            : 'bg-slate-800 border border-white/5 text-slate-200'
                        } shadow-sm`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div ref={chatEndRef} />
              </div>

              <div className="p-6 bg-slate-900 border-t border-white/5">
                <div className="flex gap-4">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Provide your answer here..."
                    className="flex-1 bg-slate-950 border border-white/10 rounded-2xl p-5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all placeholder:text-slate-600"
                    rows="2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        onSubmit();
                      }
                    }}
                  />

                  <button
                    onClick={onSubmit}
                    disabled={loading || !answer.trim()}
                    className="bg-white text-slate-950 hover:bg-slate-200 disabled:bg-slate-800 disabled:text-slate-600 px-6 rounded-2xl transition-all self-end h-[60px] shadow-lg active:scale-95 flex items-center justify-center"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <Send size={24} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] space-y-6 shadow-xl relative overflow-hidden">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                <TrendingUp size={16} className="text-blue-500" />
                Evaluation Hub
              </h3>

              {feedback ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-500">
                      Live Rating
                    </span>
                    <div className="flex items-baseline gap-1 font-mono">
                      <span
                        className={`text-4xl font-black ${
                          feedback.score > 7 ? 'text-emerald-500' : 'text-amber-500'
                        }`}
                      >
                        {feedback.score}
                      </span>
                      <span className="text-xs font-bold text-slate-700">/10</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2 underline decoration-emerald-500/50 underline-offset-4">
                        <CheckCircle size={12} />
                        High Quality
                      </p>
                      <ul className="text-xs space-y-2 text-slate-400">
                        {feedback.strengths?.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2 underline decoration-amber-500/50 underline-offset-4">
                        <Sparkles size={12} />
                        Improvements
                      </p>
                      <ul className="text-xs space-y-2 text-slate-400">
                        {feedback.improvements?.map((im, i) => (
                          <li key={i}>{im}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {feedback.analysis && (
                    <div className="pt-2 border-t border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                        Analysis
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {feedback.analysis}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center space-y-4 border-2 border-dashed border-white/5 rounded-3xl">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <MessageSquare className="text-slate-700" size={20} />
                  </div>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    Awaiting entry
                  </p>
                </div>
              )}
            </div>

            <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[2rem] space-y-3">
              <div className="flex items-center gap-2 text-blue-400">
                <Sparkles size={16} />
                <h4 className="text-xs font-black uppercase tracking-widest">Tip</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                Click the same speaker button once to play and again to stop.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}