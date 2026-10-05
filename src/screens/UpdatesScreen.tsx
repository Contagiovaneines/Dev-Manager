import React, { useState } from 'react';
import { UpdateItem, UPDATES_DATA } from '../data/mockData';
import { ScreenType } from '../types';

interface UpdatesScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onExecuteCommand?: (cmd: string) => void;
  onShowNotification?: (msg: string) => void;
}

export const UpdatesScreen: React.FC<UpdatesScreenProps> = ({
  onNavigate,
  onExecuteCommand,
  onShowNotification,
}) => {
  const [updates, setUpdates] = useState<UpdateItem[]>(UPDATES_DATA);
  const [updatingAll, setUpdatingAll] = useState(false);
  const [updateProgress, setUpdateProgress] = useState<number>(0);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [expandedChangelogId, setExpandedChangelogId] = useState<string | null>(null);
  const [createSnapshot, setCreateSnapshot] = useState(true);
  const [preserveParallel, setPreserveParallel] = useState(true);

  const handleUpdateSingle = (item: UpdateItem) => {
    setUpdatingItemId(item.id);
    if (onExecuteCommand) {
      onExecuteCommand(item.installCommand);
    }
    setTimeout(() => {
      setUpdatingItemId(null);
      setUpdates((prev) => prev.filter((u) => u.id !== item.id));
      if (onShowNotification) {
        onShowNotification(`Successfully updated ${item.name} to ${item.targetVersion}.`);
      }
    }, 2000);
  };

  const handleUpdateAll = () => {
    setUpdatingAll(true);
    setUpdateProgress(15);

    if (onExecuteCommand) {
      onExecuteCommand('winget upgrade --all --include-unknown');
    }

    setTimeout(() => setUpdateProgress(45), 1000);
    setTimeout(() => setUpdateProgress(80), 2000);
    setTimeout(() => {
      setUpdateProgress(100);
      setUpdatingAll(false);
      setUpdates([]);
      if (onShowNotification) {
        onShowNotification('All 3 updates successfully downloaded, installed, and validated on Windows PATH.');
      }
    }, 3000);
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'security':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          label: 'Security Patch (High)',
          icon: 'security',
        };
      case 'feature':
        return {
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
          label: 'Feature Release',
          icon: 'upgrade',
        };
      default:
        return {
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          label: 'Maintenance / Servicing',
          icon: 'build',
        };
    }
  };

  return (
    <div className="flex flex-col w-full text-[#dfe2eb] select-none">
      {/* Top Banner / Breadcrumb & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-[#becab9] font-mono text-[11px] pb-1">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-[#6fdd78] transition-colors">
              DEV-WORKSTATION-01
            </button>
            <span>/</span>
            <span>ENVIRONMENT</span>
            <span>/</span>
            <span className="text-[#fabc45] font-medium">PENDING UPDATES</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] font-bold text-[#dfe2eb] tracking-tight">Pending Updates</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#bd8708]/20 text-[#fabc45] border border-[#bd8708]/40 font-mono text-[11px] font-bold">
              {updates.length} UPDATES AVAILABLE
            </span>
          </div>
          <p className="text-[13px] text-[#becab9] mt-0.5">
            Review security patches, cumulative servicing updates, and compiler upgrades across your toolchains.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onExecuteCommand && onExecuteCommand('winget upgrade')}
            className="flex items-center gap-1.5 h-8 px-3 rounded bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] text-[#dfe2eb] text-[12px] font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>Check for New Releases</span>
          </button>

          {updates.length > 0 && (
            <button
              onClick={handleUpdateAll}
              disabled={updatingAll}
              className="flex items-center gap-1.5 h-8 px-4 rounded bg-[#fabc45] hover:bg-[#dfa52b] text-[#392600] font-bold text-[12px] shadow-sm transition-all active:scale-95"
            >
              <span className={`material-symbols-outlined text-[16px] ${updatingAll ? 'animate-spin' : ''}`}>
                {updatingAll ? 'sync' : 'arrow_circle_up'}
              </span>
              <span>{updatingAll ? `Upgrading All (${updateProgress}%)...` : `Update All (${updates.length})`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar during Batch Update */}
      {updatingAll && (
        <div className="mb-4 p-4 rounded-xl bg-[#1c2026] border border-[#bd8708]/40 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-[12px] font-mono">
            <span className="text-[#fabc45] font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
              Executing Batch WinGet / Native MSI Upgrades...
            </span>
            <span className="text-white font-bold">{updateProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#0a0e14] overflow-hidden border border-[#3e4a3d]">
            <div
              className="h-full bg-gradient-to-r from-[#bd8708] to-[#fabc45] transition-all duration-300"
              style={{ width: `${updateProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Safety Policy Bar */}
      <div className="p-3.5 rounded-xl bg-[#1c2026] border border-[#3e4a3d] flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 text-[12px]">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer text-[#dfe2eb]">
            <input
              type="checkbox"
              checked={createSnapshot}
              onChange={(e) => setCreateSnapshot(e.target.checked)}
              className="w-4 h-4 text-[#6fdd78] rounded bg-[#0a0e14] border-[#3e4a3d]"
            />
            <span>Create configuration snapshot before applying upgrades</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-[#dfe2eb]">
            <input
              type="checkbox"
              checked={preserveParallel}
              onChange={(e) => setPreserveParallel(e.target.checked)}
              className="w-4 h-4 text-[#6fdd78] rounded bg-[#0a0e14] border-[#3e4a3d]"
            />
            <span>Preserve previous LTS runtime versions in parallel</span>
          </label>
        </div>

        <span className="font-mono text-[11px] text-[#6fdd78] flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">shield</span>
          Safe Rollback Enabled
        </span>
      </div>

      {/* Updates List */}
      {updates.length === 0 ? (
        <div className="p-12 text-center bg-[#1c2026] rounded-2xl border border-[#3e4a3d] space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <span className="material-symbols-outlined text-3xl">check_circle</span>
          </div>
          <h3 className="text-base font-bold text-white">Your Development Environment is Up to Date</h3>
          <p className="text-xs text-[#becab9] max-w-md mx-auto">
            All toolchains, compilers, runtimes, and developer tools match the latest stable release channels.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 bg-[#262a31] text-[#dfe2eb] text-xs font-semibold rounded-xl hover:bg-[#31353c]"
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {updates.map((item) => {
            const sev = getSeverityBadge(item.severity);
            const isUpdating = updatingItemId === item.id;
            const isExpanded = expandedChangelogId === item.id;

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#1c2026] border border-[#3e4a3d] hover:border-[#bd8708]/50 transition-all shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Left: Info */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-[#0a0e14] border border-[#3e4a3d] flex items-center justify-center text-[#fabc45] shrink-0">
                      <span className="material-symbols-outlined text-[24px]">system_update_alt</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-[15px]">{item.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${sev.bg} flex items-center gap-1 font-semibold`}>
                          <span className="material-symbols-outlined text-[12px]">{sev.icon}</span>
                          {sev.label}
                        </span>
                        <span className="text-[11px] text-[#889484] font-mono">• {item.category}</span>
                      </div>

                      {/* Versions Diff Banner */}
                      <div className="flex items-center gap-2 mt-1.5 font-mono text-[12px]">
                        <span className="px-2 py-0.5 rounded bg-[#0a0e14] text-[#889484] border border-[#3e4a3d]">
                          Current: <strong className="text-[#dfe2eb]">{item.currentVersion}</strong>
                        </span>
                        <span className="material-symbols-outlined text-[#fabc45] text-[16px]">trending_flat</span>
                        <span className="px-2 py-0.5 rounded bg-[#101b13] text-[#6fdd78] border border-emerald-500/30 font-bold">
                          New: {item.targetVersion}
                        </span>
                        <span className="text-[11px] text-[#889484]">({item.sizeMb} MB download)</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    <button
                      onClick={() => setExpandedChangelogId(isExpanded ? null : item.id)}
                      className="h-8 px-3 rounded bg-[#262a31] hover:bg-[#31353c] text-[#dfe2eb] text-[12px] font-medium flex items-center gap-1 border border-[#3e4a3d] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isExpanded ? 'expand_less' : 'description'}
                      </span>
                      <span>Changelog</span>
                    </button>

                    <button
                      onClick={() => handleUpdateSingle(item)}
                      disabled={isUpdating || updatingAll}
                      className="h-8 px-4 rounded bg-[#6fdd78] hover:bg-[#34a547] text-[#00390e] font-bold text-[12px] flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                    >
                      <span className={`material-symbols-outlined text-[15px] ${isUpdating ? 'animate-spin' : ''}`}>
                        {isUpdating ? 'sync' : 'download'}
                      </span>
                      <span>{isUpdating ? 'Updating...' : 'Update Now'}</span>
                    </button>
                  </div>
                </div>

                {/* Changelog Accordion Body */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-[#3e4a3d] text-[12px] text-[#becab9] space-y-2 bg-[#0a0e14] p-3 rounded-lg border border-[#3e4a3d]">
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>Release Summary ({item.releaseDate}):</span>
                      <a
                        href={item.changelogUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#6fdd78] hover:underline flex items-center gap-1 text-[11px] font-mono"
                      >
                        Official Release Notes
                        <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                      </a>
                    </div>
                    <p className="leading-relaxed font-sans">{item.summary}</p>
                    <div className="font-mono text-[11px] text-[#aac7ff] bg-[#181c22] p-2 rounded border border-[#3e4a3d] flex items-center justify-between">
                      <span>CLI Command: {item.installCommand}</span>
                      <button
                        onClick={() => onExecuteCommand && onExecuteCommand(item.installCommand)}
                        className="text-[#6fdd78] hover:underline"
                      >
                        Run in Shell
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Info Callout */}
      <div className="p-3.5 rounded-lg bg-[#181c22] border border-[#3e4a3d] flex items-center justify-between font-mono text-[11px] text-[#becab9]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#fabc45] text-[16px]">info</span>
          <span>Automatic update checks run every 6 hours in the background according to your environment preferences.</span>
        </div>
        <button
          onClick={() => onNavigate('settings')}
          className="text-[#6fdd78] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Configure Update Policy</span>
          <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
