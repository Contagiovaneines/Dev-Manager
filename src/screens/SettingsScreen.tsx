import React, { useState, useRef, useEffect } from 'react';
import { AppSettings, ScreenType, DevHubSyncPackage, ToolchainItem } from '../types';
import { TechnologyProvider, TechnologyMetadata } from '../catalog/types';
import { ImportExportSection } from '../components/ImportExportSection';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings, isSilent?: boolean) => void;
  onOpenRestoreModal: () => void;
  onNavigate: (screen: ScreenType) => void;
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

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onOpenRestoreModal,
  onNavigate,
  providers,
  technologies,
  languages,
  onImportConfiguration,
  onShowNotification,
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [autoSave, setAutoSave] = useState<boolean>(settings.autoSave ?? true);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [activeSection, setActiveSection] = useState('sec-general');
  const [cacheCleaned, setCacheCleaned] = useState(false);
  const isInitialMount = useRef(true);

  // Synchronize when external settings change (e.g. from restore or import)
  useEffect(() => {
    setFormData(settings);
    if (settings.autoSave !== undefined) {
      setAutoSave(settings.autoSave);
    }
  }, [settings]);

  // Auto-save changes whenever formData is modified
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (autoSave) {
      setAutoSaveStatus('saving');
      const timer = setTimeout(() => {
        onUpdateSettings(formData, true);
        setAutoSaveStatus('saved');
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setTimeout(() => setAutoSaveStatus('idle'), 2500);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [formData, autoSave]);

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData]);

  const handleSave = () => {
    onUpdateSettings(formData, false);
    setShowSaveToast(true);
    setAutoSaveStatus('saved');
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  const handleDiscard = () => {
    setFormData(settings);
    if (onShowNotification) {
      onShowNotification('Changes discarded. Restored last saved settings.');
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCleanCache = () => {
    setCacheCleaned(true);
    setTimeout(() => setCacheCleaned(false), 3000);
  };

  return (
    <div className="flex flex-col w-full select-none">
      {/* Sticky Top Action Bar */}
      <div className="sticky top-10 z-30 bg-[#10141a]/95 backdrop-blur-md py-3 border-b border-[#3e4a3d] flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#889484] mb-0.5">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-[#dfe2eb] transition-colors">
              Environment
            </button>
            <span>/</span>
            <span>Preferences</span>
            <span>/</span>
            <span className="text-[#6fdd78] font-medium">System Settings</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-bold text-[#dfe2eb] tracking-tight">Settings</h1>
            <span className="px-2 py-0.5 bg-[#262a31] border border-[#3e4a3d] rounded font-mono text-[10px] text-[#889484] uppercase tracking-wider font-bold">
              v1.4.2 Core
            </span>
          </div>
          <p className="text-[12px] text-[#becab9] mt-0.5">
            Configure installation paths, environment sync policies, terminal runtime, and automated diagnostics.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5 shrink-0">
          {/* Auto-Save Toggle Pill */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              autoSave
                ? 'bg-[#101b13] border-emerald-500/40 text-[#6fdd78]'
                : 'bg-[#181c22] border-[#3e4a3d] text-[#889484]'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className={`material-symbols-outlined text-[17px] ${autoSave ? 'text-[#6fdd78]' : 'text-[#889484]'}`}>
                {autoSave ? 'cloud_sync' : 'cloud_off'}
              </span>
              <span className="text-[12px] font-semibold text-[#dfe2eb]">Auto-save changes</span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer ml-1">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => {
                  const val = e.target.checked;
                  setAutoSave(val);
                  setFormData((prev) => ({ ...prev, autoSave: val }));
                  if (val) {
                    onUpdateSettings({ ...formData, autoSave: true }, true);
                    setAutoSaveStatus('saved');
                    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
                    if (onShowNotification) {
                      onShowNotification('Auto-save enabled. Form changes will synchronize immediately.');
                    }
                  } else {
                    if (onShowNotification) {
                      onShowNotification('Auto-save disabled. Click Save Settings to persist modifications.');
                    }
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-[#31353c] border border-[#3e4a3d] rounded-full peer peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#becab9] after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#6fdd78] peer-checked:after:bg-[#00390e]"></div>
            </label>

            {/* Live Auto-save feedback */}
            {autoSave && (
              <span className="font-mono text-[10px] pl-1.5 border-l border-emerald-500/30 flex items-center gap-1">
                {autoSaveStatus === 'saving' && (
                  <span className="text-[#fabc45] flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fabc45]"></span>
                    Syncing...
                  </span>
                )}
                {autoSaveStatus === 'saved' && (
                  <span className="text-[#6fdd78] flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[13px]">check</span>
                    Saved
                  </span>
                )}
                {autoSaveStatus === 'idle' && (
                  <span className="text-[#889484]">
                    {lastSavedTime ? `Synced ${lastSavedTime}` : 'Live'}
                  </span>
                )}
              </span>
            )}
          </div>

          <button
            onClick={handleDiscard}
            className="h-8 px-3 bg-[#1c2026] border border-[#3e4a3d] rounded hover:bg-[#262a31] text-[#dfe2eb] text-[12px] font-medium transition-colors flex items-center gap-1.5"
            title="Revert to last saved configuration"
          >
            <span className="material-symbols-outlined text-[15px] text-[#889484]">history</span>
            <span>Discard Changes</span>
          </button>

          <button
            onClick={handleSave}
            className={`h-8 px-4 rounded text-[12px] font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
              autoSave
                ? 'bg-[#262a31] hover:bg-[#31353c] border border-emerald-500/30 text-[#6fdd78]'
                : 'bg-[#6fdd78] hover:bg-[#34a547] text-[#00390e]'
            }`}
            title={autoSave ? 'Settings are automatically synchronized live' : 'Persist all current form values'}
          >
            <span className="material-symbols-outlined text-[16px]">
              {autoSave ? 'cloud_done' : 'check_circle'}
            </span>
            <span>{autoSave ? 'Saved (Auto)' : 'Save Settings'}</span>
            {!autoSave && (
              <kbd className="ml-1 px-1.5 py-0.2 bg-black/25 rounded text-[10px] font-mono uppercase tracking-wide">
                Ctrl+S
              </kbd>
            )}
          </button>
        </div>
      </div>

      {/* Main Settings Layout (Split Navigation + Settings Stage) */}
      <div className="grid grid-cols-12 gap-4 pb-8">
        {/* Left Navigation Rail */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="sticky top-32 bg-[#181c22] border border-[#3e4a3d] rounded-lg p-1.5 flex flex-col gap-0.5">
            <div className="px-2.5 py-1 font-mono text-[10px] text-[#889484] uppercase tracking-wider font-bold">
              Configuration Sections
            </div>

            <button
              onClick={() => scrollToSection('sec-general')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-[12px] transition-all text-left ${
                activeSection === 'sec-general'
                  ? 'bg-[#262a31] text-[#dfe2eb] border-l-2 border-[#6fdd78] font-semibold'
                  : 'text-[#becab9] hover:bg-[#1c2026] hover:text-[#dfe2eb]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[17px] text-[#6fdd78]">toggle_on</span>
                <span>General &amp; Automation</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-[#6fdd78]"></span>
            </button>

            <button
              onClick={() => scrollToSection('sec-appearance')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-[12px] transition-all text-left ${
                activeSection === 'sec-appearance'
                  ? 'bg-[#262a31] text-[#dfe2eb] border-l-2 border-[#6fdd78] font-semibold'
                  : 'text-[#becab9] hover:bg-[#1c2026] hover:text-[#dfe2eb]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[17px]">palette</span>
                <span>Appearance &amp; Theme</span>
              </div>
            </button>

            <button
              onClick={() => scrollToSection('sec-paths')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-[12px] transition-all text-left ${
                activeSection === 'sec-paths'
                  ? 'bg-[#262a31] text-[#dfe2eb] border-l-2 border-[#6fdd78] font-semibold'
                  : 'text-[#becab9] hover:bg-[#1c2026] hover:text-[#dfe2eb]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[17px]">folder_open</span>
                <span>Installation &amp; Paths</span>
              </div>
              <span className="font-mono text-[10px] text-[#889484]">Win (C:)</span>
            </button>

            <button
              onClick={() => scrollToSection('sec-terminal')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-[12px] transition-all text-left ${
                activeSection === 'sec-terminal'
                  ? 'bg-[#262a31] text-[#dfe2eb] border-l-2 border-[#6fdd78] font-semibold'
                  : 'text-[#becab9] hover:bg-[#1c2026] hover:text-[#dfe2eb]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[17px]">terminal</span>
                <span>Terminal &amp; Shell</span>
              </div>
              <span className="px-1.5 py-0.2 rounded bg-[#1c2026] border border-[#3e4a3d] font-mono text-[10px] text-[#6fdd78]">
                pwsh 7.4
              </span>
            </button>

            <button
              onClick={() => scrollToSection('sec-registry')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-[12px] transition-all text-left ${
                activeSection === 'sec-registry'
                  ? 'bg-[#262a31] text-[#dfe2eb] border-l-2 border-[#6fdd78] font-semibold'
                  : 'text-[#becab9] hover:bg-[#1c2026] hover:text-[#dfe2eb]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[17px]">sync_alt</span>
                <span>Environment &amp; PATH Sync</span>
              </div>
              <span className="material-symbols-outlined text-[14px] text-[#fabc45]">admin_panel_settings</span>
            </button>

            <button
              onClick={() => scrollToSection('sec-diagnostics')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-[12px] transition-all text-left ${
                activeSection === 'sec-diagnostics'
                  ? 'bg-[#262a31] text-[#dfe2eb] border-l-2 border-[#6fdd78] font-semibold'
                  : 'text-[#becab9] hover:bg-[#1c2026] hover:text-[#dfe2eb]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[17px]">notifications_active</span>
                <span>Notifications &amp; Diagnostics</span>
              </div>
            </button>

            <button
              onClick={() => scrollToSection('sec-import-export')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-[12px] transition-all text-left ${
                activeSection === 'sec-import-export' || activeSection === 'sec-sync'
                  ? 'bg-[#262a31] text-[#dfe2eb] border-l-2 border-[#6fdd78] font-semibold'
                  : 'text-[#becab9] hover:bg-[#1c2026] hover:text-[#dfe2eb]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[17px] text-[#6fdd78]">import_export</span>
                <span>Import/Export Configuration</span>
              </div>
              <span className="px-1.5 py-0.2 rounded bg-[#101b13] border border-emerald-500/30 font-mono text-[9px] text-[#6fdd78] font-bold">
                WINDOWS SYNC
              </span>
            </button>

            <button
              onClick={() => scrollToSection('sec-maintenance')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-[12px] transition-all text-left ${
                activeSection === 'sec-maintenance'
                  ? 'bg-[#262a31] text-[#dfe2eb] border-l-2 border-[#6fdd78] font-semibold'
                  : 'text-[#becab9] hover:bg-[#1c2026] hover:text-[#dfe2eb]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[17px]">build_circle</span>
                <span>Advanced &amp; Maintenance</span>
              </div>
            </button>

            {/* Storage State Card */}
            <div className="mt-3 p-2.5 bg-[#1c2026] rounded border border-[#3e4a3d] flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#889484] uppercase tracking-wider font-bold">
                  Storage State
                </span>
                <span className="font-mono text-[11px] text-[#6fdd78]">Optimal</span>
              </div>
              <div className="w-full bg-[#0a0e14] h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-[#6fdd78] h-full rounded-full" style={{ width: '68%' }}></div>
              </div>
              <div className="flex items-center justify-between font-mono text-[10px] text-[#889484] mt-1">
                <span>Runtimes: 18.2 GB</span>
                <span>Caches: 1.4 GB</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Settings Cards Stage */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-4">
          {/* SECTION 1: General & Automation */}
          <section className="flex flex-col gap-2" id="sec-general">
            <div className="flex items-center justify-between border-b border-[#3e4a3d] pb-1.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6fdd78] text-[20px]">tune</span>
                <h2 className="text-[18px] font-semibold text-[#dfe2eb]">General &amp; Automation</h2>
              </div>
              <span className="font-mono text-[11px] text-[#889484]">core.automation.*</span>
            </div>

            <div className="bg-[#1c2026] border border-[#3e4a3d] rounded-lg p-3.5 flex flex-col gap-3 shadow-sm">
              {/* Auto-Save Changes Setting */}
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#3e4a3d]">
                <div className="flex flex-col min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-[#dfe2eb] font-semibold">Auto-save changes</span>
                    <span className="px-1.5 py-0.2 bg-[#101b13] border border-emerald-500/30 text-[#6fdd78] rounded text-[9px] font-mono font-bold uppercase">
                      Live Sync
                    </span>
                  </div>
                  <p className="text-[12px] text-[#889484] mt-0.5">
                    Automatically synchronize app settings to the local state whenever a form field or preference is modified, reducing the need for manual 'Save' button clicks.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => {
                      const val = e.target.checked;
                      setAutoSave(val);
                      setFormData((prev) => ({ ...prev, autoSave: val }));
                      if (val) {
                        onUpdateSettings({ ...formData, autoSave: true }, true);
                        setAutoSaveStatus('saved');
                        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-[#31353c] border border-[#3e4a3d] rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#becab9] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6fdd78] peer-checked:after:bg-[#00390e]"></div>
                </label>
              </div>

              {/* Startup Scan */}
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#3e4a3d]">
                <div className="flex flex-col min-w-0 pr-3">
                  <span className="text-[13px] text-[#dfe2eb] font-semibold">Automatically scan environment on startup</span>
                  <p className="text-[12px] text-[#889484] mt-0.5">
                    Checks for outdated compilers, missing shims, orphaned SDK symlinks, and broken PATH entries during application launch.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={formData.autoScanStartup}
                    onChange={(e) => setFormData({ ...formData, autoScanStartup: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-[#31353c] border border-[#3e4a3d] rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#becab9] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6fdd78] peer-checked:after:bg-[#00390e]"></div>
                </label>
              </div>

              {/* Auto Updates */}
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#3e4a3d]">
                <div className="flex flex-col min-w-0 pr-3">
                  <span className="text-[13px] text-[#dfe2eb] font-semibold">Automatically check for runtime &amp; toolchain updates</span>
                  <p className="text-[12px] text-[#889484] mt-0.5">
                    Periodically queries upstream manifests (Node LTS, Corretto JDK, Rustup, Go) for newer patches.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-mono text-[11px] text-[#889484]">Check frequency:</span>
                    <select
                      value={formData.updateFrequency}
                      onChange={(e) => setFormData({ ...formData, updateFrequency: e.target.value })}
                      className="bg-[#0a0e14] border border-[#3e4a3d] rounded px-2 py-1 font-mono text-[11px] text-[#dfe2eb] focus:outline-none focus:border-[#6fdd78]"
                    >
                      <option>Every 4 hours</option>
                      <option>Every 6 hours</option>
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Manual only</option>
                    </select>
                    <span className="font-mono text-[11px] text-[#6fdd78] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">schedule</span> Last checked: 14 mins ago
                    </span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={formData.autoCheckUpdates}
                    onChange={(e) => setFormData({ ...formData, autoCheckUpdates: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-[#31353c] border border-[#3e4a3d] rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#becab9] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6fdd78] peer-checked:after:bg-[#00390e]"></div>
                </label>
              </div>

              {/* Telemetry */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col min-w-0 pr-3">
                  <span className="text-[13px] text-[#dfe2eb] font-semibold">Telemetry &amp; Diagnostics Log</span>
                  <p className="text-[12px] text-[#889484] mt-0.5">
                    Keep telemetry strictly local; no remote crash reporting or usage beacons sent to external endpoints.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={formData.telemetryEnabled}
                    onChange={(e) => setFormData({ ...formData, telemetryEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-[#31353c] border border-[#3e4a3d] rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#becab9] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6fdd78] peer-checked:after:bg-[#00390e]"></div>
                </label>
              </div>
            </div>
          </section>

          {/* SECTION 2: Appearance & Theme */}
          <section className="flex flex-col gap-2 pt-1" id="sec-appearance">
            <div className="flex items-center justify-between border-b border-[#3e4a3d] pb-1.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6fdd78] text-[20px]">palette</span>
                <h2 className="text-[18px] font-semibold text-[#dfe2eb]">Appearance &amp; Theme</h2>
              </div>
              <span className="font-mono text-[11px] text-[#889484]">ui.theme.*</span>
            </div>

            <div className="bg-[#1c2026] border border-[#3e4a3d] rounded-lg p-3.5 flex flex-col gap-3 shadow-sm">
              <div className="flex flex-col gap-2">
                <span className="text-[13px] font-semibold text-[#dfe2eb]">Color Scheme &amp; Mica Styling</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {/* Dark Mode */}
                  <div
                    onClick={() => setFormData({ ...formData, theme: 'dark' })}
                    className={`border rounded-lg p-3 flex flex-col gap-2 cursor-pointer transition-all ${
                      formData.theme === 'dark'
                        ? 'border-[#6fdd78] bg-[#181c22] ring-1 ring-[#6fdd78]'
                        : 'border-[#3e4a3d] bg-[#181c22] hover:border-[#889484]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-[#dfe2eb] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[#6fdd78] text-[16px]">dark_mode</span>
                        Dark Mode
                      </span>
                      {formData.theme === 'dark' && (
                        <span className="material-symbols-outlined text-[#6fdd78] text-[18px]">check_circle</span>
                      )}
                    </div>
                    <div className="h-8 rounded bg-[#10141a] border border-[#3e4a3d] p-1.5 flex gap-1 items-center">
                      <div className="w-2.5 h-2.5 rounded bg-[#6fdd78]"></div>
                      <div className="flex-1 h-2 rounded bg-[#262a31]"></div>
                      <div className="w-4 h-2 rounded bg-[#0072e3]"></div>
                    </div>
                    <span className="font-mono text-[11px] text-[#889484]">High-contrast Terminal &amp; WinUI</span>
                  </div>

                  {/* Light Mode */}
                  <div
                    onClick={() => setFormData({ ...formData, theme: 'light' })}
                    className={`border rounded-lg p-3 flex flex-col gap-2 cursor-pointer transition-all ${
                      formData.theme === 'light'
                        ? 'border-[#6fdd78] bg-[#181c22] ring-1 ring-[#6fdd78]'
                        : 'border-[#3e4a3d] bg-[#181c22] opacity-75 hover:opacity-100 hover:border-[#889484]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-[#dfe2eb] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">light_mode</span>
                        Light Mode
                      </span>
                      {formData.theme === 'light' && (
                        <span className="material-symbols-outlined text-[#6fdd78] text-[18px]">check_circle</span>
                      )}
                    </div>
                    <div className="h-8 rounded bg-[#f8fafc] border border-[#cbd5e1] p-1.5 flex gap-1 items-center">
                      <div className="w-2.5 h-2.5 rounded bg-[#0284c7]"></div>
                      <div className="flex-1 h-2 rounded bg-[#e2e8f0]"></div>
                      <div className="w-4 h-2 rounded bg-[#94a3b8]"></div>
                    </div>
                    <span className="font-mono text-[11px] text-[#889484]">Clean Day Studio</span>
                  </div>

                  {/* System Default */}
                  <div
                    onClick={() => setFormData({ ...formData, theme: 'system' })}
                    className={`border rounded-lg p-3 flex flex-col gap-2 cursor-pointer transition-all ${
                      formData.theme === 'system'
                        ? 'border-[#6fdd78] bg-[#181c22] ring-1 ring-[#6fdd78]'
                        : 'border-[#3e4a3d] bg-[#181c22] opacity-75 hover:opacity-100 hover:border-[#889484]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-[#dfe2eb] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
                        System Default
                      </span>
                      {formData.theme === 'system' && (
                        <span className="material-symbols-outlined text-[#6fdd78] text-[18px]">check_circle</span>
                      )}
                    </div>
                    <div className="h-8 rounded bg-gradient-to-r from-[#10141a] to-[#f8fafc] border border-[#3e4a3d] p-1.5 flex items-center justify-center">
                      <span className="font-mono text-[10px] text-[#889484]">Windows 11 Mica Follow</span>
                    </div>
                    <span className="font-mono text-[11px] text-[#889484]">Matches OS DWM accent state</span>
                  </div>
                </div>
              </div>

              {/* Typography Preview */}
              <div className="pt-2 border-t border-[#3e4a3d] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[13px] font-semibold text-[#dfe2eb]">Interface &amp; Fixed-Width Typography</span>
                    <p className="text-[12px] text-[#889484]">Primary UI font: <strong className="text-[#dfe2eb] font-mono">Inter</strong> • Path &amp; Shims: <strong className="text-[#dfe2eb] font-mono">JetBrains Mono</strong></p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#262a31] border border-[#3e4a3d] font-mono text-[11px] text-[#dfe2eb]">
                    Size: 13px
                  </span>
                </div>

                <div className="bg-[#0a0e14] border border-[#3e4a3d] rounded p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="material-symbols-outlined text-[#889484] text-[16px]">terminal</span>
                    <code className="font-mono text-[12px] text-[#6fdd78] truncate">
                      C:\Program Files\Java\jdk-22.0.2\bin\javac.exe --version
                    </code>
                  </div>
                  <span className="px-1.5 py-0.5 bg-[#1c2026] border border-[#3e4a3d] rounded font-mono text-[10px] text-[#889484] uppercase tracking-wider shrink-0 ml-2">
                    Preview Render
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: Installation & File System */}
          <section className="flex flex-col gap-2 pt-1" id="sec-paths">
            <div className="flex items-center justify-between border-b border-[#3e4a3d] pb-1.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6fdd78] text-[20px]">folder_copy</span>
                <h2 className="text-[18px] font-semibold text-[#dfe2eb]">Installation &amp; File System</h2>
              </div>
              <span className="font-mono text-[11px] text-[#889484]">fs.directories.*</span>
            </div>

            <div className="bg-[#1c2026] border border-[#3e4a3d] rounded-lg p-3.5 flex flex-col gap-3 shadow-sm">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-semibold text-[#dfe2eb] flex items-center gap-1.5">
                    <span>Default Global Toolchain Installation Directory</span>
                    <span className="px-1.5 py-0.2 bg-[#bd8708]/30 border border-[#bd8708]/40 rounded text-[#fabc45] font-mono text-[10px] uppercase font-bold">
                      Elevated UAC
                    </span>
                  </label>
                  <div className="flex items-center gap-1 font-mono text-[11px] text-[#889484]">
                    <span className="material-symbols-outlined text-[#6fdd78] text-[14px]">hard_drive</span>
                    <span>142.4 GB Free on Windows (C:)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-[#0a0e14] border border-[#3e4a3d] rounded px-3 h-8 focus-within:border-[#6fdd78] transition-colors">
                    <span className="material-symbols-outlined text-[#889484] text-[16px] mr-2">folder</span>
                    <input
                      type="text"
                      value={formData.toolchainRoot}
                      onChange={(e) => setFormData({ ...formData, toolchainRoot: e.target.value })}
                      className="bg-transparent font-mono text-[12px] text-[#dfe2eb] w-full focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, toolchainRoot: 'C:\\Program Files\\DevTools\\' })}
                    className="h-8 px-3 bg-[#262a31] hover:bg-[#353940] border border-[#3e4a3d] rounded text-[#dfe2eb] text-[12px] font-medium transition-colors shrink-0 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">folder_open</span>
                    <span>Browse...</span>
                  </button>
                </div>
                <p className="text-[12px] text-[#889484]">
                  Requires elevated administrator privileges (UAC) for system-wide directory write operations. All symlinks and shims will anchor here.
                </p>
              </div>

              <div className="pt-3 border-t border-[#3e4a3d] grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-semibold text-[#dfe2eb]">Default Version Collision Policy</label>
                  <p className="text-[12px] text-[#889484]">Behavior when installing a toolchain major/minor version already present.</p>
                  <select
                    value={formData.collisionPolicy}
                    onChange={(e) => setFormData({ ...formData, collisionPolicy: e.target.value as any })}
                    className="mt-1 bg-[#0a0e14] border border-[#3e4a3d] rounded px-2.5 py-1.5 font-mono text-[11px] text-[#dfe2eb] focus:outline-none focus:border-[#6fdd78]"
                  >
                    <option value="parallel">Install in Parallel (Recommended - Non-destructive)</option>
                    <option value="overwrite">Replace Existing Version (In-place Overwrite)</option>
                    <option value="prompt">Prompt Every Time</option>
                  </select>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-semibold text-[#dfe2eb]">Confirm before removing versions</span>
                    <p className="text-[12px] text-[#889484] mt-0.5">
                      Require explicit confirmation and dependency check before uninstalling active or secondary runtimes.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={formData.confirmBeforeRemove}
                      onChange={(e) => setFormData({ ...formData, confirmBeforeRemove: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-[#31353c] border border-[#3e4a3d] rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#becab9] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6fdd78] peer-checked:after:bg-[#00390e]"></div>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: Terminal & PowerShell Integration */}
          <section className="flex flex-col gap-2 pt-1" id="sec-terminal">
            <div className="flex items-center justify-between border-b border-[#3e4a3d] pb-1.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6fdd78] text-[20px]">terminal</span>
                <h2 className="text-[18px] font-semibold text-[#dfe2eb]">Terminal &amp; PowerShell Integration</h2>
              </div>
              <span className="font-mono text-[11px] text-[#889484]">shell.conpty.*</span>
            </div>

            <div className="bg-[#1c2026] border border-[#3e4a3d] rounded-lg p-3.5 flex flex-col gap-3 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#3e4a3d]">
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-[#dfe2eb]">Default Integrated Shell Host</span>
                  <p className="text-[12px] text-[#889484] mt-0.5">
                    The terminal session executed in the bottom drawer when running CLI commands or setting switches.
                  </p>
                </div>
                <select
                  value={formData.defaultShell}
                  onChange={(e) => setFormData({ ...formData, defaultShell: e.target.value })}
                  className="bg-[#0a0e14] border border-[#3e4a3d] rounded px-3 py-1.5 font-mono text-[11px] text-[#dfe2eb] focus:outline-none focus:border-[#6fdd78]"
                >
                  <option>Windows PowerShell 7.4 (pwsh.exe)</option>
                  <option>Windows PowerShell 5.1 (powershell.exe)</option>
                  <option>Command Prompt (cmd.exe)</option>
                  <option>WSL2 Ubuntu 22.04 (wsl.exe)</option>
                  <option>Git Bash (bash.exe)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-semibold text-[#dfe2eb]">Show live stdout/stderr details</span>
                    <p className="text-[12px] text-[#889484] mt-0.5">
                      Display command execution streams during version switches or package installations.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={formData.showLiveLogs}
                      onChange={(e) => setFormData({ ...formData, showLiveLogs: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-[#31353c] border border-[#3e4a3d] rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#becab9] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6fdd78] peer-checked:after:bg-[#00390e]"></div>
                  </label>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-semibold text-[#dfe2eb]">Auto-scroll terminal logs during execution</span>
                    <p className="text-[12px] text-[#889484] mt-0.5">
                      Pin viewport to bottom output while long compiler or download actions run.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={formData.autoScrollTerminal}
                      onChange={(e) => setFormData({ ...formData, autoScrollTerminal: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-[#31353c] border border-[#3e4a3d] rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#becab9] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6fdd78] peer-checked:after:bg-[#00390e]"></div>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: Windows Registry & Variable Sync */}
          <section className="flex flex-col gap-2 pt-1" id="sec-registry">
            <div className="flex items-center justify-between border-b border-[#3e4a3d] pb-1.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6fdd78] text-[20px]">sync_alt</span>
                <h2 className="text-[18px] font-semibold text-[#dfe2eb]">Windows Registry &amp; Variable Sync</h2>
              </div>
              <span className="font-mono text-[11px] text-[#889484]">win32.registry.*</span>
            </div>

            <div className="bg-[#1c2026] border border-[#3e4a3d] rounded-lg p-3.5 flex flex-col gap-3 shadow-sm">
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#3e4a3d]">
                <div className="flex flex-col min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-[#dfe2eb]">Broadcast WM_SETTINGCHANGE on variable update</span>
                    <span className="px-1.5 py-0.2 bg-[#6fdd78]/20 border border-[#6fdd78]/40 rounded text-[#6fdd78] font-mono text-[10px] uppercase font-bold">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[12px] text-[#889484] mt-0.5">
                    Instantly notifies running processes, Windows Explorer, and open PowerShell sessions of PATH and JAVA_HOME changes without requiring a system reboot.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={formData.broadcastWmSettingChange}
                    onChange={(e) => setFormData({ ...formData, broadcastWmSettingChange: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-[#31353c] border border-[#3e4a3d] rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#becab9] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6fdd78] peer-checked:after:bg-[#00390e]"></div>
                </label>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[13px] font-semibold text-[#dfe2eb]">Primary Target Environment Registry Hive</span>
                <p className="text-[12px] text-[#889484]">Defines where updated environment keys are persisted by default.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                  <label
                    onClick={() => setFormData({ ...formData, registryScope: 'hkcu' })}
                    className={`border rounded-lg p-3 flex items-start gap-3 cursor-pointer transition-all ${
                      formData.registryScope === 'hkcu'
                        ? 'border-[#6fdd78] bg-[#181c22] ring-1 ring-[#6fdd78]'
                        : 'border-[#3e4a3d] bg-[#181c22] hover:border-[#889484]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reg-scope"
                      checked={formData.registryScope === 'hkcu'}
                      onChange={() => setFormData({ ...formData, registryScope: 'hkcu' })}
                      className="mt-1 accent-[#6fdd78]"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[12px] font-bold text-[#dfe2eb]">User Scope (HKCU)</span>
                        <span className="px-1.5 py-0.2 bg-[#6fdd78]/20 rounded font-mono text-[10px] text-[#6fdd78]">
                          Zero UAC
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[#889484] mt-0.5">HKEY_CURRENT_USER\Environment</span>
                      <span className="text-[12px] text-[#becab9] mt-1">
                        Safest mode. Affects current developer profile only. Does not prompt for admin password on switches.
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => setFormData({ ...formData, registryScope: 'hklm' })}
                    className={`border rounded-lg p-3 flex items-start gap-3 cursor-pointer transition-all ${
                      formData.registryScope === 'hklm'
                        ? 'border-[#6fdd78] bg-[#181c22] ring-1 ring-[#6fdd78]'
                        : 'border-[#3e4a3d] bg-[#181c22] hover:border-[#889484]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reg-scope"
                      checked={formData.registryScope === 'hklm'}
                      onChange={() => setFormData({ ...formData, registryScope: 'hklm' })}
                      className="mt-1 accent-[#6fdd78]"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[12px] font-bold text-[#dfe2eb]">System Scope (HKLM)</span>
                        <span className="px-1.5 py-0.2 bg-[#bd8708]/30 border border-[#bd8708]/40 rounded font-mono text-[10px] text-[#fabc45]">
                          Requires Admin
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[#889484] mt-0.5">HKEY_LOCAL_MACHINE\SYSTEM</span>
                      <span className="text-[12px] text-[#becab9] mt-1">
                        Applies globally across all Windows user accounts and Windows Services (Docker, IIS, CI runners).
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: Import/Export Configuration */}
          <div id="sec-import-export">
            <ImportExportSection
              settings={formData}
              providers={providers}
              technologies={technologies}
              languages={languages}
              onImportConfiguration={onImportConfiguration}
              onShowNotification={onShowNotification}
            />
          </div>


          {/* SECTION 6: Advanced & Maintenance */}
          <section className="flex flex-col gap-2 pt-1" id="sec-maintenance">
            <div className="flex items-center justify-between border-b border-[#3e4a3d] pb-1.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6fdd78] text-[20px]">build_circle</span>
                <h2 className="text-[18px] font-semibold text-[#dfe2eb]">Advanced &amp; Maintenance</h2>
              </div>
              <span className="font-mono text-[11px] text-[#889484]">system.maintenance.*</span>
            </div>

            <div className="bg-[#1c2026] border border-[#3e4a3d] rounded-lg p-3.5 flex flex-col gap-3 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[13px] font-semibold text-[#dfe2eb]">Purge Orphaned Compiler Artifacts &amp; Shims</span>
                  <p className="text-[12px] text-[#889484] mt-0.5">
                    Safely removes dangling symlinks pointing to deleted JDK, Node, or Python directories.
                  </p>
                </div>
                <button
                  onClick={handleCleanCache}
                  className="h-8 px-3 bg-[#262a31] hover:bg-[#353940] border border-[#3e4a3d] rounded text-[#dfe2eb] text-[12px] font-medium transition-colors shrink-0 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">cleaning_services</span>
                  <span>{cacheCleaned ? 'Caches Purged!' : 'Clean Caches (1.4 GB)'}</span>
                </button>
              </div>

              <div className="pt-3 border-t border-[#3e4a3d] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[13px] font-semibold text-[#ffb4ab]">Registry Rollback Snapshot</span>
                  <p className="text-[12px] text-[#889484] mt-0.5">
                    Restores the Windows registry PATH entries to the snapshot taken on yesterday's initialization.
                  </p>
                </div>
                <button
                  onClick={onOpenRestoreModal}
                  className="h-8 px-3 bg-[#262a31] hover:bg-[#93000a] hover:text-[#ffdad6] border border-[#3e4a3d] rounded text-[#ffb4ab] text-[12px] font-medium transition-colors shrink-0 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">settings_backup_restore</span>
                  <span>Restore Factory Defaults...</span>
                </button>
              </div>
            </div>
          </section>

          {/* Bottom Status & Config File Details Bar */}
          <div className="mt-2 p-3 bg-[#181c22] border border-[#3e4a3d] rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="material-symbols-outlined text-[#889484] text-[18px] shrink-0">data_object</span>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[11px] text-[#dfe2eb] truncate">
                  <span className="text-[#889484]">Active Config:</span> %USERPROFILE%\.dev-env-manager\config.json
                </span>
                <span className="font-mono text-[10px] text-[#889484]">Schema version 2.1 • Hash: 8f4e2b01</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => scrollToSection('sec-import-export')}
                className="h-7 px-3 bg-[#1c2026] hover:bg-[#262a31] border border-emerald-500/40 rounded text-emerald-400 text-[12px] font-semibold flex items-center gap-1 transition-colors"
                title="Open Import/Export Configuration section"
              >
                <span className="material-symbols-outlined text-[14px]">import_export</span>
                <span>Import / Export Sync</span>
              </button>

              <button
                onClick={onOpenRestoreModal}
                className="h-7 px-3 bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] rounded text-[#fabc45] hover:text-[#dfe2eb] text-[12px] flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
                <span>Restore Defaults</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Micro-interaction Toast for Save confirmation */}
      {showSaveToast && (
        <div className="fixed bottom-12 right-6 bg-[#262a31] border border-[#6fdd78] text-[#dfe2eb] px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-in fade-in duration-200">
          <div className="w-6 h-6 rounded-full bg-[#6fdd78]/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#6fdd78] text-[16px]">done</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-[#dfe2eb]">Configuration Saved</span>
            <span className="font-mono text-[11px] text-[#889484]">Broadcasted WM_SETTINGCHANGE to 14 active processes.</span>
          </div>
        </div>
      )}
    </div>
  );
};
