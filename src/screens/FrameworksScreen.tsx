import React, { useState, useMemo } from 'react';
import { FrameworkItem, FRAMEWORKS_DATA } from '../data/mockData';
import { ScreenType } from '../types';

interface FrameworksScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenTechDetails?: (techId: string) => void;
  onExecuteCommand?: (cmd: string) => void;
}

export const FrameworksScreen: React.FC<FrameworksScreenProps> = ({
  onNavigate,
  onOpenTechDetails,
  onExecuteCommand,
}) => {
  const [frameworks, setFrameworks] = useState<FrameworkItem[]>(FRAMEWORKS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'web' | 'mobile' | 'backend' | 'cross-platform'>('all');
  const [doctorChecking, setDoctorChecking] = useState(false);
  const [doctorSuccess, setDoctorSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPath = (path: string, id: string) => {
    navigator.clipboard?.writeText(path);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDoctorCheck = () => {
    setDoctorChecking(true);
    setDoctorSuccess(false);
    setTimeout(() => {
      setDoctorChecking(false);
      setDoctorSuccess(true);
      setTimeout(() => setDoctorSuccess(false), 3000);
    }, 1200);
  };

  const filteredFrameworks = useMemo(() => {
    return frameworks.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.vendor.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.runtimeDependency.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (filterCategory !== 'all' && item.category !== filterCategory) return false;
      return true;
    });
  }, [frameworks, searchQuery, filterCategory]);

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
            <span className="text-[#6fdd78] font-medium">FRAMEWORKS &amp; LIBRARIES</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] font-bold text-[#dfe2eb] tracking-tight">Frameworks</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1c2026] text-[#6fdd78] border border-[#3e4a3d] font-mono text-[11px] font-bold">
              6 DETECTED
            </span>
          </div>
          <p className="text-[13px] text-[#becab9] mt-0.5">
            Manage UI toolkits, web application frameworks, CLI generators, and runtime dependencies.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
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
                ? 'Validating Toolchains...'
                : doctorSuccess
                ? 'All 6 Frameworks Ready'
                : 'Framework Doctor'}
            </span>
          </button>

          <button
            onClick={() => onNavigate('catalog')}
            className="flex items-center gap-1.5 h-8 px-3 rounded bg-[#21262d] hover:bg-[#30363d] border border-emerald-500/40 text-emerald-400 font-semibold text-[12px] shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">hub</span>
            <span>Ecosystem Catalog</span>
          </button>
        </div>
      </div>

      {/* Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <div className="flex items-center gap-3 p-2.5 rounded bg-[#1c2026] border border-[#3e4a3d] shadow-sm">
          <div className="w-8 h-8 rounded bg-[#262a31] flex items-center justify-center text-[#6fdd78]">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider font-bold">
              Installed
            </span>
            <span className="text-[14px] font-bold text-[#dfe2eb]">6 Frameworks</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded bg-[#1c2026] border border-[#3e4a3d] shadow-sm">
          <div className="w-8 h-8 rounded bg-[#262a31] flex items-center justify-center text-[#aac7ff]">
            <span className="material-symbols-outlined text-[18px]">devices</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider font-bold">
              Multi-Platform
            </span>
            <span className="text-[14px] font-bold text-[#dfe2eb]">Flutter &amp; React Native</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded bg-[#1c2026] border border-[#3e4a3d] shadow-sm">
          <div className="w-8 h-8 rounded bg-[#262a31] flex items-center justify-center text-[#fabc45]">
            <span className="material-symbols-outlined text-[18px]">arrow_circle_up</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider font-bold">
              Pending Updates
            </span>
            <span className="text-[14px] font-bold text-[#dfe2eb]">1 Available</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded bg-[#1c2026] border border-[#3e4a3d] shadow-sm">
          <div className="w-8 h-8 rounded bg-[#262a31] flex items-center justify-center text-[#6fdd78]">
            <span className="material-symbols-outlined text-[18px]">code</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider font-bold">
              CLI Tooling
            </span>
            <span className="text-[14px] font-bold text-[#dfe2eb]">All Global CLIs Active</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-3 bg-[#181c22] p-2 rounded-lg border border-[#3e4a3d]">
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px] bg-[#0a0e14] px-2.5 py-1 rounded border border-[#3e4a3d]">
          <span className="material-symbols-outlined text-[#889484] text-[16px]">search</span>
          <input
            type="text"
            placeholder="Search frameworks (Flutter, Angular, React Native, Vite, Next.js, ASP.NET)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[12px] text-[#dfe2eb] placeholder-[#889484] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-[12px]">
          {[
            { id: 'all', label: 'All (6)' },
            { id: 'web', label: 'Web' },
            { id: 'mobile', label: 'Mobile' },
            { id: 'cross-platform', label: 'Cross-Platform' },
            { id: 'backend', label: 'Backend' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id as any)}
              className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                filterCategory === cat.id
                  ? 'bg-[#262a31] text-[#dfe2eb] font-semibold border border-emerald-500/30'
                  : 'text-[#becab9] hover:text-[#dfe2eb]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Frameworks Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {filteredFrameworks.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-[#1c2026] border border-[#3e4a3d] hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-sm"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: `${item.iconColor}15`,
                      color: item.iconColor,
                      borderColor: `${item.iconColor}30`,
                    }}
                  >
                    <span className="material-symbols-outlined text-[24px]">{item.iconName}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-[15px]">{item.name}</h3>
                    <div className="text-[11px] text-[#889484]">{item.vendor}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#101b13] text-[#6fdd78] border border-emerald-500/30 font-semibold">
                    Installed
                  </span>
                  {item.hasUpdate && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#bd8708]/20 text-[#fabc45] border border-[#bd8708]/40 font-bold">
                      Update
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-[12px] text-[#becab9] leading-relaxed mb-3">
                {item.description}
              </p>

              {/* Version & Runtime Dependency Specs */}
              <div className="space-y-1.5 font-mono text-[11px] mb-3">
                <div className="flex items-center justify-between p-2 rounded bg-[#0a0e14] border border-[#3e4a3d]">
                  <span className="text-[#889484]">Active Version:</span>
                  <span className="text-[#6fdd78] font-bold">{item.version}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#0a0e14] border border-[#3e4a3d]">
                  <span className="text-[#889484]">Runtime Dependency:</span>
                  <span className="text-[#aac7ff]">{item.runtimeDependency}</span>
                </div>
                {item.path && (
                  <div className="flex items-center justify-between p-2 rounded bg-[#0a0e14] border border-[#3e4a3d]">
                    <span className="text-[#889484] truncate max-w-[200px]">{item.path}</span>
                    <button
                      onClick={() => handleCopyPath(item.path!, item.id)}
                      className="text-[#889484] hover:text-[#dfe2eb] p-0.5 transition-colors shrink-0"
                      title="Copy path"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {copiedId === item.id ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#3e4a3d] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {item.cliCommand && (
                  <button
                    onClick={() => onExecuteCommand && onExecuteCommand(item.cliCommand!)}
                    className="px-2.5 py-1 rounded bg-[#262a31] hover:bg-[#31353c] text-[#aac7ff] font-mono text-[11px] flex items-center gap-1 border border-[#3e4a3d] transition-colors"
                    title={`Run ${item.cliCommand} in PowerShell terminal`}
                  >
                    <span className="material-symbols-outlined text-[13px]">terminal</span>
                    <span>{item.cliCommand.split(' ')[0]} test</span>
                  </button>
                )}
                <a
                  href={item.docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 rounded text-[#889484] hover:text-white hover:bg-[#262a31] text-[11px] flex items-center gap-1 transition-colors"
                >
                  <span>Docs</span>
                  <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                </a>
              </div>

              <button
                onClick={() => onOpenTechDetails && onOpenTechDetails(item.id === 'flutter' ? 'flutter' : item.id)}
                className="px-3 py-1 rounded bg-[#6fdd78]/20 hover:bg-[#6fdd78]/30 text-[#6fdd78] border border-emerald-500/30 text-[11px] font-semibold transition-colors flex items-center gap-1"
              >
                <span>Manage</span>
                <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info Callout */}
      <div className="p-3.5 rounded-lg bg-[#181c22] border border-[#3e4a3d] flex items-center justify-between font-mono text-[11px] text-[#becab9]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#6fdd78] text-[16px]">info</span>
          <span>Framework executables are shimmed to user and system PATH. To add Angular, Vue, or Next.js globally, use npm.</span>
        </div>
        <button
          onClick={() => onNavigate('tools')}
          className="text-[#6fdd78] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>View Build Tools</span>
          <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
