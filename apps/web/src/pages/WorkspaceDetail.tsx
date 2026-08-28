import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DiffViewer } from '../components/DiffViewer';
import { getDemoWorkspaces } from '../lib/demoData';
import { FolderOpen, FileCode, GitCompare, Eye, Copy, Check } from 'lucide-react';

export const WorkspaceDetail = () => {
  const { id = 'default' } = useParams();
  const demoFiles = getDemoWorkspaces() as Record<string, string>;
  const [selectedFile, setSelectedFile] = useState<string>('src/server.ts');
  const [viewMode, setViewMode] = useState<'view' | 'diff'>('view');
  const [copied, setCopied] = useState(false);

  const fileContent = demoFiles[selectedFile] || '// Select a file from the explorer to inspect content';
  
  const originalContent = selectedFile === 'src/server.ts' 
    ? `import express from 'express';\n\nconst app = express();\nconst PORT = process.env.PORT;\n\napp.listen(PORT);\n`
    : fileContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Workspace Header */}
      <div className="p-6 border-b border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderOpen className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-zinc-100 font-mono">Workspace: {id}</h1>
          <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono border border-zinc-700/50">
            demo/broken-repo
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 font-mono text-xs">
          <button
            onClick={() => setViewMode('view')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
              viewMode === 'view' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/50 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Eye size={14} /> View Code
          </button>
          <button
            onClick={() => setViewMode('diff')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
              viewMode === 'diff' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/50 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <GitCompare size={14} /> Agent Diff
          </button>
        </div>
      </div>

      {/* Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: File Tree */}
        <div className="w-64 border-r border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3 font-mono text-xs">
          <div className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Files Explorer</div>
          <div className="space-y-1">
            {Object.keys(demoFiles).map((filepath) => (
              <button
                key={filepath}
                onClick={() => setSelectedFile(filepath)}
                className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded transition-all ${
                  selectedFile === filepath
                    ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-800/40 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <FileCode size={14} />
                <span className="truncate">{filepath}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Code Viewer / Diff Viewer */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-950 font-mono text-xs">
          {viewMode === 'view' ? (
            <div className="card bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs">
                <span className="font-bold text-zinc-200">{selectedFile}</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-4 overflow-x-auto bg-zinc-950 text-zinc-300 leading-relaxed font-mono">
                {fileContent.split('\n').map((line, idx) => (
                  <div key={idx} className="flex">
                    <span className="w-10 text-zinc-600 select-none text-right pr-4">{idx + 1}</span>
                    <span className="whitespace-pre">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <DiffViewer
              filename={selectedFile}
              original={originalContent}
              modified={fileContent}
            />
          )}
        </div>
      </div>
    </div>
  );
};
