import React, { useState, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode.jsx';
import FolderGroupNode from './FolderGroupNode.jsx';
import { Network, Sparkles, Layers, Folder, Boxes, ChevronDown, ChevronUp, Eye } from 'lucide-react';

const nodeTypes = {
  custom: CustomNode,
  folderGroup: FolderGroupNode,
};

export default function FlowCanvas({ architectureNodes = [], onSelectNode }) {
  // 'grouped' (default anti-spaghetti mode) vs 'flat' (all classes expanded)
  const [viewMode, setViewMode] = useState('grouped');
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [activeFilter, setActiveFilter] = useState('all');

  const toggleFolder = (folderName) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderName)) {
        next.delete(folderName);
      } else {
        next.add(folderName);
      }
      return next;
    });
  };

  const expandAllFolders = () => {
    const all = new Set(folderGroups.map((g) => g.folderName));
    setExpandedFolders(all);
  };

  const collapseAllFolders = () => {
    setExpandedFolders(new Set());
  };

  // 1. Detect parent module/folder for each node
  const extractFolder = (node) => {
    const resp = node.responsibility || '';
    const match = resp.match(/Defined in\s+([^\s,;]+)/i);
    if (match) {
      const parts = match[1].split('/');
      if (parts.length > 1) return parts.slice(0, -1).join('/');
    }
    if (node.isSyntheticBase) return 'Base Abstractions & Mixins';
    const idLower = (node.id || '').toLowerCase();
    if (idLower.includes('route') || idLower.includes('controller') || idLower.includes('handler') || idLower.includes('endpoint')) {
      return 'Routing & Controllers';
    }
    if (idLower.includes('service') || idLower.includes('agent') || idLower.includes('manager') || idLower.includes('engine') || idLower.includes('processor')) {
      return 'Services & Domain Logic';
    }
    if (idLower.includes('model') || idLower.includes('schema') || idLower.includes('entity') || idLower.includes('db')) {
      return 'Data Models & Schemas';
    }
    return 'Core Application Modules';
  };

  // Group nodes by module folder
  const folderGroups = useMemo(() => {
    const groupsMap = new Map();
    (architectureNodes || []).forEach((anode) => {
      const folder = extractFolder(anode);
      if (!groupsMap.has(folder)) {
        groupsMap.set(folder, []);
      }
      groupsMap.get(folder).push(anode);
    });

    return Array.from(groupsMap.entries()).map(([folderName, classes]) => ({
      folderName,
      classes,
    }));
  }, [architectureNodes]);

  // 2. Build Nodes and Edges based on viewMode & expansion
  const { initialNodes, initialEdges } = useMemo(() => {
    if (!architectureNodes || architectureNodes.length === 0) {
      return { initialNodes: [], initialEdges: [] };
    }

    const nodes = [];
    const edges = [];
    const existingNodeIds = new Set(architectureNodes.map((n) => n.id));

    // Layout configuration grid
    const HORIZONTAL_SPACING = 380;
    const VERTICAL_SPACING = 320;

    if (viewMode === 'grouped') {
      let groupCol = 0;
      let groupRow = 0;

      folderGroups.forEach((group) => {
        if (activeFilter !== 'all' && activeFilter !== group.folderName) return;

        const isExpanded = expandedFolders.has(group.folderName);
        const gx = 60 + groupCol * HORIZONTAL_SPACING;
        const gy = 60 + groupRow * VERTICAL_SPACING;

        // Group Node
        nodes.push({
          id: `group-${group.folderName}`,
          type: 'folderGroup',
          position: { x: gx, y: gy },
          data: {
            folderName: group.folderName,
            classes: group.classes,
            isExpanded,
            onToggleExpand: toggleFolder,
          },
        });

        // If folder is expanded, render child class nodes directly to the right/underneath
        if (isExpanded) {
          group.classes.forEach((clsNode, cIdx) => {
            const cx = gx + 340 + (cIdx % 2) * 320;
            const cy = gy + Math.floor(cIdx / 2) * 220;

            nodes.push({
              id: clsNode.id,
              type: 'custom',
              position: { x: cx, y: cy },
              data: {
                id: clsNode.id,
                type: clsNode.type || 'class',
                inheritsFrom: clsNode.inherits_from || [],
                isMultipleInheritance: (clsNode.inherits_from || []).length > 1 || clsNode.is_multiple_inheritance,
                responsibility: clsNode.responsibility,
                isSyntheticBase: clsNode.isSyntheticBase,
              },
            });

            // Connect child class to parent folder group
            edges.push({
              id: `edge-group-${group.folderName}-to-${clsNode.id}`,
              source: `group-${group.folderName}`,
              target: clsNode.id,
              animated: true,
              style: { stroke: '#6366f1', strokeWidth: 1.5, strokeDasharray: '4,4' },
            });

            // Class inheritance edges if both are visible
            (clsNode.inherits_from || []).forEach((parentName) => {
              edges.push({
                id: `edge-${clsNode.id}-to-${parentName}`,
                source: clsNode.id,
                target: parentName,
                animated: true,
                style: { stroke: '#06b6d4', strokeWidth: 2 },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4', width: 16, height: 16 },
              });
            });
          });
        }

        groupCol++;
        if (groupCol >= 3) {
          groupCol = 0;
          groupRow++;
        }
      });
    } else {
      // Flat View (All classes expanded simultaneously)
      architectureNodes.forEach((anode, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        const x = 60 + col * 340;
        const y = 60 + row * 240;

        nodes.push({
          id: anode.id,
          type: 'custom',
          position: { x, y },
          data: {
            id: anode.id,
            type: anode.type || 'class',
            inheritsFrom: anode.inherits_from || [],
            isMultipleInheritance: (anode.inherits_from || []).length > 1 || anode.is_multiple_inheritance,
            responsibility: anode.responsibility,
            isSyntheticBase: anode.isSyntheticBase,
          },
        });

        (anode.inherits_from || []).forEach((parentName) => {
          edges.push({
            id: `edge-${anode.id}-to-${parentName}`,
            source: anode.id,
            target: parentName,
            animated: true,
            style: { stroke: '#6366f1', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1', width: 16, height: 16 },
          });
        });
      });
    }

    return { initialNodes: nodes, initialEdges: edges };
  }, [architectureNodes, viewMode, expandedFolders, activeFilter, folderGroups]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div className="h-full w-full bg-[#09090b] relative flex flex-col">
      {/* Anti-Clutter Controls Top Bar */}
      <div className="px-4 py-2 bg-[#0d0d12]/95 backdrop-blur border-b border-white/10 flex flex-wrap items-center justify-between gap-3 z-10">
        {/* Title & Stats */}
        <div className="flex items-center gap-2.5">
          <Network className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Architecture Canvas
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
            {folderGroups.length} Modules • {architectureNodes.length} Classes
          </span>
        </div>

        {/* View Mode Controls (Grouped vs Flat) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('grouped')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grouped'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Group classes inside collapsible module nodes to prevent spaghetti clutter"
            >
              <Folder className="h-3.5 w-3.5" />
              <span>Grouped Modules</span>
            </button>

            <button
              onClick={() => setViewMode('flat')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'flat'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Expand all classes directly onto canvas"
            >
              <Boxes className="h-3.5 w-3.5" />
              <span>Flat View</span>
            </button>
          </div>

          {viewMode === 'grouped' && (
            <div className="flex items-center gap-1">
              <button
                onClick={expandAllFolders}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-slate-300 hover:text-white transition-colors"
                title="Expand all module folders"
              >
                Expand All
              </button>
              <button
                onClick={collapseAllFolders}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-slate-300 hover:text-white transition-colors"
                title="Collapse all into folder nodes"
              >
                Collapse All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Module Filter Chips Bar */}
      {viewMode === 'grouped' && folderGroups.length > 1 && (
        <div className="px-4 py-1.5 bg-[#0a0a0e] border-b border-white/5 flex items-center gap-1.5 overflow-x-auto custom-scrollbar z-10">
          <span className="text-[10px] font-mono uppercase text-slate-500 shrink-0">Filter:</span>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all shrink-0 ${
              activeFilter === 'all'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            All ({architectureNodes.length})
          </button>
          {folderGroups.map((g, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFilter(g.folderName)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all shrink-0 ${
                activeFilter === g.folderName
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              📁 {g.folderName} ({g.classes.length})
            </button>
          ))}
        </div>
      )}

      {/* React Flow Viewport */}
      <div className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          defaultEdgeOptions={{ animated: true }}
          className="bg-[#09090b]"
        >
          <Background color="#1e1e24" gap={24} size={1} />
          <Controls className="!m-4 !bg-[#121216] !border-white/15 !text-slate-200" />
          <MiniMap
            nodeColor={(n) => {
              if (n.type === 'folderGroup') return '#6366f1';
              if (n.data?.isMultipleInheritance) return '#06b6d4';
              if (n.data?.isSyntheticBase) return '#64748b';
              return '#a855f7';
            }}
            maskColor="rgba(9, 9, 11, 0.85)"
            style={{
              backgroundColor: '#101014',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.75rem',
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
