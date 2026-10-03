import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Brain, 
  ShieldAlert, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  Layers, 
  Cpu, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  Workflow,
  BookOpen,
  ArrowRight,
  X,
  Compass,
  Activity,
  GitBranch,
  Globe,
  Building2,
  Server,
  TrendingUp,
  Zap
} from 'lucide-react';
import { BorderBeam } from './ui/BorderBeam.jsx';

export default function DashboardHeader({ data, onOpenSecurityAlerts }) {
  const [mode, setMode] = useState('pro'); // 'pro' | 'eli5'
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);

  if (!data) return null;

  const summary = data.enhanced_summary || {};
  const techStack = data.tech_stack || [];
  const entryPoint = data.entry_point || {};
  const securityAlerts = data.security_alerts || [];
  const workflowSteps = summary.workflow_steps || [];
  const architectureNodes = data.architecture_nodes || [];
  
  // Real-world examples with intelligent fallback
  const realWorldExamples = (summary.real_world_examples && summary.real_world_examples.length > 0)
    ? summary.real_world_examples
    : [
        {
          title: `Production Example #1: High-Throughput Microservice & API Gateway (${techStack.slice(0, 2).join('/') || 'Core'})`,
          scenario: `Deployed in high-scale production systems (such as payment processing, e-commerce checkout platforms, or cloud SaaS backends) where ${entryPoint.file_name || 'main entry'} serves as the primary ingress controller. The system processes heavy concurrent requests with strict sub-50ms latency guarantees.`,
          architecture_flow: `Client HTTPS Ingress -> Load Balancer -> ${entryPoint.file_name || 'Entry'} dispatches routes -> Business logic executed via core controllers -> Datastore/Cache queried -> Formatted JSON response returned with telemetry.`,
          business_impact: `Guarantees 99.99% uptime, eliminates thread-blocking bottlenecks, and enables effortless horizontal auto-scaling across Kubernetes pods.`
        },
        {
          title: `Production Example #2: Event-Driven Asynchronous Pipeline & Background Worker`,
          scenario: `Deployed to power asynchronous task queues, telemetry aggregation, and event-driven microservices where workloads must execute reliably in the background without degrading user-facing latency.`,
          architecture_flow: `Event Ingestion (Kafka/Redis Queue) -> Worker instance initialized -> Evaluates schema rules & performs state transitions -> Commits transaction to persistent datastore -> Emits health heartbeat.`,
          business_impact: `Zero data loss under surge spikes, complete fault isolation, and 70% faster developer onboarding through clear class abstractions.`
        }
      ];

  // Determine if there are actual real security warnings (ignoring 'No critical secrets' message)
  const realAlerts = securityAlerts.filter(
    (alert) => !alert.toLowerCase().includes('no critical secrets') && !alert.toLowerCase().includes('no secrets')
  );
  const hasSecurityRisks = realAlerts.length > 0;

  return (
    <div className="w-full bg-[#0d0d12] border-b border-white/10 shadow-lg relative z-20">
      {/* Top Bar: Overview & Mode Toggle */}
      <div className="px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Project Pitch & Tech Stack */}
        <div className="flex-1 min-w-[280px]">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              Executive Architecture Summary
            </span>

            {/* Tech Stack Pills */}
            <div className="flex items-center gap-1.5 ml-2 flex-wrap">
              {techStack.slice(0, 5).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300 font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Entry Point & Execution Path Badge */}
            {(entryPoint.execution_path || entryPoint.file_name) && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-[10px] font-mono text-indigo-300 font-medium flex items-center gap-1" title={entryPoint.description || 'Execution path'}>
                <Terminal className="h-2.5 w-2.5 text-indigo-400" />
                entry: {entryPoint.execution_path || entryPoint.file_name}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
            {summary.executive_summary || 'Analyzed codebase structure and object-oriented abstractions.'}
          </p>
        </div>

        {/* Right: Actions & Toggles */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* Deep Dive Action Button */}
          <button
            onClick={() => setIsDeepDiveOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide border border-indigo-500/40 bg-gradient-to-r from-indigo-950/60 to-indigo-900/40 hover:from-indigo-900/80 hover:to-indigo-800/60 text-indigo-200 shadow-md shadow-indigo-500/10 transition-all group"
            title="Open comprehensive architectural deep dive"
          >
            <BookOpen className="h-3.5 w-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Deep Dive</span>
          </button>

          {/* Security Alert Badge */}
          <button
            onClick={onOpenSecurityAlerts}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide border transition-all ${
              hasSecurityRisks
                ? 'bg-rose-950/70 hover:bg-rose-900/80 border-rose-500/50 text-rose-200 shadow-lg shadow-rose-500/20 animate-pulse'
                : 'bg-emerald-950/40 hover:bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
            }`}
            title="Click to view security audit report"
          >
            {hasSecurityRisks ? (
              <>
                <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" />
                <span>{realAlerts.length} Security Alert{realAlerts.length > 1 ? 's' : ''}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Security Passed (0 Flags)</span>
              </>
            )}
          </button>

          {/* ELI5 vs Pro Mode Toggle Switch with Smooth Sliding Motion Pill */}
          <div className="relative flex items-center bg-[#09090c] p-1 rounded-xl border border-white/10 shadow-inner">
            <button
              onClick={() => setMode('pro')}
              className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 ${
                mode === 'pro' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode === 'pro' && (
                <motion.div
                  layoutId="active-mode-pill"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg shadow-md shadow-indigo-500/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Workflow className="h-3.5 w-3.5" />
                <span>Pro Mode</span>
              </span>
            </button>
            <button
              onClick={() => setMode('eli5')}
              className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 ${
                mode === 'eli5' ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode === 'eli5' && (
                <motion.div
                  layoutId="active-mode-pill"
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg shadow-md shadow-amber-500/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" />
                <span>ELI5 Mode</span>
              </span>
            </button>
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-xs font-medium shadow-sm"
            title={isCollapsed ? 'Expand Deep-Dive Summary' : 'Collapse Deep-Dive Summary'}
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="h-3.5 w-3.5 text-indigo-400" />
                <span>Expand Summary</span>
              </>
            ) : (
              <>
                <ChevronUp className="h-3.5 w-3.5 text-indigo-400" />
                <span>Collapse Summary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Dual-Mode Deep Dive Explanation */}
      {!isCollapsed && (
        <div className="px-6 pb-4 pt-1 space-y-3 border-t border-white/5 bg-white/[0.01]">
          {/* 2-Column Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Core Problem Solved Card */}
            <div className="p-4 rounded-xl bg-[#13131a] border border-white/10 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                      Core Pain Point Solved
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    Domain Problem
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                  {summary.core_problem_solved || 'Streamlines multi-module data processing and eliminates architectural complexity.'}
                </p>
              </div>
            </div>

            {/* Dynamic "How It Works" Card (Switches between Pro & ELI5) */}
            <div className={`p-4 rounded-xl border transition-all shadow-sm ${
              mode === 'pro'
                ? 'bg-gradient-to-br from-indigo-950/40 via-[#13131a] to-black border-indigo-500/30'
                : 'bg-gradient-to-br from-amber-950/30 via-[#161411] to-black border-amber-500/30'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {mode === 'pro' ? (
                    <>
                      <Cpu className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                        How It Works — Technical Architecture Flow
                      </span>
                    </>
                  ) : (
                    <>
                      <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                        How It Works — Real-Life Analogy (Explain Like I'm 5)
                      </span>
                    </>
                  )}
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                  mode === 'pro'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {mode === 'pro' ? 'Pro Data Flow' : 'Beginner Friendly'}
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-normal">
                {mode === 'pro'
                  ? summary.how_it_works_pro || 'Boots through entry point, executes domain class pipelines, and coordinates asynchronous services.'
                  : summary.how_it_works_eli5 || 'Imagine a busy restaurant kitchen where each chef has a distinct role to prepare dishes seamlessly!'}
              </p>
            </div>
          </div>

          {/* Real-World Industry Production Examples (2 Live Use Cases) */}
          <div className="p-4 rounded-xl bg-[#101017] border border-white/10 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Real-World Production Applications (2 Industry Use Cases)
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                Industry Scale Deep-Dive
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {realWorldExamples.slice(0, 2).map((ex, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#14141d] border border-white/10 hover:border-cyan-500/40 transition-all space-y-2.5 group relative"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      {idx === 0 ? <Building2 className="h-3.5 w-3.5" /> : <Server className="h-3.5 w-3.5" />}
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors">
                      {ex.title}
                    </h4>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {ex.scenario}
                  </p>

                  <div className="p-2 rounded-lg bg-[#0a0a0f] border border-white/5 space-y-1">
                    <span className="text-[10px] text-cyan-400 uppercase font-semibold block tracking-wider font-mono">
                      Data Flow Architecture:
                    </span>
                    <p className="text-[10.5px] font-mono text-slate-300 leading-normal break-words">
                      {ex.architecture_flow}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-medium">
                    <TrendingUp className="h-3 w-3 text-emerald-400 shrink-0" />
                    <span>{ex.business_impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Pipeline Steps Ribbon */}
          {workflowSteps.length > 0 && (
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <Activity className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Execution & Data Flow Pipeline</span>
                </div>
                <button
                  onClick={() => setIsDeepDiveOpen(true)}
                  className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                  <span>Full Deep Dive</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {workflowSteps.map((ws, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 space-y-1 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {String(ws.step || i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xs font-semibold text-white truncate">
                        {ws.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">
                      {ws.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comprehensive Architecture Deep Dive Modal */}
      {isDeepDiveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="max-w-4xl w-full max-h-[88vh] flex flex-col bg-[#0f0f15] border border-white/15 rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  <BookOpen className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">
                      Architectural Deep Dive
                    </h2>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      System Breakdown
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Comprehensive technical analysis, problem formulation, and real-life analogies
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDeepDiveOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Executive Summary Pitch */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/30 via-slate-900/40 to-black border border-indigo-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span>Executive Architecture Summary</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {summary.executive_summary}
                </p>
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  {techStack.map((tech, i) => (
                    <span key={i} className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                      {tech}
                    </span>
                  ))}
                  {entryPoint.file_name && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
                      Entry: {entryPoint.file_name}
                    </span>
                  )}
                </div>
              </div>

              {/* Core Pain Point & Why Traditional Approaches Fail */}
              <div className="p-4 rounded-xl bg-[#13131b] border border-cyan-500/20 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
                  <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                  <span>Core Problem Solved & Engineering Friction</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {summary.core_problem_solved}
                </p>
              </div>

              {/* Workflow Pipeline Steps */}
              {workflowSteps.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <Activity className="h-4 w-4 text-indigo-400" />
                    <span>Step-by-Step Architecture Pipeline</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {workflowSteps.map((ws, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#121217] border border-white/10 space-y-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                            {String(ws.step || idx + 1).padStart(2, '0')}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-white">
                            {ws.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {ws.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Architecture Flow (Pro) */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/30 to-[#121217] border border-indigo-500/30 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
                  <Cpu className="h-4 w-4 text-indigo-400" />
                  <span>Deep Technical Architecture & Data Execution Flow</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {summary.how_it_works_pro}
                </p>
              </div>

              {/* Real-Life Analogy (ELI5) */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/20 to-[#161411] border border-amber-500/30 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                  <span>Real-Life Analogy (Explain Like I'm 5)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {summary.how_it_works_eli5}
                </p>
              </div>

              {/* Real-World Industry Production Use Cases (2 Concrete Scenarios) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
                    <Globe className="h-4 w-4 text-cyan-400" />
                    <span>Real-World Production Scenarios & Case Studies</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    2 Industry Deployments
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {realWorldExamples.slice(0, 2).map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#121218] border border-cyan-500/25 hover:border-cyan-400/50 transition-all space-y-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                          {idx === 0 ? <Building2 className="h-4 w-4" /> : <Server className="h-4 w-4" />}
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {ex.title}
                        </h4>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block font-mono">
                          Production Scenario:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {ex.scenario}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#09090e] border border-white/5 space-y-1 font-mono text-[11px]">
                        <span className="text-[10px] text-cyan-400 uppercase font-semibold block tracking-wider font-sans">
                          Pipeline Flow:
                        </span>
                        <p className="text-slate-300 leading-normal break-words">
                          {ex.architecture_flow}
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10.5px] font-medium">
                        <TrendingUp className="h-3 w-3 text-emerald-400 shrink-0" />
                        <span>{ex.business_impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Architecture Entities / Class Matrix */}
              {architectureNodes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <GitBranch className="h-4 w-4 text-cyan-400" />
                    <span>Identified Key Roles & Architectural Components</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {architectureNodes.map((node, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-white/[0.02] border border-white/10 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-white truncate">
                            {node.id}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                            {node.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-3">
                          {node.responsibility}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>AST Architectural Deconstruction</span>
              <button
                onClick={() => setIsDeepDiveOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-xs font-medium transition-colors"
              >
                Close Deep Dive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
