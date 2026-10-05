import React, { useState } from 'react';
import { TechnologyMetadata, TechnologyProvider, TechnologyInstallation } from '../types';

interface TechnologyDetailModalProps {
  technology: TechnologyMetadata | null;
  provider: TechnologyProvider | null;
  isOpen: boolean;
  onClose: () => void;
  onSwitchActiveVersion?: (techId: string, installationId: string) => void;
  onExecuteCommand?: (command: string) => void;
  onAddInstallation?: (techId: string, installation: Omit<TechnologyInstallation, 'id' | 'technologyId'>) => void;
}

export const TechnologyDetailModal: React.FC<TechnologyDetailModalProps> = ({
  technology,
  provider,
  isOpen,
  onClose,
  onSwitchActiveVersion,
  onExecuteCommand,
  onAddInstallation,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'versions' | 'installation' | 'detection' | 'documentation'>('overview');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [showAddPath, setShowAddPath] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  const [newPath, setNewPath] = useState('');
  const [newVendor, setNewVendor] = useState('');

  if (!isOpen || !technology) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleRunInTerminal = (cmd: string) => {
    if (onExecuteCommand) {
      onExecuteCommand(cmd);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersion || !newPath) return;
    if (onAddInstallation) {
      onAddInstallation(technology.id, {
        version: newVersion,
        path: newPath,
        vendor: newVendor || 'Custom Local Path',
        isActive: false,
        method: 'custom',
        installedDate: new Date().toISOString().split('T')[0],
      });
    }
    setNewVersion('');
    setNewPath('');
    setNewVendor('');
    setShowAddPath(false);
  };

  const getSupportBadge = (level: string) => {
    switch (level) {
      case 'production-supported':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400',
          label: 'Production Supported',
          desc: 'Full native provider with automated detection, multi-version switching, and Windows environment integration.',
        };
      case 'community-supported':
        return {
          bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
          dot: 'bg-sky-400',
          label: 'Community Supported',
          desc: 'Managed via Windows package managers (WinGet / Scoop / Chocolatey) or partial provider automation.',
        };
      case 'catalog-only':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400',
          label: 'Catalog Only',
          desc: 'Curated technical reference with official documentation and commands. Automated Windows installation is not supported.',
        };
      default:
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          dot: 'bg-rose-400',
          label: 'Unsupported',
          desc: 'No reliable installation or runtime detection method available for the Windows platform.',
        };
    }
  };

  const tier = getSupportBadge(technology.supportLevel);
  const activeInstallation = provider?.installations?.find((i) => i.isActive) || provider?.installations?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#161a22] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#0d1117] border-b border-[#30363d] flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg shrink-0"
              style={{
                backgroundColor: `${technology.iconColor}20`,
                color: technology.iconColor,
                border: `1px solid ${technology.iconColor}40`,
              }}
            >
              <span className="material-symbols-outlined text-3xl">{technology.iconName}</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-white tracking-tight">{technology.name}</h2>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tier.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${tier.dot}`}></span>
                  {tier.label}
                </span>
                {technology.isRuntime && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    Runtime
                  </span>
                )}
                {technology.isCompiler && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    Compiler
                  </span>
                )}
                {technology.historical && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">
                    Historical
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                <span>Category: <strong className="text-slate-300 capitalize">{technology.category}</strong></span>
                <span>•</span>
                <span>Platforms: <strong className="text-slate-300">{technology.platforms.join(', ')}</strong></span>
                <span>•</span>
                <span>Architectures: <strong className="text-slate-300">{technology.architectures.join(', ')}</strong></span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#21262d] transition-colors"
            title="Close dialog (Esc)"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 bg-[#0d1117]/60 border-b border-[#30363d] flex gap-2 overflow-x-auto text-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3.5 border-b-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-base">dashboard</span>
            Overview & Capabilities
          </button>

          {provider && provider.capabilities.versions && (
            <button
              onClick={() => setActiveTab('versions')}
              className={`py-3 px-3.5 border-b-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'versions'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-base">alt_route</span>
              Version Switcher ({provider.installations.length})
            </button>
          )}

          <button
            onClick={() => setActiveTab('installation')}
            className={`py-3 px-3.5 border-b-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'installation'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-base">install_desktop</span>
            Installation & Package Managers
          </button>

          <button
            onClick={() => setActiveTab('detection')}
            className={`py-3 px-3.5 border-b-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'detection'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-base">rule</span>
            Detection Diagnostics
          </button>

          <button
            onClick={() => setActiveTab('documentation')}
            className={`py-3 px-3.5 border-b-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'documentation'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-base">menu_book</span>
            Documentation & Sources
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Support Tier Alert */}
              <div className={`p-4 rounded-xl border ${tier.bg} flex items-start gap-3.5`}>
                <span className="material-symbols-outlined text-2xl shrink-0 mt-0.5">info</span>
                <div>
                  <h4 className="font-semibold text-sm mb-0.5">{tier.label} Tier</h4>
                  <p className="text-xs opacity-90 leading-relaxed">{tier.desc}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Description</h3>
                <p className="text-sm text-slate-200 leading-relaxed bg-[#0d1117] p-4 rounded-xl border border-[#30363d]">
                  {technology.description}
                </p>
              </div>

              {/* Provider Capabilities Matrix */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Provider Capabilities Matrix
                  </h3>
                  <span className="text-xs text-slate-400">
                    Provider: {provider ? <strong className="text-emerald-400">{provider.name}</strong> : <span className="text-amber-400">None (Catalog Only)</span>}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Detect Installation', enabled: provider?.capabilities.detect ?? false, icon: 'radar' },
                    { label: 'Multiple Versions', enabled: provider?.capabilities.versions ?? false, icon: 'history' },
                    { label: 'Automated Install', enabled: provider?.capabilities.install ?? false, icon: 'download' },
                    { label: 'In-place Update', enabled: provider?.capabilities.update ?? false, icon: 'update' },
                    { label: 'Clean Uninstall', enabled: provider?.capabilities.uninstall ?? false, icon: 'delete_outline' },
                    { label: 'Switch Active Version', enabled: provider?.capabilities.activate ?? false, icon: 'toggle_on' },
                    { label: 'Official Documentation', enabled: true, icon: 'menu_book' },
                    { label: 'Registry / Env Sync', enabled: provider?.capabilities.activate ?? false, icon: 'settings_sync' },
                  ].map((cap, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                        cap.enabled
                          ? 'bg-[#121d17] border-emerald-500/30 text-emerald-300'
                          : 'bg-[#18181b]/50 border-[#30363d] text-slate-500'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-lg ${cap.enabled ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {cap.enabled ? 'check_circle' : 'cancel'}
                      </span>
                      <div>
                        <div className="text-xs font-medium leading-tight">{cap.label}</div>
                        <div className="text-[10px] opacity-75">{cap.enabled ? 'Supported' : 'Unavailable'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Classifications & Tags */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Classifications</h3>
                <div className="flex flex-wrap gap-2">
                  {technology.classifications.map((cls, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs bg-[#21262d] text-slate-300 border border-[#30363d]"
                    >
                      {cls}
                    </span>
                  ))}
                </div>
              </div>

              {/* Current Active Status */}
              {activeInstallation && (
                <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Current Active Version</span>
                    <div className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                      <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
                      {activeInstallation.version}
                      {activeInstallation.variant && (
                        <span className="text-xs font-normal text-slate-400">({activeInstallation.variant})</span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-slate-400 mt-1">{activeInstallation.path}</div>
                  </div>
                  <button
                    onClick={() => setActiveTab('versions')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#21262d] text-slate-200 hover:bg-[#30363d] transition-colors"
                  >
                    Manage Versions
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VERSIONS SWITCHER */}
          {activeTab === 'versions' && provider && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Installed Toolchain Versions</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select a version to broadcast Windows environment changes (PATH, environment variables).
                  </p>
                </div>
                <button
                  onClick={() => setShowAddPath(!showAddPath)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Register Custom Path
                </button>
              </div>

              {/* Add Custom Path Form */}
              {showAddPath && (
                <form onSubmit={handleAddCustom} className="p-4 bg-[#0d1117] border border-emerald-500/40 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Register Local Installation</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Version (e.g. 21.0.3)"
                      value={newVersion}
                      onChange={(e) => setNewVersion(e.target.value)}
                      required
                      className="px-3 py-1.5 text-xs bg-[#161a22] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Vendor / Flavor (e.g. GraalVM)"
                      value={newVendor}
                      onChange={(e) => setNewVendor(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-[#161a22] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Root Directory Path"
                      value={newPath}
                      onChange={(e) => setNewPath(e.target.value)}
                      required
                      className="px-3 py-1.5 text-xs bg-[#161a22] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddPath(false)}
                      className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs font-semibold bg-emerald-500 text-black rounded-lg hover:bg-emerald-400"
                    >
                      Save Installation
                    </button>
                  </div>
                </form>
              )}

              {/* Installations Table */}
              <div className="space-y-3">
                {provider.installations.length === 0 ? (
                  <div className="p-8 text-center bg-[#0d1117] rounded-xl border border-[#30363d] text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2 text-slate-600">dns</span>
                    <p className="text-sm">No local installations detected for this technology.</p>
                    <p className="text-xs text-slate-500 mt-1">Use the package manager tab to install an official release.</p>
                  </div>
                ) : (
                  provider.installations.map((inst) => (
                    <div
                      key={inst.id}
                      className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                        inst.isActive
                          ? 'bg-[#101b13] border-emerald-500/50 shadow-md shadow-emerald-950/20'
                          : 'bg-[#0d1117] border-[#30363d] hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <input
                          type="radio"
                          name={`active-${technology.id}`}
                          checked={inst.isActive}
                          onChange={() => onSwitchActiveVersion && onSwitchActiveVersion(technology.id, inst.id)}
                          className="w-4 h-4 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-0 bg-[#161a22] border-[#30363d] cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{inst.version}</span>
                            {inst.isActive && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Active Version
                              </span>
                            )}
                            {inst.variant && (
                              <span className="text-xs text-slate-400">• {inst.variant}</span>
                            )}
                          </div>
                          <div className="text-xs font-mono text-slate-400 mt-1 break-all">{inst.path}</div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                            <span>Vendor: {inst.vendor || 'Unknown'}</span>
                            <span>•</span>
                            <span>Method: {inst.method.toUpperCase()}</span>
                            {inst.sizeMb && <span>• {inst.sizeMb} MB</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!inst.isActive ? (
                          <button
                            onClick={() => onSwitchActiveVersion && onSwitchActiveVersion(technology.id, inst.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#21262d] text-slate-200 hover:bg-emerald-600 hover:text-white transition-colors"
                          >
                            Set as Active
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            In Use
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: INSTALLATION METHODS */}
          {activeTab === 'installation' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white">Supported Installation Methods</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Execute commands in Windows Terminal or copy one-liners for PowerShell.
                </p>
              </div>

              {provider?.packageManagers && provider.packageManagers.length > 0 ? (
                <div className="space-y-3">
                  {provider.packageManagers.map((pm, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
                            {pm.manager}
                          </span>
                          <span className="font-semibold text-sm text-white">{pm.label}</span>
                          {pm.verified && (
                            <span className="material-symbols-outlined text-emerald-400 text-sm" title="Verified source">
                              verified
                            </span>
                          )}
                        </div>
                        {pm.packageName && (
                          <span className="text-xs font-mono text-slate-400">ID: {pm.packageName}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 p-2.5 bg-[#161a22] rounded-lg border border-[#30363d] font-mono text-xs text-emerald-400">
                        <span className="truncate">{pm.command}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleCopy(pm.command)}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#21262d] transition-colors"
                            title="Copy command"
                          >
                            <span className="material-symbols-outlined text-base">
                              {copiedCmd === pm.command ? 'check' : 'content_copy'}
                            </span>
                          </button>
                          <button
                            onClick={() => handleRunInTerminal(pm.command)}
                            className="px-2 py-1 rounded text-[11px] font-sans font-semibold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
                            title="Run command in integrated Terminal drawer"
                          >
                            <span className="material-symbols-outlined text-xs">play_arrow</span>
                            Run
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-[#0d1117] border border-amber-500/30 text-amber-300/90 text-sm space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="material-symbols-outlined text-amber-400">info</span>
                    No Automated Package Manager Provider Configured
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300">
                    {technology.summaryInstructions ||
                      'This technology is currently cataloged with official documentation. An automated Windows installer has not been integrated into the provider engine yet.'}
                  </p>
                  {technology.downloadUrl && (
                    <div className="pt-2">
                      <a
                        href={technology.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40"
                      >
                        Visit Official Download Page
                        <span className="material-symbols-outlined text-xs">open_in_new</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Recommended Quick Commands */}
              {technology.recommendedCommands && technology.recommendedCommands.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                    Recommended CLI Commands
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {technology.recommendedCommands.map((cmd, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-[#0d1117] border border-[#30363d] rounded-xl flex items-center justify-between gap-2"
                      >
                        <div className="overflow-hidden">
                          <div className="text-[11px] text-slate-400">{cmd.label}</div>
                          <div className="font-mono text-xs text-white truncate">{cmd.command}</div>
                        </div>
                        <button
                          onClick={() => handleRunInTerminal(cmd.command)}
                          className="p-1.5 rounded text-slate-400 hover:text-emerald-400 hover:bg-[#21262d] shrink-0"
                          title="Execute in terminal"
                        >
                          <span className="material-symbols-outlined text-base">play_arrow</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DETECTION DIAGNOSTICS */}
          {activeTab === 'detection' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white">Detection Diagnostic Probes</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  How the system detects this technology on Windows (PATH, registry, executables, environment variables).
                </p>
              </div>

              {provider?.detectionMethods && provider.detectionMethods.length > 0 ? (
                <div className="space-y-2.5">
                  {provider.detectionMethods.map((dm, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 ${
                        dm.detected
                          ? 'bg-[#121d17] border-emerald-500/30'
                          : 'bg-[#18181b]/50 border-[#30363d]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined text-lg ${dm.detected ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {dm.detected ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white">{dm.label}</span>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                              {dm.type}
                            </span>
                          </div>
                          <div className="text-xs font-mono text-slate-400 mt-0.5">{dm.detail}</div>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold ${dm.detected ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {dm.detected ? 'Found' : 'Not Found'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-[#0d1117] rounded-xl border border-[#30363d] text-center text-slate-400 text-sm">
                  <span className="material-symbols-outlined text-3xl text-slate-600 mb-2">search_off</span>
                  <p>No automated detection probes defined for this technology.</p>
                </div>
              )}

              {technology.windowsRequirements && (
                <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d]">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Windows Requirements & Prerequisites
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    {technology.windowsRequirements}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: DOCUMENTATION & OFFICIAL SOURCES */}
          {activeTab === 'documentation' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white">Official Sources & Documentation</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Authentic official developer resources and release channels.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {technology.officialWebsite && (
                  <a
                    href={technology.officialWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-emerald-500/50 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">public</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                          Official Website
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {technology.officialWebsite}
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-emerald-400 text-sm">
                      open_in_new
                    </span>
                  </a>
                )}

                {technology.documentationUrl && (
                  <a
                    href={technology.documentationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-emerald-500/50 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">menu_book</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">
                          Official Documentation
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {technology.documentationUrl}
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-sky-400 text-sm">
                      open_in_new
                    </span>
                  </a>
                )}

                {technology.downloadUrl && (
                  <a
                    href={technology.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-emerald-500/50 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">download</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                          Official Downloads
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {technology.downloadUrl}
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-purple-400 text-sm">
                      open_in_new
                    </span>
                  </a>
                )}

                {technology.repositoryUrl && (
                  <a
                    href={technology.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-emerald-500/50 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">code</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                          Source Repository
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {technology.repositoryUrl}
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-orange-400 text-sm">
                      open_in_new
                    </span>
                  </a>
                )}
              </div>

              {/* Source Verification Badge */}
              <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center gap-3 text-xs text-slate-400">
                <span className={`material-symbols-outlined text-xl ${technology.sourceVerificationRequired ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {technology.sourceVerificationRequired ? 'verified_user' : 'verified'}
                </span>
                <div>
                  <strong className="text-slate-200">
                    {technology.sourceVerificationRequired
                      ? 'Source Verification Pending'
                      : 'Verified Official Documentation Source'}
                  </strong>
                  <div className="text-slate-400 mt-0.5">
                    Version Source: {technology.versionSource || 'Official project releases API'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-between">
          <div className="text-xs text-slate-400">
            ID: <span className="font-mono text-slate-300">{technology.id}</span>
          </div>

          <div className="flex items-center gap-2">
            {technology.officialWebsite && (
              <a
                href={technology.officialWebsite}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#21262d] text-slate-200 hover:bg-[#30363d] transition-colors flex items-center gap-1"
              >
                Website
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-black hover:bg-emerald-400 transition-colors shadow"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
