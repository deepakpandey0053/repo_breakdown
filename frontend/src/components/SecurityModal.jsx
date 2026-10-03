import React from 'react';
import { ShieldAlert, ShieldCheck, X, AlertTriangle, FileCode2, Copy, Check } from 'lucide-react';

export default function SecurityModal({ alerts = [], isOpen, onClose }) {
  if (!isOpen) return null;

  const realAlerts = alerts.filter(
    (alert) => !alert.toLowerCase().includes('no critical secrets') && !alert.toLowerCase().includes('no secrets')
  );
  const isClean = realAlerts.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-[#0f0f14] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className={`px-5 py-4 border-b border-white/10 flex items-center justify-between ${
          isClean ? 'bg-emerald-950/30' : 'bg-rose-950/40'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              isClean ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {isClean ? <ShieldCheck className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AST Security Audit Report</h3>
              <p className="text-xs text-slate-400">
                {isClean ? 'All scanned files passed heuristic secret detection' : `${realAlerts.length} potential security exposure(s) detected`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar">
          {isClean ? (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-center space-y-2">
              <ShieldCheck className="h-8 w-8 text-emerald-400 mx-auto" />
              <h4 className="text-xs font-bold text-emerald-300">Clean Heuristic Scan</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                No high-entropy API tokens, hardcoded private keys, exposed database credentials, or secret assignments were detected during the AST parsing phase.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <p>
                  The static AST scanner detected patterns matching credential assignments. Please ensure these are either environment variables or mock test fixtures before deploying to production.
                </p>
              </div>

              <div className="space-y-2">
                {realAlerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#14141c] border border-rose-500/40 text-xs space-y-1"
                  >
                    <div className="flex items-center gap-2 font-mono text-rose-300 font-semibold">
                      <ShieldAlert className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                      <span>Warning #{idx + 1}</span>
                    </div>
                    <p className="font-mono text-slate-300 pl-5 text-[11px] leading-relaxed break-all">
                      {alert}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">Regex Heuristic: (?i)(api_key|password|secret)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
