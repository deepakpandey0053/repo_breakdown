import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  GitBranch, 
  Terminal, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Network, 
  BookOpen, 
  CheckCircle2, 
  Code2, 
  X,
  Flame,
  Boxes,
  Cpu,
  CornerDownLeft,
  ChevronRight
} from 'lucide-react';
import { Spotlight } from './ui/Spotlight.jsx';
import { BorderBeam } from './ui/BorderBeam.jsx';
import { BentoGrid } from './ui/BentoGrid.jsx';
import { Scene } from './Scene.jsx';

const SAMPLE_REPOS = [
  { name: 'expressjs/express', url: 'https://github.com/expressjs/express', lang: 'Node.js', desc: 'Fast, unopinionated web framework', color: 'text-emerald-400' },
  { name: 'pallets/flask', url: 'https://github.com/pallets/flask', lang: 'Python', desc: 'WSGI micro web framework', color: 'text-cyan-400' },
  { name: 'tiangolo/fastapi', url: 'https://github.com/tiangolo/fastapi', lang: 'FastAPI', desc: 'High-performance async Python', color: 'text-teal-400' },
  { name: 'facebook/react', url: 'https://github.com/facebook/react', lang: 'TypeScript', desc: 'UI component library', color: 'text-indigo-400' },
];

const METRICS = [
  { label: 'Token Window Bypass', value: '100% AST Native', desc: 'Zero token truncation', icon: Cpu, accent: 'from-indigo-400 to-cyan-300' },
  { label: 'Hallucination Rate', value: '0.0% Strict', desc: 'Factual code extraction', icon: ShieldCheck, accent: 'from-emerald-400 to-teal-300' },
  { label: 'Inheritance Depth', value: 'Multi-OOP', desc: 'Mixins & multiple inheritance', icon: Network, accent: 'from-purple-400 to-indigo-300' },
  { label: 'Average Ingestion', value: '< 3.8s', desc: 'Blazing fast AST pipeline', icon: Zap, accent: 'from-amber-400 to-orange-300' },
];

