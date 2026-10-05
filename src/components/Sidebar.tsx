import React from 'react';
import { ScreenType } from '../types';

interface SidebarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  updatesCount?: number;
  languagesCount?: number;
  catalogCount?: number;
  diagnosticsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  updatesCount = 3,
  languagesCount = 11,
  catalogCount = 32,
  diagnosticsCount = 3,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'grid_view',
      badge: null,
      screen: 'dashboard' as ScreenType,
    },
    {
      id: 'catalog',
      label: 'Tech Catalog',
      icon: 'hub',
      badge: catalogCount,
      screen: 'catalog' as ScreenType,
    },
    {
      id: 'languages',
      label: 'Languages',
      icon: 'code',
      badge: languagesCount,
      screen: 'languages' as ScreenType,
    },
    {
      id: 'frameworks',
      label: 'Frameworks',
      icon: 'layers',
      badge: 6,
      screen: 'frameworks' as ScreenType,
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: 'build',
      badge: 14,
      screen: 'tools' as ScreenType,
    },
    {
      id: 'mobile',
      label: 'Mobile',
      icon: 'smartphone',
      badge: null,
      screen: 'mobile' as ScreenType,
    },
    {
      id: 'installed',
      label: 'Installed',
      icon: 'check_circle',
      badge: 12,
      screen: 'installed' as ScreenType,
    },
    {
      id: 'updates',
      label: 'Updates',
      icon: 'arrow_circle_up',
      badge: updatesCount,
      badgeHighlight: true,
      screen: 'updates' as ScreenType,
    },
    {
      id: 'diagnostics',
      label: 'Diagnostics',
      icon: 'troubleshoot',
      badge: diagnosticsCount > 0 ? diagnosticsCount : null,
      badgeHighlight: diagnosticsCount > 0,
      screen: 'diagnostics' as ScreenType,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      badge: null,
      screen: 'settings' as ScreenType,
    },
  ];

  return (
    <aside className="fixed left-0 top-10 bottom-8 w-64 bg-[#181c22] border-r border-[#3e4a3d] z-40 flex flex-col justify-between overflow-hidden select-none">
      <div className="flex flex-col">
        {/* App identity header in sidebar */}
        <div className="h-14 px-3 flex items-center gap-2 border-b border-[#3e4a3d] bg-[#181c22]">
          <div className="w-8 h-8 rounded-lg bg-[#1c2026] border border-[#3e4a3d] flex items-center justify-center text-[#6fdd78] shadow-sm">
            <span className="material-symbols-outlined text-[20px]">developer_mode_tv</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] font-semibold text-[#dfe2eb] truncate">Dev Environment</span>
            <span className="font-mono text-[11px] text-[#889484]">v1.4.2 • Windows Hub</span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex flex-col py-2 px-1 gap-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              currentScreen === item.screen ||
              (item.id === 'languages' && currentScreen === 'jdk-details') ||
              (item.id === 'settings' && currentScreen === 'settings-restored');

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.screen)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left text-[12px] ${
                  isActive
                    ? 'bg-[#262a31] text-[#dfe2eb] font-semibold border-l-2 border-[#6fdd78]'
                    : 'text-[#becab9] hover:bg-[#1c2026] hover:text-[#dfe2eb] font-normal'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`material-symbols-outlined text-[16px] ${
                      isActive ? 'text-[#6fdd78]' : 'text-[#889484]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span
                    className={`px-1.5 py-0.2 rounded font-mono text-[11px] ${
                      item.badgeHighlight
                        ? 'bg-[#bd8708] text-[#392600] font-bold'
                        : 'bg-[#1c2026] border border-[#3e4a3d] text-[#becab9]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom system status card */}
      <div className="p-2 border-t border-[#3e4a3d] bg-[#0a0e14]">
        <div className="p-2.5 bg-[#1c2026] rounded border border-[#3e4a3d] shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="px-1.5 py-0.5 bg-[#262a31] rounded text-[10px] font-mono font-bold text-[#becab9]">
              WIN 11 PRO 64-BIT
            </span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6fdd78] animate-pulse"></span>
              <span className="font-mono text-[10px] text-[#6fdd78] font-bold">HEALTHY</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('languages')}
            className="block text-left w-full font-mono text-[11px] text-[#dfe2eb] hover:text-[#6fdd78] truncate transition-colors py-0.5"
          >
            <span className="text-[#889484]">PATH:</span> 42 variables mapped
          </button>
          <div className="mt-1.5 pt-1.5 border-t border-[#3e4a3d] flex items-center justify-between">
            <span className="text-[12px] text-[#889484] truncate">Developer (Admin)</span>
            <span className="material-symbols-outlined text-[#889484] text-[14px]">verified_user</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
