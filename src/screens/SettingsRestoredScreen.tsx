import React, { useState, useEffect } from 'react';
import { ScreenType } from '../types';

interface SettingsRestoredScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenDiffModal: (mode: 'split' | 'unified') => void;
  onUndoReset: () => void;
}

export const SettingsRestoredScreen: React.FC<SettingsRestoredScreenProps> = ({
  onNavigate,
  onOpenDiffModal,
  onUndoReset,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(59);
  const [showToast, setShowToast] = useState(true);
  const [bannerClosed, setBannerClosed] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const handleUndo = () => {
    setShowToast(false);
    onUndoReset();
  };

  const pct = Math.max(0, (secondsLeft / 59) * 100);

  return (
    <div className="flex flex-col w-full relative select-none">
      {/* Breadcrumbs & Header Bar */}
      <div className="flex items-center justify-between py-2 mb-2">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#becab9]">
          <button onClick={() => onNavigate('dashboard')} className="hover:text-[#dfe2eb]">Hub</button>
          <span>/</span>
          <button onClick={() => onNavigate('settings')} className="hover:text-[#dfe2eb]">Preferences</button>
          <span>/</span>
          <span className="text-[#6fdd78] font-medium">Settings &amp; Environment Policies</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1c2026] border border-[#3e4a3d] rounded-lg">
            <span className="material-symbols-outlined text-[15px] text-[#6fdd78]">verified</span>
            <span className="font-mono text-[11px] text-[#dfe2eb]">Schema v2.1.4</span>
          </div>
          <button className="flex items-center gap-1 px-3 py-1 bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] rounded-lg text-[#dfe2eb] text-[12px] font-medium">
            <span className="material-symbols-outlined text-[15px] text-[#889484]">history</span>
            <span>Revisions (18)</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {!bannerClosed && (
        <div className="relative overflow-hidden mb-4 rounded-xl bg-[#1c2026] border border-[#3e4a3d] p-4 shadow-xl">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#6fdd78]"></div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 relative z-10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6fdd78]/15 border border-[#6fdd78]/40 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[#6fdd78] text-[24px]">task_alt</span>
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[18px] font-bold text-[#dfe2eb]">Default Settings Successfully Restored</h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#6fdd78]/20 text-[#6fdd78] font-mono text-[10px] font-bold uppercase tracking-wider">
                    State Synchronized
                  </span>
                </div>
                <p className="text-[13px] text-[#becab9] max-w-3xl leading-relaxed">
                  Application preferences, telemetry intervals, and toolchain paths were reverted to factory defaults. Installed SDKs, runtimes, and system PATH variables remain intact and untouched.
                </p>

                {/* Banner Metadata Chips */}
                <div className="flex items-center gap-2 mt-1 flex-wrap font-mono text-[11px]">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#262a31] border border-[#3e4a3d] text-[#dfe2eb]">
                    <span className="material-symbols-outlined text-[14px] text-[#fabc45]">inventory_2</span>
                    <span>Backup:</span>
                    <span className="text-[#aac7ff] font-mono">config.json.bak-20250228-1425</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#262a31] border border-[#3e4a3d] text-[#becab9]">
                    <span className="material-symbols-outlined text-[14px] text-[#6fdd78]">cloud_sync</span>
                    <span>Registry Synced (HKCU)</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#262a31] border border-[#3e4a3d] text-[#becab9]">
                    <span className="material-symbols-outlined text-[14px] text-[#aac7ff]">broadcast_on_home</span>
                    <span>WM_SETTINGCHANGE Dispatched</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Cluster */}
            <div className="flex items-center gap-2 self-stretch md:self-auto justify-end pt-1 md:pt-0 shrink-0">
              <button
                onClick={() => onOpenDiffModal('split')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#262a31] hover:bg-[#353940] border border-[#3e4a3d] text-[#dfe2eb] font-medium text-[12px] transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[15px] text-[#aac7ff]">difference</span>
                <span>View Diff</span>
              </button>
              <button
                onClick={handleUndo}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6fdd78] hover:bg-[#34a547] text-[#00390e] font-bold text-[12px] transition-all shadow-md active:scale-95"
              >
                <span className="material-symbols-outlined text-[15px]">undo</span>
                <span>Undo Reset ({secondsLeft}s)</span>
              </button>
              <button
                onClick={() => setBannerClosed(true)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#becab9] hover:text-[#dfe2eb] hover:bg-[#262a31]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        {/* Left Column (7 cols): Storage & Registry */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-4">
          {/* Section: Storage & Toolchain Paths */}
          <div className="bg-[#1c2026] border border-[#3e4a3d] rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6fdd78] text-[20px]">folder_special</span>
                <h3 className="text-[14px] font-bold text-[#dfe2eb]">Storage &amp; Toolchain Paths</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#6fdd78]/20 text-[#6fdd78] font-mono text-[10px] font-bold tracking-wide flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6fdd78] animate-pulse"></span>
                RESTORED TO FACTORY
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#becab9]">Default Global Toolchain Root</label>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0a0e14] border border-[#3e4a3d]">
                <div className="flex items-center gap-2 min-w-0 font-mono text-[12px]">
                  <span className="material-symbols-outlined text-[#aac7ff] text-[18px]">hard_drive</span>
                  <span className="text-[#dfe2eb] font-semibold truncate">~/.dev-env/tools/</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#34a547]/20 text-[#6fdd78] text-[10px] font-mono font-bold uppercase">
                    Restored Default
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => navigator.clipboard?.writeText('~/.dev-env/tools/')}
                    className="p-1 rounded bg-[#1c2026] hover:bg-[#262a31] text-[#becab9] hover:text-[#dfe2eb]"
                    title="Copy path"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                  </button>
                  <button
                    onClick={() => onNavigate('settings')}
                    className="px-2.5 py-1 rounded bg-[#1c2026] hover:bg-[#262a31] text-[#dfe2eb] text-[12px] font-medium"
                  >
                    Change
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-[#889484]">
                Resolved physical location: <span className="font-mono text-[#becab9]">C:\Users\Developer\.dev-env\tools\</span> (Capacity: 412.8 GB available on NVMe Volume C:)
              </p>
            </div>

            <div className="flex flex-col gap-1 pt-1">
              <label className="text-[12px] text-[#becab9]">Package Cache &amp; Tarball Buffer</label>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0a0e14] border border-[#3e4a3d] font-mono text-[12px] text-[#becab9]">
                <div className="flex items-center gap-2 truncate">
                  <span className="material-symbols-outlined text-[#889484] text-[18px]">inventory</span>
                  <span className="truncate">~/.dev-env/cache/downloads/</span>
                </div>
                <span className="px-2 py-0.5 bg-[#1c2026] border border-[#3e4a3d] rounded text-[#889484] font-mono text-[10px]">
                  2.1 GB USED
                </span>
              </div>
            </div>
          </div>

          {/* Section: Registry Scope & Target Context */}
          <div className="bg-[#1c2026] border border-[#3e4a3d] rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#aac7ff] text-[20px]">account_tree</span>
                <h3 className="text-[14px] font-bold text-[#dfe2eb]">Registry Scope &amp; Target Context</h3>
              </div>
              <span className="font-mono text-[11px] text-[#889484]">Registry Sync active</span>
            </div>
            <p className="text-[12px] text-[#becab9]">
              Determines whether environment variable changes (e.g. <span className="font-mono text-[#6fdd78]">JAVA_HOME</span>, <span className="font-mono text-[#6fdd78]">PATH</span>) are written to the current user hive or globally for all accounts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-lg bg-[#262a31] border border-[#6fdd78] relative flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#dfe2eb]">User Scope (HKCU)</span>
                  <span className="w-4 h-4 rounded-full bg-[#6fdd78] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#00390e] text-[12px]">check</span>
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#becab9]">HKEY_CURRENT_USER\Environment</span>
                <p className="text-[11px] text-[#889484] mt-1">
                  Recommended. No elevated UAC prompt required. Isolates developer state to active profile.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#181c22] border border-[#3e4a3d] opacity-60 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[#dfe2eb]">Machine Scope (HKLM)</span>
                  <span className="w-4 h-4 rounded-full border border-[#889484]"></span>
                </div>
                <span className="font-mono text-[11px] text-[#889484]">HKEY_LOCAL_MACHINE\SYSTEM</span>
                <p className="text-[11px] text-[#889484] mt-1">
                  Requires Administrator privilege. Applies globally across all local accounts.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <label className="text-[12px] text-[#becab9]">Version Collision Handling Policy</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-lg bg-[#262a31] border border-[#6fdd78] text-left flex flex-col">
                  <div className="flex items-center justify-between text-[#6fdd78] text-[12px] font-medium">
                    <span>Parallel Side-by-Side</span>
                    <span className="material-symbols-outlined text-[14px]">done</span>
                  </div>
                  <span className="text-[10px] text-[#889484]">Keep all versions intact</span>
                </div>

                <div className="p-2 rounded-lg bg-[#181c22] border border-[#3e4a3d] text-left flex flex-col">
                  <div className="text-[#dfe2eb] text-[12px] font-medium">Replace Previous</div>
                  <span className="text-[10px] text-[#889484]">Uninstalls minor delta</span>
                </div>

                <div className="p-2 rounded-lg bg-[#181c22] border border-[#3e4a3d] text-left flex flex-col">
                  <div className="text-[#dfe2eb] text-[12px] font-medium">Prompt on Conflict</div>
                  <span className="text-[10px] text-[#889484]">Interactive modal choice</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Automations & Factory Integrity */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
          {/* Section: Automation & Watchers */}
          <div className="bg-[#1c2026] border border-[#3e4a3d] rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#fabc45] text-[20px]">toggle_on</span>
                <h3 className="text-[14px] font-bold text-[#dfe2eb]">Automation &amp; Watchers</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#6fdd78]/20 text-[#6fdd78] font-mono text-[10px] font-bold">
                2 RESTORED
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Switch 1 */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[#0a0e14] border border-[#3e4a3d]">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-medium text-[#dfe2eb]">Background Startup Discovery</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6fdd78] animate-ping"></span>
                  </div>
                  <span className="text-[11px] text-[#889484]">Scan Win32 &amp; WSL registries for freshly installed runtimes</span>
                </div>
                <div className="w-10 h-5 bg-[#6fdd78] rounded-full relative flex items-center p-0.5 justify-end shrink-0 shadow-inner">
                  <div className="w-4 h-4 bg-[#00390e] rounded-full shadow"></div>
                </div>
              </div>

              {/* Switch 2 */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[#0a0e14] border border-[#3e4a3d]">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-medium text-[#dfe2eb]">Broadcast PATH to Active Consoles</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#1c2026] text-[#6fdd78] font-mono text-[9px] font-bold">AUTO-ON</span>
                  </div>
                  <span className="text-[11px] text-[#889484]">Sends IPC notify to running PowerShell &amp; Windows Terminal tabs</span>
                </div>
                <div className="w-10 h-5 bg-[#6fdd78] rounded-full relative flex items-center p-0.5 justify-end shrink-0 shadow-inner">
                  <div className="w-4 h-4 bg-[#00390e] rounded-full shadow"></div>
                </div>
              </div>

              {/* Switch 3 */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[#0a0e14] border border-[#3e4a3d] opacity-70">
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] font-medium text-[#dfe2eb]">Telemetry &amp; Crash Dumps</span>
                  <span className="text-[11px] text-[#889484]">Anonymous error reports to Microsoft Windows Dev Portal</span>
                </div>
                <div className="w-10 h-5 bg-[#31353c] rounded-full relative flex items-center p-0.5 justify-start shrink-0">
                  <div className="w-4 h-4 bg-[#becab9] rounded-full shadow"></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[#becab9]">Update Polling Frequency</span>
                <span className="font-mono text-[11px] text-[#6fdd78]">Every 4 hours (Default)</span>
              </div>
              <div className="w-full bg-[#0a0e14] h-2 rounded-full overflow-hidden flex">
                <div className="bg-[#6fdd78] w-2/5 h-full rounded-full"></div>
              </div>
              <div className="flex justify-between font-mono text-[10px] text-[#889484]">
                <span>15m</span>
                <span>1h</span>
                <span className="text-[#6fdd78] font-bold">4h [Default]</span>
                <span>24h</span>
                <span>Never</span>
              </div>
            </div>
          </div>

          {/* Section: Factory Integrity Check */}
          <div className="bg-[#1c2026] border border-[#3e4a3d] rounded-xl p-4 shadow-sm flex flex-col gap-2.5">
            <h3 className="text-[14px] font-bold text-[#dfe2eb]">Factory Integrity Check</h3>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2.5 rounded bg-[#0a0e14] border border-[#3e4a3d] flex flex-col">
                <span className="text-[#889484] text-[10px]">RESET DURATION</span>
                <span className="text-[#6fdd78] font-bold text-[14px]">140 ms</span>
              </div>
              <div className="p-2.5 rounded bg-[#0a0e14] border border-[#3e4a3d] flex flex-col">
                <span className="text-[#889484] text-[10px]">ENTRIES REVERTED</span>
                <span className="text-[#dfe2eb] font-bold text-[14px]">4 custom rules</span>
              </div>
            </div>
            <div className="p-2.5 rounded bg-[#0a0e14] border border-[#3e4a3d] font-mono text-[11px] flex flex-col gap-1 text-[#becab9]">
              <div className="flex items-center justify-between">
                <span className="text-[#889484]">Snapshot Hash:</span>
                <span className="text-[#aac7ff] truncate ml-2">sha256:7a8f9b2c...09e1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#889484]">Clean Exit Code:</span>
                <span className="text-[#6fdd78]">0x0 (SUCCESS)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Configuration Audit Bar */}
      <div className="p-3 rounded-xl bg-[#1c2026] border border-[#3e4a3d] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px]">
          <div className="flex items-center gap-1.5 text-[#dfe2eb]">
            <span className="material-symbols-outlined text-[16px] text-[#6fdd78]">description</span>
            <span className="text-[#889484]">Active Config:</span>
            <span className="text-[#dfe2eb] font-mono">%USERPROFILE%\.dev-env-manager\config.json</span>
          </div>
          <span className="text-[#889484]">|</span>
          <div className="flex items-center gap-1 text-[#6fdd78]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6fdd78]"></span>
            <span className="font-medium">State: Factory Defaults</span>
          </div>
          <span className="text-[#889484]">|</span>
          <span className="text-[#becab9]">Schema 2.1</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onOpenDiffModal('unified')}
            className="font-mono text-[11px] text-[#aac7ff] hover:underline flex items-center gap-1"
          >
            <span>View Change Log</span>
            <span className="material-symbols-outlined text-[13px]">open_in_new</span>
          </button>
          <button
            onClick={() => onNavigate('settings')}
            className="px-3 py-1 bg-[#262a31] hover:bg-[#353940] border border-[#3e4a3d] rounded-lg text-[#dfe2eb] text-[12px] font-medium transition-colors"
          >
            Configure Settings
          </button>
        </div>
      </div>

      {/* Mini CLI Event Log Drawer */}
      <div className="rounded-xl bg-[#0a0e14] border border-[#3e4a3d] p-3 shadow-sm mb-4 font-mono text-[11px] text-[#becab9] flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 text-[#6fdd78]">
            <span className="material-symbols-outlined text-[14px]">terminal</span>
            <span className="font-bold">PS 7.4</span>
          </div>
          <span className="text-[#889484]">&gt;</span>
          <span className="text-[#6fdd78] font-mono">[CONFIG:EVENT]</span>
          <span className="text-[#dfe2eb]">Factory defaults committed to Registry hive in 140ms.</span>
          <span className="text-[#889484]">|</span>
          <span className="text-[#becab9]">
            Backup snapshot: <span className="text-[#fabc45]">config.json.bak-20250228-1425</span>
          </span>
        </div>
        <div className="flex items-center gap-2 pl-3 shrink-0">
          <span className="px-1.5 py-0.2 rounded bg-[#1c2026] text-[#889484] text-[10px]">UTF-8</span>
          <span className="text-[#6fdd78] font-medium">Ready</span>
        </div>
      </div>

      {/* Windows 11 Action Center Toast (Bottom-Right) */}
      {showToast && (
        <aside className="fixed right-6 bottom-12 w-96 max-w-[calc(100vw-3rem)] rounded-xl bg-[#262a31]/95 backdrop-blur-xl border border-[#3e4a3d] p-4 shadow-2xl z-50 animate-in fade-in duration-300">
          {/* Top Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#6fdd78] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#00390e] text-[12px]">terminal</span>
              </div>
              <span className="text-[12px] text-[#becab9] font-medium">Dev Environment Manager</span>
              <span className="text-[#889484] text-[11px]">• Just now</span>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="w-6 h-6 rounded flex items-center justify-center text-[#becab9] hover:text-[#dfe2eb] hover:bg-[#31353c] transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>

          {/* Toast Body */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#6fdd78]/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[#6fdd78] text-[18px]">restore</span>
            </div>
            <div className="flex flex-col min-w-0">
              <h4 className="text-[13px] font-bold text-[#dfe2eb]">Settings Reset Completed</h4>
              <p className="text-[12px] text-[#becab9] mt-0.5 leading-snug">
                Reverted 4 custom rules to initial defaults. Backup saved to <span className="font-mono text-[#aac7ff]">%USERPROFILE%\.dev-env-manager\backups\</span>
              </p>
            </div>
          </div>

          {/* Progress Bar for Countdown */}
          <div className="w-full bg-[#181c22] h-1 rounded-full overflow-hidden mt-3 mb-2.5">
            <div
              className="bg-[#6fdd78] h-full rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${pct}%` }}
            ></div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={handleUndo}
              className="px-3 py-1.5 rounded-lg bg-[#181c22] hover:bg-[#1c2026] text-[#6fdd78] font-semibold text-[12px] flex items-center gap-1 shadow-sm border border-[#3e4a3d]"
            >
              <span className="material-symbols-outlined text-[14px]">undo</span>
              <span>Undo</span>
            </button>
            <button
              onClick={() => onOpenDiffModal('split')}
              className="px-3 py-1.5 rounded-lg bg-[#181c22] hover:bg-[#1c2026] text-[#dfe2eb] text-[12px] flex items-center gap-1 border border-[#3e4a3d]"
            >
              <span className="material-symbols-outlined text-[14px]">difference</span>
              <span>Diff</span>
            </button>
            <button
              onClick={() => setShowToast(false)}
              className="px-2.5 py-1.5 rounded-lg text-[#becab9] hover:text-[#dfe2eb] hover:bg-[#181c22] text-[12px]"
            >
              Dismiss
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};
