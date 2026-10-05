/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ScreenType,
  ToolchainItem,
  AppSettings,
  TechnologyMetadata,
  TechnologyProvider,
  TechnologyInstallation,
} from './types';
import {
  LANGUAGES_DATA,
  INITIAL_SETTINGS,
  RESTORED_SETTINGS,
} from './data/mockData';
import { CATALOG_TECHNOLOGIES } from './catalog/catalogData';
import { INITIAL_PROVIDERS } from './catalog/providerRegistry';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TerminalDrawer } from './components/TerminalDrawer';
import { ScreensGalleryModal } from './components/ScreensGalleryModal';
import { CustomSdkModal } from './components/CustomSdkModal';
import { TechnologyDetailModal } from './components/TechnologyDetailModal';

import { DashboardScreen } from './screens/DashboardScreen';
import { CatalogScreen } from './screens/CatalogScreen';
import { LanguagesScreen } from './screens/LanguagesScreen';
import { FrameworksScreen } from './screens/FrameworksScreen';
import { ToolsScreen } from './screens/ToolsScreen';
import { MobileScreen } from './screens/MobileScreen';
import { InstalledScreen } from './screens/InstalledScreen';
import { UpdatesScreen } from './screens/UpdatesScreen';
import { DiagnosticsScreen } from './screens/DiagnosticsScreen';
import { JdkDetailsScreen } from './screens/JdkDetailsScreen';
import { ConflictModal } from './screens/ConflictModal';
import { ScanProgressScreen } from './screens/ScanProgressScreen';
import { ScanResultsScreen } from './screens/ScanResultsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { RestoreDefaultsModal } from './screens/RestoreDefaultsModal';
import { SettingsRestoredScreen } from './screens/SettingsRestoredScreen';
import { DiffModal } from './screens/DiffModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [customSdkOpen, setCustomSdkOpen] = useState(false);
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [diffModalOpen, setDiffModalOpen] = useState(false);
  const [diffMode, setDiffMode] = useState<'split' | 'unified'>('split');
  const [globalSearch, setGlobalSearch] = useState('');

  // Technology Catalog & Provider States
  const [technologies, setTechnologies] = useState<TechnologyMetadata[]>(CATALOG_TECHNOLOGIES);
  const [providers, setProviders] = useState<Record<string, TechnologyProvider>>(INITIAL_PROVIDERS);
  const [selectedTech, setSelectedTech] = useState<TechnologyMetadata | null>(null);
  const [techModalOpen, setTechModalOpen] = useState(false);

  // Toolchains & Settings
  const [languages, setLanguages] = useState<ToolchainItem[]>(LANGUAGES_DATA);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenGalleryTarget = (
    screen: ScreenType,
    modalTarget?: 'conflict' | 'restore-modal' | 'diff-split' | 'diff-unified'
  ) => {
    setCurrentScreen(screen);
    if (modalTarget === 'conflict') {
      setConflictModalOpen(true);
    } else if (modalTarget === 'restore-modal') {
      setRestoreModalOpen(true);
    } else if (modalTarget === 'diff-split') {
      setDiffMode('split');
      setDiffModalOpen(true);
    } else if (modalTarget === 'diff-unified') {
      setDiffMode('unified');
      setDiffModalOpen(true);
    }
  };

  // Open Details Modal for any tech
  const handleOpenTechDetails = (techIdOrObject: string | TechnologyMetadata) => {
    if (typeof techIdOrObject === 'string') {
      const found = technologies.find((t) => t.id === techIdOrObject);
      if (found) {
        setSelectedTech(found);
        setTechModalOpen(true);
      } else {
        showNotification(`Technology ${techIdOrObject} found in catalog.`);
      }
    } else {
      setSelectedTech(techIdOrObject);
      setTechModalOpen(true);
    }
  };

  // Switch Active Version in Provider
  const handleSwitchActiveVersion = (techId: string, installationId: string) => {
    setProviders((prev) => {
      const provEntry = Object.entries(prev).find(([_, p]) => p.technologyId === techId);
      if (!provEntry) return prev;
      const [provKey, prov] = provEntry;
      const targetInst = prov.installations.find((i) => i.id === installationId);
      if (!targetInst) return prev;

      const updatedInstallations = prov.installations.map((i) => ({
        ...i,
        isActive: i.id === installationId,
      }));

      return {
        ...prev,
        [provKey]: {
          ...prov,
          installations: updatedInstallations,
          activeInstallationId: installationId,
          activeVersion: targetInst.version,
        },
      };
    });

    // Also synchronize active version in Languages table if present
    setLanguages((prev) =>
      prev.map((item) => {
        if (item.id === techId) {
          const provEntry = Object.values(providers).find((p) => p.technologyId === techId);
          const targetInst = provEntry?.installations.find((i) => i.id === installationId);
          return {
            ...item,
            activeVersion: targetInst?.version || item.activeVersion,
          };
        }
        return item;
      })
    );

    showNotification(`Active version updated. Windows environment variables & PATH synchronized.`);
  };

  // Add custom installation path to provider
  const handleAddInstallation = (
    techId: string,
    inst: Omit<TechnologyInstallation, 'id' | 'technologyId'>
  ) => {
    setProviders((prev) => {
      const provEntry = Object.entries(prev).find(([_, p]) => p.technologyId === techId);
      if (!provEntry) return prev;
      const [provKey, prov] = provEntry;

      const newId = `${techId}-${Date.now().toString(36)}`;
      const newInst: TechnologyInstallation = {
        ...inst,
        id: newId,
        technologyId: techId,
      };

      return {
        ...prev,
        [provKey]: {
          ...prov,
          installations: [...prov.installations, newInst],
        },
      };
    });
    showNotification(`Registered local installation path for ${techId.toUpperCase()}.`);
  };

  // Add brand-new custom technology to central catalog
  const handleAddCustomTechnology = (newTech: TechnologyMetadata) => {
    setTechnologies((prev) => [newTech, ...prev]);
    showNotification(`Added ${newTech.name} to central technology catalog.`);
  };

  // Run command directly in terminal
  const handleExecuteCommand = (cmd: string) => {
    setTerminalOpen(true);
    showNotification(`Executing in Windows PowerShell: ${cmd}`);
  };

  const handleRegisterCustomSdk = (custom: { name: string; path: string; addToPath: boolean }) => {
    const newItem: ToolchainItem = {
      id: custom.name.toLowerCase().replace(/\s+/g, '-'),
      name: custom.name,
      category: 'language',
      vendor: 'Custom User SDK',
      installed: true,
      activeVersion: 'v1.0.0 (Local)',
      path: custom.path,
      notes: custom.addToPath ? 'Mapped to User PATH registry' : 'Standalone binary directory',
      iconName: 'code',
      iconColor: '#6fdd78',
      status: 'installed',
    };
    setLanguages([newItem, ...languages]);
    showNotification(`Registered custom language: ${custom.name} at ${custom.path}`);
  };

  const handleInstallLanguage = (id: string) => {
    setLanguages((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            installed: true,
            status: 'installed',
            activeVersion: item.id === 'python' ? '3.12.3' : 'Latest (Installed)',
            path: item.id === 'python' ? 'C:\\Program Files\\Python312\\python.exe' : 'C:\\tools\\' + item.id,
            notes: 'Installed via winget package manager',
          };
        }
        return item;
      })
    );
    showNotification(`Successfully installed ${id.toUpperCase()} to system PATH.`);
  };

  const handleProceedConflict = (strategy: 'parallel' | 'replace', version: string) => {
    setConflictModalOpen(false);
    if (strategy === 'parallel') {
      showNotification(`Installed Java ${version} in parallel at C:\\Program Files\\Java\\jdk-${version}_parallel.`);
    } else {
      showNotification(`Replaced Java installation with clean ${version} payload and updated JAVA_HOME.`);
    }
    setCurrentScreen('jdk-details');
  };

  const handleConfirmRestore = () => {
    setRestoreModalOpen(false);
    setSettings(RESTORED_SETTINGS);
    setCurrentScreen('settings-restored');
    showNotification('Factory defaults restored. Registry state broadcasted via WM_SETTINGCHANGE.');
  };

  const handleUndoReset = () => {
    setSettings(INITIAL_SETTINGS);
    setCurrentScreen('settings');
    showNotification('Configuration rollback applied. Previous custom settings restored.');
  };

  const handleImportConfiguration = (payload: {
    settings?: AppSettings;
    providers?: Record<string, TechnologyProvider>;
    technologies?: TechnologyMetadata[];
    languages?: ToolchainItem[];
    strategy: 'merge' | 'replace';
  }) => {
    if (payload.settings) {
      setSettings((prev) => (payload.strategy === 'merge' ? { ...prev, ...payload.settings } : payload.settings!));
    }
    if (payload.providers) {
      setProviders((prev) => (payload.strategy === 'merge' ? { ...prev, ...payload.providers } : payload.providers!));
    }
    if (payload.technologies) {
      setTechnologies((prev) => {
        if (payload.strategy === 'replace') return payload.technologies!;
        const existingIds = new Set(prev.map((t) => t.id));
        const newItems = payload.technologies!.filter((t) => !existingIds.has(t.id));
        return [...prev, ...newItems];
      });
    }
    if (payload.languages) {
      setLanguages((prev) => {
        if (payload.strategy === 'replace') return payload.languages!;
        const existingIds = new Set(prev.map((l) => l.id));
        const newItems = payload.languages!.filter((l) => !existingIds.has(l.id));
        return [...prev, ...newItems];
      });
    }
    showNotification('Multi-Machine Dev Hub configuration package imported and synchronized.');
  };

  const activeProvider = selectedTech?.providerId ? providers[selectedTech.providerId] : null;

  return (
    <div className="min-h-screen bg-[#10141a] text-[#dfe2eb] flex flex-col font-sans select-none antialiased">
      {/* Windows 11 Title Bar Header */}
      <Header
        onToggleTerminal={() => setTerminalOpen(!terminalOpen)}
        terminalOpen={terminalOpen}
        onOpenGallery={() => setGalleryOpen(true)}
        onGlobalSearch={setGlobalSearch}
        searchQuery={globalSearch}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex flex-1 pt-10 pb-8">
        <Sidebar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          updatesCount={languages.filter((l) => l.hasUpdate).length}
          languagesCount={languages.length}
          catalogCount={technologies.length}
        />

        {/* Content Viewport */}
        <main className="pl-64 w-full min-h-[calc(100vh-4.5rem)] bg-[#0a0e14]">
          {currentScreen === 'dashboard' && (
            <div className="px-5 py-4">
              <DashboardScreen
                onNavigate={handleNavigate}
                onOpenTerminal={() => setTerminalOpen(true)}
                onStartScan={() => handleNavigate('scan-progress')}
                onOpenConflictModal={() => setConflictModalOpen(true)}
              />
            </div>
          )}

          {currentScreen === 'catalog' && (
            <CatalogScreen
              technologies={technologies}
              providers={providers}
              onSelectTechnology={handleOpenTechDetails}
              onNavigate={handleNavigate}
              onAddCustomTechnology={handleAddCustomTechnology}
            />
          )}

          {currentScreen === 'languages' && (
            <div className="px-5 py-4">
              <LanguagesScreen
                languages={languages}
                onNavigate={handleNavigate}
                onOpenConflictModal={() => setConflictModalOpen(true)}
                onOpenCustomSdkModal={() => setCustomSdkOpen(true)}
                onInstallLanguage={handleInstallLanguage}
                onOpenTechDetails={handleOpenTechDetails}
              />
            </div>
          )}

          {currentScreen === 'frameworks' && (
            <div className="px-5 py-4">
              <FrameworksScreen
                onNavigate={handleNavigate}
                onOpenTechDetails={handleOpenTechDetails}
                onExecuteCommand={handleExecuteCommand}
              />
            </div>
          )}

          {currentScreen === 'tools' && (
            <div className="px-5 py-4">
              <ToolsScreen
                onNavigate={handleNavigate}
                onOpenTechDetails={handleOpenTechDetails}
                onExecuteCommand={handleExecuteCommand}
              />
            </div>
          )}

          {currentScreen === 'mobile' && (
            <div className="px-5 py-4">
              <MobileScreen
                onNavigate={handleNavigate}
                onExecuteCommand={handleExecuteCommand}
              />
            </div>
          )}

          {currentScreen === 'installed' && (
            <div className="px-5 py-4">
              <InstalledScreen
                onNavigate={handleNavigate}
                onOpenTechDetails={handleOpenTechDetails}
                onExecuteCommand={handleExecuteCommand}
              />
            </div>
          )}

          {currentScreen === 'updates' && (
            <div className="px-5 py-4">
              <UpdatesScreen
                onNavigate={handleNavigate}
                onExecuteCommand={handleExecuteCommand}
                onShowNotification={showNotification}
              />
            </div>
          )}

          {currentScreen === 'diagnostics' && (
            <div className="px-5 py-4">
              <DiagnosticsScreen
                onNavigate={handleNavigate}
                onExecuteCommand={handleExecuteCommand}
                onShowNotification={showNotification}
              />
            </div>
          )}

          {currentScreen === 'jdk-details' && (
            <div className="px-5 py-4">
              <JdkDetailsScreen
                onNavigate={handleNavigate}
                onOpenConflictModal={() => setConflictModalOpen(true)}
              />
            </div>
          )}

          {currentScreen === 'scan-progress' && (
            <div className="px-5 py-4">
              <ScanProgressScreen
                onScanComplete={() => handleNavigate('scan-results')}
                onCancelScan={() => handleNavigate('dashboard')}
              />
            </div>
          )}

          {currentScreen === 'scan-results' && (
            <div className="px-5 py-4">
              <ScanResultsScreen
                onNavigate={handleNavigate}
                onRescan={() => handleNavigate('scan-progress')}
                onOpenConflictModal={() => setConflictModalOpen(true)}
              />
            </div>
          )}

          {currentScreen === 'settings' && (
            <div className="px-5 py-4">
              <SettingsScreen
                settings={settings}
                onUpdateSettings={(newSet, isSilent) => {
                  setSettings(newSet);
                  if (!isSilent) {
                    showNotification('Settings saved and synchronized.');
                  }
                }}
                onOpenRestoreModal={() => setRestoreModalOpen(true)}
                onNavigate={handleNavigate}
                providers={providers}
                technologies={technologies}
                languages={languages}
                onImportConfiguration={handleImportConfiguration}
                onShowNotification={showNotification}
              />
            </div>
          )}

          {currentScreen === 'settings-restored' && (
            <div className="px-5 py-4">
              <SettingsRestoredScreen
                onNavigate={handleNavigate}
                onOpenDiffModal={(mode) => {
                  setDiffMode(mode);
                  setDiffModalOpen(true);
                }}
                onUndoReset={handleUndoReset}
              />
            </div>
          )}
        </main>
      </div>

      {/* Docked PowerShell Terminal Drawer */}
      <TerminalDrawer
        isOpen={terminalOpen}
        onToggle={() => setTerminalOpen(!terminalOpen)}
        onTriggerScan={() => handleNavigate('scan-progress')}
      />

      {/* Technology Detail & Provider Capabilities Modal */}
      <TechnologyDetailModal
        technology={selectedTech}
        provider={activeProvider}
        isOpen={techModalOpen}
        onClose={() => setTechModalOpen(false)}
        onSwitchActiveVersion={handleSwitchActiveVersion}
        onExecuteCommand={handleExecuteCommand}
        onAddInstallation={handleAddInstallation}
      />

      {/* Screen Gallery Reference Modal */}
      <ScreensGalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onSelectScreen={handleOpenGalleryTarget}
      />

      {/* Add Custom SDK Modal */}
      <CustomSdkModal
        isOpen={customSdkOpen}
        onClose={() => setCustomSdkOpen(false)}
        onRegister={handleRegisterCustomSdk}
      />

      {/* Java Version Conflict Resolution Modal */}
      <ConflictModal
        isOpen={conflictModalOpen}
        onClose={() => setConflictModalOpen(false)}
        onProceed={handleProceedConflict}
      />

      {/* Restore Defaults Confirmation Dialog */}
      <RestoreDefaultsModal
        isOpen={restoreModalOpen}
        onClose={() => setRestoreModalOpen(false)}
        onConfirmRestore={handleConfirmRestore}
        onExportJson={() => {
          const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'config.json';
          a.click();
          URL.revokeObjectURL(url);
        }}
      />

      {/* Split/Unified Diff Comparison Modal */}
      <DiffModal
        isOpen={diffModalOpen}
        onClose={() => setDiffModalOpen(false)}
        initialMode={diffMode}
        onRollback={() => {
          handleUndoReset();
          setDiffModalOpen(false);
        }}
      />

      {/* Transient Notification Toast */}
      {toastMessage && (
        <div className="fixed top-12 right-6 z-50 bg-[#262a31] border border-[#6fdd78] text-[#dfe2eb] px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2.5 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-[#6fdd78] text-[18px]">info</span>
          <span className="text-[12px] font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
