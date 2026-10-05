import React, { useState, useEffect } from 'react';

interface HeaderProps {
  onToggleTerminal: () => void;
  terminalOpen: boolean;
  onOpenGallery: () => void;
  onGlobalSearch: (query: string) => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleTerminal,
  terminalOpen,
  onOpenGallery,
  onGlobalSearch,
  searchQuery,
}) => {
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = document.getElementById('global-header-search');
        input?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    onGlobalSearch(e.target.value);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-10 bg-[#181c22] border-b border-[#3e4a3d] z-50 flex items-center justify-between px-3 select-none">
      {/* Left: Brand mark & App title */}
      <div className="flex items-center gap-2 min-w-0 pr-3">
        <span className="material-symbols-outlined text-[#6fdd78] text-[16px]">terminal</span>
        <span className="font-medium text-[12px] text-[#dfe2eb] truncate">
          Dev Environment Manager - Windows Developer Hub
        </span>
      </div>

      {/* Center: Search input with Ctrl+K */}
      <div className="flex-1 max-w-xl px-3">
        <div className="flex items-center h-7 px-2 bg-[#0a0e14] border border-[#3e4a3d] rounded-lg text-[#becab9] text-[11px] font-mono focus-within:border-[#6fdd78] transition-colors">
          <span className="material-symbols-outlined text-[#889484] text-[14px] mr-1.5">search</span>
          <input
            id="global-header-search"
            type="text"
            value={searchInput}
            onChange={handleChange}
            placeholder="Search tools, versions, environment variables..."
            className="w-full bg-transparent text-[#dfe2eb] focus:outline-none placeholder:text-[#889484]"
          />
          <kbd className="px-1.5 py-0.5 bg-[#1c2026] border border-[#3e4a3d] rounded text-[10px] text-[#becab9] font-mono shrink-0 ml-1">
            Ctrl+K
          </kbd>
        </div>
      </div>

      {/* Right: Status badge, Gallery launcher, CLI toggle, User, Window controls */}
      <div className="flex items-center gap-2">
        {/* Gallery button with prominent badge answering user request */}
        <button
          onClick={onOpenGallery}
          className="flex items-center gap-1.5 h-7 px-2.5 bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] hover:border-[#6fdd78] rounded text-[#dfe2eb] hover:text-[#6fdd78] text-[12px] font-medium transition-all shadow-sm active:scale-95"
          title="Ver todas as 11 telas e links diretos para as imagens"
        >
          <span className="material-symbols-outlined text-[15px] text-[#fabc45]">collections</span>
          <span className="hidden sm:inline">Galeria de Telas & Links</span>
          <span className="px-1 py-0.2 rounded bg-[#34a547] text-[#00320b] text-[9px] font-mono font-bold">11 Telas</span>
        </button>

        {/* Win 11 Healthy Status */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 bg-[#1c2026] rounded border border-[#3e4a3d]">
          <span className="w-2 h-2 rounded-full bg-[#6fdd78] inline-block animate-pulse"></span>
          <span className="font-mono text-[10px] font-bold text-[#6fdd78] uppercase tracking-wider">
            Healthy - Win 11
          </span>
        </div>

        {/* CLI Button */}
        <button
          onClick={onToggleTerminal}
          className={`flex items-center gap-1 h-7 px-2 border rounded text-[12px] font-medium transition-colors ${
            terminalOpen
              ? 'bg-[#34a547]/20 border-[#6fdd78] text-[#6fdd78]'
              : 'bg-[#1c2026] border-[#3e4a3d] hover:bg-[#262a31] text-[#dfe2eb]'
          }`}
          title="Toggle PowerShell Terminal drawer"
        >
          <span className="material-symbols-outlined text-[14px]">terminal</span>
          <span className="font-mono text-[11px]">CLI</span>
        </button>

        {/* User Profile */}
        <div
          className="w-7 h-7 rounded-full bg-[#6fdd78] flex items-center justify-center cursor-pointer shadow-sm"
          title="Developer (Admin)"
        >
          <span className="material-symbols-outlined text-[#00390e] text-[16px]">person</span>
        </div>

        {/* Native Windows Window Action Buttons */}
        <div className="flex items-center ml-1 -mr-3">
          <button
            onClick={() => {}}
            className="h-10 w-10 flex items-center justify-center text-[#becab9] hover:bg-[#262a31] hover:text-[#dfe2eb] transition-colors"
            title="Minimize"
          >
            <span className="material-symbols-outlined text-[15px]">minimize</span>
          </button>
          <button
            onClick={() => {}}
            className="h-10 w-10 flex items-center justify-center text-[#becab9] hover:bg-[#262a31] hover:text-[#dfe2eb] transition-colors"
            title="Maximize"
          >
            <span className="material-symbols-outlined text-[13px]">crop_square</span>
          </button>
          <button
            onClick={() => {}}
            className="h-10 w-10 flex items-center justify-center text-[#becab9] hover:bg-[#93000a] hover:text-[#ffdad6] transition-colors"
            title="Close"
          >
            <span className="material-symbols-outlined text-[15px]">close</span>
          </button>
        </div>
      </div>
    </header>
  );
};
