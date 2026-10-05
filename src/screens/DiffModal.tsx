import React, { useState, useEffect } from 'react';

interface DiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'split' | 'unified';
  onRollback?: () => void;
}

export const DiffModal: React.FC<DiffModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'split',
  onRollback,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>(initialMode);
  const [wordWrap, setWordWrap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPatch, setCopiedPatch] = useState(false);

  useEffect(() => {
    setViewMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const scrollToChange = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('bg-[#bd8708]/40');
      setTimeout(() => {
        target.classList.remove('bg-[#bd8708]/40');
      }, 1200);
    }
  };

  const handleCopyPatch = () => {
    const patch = `--- config.json.bak-20250228-1425
+++ config.json
@@ -4,8 +4,8 @@
-  "default_toolchain_root": "C:\\\\Program Files\\\\DevTools\\\\",
+  "default_toolchain_root": "~/.dev-env/tools/",
-  "version_collision_policy": "strict_overwrite",
+  "version_collision_policy": "parallel_side_by_side",
-  "registry_target_scope": "HKLM_MACHINE",
+  "registry_target_scope": "HKCU_USER",
@@ -11,2 +11,2 @@
-    "cadence_minutes": 0,
+    "cadence_minutes": 15,`;

    navigator.clipboard?.writeText(patch);
    setCopiedPatch(true);
    setTimeout(() => setCopiedPatch(false), 2000);
  };

  const handleExportZip = () => {
    const backupJson = JSON.stringify(
      {
        schema_version: '2.1.4',
        installed_sdks_lock: true,
        default_toolchain_root: 'C:\\Program Files\\DevTools\\',
        workspace_isolation: false,
        version_collision_policy: 'strict_overwrite',
        theme: 'dark_mica',
        registry_target_scope: 'HKLM_MACHINE',
        telemetry_and_scans: {
          opt_in_anonymous_metrics: false,
          cadence_minutes: 0,
        },
        broadcast_wm_settingchange: true,
      },
      null,
      2
    );

    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json.bak-20250228-1425.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 top-10 left-64 bottom-8 bg-black/85 backdrop-blur-md z-40 flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-[1240px] h-[calc(100vh-7rem)] flex flex-col rounded-xl bg-[#181c22] border border-[#3e4a3d] shadow-2xl overflow-hidden">
        {/* 1. MODAL HEADER */}
        <div className="px-5 py-3 bg-[#1c2026] border-b border-[#3e4a3d] flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#262a31] border border-[#3e4a3d] flex items-center justify-center text-[#6fdd78] shrink-0">
                <span className="material-symbols-outlined text-[20px]">difference</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[16px] font-bold text-[#dfe2eb] truncate">
                    Configuration Diff — Backup vs. Restored Defaults
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#bd8708]/30 border border-[#bd8708]/50 text-[#fabc45] font-mono text-[10px] font-bold uppercase tracking-wider shrink-0">
                    4 Changes Detected
                  </span>
                </div>
                <p className="text-[12px] text-[#becab9] truncate">
                  Comparing snapshot <span className="font-mono text-[11px] text-[#dfe2eb] bg-[#262a31] px-1 py-0.5 rounded">config.json.bak-20250228-1425</span> with active <span className="font-mono text-[11px] text-[#6fdd78] bg-[#6fdd78]/10 px-1 py-0.5 rounded">config.json (Factory Defaults)</span>
                </p>
              </div>
            </div>

            {/* Controls: View Mode & Close */}
            <div className="flex items-center gap-2 shrink-0">
              {/* View Mode Switcher */}
              <div className="flex items-center bg-[#0a0e14] border border-[#3e4a3d] p-0.5 rounded-lg">
                <button
                  onClick={() => setViewMode('split')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[12px] font-medium transition-colors ${
                    viewMode === 'split'
                      ? 'bg-[#262a31] text-[#6fdd78] font-bold'
                      : 'text-[#becab9] hover:text-[#dfe2eb]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">vertical_split</span>
                  <span>Split</span>
                </button>
                <button
                  onClick={() => setViewMode('unified')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[12px] font-medium transition-colors ${
                    viewMode === 'unified'
                      ? 'bg-[#262a31] text-[#6fdd78] font-bold'
                      : 'text-[#becab9] hover:text-[#dfe2eb]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">horizontal_split</span>
                  <span>Unified</span>
                </button>
              </div>

              {/* Word wrap */}
              <button
                onClick={() => setWordWrap(!wordWrap)}
                className="h-7 px-2.5 bg-[#0a0e14] hover:bg-[#262a31] border border-[#3e4a3d] text-[#becab9] hover:text-[#dfe2eb] rounded-lg text-[12px] flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">wrap_text</span>
                <span>{wordWrap ? 'Unwrap' : 'Wrap'}</span>
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-[#0a0e14] hover:bg-[#93000a] text-[#becab9] hover:text-[#ffdad6] flex items-center justify-center transition-colors"
                title="Close Diff (Esc)"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>

          {/* Badges Bar */}
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#889484] flex-wrap">
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#262a31] text-[#becab9]">
              <span className="material-symbols-outlined text-[#6fdd78] text-[14px]">verified</span>
              <span>JSON Schema v2.1.4</span>
            </span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#262a31] text-[#becab9]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6fdd78]"></span>
              <span>Syntax: Valid RFC 8259</span>
            </span>
            <span>Encoding: UTF-8 CRLF</span>
            <span>•</span>
            <span>Working Directory: %USERPROFILE%\.dev-env-manager</span>
          </div>
        </div>

        {/* 2. SUMMARY STATS & NAVIGATION BAR */}
        <div className="px-5 py-2 bg-[#262a31] border-b border-[#3e4a3d] flex items-center justify-between gap-3 shrink-0 flex-wrap">
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-[12px]">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#fabc45]"></span>
              <span className="text-[#dfe2eb] font-semibold">4</span>
              <span className="text-[#becab9]">Modified</span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px]">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#6fdd78]"></span>
              <span className="text-[#dfe2eb] font-semibold">+4</span>
              <span className="text-[#becab9]">Added</span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px]">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#ffb4ab]"></span>
              <span className="text-[#dfe2eb] font-semibold">-4</span>
              <span className="text-[#becab9]">Deleted</span>
            </div>

            <div className="h-4 w-px bg-[#3e4a3d] mx-1"></div>

            {/* Jump Chips */}
            <div className="flex items-center gap-1">
              <span className="font-mono text-[11px] text-[#889484]">Jump:</span>
              <button
                onClick={() => scrollToChange('diff-change-1')}
                className="px-2 py-0.5 rounded bg-[#1c2026] hover:bg-[#31353c] text-[#becab9] hover:text-[#6fdd78] font-mono text-[11px] transition-colors"
              >
                #toolchain_root
              </button>
              <button
                onClick={() => scrollToChange('diff-change-2')}
                className="px-2 py-0.5 rounded bg-[#1c2026] hover:bg-[#31353c] text-[#becab9] hover:text-[#6fdd78] font-mono text-[11px] transition-colors"
              >
                #collision_policy
              </button>
              <button
                onClick={() => scrollToChange('diff-change-3')}
                className="px-2 py-0.5 rounded bg-[#1c2026] hover:bg-[#31353c] text-[#becab9] hover:text-[#6fdd78] font-mono text-[11px] transition-colors"
              >
                #registry_scope
              </button>
              <button
                onClick={() => scrollToChange('diff-change-4')}
                className="px-2 py-0.5 rounded bg-[#1c2026] hover:bg-[#31353c] text-[#becab9] hover:text-[#6fdd78] font-mono text-[11px] transition-colors"
              >
                #telemetry_cadence
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex items-center max-w-xs w-64 h-7 px-2.5 bg-[#0a0e14] border border-[#3e4a3d] rounded-lg font-mono text-[11px]">
            <span className="material-symbols-outlined text-[#889484] text-[14px] mr-1.5">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter keys or values..."
              className="w-full bg-transparent text-[#dfe2eb] placeholder:text-[#889484] focus:outline-none"
            />
            <kbd className="px-1 py-0.2 bg-[#1c2026] rounded text-[9px] text-[#889484] font-mono">ESC</kbd>
          </div>
        </div>

        {/* 3. DIFF CODE VIEWER BODY */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#0a0e14] font-mono text-[12px] overflow-hidden">
          {viewMode === 'split' ? (
            /* SPLIT MODE (Image 19) */
            <>
              {/* Column Headings */}
              <div className="grid grid-cols-2 bg-[#262a31]/60 border-b border-[#3e4a3d] shrink-0 font-mono text-[11px]">
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#1c2026] border-r border-[#3e4a3d]">
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-[#ffb4ab] text-[16px]">history</span>
                    <span className="font-semibold text-[#dfe2eb]">Previous Configuration (Backup Snapshot)</span>
                  </div>
                  <span className="text-[#889484] truncate">...backups\config.json.bak-20250228-1425</span>
                </div>

                <div className="flex items-center justify-between px-3 py-1.5 bg-[#262a31]">
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-[#6fdd78] text-[16px]">check_circle</span>
                    <span className="font-semibold text-[#dfe2eb]">Active Configuration (Restored Defaults)</span>
                  </div>
                  <span className="flex items-center gap-1 font-mono text-[10px] text-[#6fdd78] bg-[#6fdd78]/10 px-1.5 py-0.5 rounded font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6fdd78]"></span> COMMITTED TO REGISTRY
                  </span>
                </div>
              </div>

              {/* Side-by-side Scroll Container */}
              <div className="flex-1 overflow-y-auto selection:bg-[#31353c]">
                <div className="grid grid-cols-2 divide-x divide-[#3e4a3d]">
                  {/* Left Column (Old Backup with Red Deletions) */}
                  <div className={`flex flex-col bg-[#0a0e14] select-text py-1 ${wordWrap ? 'whitespace-normal' : 'whitespace-nowrap'}`}>
                    <div className="flex hover:bg-[#262a31]/30 py-0.5">
                      <span className="w-10 text-right pr-2 text-[#889484] text-[11px] select-none shrink-0">1</span>
                      <span className="w-4 text-center text-[#889484] select-none shrink-0"> </span>
                      <span className="text-[#becab9]">{'{'}</span>
                    </div>

                    <div className="flex hover:bg-[#262a31]/30 py-0.5">
                      <span className="w-10 text-right pr-2 text-[#889484] text-[11px] select-none shrink-0">2</span>
                      <span className="w-4 text-center text-[#889484] select-none shrink-0"> </span>
                      <span className="text-[#889484] pl-3">"schema_version": <span className="text-[#aac7ff]">"2.1.4"</span>,</span>
                    </div>

                    <div className="flex hover:bg-[#262a31]/30 py-0.5">
                      <span className="w-10 text-right pr-2 text-[#889484] text-[11px] select-none shrink-0">3</span>
                      <span className="w-4 text-center text-[#889484] select-none shrink-0"> </span>
                      <span className="text-[#889484] pl-3">"installed_sdks_lock": <span className="text-[#fabc45]">true</span>,</span>
                    </div>

                    {/* Change 1 */}
                    <div id="diff-change-1" className="flex bg-[#93000a]/25 hover:bg-[#93000a]/40 py-1 border-y border-[#93000a]/30">
                      <span className="w-10 text-right pr-2 text-[#ffb4ab] text-[11px] font-bold select-none shrink-0">4</span>
                      <span className="w-4 text-center text-[#ffb4ab] font-bold select-none shrink-0">-</span>
                      <span className="text-[#dfe2eb] pl-3">
                        "default_toolchain_root": <mark className="bg-[#ffb4ab]/30 text-[#ffb4ab] px-1 py-0.2 rounded font-mono">"C:\\Program Files\\DevTools\\"</mark>,
                      </span>
                    </div>

                    <div className="flex hover:bg-[#262a31]/30 py-0.5">
                      <span className="w-10 text-right pr-2 text-[#889484] text-[11px] select-none shrink-0">5</span>
                      <span className="w-4 text-center text-[#889484] select-none shrink-0"> </span>
                      <span className="text-[#889484] pl-3">"workspace_isolation": <span className="text-[#fabc45]">false</span>,</span>
                    </div>

                    {/* Change 2 */}
                    <div id="diff-change-2" className="flex bg-[#93000a]/25 hover:bg-[#93000a]/40 py-1 border-y border-[#93000a]/30">
                      <span className="w-10 text-right pr-2 text-[#ffb4ab] text-[11px] font-bold select-none shrink-0">6</span>
                      <span className="w-4 text-center text-[#ffb4ab] font-bold select-none shrink-0">-</span>
                      <span className="text-[#dfe2eb] pl-3">
                        "version_collision_policy": <mark className="bg-[#ffb4ab]/30 text-[#ffb4ab] px-1 py-0.2 rounded font-mono">"strict_overwrite"</mark>,
                      </span>
                    </div>

                    <div className="flex hover:bg-[#262a31]/30 py-0.5">
                      <span className="w-10 text-right pr-2 text-[#889484] text-[11px] select-none shrink-0">7</span>
                      <span className="w-4 text-center text-[#889484] select-none shrink-0"> </span>
                      <span className="text-[#889484] pl-3">"theme": <span className="text-[#aac7ff]">"dark_mica"</span>,</span>
                    </div>

                    {/* Change 3 */}
                    <div id="diff-change-3" className="flex bg-[#93000a]/25 hover:bg-[#93000a]/40 py-1 border-y border-[#93000a]/30">
                      <span className="w-10 text-right pr-2 text-[#ffb4ab] text-[11px] font-bold select-none shrink-0">8</span>
                      <span className="w-4 text-center text-[#ffb4ab] font-bold select-none shrink-0">-</span>
                      <span className="text-[#dfe2eb] pl-3">
                        "registry_target_scope": <mark className="bg-[#ffb4ab]/30 text-[#ffb4ab] px-1 py-0.2 rounded font-mono">"HKLM_MACHINE"</mark>,
                        <span className="text-[#889484] text-[11px] italic ml-2">// Required Administrator elevation</span>
                      </span>
                    </div>

                    <div className="flex hover:bg-[#262a31]/30 py-0.5">
                      <span className="w-10 text-right pr-2 text-[#889484] text-[11px] select-none shrink-0">9</span>
                      <span className="w-4 text-center text-[#889484] select-none shrink-0"> </span>
                      <span className="text-[#889484] pl-3">"telemetry_and_scans": {'{'}</span>
                    </div>

                    <div className="flex hover:bg-[#262a31]/30 py-0.5">
                      <span className="w-10 text-right pr-2 text-[#889484] text-[11px] select-none shrink-0">10</span>
                      <span className="w-4 text-center text-[#889484] select-none shrink-0"> </span>
                      <span className="text-[#889484] pl-6">"opt_in_anonymous_metrics": <span className="text-[#fabc45]">false</span>,</span>
                    </div>

                    {/* Change 4 */}
                    <div id="diff-change-4" className="flex bg-[#93000a]/25 hover:bg-[#93000a]/40 py-1 border-y border-[#93000a]/30">
                      <span className="w-10 text-right pr-2 text-[#ffb4ab] text-[11px] font-bold select-none shrink-0">11</span>
                      <span className="w-4 text-center text-[#ffb4ab] font-bold select-none shrink-0">-</span>
                      <span className="text-[#dfe2eb] pl-6">
                        "cadence_minutes": <mark className="bg-[#ffb4ab]/30 text-[#ffb4ab] px-1 py-0.2 rounded font-mono">0</mark>,
                        <span className="text-[#889484] text-[11px] italic ml-2">// Manual Checks Only</span>
                      </span>
                    </div>

                    <div className="flex hover:bg-[#262a31]/30 py-0.5">
                      <span className="w-10 text-right pr-2 text-[#889484] text-[11px] select-none shrink-0">12</span>
                      <span className="w-4 text-center text-[#889484] select-none shrink-0"> </span>
                      <span className="text-[#889484] pl-3">{'}'},</span>
                    </div>

                    <div className="flex hover:bg-[#262a31]/30 py-0.5">
                      <span className="w-10 text-right pr-2 text-[#889484] text-[11px] select-none shrink-0">13</span>
                      <span className="w-4 text-center text-[#889484] select-none shrink-0"> </span>
                      <span className="text-[#889484] pl-3">"broadcast_wm_settingchange": <span className="text-[#fabc45]">true</span></span>
                    </div>

                    <div className="flex hover:bg-[#262a31]/30 py-0.5">
                      <span className="w-10 text-right pr-2 text-[#889484] text-[11px] select-none shrink-0">14</span>
                      <span className="w-4 text-center text-[#889484] select-none shrink-0"> </span>
                      <span className="text-[#becab9]">{'}'}</span>
                    </div>
                  </div>

                  {/* Right Column (New Restored Config with Green Additions) */}
                  <div className={`flex flex-col bg-[#0a0e14] select-text py-1 ${wordWrap ? 'whitespace-normal' : 'whitespace-nowrap'}`}>
                    <div className="flex hover:bg-[#262a31]/30 py-0.5">
                      <span className="w-10 text-right pr-2 text-[#889484] text-[11px] select-none shrink-0">1</span>
                      <span className="w-4 text-center text-[#889484] select-none shrink-0"> </span>
                      <span className="text-[#becab9]">{'{'}</span>
                    </div>

                    <div className="flex hover:bg-[#262a31]/30 py-0.5">
                      <span className="w-10 text-right pr-2 text-[#889484] text-[11px] select-none shrink-0">2</span>
                      <span className="w-4 text-center text-[#889484] select-none shrink-0"> </span>
                      <span className="text-[#889484] pl-3">"schema_version": <span className="text-[#aac7ff]">"2.1.4"</span>,</span>
                    </div>

                    <div className="flex hover:bg-[#262a31]/30 py-0.5">
                      <span className="w-10 text-right pr-2 text-[#889484] text-[11px] select-none shrink-0">3</span>
                      <span className="w-4 text-center text-[#889484] select-none shrink-0"> </span>
                      <span className="text-[#889484] pl-3">"installed_sdks_lock": <span className="text-[#fabc45]">true</span>,</span>
                    </div>

                    {/* Change 1 Added */}
                    <div className="flex bg-[#34a547]/15 hover:bg-[#34a547]/25 py-1 border-y border-[#34a547]/30">
                      <span className="w-10 text-right pr-2 text-[#6fdd78] text-[11px] font-bold select-none shrink-0">4</span>
                      <span className="w-4 text-center text-[#6fdd78] font-bold select-none shrink-0">+</span>
                      <span className="text-[#dfe2eb] pl-3">
                        "default_toolchain_root": <mark className="bg-[#6fdd78]/30 text-[#6fdd78] px-1 py-0.2 rounded font-mono">"~/.dev-env/tools/"</mark>,
                        <span className="text-[#6fdd78] text-[11px] italic ml-2">// Restored Default</span>
                      </span>
                    </div>

                    <div className="flex hover:bg-[#262a31]/30 py-0.5">
                      <span className="w-10 text-right pr-2 text-[#889484] text-[11px] select-none shrink-0">5</span>
                      <span className="w-4 text-center text-[#889484] select-none shrink-0"> </span>
                      <span className="text-[#889484] pl-3">"workspace_isolation": <span className="text-[#fabc45]">false</span>,</span>
                    </div>

                    {/* Change 2 Added */}
                    <div className="flex bg-[#34a547]/15 hover:bg-[#34a547]/25 py-1 border-y border-[#34a547]/30">
                      <span className="w-10 text-right pr-2 text-[#6fdd78] text-[11px] font-bold select-none shrink-0">6</span>
                      <span className="w-4 text-center text-[#6fdd78] font-bold select-none shrink-0">+</span>
                      <span className="text-[#dfe2eb] pl-3">
                        "version_collision_policy": <mark className="bg-[#6fdd78]/30 text-[#6fdd78] px-1 py-0.2 rounded font-mono">"parallel_side_by_side"</mark>,
                      </span>
                    </div>

                    <div className="flex hover:bg-[#262a31]/30 py-0.5">
                      <span className="w-10 text-right pr-2 text-[#889484] text-[11px] select-none shrink-0">7</span>
                      <span className="w-4 text-center text-[#889484] select-none shrink-0"> </span>
                      <span className="text-[#889484] pl-3">"theme": <span className="text-[#aac7ff]">"dark_mica"</span>,</span>
                    </div>

                    {/* Change 3 Added */}
                    <div className="flex bg-[#34a547]/15 hover:bg-[#34a547]/25 py-1 border-y border-[#34a547]/30">
                      <span className="w-10 text-right pr-2 text-[#6fdd78] text-[11px] font-bold select-none shrink-0">8</span>
                      <span className="w-4 text-center text-[#6fdd78] font-bold select-none shrink-0">+</span>
                      <span className="text-[#dfe2eb] pl-3">
                        "registry_target_scope": <mark className="bg-[#6fdd78]/30 text-[#6fdd78] px-1 py-0.2 rounded font-mono">"HKCU_USER"</mark>,
                        <span className="text-[#6fdd78] text-[11px] italic ml-2">// Safe Developer User Profile</span>
                      </span>
                    </div>

                    <div className="flex hover:bg-[#262a31]/30 py-0.5">
                      <span className="w-10 text-right pr-2 text-[#889484] text-[11px] select-none shrink-0">9</span>
                      <span className="w-4 text-center text-[#889484] select-none shrink-0"> </span>
                      <span className="text-[#889484] pl-3">"telemetry_and_scans": {'{'}</span>
                    </div>

                    <div className="flex hover:bg-[#262a31]/30 py-0.5">
                      <span className="w-10 text-right pr-2 text-[#889484] text-[11px] select-none shrink-0">10</span>
                      <span className="w-4 text-center text-[#889484] select-none shrink-0"> </span>
                      <span className="text-[#889484] pl-6">"opt_in_anonymous_metrics": <span className="text-[#fabc45]">false</span>,</span>
                    </div>

                    {/* Change 4 Added */}
                    <div className="flex bg-[#34a547]/15 hover:bg-[#34a547]/25 py-1 border-y border-[#34a547]/30">
                      <span className="w-10 text-right pr-2 text-[#6fdd78] text-[11px] font-bold select-none shrink-0">11</span>
                      <span className="w-4 text-center text-[#6fdd78] font-bold select-none shrink-0">+</span>
                      <span className="text-[#dfe2eb] pl-6">
                        "cadence_minutes": <mark className="bg-[#6fdd78]/30 text-[#6fdd78] px-1 py-0.2 rounded font-mono">15</mark>,
                        <span className="text-[#6fdd78] text-[11px] italic ml-2">// Automatic Background Watcher</span>
                      </span>
                    </div>

                    <div className="flex hover:bg-[#262a31]/30 py-0.5">
                      <span className="w-10 text-right pr-2 text-[#889484] text-[11px] select-none shrink-0">12</span>
                      <span className="w-4 text-center text-[#889484] select-none shrink-0"> </span>
                      <span className="text-[#889484] pl-3">{'}'},</span>
                    </div>

                    <div className="flex hover:bg-[#262a31]/30 py-0.5">
                      <span className="w-10 text-right pr-2 text-[#889484] text-[11px] select-none shrink-0">13</span>
                      <span className="w-4 text-center text-[#889484] select-none shrink-0"> </span>
                      <span className="text-[#889484] pl-3">"broadcast_wm_settingchange": <span className="text-[#fabc45]">true</span></span>
                    </div>

                    <div className="flex hover:bg-[#262a31]/30 py-0.5">
                      <span className="w-10 text-right pr-2 text-[#889484] text-[11px] select-none shrink-0">14</span>
                      <span className="w-4 text-center text-[#889484] select-none shrink-0"> </span>
                      <span className="text-[#becab9]">{'}'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* UNIFIED INLINE MODE (Image 21) */
            <>
              {/* Header Gutter */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#1c2026] border-b border-[#3e4a3d] shrink-0 font-mono text-[11px]">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[#aac7ff] text-[16px]">tune</span>
                  <span className="font-semibold text-[#dfe2eb]">Unified Inline Diff</span>
                  <span className="text-[#889484]">config.json.bak-20250228-1425 → config.json</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#889484]">Dual Gutter: [Old Line # | New Line #]</span>
                  <span className="px-1.5 py-0.5 rounded font-mono text-[10px] text-[#6fdd78] bg-[#6fdd78]/10 font-bold">
                    COMMITTED TO REGISTRY
                  </span>
                </div>
              </div>

              {/* Unified Scroll View */}
              <div className="flex-1 overflow-y-auto selection:bg-[#31353c] p-1 select-text">
                <div className="flex items-center bg-[#262a31]/60 border-y border-[#3e4a3d] px-3 py-1 text-[#aac7ff] font-mono text-[11px]">
                  <span className="material-symbols-outlined text-[14px] mr-2 text-[#889484]">unfold_more</span>
                  <span>@@ -1,14 +1,14 @@ config.json (Restored Factory Defaults)</span>
                </div>

                <div className="flex hover:bg-[#262a31]/30 py-0.5">
                  <span className="w-8 text-right pr-2 text-[#889484] text-[11px] select-none">1</span>
                  <span className="w-8 text-right pr-2 text-[#889484] text-[11px] select-none border-r border-[#3e4a3d]">1</span>
                  <span className="w-4 text-center text-[#889484] select-none"> </span>
                  <span className="text-[#becab9] pl-2">{'{'}</span>
                </div>

                <div className="flex hover:bg-[#262a31]/30 py-0.5">
                  <span className="w-8 text-right pr-2 text-[#889484] text-[11px] select-none">2</span>
                  <span className="w-8 text-right pr-2 text-[#889484] text-[11px] select-none border-r border-[#3e4a3d]">2</span>
                  <span className="w-4 text-center text-[#889484] select-none"> </span>
                  <span className="text-[#889484] pl-5">"schema_version": <span className="text-[#aac7ff]">"2.1.4"</span>,</span>
                </div>

                <div className="flex hover:bg-[#262a31]/30 py-0.5">
                  <span className="w-8 text-right pr-2 text-[#889484] text-[11px] select-none">3</span>
                  <span className="w-8 text-right pr-2 text-[#889484] text-[11px] select-none border-r border-[#3e4a3d]">3</span>
                  <span className="w-4 text-center text-[#889484] select-none"> </span>
                  <span className="text-[#889484] pl-5">"installed_sdks_lock": <span className="text-[#fabc45]">true</span>,</span>
                </div>

                {/* Change 1 Deleted */}
                <div className="flex bg-[#93000a]/25 hover:bg-[#93000a]/40 py-1">
                  <span className="w-8 text-right pr-2 text-[#ffb4ab] text-[11px] font-bold select-none">4</span>
                  <span className="w-8 text-right pr-2 text-[#889484]/30 text-[11px] select-none border-r border-[#3e4a3d]"></span>
                  <span className="w-4 text-center text-[#ffb4ab] font-bold select-none">-</span>
                  <span className="text-[#dfe2eb] pl-5 break-all">
                    "default_toolchain_root": <mark className="bg-[#ffb4ab]/30 text-[#ffb4ab] px-1 py-0.2 rounded font-mono">"C:\\Program Files\\DevTools\\"</mark>,
                  </span>
                </div>

                {/* Change 1 Added */}
                <div className="flex bg-[#34a547]/15 hover:bg-[#34a547]/25 py-1">
                  <span className="w-8 text-right pr-2 text-[#889484]/30 text-[11px] select-none"></span>
                  <span className="w-8 text-right pr-2 text-[#6fdd78] text-[11px] font-bold select-none border-r border-[#3e4a3d]">4</span>
                  <span className="w-4 text-center text-[#6fdd78] font-bold select-none">+</span>
                  <span className="text-[#dfe2eb] pl-5 break-all">
                    "default_toolchain_root": <mark className="bg-[#6fdd78]/30 text-[#6fdd78] px-1 py-0.2 rounded font-mono">"~/.dev-env/tools/"</mark>, <span className="text-[#6fdd78] text-[11px] italic ml-2">// Restored Default</span>
                  </span>
                </div>

                <div className="flex hover:bg-[#262a31]/30 py-0.5">
                  <span className="w-8 text-right pr-2 text-[#889484] text-[11px] select-none">5</span>
                  <span className="w-8 text-right pr-2 text-[#889484] text-[11px] select-none border-r border-[#3e4a3d]">5</span>
                  <span className="w-4 text-center text-[#889484] select-none"> </span>
                  <span className="text-[#889484] pl-5">"workspace_isolation": <span className="text-[#fabc45]">false</span>,</span>
                </div>

                {/* Change 2 Deleted */}
                <div className="flex bg-[#93000a]/25 hover:bg-[#93000a]/40 py-1">
                  <span className="w-8 text-right pr-2 text-[#ffb4ab] text-[11px] font-bold select-none">6</span>
                  <span className="w-8 text-right pr-2 text-[#889484]/30 text-[11px] select-none border-r border-[#3e4a3d]"></span>
                  <span className="w-4 text-center text-[#ffb4ab] font-bold select-none">-</span>
                  <span className="text-[#dfe2eb] pl-5 break-all">
                    "version_collision_policy": <mark className="bg-[#ffb4ab]/30 text-[#ffb4ab] px-1 py-0.2 rounded font-mono">"strict_overwrite"</mark>,
                  </span>
                </div>

                {/* Change 2 Added */}
                <div className="flex bg-[#34a547]/15 hover:bg-[#34a547]/25 py-1">
                  <span className="w-8 text-right pr-2 text-[#889484]/30 text-[11px] select-none"></span>
                  <span className="w-8 text-right pr-2 text-[#6fdd78] text-[11px] font-bold select-none border-r border-[#3e4a3d]">6</span>
                  <span className="w-4 text-center text-[#6fdd78] font-bold select-none">+</span>
                  <span className="text-[#dfe2eb] pl-5 break-all">
                    "version_collision_policy": <mark className="bg-[#6fdd78]/30 text-[#6fdd78] px-1 py-0.2 rounded font-mono">"parallel_side_by_side"</mark>,
                  </span>
                </div>

                <div className="flex hover:bg-[#262a31]/30 py-0.5">
                  <span className="w-8 text-right pr-2 text-[#889484] text-[11px] select-none">7</span>
                  <span className="w-8 text-right pr-2 text-[#889484] text-[11px] select-none border-r border-[#3e4a3d]">7</span>
                  <span className="w-4 text-center text-[#889484] select-none"> </span>
                  <span className="text-[#889484] pl-5">"theme": <span className="text-[#aac7ff]">"dark_mica"</span>,</span>
                </div>

                {/* Change 3 Deleted */}
                <div className="flex bg-[#93000a]/25 hover:bg-[#93000a]/40 py-1">
                  <span className="w-8 text-right pr-2 text-[#ffb4ab] text-[11px] font-bold select-none">8</span>
                  <span className="w-8 text-right pr-2 text-[#889484]/30 text-[11px] select-none border-r border-[#3e4a3d]"></span>
                  <span className="w-4 text-center text-[#ffb4ab] font-bold select-none">-</span>
                  <span className="text-[#dfe2eb] pl-5 break-all">
                    "registry_target_scope": <mark className="bg-[#ffb4ab]/30 text-[#ffb4ab] px-1 py-0.2 rounded font-mono">"HKLM_MACHINE"</mark>, <span className="text-[#889484] text-[11px] italic ml-2">// Required Administrator elevation</span>
                  </span>
                </div>

                {/* Change 3 Added */}
                <div className="flex bg-[#34a547]/15 hover:bg-[#34a547]/25 py-1">
                  <span className="w-8 text-right pr-2 text-[#889484]/30 text-[11px] select-none"></span>
                  <span className="w-8 text-right pr-2 text-[#6fdd78] text-[11px] font-bold select-none border-r border-[#3e4a3d]">8</span>
                  <span className="w-4 text-center text-[#6fdd78] font-bold select-none">+</span>
                  <span className="text-[#dfe2eb] pl-5 break-all">
                    "registry_target_scope": <mark className="bg-[#6fdd78]/30 text-[#6fdd78] px-1 py-0.2 rounded font-mono">"HKCU_USER"</mark>, <span className="text-[#6fdd78] text-[11px] italic ml-2">// Safe Developer User Profile</span>
                  </span>
                </div>

                <div className="flex hover:bg-[#262a31]/30 py-0.5">
                  <span className="w-8 text-right pr-2 text-[#889484] text-[11px] select-none">9</span>
                  <span className="w-8 text-right pr-2 text-[#889484] text-[11px] select-none border-r border-[#3e4a3d]">9</span>
                  <span className="w-4 text-center text-[#889484] select-none"> </span>
                  <span className="text-[#889484] pl-5">"telemetry_and_scans": {'{'}</span>
                </div>

                <div className="flex hover:bg-[#262a31]/30 py-0.5">
                  <span className="w-8 text-right pr-2 text-[#889484] text-[11px] select-none">10</span>
                  <span className="w-8 text-right pr-2 text-[#889484] text-[11px] select-none border-r border-[#3e4a3d]">10</span>
                  <span className="w-4 text-center text-[#889484] select-none"> </span>
                  <span className="text-[#889484] pl-8">"opt_in_anonymous_metrics": <span className="text-[#fabc45]">false</span>,</span>
                </div>

                {/* Change 4 Deleted */}
                <div className="flex bg-[#93000a]/25 hover:bg-[#93000a]/40 py-1">
                  <span className="w-8 text-right pr-2 text-[#ffb4ab] text-[11px] font-bold select-none">11</span>
                  <span className="w-8 text-right pr-2 text-[#889484]/30 text-[11px] select-none border-r border-[#3e4a3d]"></span>
                  <span className="w-4 text-center text-[#ffb4ab] font-bold select-none">-</span>
                  <span className="text-[#dfe2eb] pl-8 break-all">
                    "cadence_minutes": <mark className="bg-[#ffb4ab]/30 text-[#ffb4ab] px-1 py-0.2 rounded font-mono">0</mark>, <span className="text-[#889484] text-[11px] italic ml-2">// Manual Checks Only</span>
                  </span>
                </div>

                {/* Change 4 Added */}
                <div className="flex bg-[#34a547]/15 hover:bg-[#34a547]/25 py-1">
                  <span className="w-8 text-right pr-2 text-[#889484]/30 text-[11px] select-none"></span>
                  <span className="w-8 text-right pr-2 text-[#6fdd78] text-[11px] font-bold select-none border-r border-[#3e4a3d]">11</span>
                  <span className="w-4 text-center text-[#6fdd78] font-bold select-none">+</span>
                  <span className="text-[#dfe2eb] pl-8 break-all">
                    "cadence_minutes": <mark className="bg-[#6fdd78]/30 text-[#6fdd78] px-1 py-0.2 rounded font-mono">15</mark>, <span className="text-[#6fdd78] text-[11px] italic ml-2">// Automatic Background Watcher</span>
                  </span>
                </div>

                <div className="flex hover:bg-[#262a31]/30 py-0.5">
                  <span className="w-8 text-right pr-2 text-[#889484] text-[11px] select-none">12</span>
                  <span className="w-8 text-right pr-2 text-[#889484] text-[11px] select-none border-r border-[#3e4a3d]">12</span>
                  <span className="w-4 text-center text-[#889484] select-none"> </span>
                  <span className="text-[#889484] pl-5">{'}'},</span>
                </div>

                <div className="flex hover:bg-[#262a31]/30 py-0.5">
                  <span className="w-8 text-right pr-2 text-[#889484] text-[11px] select-none">13</span>
                  <span className="w-8 text-right pr-2 text-[#889484] text-[11px] select-none border-r border-[#3e4a3d]">13</span>
                  <span className="w-4 text-center text-[#889484] select-none"> </span>
                  <span className="text-[#889484] pl-5">"broadcast_wm_settingchange": <span className="text-[#fabc45]">true</span></span>
                </div>

                <div className="flex hover:bg-[#262a31]/30 py-0.5">
                  <span className="w-8 text-right pr-2 text-[#889484] text-[11px] select-none">14</span>
                  <span className="w-8 text-right pr-2 text-[#889484] text-[11px] select-none border-r border-[#3e4a3d]">14</span>
                  <span className="w-4 text-center text-[#889484] select-none"> </span>
                  <span className="text-[#becab9] pl-2">{'}'}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 4. ACTION FOOTER */}
        <div className="px-5 py-3 bg-[#1c2026] border-t border-[#3e4a3d] flex items-center justify-between shadow-lg shrink-0 flex-wrap gap-2">
          {/* Revert / Export Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onRollback) onRollback();
                onClose();
              }}
              className="h-8 px-3.5 bg-[#262a31] hover:bg-[#93000a] hover:text-[#ffdad6] text-[#ffb4ab] border border-[#3e4a3d] rounded-lg text-[12px] font-medium flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">undo</span>
              <span>Rollback to This Backup</span>
            </button>

            <button
              onClick={handleExportZip}
              className="h-8 px-3.5 bg-[#262a31] hover:bg-[#31353c] border border-[#3e4a3d] text-[#dfe2eb] rounded-lg text-[12px] font-medium flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">archive</span>
              <span>Export Both Files (.json)</span>
            </button>
          </div>

          {/* Clipboard & Completion Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPatch}
              className="h-8 px-3.5 bg-[#262a31] hover:bg-[#31353c] border border-[#3e4a3d] text-[#dfe2eb] rounded-lg text-[12px] font-medium flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              <span>{copiedPatch ? 'Patch Copied!' : viewMode === 'unified' ? 'Copy Unified Patch' : 'Copy Diff Patch'}</span>
            </button>

            <button
              onClick={onClose}
              className="h-8 px-5 bg-[#6fdd78] hover:bg-[#34a547] text-[#00390e] rounded-lg text-[12px] font-bold flex items-center gap-1 transition-colors"
            >
              <span>Done</span>
              <kbd className="ml-1 px-1 py-0.2 bg-[#00390e]/20 text-[#00390e] rounded font-mono text-[10px]">Esc</kbd>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
