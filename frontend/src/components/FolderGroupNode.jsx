import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Folder, FolderOpen, ChevronDown, ChevronUp, Layers, Box, Sparkles, ArrowRight } from 'lucide-react';

function FolderGroupNode({ data }) {
  const { folderName, classes = [], isExpanded, onToggleExpand } = data;

  return (
    <div
      className={`w-80 rounded-2xl bg-[#0f0f15]/95 border shadow-2xl backdrop-blur-md transition-all ${
        isExpanded
          ? 'border-indigo-500/70 shadow-indigo-500/20 ring-1 ring-indigo-500/30'
          : 'border-white/15 hover:border-cyan-500/50 hover:shadow-cyan-500/10'
      }`}
    >
      {/* Handles for Inter-Module Architecture Edges */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-indigo-400 !border-2 !border-[#09090b]"
      />

      {/* Module Header */}
      <div className="p-3.5 rounded-t-2xl border-b border-white/10 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-black flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`p-2 rounded-xl shrink-0 ${
            isExpanded ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-cyan-400'
          }`}>
            {isExpanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-white font-mono truncate">{folderName}</h3>
            <span className="text-[10px] font-mono text-slate-400">
              {classes.length} Module Class{classes.length !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleExpand) onToggleExpand(folderName);
          }}
          className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
            isExpanded
              ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-200 hover:bg-indigo-600/30'
              : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Module Body */}
      <div className="p-3.5 space-y-2.5 text-xs">
        {/* Classes Preview Chips */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Box className="h-3 w-3 text-indigo-400" />
            Encapsulated Entities ({classes.length}):
          </span>

          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto custom-scrollbar p-0.5">
            {classes.slice(0, 8).map((cls, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300 flex items-center gap-1 hover:border-indigo-500/40 transition-colors"
                title={cls.responsibility}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                {cls.id}
              </span>
            ))}
            {classes.length > 8 && (
              <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-mono text-slate-500">
                +{classes.length - 8} more
              </span>
            )}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>{isExpanded ? 'Classes rendered on canvas' : 'Click Expand to inspect classes'}</span>
          <span className="flex items-center gap-1 text-cyan-400">
            <Sparkles className="h-3 w-3" />
            Anti-Clutter
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-cyan-400 !border-2 !border-[#09090b]"
      />
    </div>
  );
}

export default memo(FolderGroupNode);
