import React, { useMemo } from 'react';
import { FileCode, Minus, Plus } from 'lucide-react';
// We simulate a diff algorithm since bringing in a full library might be out of scope,
// but for production a library like 'diff' would be used.
// Here we'll do a basic line-by-line comparison for visual purposes.

export interface DiffViewerProps {
  original: string;
  modified: string;
  filename: string;
}

type DiffLine = {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  originalLineNum?: number;
  modifiedLineNum?: number;
};

export const DiffViewer: React.FC<DiffViewerProps> = ({ original, modified, filename }) => {
  
  // Basic mock diff algorithm for presentation purposes.
  // In a real app, `diffLines` from `diff` package would be used.
  const diffLines = useMemo(() => {
    const origLines = original.split('\n');
    const modLines = modified.split('\n');
    const lines: DiffLine[] = [];
    
    // Very naive diff: just showing them as totally replaced if different for simplicity without library
    let i = 0, j = 0;
    while(i < origLines.length || j < modLines.length) {
      if (origLines[i] === modLines[j]) {
        lines.push({ type: 'unchanged', content: origLines[i], originalLineNum: i + 1, modifiedLineNum: j + 1 });
        i++; j++;
      } else {
        if (i < origLines.length) {
          lines.push({ type: 'removed', content: origLines[i], originalLineNum: i + 1 });
          i++;
        }
        if (j < modLines.length) {
          lines.push({ type: 'added', content: modLines[j], modifiedLineNum: j + 1 });
          j++;
        }
      }
    }
    return lines;
  }, [original, modified]);

  const additions = diffLines.filter(l => l.type === 'added').length;
  const deletions = diffLines.filter(l => l.type === 'removed').length;

  return (
    <div className="flex flex-col bg-[#1e1e1e] rounded-lg border border-zinc-800 overflow-hidden font-mono text-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center space-x-2 text-zinc-300">
          <FileCode className="w-4 h-4 text-zinc-400" />
          <span className="font-semibold">{filename}</span>
        </div>
        <div className="flex items-center space-x-3 text-xs font-bold">
          <span className="text-emerald-400 flex items-center">
            <Plus className="w-3 h-3 mr-0.5" /> {additions}
          </span>
          <span className="text-red-400 flex items-center">
            <Minus className="w-3 h-3 mr-0.5" /> {deletions}
          </span>
        </div>
      </div>

      {/* Diff Content */}
      <div className="overflow-auto max-h-[600px] scrollbar-thin scrollbar-thumb-zinc-700">
        <table className="w-full text-left border-collapse whitespace-pre">
          <tbody className="font-mono text-xs leading-5">
            {diffLines.map((line, idx) => {
              let bgClass = 'bg-transparent';
              let textClass = 'text-zinc-300';
              let marker = ' ';

              if (line.type === 'added') {
                bgClass = 'bg-emerald-950/40';
                textClass = 'text-emerald-300';
                marker = '+';
              } else if (line.type === 'removed') {
                bgClass = 'bg-red-950/40';
                textClass = 'text-red-300';
                marker = '-';
              }

              return (
                <tr key={idx} className={`${bgClass} ${textClass} hover:bg-zinc-800/30`}>
                  <td className="w-12 pr-2 text-right text-zinc-600 select-none border-r border-zinc-800 bg-zinc-900/30">
                    {line.originalLineNum || ''}
                  </td>
                  <td className="w-12 pr-2 text-right text-zinc-600 select-none border-r border-zinc-800 bg-zinc-900/30">
                    {line.modifiedLineNum || ''}
                  </td>
                  <td className="w-6 text-center select-none text-zinc-500">
                    {marker}
                  </td>
                  <td className="pl-2 w-full">
                    {line.content || ' '}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
