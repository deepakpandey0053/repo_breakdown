import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Box, Layers, GitFork, Code2, ShieldCheck, Sparkles } from 'lucide-react';
import { BorderBeam } from './ui/BorderBeam.jsx';

function CustomNode({ data }) {
  const inheritsFrom = data.inheritsFrom || [];
  const isMultipleInheritance = data.isMultipleInheritance || inheritsFrom.length > 1;
  const isSyntheticBase = data.isSyntheticBase;

  return (
    <div
      className={`w-72 rounded-2xl bg-[#101017]/95 border shadow-2xl backdrop-blur-xl transition-all duration-300 relative overflow-hidden ${
        isMultipleInheritance
          ? 'border-cyan-400/80 shadow-cyan-500/25 ring-1 ring-cyan-500/40'
          : isSyntheticBase
          ? 'border-dashed border-slate-600/70 bg-[#0c0c12]/90'
          : 'border-white/15 hover:border-indigo-500/60 hover:shadow-indigo-500/20'
      }`}
    >
      {isMultipleInheritance && (
        <BorderBeam size={90} duration={6} colorFrom="#22d3ee" colorTo="#818cf8" />
      )}

      {/* Input Handle (Inherited by others) */}
      <Handle
        type="target"
        position={Position.Top}
        className={`!w-3 !h-3 !border-2 !border-[#09090b] ${
          isMultipleInheritance ? '!bg-cyan-400' : '!bg-indigo-400'
        }`}
      />

      {/* Node Header */}
      <div
        className={`p-3 rounded-t-2xl border-b border-white/10 flex items-center justify-between ${
          isMultipleInheritance
            ? 'bg-gradient-to-r from-cyan-950/70 via-indigo-950/50 to-cyan-950/70'
            : isSyntheticBase
            ? 'bg-slate-900/40'
            : 'bg-white/[0.03]'
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div
            className={`p-1.5 rounded-xl shrink-0 ${
              isMultipleInheritance
                ? 'bg-cyan-500/25 text-cyan-300'
                : data.type === 'class'
                ? 'bg-indigo-500/20 text-indigo-400'
                : 'bg-emerald-500/20 text-emerald-400'
            }`}
          >
            {isMultipleInheritance ? (
              <GitFork className="h-4 w-4" />
            ) : data.type === 'class' ? (
              <Box className="h-4 w-4" />
            ) : (
              <Code2 className="h-4 w-4" />
            )}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-xs font-bold text-white font-mono truncate">{data.id}</h3>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              {isSyntheticBase ? 'Base Interface' : data.type || 'class'}
            </span>
          </div>
        </div>

        {isMultipleInheritance && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/60 text-[10px] font-bold text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
            <Sparkles className="h-2.5 w-2.5" />
            <span>Multiple OOP</span>
          </div>
        )}
      </div>

      {/* Node Content */}
      <div className="p-3.5 space-y-2.5 text-xs">
        {/* Inheritance Chips */}
        {inheritsFrom.length > 0 && (
          <div className="space-y-1 bg-white/[0.03] p-2 rounded-xl border border-white/5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Layers className="h-3 w-3 text-cyan-400" />
              Inherits Base Classes ({inheritsFrom.length}):
            </span>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {inheritsFrom.map((parent, idx) => (
                <span
                  key={idx}
                  className={`px-1.5 py-0.5 rounded border text-[11px] font-mono font-medium ${
                    isMultipleInheritance
                      ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-200'
                      : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                  }`}
                >
                  {parent}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Responsibility */}
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
            Architecture Role:
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-3">
            {data.responsibility || 'Encapsulates core domain operations and lifecycle handlers.'}
          </p>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={`!w-3 !h-3 !border-2 !border-[#09090b] ${
          isMultipleInheritance ? '!bg-cyan-400' : '!bg-indigo-400'
        }`}
      />
    </div>
  );
}

export default memo(CustomNode);
