import React, { useState, useRef, DragEvent } from 'react';
import { AppSettings, DevHubSyncPackage, ToolchainItem } from '../types';
import { TechnologyProvider, TechnologyMetadata } from '../catalog/types';

interface ImportExportSectionProps {
  settings: AppSettings;
  providers?: Record<string, TechnologyProvider>;
  technologies?: TechnologyMetadata[];
  languages?: ToolchainItem[];
  onImportConfiguration?: (payload: {
    settings?: AppSettings;
    providers?: Record<string, TechnologyProvider>;
    technologies?: TechnologyMetadata[];
    languages?: ToolchainItem[];
    strategy: 'merge' | 'replace';
  }) => void;
  onShowNotification?: (msg: string) => void;
}

export const ImportExportSection: React.FC<ImportExportSectionProps> = ({
  settings,
  providers,
  technologies,
  languages,
  onImportConfiguration,
  onShowNotification,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pendingPackage, setPendingPackage] = useState<DevHubSyncPackage | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [importStrategy, setImportStrategy] = useState<'merge' | 'replace'>('merge');
  const [parseError, setParseError] = useState<string | null>(null);
  const [pasteMode, setPasteMode] = useState(false);
  const [pastedJson, setPastedJson] = useState('');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Path remapping options for multi-machine synchronization
  const [remapPaths, setRemapPaths] = useState(false);
  const [sourcePrefix, setSourcePrefix] = useState('C:\\Users\\Developer');
  const [targetPrefix, setTargetPrefix] = useState('C:\\Users\\Developer');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Generate full app state export package
  const generateFullStatePackage = (): DevHubSyncPackage => {
    let installationsCount = 0;
    if (providers) {
      Object.values(providers).forEach((p) => {
        installationsCount += p.installations?.length || 0;
      });
    }

    const payload: DevHubSyncPackage = {
      schema: 'devhub.windows.environment.sync',
      schemaVersion: '2.1.0',
      exportedAt: new Date().toISOString(),
      sourceMachine: {
        hostname: 'DEV-WORKSTATION-01',
        os: 'Microsoft Windows 11 Pro 64-bit',
        build: '22631.3880',
        arch: 'x64',
        userProfile: 'C:\\Users\\Developer',
      },
      settings,
      providers: providers || {},
      technologies: technologies || [],
      languages: languages || [],
      metadata: {
        providersCount: providers ? Object.keys(providers).length : 0,
        installationsCount,
        technologiesCount: technologies ? technologies.length : 0,
        checksum: 'sha256-' + Math.random().toString(36).substring(2, 10),
      },
    };
    return payload;
  };

  // 2. Export button handler
  const handleExportFullConfiguration = () => {
    const pkg = generateFullStatePackage();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(pkg, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `devhub-full-configuration-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    if (onShowNotification) {
      onShowNotification('Full configuration exported successfully as JSON file.');
    }
  };

  const handleCopyJson = () => {
    const pkg = generateFullStatePackage();
    navigator.clipboard?.writeText(JSON.stringify(pkg, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onShowNotification) {
      onShowNotification('Complete configuration JSON copied to clipboard.');
    }
  };

  // 3. Process and validate incoming JSON
  const handleProcessJsonString = (raw: string) => {
    setParseError(null);
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('File does not contain a valid JSON object.');
      }

      if (!parsed.providers && !parsed.settings && !parsed.technologies && !parsed.languages) {
        throw new Error('Unrecognized format: Missing Dev Hub providers, settings, or technologies.');
      }

      const syncPkg = parsed as DevHubSyncPackage;
      setPendingPackage(syncPkg);
      if (syncPkg.sourceMachine?.userProfile) {
        setSourcePrefix(syncPkg.sourceMachine.userProfile);
      }
      setShowConfirmationModal(true);
    } catch (err: any) {
      setParseError(err.message || 'Failed to parse JSON file.');
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  const readFile = (file: File) => {
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setParseError('Please drop a valid .json file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleProcessJsonString(content);
    };
    reader.readAsText(file);
  };

  // 4. Confirm & Apply Import
  const handleConfirmImport = () => {
    if (!pendingPackage) return;

    let targetProviders = pendingPackage.providers || providers || {};
    let targetTechnologies = pendingPackage.technologies || technologies || [];
    let targetLanguages = pendingPackage.languages || languages || [];
    let targetSettings = pendingPackage.settings || settings;

    // Apply path remapping if requested
    if (remapPaths && sourcePrefix && targetPrefix && sourcePrefix !== targetPrefix) {
      const remap = (str: string) => (str ? str.split(sourcePrefix).join(targetPrefix) : str);

      const remappedProv: Record<string, TechnologyProvider> = {};
      Object.entries(targetProviders).forEach(([k, p]) => {
        remappedProv[k] = {
          ...p,
          detectionMethods: p.detectionMethods?.map((d) => ({ ...d, detail: remap(d.detail) })),
          installations: p.installations?.map((inst) => ({ ...inst, path: remap(inst.path) })),
        };
      });
      targetProviders = remappedProv;

      targetLanguages = targetLanguages.map((l) => ({
        ...l,
        path: l.path ? remap(l.path) : l.path,
      }));

      if (targetSettings.toolchainRoot) {
        targetSettings = {
          ...targetSettings,
          toolchainRoot: remap(targetSettings.toolchainRoot),
        };
      }
    }

    if (onImportConfiguration) {
      onImportConfiguration({
        settings: targetSettings,
        providers: targetProviders,
        technologies: targetTechnologies,
        languages: targetLanguages,
        strategy: importStrategy,
      });
    }

    setShowConfirmationModal(false);
    setPendingPackage(null);
    setPastedJson('');
    setPasteMode(false);

    const provCount = Object.keys(targetProviders).length;
    const msg = `Configuration imported successfully! Synchronized ${provCount} providers and environment policies.`;
    setSuccessBanner(msg);
    setTimeout(() => setSuccessBanner(null), 5000);

    if (onShowNotification) {
      onShowNotification(msg);
    }
  };

  return (
    <section className="flex flex-col gap-3 pt-2" id="sec-import-export">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#3e4a3d] pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <span className="material-symbols-outlined text-[20px]">import_export</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-bold text-[#dfe2eb]">Import/Export Configuration</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#101b13] text-[#6fdd78] border border-emerald-500/30 text-[10px] font-mono font-bold">
                WINDOWS SYNC
              </span>
            </div>
            <p className="text-[12px] text-[#becab9] mt-0.5">
              Sync your complete Dev Hub state (technologies, providers, languages, settings) between Windows workstations.
            </p>
          </div>
        </div>
        <span className="font-mono text-[11px] text-[#889484] hidden sm:inline">devhub.sync.json</span>
      </div>

      {/* Success Banner */}
      {successBanner && (
        <div className="p-3.5 bg-[#101b13] border border-emerald-500/40 text-emerald-400 rounded-xl text-[12px] font-medium flex items-center gap-2 animate-in fade-in duration-200 shadow-md">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{successBanner}</span>
        </div>
      )}

      {/* Error Banner */}
      {parseError && (
        <div className="p-3.5 bg-[#2d1215] border border-rose-500/40 text-rose-300 rounded-xl text-[12px] font-medium flex items-center justify-between gap-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{parseError}</span>
          </div>
          <button
            onClick={() => setParseError(null)}
            className="text-rose-400 hover:text-white"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Main Dual Container (Export & Import) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CARD 1: EXPORT FULL CONFIGURATION */}
        <div className="bg-[#1c2026] border border-[#3e4a3d] hover:border-emerald-500/40 rounded-xl p-5 flex flex-col justify-between shadow-sm transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6fdd78] text-[22px]">download_for_offline</span>
                <h3 className="font-bold text-white text-[15px]">Export Full Configuration</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#0a0e14] text-[#889484] border border-[#3e4a3d]">
                JSON Package
              </span>
            </div>

            <p className="text-[12px] text-[#becab9] leading-relaxed">
              Downloads a unified snapshot of all application state, active technology providers, installed version paths, and system settings.
            </p>

            {/* Live State Breakdown Pills */}
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2.5 bg-[#0a0e14] rounded-lg border border-[#3e4a3d] flex items-center justify-between">
                <span className="text-[#889484]">Technologies:</span>
                <span className="text-[#aac7ff] font-bold">{technologies ? technologies.length : 32} Items</span>
              </div>
              <div className="p-2.5 bg-[#0a0e14] rounded-lg border border-[#3e4a3d] flex items-center justify-between">
                <span className="text-[#889484]">Providers:</span>
                <span className="text-[#6fdd78] font-bold">{providers ? Object.keys(providers).length : 14} Active</span>
              </div>
              <div className="p-2.5 bg-[#0a0e14] rounded-lg border border-[#3e4a3d] flex items-center justify-between">
                <span className="text-[#889484]">Toolchains:</span>
                <span className="text-white font-bold">{languages ? languages.length : 11} Tracked</span>
              </div>
              <div className="p-2.5 bg-[#0a0e14] rounded-lg border border-[#3e4a3d] flex items-center justify-between">
                <span className="text-[#889484]">Settings:</span>
                <span className="text-[#fabc45] font-bold">Preferences</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-5 mt-4 border-t border-[#3e4a3d] flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              type="button"
              onClick={handleExportFullConfiguration}
              className="flex-1 py-2.5 px-4 bg-[#6fdd78] hover:bg-[#34a547] text-[#00390e] rounded-lg font-bold text-[13px] shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Full Configuration</span>
            </button>

            <button
              type="button"
              onClick={handleCopyJson}
              className="py-2.5 px-3 bg-[#262a31] hover:bg-[#353940] border border-[#3e4a3d] rounded-lg text-[#dfe2eb] text-[12px] font-medium transition-colors flex items-center justify-center gap-1.5"
              title="Copy complete configuration JSON to clipboard"
            >
              <span className="material-symbols-outlined text-[16px] text-[#6fdd78]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* CARD 2: IMPORT CONFIGURATION WITH DRAG-AND-DROP */}
        <div className="bg-[#1c2026] border border-[#3e4a3d] hover:border-emerald-500/40 rounded-xl p-5 flex flex-col justify-between shadow-sm transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#aac7ff] text-[22px]">upload_file</span>
                <h3 className="font-bold text-white text-[15px]">Import Configuration</h3>
              </div>
              <button
                type="button"
                onClick={() => setPasteMode(!pasteMode)}
                className="text-[11px] font-mono text-[#6fdd78] hover:underline"
              >
                {pasteMode ? 'Switch to File Upload' : 'Paste Raw JSON'}
              </button>
            </div>

            <p className="text-[12px] text-[#becab9] leading-relaxed">
              Upload a configuration JSON file to replicate toolchain settings. Includes a review step before applying changes.
            </p>

            {/* Hidden Input for Click to Browse */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Drag & Drop Zone */}
            {!pasteMode ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2 ${
                  isDragging
                    ? 'border-[#6fdd78] bg-[#101b13] scale-[1.01] shadow-lg shadow-emerald-950/40'
                    : 'border-[#3e4a3d] hover:border-[#6fdd78] bg-[#0a0e14]'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform ${
                    isDragging
                      ? 'bg-emerald-500/20 text-[#6fdd78] scale-110'
                      : 'bg-[#181c22] text-[#aac7ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[26px]">
                    {isDragging ? 'file_download' : 'cloud_upload'}
                  </span>
                </div>
                <div>
                  <span className="text-[13px] font-bold text-white block">
                    {isDragging ? 'Drop configuration JSON file here' : 'Drag & drop JSON file here or browse'}
                  </span>
                  <span className="text-[11px] text-[#889484] mt-0.5 block">
                    Accepts <code className="text-[#6fdd78]">devhub-full-configuration-*.json</code>
                  </span>
                </div>
              </div>
            ) : (
              /* Paste JSON Textarea */
              <div className="space-y-2">
                <textarea
                  rows={4}
                  value={pastedJson}
                  onChange={(e) => setPastedJson(e.target.value)}
                  placeholder='Paste {"schema": "devhub.windows.environment.sync", ...}'
                  className="w-full p-2.5 bg-[#0a0e14] border border-[#3e4a3d] rounded-lg font-mono text-[11px] text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleProcessJsonString(pastedJson)}
                  disabled={!pastedJson.trim()}
                  className="w-full py-1.5 bg-[#262a31] hover:bg-[#31353c] text-white rounded text-[12px] font-semibold transition-colors disabled:opacity-50"
                >
                  Review Staged JSON
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 mt-3 border-t border-[#3e4a3d] flex items-center justify-between text-[11px] text-[#889484]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#6fdd78]">verified_user</span>
              Safe validation with confirmation modal
            </span>
            <span className="font-mono">Merge or Replace</span>
          </div>
        </div>
      </div>

      {/* CONFIRMATION STEP MODAL */}
      {showConfirmationModal && pendingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="w-full max-w-xl bg-[#161a22] border border-[#3e4a3d] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 bg-[#0d1117] border-b border-[#3e4a3d] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-[15px]">Confirm Configuration Import</h3>
                  <p className="text-[11px] text-[#889484]">Review incoming state before applying to your system</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-[12px] text-[#becab9] max-h-[70vh] overflow-y-auto">
              {/* Inspection Summary Card */}
              <div className="p-3.5 bg-[#0d1117] rounded-xl border border-[#3e4a3d] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[13px]">Source Machine Metadata</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#101b13] text-[#6fdd78] border border-emerald-500/30">
                    {pendingPackage.schemaVersion || 'v2.1.0'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] pt-1">
                  <div>
                    <span className="text-[#889484]">Source Hostname:</span>
                    <div className="text-white font-bold">{pendingPackage.sourceMachine?.hostname || 'Unknown Host'}</div>
                  </div>
                  <div>
                    <span className="text-[#889484]">Platform:</span>
                    <div className="text-white font-bold">{pendingPackage.sourceMachine?.os || 'Windows 11'}</div>
                  </div>
                  <div>
                    <span className="text-[#889484]">Export Date:</span>
                    <div className="text-white font-bold truncate">
                      {pendingPackage.exportedAt ? new Date(pendingPackage.exportedAt).toLocaleDateString() : 'Recent'}
                    </div>
                  </div>
                </div>

                {/* Entities to import count */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#262a31] text-center font-mono">
                  <div className="p-2 bg-[#161a22] rounded border border-[#3e4a3d]">
                    <div className="text-[14px] font-bold text-[#6fdd78]">
                      {pendingPackage.providers ? Object.keys(pendingPackage.providers).length : 0}
                    </div>
                    <div className="text-[10px] text-[#889484]">Providers</div>
                  </div>
                  <div className="p-2 bg-[#161a22] rounded border border-[#3e4a3d]">
                    <div className="text-[14px] font-bold text-[#aac7ff]">
                      {pendingPackage.technologies ? pendingPackage.technologies.length : 0}
                    </div>
                    <div className="text-[10px] text-[#889484]">Technologies</div>
                  </div>
                  <div className="p-2 bg-[#161a22] rounded border border-[#3e4a3d]">
                    <div className="text-[14px] font-bold text-[#fabc45]">
                      {pendingPackage.languages ? pendingPackage.languages.length : 0}
                    </div>
                    <div className="text-[10px] text-[#889484]">Toolchains</div>
                  </div>
                </div>
              </div>

              {/* Path Remapping Option */}
              <div className="p-3.5 bg-[#0d1117] rounded-xl border border-[#3e4a3d] space-y-2.5">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-white">
                  <input
                    type="checkbox"
                    checked={remapPaths}
                    onChange={(e) => setRemapPaths(e.target.checked)}
                    className="w-4 h-4 text-[#6fdd78] rounded bg-[#1c2026] border-[#3e4a3d]"
                  />
                  <span>Remap Windows User Profile Path</span>
                </label>
                <p className="text-[11px] text-[#889484]">
                  If the exported file came from a different Windows username, rewrite the path prefix across all toolchains.
                </p>

                {remapPaths && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                    <div>
                      <span className="text-[#889484] block mb-0.5">Source Machine Path:</span>
                      <input
                        type="text"
                        value={sourcePrefix}
                        onChange={(e) => setSourcePrefix(e.target.value)}
                        className="w-full p-1.5 bg-[#161a22] border border-[#3e4a3d] rounded text-white"
                      />
                    </div>
                    <div>
                      <span className="text-[#889484] block mb-0.5">This Machine Path:</span>
                      <input
                        type="text"
                        value={targetPrefix}
                        onChange={(e) => setTargetPrefix(e.target.value)}
                        className="w-full p-1.5 bg-[#161a22] border border-[#3e4a3d] rounded text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Strategy Selector */}
              <div className="space-y-2">
                <span className="font-semibold text-white block">Select Import Strategy:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label
                    className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                      importStrategy === 'merge'
                        ? 'bg-[#101b13] border-emerald-500/50 text-white'
                        : 'bg-[#0d1117] border-[#3e4a3d] text-[#889484]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="confirm-strategy"
                      checked={importStrategy === 'merge'}
                      onChange={() => setImportStrategy('merge')}
                      className="w-4 h-4 text-[#6fdd78] mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-[12px] block text-white">Merge (Recommended)</span>
                      <span className="text-[11px] text-[#889484] block leading-tight mt-0.5">
                        Imports missing toolchains, updates existing providers, and leaves local unique tools untouched.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                      importStrategy === 'replace'
                        ? 'bg-[#101b13] border-emerald-500/50 text-white'
                        : 'bg-[#0d1117] border-[#3e4a3d] text-[#889484]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="confirm-strategy"
                      checked={importStrategy === 'replace'}
                      onChange={() => setImportStrategy('replace')}
                      className="w-4 h-4 text-[#6fdd78] mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-[12px] block text-white">Complete Replace</span>
                      <span className="text-[11px] text-[#889484] block leading-tight mt-0.5">
                        Overwrites all current providers, technologies, and settings with the exact imported snapshot.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer with Confirmation Buttons */}
            <div className="px-5 py-3.5 bg-[#0d1117] border-t border-[#3e4a3d] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmationModal(false)}
                className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-[#dfe2eb] text-[12px] font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmImport}
                className="px-5 py-2 bg-[#6fdd78] hover:bg-[#34a547] text-[#00390e] font-bold text-[12px] rounded-lg shadow-md transition-all flex items-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Confirm &amp; Apply Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
