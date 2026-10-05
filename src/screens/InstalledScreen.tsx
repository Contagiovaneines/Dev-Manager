import React, { useState, useMemo } from 'react';
import { InstalledInventoryItem, INSTALLED_INVENTORY_DATA } from '../data/mockData';
import { ScreenType } from '../types';

interface InstalledScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenTechDetails?: (techId: string) => void;
  onExecuteCommand?: (cmd: string) => void;
}

export const InstalledScreen: React.FC<InstalledScreenProps> = ({
  onNavigate,
  onOpenTechDetails,
  onExecuteCommand,
}) => {
  const [inventory, setInventory] = useState<InstalledInventoryItem[]>(INSTALLED_INVENTORY_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyNotice, setVerifyNotice] = useState<string | null>(null);

  const totalDiskMb = useMemo(() => {
    return inventory.reduce((acc, item) => acc + item.diskSizeMb, 0);
  }, [inventory]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVerifyIntegrity = () => {
    setVerifying(true);
    setVerifyNotice(null);
    setTimeout(() => {
      setVerifying(false);
      setVerifyNotice('Disk audit complete: All 12 toolchains and binaries exist at target paths with valid digital signatures.');
      setTimeout(() => setVerifyNotice(null), 4000);
    }, 1200);
  };

  const handleExportInventory = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(inventory, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `windows-toolchains-inventory-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    a.remove();
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.path.toLowerCase().includes(q) ||
        item.version.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (filterType !== 'all' && item.type.toLowerCase() !== filterType.toLowerCase()) return false;
      return true;
    });
  }, [inventory, searchQuery, filterType]);

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
            <span className="text-[#6fdd78] font-medium">INSTALLED INVENTORY</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] font-bold text-[#dfe2eb] tracking-tight">Installed Toolchains</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1c2026] text-[#6fdd78] border border-[#3e4a3d] font-mono text-[11px] font-bold">
              12 ACTIVE INSTALLATIONS
            </span>
          </div>
          <p className="text-[13px] text-[#becab9] mt-0.5">
            System-wide inventory of all languages, runtimes, frameworks, and developer tools installed on disk.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleVerifyIntegrity}
            disabled={verifying}
            className="flex items-center gap-1.5 h-8 px-3 rounded bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] text-[#dfe2eb] text-[12px] font-medium shadow-sm transition-all"
          >
            <span
              className={`material-symbols-outlined text-[16px] ${
                verifying ? 'animate-spin text-[#6fdd78]' : 'text-[#6fdd78]'
              }`}
            >
              {verifying ? 'sync' : 'verified_user'}
            </span>
            <span>{verifying ? 'Auditing Disk...' : 'Verify Disk Integrity'}</span>
          </button>

          <button
            onClick={handleExportInventory}
            className="flex items-center gap-1.5 h-8 px-3 rounded bg-[#21262d] hover:bg-[#30363d] border border-[#3e4a3d] text-[#dfe2eb] text-[12px] font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export Inventory</span>
          </button>
        </div>
      </div>

      {verifyNotice && (
        <div className="mb-4 p-3 bg-[#101b13] border border-emerald-500/40 text-emerald-400 rounded-lg text-[12px] font-medium flex items-center gap-2 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{verifyNotice}</span>
        </div>
      )}

      {/* Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <div className="flex items-center gap-3 p-2.5 rounded bg-[#1c2026] border border-[#3e4a3d] shadow-sm">
          <div className="w-8 h-8 rounded bg-[#262a31] flex items-center justify-center text-[#6fdd78]">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider font-bold">
              Total Installed
            </span>
            <span className="text-[14px] font-bold text-[#dfe2eb]">12 Environments</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded bg-[#1c2026] border border-[#3e4a3d] shadow-sm">
          <div className="w-8 h-8 rounded bg-[#262a31] flex items-center justify-center text-[#aac7ff]">
            <span className="material-symbols-outlined text-[18px]">hard_drive</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider font-bold">
              Total Disk Usage
            </span>
            <span className="text-[14px] font-bold text-[#dfe2eb]">{(totalDiskMb / 1024).toFixed(2)} GB</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded bg-[#1c2026] border border-[#3e4a3d] shadow-sm">
          <div className="w-8 h-8 rounded bg-[#262a31] flex items-center justify-center text-[#3ddc84]">
            <span className="material-symbols-outlined text-[18px]">alt_route</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider font-bold">
              PATH Entries
            </span>
            <span className="text-[14px] font-bold text-[#dfe2eb]">11 Active in PATH</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded bg-[#1c2026] border border-[#3e4a3d] shadow-sm">
          <div className="w-8 h-8 rounded bg-[#262a31] flex items-center justify-center text-[#58a6ff]">
            <span className="material-symbols-outlined text-[18px]">shield</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider font-bold">
              Integrity Status
            </span>
            <span className="text-[14px] font-bold text-[#dfe2eb]">100% Verified</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-3 bg-[#181c22] p-2 rounded-lg border border-[#3e4a3d]">
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px] bg-[#0a0e14] px-2.5 py-1 rounded border border-[#3e4a3d]">
          <span className="material-symbols-outlined text-[#889484] text-[16px]">search</span>
          <input
            type="text"
            placeholder="Search installed by name, path, or version..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[12px] text-[#dfe2eb] placeholder-[#889484] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-[12px]">
          {[
            { id: 'all', label: 'All Types (12)' },
            { id: 'language', label: 'Languages' },
            { id: 'tool', label: 'Tools' },
            { id: 'framework', label: 'Frameworks' },
            { id: 'runtime', label: 'Runtimes' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                filterType === cat.id
                  ? 'bg-[#262a31] text-[#dfe2eb] font-semibold border border-emerald-500/30'
                  : 'text-[#becab9] hover:text-[#dfe2eb]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Installed Table */}
      <div className="rounded-xl border border-[#3e4a3d] overflow-hidden bg-[#1c2026] mb-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px] border-collapse">
            <thead>
              <tr className="bg-[#181c22] border-b border-[#3e4a3d] text-[#889484] font-mono text-[11px]">
                <th className="py-2.5 px-3"># PATH</th>
                <th className="py-2.5 px-3">Toolchain &amp; Version</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Disk Path</th>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Installed Date</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262a31]">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-[#21262d] transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px]">
                    {item.inPath ? (
                      <span className="px-1.5 py-0.5 rounded bg-[#101b13] text-[#6fdd78] border border-emerald-500/30 font-bold">
                        P{item.pathSequence}
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-[#262a31] text-[#889484]">
                        Manual
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-white text-[13px]">{item.name}</div>
                    <div className="font-mono text-[11px] text-[#6fdd78]">{item.version}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#0a0e14] text-[#aac7ff] border border-[#3e4a3d]">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#becab9]">
                    <div className="flex items-center gap-1.5 max-w-[320px]">
                      <span className="truncate">{item.path}</span>
                      <button
                        onClick={() => handleCopy(item.path, item.id)}
                        className="text-[#889484] hover:text-[#dfe2eb] p-0.5 transition-colors shrink-0"
                        title="Copy path"
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {copiedId === item.id ? 'check' : 'content_copy'}
                        </span>
                      </button>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#889484]">
                    {item.diskSizeMb} MB
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#889484]">
                    {item.installDate}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onExecuteCommand && onExecuteCommand(`Test-Path -Path "${item.path}"`)}
                      className="px-2.5 py-1 rounded bg-[#262a31] hover:bg-[#31353c] text-[#dfe2eb] font-mono text-[11px] border border-[#3e4a3d] transition-colors"
                      title="Verify path existence in PowerShell"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info Callout */}
      <div className="p-3.5 rounded-lg bg-[#181c22] border border-[#3e4a3d] flex items-center justify-between font-mono text-[11px] text-[#becab9]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#6fdd78] text-[16px]">info</span>
          <span>PATH priority determines which executable runs when duplicate command names exist (e.g. java.exe or node.exe).</span>
        </div>
        <button
          onClick={() => onNavigate('updates')}
          className="text-[#6fdd78] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Check Available Updates (3)</span>
          <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
