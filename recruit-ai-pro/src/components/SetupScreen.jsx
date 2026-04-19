import React from 'react';
import {
  BrainCircuit,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
  Settings,
  ChevronRight,
  Loader2
} from 'lucide-react';

const roles = [
  'Frontend Developer',
  'Backend Developer',
  'Fullstack Engineer',
  'Mobile Developer',
  'Data Scientist',
  'System Architect',
  'Product Manager'
];

const levels = ['Junior', 'Intermediate', 'Senior', 'Lead/Staff'];

export default function SetupScreen({
  settings,
  setSettings,
  loading,
  onStart,
  userId
}) {
  return (
    <>
      <nav className="border-b border-white/5 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
              <BrainCircuit size={26} className="text-white" />
            </div>

            <div>
              <h1 className="text-xl font-black leading-none uppercase tracking-tighter text-blue-50">
                Recruit<span className="text-blue-500">AI</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-bold tracking-widest mt-1 uppercase">
                Pro Simulation
              </p>
            </div>
          </div>

          {userId && (
            <div className="hidden sm:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                {userId.slice(0, 12)}
              </span>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 pt-12">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck size={14} />
                <span>AI-Powered Preparation</span>
              </div>

              <h2 className="text-5xl lg:text-7xl font-black leading-[0.95] tracking-tighter text-blue-50">
                Crush the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                  technical loop.
                </span>
              </h2>

              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                Practice mock interviews with AI that tracks your depth, gives
                technical feedback, and saves your progress.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-2">
                <TrendingUp className="text-blue-500" size={20} />
                <p className="text-sm font-bold text-white uppercase tracking-tight">
                  Smart Scoring
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Interview responses are reviewed with structured feedback.
                </p>
              </div>

              <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-2">
                <RotateCcw className="text-indigo-500" size={20} />
                <p className="text-sm font-bold text-white uppercase tracking-tight">
                  Persistent History
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Your full session is stored in Firestore.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] shadow-2xl relative">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <Settings size={20} className="text-blue-500" />
                <h3 className="text-xl font-bold uppercase tracking-widest text-white">
                  Configuration
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-3 block tracking-widest font-mono">
                    Target Role
                  </label>
                  <select
                    value={settings.role}
                    onChange={(e) =>
                      setSettings({ ...settings, role: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-white/5 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer hover:bg-slate-700 text-white"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 mb-3 block tracking-widest font-mono">
                      Intensity
                    </label>
                    <select
                      value={settings.difficulty}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          difficulty: e.target.value
                        })
                      }
                      className="w-full bg-slate-800 border border-white/5 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer hover:bg-slate-700 text-white"
                    >
                      {levels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 mb-3 block tracking-widest font-mono">
                      Rounds
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={settings.qCount}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          qCount: Math.max(
                            1,
                            Math.min(10, Number(e.target.value) || 1)
                          )
                        })
                      }
                      className="w-full bg-slate-800 border border-white/5 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none hover:bg-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={onStart}
                disabled={loading || !userId}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 py-5 rounded-[2rem] font-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-95 text-white disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : !userId ? (
                  'CONNECTING...'
                ) : (
                  'START SIMULATION'
                )}

                {!loading && <ChevronRight size={20} />}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}