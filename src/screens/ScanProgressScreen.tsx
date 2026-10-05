import React, { useState, useEffect } from 'react';
import { SCAN_TARGETS } from '../data/mockData';
import { ScreenType } from '../types';

interface ScanProgressScreenProps {
  onScanComplete: () => void;
  onCancelScan: () => void;
}

export const ScanProgressScreen: React.FC<ScanProgressScreenProps> = ({
  onScanComplete,
  onCancelScan,
}) => {
  const [seconds, setSeconds] = useState(6.9);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(68);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSeconds((prev) => +(prev + 0.1).toFixed(1));
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onScanComplete, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isPaused, onScanComplete]);

  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(1);
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(4, '0')}s`;

  return (
    <div className="flex flex-col w-full gap-3 select-none">
      {/* Top Navigation & Action Row */}
      <div className="flex flex-col gap-2 bg-[#181c22] border border-[#3e4a3d] p-3 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#889484]">
            <span>Environment</span>
            <span>/</span>
            <span>Diagnostics</span>
            <span>/</span>
            <span className="text-[#6fdd78] font-medium">Environment Scan</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1c2026] border border-[#3e4a3d] rounded font-mono text-[11px] text-[#becab9]">
              <span className="material-symbols-outlined text-[13px] text-[#6fdd78] animate-pulse">timer</span>
              <span>
                Elapsed: <span className="text-[#dfe2eb] font-semibold">{formattedTime}</span>
              </span>
              <span className="text-[#889484]">|</span>
              <span className="text-[#6fdd78]">28 checks/sec</span>
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-1 h-7 px-2.5 bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] text-[#dfe2eb] rounded text-[12px] font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">
                {isPaused ? 'play_arrow' : 'pause'}
              </span>
              <span>{isPaused ? 'Resume Scan' : 'Pause Scan'}</span>
            </button>

            <button
              onClick={onCancelScan}
              className="flex items-center gap-1 h-7 px-2.5 bg-[#1c2026] hover:bg-[#93000a] border border-[#3e4a3d] text-[#ffb4ab] rounded text-[12px] font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
              <span>Cancel Scan</span>
              <kbd className="ml-1 px-1 bg-[#0a0e14] rounded text-[9px] font-mono text-[#889484]">Esc</kbd>
            </button>

            <button
              onClick={onScanComplete}
              className="flex items-center gap-1 h-7 px-2.5 bg-[#6fdd78] hover:bg-[#34a547] text-[#00390e] rounded text-[12px] font-bold transition-all shadow-sm"
              title="Fast forward to completed scan results"
            >
              <span className="material-symbols-outlined text-[14px]">fast_forward</span>
              <span>Finish Scan</span>
            </button>
          </div>
        </div>

        {/* Active Scanning Status Bar */}
        <div className="flex items-start justify-between mt-1">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
              <span className="absolute inset-0 rounded-full bg-[#6fdd78]/20 animate-ping"></span>
              <div className="w-8 h-8 rounded-full bg-[#262a31] border border-[#6fdd78] flex items-center justify-center relative">
                <span className="material-symbols-outlined text-[#6fdd78] text-[18px] animate-spin">autorenew</span>
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <h1 className="text-[18px] font-bold text-[#dfe2eb] tracking-tight truncate flex items-center gap-2">
                Scanning Development Environment...
                <span className="text-[10px] font-mono font-bold text-[#6fdd78] bg-[#6fdd78]/15 px-2 py-0.5 rounded uppercase">
                  ThreadPool Active
                </span>
              </h1>
              <p className="text-[12px] text-[#becab9] truncate">
                Detecting installed runtimes, verifying Windows PATH shims, checking package managers (Winget, Scoop, Chocolatey), and analyzing registry variables.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar & Metrics */}
      <div className="bg-[#181c22] border border-[#3e4a3d] p-3 rounded-lg shadow-sm flex flex-col gap-2">
        <div className="flex items-center justify-between font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#6fdd78]">{progress}% Completed</span>
            <span className="text-[#889484]">•</span>
            <span className="text-[#becab9]">{Math.round((progress / 100) * 25)} of 25 targets analyzed</span>
          </div>
          <span className="text-[#889484]">Estimated time remaining: ~00:02.1s</span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-2 bg-[#0a0e14] rounded-full overflow-hidden flex relative">
          <div
            className="h-full bg-[#6fdd78] rounded-full transition-all duration-300 relative shadow-[0_0_12px_rgba(111,221,120,0.5)]"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-pulse"></div>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
          <div className="bg-[#1c2026] border border-[#3e4a3d] p-2.5 rounded flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#6fdd78] text-[18px]">rule</span>
              <span className="text-[12px] text-[#becab9]">Targets Scanned</span>
            </div>
            <span className="font-mono text-[13px] text-[#dfe2eb] font-semibold">{Math.round((progress / 100) * 25)} / 25</span>
          </div>

          <div className="bg-[#1c2026] border border-[#3e4a3d] p-2.5 rounded flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#6fdd78] text-[18px]">verified</span>
              <span className="text-[12px] text-[#becab9]">Detected Runtimes</span>
            </div>
            <span className="px-1.5 py-0.5 bg-[#6fdd78]/15 text-[#6fdd78] rounded font-mono text-[12px] font-semibold">
              12 Active
            </span>
          </div>

          <div className="bg-[#1c2026] border border-[#3e4a3d] p-2.5 rounded flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#fabc45] text-[18px]">upgrade</span>
              <span className="text-[12px] text-[#becab9]">Updates Available</span>
            </div>
            <span className="px-1.5 py-0.5 bg-[#bd8708] text-[#392600] rounded font-mono text-[12px] font-bold">
              3 Found
            </span>
          </div>

          <div className="bg-[#1c2026] border border-[#3e4a3d] p-2.5 rounded flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#889484] text-[18px]">link_off</span>
              <span className="text-[12px] text-[#becab9]">Missing / Unlinked</span>
            </div>
            <span className="px-1.5 py-0.5 bg-[#262a31] text-[#becab9] rounded font-mono text-[12px]">
              5 Unset
            </span>
          </div>
        </div>
      </div>

      {/* Main Pipeline & Realtime Output Console */}
      <div className="grid grid-cols-12 gap-3">
        {/* Left Column (7 cols): Checklist Pipeline */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-2 bg-[#181c22] border border-[#3e4a3d] p-3 rounded-lg shadow-sm">
          <div className="flex items-center justify-between pb-1 border-b border-[#3e4a3d]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#6fdd78] text-[18px]">account_tree</span>
              <h2 className="text-[14px] font-semibold text-[#dfe2eb]">Runtime &amp; Toolchain Inspection Pipeline</h2>
            </div>
            <span className="font-mono text-[11px] text-[#889484]">Parallel Scan Engine</span>
          </div>

          <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[460px] pr-1">
            {SCAN_TARGETS.map((target) => (
              <div
                key={target.id}
                className={`flex items-start gap-2.5 p-2 rounded transition-colors ${
                  target.status === 'running'
                    ? 'bg-[#262a31] border-l-4 border-l-[#6fdd78]'
                    : target.status === 'queued'
                    ? 'bg-[#0a0e14]/50 border border-[#3e4a3d]/50 opacity-60'
                    : 'bg-[#1c2026] border border-[#3e4a3d]'
                }`}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  {target.status === 'completed' && (
                    <span className="material-symbols-outlined text-[#6fdd78] text-[16px]">check_circle</span>
                  )}
                  {target.status === 'warning' && (
                    <span className="material-symbols-outlined text-[#fabc45] text-[16px]">priority_high</span>
                  )}
                  {target.status === 'running' && (
                    <span className="material-symbols-outlined text-[#6fdd78] text-[16px] animate-spin">refresh</span>
                  )}
                  {target.status === 'queued' && (
                    <span className="material-symbols-outlined text-[#889484] text-[16px]">hourglass_empty</span>
                  )}
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-[#dfe2eb] truncate">{target.name}</span>
                    <span className="font-mono text-[11px] text-[#889484]">
                      {target.duration || (target.status === 'running' ? 'Running...' : 'Queued')}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-[#becab9] truncate mt-0.5">{target.detail}</div>
                  {target.badge && (
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`font-mono text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          target.badgeType === 'primary'
                            ? 'bg-[#34a547]/20 text-[#6fdd78]'
                            : target.badgeType === 'secondary'
                            ? 'bg-[#0072e3]/20 text-[#aac7ff]'
                            : target.badgeType === 'tertiary'
                            ? 'bg-[#bd8708]/20 text-[#fabc45]'
                            : 'bg-[#31353c] text-[#becab9]'
                        }`}
                      >
                        {target.badge}
                      </span>
                      {target.registryNote && (
                        <span className="font-mono text-[10px] text-[#889484]">{target.registryNote}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols): Telemetry & Output */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-3">
          {/* Subsystem & PATH Health */}
          <div className="bg-[#181c22] border border-[#3e4a3d] p-3 rounded-lg shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between pb-1 border-b border-[#3e4a3d]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#aac7ff] text-[18px]">verified_user</span>
                <h3 className="text-[14px] font-semibold text-[#dfe2eb]">Subsystem &amp; PATH Health</h3>
              </div>
              <span className="px-1.5 py-0.2 bg-[#1c2026] border border-[#3e4a3d] rounded font-mono text-[10px] text-[#6fdd78] font-bold">
                WIN-11 SUB-OK
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <div className="p-2 bg-[#1c2026] border border-[#3e4a3d] rounded flex flex-col">
                <span className="font-mono text-[10px] text-[#889484]">User PATH</span>
                <span className="font-mono text-[13px] text-[#dfe2eb] font-semibold mt-0.5">24 entries</span>
                <span className="font-mono text-[10px] text-[#6fdd78] mt-0.5">✓ 0 orphans</span>
              </div>

              <div className="p-2 bg-[#1c2026] border border-[#3e4a3d] rounded flex flex-col">
                <span className="font-mono text-[10px] text-[#889484]">System PATH</span>
                <span className="font-mono text-[13px] text-[#dfe2eb] font-semibold mt-0.5">18 entries</span>
                <span className="font-mono text-[10px] text-[#6fdd78] mt-0.5">✓ All shims valid</span>
              </div>

              <div className="p-2 bg-[#1c2026] border border-[#3e4a3d] rounded flex flex-col">
                <span className="font-mono text-[10px] text-[#889484]">Env Variables</span>
                <span className="font-mono text-[13px] text-[#dfe2eb] font-semibold mt-0.5">42 mapped</span>
                <span className="font-mono text-[10px] text-[#becab9] mt-0.5">HKCU / HKLM sync</span>
              </div>

              <div className="p-2 bg-[#1c2026] border border-[#3e4a3d] rounded flex flex-col">
                <span className="font-mono text-[10px] text-[#889484]">Winget Manifest</span>
                <span className="font-mono text-[13px] text-[#dfe2eb] font-semibold mt-0.5">v1.8.1911</span>
                <span className="font-mono text-[10px] text-[#aac7ff] mt-0.5">Index up to date</span>
              </div>
            </div>
          </div>

          {/* Realtime Pipeline Output Terminal */}
          <div className="flex-1 bg-[#0a0e14] border border-[#3e4a3d] rounded-lg shadow-sm flex flex-col overflow-hidden min-h-[240px]">
            <div className="h-8 bg-[#181c22] px-3 flex items-center justify-between border-b border-[#3e4a3d]">
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#becab9]">
                <span className="material-symbols-outlined text-[14px] text-[#6fdd78]">terminal</span>
                <span>Realtime Pipeline Output</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[10px] text-[#889484]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6fdd78] animate-pulse"></span>
                <span>STDIN/OUT</span>
              </div>
            </div>

            <div className="p-2.5 font-mono text-[11px] text-[#becab9] space-y-1 overflow-y-auto flex-1 max-h-56 leading-relaxed select-text">
              <div className="text-[#889484]"># Worker [Thread-04] checking Java Native paths...</div>
              <div><span className="text-[#aac7ff]">PS C:\Users\Developer&gt;</span> Get-Command java | Select-Object -ExpandProperty Source</div>
              <div className="text-[#dfe2eb] pl-2">C:\Program Files\Java\jdk-17\bin\java.exe</div>
              <div><span className="text-[#aac7ff]">PS C:\Users\Developer&gt;</span> [System.Environment]::GetEnvironmentVariable("JAVA_HOME")</div>
              <div className="text-[#dfe2eb] pl-2">C:\Program Files\Java\jdk-17</div>
              <div className="text-[#889484]"># Worker [Thread-02] verifying Docker daemon pipe...</div>
              <div><span className="text-[#aac7ff]">PS C:\Users\Developer&gt;</span> Test-Path "\\.\pipe\docker_engine"</div>
              <div className="text-[#6fdd78] pl-2 font-bold">True</div>
              <div><span className="text-[#aac7ff]">PS C:\Users\Developer&gt;</span> wsl.exe --list --verbose</div>
              <div className="text-[#dfe2eb] pl-2 whitespace-pre text-[10px]">  NAME            STATE           VERSION
* Ubuntu-22.04    Running         2
  docker-desktop  Running         2</div>
              <div><span className="text-[#aac7ff]">PS C:\Users\Developer&gt;</span> docker version --format '&#123;&#123;.Server.Version&#125;&#125;'</div>
              <div className="text-[#fabc45] pl-2 animate-pulse">[Querying named pipe socket response...]</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Notification Status Bar */}
      <div className="bg-[#181c22] border border-[#3e4a3d] p-2.5 rounded-lg flex items-center justify-between text-[#becab9] font-mono text-[11px] shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[#6fdd78] text-[16px] animate-pulse">bolt</span>
          <span className="truncate">
            Scan running asynchronously in background. High-speed multi-threaded detection enabled <span className="text-[#dfe2eb] font-medium">(ThreadPool: 8 workers, Win32 P/Invoke accelerated)</span>.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[10px] text-[#889484]">PID: 14820</span>
          <span className="text-[#889484]">|</span>
          <button onClick={onScanComplete} className="text-[#6fdd78] hover:underline font-semibold">
            Open Diagnostics Report
          </button>
        </div>
      </div>
    </div>
  );
};
