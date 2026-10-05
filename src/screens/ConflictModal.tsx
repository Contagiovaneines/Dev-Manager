import React, { useState } from 'react';

interface ConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (strategy: 'parallel' | 'replace', version: string) => void;
}

export const ConflictModal: React.FC<ConflictModalProps> = ({
  isOpen,
  onClose,
  onProceed,
}) => {
  const [selectedVersion, setSelectedVersion] = useState('22.0.2');
  const [strategy, setStrategy] = useState<'parallel' | 'replace'>('parallel');
  const [switchJavaHome, setSwitchJavaHome] = useState(true);
  const [prependPath, setPrependPath] = useState(true);
  const [installPath, setInstallPath] = useState('C:\\Program Files\\Java\\jdk-22.0.2_parallel');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const isConflict = selectedVersion === '22.0.2';

  const handleExecute = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onProceed(strategy, selectedVersion);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#181c22] border border-[#3e4a3d] rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Modal Title Bar */}
        <div className="h-11 px-4 bg-[#1c2026] border-b border-[#3e4a3d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6fdd78] text-[18px]">install_desktop</span>
            <span className="text-[14px] font-semibold text-[#dfe2eb]">Install Java SDK</span>
            <span className="text-[#889484] text-[11px] font-mono">|</span>
            <span className="text-[#becab9] text-[11px] font-mono">Windows Runtime Deployer</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded flex items-center justify-center text-[#becab9] hover:bg-[#93000a] hover:text-[#ffdad6] transition-colors"
            title="Close Dialog"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Header Lead */}
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[18px] font-bold text-[#dfe2eb]">Select Distribution &amp; Configure Target</h2>
            <p className="text-[12px] text-[#becab9]">
              Choose the version you want to install and configure in Windows environment variables.
            </p>
          </div>

          {/* Section 1: Version Selector (6 items grid) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold font-mono text-[#889484] uppercase tracking-wider">
                Available Toolchains
              </span>
              <span className="font-mono text-[11px] text-[#889484]">Upstream: Adoptium Temurin API</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {/* Java 25 EA */}
              <label
                onClick={() => setSelectedVersion('25')}
                className={`relative flex flex-col p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  selectedVersion === '25'
                    ? 'bg-[#262a31] border-[#6fdd78]'
                    : 'bg-[#1c2026] border-[#3e4a3d] hover:bg-[#262a31]'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-[14px] font-semibold text-[#dfe2eb]">Java 25</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#31353c] text-[#becab9]">
                    EA
                  </span>
                </div>
                <span className="text-[12px] text-[#becab9] truncate">Feature release, preview builds</span>
                <span className="font-mono text-[11px] text-[#889484] mt-1">v25.0.0-ea.12</span>
              </label>

              {/* Java 24 */}
              <label
                onClick={() => setSelectedVersion('24')}
                className={`relative flex flex-col p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  selectedVersion === '24'
                    ? 'bg-[#262a31] border-[#6fdd78]'
                    : 'bg-[#1c2026] border-[#3e4a3d] hover:bg-[#262a31]'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-[14px] font-semibold text-[#dfe2eb]">Java 24</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#31353c] text-[#becab9]">
                    STABLE
                  </span>
                </div>
                <span className="text-[12px] text-[#becab9] truncate">Standard release cycle</span>
                <span className="font-mono text-[11px] text-[#889484] mt-1">v24.0.1+9</span>
              </label>

              {/* Java 23 */}
              <label
                onClick={() => setSelectedVersion('23')}
                className={`relative flex flex-col p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  selectedVersion === '23'
                    ? 'bg-[#262a31] border-[#6fdd78]'
                    : 'bg-[#1c2026] border-[#3e4a3d] hover:bg-[#262a31]'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-[14px] font-semibold text-[#dfe2eb]">Java 23</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#31353c] text-[#becab9]">
                    STABLE
                  </span>
                </div>
                <span className="text-[12px] text-[#becab9] truncate">General availability release</span>
                <span className="font-mono text-[11px] text-[#889484] mt-1">v23.0.2+7</span>
              </label>

              {/* Java 22.0.2 (Conflict) */}
              <label
                onClick={() => setSelectedVersion('22.0.2')}
                className={`relative flex flex-col p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  selectedVersion === '22.0.2'
                    ? 'bg-[#262a31] border-[#fabc45] shadow-sm'
                    : 'bg-[#1c2026] border-[#3e4a3d] hover:bg-[#262a31]'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#fabc45]">warning</span>
                    <span className="text-[14px] font-bold text-[#dfe2eb]">Java 22.0.2</span>
                  </div>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#bd8708] text-[#392600] font-bold">
                    CONFLICT
                  </span>
                </div>
                <span className="text-[12px] text-[#fabc45] font-medium">Installed on machine</span>
                <span className="font-mono text-[11px] text-[#becab9] mt-1">C:\...\jdk-22.0.2</span>
              </label>

              {/* Java 21 LTS */}
              <label
                onClick={() => setSelectedVersion('21')}
                className={`relative flex flex-col p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  selectedVersion === '21'
                    ? 'bg-[#262a31] border-[#6fdd78]'
                    : 'bg-[#1c2026] border-[#3e4a3d] hover:bg-[#262a31]'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-[14px] font-semibold text-[#dfe2eb]">Java 21</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#6fdd78]/20 text-[#6fdd78] font-bold">
                    LTS
                  </span>
                </div>
                <span className="text-[12px] text-[#becab9] truncate">Long Term Support version</span>
                <span className="font-mono text-[11px] text-[#889484] mt-1">v21.0.6+7</span>
              </label>

              {/* Java 17 LTS (Active) */}
              <label
                onClick={() => setSelectedVersion('17')}
                className={`relative flex flex-col p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  selectedVersion === '17'
                    ? 'bg-[#262a31] border-[#6fdd78]'
                    : 'bg-[#1c2026] border-[#3e4a3d] hover:bg-[#262a31]'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-[14px] font-semibold text-[#dfe2eb]">Java 17</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#6fdd78] text-[#00390e] font-bold">
                    ACTIVE
                  </span>
                </div>
                <span className="text-[12px] text-[#6fdd78] truncate">Current JAVA_HOME target</span>
                <span className="font-mono text-[11px] text-[#889484] mt-1">v17.0.17+8</span>
              </label>
            </div>
          </div>

          {/* Section 2: Conflict Resolution Workflow */}
          {isConflict && (
            <div className="flex flex-col gap-3 p-3.5 rounded-xl bg-[#1c2026] border border-[#3e4a3d]">
              {/* Alert Warning Banner */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#bd8708]/20 border border-[#bd8708]/40">
                <span className="material-symbols-outlined text-[#fabc45] text-[22px] shrink-0 mt-0.5">
                  notification_important
                </span>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-[14px] font-bold text-[#dfe2eb]">Java 22.0.2 is already installed</span>
                    <span className="font-mono text-[10px] text-[#fabc45] bg-[#0a0e14] px-2 py-0.5 rounded border border-[#3e4a3d]">
                      Target collision detected
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-[#becab9] break-all">
                    Found existing payload at: <span className="text-[#dfe2eb] font-semibold">C:\Program Files\Java\jdk-22.0.2</span>
                  </p>
                  <span className="text-[12px] text-[#dfe2eb] font-semibold mt-1">
                    What would you like to do with this version?
                  </span>
                </div>
              </div>

              {/* Side-by-Side Strategy Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Strategy A: Install in Parallel */}
                <div
                  onClick={() => {
                    setStrategy('parallel');
                    setInstallPath('C:\\Program Files\\Java\\jdk-22.0.2_parallel');
                  }}
                  className={`flex flex-col justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    strategy === 'parallel'
                      ? 'bg-[#262a31] border-[#6fdd78] ring-1 ring-[#6fdd78]'
                      : 'bg-[#181c22] border-[#3e4a3d] hover:bg-[#262a31]'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-[#6fdd78]/20 flex items-center justify-center text-[#6fdd78]">
                        <span className="material-symbols-outlined text-[18px]">fork_right</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#6fdd78]/20 text-[#6fdd78] font-mono text-[10px] font-bold uppercase tracking-wider">
                        Non-destructive • Safe
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-[14px] font-bold text-[#dfe2eb]">Install in Parallel</h3>
                        <span className="font-mono text-[9px] font-bold text-[#6fdd78] bg-[#34a547]/30 px-1.5 py-0.2 rounded">
                          RECOMMENDED
                        </span>
                      </div>
                      <p className="text-[12px] text-[#becab9] leading-relaxed">
                        Keep existing <span className="font-mono text-[#dfe2eb]">Java 22.0.2</span> untouched and install this build into a dedicated versioned folder or isolated path.
                      </p>
                    </div>

                    <ul className="flex flex-col gap-1 pt-1 text-[12px] text-[#dfe2eb]">
                      <li className="flex items-center gap-1.5 text-[#6fdd78] font-mono text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        <span>Does NOT modify active Java 17 default</span>
                      </li>
                      <li className="flex items-center gap-1.5 text-[#6fdd78] font-mono text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        <span>Available immediately for IDE selection</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setStrategy('parallel')}
                      className={`w-full h-8 px-3 rounded text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        strategy === 'parallel'
                          ? 'bg-[#6fdd78] text-[#00390e]'
                          : 'bg-[#1c2026] text-[#dfe2eb] hover:bg-[#31353c]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">add_moderator</span>
                      <span>Install in Parallel (Recommended)</span>
                    </button>
                  </div>
                </div>

                {/* Strategy B: Replace Current Version */}
                <div
                  onClick={() => {
                    setStrategy('replace');
                    setInstallPath('C:\\Program Files\\Java\\jdk-22.0.2');
                  }}
                  className={`flex flex-col justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    strategy === 'replace'
                      ? 'bg-[#262a31] border-[#fabc45] ring-1 ring-[#fabc45]'
                      : 'bg-[#181c22] border-[#3e4a3d] hover:bg-[#262a31]'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-[#31353c] flex items-center justify-center text-[#fabc45]">
                        <span className="material-symbols-outlined text-[18px]">autorenew</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#31353c] text-[#889484] font-mono text-[10px] uppercase tracking-wider font-bold">
                        Overwrites Existing Files
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <h3 className="text-[14px] font-bold text-[#dfe2eb]">Replace Current Version</h3>
                      <p className="text-[12px] text-[#becab9] leading-relaxed">
                        Cleanly re-download and overwrite the current files at <span className="font-mono text-[#dfe2eb]">jdk-22.0.2</span> and recalculate checksum hashes.
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#becab9]">
                        <input
                          type="checkbox"
                          checked={switchJavaHome}
                          onChange={(e) => setSwitchJavaHome(e.target.checked)}
                          className="rounded bg-[#0a0e14] text-[#6fdd78] accent-[#6fdd78]"
                        />
                        <span>Switch JAVA_HOME to this version on completion</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#becab9]">
                        <input
                          type="checkbox"
                          checked={prependPath}
                          onChange={(e) => setPrependPath(e.target.checked)}
                          className="rounded bg-[#0a0e14] text-[#6fdd78] accent-[#6fdd78]"
                        />
                        <span>Prepend %JAVA_HOME%\bin to User PATH</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setStrategy('replace')}
                      className={`w-full h-8 px-3 rounded text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors ${
                        strategy === 'replace'
                          ? 'bg-[#bd8708] text-[#392600] font-bold'
                          : 'bg-[#1c2026] text-[#fabc45] hover:bg-[#31353c]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">sync_problem</span>
                      <span>Replace Version</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Informational Note */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#181c22] border border-[#3e4a3d] text-[12px] text-[#becab9]">
                <span className="material-symbols-outlined text-[#aac7ff] text-[16px]">info</span>
                <span>Installing another version alongside will preserve all your existing environment variables and project configurations.</span>
              </div>
            </div>
          )}

          {/* Section 3: Destination Path */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono font-bold text-[#889484] uppercase tracking-wider">
              Installation Destination
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center h-8 px-3 bg-[#0a0e14] border border-[#3e4a3d] rounded font-mono text-[12px] text-[#dfe2eb]">
                <span className="material-symbols-outlined text-[#889484] text-[16px] mr-2">folder</span>
                <input
                  type="text"
                  value={installPath}
                  onChange={(e) => setInstallPath(e.target.value)}
                  className="w-full bg-transparent text-[#dfe2eb] focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setInstallPath('C:\\Program Files\\Java\\jdk-' + selectedVersion + '_custom')}
                className="h-8 px-3 rounded bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] text-[#dfe2eb] text-[12px] font-medium transition-colors"
              >
                Browse...
              </button>
            </div>

            <div className="flex items-center justify-between font-mono text-[11px] text-[#889484] px-0.5">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[#becab9]">
                  <span className="material-symbols-outlined text-[14px]">hard_drive</span>
                  <span>Requires: 340 MB</span>
                </span>
                <span>•</span>
                <span className="text-[#6fdd78]">142.4 GB Free on Windows (C:)</span>
              </div>
              <span>Architecture: x64-windows-msvc</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-14 px-5 bg-[#1c2026] border-t border-[#3e4a3d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[#889484] font-mono text-[11px]">
            <span className="material-symbols-outlined text-[16px]">shield</span>
            <span>Requires Administrator Privileges for Program Files write</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="h-8 px-4 rounded bg-[#262a31] hover:bg-[#353940] text-[#dfe2eb] text-[12px] font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExecute}
              disabled={isProcessing}
              className="h-8 px-5 rounded bg-[#6fdd78] hover:bg-[#34a547] text-[#00390e] text-[12px] font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span className={`material-symbols-outlined text-[16px] ${isProcessing ? 'animate-spin' : ''}`}>
                {isProcessing ? 'sync' : 'play_arrow'}
              </span>
              <span>
                {isProcessing
                  ? 'Configuring Toolchain...'
                  : strategy === 'parallel'
                  ? 'Proceed with Parallel Install'
                  : 'Proceed with Replace Install'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
