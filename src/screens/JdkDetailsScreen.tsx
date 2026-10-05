import React, { useState } from 'react';
import { ScreenType } from '../types';

interface JdkDetailsScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenConflictModal: () => void;
}

export const JdkDetailsScreen: React.FC<JdkDetailsScreenProps> = ({
  onNavigate,
  onOpenConflictModal,
}) => {
  const [activeJdk, setActiveJdk] = useState<'jdk-22' | 'jdk-17' | 'jdk-11'>('jdk-22');
  const [isApplying, setIsApplying] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [isScanningLocal, setIsScanningLocal] = useState(false);
  const [shellTesting, setShellTesting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleApplyChanges = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setShowConfirmation(true);
    }, 700);
  };

  const handleRevertToJava17 = () => {
    setActiveJdk('jdk-17');
    handleApplyChanges();
  };

  const handleScanLocal = () => {
    setIsScanningLocal(true);
    setTimeout(() => {
      setIsScanningLocal(false);
    }, 800);
  };

  const handleRunShellTest = () => {
    setShellTesting(true);
    setTimeout(() => {
      setShellTesting(false);
    }, 600);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getActiveDetails = () => {
    switch (activeJdk) {
      case 'jdk-22':
        return {
          version: '22.0.2',
          path: 'C:\\Program Files\\Java\\jdk-22.0.2',
          build: 'Temurin OpenJDK-22.0.2+9',
          vendor: 'Eclipse Adoptium',
        };
      case 'jdk-17':
        return {
          version: '17.0.17 LTS',
          path: 'C:\\Program Files\\Java\\jdk-17.0.17',
          build: 'Eclipse Adoptium Temurin 17.0.17+7',
          vendor: 'Eclipse Adoptium',
        };
      case 'jdk-11':
        return {
          version: '11.0.22 LTS',
          path: 'C:\\Program Files\\Java\\jdk-11.0.22',
          build: 'Oracle HotSpot 11.0.22+9',
          vendor: 'Oracle Corporation',
        };
    }
  };

  const currentDetails = getActiveDetails();

  return (
    <div className="flex flex-col w-full gap-4 select-none">
      {/* Breadcrumbs & Context Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#889484]">
          <button onClick={() => onNavigate('dashboard')} className="hover:text-[#dfe2eb] transition-colors">
            Environment
          </button>
          <span>/</span>
          <button onClick={() => onNavigate('languages')} className="hover:text-[#dfe2eb] transition-colors">
            Languages &amp; Runtimes
          </button>
          <span>/</span>
          <span className="text-[#6fdd78] font-semibold">Java (OpenJDK &amp; Oracle)</span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#262a31] border border-[#3e4a3d] flex items-center justify-center shadow-sm text-[#6fdd78]">
              <span className="material-symbols-outlined text-[24px]">coffee</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[24px] font-bold text-[#dfe2eb] tracking-tight">Java Development Kit (JDK)</h1>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#262a31] border border-[#3e4a3d] text-[#becab9] uppercase font-bold">
                  Ecosystem {currentDetails.version}
                </span>
              </div>
              <span className="text-[12px] text-[#becab9]">
                Active Vendor Distribution: Eclipse Adoptium (Temurin) &amp; Oracle HotSpot Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleScanLocal}
              disabled={isScanningLocal}
              className="h-8 px-3 bg-[#262a31] hover:bg-[#353940] border border-[#3e4a3d] text-[#dfe2eb] rounded text-[12px] font-medium flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <span className={`material-symbols-outlined text-[15px] text-[#6fdd78] ${isScanningLocal ? 'animate-spin' : ''}`}>
                search_check
              </span>
              <span>{isScanningLocal ? 'Scanning local...' : 'Scan for Local JDKs'}</span>
            </button>

            <button
              onClick={() => onNavigate('settings')}
              className="h-8 px-3 bg-[#262a31] hover:bg-[#353940] border border-[#3e4a3d] text-[#dfe2eb] rounded text-[12px] font-medium flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[15px] text-[#aac7ff]">tune</span>
              <span>Configure Path Shims</span>
            </button>

            <button
              onClick={onOpenConflictModal}
              className="h-8 px-3 bg-[#6fdd78] hover:bg-[#34a547] text-[#00390e] font-semibold text-[12px] rounded flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Install New JDK...</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Active Version Switcher Card */}
      <div className="bg-[#1c2026] border border-[#3e4a3d] rounded-xl p-4 flex flex-col gap-3 shadow-md">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#6fdd78] text-[18px]">sync_alt</span>
              <h2 className="text-[18px] font-semibold text-[#dfe2eb]">Active Runtime Switcher</h2>
            </div>
            <p className="text-[13px] text-[#becab9]">
              Instantly switches system-wide environment variables (<code className="font-mono text-[11px] text-[#6fdd78] px-1 py-0.5 bg-[#0a0e14] rounded">JAVA_HOME</code> and System <code className="font-mono text-[11px] text-[#6fdd78] px-1 py-0.5 bg-[#0a0e14] rounded">PATH</code>) without requiring shell or explorer restarts.
            </p>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1 bg-[#0a0e14] border border-[#3e4a3d] rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#6fdd78] animate-ping"></span>
            <span className="font-mono text-[11px] text-[#6fdd78] font-medium">Auto-Broadcast: WM_SETTINGCHANGE Active</span>
          </div>
        </div>

        {/* Version Radio Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Option 1: Java 22.0.2 */}
          <label
            onClick={() => setActiveJdk('jdk-22')}
            className={`relative flex flex-col p-3 rounded-xl cursor-pointer transition-all border shadow-sm ${
              activeJdk === 'jdk-22'
                ? 'bg-[#262a31] border-[#6fdd78] ring-1 ring-[#6fdd78]'
                : 'bg-[#181c22] border-[#3e4a3d] hover:bg-[#262a31]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="active-jdk"
                  value="jdk-22"
                  checked={activeJdk === 'jdk-22'}
                  onChange={() => setActiveJdk('jdk-22')}
                  className="accent-[#6fdd78] w-4 h-4 cursor-pointer"
                />
                <span className="text-[14px] font-bold text-[#dfe2eb]">Java 22.0.2</span>
              </div>
              <span className="px-1.5 py-0.5 bg-[#34a547] text-[#00320b] font-mono text-[10px] rounded font-bold uppercase tracking-wider">
                ACTIVE
              </span>
            </div>
            <span className="text-[12px] text-[#becab9] truncate">Temurin 64-Bit Server VM Hotspot</span>
            <div className="mt-3 pt-1 border-t border-[#3e4a3d] flex items-center justify-between text-[#889484] font-mono text-[10px]">
              <span>Build: 22.0.2+9</span>
              <span className="text-[#6fdd78] font-semibold">Priority #1</span>
            </div>
          </label>

          {/* Option 2: Java 17 LTS */}
          <label
            onClick={() => setActiveJdk('jdk-17')}
            className={`relative flex flex-col p-3 rounded-xl cursor-pointer transition-all border ${
              activeJdk === 'jdk-17'
                ? 'bg-[#262a31] border-[#6fdd78] ring-1 ring-[#6fdd78]'
                : 'bg-[#181c22] border-[#3e4a3d] hover:bg-[#262a31]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="active-jdk"
                  value="jdk-17"
                  checked={activeJdk === 'jdk-17'}
                  onChange={() => setActiveJdk('jdk-17')}
                  className="accent-[#6fdd78] w-4 h-4 cursor-pointer"
                />
                <span className="text-[14px] font-bold text-[#dfe2eb]">Java 17.0.17 LTS</span>
              </div>
              <span className="px-1.5 py-0.5 bg-[#31353c] text-[#aac7ff] font-mono text-[10px] rounded font-medium uppercase">
                STANDBY
              </span>
            </div>
            <span className="text-[12px] text-[#becab9] truncate">Eclipse Adoptium Enterprise Long-Term</span>
            <div className="mt-3 pt-1 border-t border-[#3e4a3d] flex items-center justify-between text-[#889484] font-mono text-[10px]">
              <span>Build: 17.0.17+7</span>
              <span>Previously Active</span>
            </div>
          </label>

          {/* Option 3: Java 11 LTS */}
          <label
            onClick={() => setActiveJdk('jdk-11')}
            className={`relative flex flex-col p-3 rounded-xl cursor-pointer transition-all border ${
              activeJdk === 'jdk-11'
                ? 'bg-[#262a31] border-[#6fdd78] ring-1 ring-[#6fdd78]'
                : 'bg-[#181c22] border-[#3e4a3d] hover:bg-[#262a31]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="active-jdk"
                  value="jdk-11"
                  checked={activeJdk === 'jdk-11'}
                  onChange={() => setActiveJdk('jdk-11')}
                  className="accent-[#6fdd78] w-4 h-4 cursor-pointer"
                />
                <span className="text-[14px] font-bold text-[#dfe2eb]">Java 11.0.22 LTS</span>
              </div>
              <span className="px-1.5 py-0.5 bg-[#31353c] text-[#889484] font-mono text-[10px] rounded font-medium uppercase">
                LEGACY
              </span>
            </div>
            <span className="text-[12px] text-[#becab9] truncate">Oracle Corporation HotSpot VM</span>
            <div className="mt-3 pt-1 border-t border-[#3e4a3d] flex items-center justify-between text-[#889484] font-mono text-[10px]">
              <span>Build: 11.0.22+9</span>
              <span>Compatibility Mode</span>
            </div>
          </label>
        </div>

        {/* Apply & State Bar */}
        <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6fdd78] text-[18px]">verified</span>
            <span className="text-[12px] text-[#dfe2eb]">Current selection matches live Windows Registry values.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRevertToJava17}
              className="h-8 px-3 bg-[#262a31] hover:bg-[#353940] border border-[#3e4a3d] text-[#dfe2eb] rounded text-[12px] transition-colors"
            >
              Revert to Java 17
            </button>
            <button
              onClick={handleApplyChanges}
              disabled={isApplying}
              className="h-8 px-4 bg-[#6fdd78] hover:bg-[#34a547] text-[#00390e] rounded text-[12px] font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <span className={`material-symbols-outlined text-[16px] ${isApplying ? 'animate-spin' : ''}`}>
                {isApplying ? 'refresh' : 'check_circle'}
              </span>
              <span>{isApplying ? 'Broadcasting WM_SETTINGCHANGE...' : 'Apply Version Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Confirmation Banner & Status */}
      {showConfirmation && (
        <div className="bg-[#1c2026] border border-[#3e4a3d] rounded-xl p-3.5 flex flex-col gap-3 shadow-sm animate-in fade-in duration-150">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#34a547] text-[#00320b] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">check</span>
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <h3 className="text-[14px] text-[#6fdd78] font-bold">
                  Java {currentDetails.version} is now the active system version
                </h3>
                <span className="font-mono text-[11px] text-[#889484]">Synchronized 14s ago • Target PID: System</span>
              </div>
              <p className="text-[12px] text-[#becab9] mt-0.5">
                Environment variables were broadcasted via <code className="font-mono text-[#dfe2eb] bg-[#0a0e14] px-1 py-0.2 rounded">SendMessageTimeout(HWND_BROADCAST)</code> across Windows Explorer, PowerShell terminals, and Windows Developer Hub daemons.
              </p>
            </div>
          </div>

          {/* Live Variable Inspection Boxes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 pt-1">
            <div className="bg-[#0a0e14] border border-[#3e4a3d] rounded-lg p-2.5 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#889484] font-bold uppercase tracking-wider">
                  System Environment: JAVA_HOME
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(currentDetails.path, 'jh')}
                    className="hover:text-[#6fdd78] text-[#becab9] p-0.5 rounded transition-colors"
                    title="Copy path"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copiedKey === 'jh' ? 'check' : 'content_copy'}
                    </span>
                  </button>
                  <button className="hover:text-[#6fdd78] text-[#becab9] p-0.5 rounded transition-colors" title="Open in Windows Explorer">
                    <span className="material-symbols-outlined text-[14px]">folder_open</span>
                  </button>
                </div>
              </div>
              <span className="font-mono text-[12px] text-[#dfe2eb] font-medium truncate select-all">
                {currentDetails.path}
              </span>
            </div>

            <div className="bg-[#0a0e14] border border-[#3e4a3d] rounded-lg p-2.5 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#889484] font-bold uppercase tracking-wider">
                  Active PATH Prepend (Priority 1)
                </span>
                <span className="font-mono text-[10px] text-[#6fdd78] flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6fdd78]"></span> OK
                </span>
              </div>
              <span className="font-mono text-[12px] text-[#dfe2eb] font-medium truncate select-all">
                %JAVA_HOME%\bin
              </span>
            </div>

            <div className="bg-[#0a0e14] border border-[#3e4a3d] rounded-lg p-2.5 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#889484] font-bold uppercase tracking-wider">
                  Registry Sync State
                </span>
                <span className="font-mono text-[10px] text-[#becab9]">REG_SZ</span>
              </div>
              <span className="font-mono text-[12px] text-[#aac7ff] truncate font-medium">
                HKCU\Environment\JAVA_HOME
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Installed Versions Table */}
      <div className="bg-[#1c2026] border border-[#3e4a3d] rounded-xl p-4 flex flex-col gap-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-semibold text-[#dfe2eb]">Installed Versions</h2>
            <span className="px-2 py-0.5 bg-[#31353c] text-[#becab9] font-mono text-[11px] rounded">
              3 Runtimes Detected
            </span>
          </div>
          <div className="flex items-center gap-1 text-[12px] text-[#889484]">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>Drag to reorder PATH priority fallbacks</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {/* Header Row */}
          <div className="grid grid-cols-12 px-3 py-1 font-mono text-[11px] text-[#889484] uppercase tracking-wider border-b border-[#3e4a3d]">
            <div className="col-span-4">Runtime &amp; Build</div>
            <div className="col-span-4">Local Directory Path</div>
            <div className="col-span-2 text-center">Status Flags</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Row 1: Java 22.0.2 */}
          <div
            className={`grid grid-cols-12 items-center px-3 py-2 rounded-lg gap-2 transition-colors ${
              activeJdk === 'jdk-22'
                ? 'bg-[#262a31] border border-[#6fdd78]/40'
                : 'bg-[#181c22] border border-[#3e4a3d] hover:bg-[#262a31]'
            }`}
          >
            <div className="col-span-4 flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[#889484] text-[18px] cursor-grab">drag_indicator</span>
              <div className="w-7 h-7 rounded bg-[#0a0e14] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#6fdd78] text-[16px]">verified</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] font-bold text-[#dfe2eb] truncate">Java 22.0.2</span>
                <span className="font-mono text-[11px] text-[#889484] truncate">Temurin OpenJDK-22.0.2+9</span>
              </div>
            </div>

            <div className="col-span-4 flex items-center gap-1 min-w-0 font-mono text-[11px] text-[#becab9] truncate">
              <span className="truncate">C:\Program Files\Java\jdk-22.0.2</span>
              <button
                onClick={() => handleCopy('C:\\Program Files\\Java\\jdk-22.0.2', 'p22')}
                className="hover:text-[#dfe2eb] text-[#889484] ml-auto p-0.5"
                title="Copy path"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copiedKey === 'p22' ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>

            <div className="col-span-2 flex items-center justify-center gap-1">
              <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-[#34a547] text-[#00320b] font-bold uppercase">
                ACTIVE
              </span>
              <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-[#0a0e14] border border-[#3e4a3d] text-[#becab9] uppercase">
                LATEST
              </span>
            </div>

            <div className="col-span-2 flex items-center justify-end gap-1">
              <button
                onClick={() => setActiveJdk('jdk-22')}
                disabled={activeJdk === 'jdk-22'}
                className="h-7 px-2 bg-[#0a0e14] text-[#6fdd78] text-[12px] font-medium rounded flex items-center gap-1 cursor-default"
              >
                <span className="material-symbols-outlined text-[14px]">check</span>
                <span>Active</span>
              </button>
              <button
                onClick={onOpenConflictModal}
                className="h-7 px-2 hover:bg-[#31353c] text-[#dfe2eb] text-[12px] rounded transition-colors"
              >
                Details
              </button>
            </div>
          </div>

          {/* Row 2: Java 17 LTS */}
          <div
            className={`grid grid-cols-12 items-center px-3 py-2 rounded-lg gap-2 transition-colors ${
              activeJdk === 'jdk-17'
                ? 'bg-[#262a31] border border-[#6fdd78]/40'
                : 'bg-[#181c22] border border-[#3e4a3d] hover:bg-[#262a31]'
            }`}
          >
            <div className="col-span-4 flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[#889484] text-[18px] cursor-grab">drag_indicator</span>
              <div className="w-7 h-7 rounded bg-[#0a0e14] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#becab9] text-[16px]">coffee</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] font-bold text-[#dfe2eb] truncate">Java 17.0.17 LTS</span>
                <span className="font-mono text-[11px] text-[#889484] truncate">Eclipse Adoptium Temurin</span>
              </div>
            </div>

            <div className="col-span-4 flex items-center gap-1 min-w-0 font-mono text-[11px] text-[#becab9] truncate">
              <span className="truncate">C:\Program Files\Java\jdk-17.0.17</span>
              <button
                onClick={() => handleCopy('C:\\Program Files\\Java\\jdk-17.0.17', 'p17')}
                className="hover:text-[#dfe2eb] text-[#889484] ml-auto p-0.5"
                title="Copy path"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copiedKey === 'p17' ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>

            <div className="col-span-2 flex items-center justify-center gap-1">
              <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-[#0072e3] text-[#fefcff] font-semibold uppercase">
                LTS
              </span>
              <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-[#0a0e14] border border-[#3e4a3d] text-[#889484] uppercase">
                VERIFIED
              </span>
            </div>

            <div className="col-span-2 flex items-center justify-end gap-1">
              <button
                onClick={() => {
                  setActiveJdk('jdk-17');
                  handleApplyChanges();
                }}
                className="h-7 px-2.5 bg-[#31353c] hover:bg-[#353940] text-[#dfe2eb] text-[12px] font-medium rounded transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                <span>Switch</span>
              </button>
              <button className="h-7 w-7 flex items-center justify-center hover:bg-[#31353c] text-[#becab9] rounded" title="Verify SHA-256 Checksum">
                <span className="material-symbols-outlined text-[15px]">security</span>
              </button>
            </div>
          </div>

          {/* Row 3: Java 11 LTS */}
          <div
            className={`grid grid-cols-12 items-center px-3 py-2 rounded-lg gap-2 transition-colors ${
              activeJdk === 'jdk-11'
                ? 'bg-[#262a31] border border-[#6fdd78]/40'
                : 'bg-[#181c22] border border-[#3e4a3d] hover:bg-[#262a31]'
            }`}
          >
            <div className="col-span-4 flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[#889484] text-[18px] cursor-grab">drag_indicator</span>
              <div className="w-7 h-7 rounded bg-[#0a0e14] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#889484] text-[16px]">history</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] font-bold text-[#dfe2eb] truncate">Java 11.0.22 LTS</span>
                <span className="font-mono text-[11px] text-[#889484] truncate">Oracle HotSpot Legacy</span>
              </div>
            </div>

            <div className="col-span-4 flex items-center gap-1 min-w-0 font-mono text-[11px] text-[#becab9] truncate">
              <span className="truncate">C:\Program Files\Java\jdk-11.0.22</span>
              <button
                onClick={() => handleCopy('C:\\Program Files\\Java\\jdk-11.0.22', 'p11')}
                className="hover:text-[#dfe2eb] text-[#889484] ml-auto p-0.5"
                title="Copy path"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copiedKey === 'p11' ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>

            <div className="col-span-2 flex items-center justify-center gap-1">
              <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-[#0a0e14] border border-[#3e4a3d] text-[#889484] uppercase">
                LTS
              </span>
              <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-[#bd8708] text-[#392600] uppercase font-bold">
                LEGACY
              </span>
            </div>

            <div className="col-span-2 flex items-center justify-end gap-1">
              <button
                onClick={() => {
                  setActiveJdk('jdk-11');
                  handleApplyChanges();
                }}
                className="h-7 px-2.5 bg-[#31353c] hover:bg-[#353940] text-[#dfe2eb] text-[12px] font-medium rounded transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                <span>Switch</span>
              </button>
              <button className="h-7 w-7 flex items-center justify-center hover:bg-[#31353c] text-[#becab9] rounded" title="Verify SHA-256 Checksum">
                <span className="material-symbols-outlined text-[15px]">security</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Split Row: Available in Winget + Mini Verification Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Available in Winget (5 cols) */}
        <div className="lg:col-span-5 bg-[#1c2026] border border-[#3e4a3d] rounded-xl p-3.5 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#aac7ff] text-[18px]">cloud_download</span>
              <h2 className="text-[14px] font-bold text-[#dfe2eb]">Available in Winget &amp; Adoptium</h2>
            </div>
            <span className="font-mono text-[10px] text-[#889484] uppercase">Synced Just Now</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-2.5 bg-[#181c22] border border-[#3e4a3d] rounded-lg">
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-[#dfe2eb]">Java 25</span>
                  <span className="px-1.5 py-0.2 bg-[#31353c] text-[#fabc45] font-mono text-[10px] rounded">
                    EARLY ACCESS
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#889484] truncate">Project Loom &amp; Panama Preview</span>
              </div>
              <button
                onClick={onOpenConflictModal}
                className="h-7 px-3 bg-[#31353c] hover:bg-[#353940] text-[#dfe2eb] text-[12px] font-medium rounded flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
                <span>Install</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#181c22] border border-[#3e4a3d] rounded-lg">
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-[#dfe2eb]">Java 24</span>
                  <span className="px-1.5 py-0.2 bg-[#31353c] text-[#aac7ff] font-mono text-[10px] rounded">
                    FEATURE
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#889484] truncate">Oracle HotSpot GA Builds</span>
              </div>
              <button
                onClick={onOpenConflictModal}
                className="h-7 px-3 bg-[#31353c] hover:bg-[#353940] text-[#dfe2eb] text-[12px] font-medium rounded flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
                <span>Install</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#181c22] border border-[#3e4a3d] rounded-lg">
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-[#dfe2eb]">Java 21 LTS</span>
                  <span className="px-1.5 py-0.2 bg-[#34a547] text-[#00320b] font-mono text-[10px] font-bold rounded">
                    RECOMMENDED
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#889484] truncate">Eclipse Temurin Enterprise LTS</span>
              </div>
              <button
                onClick={onOpenConflictModal}
                className="h-7 px-3 bg-[#34a547] hover:bg-[#6fdd78] text-[#00320b] font-bold text-[12px] rounded flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
                <span>Install</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Embedded Verification Terminal (7 cols) */}
        <div className="lg:col-span-7 bg-[#0a0e14] border border-[#3e4a3d] rounded-xl p-3.5 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center justify-between pb-1 border-b border-[#3e4a3d]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#6fdd78] text-[16px]">terminal</span>
              <span className="text-[14px] font-semibold text-[#dfe2eb]">Live Variable &amp; Shell Verification</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleRunShellTest}
                disabled={shellTesting}
                className="h-6 px-2.5 bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] text-[#becab9] hover:text-[#dfe2eb] font-mono text-[11px] rounded transition-colors flex items-center gap-1"
              >
                <span className={`material-symbols-outlined text-[12px] ${shellTesting ? 'animate-spin' : ''}`}>
                  {shellTesting ? 'sync' : 'play_arrow'}
                </span>
                <span>{shellTesting ? 'Testing...' : 'Run Test'}</span>
              </button>
            </div>
          </div>

          <div className="bg-[#10141a] border border-[#3e4a3d] rounded-lg p-3 font-mono text-[11px] flex flex-col gap-1 text-[#dfe2eb] overflow-x-auto leading-relaxed">
            <div className="flex items-center gap-1.5 text-[#aac7ff] font-medium">
              <span>PS C:\Users\Developer&gt;</span>
              <span className="text-[#dfe2eb]">java -version</span>
            </div>
            <div className="text-[#6fdd78] font-semibold">openjdk version "{currentDetails.version}" 2024-07-16</div>
            <div className="text-[#becab9]">OpenJDK Runtime Environment {currentDetails.build}</div>
            <div className="text-[#becab9]">OpenJDK 64-Bit Server VM {currentDetails.build} (mixed mode, sharing)</div>

            <div className="flex items-center gap-1.5 text-[#aac7ff] font-medium pt-1.5">
              <span>PS C:\Users\Developer&gt;</span>
              <span className="text-[#dfe2eb]">echo $env:JAVA_HOME</span>
            </div>
            <div className="text-[#6fdd78] font-semibold">{currentDetails.path}</div>

            <div className="flex items-center gap-1.5 text-[#aac7ff] font-medium pt-1.5">
              <span>PS C:\Users\Developer&gt;</span>
              <span className="text-[#dfe2eb]">Get-Command java | Select-Object -ExpandProperty Source</span>
            </div>
            <div className="text-[#becab9]">{currentDetails.path}\bin\java.exe</div>

            <div className="flex items-center gap-1.5 pt-1 text-[#889484]">
              <span className="text-[#6fdd78] font-bold">✔</span>
              <span className="text-[11px]">Subsystem verified: PATH parity matches %JAVA_HOME% exactly.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
