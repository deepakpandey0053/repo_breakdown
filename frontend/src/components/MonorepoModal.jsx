import React from 'react';
import { Layers, Folder, ArrowRight, X, Sparkles, Box, Code2, Globe } from 'lucide-react';

export default function MonorepoModal({ isOpen, onClose, monorepoData, onSelectProject }) {
  if (!isOpen || !monorepoData) return null;

  const projects = monorepoData.projects || [];
  const fullName = monorepoData.fullName || 'Repository';

  const getProjectIcon = (type) => {
    if (type.includes('React') || type.includes('Frontend')) return Globe;
    if (type.includes('Node') || type.includes('TypeScript')) return Code2;
    if (type.includes('Python')) return Box;
    return Folder;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#111116] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-indigo-950/40 via-[#13131a] to-black flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Layers className="h-5 w-5" />
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                Monorepo Architecture Detected
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Select a Project in <span className="text-indigo-300 font-mono">{fullName}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              We detected multiple project roots. Choose a specific directory to analyze its dedicated architecture, or inspect the entire monorepo.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
            title="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Project Directories List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
          <div className="grid grid-cols-1 gap-3">
            {projects.map((proj, idx) => {
              const Icon = getProjectIcon(proj.type);
              const isAll = proj.path === 'all';

              return (
                <button
                  key={idx}
                  onClick={() => onSelectProject(proj.path)}
                  className={`group w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                    isAll
                      ? 'bg-gradient-to-r from-indigo-950/30 to-purple-950/20 border-indigo-500/30 hover:border-indigo-500/60 hover:bg-indigo-950/50'
                      : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`p-3 rounded-xl shrink-0 ${
                      isAll 
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                        : 'bg-white/5 text-slate-300 border border-white/10 group-hover:text-white'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                          {proj.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                          {proj.type}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 font-mono truncate">
                        Directory: <span className="text-slate-300">{proj.path === 'all' ? 'Entire Repository Root' : proj.path}</span>
                        {proj.manifest && proj.manifest !== 'root' && (
                          <span className="ml-2 text-slate-500">• {proj.manifest}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                    <span>Analyze</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-[#0d0d12] flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Targeting specific directories speeds up AST extraction and prevents context dilution.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
