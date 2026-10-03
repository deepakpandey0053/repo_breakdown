import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Compass, 
  BookOpen, 
  ArrowRight, 
  ShieldAlert, 
  ShieldCheck, 
  FileCode2, 
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function GuidePanel({ data, onSelectFile }) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!data) return null;

  const runCommands = data.run_locally_commands || [];
  const startGuide = data.start_here_guide || [];
  const securityAlerts = data.security_alerts || [];
  const realAlerts = securityAlerts.filter(
    (alert) => !alert.toLowerCase().includes('no critical secrets') && !alert.toLowerCase().includes('no secrets')
  );

  const handleCopyAll = () => {
    const fullScript = runCommands.join('\n');
    navigator.clipboard.writeText(fullScript);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingle = (cmd, index) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <div className="h-full flex flex-col bg-[#0b0b0f] border-l border-white/10 w-80 sm:w-96 shrink-0 overflow-y-auto custom-scrollbar">
      {/* Panel Top Header */}
      <div className="p-3 border-b border-white/10 bg-[#0e0e14]/90 backdrop-blur flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Onboarding & Run Panel
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
          AST Verified
        </span>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Killer Feature #3: 1-Click "Run it Locally" Terminal Box */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span>1-Click "Run It Locally"</span>
            </div>
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium transition-all"
              title="Copy all commands to clipboard"
            >
              {copiedAll ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Copied All!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy All</span>
                </>
              )}
            </button>
          </div>

          {/* Terminal Box */}
          <div className="rounded-xl bg-[#09090c] border border-white/15 overflow-hidden shadow-xl font-mono text-xs">
            {/* Terminal Window Chrome */}
            <div className="px-3 py-2 bg-white/[0.04] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] text-slate-400 ml-2 font-mono">bash — local environment</span>
              </div>
            </div>

            {/* Terminal Commands List */}
            <div className="p-3 space-y-2 select-text">
              {runCommands.map((cmd, idx) => {
                const isComment = cmd.trim().startsWith('#');
                return (
                  <div
                    key={idx}
                    className="flex items-start justify-between group rounded px-1.5 py-0.5 hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-start gap-2 text-slate-300 overflow-x-auto custom-scrollbar">
                      {!isComment && <span className="text-emerald-400 font-bold select-none">$</span>}
                      <span className={isComment ? 'text-slate-500 italic' : 'text-slate-200 break-all'}>
                        {cmd}
                      </span>
                    </div>

                    {!isComment && (
                      <button
                        onClick={() => handleCopySingle(cmd, idx)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-all shrink-0 ml-2"
                        title="Copy command"
                      >
                        {copiedIndex === idx ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Killer Feature: "Start Here" Reading Guide */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
              <BookOpen className="h-4 w-4 text-cyan-400" />
              <span>"Start Here" Reading Guide</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Step-by-Step
            </span>
          </div>

          <div className="space-y-2.5">
            {startGuide.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onSelectFile && onSelectFile(item.file_name)}
                className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-cyan-500/40 cursor-pointer transition-all space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-[10px] font-bold font-mono">
                      {item.step || idx + 1}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors truncate max-w-[200px]">
                      {item.file_name}
                    </span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-7">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Basic Security Vulnerabilities Flagged */}
        <div className="space-y-2.5 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
              {realAlerts.length > 0 ? (
                <ShieldAlert className="h-4 w-4 text-rose-400" />
              ) : (
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              )}
              <span>Security Scanner Audit</span>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              realAlerts.length > 0
                ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30 font-bold'
                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
            }`}>
              {realAlerts.length > 0 ? `${realAlerts.length} Flagged` : 'Clean AST'}
            </span>
          </div>

          <div className="space-y-2">
            {securityAlerts.map((alert, idx) => {
              const isCleanMsg = alert.toLowerCase().includes('no critical') || alert.toLowerCase().includes('no secrets');
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2 ${
                    isCleanMsg
                      ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300/90'
                      : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                  }`}
                >
                  {isCleanMsg ? (
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span className="font-mono text-[11px] break-words">{alert}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
