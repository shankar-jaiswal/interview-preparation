import React from 'react';
import { Trophy, History as HistoryIcon, RotateCcw, FileText } from 'lucide-react';

export default function SummaryScreen({ history, settings, onRestart }) {
  const scoredRounds = history.filter((item) => item.type === 'bot' && typeof item.score === 'number');
  const averageScore = scoredRounds.length
    ? (scoredRounds.reduce((sum, item) => sum + item.score, 0) / scoredRounds.length).toFixed(1)
    : '0.0';

  return (
    <main className="max-w-6xl mx-auto p-6 pt-12">
      <div className="max-w-4xl mx-auto space-y-12 pb-24 text-center">
        <div className="space-y-6 py-10">
          <div className="inline-flex p-10 bg-blue-500/10 rounded-[3.5rem] border border-blue-500/20 mb-4 shadow-2xl">
            <Trophy size={80} className="text-blue-500" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none text-white">Simulation Concluded</h2>
          <p className="text-slate-400 text-xl italic tracking-tight font-mono">Performance breakdown for the {settings.role} prep.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 px-4 font-mono">
          <div className="bg-slate-900/50 p-10 rounded-[2.5rem] border border-white/5 text-center space-y-3 shadow-sm">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Average Technical Score</p>
            <p className="text-7xl font-black text-blue-500">
              {averageScore}
              <span className="text-sm text-slate-700 font-bold">/10</span>
            </p>
          </div>
          <div className="bg-slate-900/50 p-10 rounded-[2.5rem] border border-white/5 text-center space-y-3 shadow-sm">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rounds Navigated</p>
            <p className="text-7xl font-black text-white">{scoredRounds.length}</p>
          </div>
          <div className="bg-slate-900/50 p-10 rounded-[2.5rem] border border-white/5 text-center space-y-3 flex flex-col justify-center shadow-sm">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Seniority Tier</p>
            <p className="text-3xl font-black text-indigo-400 uppercase tracking-widest">{settings.difficulty}</p>
          </div>
        </div>

        <div className="space-y-8 px-4 text-left mt-12">
          <h3 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-4 text-white font-mono">
            <HistoryIcon className="text-blue-500" size={24} /> Comprehensive Session Log
          </h3>
          <div className="space-y-6">
            {scoredRounds.map((item, index) => (
              <div key={item.id} className="bg-slate-900 border border-white/10 rounded-[3rem] overflow-hidden hover:border-blue-500/30 transition-all shadow-lg">
                <div className="px-10 py-5 bg-white/5 border-b border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Round {index + 1}</span>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full font-mono tracking-tight">{item.score}/10</span>
                </div>
                <div className="p-10 font-mono space-y-4">
                  <p className="text-lg font-bold text-slate-100 leading-snug">“{item.text}”</p>
                  {item.analysis && <p className="text-sm text-slate-400 leading-relaxed">{item.analysis}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 px-4 pt-10 justify-center">
          <button
            onClick={onRestart}
            className="w-full sm:w-64 bg-white text-slate-950 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-slate-200 transition-all active:scale-95"
          >
            <RotateCcw size={18} /> New Session
          </button>
          <button
            className="w-full sm:w-64 bg-slate-800 hover:bg-slate-700 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3 text-white"
            onClick={() => window.print()}
          >
            <FileText size={18} /> Export Transcript
          </button>
        </div>
      </div>
    </main>
  );
}
