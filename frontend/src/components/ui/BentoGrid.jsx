import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CardSpotlight } from './CardSpotlight.jsx';
import { 
  GitBranch, 
  Terminal, 
  ShieldCheck, 
  Network, 
  BrainCircuit, 
  Sparkles, 
  ArrowUpRight,
  Code2,
  Cpu,
  Layers,
  CheckCircle2,
  Copy,
  Check,
  Flame,
  Zap,
  Radio,
  Lock,
  Boxes
} from 'lucide-react';

export function BentoGrid() {
  const [activeTab, setActiveTab] = useState('npm');
  const [copied, setCopied] = useState(false);
  const [demoEli5, setDemoEli5] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);

  const commandMap = {
    npm: 'npm install && npm run dev',
    pip: 'poetry install && poetry run uvicorn app:main',
    docker: 'docker-compose up -d --build',
  };

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Next-Generation Architecture Engine</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Engineered for Instant Comprehension
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Explore the five pillars that make RepoBreakdown the world's most luxurious codebase intelligence platform.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: AST Ingestion & Multiple Inheritance (Col-span 2) */}
        <CardSpotlight className="md:col-span-2 relative min-h-[340px] flex flex-col justify-between group bg-obsidian-900/70 border-white/[0.08] p-6 sm:p-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 shadow-glow-sm">
                <Code2 className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.04] text-indigo-300 border border-white/[0.08]">
                Killer Feature #1
              </span>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">
                Native AST Extraction & Inheritance Tracing
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                LLM context windows fail on 100,000+ line repos. Our Python AST engine strips implementation bodies and comments to map exact classes, function decorators, and multiple inheritance trees.
              </p>
            </div>
          </div>

          {/* Interactive Interactive AST Visual Node Preview */}
          <div className="mt-6 rounded-2xl bg-obsidian-950/90 border border-white/[0.08] p-4 font-mono text-xs shadow-inner relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.06] text-[11px]">
              <span className="flex items-center gap-2 text-indigo-400 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                ast_hierarchy_extractor.py
              </span>
              <span className="text-slate-400">Zero Hallucination</span>
            </div>

            {/* Tree nodes */}
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-purple-400 font-bold">class</span>
                <span className="text-cyan-300 font-bold">CheckoutOrchestrator</span>
                <span className="text-slate-500">(</span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[11px]">BaseService</span>
                <span className="text-slate-500">,</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[11px]">AuditMixin</span>
                <span className="text-slate-500">)</span>
              </div>
              <div className="pl-6 border-l-2 border-indigo-500/30 space-y-1 text-slate-400 text-[11px]">
                <p>├─ <span className="text-emerald-400 font-semibold">@metric_latency</span>(name="checkout_duration")</p>
                <p>├─ <span className="text-purple-400">async def</span> <span className="text-cyan-300 font-semibold">process_payment</span>(order: <span className="text-amber-300">OrderPayload</span>)</p>
                <p className="text-slate-500">└─ Multiple inheritance detected: <span className="text-indigo-400 font-mono">BaseService</span> ➔ <span className="text-purple-400 font-mono">AuditMixin</span></p>
              </div>
            </div>
          </div>
        </CardSpotlight>

        {/* Card 2: Interactive React Flow X-Ray Graph */}
        <CardSpotlight className="relative min-h-[340px] flex flex-col justify-between group bg-obsidian-900/70 border-white/[0.08] p-6 sm:p-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 shadow-glow-sm">
                <Network className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.04] text-cyan-300 border border-white/[0.08]">
                Killer Feature #2
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">
                Interactive Architecture X-Ray
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Rendered with React Flow. Explore class nodes, dependencies, and animated glowing edges connecting controllers and services.
              </p>
            </div>
          </div>

          {/* Interactive Mini Node Canvas Preview */}
          <div className="mt-6 p-4 rounded-2xl bg-obsidian-950/90 border border-cyan-500/20 relative overflow-hidden select-none">
            <div className="flex flex-col items-center gap-3">
              <div 
                onMouseEnter={() => setHoveredNode('auth')}
                onMouseLeave={() => setHoveredNode(null)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all duration-300 cursor-pointer ${
                  hoveredNode === 'auth' ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 scale-105 shadow-glow-cyan' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                }`}
              >
                AuthController
              </div>

              {/* Glowing animated line */}
              <div className="w-[2px] h-6 bg-gradient-to-b from-cyan-400 via-indigo-500 to-purple-400 animate-pulse" />

              <div className="flex items-center gap-4">
                <div 
                  onMouseEnter={() => setHoveredNode('session')}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all duration-300 cursor-pointer ${
                    hoveredNode === 'session' ? 'bg-indigo-500/25 border-indigo-400 text-indigo-200 scale-105 shadow-glow-md' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                  }`}
                >
                  SessionService
                </div>
                <div 
                  onMouseEnter={() => setHoveredNode('audit')}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all duration-300 cursor-pointer ${
                    hoveredNode === 'audit' ? 'bg-purple-500/25 border-purple-400 text-purple-200 scale-105' : 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                  }`}
                >
                  AuditMixin
                </div>
              </div>
            </div>
            <div className="text-center mt-3 text-[10px] text-slate-500 font-mono">
              Hover nodes to trace data flow
            </div>
          </div>
        </CardSpotlight>

        {/* Card 3: 1-Click Run It Locally Generator */}
        <CardSpotlight className="relative min-h-[340px] flex flex-col justify-between group bg-obsidian-900/70 border-white/[0.08] p-6 sm:p-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/25 shadow-glow-sm">
                <Terminal className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.04] text-amber-300 border border-white/[0.08]">
                Killer Feature #3
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-200 transition-colors">
                1-Click Run It Locally
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Automatic dependency parsing across package manifests produces exact terminal commands for zero-friction local bootstrap.
              </p>
            </div>
          </div>

          {/* Interactive Tabbed Terminal Card */}
          <div className="mt-6 rounded-2xl bg-obsidian-950/90 border border-white/[0.08] p-4 text-xs font-mono">
            {/* Tabs */}
            <div className="flex items-center justify-between mb-3 border-b border-white/[0.06] pb-2">
              <div className="flex gap-1.5">
                {['npm', 'pip', 'docker'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                      activeTab === tab 
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleCopy(commandMap[activeTab])}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Copy command"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-slate-300 flex items-center gap-2 bg-obsidian-900 p-2.5 rounded-xl border border-white/[0.04]">
              <span className="text-indigo-400 font-bold">$</span>
              <span className="truncate">{commandMap[activeTab]}</span>
            </div>
          </div>
        </CardSpotlight>

        {/* Card 4: Basic Security Scanner Radar */}
        <CardSpotlight className="relative min-h-[340px] flex flex-col justify-between group bg-obsidian-900/70 border-white/[0.08] p-6 sm:p-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/25 shadow-glow-sm">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.04] text-rose-300 border border-white/[0.08]">
                Killer Feature #4
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-200 transition-colors">
                Heuristic Security & Secret Scanner
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                AST & regex sweeps actively flag exposed API tokens, JWT secrets, passwords, and sensitive config before onboarding.
              </p>
            </div>
          </div>

          {/* Animated Radar Scanner Mock */}
          <div className="mt-6 p-4 rounded-2xl bg-obsidian-950/90 border border-rose-500/20 relative overflow-hidden flex items-center justify-between">
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Zero Critical Leaks</span>
              </div>
              <div className="text-slate-400">
                <span>12 Rules Scanned: </span>
                <span className="text-indigo-300">AWS, OpenAI, Passwords</span>
              </div>
            </div>

            {/* Radar Circle */}
            <div className="relative h-12 w-12 rounded-full border border-rose-500/30 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-rose-400 animate-ping" />
              <div className="absolute inset-0 rounded-full border border-rose-400/40 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
        </CardSpotlight>

        {/* Card 5: ELI5 vs Pro Neural Switcher */}
        <CardSpotlight className="relative min-h-[340px] flex flex-col justify-between group bg-obsidian-900/70 border-white/[0.08] p-6 sm:p-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-glow-sm">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.04] text-emerald-300 border border-white/[0.08]">
                Killer Feature #5
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-200 transition-colors">
                Dual-Mode ELI5 & Pro Engine
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Toggle between deep technical data flow summaries and beginner-friendly real-world metaphors with a single click.
              </p>
            </div>
          </div>

          {/* Interactive Switch Demo */}
          <div className="mt-6 rounded-2xl bg-obsidian-950/90 border border-white/[0.08] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Mode Preview:</span>
              <button
                onClick={() => setDemoEli5(!demoEli5)}
                className={`px-3 py-1 rounded-full text-xs font-semibold font-mono transition-all cursor-pointer border ${
                  demoEli5
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-glow-sm'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                }`}
              >
                {demoEli5 ? '⚡ ELI5 Mode' : '🔬 Pro Mode'}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-900 border border-white/[0.04] text-xs leading-relaxed transition-all">
              {demoEli5 ? (
                <p className="text-amber-200 font-sans">
                  "Think of it like an air-traffic controller: Instead of letting all 50 planes land at once, it assigns precise runways so nothing ever crashes!"
                </p>
              ) : (
                <p className="text-slate-300 font-mono text-[11px]">
                  "Non-blocking I/O multiplexing utilizing an async event loop to handle concurrent socket descriptors with sub-10ms latency."
                </p>
              )}
            </div>
          </div>
        </CardSpotlight>

      </div>
    </div>
  );
}
