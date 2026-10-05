export type TechnologyCategory =
  | 'language'
  | 'runtime'
  | 'compiler'
  | 'framework'
  | 'sdk'
  | 'cli'
  | 'database'
  | 'build-tool'
  | 'package-manager'
  | 'dev-tool'
  | 'platform';

export type SupportLevel =
  | 'production-supported'
  | 'community-supported'
  | 'catalog-only'
  | 'unsupported';

export type SubCategoryClassification =
  | 'Programming Languages'
  | 'Scripting Languages'
  | 'Systems Languages'
  | 'JVM Languages'
  | '.NET Languages'
  | 'Functional Languages'
  | 'Web Languages'
  | 'Mobile Languages'
  | 'Game Development Languages'
  | 'Data/AI Languages'
  | 'Query Languages'
  | 'Assembly Languages'
  | 'Historical Languages'
  | 'Runtimes'
  | 'Compilers'
  | 'SDKs'
  | 'Frameworks'
  | 'CLIs'
  | 'Build Tools'
  | 'Package Managers'
  | 'Databases'
  | 'Containers'
  | 'Cloud CLIs'
  | 'Developer Tools'
  | 'Custom User Tool';

export interface ProviderCapabilities {
  detect: boolean;
  versions: boolean;
  install: boolean;
  update: boolean;
  uninstall: boolean;
  activate: boolean;
  documentation: boolean;
}

export interface DetectionMethod {
  type: 'executable' | 'path' | 'env_var' | 'registry' | 'standard_dir' | 'package_manager' | 'sdk_manager';
  label: string;
  detail: string;
  detected?: boolean;
}

export interface PackageManagerOption {
  manager: 'winget' | 'scoop' | 'choco' | 'npm' | 'cargo' | 'pip' | 'gem' | 'composer' | 'native';
  label: string;
  packageName?: string;
  command: string;
  verified: boolean;
  notes?: string;
}

export interface TechnologyInstallation {
  id: string;
  technologyId: string;
  version: string;
  variant?: string;
  path: string;
  vendor?: string;
  isActive: boolean;
  method: 'msi' | 'exe' | 'winget' | 'scoop' | 'choco' | 'archive' | 'custom' | 'npm';
  installedDate: string;
  sizeMb?: number;
}

export interface TechnologyProvider {
  id: string;
  technologyId: string;
  name: string;
  supportLevel: SupportLevel;
  capabilities: ProviderCapabilities;
  detectionMethods: DetectionMethod[];
  packageManagers: PackageManagerOption[];
  installations: TechnologyInstallation[];
  activeInstallationId?: string;
  activeVersion?: string;
  hasUpdate?: boolean;
  latestVersion?: string;
}

export interface TechnologyMetadata {
  id: string;
  name: string;
  category: TechnologyCategory;
  classifications: SubCategoryClassification[];
  supportLevel: SupportLevel;
  isRuntime: boolean;
  isCompiler: boolean;
  description: string;
  officialWebsite: string;
  documentationUrl: string;
  downloadUrl?: string;
  repositoryUrl?: string;
  releaseUrl?: string;
  sourceVerificationRequired?: boolean;
  versionSource?: string;
  windowsRequirements?: string;
  summaryInstructions?: string;
  recommendedCommands?: { label: string; command: string }[];
  platforms: ('windows' | 'linux' | 'macos')[];
  architectures: ('x64' | 'arm64' | 'x86')[];
  iconName: string;
  iconColor: string;
  historical?: boolean;
  providerId: string | null;
}
