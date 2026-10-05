export type ScreenType =
  | 'dashboard'
  | 'catalog'
  | 'languages'
  | 'frameworks'
  | 'tools'
  | 'mobile'
  | 'installed'
  | 'updates'
  | 'diagnostics'
  | 'jdk-details'
  | 'scan-progress'
  | 'scan-results'
  | 'settings'
  | 'settings-restored';

export * from './catalog/types';

export interface PathDiagnosticIssue {
  id: string;
  title: string;
  variableName: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'variable-conflict' | 'path-precedence' | 'orphaned-entry' | 'duplicate-entry' | 'missing-variable';
  description: string;
  currentValue: string;
  expectedValue?: string;
  scope: 'HKLM' | 'HKCU' | 'Process' | 'Both';
  affectedBinaries: string[];
  suggestedAction: string;
  fixed: boolean;
}

export interface PathEntryItem {
  id: string;
  order: number;
  path: string;
  scope: 'System (HKLM)' | 'User (HKCU)';
  exists: boolean;
  isDuplicate: boolean;
  isShadowed: boolean;
  toolchainTag?: string;
}

export interface ToolchainItem {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'tool' | 'mobile';
  vendor: string;
  installed: boolean;
  activeVersion?: string;
  activeVariant?: string;
  detectedVersions?: string[];
  path?: string;
  hasUpdate?: boolean;
  updateVersion?: string;
  updateNote?: string;
  notes?: string;
  iconName: string;
  iconColor: string;
  wingetId?: string;
  status: 'active' | 'installed' | 'not-installed' | 'update';
}

export interface ScanTarget {
  id: string;
  name: string;
  status: 'completed' | 'running' | 'queued' | 'warning';
  duration?: string;
  detail: string;
  badge?: string;
  badgeType?: 'primary' | 'secondary' | 'tertiary' | 'outline';
  registryNote?: string;
}

export interface AppSettings {
  autoScanStartup: boolean;
  autoCheckUpdates: boolean;
  updateFrequency: string;
  telemetryEnabled: boolean;
  theme: 'dark' | 'light' | 'system';
  fontSize: string;
  toolchainRoot: string;
  collisionPolicy: 'parallel' | 'overwrite' | 'prompt';
  confirmBeforeRemove: boolean;
  defaultShell: string;
  showLiveLogs: boolean;
  autoScrollTerminal: boolean;
  broadcastWmSettingChange: boolean;
  registryScope: 'hkcu' | 'hklm';
  toastAlerts: boolean;
  autoSave?: boolean;
}

export interface TerminalEntry {
  id: string;
  type: 'command' | 'stdout' | 'stderr' | 'success' | 'warning';
  text: string;
  command?: string;
  timestamp?: string;
}

export interface ScreenReference {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  category: string;
  screenTarget: ScreenType;
  modalTarget?: 'conflict' | 'restore-modal' | 'diff-split' | 'diff-unified';
  imageName: string;
  description: string;
  htmlSnippet: string;
}

export interface DevHubSyncPackage {
  schema: 'devhub.windows.environment.sync';
  schemaVersion: string;
  exportedAt: string;
  sourceMachine: {
    hostname: string;
    os: string;
    build: string;
    arch: string;
    userProfile: string;
  };
  settings: AppSettings;
  providers: Record<string, import('./catalog/types').TechnologyProvider>;
  technologies: import('./catalog/types').TechnologyMetadata[];
  languages: ToolchainItem[];
  metadata: {
    providersCount: number;
    installationsCount: number;
    technologiesCount: number;
    checksum: string;
  };
}
