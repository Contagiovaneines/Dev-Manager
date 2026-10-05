import React, { useState } from 'react';
import { ScreenType } from '../types';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenTerminal: () => void;
  onStartScan: () => void;
  onOpenConflictModal: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onOpenTerminal,
  onStartScan,
  onOpenConflictModal,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [terminalCollapsed, setTerminalCollapsed] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [doctorNotice, setDoctorNotice] = useState<string | null>(null);

  const handleQuickScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onStartScan();
    }, 600);
  };

  const handleRunDoctor = () => {
    setDoctorNotice('Running Environment Doctor...');
    setTimeout(() => {
      setDoctorNotice('Environment Doctor report: 0 collisions detected, all symlinks healthy.');
      setTimeout(() => setDoctorNotice(null), 4000);
    }, 800);
  };

  const handleBackupPath = () => {
    setDoctorNotice('Exporting PATH variables to C:\\Users\\Developer\\.devenv\\path-backup.xml...');
    setTimeout(() => {
      setDoctorNotice('Backup successful: PATH registry saved safely.');
      setTimeout(() => setDoctorNotice(null), 4000);
    }, 800);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Banner / Breadcrumb & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-[#becab9] font-mono text-[11px] pb-1">
            <span>DEV-WORKSTATION-01</span>
            <span>/</span>
            <span className="text-[#6fdd78] font-medium">OVERVIEW</span>
          </div>
          <h1 className="text-[24px] font-bold text-[#dfe2eb] tracking-tight leading-tight">
            Good morning, Developer
          </h1>
          <p className="text-[13px] text-[#becab9] mt-0.5">
            Manage your development environment, SDKs, and runtime paths from one place.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1c2026] border border-[#3e4a3d] rounded font-mono text-[11px] text-[#becab9]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6fdd78] animate-ping inline-block"></span>
            <span>Last scan: <strong className="text-[#dfe2eb] font-medium">14m ago</strong></span>
          </div>

          <button
            onClick={handleQuickScan}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6fdd78] text-[#00390e] rounded font-semibold text-[12px] hover:bg-[#34a547] transition-all active:scale-95 shadow-sm"
          >
            <span className={`material-symbols-outlined text-[16px] ${isScanning ? 'animate-spin' : ''}`}>
              {isScanning ? 'sync' : 'radar'}
            </span>
            <span>{isScanning ? 'Scanning...' : 'Scan Environment'}</span>
          </button>

          <button
            onClick={() => onNavigate('catalog')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#262a31] hover:bg-[#353940] border border-emerald-500/40 text-emerald-400 rounded text-[12px] font-medium transition-colors shadow-sm"
            title="Explore comprehensive catalog of 30+ technologies"
          >
            <span className="material-symbols-outlined text-emerald-400 text-[16px]">hub</span>
            <span>Tech Catalog</span>
          </button>

          <button
            onClick={() => onNavigate('diagnostics')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#262a31] hover:bg-[#353940] border border-amber-500/40 text-amber-400 rounded text-[12px] font-medium transition-colors shadow-sm"
            title="Inspect system PATH health, variable conflicts, and quick fix"
          >
            <span className="material-symbols-outlined text-amber-400 text-[16px]">troubleshoot</span>
            <span>Diagnostics</span>
          </button>

          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#262a31] hover:bg-[#353940] border border-[#3e4a3d] text-[#dfe2eb] rounded text-[12px] font-medium transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[#aac7ff] text-[16px]">terminal</span>
            <span>Open Terminal (PowerShell)</span>
          </button>
        </div>
      </div>

      {/* Doctor Action Toast Notification */}
      {doctorNotice && (
        <div className="mb-4 p-2.5 bg-[#1c2026] border border-[#6fdd78] text-[#6fdd78] rounded-lg text-[12px] flex items-center gap-2 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-[16px]">info</span>
          <span>{doctorNotice}</span>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 pb-6">
        {/* Card 1: Installed */}
        <div
          onClick={() => onNavigate('installed')}
          className="p-3.5 bg-[#1c2026] border border-[#3e4a3d] rounded-lg flex flex-col justify-between relative overflow-hidden group hover:bg-[#262a31] transition-all cursor-pointer shadow-sm"
        >
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-[#6fdd78]/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-start justify-between">
            <span className="text-[12px] font-medium text-[#becab9]">Installed</span>
            <div className="w-7 h-7 rounded bg-[#31353c] flex items-center justify-center text-[#6fdd78]">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[24px] font-bold text-[#dfe2eb] tracking-tight">12</span>
              <span className="font-mono text-[11px] text-[#6fdd78] font-medium">+2 this week</span>
            </div>
            <p className="text-[12px] text-[#becab9] mt-0.5">Runtimes &amp; SDKs detected</p>
          </div>
          <div className="w-full bg-[#0a0e14] h-1 rounded-full overflow-hidden mt-1">
            <div className="bg-[#6fdd78] h-full rounded-full" style={{ width: '70%' }}></div>
          </div>
        </div>

        {/* Card 2: Updates Available */}
        <div
          onClick={() => onNavigate('updates')}
          className="p-3.5 bg-[#1c2026] border border-[#3e4a3d] rounded-lg flex flex-col justify-between relative overflow-hidden group hover:bg-[#262a31] transition-all cursor-pointer shadow-sm"
        >
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-[#fabc45]/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-start justify-between">
            <span className="text-[12px] font-medium text-[#becab9]">Updates Available</span>
            <div className="w-7 h-7 rounded bg-[#31353c] flex items-center justify-center text-[#fabc45]">
              <span className="material-symbols-outlined text-[18px]">arrow_circle_up</span>
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[24px] font-bold text-[#dfe2eb] tracking-tight">3</span>
              <span className="px-1.5 py-0.5 rounded bg-[#bd8708] text-[#392600] font-mono text-[10px] font-bold uppercase">
                Action needed
              </span>
            </div>
            <p className="text-[12px] text-[#becab9] mt-0.5 truncate">Java, Node.js, Flutter</p>
          </div>
          <div className="w-full bg-[#0a0e14] h-1 rounded-full overflow-hidden mt-1">
            <div className="bg-[#fabc45] h-full rounded-full" style={{ width: '25%' }}></div>
          </div>
        </div>

        {/* Card 3: Missing Runtimes */}
        <div
          onClick={() => onNavigate('languages')}
          className="p-3.5 bg-[#1c2026] border border-[#3e4a3d] rounded-lg flex flex-col justify-between relative overflow-hidden group hover:bg-[#262a31] transition-all cursor-pointer shadow-sm"
        >
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-[#ffb4ab]/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-start justify-between">
            <span className="text-[12px] font-medium text-[#becab9]">Missing Runtimes</span>
            <div className="w-7 h-7 rounded bg-[#31353c] flex items-center justify-center text-[#ffb4ab]">
              <span className="material-symbols-outlined text-[18px]">error</span>
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[24px] font-bold text-[#dfe2eb] tracking-tight">5</span>
              <span className="font-mono text-[11px] text-[#889484]">recommended</span>
            </div>
            <p className="text-[12px] text-[#becab9] mt-0.5 truncate">Python, Go, Rust, Ruby, Docker</p>
          </div>
          <div className="w-full bg-[#0a0e14] h-1 rounded-full overflow-hidden mt-1">
            <div className="bg-[#ffb4ab] h-full rounded-full" style={{ width: '40%' }}></div>
          </div>
        </div>

        {/* Card 4: Active Versions */}
        <div
          onClick={() => onNavigate('jdk-details')}
          className="p-3.5 bg-[#1c2026] border border-[#3e4a3d] rounded-lg flex flex-col justify-between relative overflow-hidden group hover:bg-[#262a31] transition-all cursor-pointer shadow-sm"
        >
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-[#aac7ff]/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-start justify-between">
            <span className="text-[12px] font-medium text-[#becab9]">Active Versions</span>
            <div className="w-7 h-7 rounded bg-[#31353c] flex items-center justify-center text-[#aac7ff]">
              <span className="material-symbols-outlined text-[18px]">done_all</span>
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[24px] font-bold text-[#dfe2eb] tracking-tight">8</span>
              <span className="font-mono text-[11px] text-[#aac7ff]">Ready to run</span>
            </div>
            <p className="text-[12px] text-[#becab9] mt-0.5">Configured in Windows PATH</p>
          </div>
          <div className="w-full bg-[#0a0e14] h-1 rounded-full overflow-hidden mt-1">
            <div className="bg-[#aac7ff] h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Your Environment Header & Toolchains */}
      <div className="flex flex-col gap-3 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-semibold text-[#dfe2eb]">Your Environment</h2>
            <span className="px-2 py-0.5 rounded bg-[#1c2026] border border-[#3e4a3d] text-[#becab9] font-mono text-[11px]">
              5 Core Toolchains
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#becab9] font-mono text-[11px]">
            <span className="material-symbols-outlined text-[15px]">filter_list</span>
            <span>Filtered: All Runtimes</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {/* Item 1: Java JDK */}
          <div className="p-3.5 bg-[#1c2026] border border-[#3e4a3d] rounded-lg flex flex-col justify-between hover:bg-[#262a31] transition-all shadow-sm">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded bg-[#31353c] flex items-center justify-center text-[#ff6f00] shrink-0">
                    <span className="material-symbols-outlined text-[22px]">coffee</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[14px] font-semibold text-[#dfe2eb] truncate">Java Development Kit</h3>
                    <span className="font-mono text-[11px] text-[#889484]">Temurin &amp; Oracle JDK</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#31353c] text-[#becab9] font-mono text-[10px] font-bold shrink-0 uppercase">
                  2 Versions
                </span>
              </div>

              <div className="mt-3 p-2.5 bg-[#0a0e14] border border-[#3e4a3d] rounded flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#becab9]">Active Runtime:</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#34a547] text-[#00320b] font-mono text-[10px] flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6fdd78]"></span> ACTIVE
                  </span>
                </div>
                <div className="font-mono text-[12px] text-[#dfe2eb] font-semibold">Java 17 (17.0.17 LTS)</div>
                <div className="flex items-center gap-1.5 text-[#889484] font-mono text-[11px] pt-0.5">
                  <span className="material-symbols-outlined text-[14px]">folder</span>
                  <span className="truncate">C:\Program Files\Java\jdk-17</span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center gap-1.5 text-[#becab9] font-mono text-[11px]">
                <span className="text-[#889484]">Detected:</span>
                <span className="px-1.5 py-0.2 bg-[#262a31] border border-[#3e4a3d] rounded text-[#dfe2eb]">17.0.17 (LTS)</span>
                <span className="px-1.5 py-0.2 bg-[#31353c] rounded text-[#889484]">22.0.2</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#3e4a3d] flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-[#889484]">JAVA_HOME mapped</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenConflictModal}
                  className="px-2 py-1 bg-[#181c22] hover:bg-[#31353c] text-[#fabc45] border border-[#3e4a3d] rounded text-[11px] font-medium transition-colors"
                  title="Test version conflict resolution dialog"
                >
                  Install/Conflict
                </button>
                <button
                  onClick={() => onNavigate('jdk-details')}
                  className="px-3 py-1 bg-[#262a31] hover:bg-[#353940] text-[#dfe2eb] rounded text-[12px] font-medium transition-colors flex items-center gap-1"
                >
                  <span>Manage</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Item 2: Node.js */}
          <div className="p-3.5 bg-[#1c2026] border border-[#3e4a3d] rounded-lg flex flex-col justify-between hover:bg-[#262a31] transition-all shadow-sm">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded bg-[#31353c] flex items-center justify-center text-[#68a063] shrink-0">
                    <span className="material-symbols-outlined text-[22px]">hexagon</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[14px] font-semibold text-[#dfe2eb] truncate">Node.js Runtime</h3>
                    <span className="font-mono text-[11px] text-[#889484]">V8 JavaScript Engine</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#34a547] text-[#00320b] font-mono text-[10px] font-bold shrink-0 uppercase">
                  Installed
                </span>
              </div>

              <div className="mt-3 p-2.5 bg-[#0a0e14] border border-[#3e4a3d] rounded flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#becab9]">Active Runtime:</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#34a547] text-[#00320b] font-mono text-[10px] flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6fdd78]"></span> ACTIVE
                  </span>
                </div>
                <div className="font-mono text-[12px] text-[#dfe2eb] font-semibold">22.17.1 (Current)</div>
                <div className="flex items-center gap-1.5 text-[#889484] font-mono text-[11px] pt-0.5">
                  <span className="material-symbols-outlined text-[14px]">folder</span>
                  <span className="truncate">C:\Program Files\nodejs</span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center gap-1.5 px-2 py-1 bg-[#31353c] rounded text-[#fabc45] font-mono text-[11px]">
                <span className="material-symbols-outlined text-[14px]">upgrade</span>
                <span className="truncate">Update to 22.17.2 available</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#3e4a3d] flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-[#889484]">npm v10.8.2 included</span>
              <button
                onClick={() => onNavigate('languages')}
                className="px-3 py-1 bg-[#262a31] hover:bg-[#353940] text-[#dfe2eb] rounded text-[12px] font-medium transition-colors flex items-center gap-1"
              >
                <span>Manage</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Item 3: Python */}
          <div className="p-3.5 bg-[#1c2026] border border-[#3e4a3d] rounded-lg flex flex-col justify-between hover:bg-[#262a31] transition-all shadow-sm">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded bg-[#31353c] flex items-center justify-center text-[#ffbc2b] shrink-0">
                    <span className="material-symbols-outlined text-[22px]">terminal</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[14px] font-semibold text-[#dfe2eb] truncate">Python</h3>
                    <span className="font-mono text-[11px] text-[#889484]">CPython Interpreter</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#0a0e14] border border-[#3e4a3d] text-[#889484] font-mono text-[10px] font-bold shrink-0 uppercase">
                  Not Installed
                </span>
              </div>

              <div className="mt-3 p-2.5 bg-[#0a0e14] border border-[#3e4a3d] rounded flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[#ffb4ab] text-[12px]">
                  <span className="material-symbols-outlined text-[15px]">info</span>
                  <span>Not found in system PATH</span>
                </div>
                <p className="text-[12px] text-[#becab9]">Recommended: Python 3.12 (64-bit)</p>
                <div className="font-mono text-[11px] text-[#889484] pt-0.5">Will configure pip, venv, py launcher</div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#3e4a3d] flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-[#889484]">Fast setup available</span>
              <button
                onClick={() => onNavigate('languages')}
                className="px-3 py-1 bg-[#6fdd78] hover:bg-[#34a547] text-[#00390e] rounded text-[12px] font-semibold transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
                <span>Install Python</span>
              </button>
            </div>
          </div>

          {/* Item 4: Flutter SDK */}
          <div className="p-3.5 bg-[#1c2026] border border-[#3e4a3d] rounded-lg flex flex-col justify-between hover:bg-[#262a31] transition-all shadow-sm">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded bg-[#31353c] flex items-center justify-center text-[#aac7ff] shrink-0">
                    <span className="material-symbols-outlined text-[22px]">flight_takeoff</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[14px] font-semibold text-[#dfe2eb] truncate">Flutter SDK</h3>
                    <span className="font-mono text-[11px] text-[#889484]">Cross-Platform UI Toolchain</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#34a547] text-[#00320b] font-mono text-[10px] font-bold shrink-0 uppercase">
                  Installed
                </span>
              </div>

              <div className="mt-3 p-2.5 bg-[#0a0e14] border border-[#3e4a3d] rounded flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#becab9]">Active Channel:</span>
                  <span className="font-mono text-[11px] text-[#aac7ff] font-medium">channel stable</span>
                </div>
                <div className="font-mono text-[12px] text-[#dfe2eb] font-semibold">3.35.0</div>
                <div className="font-mono text-[11px] text-[#889484] pt-0.5 truncate">Dart 3.5.0 included | Android toolchain ready</div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#3e4a3d] flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-[#889484]">C:\src\flutter\bin</span>
              <button
                onClick={() => onNavigate('languages')}
                className="px-3 py-1 bg-[#262a31] hover:bg-[#353940] text-[#dfe2eb] rounded text-[12px] font-medium transition-colors flex items-center gap-1"
              >
                <span>Manage</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Item 5: Git for Windows */}
          <div className="p-3.5 bg-[#1c2026] border border-[#3e4a3d] rounded-lg flex flex-col justify-between hover:bg-[#262a31] transition-all shadow-sm">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded bg-[#31353c] flex items-center justify-center text-[#dfe2eb] shrink-0">
                    <span className="material-symbols-outlined text-[22px]">source</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[14px] font-semibold text-[#dfe2eb] truncate">Git for Windows</h3>
                    <span className="font-mono text-[11px] text-[#889484]">Distributed Version Control</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#34a547] text-[#00320b] font-mono text-[10px] font-bold shrink-0 uppercase">
                  Installed
                </span>
              </div>

              <div className="mt-3 p-2.5 bg-[#0a0e14] border border-[#3e4a3d] rounded flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#becab9]">Version:</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#34a547] text-[#00320b] font-mono text-[10px] flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6fdd78]"></span> ACTIVE
                  </span>
                </div>
                <div className="font-mono text-[12px] text-[#dfe2eb] font-semibold">2.44.0.windows.1</div>
                <div className="font-mono text-[11px] text-[#889484] pt-0.5 truncate">Credential Manager: wincred</div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#3e4a3d] flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-[#889484]">SSH configured</span>
              <button
                onClick={() => onNavigate('languages')}
                className="px-3 py-1 bg-[#262a31] hover:bg-[#353940] text-[#dfe2eb] rounded text-[12px] font-medium transition-colors flex items-center gap-1"
              >
                <span>Manage</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="p-3.5 bg-[#181c22] border border-[#3e4a3d] rounded-lg flex flex-col justify-between hover:bg-[#1c2026] transition-colors shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#becab9]">Quick Actions</span>
                <span className="material-symbols-outlined text-[#889484] text-[16px]">tune</span>
              </div>
              <p className="text-[12px] text-[#889484] mt-1">One-click environment diagnostics &amp; variable repair</p>

              <div className="mt-2.5 flex flex-col gap-1.5">
                <button
                  onClick={handleRunDoctor}
                  className="w-full text-left px-2.5 py-1.5 rounded bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#6fdd78] text-[15px]">medical_services</span>
                    <span className="text-[12px] font-medium text-[#dfe2eb]">Run Environment Doctor</span>
                  </div>
                  <span className="material-symbols-outlined text-[#889484] text-[14px]">chevron_right</span>
                </button>

                <button
                  onClick={handleBackupPath}
                  className="w-full text-left px-2.5 py-1.5 rounded bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#aac7ff] text-[15px]">save</span>
                    <span className="text-[12px] font-medium text-[#dfe2eb]">Backup PATH Registry</span>
                  </div>
                  <span className="material-symbols-outlined text-[#889484] text-[14px]">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#3e4a3d] flex items-center justify-between font-mono text-[11px] text-[#889484]">
              <span>UAC: Elevated</span>
              <span className="text-[#6fdd78] font-medium">Session: Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Terminal Output Widget inside Dashboard */}
      <div className="w-full bg-[#181c22] border border-[#3e4a3d] rounded-lg overflow-hidden flex flex-col shadow-sm mb-4">
        <div className="h-9 px-3 bg-[#1c2026] border-b border-[#3e4a3d] flex items-center justify-between select-none">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setTerminalCollapsed(!terminalCollapsed)}
              className="flex items-center gap-1 text-[#dfe2eb] hover:text-[#6fdd78] transition-colors focus:outline-none"
            >
              <span
                className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                  terminalCollapsed ? '-rotate-90' : 'rotate-0'
                }`}
              >
                expand_more
              </span>
              <span className="text-[12px] font-semibold">Terminal Output (PowerShell 7.4.1)</span>
            </button>
            <span className="w-1.5 h-1.5 rounded-full bg-[#6fdd78] inline-block animate-pulse"></span>
            <span className="font-mono text-[11px] text-[#889484] hidden sm:inline">Execution Log</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors flex items-center gap-1 ${
                autoScroll
                  ? 'bg-[#31353c] text-[#6fdd78]'
                  : 'bg-[#181c22] text-[#889484]'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">
                {autoScroll ? 'vertical_align_bottom' : 'pause'}
              </span>
              <span>Auto-scroll {autoScroll ? 'ON' : 'OFF'}</span>
            </button>
            <button
              onClick={() => {}}
              className="px-2 py-0.5 rounded bg-[#31353c] text-[#becab9] hover:text-[#dfe2eb] text-[11px] font-mono transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[13px]">clear_all</span>
              <span>Clear</span>
            </button>
          </div>
        </div>

        {!terminalCollapsed && (
          <div className="p-3 bg-[#0a0e14] font-mono text-[12px] text-[#dfe2eb] flex flex-col gap-1 overflow-y-auto max-h-52 leading-relaxed select-text">
            <div className="flex items-center gap-2">
              <span className="text-[#aac7ff] font-semibold">PS C:\Users\Developer&gt;</span>
              <span className="text-[#dfe2eb]">java -version</span>
            </div>
            <div className="text-[#889484] pl-4">openjdk version "17.0.17" 2024-10-15</div>
            <div className="text-[#889484] pl-4">OpenJDK Runtime Environment Temurin-17.0.17+7 (build 17.0.17+7)</div>
            <div className="text-[#889484] pl-4">OpenJDK 64-Bit Server VM Temurin-17.0.17+7 (build 17.0.17+7, mixed mode, sharing)</div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[#aac7ff] font-semibold">PS C:\Users\Developer&gt;</span>
              <span className="text-[#dfe2eb]">node --version</span>
            </div>
            <div className="text-[#889484] pl-4">v22.17.1</div>

            <div className="flex items-center gap-1.5 mt-1 text-[#6fdd78]">
              <span className="material-symbols-outlined text-[15px]">check_circle</span>
              <span>System PATH verified: All active binaries mapped to environment variables.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
