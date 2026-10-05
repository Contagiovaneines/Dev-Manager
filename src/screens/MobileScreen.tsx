import React, { useState } from 'react';
import { MobileComponentItem, MOBILE_DATA } from '../data/mockData';
import { ScreenType } from '../types';

interface MobileScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onExecuteCommand?: (cmd: string) => void;
}

export const MobileScreen: React.FC<MobileScreenProps> = ({
  onNavigate,
  onExecuteCommand,
}) => {
  const [components, setComponents] = useState<MobileComponentItem[]>(MOBILE_DATA);
  const [activeTab, setActiveTab] = useState<'components' | 'env-vars' | 'emulators' | 'diagnostics'>('components');
  const [runningDoctor, setRunningDoctor] = useState(false);
  const [doctorOutput, setDoctorOutput] = useState<string | null>(null);

  const handleRunFlutterDoctor = () => {
    setRunningDoctor(true);
    setDoctorOutput(null);
    if (onExecuteCommand) {
      onExecuteCommand('flutter doctor -v');
    }
    setTimeout(() => {
      setRunningDoctor(false);
      setDoctorOutput(`[√] Flutter (Channel stable, 3.22.2, on Microsoft Windows [Version 10.0.22631.3880], locale en-US)
[√] Windows Version (Installed version of Windows is version 10 or higher)
[√] Android toolchain - develop for Android devices (Android SDK version 34.0.0)
    • Android SDK at C:\\Users\\Dev\\AppData\\Local\\Android\\Sdk
    • Platform android-34, build-tools 34.0.0
    • Java binary at: C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.17.8-hotspot\\bin\\java
    • Java version OpenJDK Runtime Environment (build 17.0.17+8)
    • All Android licenses accepted.
[√] Chrome - develop for the web
[√] Visual Studio - develop Windows apps (Visual Studio Build Tools 2022 17.10.4)
[√] Android Studio (version 2024.1)
[√] Connected device (2 available)
    • Pixel 8 Pro (mobile) • emulator-5554 • android-arm64 • Android 14 (API 34)
    • Windows (desktop)     • windows       • windows-x64   • Microsoft Windows [Version 10.0.22631.3880]

• No issues found! Your mobile development environment is fully operational.`);
    }, 1500);
  };

  const handleLaunchEmulator = () => {
    if (onExecuteCommand) {
      onExecuteCommand('& "$env:ANDROID_HOME\\emulator\\emulator.exe" -avd Pixel_8_Pro_API_34 -netdelay none -netspeed full');
    }
  };

  const handleAdbDevices = () => {
    if (onExecuteCommand) {
      onExecuteCommand('adb devices -l');
    }
  };

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
            <span className="text-[#6fdd78] font-medium">MOBILE TOOLCHAINS &amp; SDKS</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] font-bold text-[#dfe2eb] tracking-tight">Mobile Hub</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1c2026] text-[#3ddc84] border border-[#3e4a3d] font-mono text-[11px] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">android</span>
              ANDROID &amp; FLUTTER READY
            </span>
          </div>
          <p className="text-[13px] text-[#becab9] mt-0.5">
            Android SDK platform-tools, build-tools, emulator virtualization, and cross-platform mobile compilers.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRunFlutterDoctor}
            disabled={runningDoctor}
            className="flex items-center gap-1.5 h-8 px-3 rounded bg-[#6fdd78] hover:bg-[#34a547] text-[#00390e] font-semibold text-[12px] shadow-sm transition-all active:scale-95"
          >
            <span className={`material-symbols-outlined text-[16px] ${runningDoctor ? 'animate-spin' : ''}`}>
              {runningDoctor ? 'sync' : 'health_and_safety'}
            </span>
            <span>{runningDoctor ? 'Running Doctor...' : 'Run Flutter Doctor'}</span>
          </button>

          <button
            onClick={handleLaunchEmulator}
            className="flex items-center gap-1.5 h-8 px-3 rounded bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] text-[#dfe2eb] text-[12px] font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[#3ddc84] text-[16px]">phone_android</span>
            <span>Launch AVD Pixel 8</span>
          </button>

          <button
            onClick={handleAdbDevices}
            className="flex items-center gap-1.5 h-8 px-3 rounded bg-[#262a31] hover:bg-[#353940] border border-[#3e4a3d] text-[#aac7ff] font-mono text-[11px] transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">usb</span>
            <span>adb devices</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#3e4a3d] mb-4">
        {[
          { id: 'components', label: 'SDK Components & Toolchains', icon: 'layers' },
          { id: 'env-vars', label: 'Mobile Environment Variables', icon: 'settings_input_component' },
          { id: 'emulators', label: 'Virtual Devices & Emulators', icon: 'phone_android' },
          { id: 'diagnostics', label: 'Diagnostics & Logs', icon: 'receipt_long' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-3 text-[12px] font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'border-[#6fdd78] text-[#dfe2eb] font-semibold bg-[#181c22]'
                : 'border-transparent text-[#becab9] hover:text-[#dfe2eb]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Doctor Output Banner if triggered */}
      {doctorOutput && (
        <div className="mb-4 p-4 rounded-xl bg-[#0a0e14] border border-emerald-500/40 font-mono text-[11px] text-[#6fdd78] leading-relaxed shadow-lg">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#3e4a3d]">
            <span className="font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Flutter &amp; Android Toolchain Diagnostic Report
            </span>
            <button
              onClick={() => setDoctorOutput(null)}
              className="text-[#889484] hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
          <pre className="whitespace-pre-wrap">{doctorOutput}</pre>
        </div>
      )}

      {/* TAB 1: COMPONENTS */}
      {activeTab === 'components' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {components.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[#1c2026] border border-[#3e4a3d] hover:border-[#6fdd78]/40 transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0a0e14] border border-[#3e4a3d] flex items-center justify-center text-[#3ddc84] shrink-0">
                      <span className="material-symbols-outlined text-[24px]">{item.iconName}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-[14px]">{item.name}</h3>
                      <span className="px-2 py-0.2 rounded text-[10px] font-mono uppercase bg-[#262a31] text-[#aac7ff]">
                        {item.type}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#101b13] text-[#6fdd78] border border-emerald-500/30 font-semibold">
                    {item.status}
                  </span>
                </div>

                <p className="text-[12px] text-[#becab9] leading-relaxed mb-3">
                  {item.detail}
                </p>

                <div className="space-y-1.5 font-mono text-[11px] mb-3">
                  <div className="flex items-center justify-between p-2 rounded bg-[#0a0e14] border border-[#3e4a3d]">
                    <span className="text-[#889484]">Version:</span>
                    <span className="text-[#6fdd78] font-bold">{item.version}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-[#0a0e14] border border-[#3e4a3d]">
                    <span className="text-[#889484] truncate max-w-[280px]">{item.path}</span>
                    <button
                      onClick={() => navigator.clipboard?.writeText(item.path)}
                      className="text-[#889484] hover:text-[#dfe2eb] p-0.5 ml-2 transition-colors"
                      title="Copy path"
                    >
                      <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#3e4a3d] flex items-center justify-between text-[11px]">
                <span className="text-[#889484]">Platform Target: Android &amp; Windows</span>
                <button
                  onClick={() => onExecuteCommand && onExecuteCommand(`where.exe ${item.id.includes('platform') ? 'adb' : 'flutter'}`)}
                  className="px-2.5 py-1 rounded bg-[#262a31] hover:bg-[#31353c] text-[#aac7ff] font-mono flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[13px]">terminal</span>
                  <span>Inspect PATH</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ENV VARS */}
      {activeTab === 'env-vars' && (
        <div className="space-y-3 mb-6">
          <div className="p-4 rounded-xl bg-[#1c2026] border border-[#3e4a3d]">
            <h3 className="text-[14px] font-bold text-white mb-1">Mobile System Environment Variables</h3>
            <p className="text-[12px] text-[#becab9] mb-4">
              Configured in Windows Registry (<code className="text-[#6fdd78] font-mono">HKCU\Environment</code>).
            </p>

            <div className="space-y-2 font-mono text-[12px]">
              {[
                { name: 'ANDROID_HOME', value: 'C:\\Users\\Dev\\AppData\\Local\\Android\\Sdk', note: 'Base SDK directory for platform-tools and emulator' },
                { name: 'ANDROID_SDK_ROOT', value: 'C:\\Users\\Dev\\AppData\\Local\\Android\\Sdk', note: 'Legacy alias compatible with Gradle 7.x' },
                { name: 'JAVA_HOME', value: 'C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.17.8-hotspot', note: 'Target JDK required for Android Gradle Plugin 8.x' },
                { name: 'FLUTTER_HOME', value: 'C:\\src\\flutter', note: 'Extracted directory containing flutter.bat and bin/cache' },
              ].map((ev, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#0a0e14] border border-[#3e4a3d] flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <span className="text-[#6fdd78] font-bold">{ev.name}</span>
                    <div className="text-[11px] text-[#889484]">{ev.note}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-[#181c22] text-[#dfe2eb] border border-[#3e4a3d] text-[11px] break-all">
                      {ev.value}
                    </span>
                    <button
                      onClick={() => navigator.clipboard?.writeText(ev.value)}
                      className="p-1 text-[#889484] hover:text-[#dfe2eb]"
                      title="Copy variable value"
                    >
                      <span className="material-symbols-outlined text-[15px]">content_copy</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EMULATORS */}
      {activeTab === 'emulators' && (
        <div className="p-4 rounded-xl bg-[#1c2026] border border-[#3e4a3d] mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-bold text-white">Configured Android Virtual Devices (AVD)</h3>
              <p className="text-[12px] text-[#becab9]">Running via Windows Hypervisor Platform (WHPX / Hyper-V).</p>
            </div>
            <button
              onClick={handleLaunchEmulator}
              className="px-3 py-1.5 rounded bg-[#6fdd78] text-[#00390e] font-semibold text-[12px] flex items-center gap-1.5 shadow"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              <span>Start Pixel 8 Pro</span>
            </button>
          </div>

          <div className="p-4 rounded-lg bg-[#0a0e14] border border-[#3e4a3d] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[32px] text-[#3ddc84]">phone_android</span>
              <div>
                <h4 className="font-bold text-white text-[14px]">Pixel_8_Pro_API_34</h4>
                <div className="text-[11px] text-[#889484] font-mono">
                  Android 14.0 (Google Play) • x86_64 ABI • RAM: 4096MB • Skin: 1344x2992
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#101b13] text-[#6fdd78] border border-emerald-500/30">
                Ready
              </span>
              <button
                onClick={handleLaunchEmulator}
                className="h-8 px-3 rounded bg-[#262a31] hover:bg-[#353940] text-[#dfe2eb] text-[12px] font-medium"
              >
                Launch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DIAGNOSTICS */}
      {activeTab === 'diagnostics' && (
        <div className="p-4 rounded-xl bg-[#1c2026] border border-[#3e4a3d] mb-6 space-y-3 font-mono text-[12px]">
          <h3 className="text-[14px] font-bold text-white font-sans">Mobile SDK Health Probes</h3>
          <div className="space-y-2">
            {[
              { probe: 'where.exe adb.exe', status: 'Found (C:\\Users\\Dev\\AppData\\Local\\Android\\Sdk\\platform-tools\\adb.exe)', pass: true },
              { probe: 'where.exe flutter.bat', status: 'Found (C:\\src\\flutter\\bin\\flutter.bat)', pass: true },
              { probe: 'where.exe dart.exe', status: 'Found (C:\\src\\flutter\\bin\\cache\\dart-sdk\\bin\\dart.exe)', pass: true },
              { probe: 'Windows Hypervisor Platform (WHPX)', status: 'Active (Hyper-V enabled)', pass: true },
              { probe: 'Android Licenses Signature', status: 'Accepted (all 7 SDK licenses signed)', pass: true },
            ].map((p, idx) => (
              <div key={idx} className="p-2.5 rounded bg-[#0a0e14] border border-[#3e4a3d] flex items-center justify-between">
                <span className="text-[#dfe2eb]">{p.probe}</span>
                <span className="text-[#6fdd78] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info Callout */}
      <div className="p-3.5 rounded-lg bg-[#181c22] border border-[#3e4a3d] flex items-center justify-between font-mono text-[11px] text-[#becab9]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#6fdd78] text-[16px]">smartphone</span>
          <span>For iOS building on Windows, remote macOS build machine or GitHub Actions runner integration is available.</span>
        </div>
        <button
          onClick={() => onNavigate('frameworks')}
          className="text-[#6fdd78] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>View Frameworks</span>
          <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
