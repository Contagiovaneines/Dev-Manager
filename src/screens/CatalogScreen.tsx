import React, { useState, useMemo } from 'react';
import {
  TechnologyMetadata,
  TechnologyProvider,
  TechnologyCategory,
  SupportLevel,
  ScreenType,
} from '../types';

interface CatalogScreenProps {
  technologies: TechnologyMetadata[];
  providers: Record<string, TechnologyProvider>;
  onSelectTechnology: (tech: TechnologyMetadata) => void;
  onNavigate: (screen: ScreenType) => void;
  onAddCustomTechnology: (tech: TechnologyMetadata) => void;
}

export const CatalogScreen: React.FC<CatalogScreenProps> = ({
  technologies,
  providers,
  onSelectTechnology,
  onNavigate,
  onAddCustomTechnology,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSupportLevel, setSelectedSupportLevel] = useState<string>('all');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'installed' | 'has-provider' | 'historical'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Custom technology form state
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<TechnologyCategory>('language');
  const [customSupportLevel, setCustomSupportLevel] = useState<SupportLevel>('community-supported');
  const [customDesc, setCustomDesc] = useState('');
  const [customWebsite, setCustomWebsite] = useState('');
  const [customDoc, setCustomDoc] = useState('');

  // Metrics
  const metrics = useMemo(() => {
    let productionCount = 0;
    let communityCount = 0;
    let catalogOnlyCount = 0;
    let installedCount = 0;

    technologies.forEach((t) => {
      if (t.supportLevel === 'production-supported') productionCount++;
      if (t.supportLevel === 'community-supported') communityCount++;
      if (t.supportLevel === 'catalog-only') catalogOnlyCount++;

      const prov = t.providerId ? providers[t.providerId] : null;
      if (prov && prov.installations && prov.installations.length > 0) {
        installedCount++;
      }
    });

    return {
      total: technologies.length,
      productionCount,
      communityCount,
      catalogOnlyCount,
      installedCount,
    };
  }, [technologies, providers]);

  // Filtering
  const filteredTechnologies = useMemo(() => {
    return technologies.filter((tech) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = tech.name.toLowerCase().includes(q);
        const matchesDesc = tech.description.toLowerCase().includes(q);
        const matchesId = tech.id.toLowerCase().includes(q);
        const matchesTags = tech.classifications.some((c) => c.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesId && !matchesTags) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && tech.category !== selectedCategory) {
        return false;
      }

      // Support Level filter
      if (selectedSupportLevel !== 'all' && tech.supportLevel !== selectedSupportLevel) {
        return false;
      }

      // Quick tab filter
      if (selectedFilter === 'installed') {
        const prov = tech.providerId ? providers[tech.providerId] : null;
        if (!prov || prov.installations.length === 0) return false;
      }
      if (selectedFilter === 'has-provider') {
        if (!tech.providerId || !providers[tech.providerId]) return false;
      }
      if (selectedFilter === 'historical') {
        if (!tech.historical) return false;
      }

      return true;
    });
  }, [technologies, providers, searchQuery, selectedCategory, selectedSupportLevel, selectedFilter]);

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(technologies, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tech-catalog-export-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newId = customName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newTech: TechnologyMetadata = {
      id: newId,
      name: customName,
      category: customCategory,
      classifications: ['Custom User Tool', customCategory === 'language' ? 'Programming Languages' : 'Developer Tools'],
      supportLevel: customSupportLevel,
      isRuntime: true,
      isCompiler: false,
      description: customDesc || 'Custom technology entry configured by workspace administrator.',
      officialWebsite: customWebsite || 'https://example.com',
      documentationUrl: customDoc || 'https://example.com/docs',
      platforms: ['windows'],
      architectures: ['x64'],
      iconName: 'extension',
      iconColor: '#a855f7',
      providerId: null,
    };

    onAddCustomTechnology(newTech);
    setShowAddModal(false);
    setCustomName('');
    setCustomDesc('');
    setCustomWebsite('');
    setCustomDoc('');
  };

  const categoriesList = [
    { id: 'all', label: 'All Categories' },
    { id: 'language', label: 'Languages' },
    { id: 'runtime', label: 'Runtimes' },
    { id: 'compiler', label: 'Compilers' },
    { id: 'sdk', label: 'SDKs' },
    { id: 'cli', label: 'CLIs' },
    { id: 'package-manager', label: 'Package Managers' },
    { id: 'database', label: 'Databases' },
    { id: 'dev-tool', label: 'Dev Tools' },
  ];

  const supportLevelBadges: Record<string, { label: string; color: string; bg: string }> = {
    'production-supported': {
      label: 'Production Supported',
      color: 'text-emerald-400 border-emerald-500/30',
      bg: 'bg-emerald-500/10',
    },
    'community-supported': {
      label: 'Community Supported',
      color: 'text-sky-400 border-sky-500/30',
      bg: 'bg-sky-500/10',
    },
    'catalog-only': {
      label: 'Catalog Only',
      color: 'text-amber-400 border-amber-500/30',
      bg: 'bg-amber-500/10',
    },
    'unsupported': {
      label: 'Unsupported',
      color: 'text-rose-400 border-rose-500/30',
      bg: 'bg-rose-500/10',
    },
  };

  return (
    <div className="flex-1 min-h-screen bg-[#0d1117] text-slate-100 flex flex-col font-sans">
      {/* Top Banner / Breadcrumb */}
      <div className="px-8 pt-6 pb-5 border-b border-[#21262d] bg-[#161a22]/70 backdrop-blur-md sticky top-0 z-30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
              <button onClick={() => onNavigate('dashboard')} className="hover:text-emerald-400 transition-colors">
                HUB
              </button>
              <span>/</span>
              <span className="text-emerald-400 font-semibold">ECOSYSTEM CATALOG</span>
              <span>/</span>
              <span className="text-slate-400">WINDOWS ARCHITECTURE</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
              Technology & Language Catalog
              <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {metrics.total} Cataloged Entries
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Extensible catalog supporting programming languages, runtimes, compilers, package managers, and SDKs. Clear separation between Catalog and Provider execution engine.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportJson}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-[#21262d] text-slate-200 hover:bg-[#30363d] border border-[#30363d] flex items-center gap-1.5 transition-colors"
              title="Export catalog as JSON format"
            >
              <span className="material-symbols-outlined text-base">download</span>
              Export Catalog
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-black hover:bg-emerald-400 flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-950/40"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              Add Custom Technology
            </button>
          </div>
        </div>

        {/* Telemetry / Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5 pt-4 border-t border-[#30363d]/50">
          <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">verified</span>
            </div>
            <div>
              <div className="text-lg font-bold text-white leading-none">{metrics.productionCount}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Production Supported</div>
            </div>
          </div>

          <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">groups</span>
            </div>
            <div>
              <div className="text-lg font-bold text-white leading-none">{metrics.communityCount}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Community Supported</div>
            </div>
          </div>

          <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">menu_book</span>
            </div>
            <div>
              <div className="text-lg font-bold text-white leading-none">{metrics.catalogOnlyCount}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Catalog Only</div>
            </div>
          </div>

          <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">check_circle</span>
            </div>
            <div>
              <div className="text-lg font-bold text-white leading-none">{metrics.installedCount}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Installed Locally</div>
            </div>
          </div>

          <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d] flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">terminal</span>
            </div>
            <div>
              <div className="text-lg font-bold text-white leading-none">WinGet / Scoop</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Package Providers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-8 py-6 space-y-6">
        {/* Search & Filters Rail */}
        <div className="space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Search catalog by name, category, classification (e.g. JVM, Systems, Functional, AI, Web, COBOL)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#161a22] border border-[#30363d] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#161a22] p-1 rounded-xl border border-[#30363d] shrink-0 overflow-x-auto text-xs">
              {[
                { id: 'all', label: 'All Tech' },
                { id: 'installed', label: 'Installed Only' },
                { id: 'has-provider', label: 'With Provider' },
                { id: 'historical', label: 'Historical' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    selectedFilter === f.id
                      ? 'bg-emerald-500 text-black font-semibold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Support Level Selector */}
            <select
              value={selectedSupportLevel}
              onChange={(e) => setSelectedSupportLevel(e.target.value)}
              className="px-3.5 py-2.5 bg-[#161a22] border border-[#30363d] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 shrink-0"
            >
              <option value="all">All Support Levels</option>
              <option value="production-supported">Production Supported</option>
              <option value="community-supported">Community Supported</option>
              <option value="catalog-only">Catalog Only</option>
              <option value="unsupported">Unsupported</option>
            </select>
          </div>

          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#21262d] text-emerald-400 border-emerald-500/50 font-semibold'
                    : 'bg-[#161a22] text-slate-400 border-[#30363d] hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing <strong className="text-slate-200">{filteredTechnologies.length}</strong> of{' '}
            <strong className="text-slate-200">{technologies.length}</strong> technologies
          </span>
          {selectedCategory !== 'all' || selectedSupportLevel !== 'all' || searchQuery ? (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSupportLevel('all');
                setSelectedFilter('all');
                setSearchQuery('');
              }}
              className="text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">restart_alt</span>
              Reset Filters
            </button>
          ) : null}
        </div>

        {/* Technologies Grid */}
        {filteredTechnologies.length === 0 ? (
          <div className="p-12 text-center bg-[#161a22] rounded-2xl border border-[#30363d] space-y-3">
            <span className="material-symbols-outlined text-5xl text-slate-600">search_off</span>
            <h3 className="text-base font-bold text-white">No technologies found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No matching technologies match the search criteria. Try modifying your filter or register a custom entry.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSupportLevel('all');
                setSelectedFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#21262d] text-slate-200 text-xs font-semibold rounded-xl hover:bg-[#30363d]"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTechnologies.map((tech) => {
              const prov = tech.providerId ? providers[tech.providerId] : null;
              const activeInst = prov?.installations?.find((i) => i.isActive) || prov?.installations?.[0];
              const badgeStyle = supportLevelBadges[tech.supportLevel] || supportLevelBadges['catalog-only'];

              return (
                <div
                  key={tech.id}
                  onClick={() => onSelectTechnology(tech)}
                  className="p-5 bg-[#161a22] border border-[#30363d] hover:border-emerald-500/50 rounded-2xl transition-all duration-200 hover:shadow-xl hover:shadow-emerald-950/10 cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Icon + Name + Support Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                          style={{
                            backgroundColor: `${tech.iconColor}15`,
                            color: tech.iconColor,
                            border: `1px solid ${tech.iconColor}30`,
                          }}
                        >
                          <span className="material-symbols-outlined text-2xl">{tech.iconName}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                            {tech.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 capitalize">
                            <span>{tech.category}</span>
                            {tech.isRuntime && <span>• Runtime</span>}
                            {tech.isCompiler && <span>• Compiler</span>}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeStyle.bg} ${badgeStyle.color} shrink-0`}
                      >
                        {badgeStyle.label}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {tech.description}
                    </p>

                    {/* Classifications */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {tech.classifications.slice(0, 3).map((c, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#0d1117] text-slate-400 border border-[#30363d]"
                        >
                          {c}
                        </span>
                      ))}
                      {tech.classifications.length > 3 && (
                        <span className="text-[10px] text-slate-500 self-center">
                          +{tech.classifications.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Status & Capabilities */}
                  <div className="pt-3 border-t border-[#30363d]/60 space-y-2.5">
                    {/* Active version or status */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Installation:</span>
                      {activeInst ? (
                        <span className="font-bold text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          {activeInst.version}
                        </span>
                      ) : prov && prov.capabilities.install ? (
                        <span className="text-slate-400 text-[11px]">Available to install</span>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">Documentation only</span>
                      )}
                    </div>

                    {/* Capabilities row */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 bg-[#0d1117] px-2.5 py-1.5 rounded-lg border border-[#30363d]/50">
                      <span className="flex items-center gap-1">
                        <span className={`material-symbols-outlined text-xs ${prov?.capabilities.detect ? 'text-emerald-400' : 'text-slate-600'}`}>
                          {prov?.capabilities.detect ? 'check' : 'close'}
                        </span>
                        Detect
                      </span>
                      <span className="flex items-center gap-1">
                        <span className={`material-symbols-outlined text-xs ${prov?.capabilities.versions ? 'text-emerald-400' : 'text-slate-600'}`}>
                          {prov?.capabilities.versions ? 'check' : 'close'}
                        </span>
                        Multi-Ver
                      </span>
                      <span className="flex items-center gap-1">
                        <span className={`material-symbols-outlined text-xs ${prov?.capabilities.install ? 'text-emerald-400' : 'text-slate-600'}`}>
                          {prov?.capabilities.install ? 'check' : 'close'}
                        </span>
                        Install
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-emerald-400">menu_book</span>
                        Docs
                      </span>
                    </div>

                    {/* Action button */}
                    <div className="flex items-center justify-end pt-1">
                      <span className="text-xs font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        View Details & Sources
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Custom Technology Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#161a22] border border-[#30363d] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400">add_circle</span>
                Add Technology to Catalog
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Extend the central catalog with your team's proprietary tool, custom language, or SDK.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Technology Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mojo, V Language, Custom Internal SDK"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as TechnologyCategory)}
                    className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="language">Language</option>
                    <option value="runtime">Runtime</option>
                    <option value="compiler">Compiler</option>
                    <option value="sdk">SDK</option>
                    <option value="cli">CLI</option>
                    <option value="package-manager">Package Manager</option>
                    <option value="database">Database</option>
                    <option value="dev-tool">Developer Tool</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Support Level</label>
                  <select
                    value={customSupportLevel}
                    onChange={(e) => setCustomSupportLevel(e.target.value as SupportLevel)}
                    className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="community-supported">Community Supported</option>
                    <option value="production-supported">Production Supported</option>
                    <option value="catalog-only">Catalog Only</option>
                    <option value="unsupported">Unsupported</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Summary of this technology, use cases, or requirements..."
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Official Website</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={customWebsite}
                    onChange={(e) => setCustomWebsite(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Documentation URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={customDoc}
                    onChange={(e) => setCustomDoc(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#0d1117] border border-[#30363d] rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 transition-colors shadow"
                >
                  Add to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
