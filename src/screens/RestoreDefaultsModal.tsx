import React, { useState, useEffect } from 'react';

interface RestoreDefaultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmRestore: () => void;
  onExportJson?: () => void;
}

export const RestoreDefaultsModal: React.FC<RestoreDefaultsModalProps> = ({
  isOpen,
  onClose,
  onConfirmRestore,
  onExportJson,
}) => {
  const [countdown, setCountdown] = useState(3);
  const [copiedCli, setCopiedCli] = useState(false);
  const [createBackup, setCreateBackup] = useState(true);
  const [keepSymlinks, setKeepSymlinks] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3);
      setIsRestoring(false);
      return;
    }

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, countdown]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsRestoring(true);
    setTimeout(() => {
      setIsRestoring(false);
      onConfirmRestore();
    }, 700);
  };

  const handleCopyCli = () => {
    navigator.clipboard?.writeText('devenv config reset --snapshot --force');
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#181c22] border border-[#3e4a3d] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Acrylic Header */}
        <div className="bg-[#262a31] border-b border-[#3e4a3d] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#bd8708]/20 flex items-center justify-center text-[#fabc45]">
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-[14px] font-bold text-[#dfe2eb] tracking-tight">Restore Default Configuration?</h2>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#889484]">
                <span>SOURCE:</span>
                <span className="text-[#becab9]">%USERPROFILE%\.dev-env-manager\config.json</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#1c2026] border border-[#3e4a3d] font-mono text-[10px] text-[#fabc45] uppercase font-bold">
              Preferences Scope
            </span>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded flex items-center justify-center text-[#becab9] hover:bg-[#93000a] hover:text-[#ffdad6] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 flex flex-col gap-3.5 overflow-y-auto">
          {/* Informative Alert Callout */}
          <div className="p-3 rounded-lg bg-[#1c2026] border border-[#3e4a3d] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#fabc45] text-[20px] shrink-0 mt-0.5">info</span>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-semibold text-[#dfe2eb]">Scope of Reset Action</span>
              <p className="text-[12px] text-[#becab9] leading-relaxed">
                This action resets your application preferences, automated scan schedules, telemetry flags, and installation path defaults back to initial setup values. <strong className="text-[#6fdd78] font-medium">Your installed SDKs, compilers, runtimes, and local projects will NOT be deleted from disk.</strong>
              </p>
            </div>
          </div>

          {/* Detailed Impact Comparison (2 Column Bento Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {/* Column 1: Will be Reset */}
            <div className="flex flex-col bg-[#0a0e14] border border-[#3e4a3d] rounded p-3 gap-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#3e4a3d]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#fabc45] text-[16px]">change_circle</span>
                  <span className="font-mono text-[10px] text-[#fabc45] font-bold uppercase">Will Be Reset</span>
                </div>
                <span className="px-1.5 py-0.2 rounded bg-[#262a31] font-mono text-[10px] text-[#becab9]">
                  4 Items
                </span>
              </div>

              <div className="flex flex-col gap-1.5 text-[12px] text-[#becab9]">
                <div className="p-1.5 rounded bg-[#1c2026]/70 flex flex-col gap-0.5">
                  <span className="text-[#dfe2eb] font-medium">Default Toolchain Root</span>
                  <div className="flex items-center gap-1 font-mono text-[10px] truncate">
                    <span className="text-[#ffb4ab] line-through">C:\Program Files\DevTools\</span>
                    <span className="text-[#889484]">➔</span>
                    <span className="text-[#6fdd78]">~\.dev-env\tools\</span>
                  </div>
                </div>

                <div className="p-1.5 rounded bg-[#1c2026]/70 flex flex-col gap-0.5">
                  <span className="text-[#dfe2eb] font-medium">Collision Resolution Strategy</span>
                  <div className="flex items-center gap-1 font-mono text-[10px]">
                    <span className="text-[#889484] line-through">Overwrite Strict</span>
                    <span className="text-[#889484]">➔</span>
                    <span className="text-[#6fdd78]">Install Parallel (Default)</span>
                  </div>
                </div>

                <div className="p-1.5 rounded bg-[#1c2026]/70 flex flex-col gap-0.5">
                  <span className="text-[#dfe2eb] font-medium">Registry Target Scope</span>
                  <div className="flex items-center gap-1 font-mono text-[10px]">
                    <span className="text-[#889484] line-through">HKLM (Machine)</span>
                    <span className="text-[#889484]">➔</span>
                    <span className="text-[#6fdd78]">HKCU (User Scope)</span>
                  </div>
                </div>

                <div className="p-1.5 rounded bg-[#1c2026]/70 flex flex-col gap-0.5">
                  <span className="text-[#dfe2eb] font-medium">Telemetry &amp; Scan Cadence</span>
                  <div className="flex items-center gap-1 font-mono text-[10px]">
                    <span className="text-[#889484] line-through">Manual (Off)</span>
                    <span className="text-[#889484]">➔</span>
                    <span className="text-[#6fdd78]">Auto / 15 Minutes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Safe & Untouched */}
            <div className="flex flex-col bg-[#0a0e14] border border-[#3e4a3d] rounded p-3 gap-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#3e4a3d]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#6fdd78] text-[16px]">verified</span>
                  <span className="font-mono text-[10px] text-[#6fdd78] font-bold uppercase">Safe &amp; Untouched</span>
                </div>
                <span className="px-1.5 py-0.2 rounded bg-[#262a31] font-mono text-[10px] text-[#6fdd78] font-bold">
                  No Data Loss
                </span>
              </div>

              <div className="flex flex-col gap-1.5 text-[12px] text-[#becab9]">
                <div className="p-1.5 rounded bg-[#1c2026]/70 flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#6fdd78] text-[15px] shrink-0 mt-0.5">check_circle</span>
                  <div className="flex flex-col">
                    <span className="text-[#dfe2eb] font-medium">Installed Runtimes on Disk</span>
                    <span className="font-mono text-[10px] text-[#889484]">OpenJDK 21, Node 22, Git 2.44, Rust 1.78</span>
                  </div>
                </div>

                <div className="p-1.5 rounded bg-[#1c2026]/70 flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#6fdd78] text-[15px] shrink-0 mt-0.5">check_circle</span>
                  <div className="flex flex-col">
                    <span className="text-[#dfe2eb] font-medium">System Environment Keys</span>
                    <span className="font-mono text-[10px] text-[#889484]">JAVA_HOME, GOPATH, and User %PATH%</span>
                  </div>
                </div>

                <div className="p-1.5 rounded bg-[#1c2026]/70 flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#6fdd78] text-[15px] shrink-0 mt-0.5">check_circle</span>
                  <div className="flex flex-col">
                    <span className="text-[#dfe2eb] font-medium">Historical Diagnostic Logs</span>
                    <span className="font-mono text-[10px] text-[#889484]">C:\ProgramData\DevEnv\audit-logs\*</span>
                  </div>
                </div>

                <div className="p-1.5 rounded bg-[#1c2026]/70 flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#6fdd78] text-[15px] shrink-0 mt-0.5">check_circle</span>
                  <div className="flex flex-col">
                    <span className="text-[#dfe2eb] font-medium">Active Terminal Profiles</span>
                    <span className="font-mono text-[10px] text-[#889484]">PowerShell 7 &amp; Windows Terminal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Checkboxes */}
          <div className="p-3 rounded-lg bg-[#1c2026] border border-[#3e4a3d] flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={createBackup}
                onChange={(e) => setCreateBackup(e.target.checked)}
                className="w-4 h-4 rounded bg-[#0a0e14] text-[#6fdd78] accent-[#6fdd78] cursor-pointer"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[12px] font-medium text-[#dfe2eb] flex items-center gap-1.5">
                  Create automated configuration backup snapshot
                  <span className="px-1 py-0.2 rounded bg-[#34a547]/20 text-[#6fdd78] font-mono text-[9px] font-bold">
                    Recommended
                  </span>
                </span>
                <span className="font-mono text-[10px] text-[#889484] truncate">
                  Destination: %USERPROFILE%\.dev-env-manager\backups\config.json.bak-20250228-1425
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={keepSymlinks}
                onChange={(e) => setKeepSymlinks(e.target.checked)}
                className="w-4 h-4 rounded bg-[#0a0e14] text-[#6fdd78] accent-[#6fdd78] cursor-pointer"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[12px] font-medium text-[#dfe2eb]">
                  Keep existing toolchain directory symlinks mapped in registry
                </span>
                <span className="font-mono text-[10px] text-[#889484] truncate">
                  Leaves current PATH references pointing to custom Program Files location
                </span>
              </div>
            </label>
          </div>

          {/* CLI Fallback */}
          <div className="px-3 py-1.5 bg-[#0a0e14] border border-[#3e4a3d] rounded flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#889484] text-[16px]">terminal</span>
              <span className="font-mono text-[11px] text-[#889484]">CLI Fallback:</span>
              <code className="font-mono text-[11px] text-[#dfe2eb] bg-[#1c2026] px-1 py-0.2 rounded border border-[#3e4a3d]">
                devenv config reset --snapshot --force
              </code>
            </div>
            <button
              onClick={handleCopyCli}
              className="text-[#becab9] hover:text-[#dfe2eb] transition-colors flex items-center gap-1 font-mono text-[11px]"
            >
              <span className="material-symbols-outlined text-[14px]">
                {copiedCli ? 'check' : 'content_copy'}
              </span>
              <span>{copiedCli ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#262a31] border-t border-[#3e4a3d] px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={onExportJson}
            className="h-8 px-3 rounded bg-[#1c2026] hover:bg-[#31353c] border border-[#3e4a3d] text-[#dfe2eb] text-[12px] font-medium flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">save_as</span>
            <span>Export Current JSON First</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="h-8 px-3.5 rounded bg-[#1c2026] hover:bg-[#31353c] border border-[#3e4a3d] text-[#dfe2eb] text-[12px] font-medium transition-colors"
            >
              Cancel <kbd className="ml-1 text-[10px] text-[#889484]">Esc</kbd>
            </button>
            <button
              onClick={handleConfirm}
              disabled={countdown > 0 || isRestoring}
              className={`h-8 px-4 rounded text-[12px] font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-[0.98] ${
                countdown > 0
                  ? 'bg-[#31353c] text-[#889484] cursor-not-allowed border border-[#3e4a3d]'
                  : 'bg-[#bd8708] hover:bg-[#fabc45] text-[#392600]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>{isRestoring ? 'Restoring Defaults...' : 'Restore Defaults'}</span>
              {countdown > 0 && (
                <span className="px-1.5 py-0.2 rounded bg-black/25 text-[10px] font-mono text-[#becab9]">
                  {countdown}s
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
