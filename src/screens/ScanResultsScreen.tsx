import React, { useState } from 'react';
import { ScreenType } from '../types';

interface ScanResultsScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onRescan: () => void;
  onOpenConflictModal: () => void;
}

export const ScanResultsScreen: React.FC<ScanResultsScreenProps> = ({
  onNavigate,
  onRescan,
  onOpenConflictModal,
}) => {
  const [copiedLog, setCopiedLog] = useState(false);
  const [fixedItems, setFixedItems] = useState<string[]>([]);
  const [logCleared, setLogCleared] = useState(false);

  const handleExportJson = () => {
    const reportData = {
      scanId: 'win-scan-8492',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      checksum: 'sha256:8f4c2091b0ae4219a1',
      healthyTargets: 12,
      updatesAvailable: 3,
      missingTargets: 5,
      parity: '100%',
      environment: 'Windows 11 Pro 64-bit (Build 22631.3593)',
      pathEntries: { user: 24, system: 18, orphans: 0 },
      toolchains: [
        { name: 'Java JDK', version: '17.0.17 LTS', path: 'C:\\Program Files\\Java\\jdk-17' },
        { name: 'Node.js', version: '22.17.1', path: 'C:\\Program Files\\nodejs' },
        { name: 'Git', version: '2.44.0.windows.1', path: 'C:\\Program Files\\Git\\cmd' },
        { name: 'Flutter', version: '3.35.0', path: 'C:\\src\\flutter\\bin' },
        { name: 'Docker', version: '26.1.1', status: 'WSL2 Backend active' },
        { name: 'Rust', version: '1.77.2', path: 'C:\\Users\\Developer\\.cargo\\bin' },
        { name: '.NET', version: '8.0.204 LTS', path: 'C:\\Program Files\\dotnet' },
      ],
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dev-environment-scan-results.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyLog = () => {
    const text = `PS C:\\Users\\Developer> # Initializing system hardware & toolchain diagnostics
PS C:\\Users\\Developer> Test-Path $env:JAVA_HOME
True
PS C:\\Users\\Developer> git --version
git version 2.44.0.windows.1
PS C:\\Users\\Developer> fnm current
v22.17.1
PS C:\\Users\\Developer> wsl -l -v
  NAME            STATE           VERSION
* Ubuntu-22.04    Running         2
PS C:\\Users\\Developer> rustc --version
rustc 1.77.2 (25ef9e3d8 2024-04-09)
PS C:\\Users\\Developer> Test-Path (Get-Command python -ErrorAction SilentlyContinue)
False
[SUCCESS] 25 of 25 targets inspected in 8.42s with zero registry lock conflicts.`;
    navigator.clipboard?.writeText(text);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  const handleQuickFix = (fixId: string) => {
    if (!fixedItems.includes(fixId)) {
      setFixedItems([...fixedItems, fixId]);
    }
  };

  return (
    <div className="flex flex-col w-full select-none">
      {/* Top Navigation & Diagnostic Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#becab9]">
          <button onClick={() => onNavigate('dashboard')} className="hover:text-[#dfe2eb] transition-colors">
            Environments
          </button>
          <span>/</span>
          <span>Diagnostics</span>
          <span>/</span>
          <span className="text-[#6fdd78] font-medium">Scan Results</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] bg-[#1c2026] border border-[#3e4a3d] px-2.5 py-1 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6fdd78] inline-block"></span>
          <span className="text-[#becab9]">Completed just now</span>
          <span className="text-[#889484]">·</span>
          <span className="text-[#dfe2eb]">00:08.4s duration</span>
          <span className="text-[#889484]">·</span>
          <span className="text-[#dfe2eb]">25 targets analyzed</span>
          <span className="text-[#889484]">·</span>
          <span className="text-[#6fdd78] font-medium">0 errors</span>
        </div>
      </div>

      {/* Hero Scan Status Banner */}
      <div className="bg-[#181c22] border border-[#3e4a3d] p-4 rounded-xl mb-4 relative overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#6fdd78]/15 border border-[#6fdd78]/40 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#6fdd78] text-[26px]">check_circle</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6fdd78] bg-[#6fdd78]/15 px-2 py-0.5 rounded">
                  Scan Completed Successfully
                </span>
                <span className="font-mono text-[11px] text-[#889484]">SHA256: 8f4c...91b0</span>
              </div>
              <h1 className="text-[22px] font-bold text-[#dfe2eb] tracking-tight">Environment scan completed</h1>
              <p className="text-[13px] text-[#becab9] mt-0.5">
                All installed runtimes, compilers, package manager shims, and Windows registry variables were indexed and validated.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 h-8 bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] text-[#dfe2eb] text-[12px] font-medium rounded transition-colors shadow-sm"
              title="Download diagnostic report as JSON"
            >
              <span className="material-symbols-outlined text-[16px] text-[#becab9]">ios_share</span>
              <span>Export Report</span>
            </button>

            <button
              onClick={() => handleQuickFix('all')}
              className="flex items-center gap-1.5 px-3 h-8 bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] text-[#dfe2eb] text-[12px] font-medium rounded transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] text-[#fabc45]">bolt</span>
              <span>{fixedItems.length > 0 ? 'Fix Applied' : 'Run Quick Fix (2)'}</span>
            </button>

            <button
              onClick={onRescan}
              className="flex items-center gap-1.5 px-3 h-8 bg-[#6fdd78] hover:bg-[#34a547] text-[#00390e] text-[12px] font-bold rounded transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Rescan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Card 1 */}
        <div className="bg-[#181c22] border border-[#3e4a3d] p-3 rounded-lg flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[10px] text-[#889484] uppercase">VERIFIED RUNTIMES</span>
              <span className="w-2 h-2 rounded-full bg-[#6fdd78]"></span>
            </div>
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-[24px] font-bold text-[#dfe2eb]">12</span>
              <span className="font-mono text-[11px] text-[#6fdd78]">Healthy in PATH</span>
            </div>
            <p className="text-[12px] text-[#becab9]">Java, Node, Git, Rust, .NET 8, MSVC &amp; WSL2 validated.</p>
          </div>
          <div className="mt-3 pt-1 border-t border-[#3e4a3d] flex items-center justify-between font-mono text-[11px]">
            <span className="text-[#6fdd78] font-medium">100% executable</span>
            <span className="material-symbols-outlined text-[14px] text-[#889484]">verified</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#181c22] border border-[#3e4a3d] p-3 rounded-lg flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[10px] text-[#889484] uppercase">UPGRADES READY</span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#bd8708]/30 text-[#fabc45] rounded font-bold">
                ACTION RECOMMENDED
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-[24px] font-bold text-[#fabc45]">3</span>
              <span className="font-mono text-[11px] text-[#fabc45]">Available</span>
            </div>
            <p className="text-[12px] text-[#becab9]">Node.js 22.17.2, Java 22.0.2 &amp; Flutter 3.35.1 pending.</p>
          </div>
          <div className="mt-3 pt-1 border-t border-[#3e4a3d] flex items-center justify-between text-[12px]">
            <button onClick={() => onNavigate('languages')} className="text-[#fabc45] hover:underline flex items-center gap-1">
              <span>View Updates</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
            <span className="font-mono text-[11px] text-[#889484]">1 minor patch</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#181c22] border border-[#3e4a3d] p-3 rounded-lg flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[10px] text-[#889484] uppercase">UNINSTALLED TARGETS</span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#262a31] text-[#becab9] rounded">5 OPTIONAL</span>
            </div>
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-[24px] font-bold text-[#dfe2eb]">5</span>
              <span className="font-mono text-[11px] text-[#889484]">Not in PATH</span>
            </div>
            <p className="text-[12px] text-[#becab9]">Python 3.12, Go 1.22, PHP 8.3, Ruby 3.3, Kotlin not detected.</p>
          </div>
          <div className="mt-3 pt-1 border-t border-[#3e4a3d] flex items-center justify-between text-[12px]">
            <button onClick={() => onNavigate('languages')} className="text-[#aac7ff] hover:underline flex items-center gap-1">
              <span>Install Stacks</span>
              <span className="material-symbols-outlined text-[14px]">add</span>
            </button>
            <span className="font-mono text-[11px] text-[#889484]">Winget catalog</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#181c22] border border-[#3e4a3d] p-3 rounded-lg flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[10px] text-[#889484] uppercase">ENVIRONMENT PARITY</span>
              <span className="w-2 h-2 rounded-full bg-[#6fdd78]"></span>
            </div>
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-[24px] font-bold text-[#dfe2eb]">42</span>
              <span className="font-mono text-[11px] text-[#6fdd78]">Keys Synced</span>
            </div>
            <p className="text-[12px] text-[#becab9]">User PATH (24 entries, 0 broken). System PATH (18 entries).</p>
          </div>
          <div className="mt-3 pt-1 border-t border-[#3e4a3d] flex items-center justify-between font-mono text-[11px] text-[#becab9]">
            <span className="text-[#dfe2eb]">0 registry conflicts</span>
            <span className="material-symbols-outlined text-[14px] text-[#6fdd78]">sync_saved_locally</span>
          </div>
        </div>
      </div>

      {/* Dual Column Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-4">
        {/* Left Column (7 cols): Detected Toolchains + Action Items */}
        <div className="xl:col-span-7 flex flex-col gap-4 min-w-0">
          {/* Detected Toolchains */}
          <div className="bg-[#181c22] border border-[#3e4a3d] rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6fdd78] text-[20px]">view_in_ar</span>
                <h2 className="text-[14px] font-semibold text-[#dfe2eb]">Detected Toolchains &amp; Runtimes (12)</h2>
              </div>
              <span className="font-mono text-[11px] text-[#889484]">Sorted by PATH priority</span>
            </div>

            <div className="flex flex-col gap-2">
              {/* Java */}
              <div className="p-2.5 bg-[#1c2026] border border-[#3e4a3d] rounded-lg">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#0a0e14] flex items-center justify-center font-mono text-[#6fdd78] font-bold text-[11px]">
                      J
                    </div>
                    <span className="text-[13px] font-semibold text-[#dfe2eb]">Java Development Kit</span>
                    <span className="font-mono text-[11px] text-[#becab9]">OpenJDK 17.0.17 LTS (Temurin)</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-[#6fdd78]/20 text-[#6fdd78] font-bold">
                    HEALTHY
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-y-1 font-mono text-[11px] text-[#becab9] pl-8">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[#889484]">JAVA_HOME:</span>
                    <code className="text-[#dfe2eb]">C:\Program Files\Java\jdk-17</code>
                    <span className="material-symbols-outlined text-[14px] text-[#6fdd78]">check</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-[#fabc45]">v22.0.2 ready to switch</span>
                    <button onClick={() => onNavigate('jdk-details')} className="text-[#aac7ff] hover:underline">
                      Manage
                    </button>
                  </div>
                </div>
              </div>

              {/* Node.js */}
              <div className="p-2.5 bg-[#1c2026] border border-[#3e4a3d] rounded-lg">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#0a0e14] flex items-center justify-center font-mono text-[#6fdd78] font-bold text-[11px]">
                      JS
                    </div>
                    <span className="text-[13px] font-semibold text-[#dfe2eb]">Node.js Runtime</span>
                    <span className="font-mono text-[11px] text-[#becab9]">v22.17.1 (managed via fnm)</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-[#bd8708]/30 text-[#fabc45] font-bold">
                    UPDATE PENDING
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-y-1 font-mono text-[11px] text-[#becab9] pl-8">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[#889484]">npm:</span> <span className="text-[#dfe2eb]">v10.8.2</span>
                    <span className="text-[#889484]">· pnpm:</span> <span className="text-[#dfe2eb]">9.15.0</span>
                    <span className="text-[#889484]">· corepack:</span> <span className="text-[#6fdd78]">active</span>
                  </div>
                  <button onClick={() => handleQuickFix('node')} className="text-[#fabc45] hover:underline flex items-center gap-1">
                    <span>{fixedItems.includes('node') ? 'Updated to 22.17.2' : 'Update to 22.17.2'}</span>
                    <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                  </button>
                </div>
              </div>

              {/* Git */}
              <div className="p-2.5 bg-[#1c2026] border border-[#3e4a3d] rounded-lg">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#0a0e14] flex items-center justify-center font-mono text-[#6fdd78] font-bold text-[11px]">
                      G
                    </div>
                    <span className="text-[13px] font-semibold text-[#dfe2eb]">Git for Windows</span>
                    <span className="font-mono text-[11px] text-[#becab9]">v2.44.0.windows.1</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-[#6fdd78]/20 text-[#6fdd78] font-bold">
                    HEALTHY
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-y-1 font-mono text-[11px] text-[#becab9] pl-8">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[#889484]">Credential Helper:</span>
                    <code className="text-[#dfe2eb]">wincred</code>
                    <span className="text-[#889484]">· LF config:</span> <span className="text-[#dfe2eb]">core.autocrlf=input</span>
                  </div>
                  <span className="text-[#889484]">C:\Program Files\Git\cmd</span>
                </div>
              </div>

              {/* Flutter */}
              <div className="p-2.5 bg-[#1c2026] border border-[#3e4a3d] rounded-lg">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#0a0e14] flex items-center justify-center font-mono text-[#6fdd78] font-bold text-[11px]">
                      F
                    </div>
                    <span className="text-[13px] font-semibold text-[#dfe2eb]">Flutter &amp; Dart SDK</span>
                    <span className="font-mono text-[11px] text-[#becab9]">v3.35.0 (stable) · Dart 3.5.0</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-[#6fdd78]/20 text-[#6fdd78] font-bold">
                    HEALTHY
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-y-1 font-mono text-[11px] text-[#becab9] pl-8">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[#889484]">Android Toolchain:</span>
                    <span className="text-[#6fdd78] font-medium">Valid (API 34)</span>
                    <span className="text-[#889484]">· Chrome:</span> <span className="text-[#dfe2eb]">Available</span>
                  </div>
                  <span className="text-[#889484]">C:\src\flutter\bin</span>
                </div>
              </div>

              {/* Docker */}
              <div className="p-2.5 bg-[#1c2026] border border-[#3e4a3d] rounded-lg">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#0a0e14] flex items-center justify-center font-mono text-[#6fdd78] font-bold text-[11px]">
                      D
                    </div>
                    <span className="text-[13px] font-semibold text-[#dfe2eb]">Docker Engine &amp; CLI</span>
                    <span className="font-mono text-[11px] text-[#becab9]">v26.1.1 (WSL2 Backend)</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-[#6fdd78]/20 text-[#6fdd78] font-bold">
                    HEALTHY
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-y-1 font-mono text-[11px] text-[#becab9] pl-8">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[#889484]">WSL Default:</span>
                    <span className="text-[#dfe2eb] font-medium">Ubuntu-22.04</span>
                    <span className="text-[#889484]">· Named Pipe:</span> <code className="text-[11px] text-[#dfe2eb]">docker_engine</code>
                  </div>
                  <span className="text-[#6fdd78] font-medium">Daemon listening</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Items & Suggested Fixes */}
          <div className="bg-[#181c22] border border-[#3e4a3d] rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#fabc45] text-[20px]">tips_and_updates</span>
                <h2 className="text-[14px] font-semibold text-[#dfe2eb]">Action Items &amp; Suggested Fixes</h2>
              </div>
              <span className="font-mono text-[11px] text-[#fabc45] font-medium">3 recommended</span>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-[#1c2026] border border-[#3e4a3d] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded bg-[#262a31] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[#fabc45] text-[18px]">warning</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-[#dfe2eb]">Python runtime is missing from PATH</div>
                    <div className="text-[12px] text-[#becab9]">Windows Store execution alias disabled. No global Python 3 interpreter found.</div>
                  </div>
                </div>
                <button
                  onClick={() => handleQuickFix('python')}
                  className="shrink-0 h-7 px-3 bg-[#262a31] hover:bg-[#353940] border border-[#3e4a3d] text-[#dfe2eb] font-mono text-[11px] rounded transition-colors flex items-center gap-1 self-start sm:self-auto"
                >
                  <span className="material-symbols-outlined text-[14px]">download</span>
                  <span>{fixedItems.includes('python') ? 'Installed' : 'Install Python 3.12 (Winget)'}</span>
                </button>
              </div>

              <div className="p-3 bg-[#1c2026] border border-[#3e4a3d] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded bg-[#262a31] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[#fabc45] text-[18px]">upgrade</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-[#dfe2eb]">Node.js update available (22.17.1 → 22.17.2)</div>
                    <div className="text-[12px] text-[#becab9]">Addresses minor OpenSSL security patch. Readily swappable with fnm.</div>
                  </div>
                </div>
                <button
                  onClick={() => handleQuickFix('node')}
                  className="shrink-0 h-7 px-3 bg-[#6fdd78] hover:bg-[#34a547] text-[#00390e] font-mono text-[11px] rounded font-bold transition-colors flex items-center gap-1 self-start sm:self-auto"
                >
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  <span>{fixedItems.includes('node') ? 'Updated' : 'Update via fnm'}</span>
                </button>
              </div>

              <div className="p-3 bg-[#1c2026] border border-[#3e4a3d] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded bg-[#262a31] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[#889484] text-[18px]">tune</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-[#dfe2eb]">GOPATH environment variable not mapped</div>
                    <div className="text-[12px] text-[#becab9]">
                      Recommended: create <code className="text-[#dfe2eb] bg-[#0a0e14] px-1 py-0.2 rounded">%USERPROFILE%\go</code> for local packages and tooling bin directory.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleQuickFix('gopath')}
                  className="shrink-0 h-7 px-3 bg-[#262a31] hover:bg-[#353940] border border-[#3e4a3d] text-[#dfe2eb] font-mono text-[11px] rounded transition-colors flex items-center gap-1 self-start sm:self-auto"
                >
                  <span className="material-symbols-outlined text-[14px]">add_link</span>
                  <span>{fixedItems.includes('gopath') ? 'Configured' : 'Configure GOPATH'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): System Audit & Terminal */}
        <div className="xl:col-span-5 flex flex-col gap-4 min-w-0">
          {/* Registry Audit Card */}
          <div className="bg-[#181c22] border border-[#3e4a3d] rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6fdd78] text-[20px]">verified_user</span>
                <h2 className="text-[14px] font-semibold text-[#dfe2eb]">System Audit &amp; Registry Parity</h2>
              </div>
              <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#6fdd78]/15 text-[#6fdd78] rounded font-bold">
                OPTIMIZED
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between p-2 bg-[#1c2026] border border-[#3e4a3d] rounded">
                <span className="text-[#becab9]">Windows Platform</span>
                <span className="text-[#dfe2eb] font-medium">Win 11 Pro 64-bit (Build 22631)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#1c2026] border border-[#3e4a3d] rounded">
                <span className="text-[#becab9]">Execution Policy</span>
                <span className="text-[#6fdd78] font-medium">RemoteSigned (Process &amp; User)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#1c2026] border border-[#3e4a3d] rounded">
                <span className="text-[#becab9]">Registry Key Alignment</span>
                <span className="text-[#dfe2eb] font-medium">42 vars mapped (HKCU &amp; HKLM match)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#1c2026] border border-[#3e4a3d] rounded">
                <span className="text-[#becab9]">Winget Source Catalog</span>
                <span className="text-[#dfe2eb] font-medium">Indexed 14m ago (msstore, winget)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#1c2026] border border-[#3e4a3d] rounded">
                <span className="text-[#becab9]">Long Path Support</span>
                <span className="text-[#6fdd78] font-medium">Enabled (LongPathsEnabled = 1)</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#3e4a3d] flex flex-col gap-2">
              <div>
                <div className="flex justify-between font-mono text-[11px] mb-1 text-[#becab9]">
                  <span>Environment PATH Buffer Utilization</span>
                  <span className="text-[#dfe2eb]">1,482 / 2,048 chars (72%)</span>
                </div>
                <div className="w-full h-1.5 bg-[#0a0e14] rounded-full overflow-hidden">
                  <div className="h-full bg-[#6fdd78]" style={{ width: '72%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono text-[11px] mb-1 text-[#becab9]">
                  <span>Developer Drive Indexation (DevDrive V:)</span>
                  <span className="text-[#6fdd78]">ReFS Active (Fast I/O)</span>
                </div>
                <div className="w-full h-1.5 bg-[#0a0e14] rounded-full overflow-hidden">
                  <div className="h-full bg-[#aac7ff]" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Integrated PowerShell Terminal Log */}
          <div className="bg-[#0a0e14] border border-[#3e4a3d] rounded-xl p-3 shadow-sm flex flex-col min-w-0">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#3e4a3d]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#6fdd78]">terminal</span>
                <span className="font-mono text-[11px] font-semibold text-[#dfe2eb]">Windows PowerShell 7.4.1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyLog}
                  className="px-2 py-0.5 bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] text-[#becab9] hover:text-[#dfe2eb] rounded font-mono text-[11px] transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {copiedLog ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedLog ? 'Copied!' : 'Copy Log'}</span>
                </button>
                <button
                  onClick={() => setLogCleared(true)}
                  className="px-2 py-0.5 bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] text-[#becab9] hover:text-[#dfe2eb] rounded font-mono text-[11px] transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="font-mono text-[11px] leading-relaxed text-[#becab9] space-y-1 p-2 bg-[#10141a] rounded overflow-x-auto select-text">
              {logCleared ? (
                <div className="text-[#889484]"># Output cleared.</div>
              ) : (
                <>
                  <div className="text-[#889484]">PS C:\Users\Developer&gt; # Initializing system hardware &amp; toolchain diagnostics</div>
                  <div className="text-[#dfe2eb]">PS C:\Users\Developer&gt; Test-Path $env:JAVA_HOME</div>
                  <div className="text-[#6fdd78] font-bold">True</div>
                  <div className="text-[#dfe2eb]">PS C:\Users\Developer&gt; git --version</div>
                  <div>git version 2.44.0.windows.1</div>
                  <div className="text-[#dfe2eb]">PS C:\Users\Developer&gt; fnm current</div>
                  <div>v22.17.1</div>
                  <div className="text-[#dfe2eb]">PS C:\Users\Developer&gt; wsl -l -v</div>
                  <div>  NAME            STATE           VERSION</div>
                  <div>* Ubuntu-22.04    Running         2</div>
                  <div className="text-[#dfe2eb]">PS C:\Users\Developer&gt; rustc --version</div>
                  <div>rustc 1.77.2 (25ef9e3d8 2024-04-09)</div>
                  <div className="text-[#fabc45]">PS C:\Users\Developer&gt; Test-Path (Get-Command python -ErrorAction SilentlyContinue)</div>
                  <div className="text-[#ffb4ab]">False</div>
                  <div className="pt-2 text-[#6fdd78] font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>[SUCCESS] 25 of 25 targets inspected in 8.42s with zero registry lock conflicts.</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status & Destination Bar */}
      <div className="bg-[#181c22] border border-[#3e4a3d] p-3 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-sm mb-4">
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#becab9] min-w-0">
          <span className="material-symbols-outlined text-[#889484] text-[16px]">database</span>
          <span className="truncate">
            Scan results cached locally (<span className="text-[#dfe2eb]">scan_id: #win-scan-8492</span>). Next scheduled background scan: <span className="text-[#6fdd78] font-medium">in 24 hours</span>.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-3 h-8 bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] text-[#dfe2eb] text-[12px] font-medium rounded transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => onNavigate('languages')}
            className="px-3 h-8 bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] text-[#dfe2eb] text-[12px] font-medium rounded transition-colors flex items-center gap-1"
          >
            <span>Manage Languages</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};
