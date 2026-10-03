import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  FileCode2, 
  Layers,
  Brain,
  Search
} from 'lucide-react';
import QuizModule from './QuizModule.jsx';

function TreeNode({ item, onSelectFile, selectedFile }) {
  const [isOpen, setIsOpen] = useState(false);

  if (item.type === 'tree' || item.children) {
    return (
      <div className="select-none">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 py-1 px-2 hover:bg-white/5 rounded-md cursor-pointer text-xs text-slate-300 transition-colors"
        >
          {isOpen ? (
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          )}
          {isOpen ? (
            <FolderOpen className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          ) : (
            <Folder className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          )}
          <span className="font-medium truncate">{item.name}</span>
        </div>

        {isOpen && item.children && (
          <div className="pl-3.5 border-l border-white/10 ml-2 mt-0.5 space-y-0.5">
            {item.children.map((child, idx) => (
              <TreeNode
                key={child.path || idx}
                item={child}
                onSelectFile={onSelectFile}
                selectedFile={selectedFile}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isSelected = selectedFile === item.path;
  const isCode = item.name.endsWith('.py') || item.name.endsWith('.js') || item.name.endsWith('.ts') || item.name.endsWith('.jsx') || item.name.endsWith('.tsx');

  return (
    <div
      onClick={() => onSelectFile(item.path)}
      className={`flex items-center gap-2 py-1 px-2.5 rounded-md cursor-pointer text-xs font-mono transition-all ${
        isSelected
          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
      }`}
    >
      {isCode ? (
        <FileCode2 className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
      ) : (
        <FileText className="h-3.5 w-3.5 text-slate-500 shrink-0" />
      )}
      <span className="truncate">{item.name}</span>
    </div>
  );
}

export default function FileTree({ tree = [], quiz = [], onSelectFile, selectedFile }) {
  const [activeTab, setActiveTab] = useState('files'); // 'files' | 'quiz'
  const [filterText, setFilterText] = useState('');

  // Convert flat path list into nested tree hierarchy
  const buildNestedTree = (flatItems) => {
    const root = [];
    const map = {};

    flatItems.forEach((item) => {
      const parts = item.path.split('/');
      let currentLevel = root;
      let currentPath = '';

      parts.forEach((part, index) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        const isFile = index === parts.length - 1 && item.type === 'blob';

        let existing = map[currentPath];
        if (!existing) {
          existing = {
            name: part,
            path: currentPath,
            type: isFile ? 'blob' : 'tree',
            children: isFile ? null : [],
          };
          map[currentPath] = existing;
          currentLevel.push(existing);
        }

        if (!isFile && existing.children) {
          currentLevel = existing.children;
        }
      });
    });

    return root;
  };

  const filteredTree = React.useMemo(() => {
    if (!filterText.trim()) return tree;
    return tree.filter((item) => item.path.toLowerCase().includes(filterText.toLowerCase()));
  }, [tree, filterText]);

  const nestedData = React.useMemo(() => buildNestedTree(filteredTree), [filteredTree]);

  return (
    <div className="h-full flex flex-col bg-[#0b0b0f] border-r border-white/10 w-64 sm:w-72 shrink-0 overflow-hidden">
      {/* Sidebar Tabs: Files vs Quiz */}
      <div className="p-2 border-b border-white/10 bg-[#0e0e14] flex items-center gap-1">
        <button
          onClick={() => setActiveTab('files')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'files'
              ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Folder className="h-3.5 w-3.5" />
          <span>Files</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/5 font-mono">
            {tree.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'quiz'
              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Brain className="h-3.5 w-3.5 text-amber-400" />
          <span>Quiz</span>
          {quiz.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
              {quiz.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Sidebar View */}
      {activeTab === 'quiz' ? (
        <div className="flex-1 overflow-y-auto">
          <QuizModule quiz={quiz} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* File Filter Input */}
          <div className="p-2.5 border-b border-white/5">
            <div className="relative flex items-center rounded-lg bg-white/[0.03] border border-white/10 px-2.5 py-1 text-xs">
              <Search className="h-3.5 w-3.5 text-slate-500 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Filter files..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none w-full text-xs font-mono"
              />
            </div>
          </div>

          {/* Tree Explorer View */}
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
            {nestedData.length === 0 ? (
              <p className="text-xs text-slate-500 p-3 text-center">No files found matching filter.</p>
            ) : (
              nestedData.map((item) => (
                <TreeNode
                  key={item.path}
                  item={item}
                  onSelectFile={onSelectFile}
                  selectedFile={selectedFile}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
