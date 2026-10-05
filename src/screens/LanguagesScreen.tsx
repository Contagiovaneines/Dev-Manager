import React, { useState, useMemo } from 'react';
import { ToolchainItem, ScreenType } from '../types';

interface LanguagesScreenProps {
  languages: ToolchainItem[];
  onNavigate: (screen: ScreenType) => void;
  onOpenConflictModal: () => void;
  onOpenCustomSdkModal: () => void;
  onInstallLanguage: (id: string) => void;
  onOpenTechDetails?: (techId: string) => void;
}

export const LanguagesScreen: React.FC<LanguagesScreenProps> = ({
  languages,
  onNavigate,
  onOpenConflictModal,
  onOpenCustomSdkModal,
  onInstallLanguage,
  onOpenTechDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'installed' | 'not-installed' | 'updates'>('all');
  const [sortBy, setSortBy] = useState<'status' | 'name' | 'updates'>('status');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [doctorChecking, setDoctorChecking] = useState(false);
  const [doctorSuccess, setDoctorSuccess] = useState(false);

  const handleCopyPath = (path: string, id: string) => {
    navigator.clipboard?.writeText(path);
    setCopiedPath(id);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const handleDoctorCheck = () => {
    setDoctorChecking(true);
    setDoctorSuccess(false);
    setTimeout(() => {
      setDoctorChecking(false);
      setDoctorSuccess(true);
      setTimeout(() => setDoctorSuccess(false), 3000);
    }, 1000);
  };

  const filteredAndSortedLanguages = useMemo(() => {
    let result = languages.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.vendor.toLowerCase().includes(q) ||
        (item.path && item.path.toLowerCase().includes(q)) ||
        (item.notes && item.notes.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (filterTab === 'installed') return item.installed;
      if (filterTab === 'not-installed') return !item.installed;
      if (filterTab === 'updates') return item.hasUpdate;
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'updates') {
        const aUp = a.hasUpdate ? 1 : 0;
        const bUp = b.hasUpdate ? 1 : 0;
        return bUp - aUp;
      }
      // status: installed first
      const aInst = a.installed ? 1 : 0;
      const bInst = b.installed ? 1 : 0;
      return bInst - aInst;
    });

    return result;
  }, [languages, searchQuery, filterTab, sortBy]);

  const installedCount = languages.filter((l) => l.installed).length;
  const notInstalledCount = languages.filter((l) => !l.installed).length;
  const updatesCount = languages.filter((l) => l.hasUpdate).length;

  return (
    <div className="flex flex-col w-full">
      {/* Breadcrumb & Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#889484]">
            <span>Environment</span>
            <span>/</span>
            <span className="text-[#dfe2eb]">Languages &amp; Runtimes</span>
          </div>
          <h1 className="text-[24px] font-bold text-[#dfe2eb] tracking-tight">Languages</h1>
          <p className="text-[13px] text-[#becab9]">
            Manage programming languages, compilers, active toolchains, and environment paths.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDoctorCheck}
            disabled={doctorChecking}
            className="flex items-center gap-1.5 h-8 px-3 rounded bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] text-[#dfe2eb] text-[12px] font-medium shadow-sm transition-all"
          >
            <span
              className={`material-symbols-outlined text-[16px] ${
                doctorChecking
                  ? 'animate-spin text-[#6fdd78]'
                  : doctorSuccess
                  ? 'text-[#6fdd78]'
                  : 'text-[#fabc45]'
              }`}
            >
              {doctorChecking ? 'sync' : doctorSuccess ? 'check_circle' : 'health_and_safety'}
            </span>
            <span>
              {doctorChecking
                ? 'Checking...'
                : doctorSuccess
                ? 'All Path Runtimes Intact'
                : 'Doctor Check'}
            </span>
          </button>

          <button
            onClick={() => onNavigate('catalog')}
            className="flex items-center gap-1.5 h-8 px-3 rounded bg-[#21262d] hover:bg-[#30363d] border border-emerald-500/40 text-emerald-400 font-semibold text-[12px] shadow-sm transition-all"
            title="Browse extended catalog of 30+ programming languages and runtimes"
          >
            <span className="material-symbols-outlined text-[16px]">hub</span>
            <span>Tech Catalog (30+)</span>
          </button>

          <button
            onClick={onOpenCustomSdkModal}
            className="flex items-center gap-1.5 h-8 px-3 rounded bg-[#6fdd78] hover:bg-[#34a547] text-[#00390e] font-semibold text-[12px] shadow-sm transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>Add Custom Language / SDK Path</span>
          </button>
        </div>
      </div>

      {/* Diagnostic Banner & Telemetry Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <div className="flex items-center gap-3 p-2.5 rounded bg-[#1c2026] border border-[#3e4a3d] shadow-sm">
          <div className="w-8 h-8 rounded bg-[#262a31] flex items-center justify-center text-[#6fdd78]">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider font-bold">
              Active Runtimes
            </span>
            <span className="text-[14px] font-bold text-[#dfe2eb]">
              {installedCount} <span className="font-mono text-[11px] text-[#6fdd78] font-normal">Installed</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded bg-[#1c2026] border border-[#3e4a3d] shadow-sm">
          <div className="w-8 h-8 rounded bg-[#262a31] flex items-center justify-center text-[#fabc45]">
            <span className="material-symbols-outlined text-[18px]">sync_problem</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider font-bold">
              Pending Patches
            </span>
            <span className="text-[14px] font-bold text-[#dfe2eb]">
              {updatesCount} <span className="font-mono text-[11px] text-[#fabc45] font-normal">Updates Ready</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded bg-[#1c2026] border border-[#3e4a3d] shadow-sm">
          <div className="w-8 h-8 rounded bg-[#262a31] flex items-center justify-center text-[#aac7ff]">
            <span className="material-symbols-outlined text-[18px]">account_tree</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider font-bold">
              Path Variables
            </span>
            <span className="text-[14px] font-bold text-[#dfe2eb]">
              18 <span className="font-mono text-[11px] text-[#889484] font-normal">Mapped</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded bg-[#1c2026] border border-[#3e4a3d] shadow-sm">
          <div className="w-8 h-8 rounded bg-[#262a31] flex items-center justify-center text-[#889484]">
            <span className="material-symbols-outlined text-[18px]">cloud_download</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider font-bold">
              Available Catalog
            </span>
            <span className="text-[14px] font-bold text-[#dfe2eb]">
              {notInstalledCount} <span className="font-mono text-[11px] text-[#889484] font-normal">Installable</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-2 rounded bg-[#1c2026] border border-[#3e4a3d] shadow-sm mb-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined text-[#889484] text-[16px] absolute left-2.5 top-1/2 -translate-y-1/2">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search languages, aliases, toolchains (Ctrl+F)..."
            className="w-full h-8 pl-8 pr-16 rounded bg-[#0a0e14] border border-[#3e4a3d] text-[#dfe2eb] font-mono text-[11px] placeholder:text-[#889484] focus:outline-none focus:border-[#6fdd78] transition-colors"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <kbd className="px-1 py-0.5 rounded bg-[#262a31] font-mono text-[10px] text-[#becab9]">
              Ctrl+F
            </kbd>
          </div>
        </div>

        {/* Segmented Category Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#0a0e14] p-0.5 rounded border border-[#3e4a3d]">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1 rounded text-[12px] font-medium flex items-center gap-1.5 transition-colors ${
              filterTab === 'all'
                ? 'bg-[#262a31] text-[#dfe2eb] font-semibold'
                : 'text-[#becab9] hover:text-[#dfe2eb]'
            }`}
          >
            <span>All</span>
            <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-[#1c2026] text-[#dfe2eb]">
              {languages.length}
            </span>
          </button>

          <button
            onClick={() => setFilterTab('installed')}
            className={`px-3 py-1 rounded text-[12px] font-medium flex items-center gap-1.5 transition-colors ${
              filterTab === 'installed'
                ? 'bg-[#262a31] text-[#dfe2eb] font-semibold'
                : 'text-[#becab9] hover:text-[#dfe2eb]'
            }`}
          >
            <span>Installed</span>
            <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-[#1c2026] text-[#6fdd78]">
              {installedCount}
            </span>
          </button>

          <button
            onClick={() => setFilterTab('not-installed')}
            className={`px-3 py-1 rounded text-[12px] font-medium flex items-center gap-1.5 transition-colors ${
              filterTab === 'not-installed'
                ? 'bg-[#262a31] text-[#dfe2eb] font-semibold'
                : 'text-[#becab9] hover:text-[#dfe2eb]'
            }`}
          >
            <span>Not Installed</span>
            <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-[#1c2026] text-[#889484]">
              {notInstalledCount}
            </span>
          </button>

          <button
            onClick={() => setFilterTab('updates')}
            className={`px-3 py-1 rounded text-[12px] font-medium flex items-center gap-1.5 transition-colors ${
              filterTab === 'updates'
                ? 'bg-[#262a31] text-[#dfe2eb] font-semibold'
                : 'text-[#becab9] hover:text-[#dfe2eb]'
            }`}
          >
            <span>Updates</span>
            <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-[#bd8708] text-[#392600] font-bold">
              {updatesCount}
            </span>
          </button>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-1.5 text-[12px] text-[#becab9]">
          <span className="font-mono text-[11px] text-[#889484]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-8 px-2 rounded bg-[#0a0e14] border border-[#3e4a3d] text-[#dfe2eb] text-[12px] focus:outline-none cursor-pointer"
          >
            <option value="status">Status (Active first)</option>
            <option value="name">Name (A-Z)</option>
            <option value="updates">Pending Updates</option>
          </select>
        </div>
      </div>

      {/* Languages Catalog List Container */}
      <div className="flex flex-col gap-1.5 mb-4">
        {filteredAndSortedLanguages.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col lg:flex-row lg:items-center justify-between p-3 rounded bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] transition-colors shadow-sm"
          >
            {/* Identity & Icon */}
            <div className="flex items-center gap-3 min-w-[260px]">
              <div
                className="w-10 h-10 rounded bg-[#0a0e14] border border-[#3e4a3d] flex items-center justify-center shrink-0"
                style={{ color: item.iconColor }}
              >
                <span className="material-symbols-outlined text-[24px]">{item.iconName}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[14px] font-bold text-[#dfe2eb]">{item.name}</span>
                  {item.installed ? (
                    <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-[#00390e] text-[#6fdd78]">
                      INSTALLED
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-[#31353c] text-[#889484]">
                      NOT INSTALLED
                    </span>
                  )}
                  {item.hasUpdate && (
                    <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-[#bd8708] text-[#392600]">
                      UPDATE
                    </span>
                  )}
                  {item.id === 'dart' && (
                    <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-[#31353c] text-[#becab9]">
                      VIA FLUTTER
                    </span>
                  )}
                </div>
                <span className="text-[12px] text-[#becab9] truncate">{item.vendor}</span>
              </div>
            </div>

            {/* Path & Versioning Telemetry */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 my-2 lg:my-0 flex-1 px-3">
              <div className="flex flex-col min-w-[190px]">
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <span className="text-[#889484]">Active:</span>
                  {item.installed && item.activeVersion ? (
                    <>
                      <span className="text-[#6fdd78] font-medium">{item.activeVersion}</span>
                      {item.activeVariant && (
                        <span className="text-[#889484] text-[10px]">({item.activeVariant})</span>
                      )}
                    </>
                  ) : (
                    <span className="text-[#889484] italic">Not detected in PATH</span>
                  )}
                </div>
                <span className="text-[12px] text-[#becab9] truncate">{item.notes}</span>
              </div>

              {item.path ? (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0a0e14] border border-[#3e4a3d] font-mono text-[11px] text-[#889484] max-w-sm truncate">
                  <span className="material-symbols-outlined text-[14px]">folder</span>
                  <span className="truncate">{item.path}</span>
                  <button
                    onClick={() => handleCopyPath(item.path!, item.id)}
                    className="hover:text-[#dfe2eb] ml-auto p-0.5 transition-colors"
                    title="Copy path"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copiedPath === item.id ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>
              ) : item.wingetId ? (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0a0e14] border border-[#3e4a3d] font-mono text-[11px] text-[#aac7ff]">
                  <span className="material-symbols-outlined text-[14px]">terminal</span>
                  <span>Winget ID: {item.wingetId}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0a0e14] border border-[#3e4a3d] font-mono text-[11px] text-[#889484]">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  <span>Requires installation</span>
                </div>
              )}

              {item.hasUpdate && item.updateNote ? (
                <div className="flex items-center gap-1 font-mono text-[11px] text-[#fabc45]">
                  <span className="material-symbols-outlined text-[15px]">arrow_circle_up</span>
                  <span>{item.updateNote}</span>
                </div>
              ) : item.installed ? (
                <div className="flex items-center gap-1 font-mono text-[11px] text-[#889484]">
                  <span className="material-symbols-outlined text-[15px] text-[#6fdd78]">check_circle</span>
                  <span>Verified &amp; active</span>
                </div>
              ) : null}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 self-end lg:self-center shrink-0">
              {onOpenTechDetails && (
                <button
                  onClick={() => onOpenTechDetails(item.id)}
                  className="h-8 px-2.5 rounded bg-[#21262d] hover:bg-[#30363d] text-slate-300 hover:text-emerald-400 text-[12px] font-medium flex items-center gap-1 transition-colors border border-[#3e4a3d]"
                  title="View tech metadata, capabilities and documentation"
                >
                  <span className="material-symbols-outlined text-[15px]">info</span>
                  <span className="hidden sm:inline">Details</span>
                </button>
              )}

              {item.installed ? (
                <>
                  <button
                    onClick={() => {
                      if (item.id === 'java') {
                        onNavigate('jdk-details');
                      } else {
                        onOpenConflictModal();
                      }
                    }}
                    className="h-8 px-3 rounded bg-[#31353c] hover:bg-[#353940] text-[#dfe2eb] text-[12px] font-medium flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">tune</span>
                    <span>Manage Versions</span>
                  </button>
                  <button
                    onClick={() => onOpenTechDetails && onOpenTechDetails(item.id)}
                    className="h-8 w-8 rounded bg-[#31353c] hover:bg-[#353940] text-[#dfe2eb] flex items-center justify-center transition-colors"
                    title="Technology capabilities & diagnostics"
                  >
                    <span className="material-symbols-outlined text-[16px]">more_vert</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onInstallLanguage(item.id)}
                  className="h-8 px-3.5 rounded bg-[#6fdd78] hover:bg-[#34a547] text-[#00390e] font-semibold text-[12px] flex items-center gap-1 shadow-sm transition-colors active:scale-95"
                >
                  <span className="material-symbols-outlined text-[15px]">download</span>
                  <span>Install {item.name}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Catalog Discovery Footer Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#161a22] to-[#1c222c] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">hub</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Extensible Technology Catalog</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore 30+ programming languages, runtimes, package managers, and SDKs with official docs and provider integration.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('catalog')}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-black hover:bg-emerald-400 transition-colors shadow shrink-0 self-start sm:self-auto flex items-center gap-1.5"
        >
          <span>Open Tech Catalog</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>

      {/* Bottom Feedback and Health Status Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-2.5 rounded bg-[#1c2026] border border-[#3e4a3d] shadow-sm font-mono text-[11px] text-[#becab9]">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#6fdd78] animate-pulse"></span>
          <span className="text-[#dfe2eb] font-medium">
            Showing {filteredAndSortedLanguages.length} languages • {installedCount} installed • {updatesCount} updates available
          </span>
        </div>
        <div className="flex items-center gap-3 mt-2 sm:mt-0 text-[#889484]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            <span>Registry sync: up-to-date</span>
          </span>
          <span>|</span>
          <button
            onClick={() => onNavigate('scan-progress')}
            className="hover:text-[#dfe2eb] flex items-center gap-1 transition-colors cursor-pointer text-[#6fdd78]"
          >
            <span className="material-symbols-outlined text-[14px]">refresh</span>
            <span>Re-scan System PATH</span>
          </button>
        </div>
      </div>
    </div>
  );
};
