import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Monitor, TerminalSquare, Compass, Zap, Moon, Sun, X, Activity } from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  section: 'Pages' | 'Quick Actions' | 'Active Missions' | 'Active Agents';
  action: () => void;
}

export interface CommandPaletteProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen: externalIsOpen, onClose }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) onClose();
    setInternalIsOpen(false);
  };

  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = [
    { id: 'p1', title: 'Dashboard', icon: <Monitor className="w-4 h-4" />, section: 'Pages', action: () => navigate('/dashboard') },
    { id: 'p2', title: 'Agents', icon: <TerminalSquare className="w-4 h-4" />, section: 'Pages', action: () => navigate('/agents') },
    { id: 'p3', title: 'Missions', icon: <Compass className="w-4 h-4" />, section: 'Pages', action: () => navigate('/missions') },
    { id: 'p4', title: 'Workspaces', icon: <TerminalSquare className="w-4 h-4" />, section: 'Pages', action: () => navigate('/workspaces/default') },
    
    { id: 'q1', title: 'New Agent', icon: <Zap className="w-4 h-4" />, section: 'Quick Actions', action: () => navigate('/agents/new') },
    { id: 'q2', title: 'New Mission', icon: <Activity className="w-4 h-4" />, section: 'Quick Actions', action: () => navigate('/missions/new') },

    { id: 'm1', title: 'Mission: Make demo-broken-repo production-ready', icon: <Activity className="w-4 h-4" />, section: 'Active Missions', action: () => navigate('/missions/mission-1') },
    { id: 'a1', title: 'Agent: Autonomous Software Engineer', icon: <TerminalSquare className="w-4 h-4" />, section: 'Active Agents', action: () => navigate('/agents/agent-1') },
  ];

  const filteredItems = search
    ? items.filter(item => item.title.toLowerCase().includes(search.toLowerCase()))
    : items;

  const sections = Array.from(new Set(filteredItems.map(i => i.section)));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setInternalIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
          handleClose();
        }
      }
    },
    [isOpen, filteredItems, selectedIndex]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] backdrop-blur-sm bg-zinc-950/80">
      <div 
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col font-sans"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center px-4 py-3 border-b border-zinc-800">
          <Search className="w-5 h-5 text-zinc-400 mr-3" />
          <input
            ref={inputRef}
            className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-500 text-sm font-mono"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <button onClick={handleClose} className="p-1 rounded hover:bg-zinc-800 text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs font-mono">No results found.</div>
          ) : (
            sections.map(section => (
              <div key={section} className="mb-4 last:mb-0">
                <div className="px-3 py-1 text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                  {section}
                </div>
                {filteredItems
                  .map((item, originalIndex) => ({ item, originalIndex }))
                  .filter(({ item }) => item.section === section)
                  .map(({ item }) => {
                    const globalIndex = filteredItems.findIndex(i => i.id === item.id);
                    const isSelected = selectedIndex === globalIndex;
                    
                    return (
                      <button
                        key={item.id}
                        className={`w-full flex items-center px-3 py-2 rounded-lg text-left text-xs transition-colors duration-150 ${
                          isSelected ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'
                        }`}
                        onClick={() => {
                          item.action();
                          handleClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                      >
                        <div className={`mr-3 ${isSelected ? 'text-cyan-400' : 'text-zinc-500'}`}>
                          {item.icon}
                        </div>
                        <span className="font-medium font-mono">{item.title}</span>
                      </button>
                    );
                  })}
              </div>
            ))
          )}
        </div>
        
        <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-900/50 text-[10px] text-zinc-500 flex items-center justify-between font-mono">
          <div className="flex items-center space-x-4">
            <span className="flex items-center"><kbd className="bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 mr-1 font-mono">↑↓</kbd> navigate</span>
            <span className="flex items-center"><kbd className="bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 mr-1 font-mono">↵</kbd> select</span>
            <span className="flex items-center"><kbd className="bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 mr-1 font-mono">esc</kbd> close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
