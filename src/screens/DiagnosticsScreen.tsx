import React, { useState } from 'react';
import { ScreenType, PathDiagnosticIssue, PathEntryItem } from '../types';
import { INITIAL_DIAGNOSTIC_ISSUES, INITIAL_PATH_ENTRIES } from '../data/diagnosticsData';

interface DiagnosticsScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onExecuteCommand?: (cmd: string) => void;
  onShowNotification?: (msg: string) => void;
}

export const DiagnosticsScreen: React.FC<DiagnosticsScreenProps> = ({
  onNavigate,
  onExecuteCommand,
  onShowNotification,
}) => {
  const [issues, setIssues] = useState<PathDiagnosticIssue[]>(INITIAL_DIAGNOSTIC_ISSUES);
  const [pathEntries, setPathEntries] = useState<PathEntryItem[]>(INITIAL_PATH_ENTRIES);
  const [activeTab, setActiveTab] = useState<'issues' | 'path-sequence' | 'variables'>('issues');
  const [issueFilter, setIssueFilter] = useState<'all' | 'critical' | 'warning' | 'conflict'>('all');
  const [pathFilter, setPathFilter] = useState<'all' | 'system' | 'user' | 'issues-only'>('all');
  const [pathSearch, setPathSearch] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [lastFixSummary, setLastFixSummary] = useState<string | null>(null);
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  // Health Score Calculation
  const unresolvedIssues = issues.filter((i) => !i.fixed);
  const totalIssues = issues.length;
  const fixedCount = totalIssues - unresolvedIssues.length;
  const healthScore = totalIssues > 0 ? Math.round(70 + (fixedCount / totalIssues) * 30) : 100;

  // 1. Quick Fix for a single issue
  const handleFixSingleIssue = (id: string) => {
    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, fixed: true };
        }
        return item;
      })
    );

    // Apply specific changes to path entries depending on issue
    if (id === 'issue-duplicate-git-path') {
      setPathEntries((prev) =>
        prev.filter((p) => p.id !== 'pe-9').map((p) => (p.id === 'pe-3' ? { ...p, isDuplicate: false } : p))
      );
    } else if (id === 'issue-orphaned-ruby') {
      setPathEntries((prev) => prev.filter((p) => p.id !== 'pe-4'));
    } else if (id === 'issue-java-home-conflict') {
      setPathEntries((prev) =>
        prev.map((p) => (p.id === 'pe-5' ? { ...p, isShadowed: false, toolchainTag: 'Java 17 (Secondary)' } : p))
      );
    } else if (id === 'issue-python-shadowing') {
      setPathEntries((prev) => {
        // Move Python ahead of WindowsApps
        const pythonEntry = prev.find((p) => p.id === 'pe-7');
        const withoutPython = prev.filter((p) => p.id !== 'pe-7');
        const winAppsIndex = withoutPython.findIndex((p) => p.id === 'pe-6');
        if (pythonEntry && winAppsIndex !== -1) {
          withoutPython.splice(winAppsIndex, 0, { ...pythonEntry, isShadowed: false });
          return withoutPython.map((p, idx) => ({ ...p, order: idx + 1 }));
        }
        return prev;
      });
    }

    const targetIssue = issues.find((i) => i.id === id);
    const msg = `Resolved: ${targetIssue?.title || 'Environment conflict fixed'}. Windows registry updated.`;
    setLastFixSummary(msg);
    if (onShowNotification) {
      onShowNotification(msg);
    }
  };

  // 2. Quick Fix All Detected Issues
  const handleQuickFixAll = () => {
    setIssues((prev) => prev.map((item) => ({ ...item, fixed: true })));

    // Clean up PATH entries:
    // 1. Remove orphaned ruby (pe-4)
    // 2. Remove duplicate Git (pe-9) and clear isDuplicate on pe-3
    // 3. Clear shadowed flags on Java and Python
    // 4. Reorder Python ahead of WindowsApps
    setPathEntries((prev) => {
      let filtered = prev.filter((p) => p.id !== 'pe-4' && p.id !== 'pe-9');
      filtered = filtered.map((p) => {
        if (p.id === 'pe-3') return { ...p, isDuplicate: false };
        if (p.id === 'pe-5') return { ...p, isShadowed: false, toolchainTag: 'Java 17 (Secondary Path)' };
        if (p.id === 'pe-7') return { ...p, isShadowed: false };
        return p;
      });

      // Elevate Python ahead of WindowsApps
      const pyIndex = filtered.findIndex((p) => p.id === 'pe-7');
      const winAppsIndex = filtered.findIndex((p) => p.id === 'pe-6');
      if (pyIndex !== -1 && winAppsIndex !== -1 && pyIndex > winAppsIndex) {
        const [pyEntry] = filtered.splice(pyIndex, 1);
        filtered.splice(winAppsIndex, 0, pyEntry);
      }

      return filtered.map((p, idx) => ({ ...p, order: idx + 1 }));
    });

    const summaryMsg =
      'Quick Fix executed: Aligned JAVA_HOME to Java 22, purged 1 orphaned directory, eliminated Git duplicate, elevated Python 3.12, and broadcasted WM_SETTINGCHANGE.';
    setLastFixSummary(summaryMsg);
    if (onShowNotification) {
      onShowNotification('All detected PATH and environment variable conflicts resolved!');
    }
  };

  // 3. Reset / Rollback issues
  const handleRollbackFixes = () => {
    setIssues(INITIAL_DIAGNOSTIC_ISSUES);
    setPathEntries(INITIAL_PATH_ENTRIES);
    setLastFixSummary(null);
    if (onShowNotification) {
      onShowNotification('Restored initial diagnostics snapshot.');
    }
  };

  // 4. Trigger simulated re-scan
  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (onShowNotification) {
        onShowNotification('Environment variable scan complete. Registry tree re-indexed.');
      }
    }, 800);
  };

  const handleCopyValue = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedVar(label);
    setTimeout(() => setCopiedVar(null), 2000);
    if (onShowNotification) {
      onShowNotification(`Copied ${label} to clipboard.`);
    }
  };

  // Filtered issues
  const filteredIssues = issues.filter((issue) => {
    if (issueFilter === 'critical') return issue.severity === 'critical';
    if (issueFilter === 'warning') return issue.severity === 'warning';
    if (issueFilter === 'conflict') return issue.category === 'variable-conflict';
    return true;
  });

  // Filtered PATH entries
  const filteredPathEntries = pathEntries.filter((entry) => {
    const matchesSearch =
      !pathSearch ||
      entry.path.toLowerCase().includes(pathSearch.toLowerCase()) ||
      (entry.toolchainTag && entry.toolchainTag.toLowerCase().includes(pathSearch.toLowerCase()));

    if (!matchesSearch) return false;

    if (pathFilter === 'system') return entry.scope.includes('HKLM');
    if (pathFilter === 'user') return entry.scope.includes('HKCU');
    if (pathFilter === 'issues-only') return !entry.exists || entry.isDuplicate || entry.isShadowed;
    return true;
  });

  return (
    <div className="flex flex-col w-full select-none pb-12 animate-in fade-in duration-150">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3e4a3d]">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#889484] mb-1">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
              Environment
            </button>
            <span>/</span>
            <span>Health &amp; Telemetry</span>
            <span>/</span>
            <span className="text-[#6fdd78] font-medium">Diagnostics</span>
          </div>

          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold text-white tracking-tight">System PATH &amp; Variable Diagnostics</h1>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                unresolvedIssues.length === 0
                  ? 'bg-[#101b13] text-[#6fdd78] border-emerald-500/30'
                  : 'bg-[#2d1215] text-[#ff8389] border-rose-500/30 animate-pulse'
              }`}
            >
              {unresolvedIssues.length === 0 ? 'All Systems Healthy' : `${unresolvedIssues.length} Issues Detected`}
            </span>
          </div>
          <p className="text-[12px] text-[#becab9] mt-0.5">
            Audit Windows environment variables, identify registry conflicts (JAVA_HOME, Python, PATH shadowing), and auto-resolve issues with Quick Fix.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRescan}
            disabled={isScanning}
            className="h-8 px-3 bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] rounded text-[#dfe2eb] text-[12px] font-medium transition-colors flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
            title="Perform fresh scan of HKLM and HKCU registry keys"
          >
            <span className={`material-symbols-outlined text-[16px] text-[#889484] ${isScanning ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>{isScanning ? 'Scanning...' : 'Re-scan'}</span>
          </button>

          {onExecuteCommand && (
            <button
              type="button"
              onClick={() => onExecuteCommand('devhub doctor --verbose')}
              className="h-8 px-3 bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] rounded text-[#aac7ff] text-[12px] font-medium transition-colors flex items-center gap-1.5 shadow-sm"
              title="Execute doctor diagnostic command in integrated terminal"
            >
              <span className="material-symbols-outlined text-[15px]">terminal</span>
              <span>Run Doctor</span>
            </button>
          )}

          {unresolvedIssues.length > 0 ? (
            <button
              type="button"
              onClick={handleQuickFixAll}
              className="h-8 px-4 bg-[#6fdd78] hover:bg-[#34a547] text-[#00390e] rounded text-[12px] font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/40 active:scale-95 animate-bounce-subtle"
              title="Automatically align JAVA_HOME, purge orphaned directories, and resolve path shadowing"
            >
              <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
              <span>Quick Fix All ({unresolvedIssues.length})</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRollbackFixes}
              className="h-8 px-3 bg-[#262a31] hover:bg-[#31353c] border border-[#3e4a3d] text-[#889484] hover:text-[#dfe2eb] rounded text-[12px] font-medium transition-colors flex items-center gap-1"
              title="Restore initial conflict states for testing"
            >
              <span className="material-symbols-outlined text-[15px]">history</span>
              <span>Rollback Snapshot</span>
            </button>
          )}
        </div>
      </div>

      {/* Resolution Success Banner */}
      {lastFixSummary && (
        <div className="mt-3 p-3.5 bg-[#101b13] border border-emerald-500/40 text-emerald-400 rounded-xl text-[12px] font-medium flex items-start sm:items-center justify-between gap-3 shadow-md animate-in fade-in duration-200">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-[#6fdd78] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[16px]">verified</span>
            </div>
            <div>
              <span className="font-bold text-white block">Environment Auto-Remediated</span>
              <span className="text-[#becab9] text-[11px]">{lastFixSummary}</span>
            </div>
          </div>
          <button
            onClick={() => setLastFixSummary(null)}
            className="text-emerald-400 hover:text-white shrink-0 p-1"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {/* Card 1: Health Score */}
        <div className="p-4 bg-[#181c22] border border-[#3e4a3d] rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider block">
              PATH Health Score
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span
                className={`text-[24px] font-bold font-mono ${
                  healthScore === 100 ? 'text-[#6fdd78]' : healthScore >= 80 ? 'text-[#fabc45]' : 'text-[#ff8389]'
                }`}
              >
                {healthScore}%
              </span>
              <span className="text-[11px] text-[#889484]">
                {healthScore === 100 ? 'Optimal' : `${unresolvedIssues.length} alerts`}
              </span>
            </div>
          </div>
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
              healthScore === 100
                ? 'bg-[#101b13] border-emerald-500/30 text-[#6fdd78]'
                : 'bg-[#2d1215] border-rose-500/30 text-[#ff8389]'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {healthScore === 100 ? 'verified_user' : 'warning'}
            </span>
          </div>
        </div>

        {/* Card 2: Environment Conflicts */}
        <div className="p-4 bg-[#181c22] border border-[#3e4a3d] rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider block">
              Variable Conflicts
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[24px] font-bold font-mono text-white">
                {issues.filter((i) => i.category === 'variable-conflict' && !i.fixed).length}
              </span>
              <span className="text-[11px] text-[#889484]">
                {issues.some((i) => i.id === 'issue-java-home-conflict' && !i.fixed)
                  ? 'JAVA_HOME mismatch'
                  : 'Synchronized'}
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#1c2026] border border-[#3e4a3d] flex items-center justify-center text-[#fabc45]">
            <span className="material-symbols-outlined text-[22px]">compare_arrows</span>
          </div>
        </div>

        {/* Card 3: Total PATH Entries */}
        <div className="p-4 bg-[#181c22] border border-[#3e4a3d] rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider block">
              PATH Entries Audited
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[24px] font-bold font-mono text-[#aac7ff]">{pathEntries.length}</span>
              <span className="text-[11px] text-[#889484]">
                {pathEntries.filter((p) => p.exists).length} verified valid
              </span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#1c2026] border border-[#3e4a3d] flex items-center justify-center text-[#aac7ff]">
            <span className="material-symbols-outlined text-[22px]">format_list_numbered</span>
          </div>
        </div>

        {/* Card 4: Registry Sync Status */}
        <div className="p-4 bg-[#181c22] border border-[#3e4a3d] rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider block">
              Windows Registry Scope
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[14px] font-bold font-mono text-[#6fdd78]">HKCU + HKLM</span>
              <span className="text-[11px] text-[#889484]">WM_SETTINGCHANGE</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#1c2026] border border-[#3e4a3d] flex items-center justify-center text-[#6fdd78]">
            <span className="material-symbols-outlined text-[22px]">broadcast_on_personal</span>
          </div>
        </div>
      </div>

      {/* Main Tab Controls */}
      <div className="flex items-center justify-between gap-3 mt-6 border-b border-[#3e4a3d] pb-2">
        <div className="flex items-center gap-1 bg-[#0a0e14] p-1 rounded-lg border border-[#3e4a3d] text-[12px]">
          <button
            type="button"
            onClick={() => setActiveTab('issues')}
            className={`px-3 py-1.5 rounded transition-all font-medium flex items-center gap-1.5 ${
              activeTab === 'issues'
                ? 'bg-[#262a31] text-white font-semibold shadow border border-emerald-500/30'
                : 'text-[#becab9] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#6fdd78]">troubleshoot</span>
            <span>Detected Issues ({unresolvedIssues.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('path-sequence')}
            className={`px-3 py-1.5 rounded transition-all font-medium flex items-center gap-1.5 ${
              activeTab === 'path-sequence'
                ? 'bg-[#262a31] text-white font-semibold shadow border border-emerald-500/30'
                : 'text-[#becab9] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#aac7ff]">alt_route</span>
            <span>PATH Sequence Evaluator ({pathEntries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('variables')}
            className={`px-3 py-1.5 rounded transition-all font-medium flex items-center gap-1.5 ${
              activeTab === 'variables'
                ? 'bg-[#262a31] text-white font-semibold shadow border border-emerald-500/30'
                : 'text-[#becab9] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#fabc45]">data_object</span>
            <span>Environment Variables</span>
          </button>
        </div>

        {/* Tab 1 Filter Pills */}
        {activeTab === 'issues' && (
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono">
            <button
              onClick={() => setIssueFilter('all')}
              className={`px-2 py-1 rounded transition-colors ${
                issueFilter === 'all' ? 'bg-[#262a31] text-white border border-[#3e4a3d]' : 'text-[#889484]'
              }`}
            >
              All ({issues.length})
            </button>
            <button
              onClick={() => setIssueFilter('critical')}
              className={`px-2 py-1 rounded transition-colors ${
                issueFilter === 'critical' ? 'bg-[#2d1215] text-[#ff8389] border border-rose-500/40' : 'text-[#889484]'
              }`}
            >
              Critical ({issues.filter((i) => i.severity === 'critical').length})
            </button>
            <button
              onClick={() => setIssueFilter('conflict')}
              className={`px-2 py-1 rounded transition-colors ${
                issueFilter === 'conflict' ? 'bg-[#271d0e] text-[#fabc45] border border-amber-500/40' : 'text-[#889484]'
              }`}
            >
              Conflicts
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: DETECTED ISSUES & CONFLICTS */}
      {activeTab === 'issues' && (
        <div className="space-y-3 mt-4">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className={`p-4 rounded-xl border transition-all ${
                issue.fixed
                  ? 'bg-[#14181f]/60 border-[#3e4a3d] opacity-75'
                  : issue.severity === 'critical'
                  ? 'bg-[#1c2026] border-rose-500/40 hover:border-rose-500/70 shadow-sm'
                  : 'bg-[#1c2026] border-[#3e4a3d] hover:border-emerald-500/40 shadow-sm'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  {/* Badges Bar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase border ${
                        issue.fixed
                          ? 'bg-[#101b13] text-[#6fdd78] border-emerald-500/30'
                          : issue.severity === 'critical'
                          ? 'bg-[#2d1215] text-[#ff8389] border-rose-500/40'
                          : issue.severity === 'warning'
                          ? 'bg-[#271d0e] text-[#fabc45] border-amber-500/40'
                          : 'bg-[#141d2b] text-[#aac7ff] border-blue-500/40'
                      }`}
                    >
                      {issue.fixed ? 'RESOLVED' : issue.severity}
                    </span>

                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#0a0e14] text-white border border-[#3e4a3d]">
                      {issue.variableName}
                    </span>

                    <span className="px-1.5 py-0.5 rounded font-mono text-[10px] text-[#889484] bg-[#161a22]">
                      Scope: {issue.scope}
                    </span>

                    <span className="text-[11px] font-mono text-[#889484]">{issue.category}</span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3
                      className={`text-[14px] font-bold ${
                        issue.fixed ? 'text-[#889484] line-through' : 'text-white'
                      }`}
                    >
                      {issue.title}
                    </h3>
                    <p className="text-[12px] text-[#becab9] mt-1 leading-relaxed">{issue.description}</p>
                  </div>

                  {/* Value Comparison Block */}
                  <div className="p-2.5 bg-[#0a0e14] rounded-lg border border-[#3e4a3d] font-mono text-[11px] space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                      <span className="text-[#889484] shrink-0 w-28">Current Value:</span>
                      <span className={issue.fixed ? 'text-[#889484]' : 'text-[#ff8389] break-all'}>
                        {issue.currentValue}
                      </span>
                    </div>

                    {issue.expectedValue && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 pt-0.5 border-t border-[#1c2026]">
                        <span className="text-[#6fdd78] shrink-0 w-28">Target Value:</span>
                        <span className="text-white break-all">{issue.expectedValue}</span>
                      </div>
                    )}
                  </div>

                  {/* Affected Binaries */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-[11px] text-[#889484]">Impacted Executables:</span>
                    {issue.affectedBinaries.map((bin) => (
                      <span
                        key={bin}
                        className="px-1.5 py-0.2 rounded bg-[#181c22] border border-[#3e4a3d] font-mono text-[10px] text-[#dfe2eb]"
                      >
                        {bin}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Individual Action Column */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#3e4a3d]">
                  {issue.fixed ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#101b13] border border-emerald-500/30 text-[#6fdd78] rounded-lg font-mono text-[11px] font-bold">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>Fixed</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleFixSingleIssue(issue.id)}
                      className="px-3.5 py-2 bg-[#6fdd78] hover:bg-[#34a547] text-[#00390e] rounded-lg font-bold text-[12px] shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">build</span>
                      <span>Quick Fix</span>
                    </button>
                  )}

                  <span className="text-[11px] text-[#889484] text-right max-w-[200px] hidden sm:inline">
                    {issue.suggestedAction}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredIssues.length === 0 && (
            <div className="p-8 text-center bg-[#181c22] border border-[#3e4a3d] rounded-xl text-[#889484]">
              <span className="material-symbols-outlined text-[36px] text-[#6fdd78] block mx-auto mb-2">
                task_alt
              </span>
              <span className="font-bold text-white text-[14px]">No issues match the selected filter</span>
              <p className="text-[12px] mt-1">All variables in this category are operating within standard parameters.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PATH SEQUENCE EVALUATOR */}
      {activeTab === 'path-sequence' && (
        <div className="space-y-3 mt-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#889484] text-[16px]">
                search
              </span>
              <input
                type="text"
                placeholder="Filter PATH directories or tags..."
                value={pathSearch}
                onChange={(e) => setPathSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#0a0e14] border border-[#3e4a3d] rounded-lg font-mono text-[11px] text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono self-end sm:self-auto">
              <button
                onClick={() => setPathFilter('all')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  pathFilter === 'all' ? 'bg-[#262a31] text-white border border-[#3e4a3d]' : 'text-[#889484]'
                }`}
              >
                All ({pathEntries.length})
              </button>
              <button
                onClick={() => setPathFilter('system')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  pathFilter === 'system' ? 'bg-[#262a31] text-white border border-[#3e4a3d]' : 'text-[#889484]'
                }`}
              >
                System HKLM
              </button>
              <button
                onClick={() => setPathFilter('user')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  pathFilter === 'user' ? 'bg-[#262a31] text-white border border-[#3e4a3d]' : 'text-[#889484]'
                }`}
              >
                User HKCU
              </button>
              <button
                onClick={() => setPathFilter('issues-only')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  pathFilter === 'issues-only'
                    ? 'bg-[#2d1215] text-[#ff8389] border border-rose-500/40'
                    : 'text-[#889484]'
                }`}
              >
                Warnings Only
              </button>
            </div>
          </div>

          {/* PATH List Table */}
          <div className="bg-[#181c22] border border-[#3e4a3d] rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 bg-[#0a0e14] border-b border-[#3e4a3d] grid grid-cols-12 text-[11px] font-mono text-[#889484] uppercase">
              <div className="col-span-1">Order</div>
              <div className="col-span-6 lg:col-span-7">Directory Path</div>
              <div className="col-span-2">Scope</div>
              <div className="col-span-3 lg:col-span-2 text-right">Integrity Status</div>
            </div>

            <div className="divide-y divide-[#262a31]">
              {filteredPathEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="px-4 py-2.5 grid grid-cols-12 items-center text-[12px] hover:bg-[#1c2026] transition-colors"
                >
                  {/* Order */}
                  <div className="col-span-1 font-mono text-[11px] text-[#889484]">
                    #{entry.order.toString().padStart(2, '0')}
                  </div>

                  {/* Path + Toolchain tag */}
                  <div className="col-span-6 lg:col-span-7 font-mono text-[12px] text-white truncate pr-2">
                    <span className={!entry.exists ? 'text-rose-400 line-through' : ''}>{entry.path}</span>
                    {entry.toolchainTag && (
                      <span className="ml-2 px-1.5 py-0.2 rounded bg-[#0a0e14] border border-[#3e4a3d] text-[10px] text-[#aac7ff]">
                        {entry.toolchainTag}
                      </span>
                    )}
                  </div>

                  {/* Scope */}
                  <div className="col-span-2 font-mono text-[11px] text-[#889484] truncate">
                    {entry.scope}
                  </div>

                  {/* Badges / Status */}
                  <div className="col-span-3 lg:col-span-2 flex items-center justify-end gap-1.5">
                    {!entry.exists && (
                      <span className="px-1.5 py-0.5 rounded font-mono text-[9px] font-bold bg-[#2d1215] text-[#ff8389] border border-rose-500/40">
                        NOT FOUND
                      </span>
                    )}
                    {entry.isDuplicate && (
                      <span className="px-1.5 py-0.5 rounded font-mono text-[9px] font-bold bg-[#271d0e] text-[#fabc45] border border-amber-500/40">
                        DUPLICATE
                      </span>
                    )}
                    {entry.isShadowed && (
                      <span className="px-1.5 py-0.5 rounded font-mono text-[9px] font-bold bg-[#141d2b] text-[#aac7ff] border border-blue-500/40">
                        SHADOWED
                      </span>
                    )}
                    {entry.exists && !entry.isDuplicate && !entry.isShadowed && (
                      <span className="px-1.5 py-0.5 rounded font-mono text-[9px] font-bold bg-[#101b13] text-[#6fdd78] border border-emerald-500/30">
                        VERIFIED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CRITICAL ENVIRONMENT VARIABLES INVENTORY */}
      {activeTab === 'variables' && (
        <div className="space-y-3 mt-4">
          <div className="bg-[#181c22] border border-[#3e4a3d] rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#3e4a3d]">
              <div>
                <h3 className="font-bold text-white text-[14px]">Primary Windows Environment Variables</h3>
                <p className="text-[11px] text-[#889484]">
                  Key runtime anchors inspected by CLI compilers, package managers, and native builds.
                </p>
              </div>
              <span className="font-mono text-[11px] text-[#6fdd78]">Auto-detected</span>
            </div>

            <div className="divide-y divide-[#262a31] font-mono text-[12px]">
              {/* JAVA_HOME */}
              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="w-44 shrink-0">
                  <span className="text-[#aac7ff] font-bold">JAVA_HOME</span>
                  <span className="text-[10px] text-[#889484] block font-sans">JDK Root Directory</span>
                </div>
                <div className="flex-1 text-[#dfe2eb] truncate text-[11px] bg-[#0a0e14] p-1.5 rounded border border-[#3e4a3d]">
                  {issues.find((i) => i.id === 'issue-java-home-conflict')?.fixed
                    ? 'C:\\Program Files\\Java\\jdk-22.0.2'
                    : 'C:\\Users\\Dev\\.jdks\\corretto-17.0.17'}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyValue(
                      issues.find((i) => i.id === 'issue-java-home-conflict')?.fixed
                        ? 'C:\\Program Files\\Java\\jdk-22.0.2'
                        : 'C:\\Users\\Dev\\.jdks\\corretto-17.0.17',
                      'JAVA_HOME'
                    )
                  }
                  className="px-2 py-1 bg-[#262a31] hover:bg-[#31353c] text-white rounded text-[11px] shrink-0"
                >
                  {copiedVar === 'JAVA_HOME' ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* ANDROID_SDK_ROOT */}
              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="w-44 shrink-0">
                  <span className="text-[#aac7ff] font-bold">ANDROID_SDK_ROOT</span>
                  <span className="text-[10px] text-[#889484] block font-sans">Android SDK Tools</span>
                </div>
                <div className="flex-1 text-[#dfe2eb] truncate text-[11px] bg-[#0a0e14] p-1.5 rounded border border-[#3e4a3d]">
                  C:\Users\Developer\AppData\Local\Android\Sdk
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyValue(
                      'C:\\Users\\Developer\\AppData\\Local\\Android\\Sdk',
                      'ANDROID_SDK_ROOT'
                    )
                  }
                  className="px-2 py-1 bg-[#262a31] hover:bg-[#31353c] text-white rounded text-[11px] shrink-0"
                >
                  {copiedVar === 'ANDROID_SDK_ROOT' ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* CARGO_HOME */}
              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="w-44 shrink-0">
                  <span className="text-[#aac7ff] font-bold">CARGO_HOME</span>
                  <span className="text-[10px] text-[#889484] block font-sans">Rust Package Cache</span>
                </div>
                <div className="flex-1 text-[#dfe2eb] truncate text-[11px] bg-[#0a0e14] p-1.5 rounded border border-[#3e4a3d]">
                  C:\Users\Developer\.cargo
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyValue('C:\\Users\\Developer\\.cargo', 'CARGO_HOME')}
                  className="px-2 py-1 bg-[#262a31] hover:bg-[#31353c] text-white rounded text-[11px] shrink-0"
                >
                  {copiedVar === 'CARGO_HOME' ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* GOPATH */}
              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="w-44 shrink-0">
                  <span className="text-[#aac7ff] font-bold">GOPATH</span>
                  <span className="text-[10px] text-[#889484] block font-sans">Go Workspace Root</span>
                </div>
                <div className="flex-1 text-[#dfe2eb] truncate text-[11px] bg-[#0a0e14] p-1.5 rounded border border-[#3e4a3d]">
                  C:\Users\Developer\go
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyValue('C:\\Users\\Developer\\go', 'GOPATH')}
                  className="px-2 py-1 bg-[#262a31] hover:bg-[#31353c] text-white rounded text-[11px] shrink-0"
                >
                  {copiedVar === 'GOPATH' ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* FLUTTER_ROOT */}
              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="w-44 shrink-0">
                  <span className="text-[#aac7ff] font-bold">FLUTTER_ROOT</span>
                  <span className="text-[10px] text-[#889484] block font-sans">Flutter SDK Directory</span>
                </div>
                <div className="flex-1 text-[#dfe2eb] truncate text-[11px] bg-[#0a0e14] p-1.5 rounded border border-[#3e4a3d]">
                  C:\src\flutter
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyValue('C:\\src\\flutter', 'FLUTTER_ROOT')}
                  className="px-2 py-1 bg-[#262a31] hover:bg-[#31353c] text-white rounded text-[11px] shrink-0"
                >
                  {copiedVar === 'FLUTTER_ROOT' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
