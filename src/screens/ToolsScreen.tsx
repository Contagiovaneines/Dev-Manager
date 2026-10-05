import React, { useState, useMemo } from 'react';
import { ToolItem, TOOLS_DATA } from '../data/mockData';
import { ScreenType } from '../types';

interface ToolsScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenTechDetails?: (techId: string) => void;
  onExecuteCommand?: (cmd: string) => void;
}

export const ToolsScreen: React.FC<ToolsScreenProps> = ({
  onNavigate,
  onOpenTechDetails,
  onExecuteCommand,
}) => {
  const [tools, setTools] = useState<ToolItem[]>(TOOLS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [healthChecking, setHealthChecking] = useState(false);
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPath = (path: string, id: string) => {
    navigator.clipboard?.writeText(path);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCheckAllHealth = () => {
    setHealthChecking(true);
    setHealthStatus(null);
    setTimeout(() => {
      setHealthChecking(false);
      setHealthStatus('All 14 CLI executables responded successfully on system PATH.');
      setTimeout(() => setHealthStatus(null), 4000);
    }, 1200);
  };

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        tool.name.toLowerCase().includes(q) ||
        tool.path.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) return false;
      return true;
    });
  }, [tools, searchQuery, selectedCategory]);

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
            <span className="text-[#6fdd78] font-medium">TOOLS &amp; CLIS</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] font-bold text-[#dfe2eb] tracking-tight">Developer Tools</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1c2026] text-[#6fdd78] border border-[#3e4a3d] font-mono text-[11px] font-bold">
              14 INSTALLED
            </span>
          </div>
          <p className="text-[13px] text-[#becab9] mt-0.5">
            Command-line interfaces, build automation engines, package managers, and container daemons.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCheckAllHealth}
            disabled={healthChecking}
            className="flex items-center gap-1.5 h-8 px-3 rounded bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] text-[#dfe2eb] text-[12px] font-medium shadow-sm transition-all"
          >
            <span
              className={`material-symbols-outlined text-[16px] ${
                healthChecking ? 'animate-spin text-[#6fdd78]' : 'text-[#6fdd78]'
              }`}
            >
              {healthChecking ? 'sync' : 'health_and_safety'}
            </span>
            <span>{healthChecking ? 'Probing 14 Tools...' : 'Check All CLI Health'}</span>
          </button>

          <button
            onClick={() => onExecuteCommand && onExecuteCommand('Get-Command git, docker, winget, scoop, cmake, ninja, gradle, mvn, psql, terraform, aws, gcloud, code | Select-Object Name, Source')}
            className="flex items-center gap-1.5 h-8 px-3 rounded bg-[#262a31] hover:bg-[#353940] border border-[#3e4a3d] text-[#dfe2eb] text-[12px] font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[#aac7ff] text-[16px]">terminal</span>
            <span>Probe via PowerShell</span>
          </button>
        </div>
      </div>

      {healthStatus && (
        <div className="mb-4 p-3 bg-[#101b13] border border-emerald-500/40 text-emerald-400 rounded-lg text-[12px] font-medium flex items-center gap-2 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{healthStatus}</span>
        </div>
      )}

      {/* Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <div className="flex items-center gap-3 p-2.5 rounded bg-[#1c2026] border border-[#3e4a3d] shadow-sm">
          <div className="w-8 h-8 rounded bg-[#262a31] flex items-center justify-center text-[#6fdd78]">
            <span className="material-symbols-outlined text-[18px]">build</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider font-bold">
              Build Systems
            </span>
            <span className="text-[14px] font-bold text-[#dfe2eb]">CMake, Ninja, Gradle, Maven</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded bg-[#1c2026] border border-[#3e4a3d] shadow-sm">
          <div className="w-8 h-8 rounded bg-[#262a31] flex items-center justify-center text-[#58a6ff]">
            <span className="material-symbols-outlined text-[18px]">apps</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider font-bold">
              Package Managers
            </span>
            <span className="text-[14px] font-bold text-[#dfe2eb]">WinGet, Scoop, Choco</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded bg-[#1c2026] border border-[#3e4a3d] shadow-sm">
          <div className="w-8 h-8 rounded bg-[#262a31] flex items-center justify-center text-[#ff9900]">
            <span className="material-symbols-outlined text-[18px]">cloud</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider font-bold">
              Cloud &amp; DevOps
            </span>
            <span className="text-[14px] font-bold text-[#dfe2eb]">AWS, GCloud, Terraform</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded bg-[#1c2026] border border-[#3e4a3d] shadow-sm">
          <div className="w-8 h-8 rounded bg-[#262a31] flex items-center justify-center text-[#2496ed]">
            <span className="material-symbols-outlined text-[18px]">deployed_code</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider font-bold">
              Containers
            </span>
            <span className="text-[14px] font-bold text-[#dfe2eb]">Docker Engine v27.0</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-3 bg-[#181c22] p-2 rounded-lg border border-[#3e4a3d]">
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px] bg-[#0a0e14] px-2.5 py-1 rounded border border-[#3e4a3d]">
          <span className="material-symbols-outlined text-[#889484] text-[16px]">search</span>
          <input
            type="text"
            placeholder="Search tools by command, category, path (Git, Docker, WinGet, Gradle, Terraform)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[12px] text-[#dfe2eb] placeholder-[#889484] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-[12px]">
          {[
            { id: 'all', label: 'All (14)' },
            { id: 'build-tool', label: 'Build Tools' },
            { id: 'package-manager', label: 'Package Managers' },
            { id: 'cli', label: 'Cloud & CLIs' },
            { id: 'container', label: 'Containers' },
            { id: 'vcs', label: 'Git / VCS' },
            { id: 'database', label: 'Databases' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#262a31] text-[#dfe2eb] font-semibold border border-emerald-500/30'
                  : 'text-[#becab9] hover:text-[#dfe2eb]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tools List */}
      <div className="flex flex-col gap-2 mb-6">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="flex flex-col lg:flex-row lg:items-center justify-between p-3.5 rounded-xl bg-[#1c2026] hover:bg-[#222730] border border-[#3e4a3d] transition-all shadow-sm"
          >
            {/* Identity */}
            <div className="flex items-center gap-3 min-w-[280px]">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border"
                style={{
                  backgroundColor: `${tool.iconColor}15`,
                  color: tool.iconColor,
                  borderColor: `${tool.iconColor}30`,
                }}
              >
                <span className="material-symbols-outlined text-[22px]">{tool.iconName}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-[14px]">{tool.name}</h3>
                  <span className="px-2 py-0.2 rounded text-[10px] font-mono uppercase bg-[#0a0e14] text-[#889484] border border-[#3e4a3d]">
                    {tool.category}
                  </span>
                </div>
                <div className="text-[12px] text-[#becab9] mt-0.5 line-clamp-1">{tool.description}</div>
              </div>
            </div>

            {/* Version & Path */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 my-2 lg:my-0">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0a0e14] border border-[#3e4a3d] font-mono text-[11px] text-[#6fdd78]">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                <span>{tool.version}</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0a0e14] border border-[#3e4a3d] font-mono text-[11px] text-[#889484] max-w-[280px]">
                <span className="material-symbols-outlined text-[13px]">folder</span>
                <span className="truncate">{tool.path}</span>
                <button
                  onClick={() => handleCopyPath(tool.path, tool.id)}
                  className="text-[#889484] hover:text-[#dfe2eb] p-0.5 transition-colors ml-auto shrink-0"
                  title="Copy path"
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {copiedId === tool.id ? 'check' : 'content_copy'}
                  </span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
              <button
                onClick={() => onExecuteCommand && onExecuteCommand(tool.testCommand)}
                className="h-7 px-2.5 rounded bg-[#262a31] hover:bg-[#31353c] text-[#aac7ff] font-mono text-[11px] flex items-center gap-1 border border-[#3e4a3d] transition-colors"
                title={`Execute '${tool.testCommand}' in terminal`}
              >
                <span className="material-symbols-outlined text-[13px]">play_arrow</span>
                <span>{tool.testCommand}</span>
              </button>

              <button
                onClick={() => onOpenTechDetails && onOpenTechDetails(tool.id)}
                className="h-7 px-3 rounded bg-[#31353c] hover:bg-[#3d424b] text-[#dfe2eb] text-[11px] font-medium flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[13px]">info</span>
                <span>Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info Callout */}
      <div className="p-3.5 rounded-lg bg-[#181c22] border border-[#3e4a3d] flex items-center justify-between font-mono text-[11px] text-[#becab9]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#6fdd78] text-[16px]">verified</span>
          <span>All 14 tools are registered in either the System PATH or User PATH environment variable.</span>
        </div>
        <button
          onClick={() => onNavigate('installed')}
          className="text-[#6fdd78] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>View Installed Inventory</span>
          <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