export default function Hero({ onAnalyze, isLoading, loadingStep }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  const handleSampleClick = (sampleUrl) => {
    setUrl(sampleUrl);
    onAnalyze(sampleUrl);
  };

  return (
    <div className="relative w-full flex flex-col items-center bg-grid-pattern pb-24 overflow-hidden">
      {/* Dynamic Cursor Spotlight Following the Mouse */}
      <Spotlight size={550} color="rgba(99, 102, 241, 0.14)" />

      {/* Luxury Ambient Glow Spheres */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-cyan-500/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-96 -left-48 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 -right-48 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl w-full text-center relative z-10 space-y-8 px-4 pt-10 sm:pt-16 pb-12"
      >
        {/* Shimmer Announcement Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-obsidian-800/90 border border-indigo-500/30 text-indigo-300 text-xs font-medium tracking-wide shadow-glow-sm backdrop-blur-xl group hover:border-indigo-500/50 transition-all cursor-default">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-semibold text-white">AST Architecture Engine:</span>
          <span className="text-slate-300">Zero-hallucination codebase X-Ray & Onboarding</span>
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
        </div>

        {/* Monumental Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
            Deconstruct Any Codebase <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-cyan-300 to-emerald-300 drop-shadow-sm">
              With Architectural Brilliance.
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
            Bypass token limits with AST skeleton parsing. RepoBreakdown uncovers complex class hierarchies, multiple inheritance flows, and generates instant onboarding reading paths.
          </p>
        </div>

        {/* Search Bar Form with Dual BorderBeam & Keyboard Hint */}
        <form onSubmit={handleSubmit} className="max-w-2xl w-full mx-auto relative group">
          <div className="relative flex items-center gap-2 rounded-2xl bg-obsidian-900/90 border border-white/[0.12] p-2 shadow-2xl focus-within:border-indigo-500/80 focus-within:ring-4 focus-within:ring-indigo-500/20 backdrop-blur-2xl transition-all duration-300">
            <BorderBeam size={220} duration={9} colorFrom="#6366f1" colorTo="#06b6d4" />
            <div className="pl-3.5 pr-1 text-slate-400 shrink-0">
              <Search className="h-5 w-5 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/owner/repository"
              disabled={isLoading}
              className="flex-1 min-w-0 bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none font-mono py-2.5 px-2"
            />
            {url && !isLoading && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                title="Clear input"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Keyboard shortcut indicator */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-[10px] text-slate-400 font-mono select-none">
              <span>Enter</span>
              <CornerDownLeft className="h-2.5 w-2.5" />
            </div>

            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-glow-sm hover:shadow-glow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Parsing AST...</span>
                </>
              ) : (
                <>
                  <span>Breakdown Repo</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* High-Tech Terminal Ingestion HUD */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto p-5 rounded-2xl bg-obsidian-850/95 border border-indigo-500/40 backdrop-blur-2xl text-left space-y-3.5 shadow-2xl relative overflow-hidden"
            >
              <BorderBeam size={140} duration={5} colorFrom="#38bdf8" colorTo="#a855f7" />
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center gap-2 text-indigo-300 font-mono tracking-wider">
                  <Terminal className="h-4 w-4 animate-spin text-cyan-400" />
                  AST INGESTION ENGINE
                </span>
                <span className="font-mono text-cyan-400 font-medium animate-pulse flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  PROCESSING
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-slate-900/80 h-2 rounded-full overflow-hidden p-[1px] border border-white/10">
                <div className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full w-4/5 animate-pulse rounded-full shadow-glow-cyan" />
              </div>

              {/* Console log simulator */}
              <div className="p-3 rounded-xl bg-obsidian-950/80 border border-white/[0.06] font-mono text-[11px] text-slate-300 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-indigo-400">›</span>
                  <span>Ingesting repository tree without token saturation</span>
                  <span className="text-emerald-400 ml-auto font-semibold">OK</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-300">
                  <span className="text-cyan-400 animate-pulse">›</span>
                  <span>{loadingStep || 'Analyzing Abstract Syntax Trees & multiple inheritance hierarchy...'}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Launch Sample Repositories */}
        {!isLoading && (
          <div className="pt-2 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
              Or explore popular open-source architectures:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-2xl mx-auto">
              {SAMPLE_REPOS.map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => handleSampleClick(sample.url)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-indigo-500/15 border border-white/[0.08] hover:border-indigo-500/50 text-xs font-mono text-slate-300 hover:text-white transition-all duration-200 group shadow-sm active:scale-95 cursor-pointer"
                >
                  <GitBranch className="h-3.5 w-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
                  <span>{sample.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] font-semibold ${sample.color}`}>
                    {sample.lang}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Live Metrics Row with Luxury Glass Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-5xl w-full px-4 mb-10 relative z-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-obsidian-900/60 border border-white/[0.08] backdrop-blur-xl shadow-luxury">
          {METRICS.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <div 
                key={i} 
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                    {metric.label}
                  </span>
                  <Icon className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className={`text-xl sm:text-2xl font-black font-mono bg-clip-text text-transparent bg-gradient-to-r ${metric.accent}`}>
                  {metric.value}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-mono">
                  {metric.desc}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ThreeUI Interactive CRT Zion Terminal Scene */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="max-w-5xl w-full px-4 mb-16 relative z-10"
      >
        <div className="relative rounded-3xl overflow-hidden border border-emerald-500/20 bg-obsidian-950/95 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-emerald-500/20 bg-obsidian-900/90">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-semibold text-white tracking-wide font-mono">Zion Boot Log — CRT Terminal</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/30">Raw WebGL + Canvas 2D</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              19-row Zion boot log typing onto green phosphor
            </div>
          </div>
          <div className="relative w-full h-[520px]">
            <Scene />
          </div>
        </div>
      </motion.div>

      {/* 21st.dev Bento Grid Feature Showcase */}
      <div className="relative z-10 w-full">
        <BentoGrid />
      </div>
    </div>
  );
}
