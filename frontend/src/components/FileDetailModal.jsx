import React, { useState, useEffect } from 'react';
import { X, Code, FileText, Layers, Box, Cpu, Sparkles, Copy, Check, Terminal, ExternalLink, ChevronRight, FileCode2 } from 'lucide-react';
import axios from 'axios';

export default function FileDetailModal({ filePath, breakdownData, currentRepo, onClose }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('explanation'); // 'explanation' | 'code'
  const [fileContent, setFileContent] = useState('');
  const [fileExplanation, setFileExplanation] = useState(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  // Extract pre-computed summary from breakdownData if available
  const preSummary = breakdownData?.file_summaries?.[filePath];
  const preContent = breakdownData?.files?.[filePath];

  useEffect(() => {
    if (!filePath) return;

    // Use pre-loaded content if available
    if (preContent) {
      setFileContent(preContent);
    } else {
      fetchFileDetail();
    }

    if (preSummary) {
      setFileExplanation({
        filePath,
        purpose: preSummary.purpose,
        responsibility: preSummary.responsibility,
        key_exports: preSummary.key_exports || [],
        imports: preSummary.imports || [],
      });
    } else {
      fetchFileDetail();
    }
  }, [filePath]);

  const fetchFileDetail = async () => {
    if (!filePath || !currentRepo) return;
    setIsLoadingContent(true);
    try {
      const branch = breakdownData?.meta?.defaultBranch || 'main';
      const response = await axios.post('/api/file-detail', {
        repoUrl: currentRepo.startsWith('http') ? currentRepo : `https://github.com/${currentRepo}`,
        filePath,
        branch
      });

      if (response.data) {
        if (response.data.content) setFileContent(response.data.content);
        if (response.data.explanation) {
          setFileExplanation(response.data.explanation);
        }
      }
    } catch (err) {
      console.warn('[FileDetailModal] Could not fetch file details:', err);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleCopyPath = () => {
    navigator.clipboard.writeText(filePath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!filePath) return null;

  const fileName = filePath.split('/').pop();
  const ext = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : '';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Click outside backdrop to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Container */}
      <div className="w-full max-w-2xl bg-[#0e0e12] border-l border-white/10 h-full flex flex-col shadow-2xl overflow-hidden animate-slide-left">
        {/* Modal Header */}
        <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shrink-0">
              <FileCode2 className="h-5 w-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-mono font-bold text-white truncate">{fileName}</h2>
                {ext && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {ext}
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-slate-400 truncate">{filePath}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyPath}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-xs flex items-center gap-1.5"
              title="Copy path"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-300 text-slate-400 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-4 border-b border-white/10 bg-[#09090b]">
          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'explanation'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>What This File Does</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'code'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>Code Preview</span>
            {fileContent && (
              <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">
                {fileContent.split('\n').length} lines
              </span>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-24">
          {activeTab === 'explanation' ? (
            <div className="space-y-6">
              {/* Primary Purpose & Detailed Summary Card */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    <span>File Purpose & Detailed Overview</span>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    AST Deconstruction
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/30 via-slate-900/80 to-indigo-950/20 border border-indigo-500/30 text-xs text-slate-200 leading-relaxed shadow-lg space-y-3">
                  {(fileExplanation?.purpose || preSummary?.purpose) ? (
                    <div className="space-y-2">
                      {(fileExplanation?.purpose || preSummary?.purpose).split('\n\n').map((para, pIdx) => {
                        if (para.startsWith('**') && para.includes('**')) {
                          return (
                            <div key={pIdx} className="pt-2">
                              <p className="font-bold text-indigo-300 text-xs tracking-wide">
                                {para.split('\n')[0].replace(/\*\*/g, '')}
                              </p>
                              <div className="mt-1 space-y-1 pl-2">
                                {para.split('\n').slice(1).map((line, lIdx) => (
                                  <div key={lIdx} className="text-slate-300 text-xs font-mono">
                                    {line}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return <p key={pIdx} className="text-slate-300 text-xs leading-relaxed">{para}</p>;
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Terminal className="h-4 w-4 animate-spin text-indigo-400" />
                      Analyzing file purpose and structural context...
                    </div>
                  )}
                </div>
              </div>

              {/* Responsibility Card */}
              {(fileExplanation?.responsibility || preSummary?.responsibility) && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Box className="h-4 w-4 text-emerald-400" />
                    <span>Architectural Responsibility</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-slate-300 leading-relaxed">
                    {fileExplanation?.responsibility || preSummary?.responsibility}
                  </div>
                </div>
              )}

              {/* Functions & Handlers Deep-Dive (If available) */}
              {(fileExplanation?.functions?.length > 0 || preSummary?.functions?.length > 0) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Functions & Handlers ({(fileExplanation?.functions || preSummary?.functions || []).length})</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {(fileExplanation?.functions || preSummary?.functions || []).map((fn, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 space-y-1.5 transition-colors">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-mono text-xs font-bold text-cyan-300">
                            {fn.name || fn}
                            <span className="text-slate-500 font-normal">
                              ({(fn.args || []).join(', ')})
                            </span>
                          </span>
                          {fn.is_async && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              async
                            </span>
                          )}
                        </div>
                        {fn.docstring && (
                          <p className="text-xs text-slate-400 italic pl-2 border-l border-cyan-500/30">
                            {fn.docstring}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Classes & Object Model Detail */}
              {(fileExplanation?.classes?.length > 0 || preSummary?.classes?.length > 0) && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Layers className="h-3.5 w-3.5 text-purple-400" />
                    <span>Defined Classes ({(fileExplanation?.classes || preSummary?.classes || []).length})</span>
                  </div>
                  <div className="space-y-2">
                    {(fileExplanation?.classes || preSummary?.classes || []).map((cls, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                        <div className="flex items-center justify-between font-mono text-xs font-bold text-purple-300">
                          <span>class {cls.name}</span>
                          {cls.inherits_from?.length > 0 && (
                            <span className="text-[10px] text-slate-400 font-normal">
                              extends <span className="text-purple-400">{cls.inherits_from.join(', ')}</span>
                            </span>
                          )}
                        </div>
                        {cls.docstring && (
                          <p className="text-xs text-slate-400 italic">{cls.docstring}</p>
                        )}
                        {cls.methods?.length > 0 && (
                          <div className="pt-1">
                            <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">Encapsulated Methods:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {cls.methods.map((m, mIdx) => (
                                <span key={mIdx} className="text-[11px] font-mono px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-md">
                                  {m.name}({(m.args || []).join(', ')})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Imported Dependencies */}
              {(fileExplanation?.imports?.length > 0 || preSummary?.imports?.length > 0) && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Layers className="h-4 w-4 text-amber-400" />
                    <span>Dependencies & Imports ({(fileExplanation?.imports || preSummary?.imports || []).length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(fileExplanation?.imports || preSummary?.imports || []).map((imp, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 text-xs font-mono"
                      >
                        {imp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Code Preview Tab */
            <div className="space-y-3">
              {isLoadingContent ? (
                <div className="p-8 text-center text-xs font-mono text-slate-400 flex flex-col items-center gap-2">
                  <Terminal className="h-5 w-5 animate-spin text-indigo-400" />
                  <span>Fetching raw file content from GitHub...</span>
                </div>
              ) : fileContent ? (
                <div className="rounded-xl border border-white/10 bg-[#09090b] overflow-hidden">
                  <div className="px-3 py-1.5 bg-white/[0.03] border-b border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{filePath}</span>
                    <span>{fileContent.split('\n').length} lines</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[600px] overflow-y-auto">
                    <code>
                      {fileContent.split('\n').map((line, i) => (
                        <div key={i} className="flex gap-4 hover:bg-white/5 px-1 rounded">
                          <span className="text-slate-600 select-none text-right w-8 shrink-0">{i + 1}</span>
                          <span className="whitespace-pre">{line}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500 font-mono">
                  No source code available for this file.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            RepoBreakdown File Inspector
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
