import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Github, 
  RefreshCw, 
  Sparkles, 
  GitBranch, 
  Terminal, 
  ShieldCheck, 
  ExternalLink,
  Flame,
  Star
} from 'lucide-react';
import { BorderBeam } from './ui/BorderBeam.jsx';

export default function Navbar({ onReset, currentRepo }) {
  return (
    <header className="sticky top-0 z-50 px-4 sm:px-8 py-3.5 pointer-events-auto">
      <nav className="max-w-7xl mx-auto rounded-2xl bg-obsidian-900/80 backdrop-blur-2xl border border-white/[0.09] px-5 py-3 flex items-center justify-between shadow-luxury relative overflow-hidden transition-all duration-300">
        {/* Subtle luminous top-edge hairline highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        {/* Brand Logo & Interactive Title */}
        <div 
          className="flex items-center gap-3.5 cursor-pointer group select-none" 
          onClick={onReset}
          role="button"
          tabIndex={0}
        >
          <div className="relative h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-400 p-[1px] shadow-glow-sm transition-transform duration-500 group-hover:scale-105 group-hover:shadow-glow-md">
            <div className="h-full w-full bg-obsidian-950 rounded-[15px] flex items-center justify-center relative overflow-hidden">
              <Cpu className="h-5 w-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <BorderBeam size={80} duration={8} colorFrom="#818cf8" colorTo="#06b6d4" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-extrabold text-lg tracking-tight luxury-gradient-text drop-shadow-sm">
                RepoBreakdown
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 shadow-inner">
                <Sparkles className="h-2.5 w-2.5 text-cyan-400 animate-pulse" />
                AST v2.5
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5 font-medium tracking-tight">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Zero-Hallucination Architecture & Onboarding
            </p>
          </div>
        </div>

        {/* Right Section: Active Repo Badge & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {currentRepo ? (
            <>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-slate-200 font-mono shadow-sm">
                <GitBranch className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-[240px] font-medium">{currentRepo}</span>
              </div>

              <button
                onClick={onReset}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/20 to-cyan-500/20 hover:from-indigo-600/30 hover:to-cyan-500/30 border border-indigo-500/40 text-indigo-200 text-xs font-semibold transition-all shadow-sm active:scale-95 group"
              >
                <RefreshCw className="h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-500 text-cyan-300" />
                <span className="hidden sm:inline">New Repo</span>
              </button>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AST Engine Ready</span>
            </div>
          )}

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] text-slate-300 hover:text-white transition-all shadow-sm group text-xs font-medium"
            title="GitHub Repository"
          >
            <Github className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
            <span className="hidden sm:inline">Star</span>
            <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-white/[0.06] text-[10px] text-slate-400 font-mono">
              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" /> 1.2k
            </span>
          </a>
        </div>
      </nav>
    </header>
  );
}
