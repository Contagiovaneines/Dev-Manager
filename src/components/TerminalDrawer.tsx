import React, { useState, useRef, useEffect } from 'react';

interface TerminalDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  onTriggerScan?: () => void;
}

interface LogLine {
  id: string;
  type: 'cmd' | 'text' | 'success' | 'warn' | 'error';
  content: string;
}

export const TerminalDrawer: React.FC<TerminalDrawerProps> = ({
  isOpen,
  onToggle,
  onTriggerScan,
}) => {
  const [autoScroll, setAutoScroll] = useState(true);
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<LogLine[]>([
    { id: '1', type: 'cmd', content: 'java -version' },
    { id: '2', type: 'text', content: 'openjdk version "17.0.17" 2024-10-15' },
    { id: '3', type: 'text', content: 'OpenJDK Runtime Environment Temurin-17.0.17+7 (build 17.0.17+7)' },
    { id: '4', type: 'text', content: 'OpenJDK 64-Bit Server VM Temurin-17.0.17+7 (build 17.0.17+7, mixed mode, sharing)' },
    { id: '5', type: 'cmd', content: 'node --version' },
    { id: '6', type: 'text', content: 'v22.17.1' },
    { id: '7', type: 'success', content: 'System PATH verified: All active binaries mapped to environment variables.' },
  ]);

  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [logs, autoScroll, isOpen]);

  const handleClear = () => {
    setLogs([{ id: Date.now().toString(), type: 'text', content: '// Output cleared by user' }]);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    setInputVal('');
    const newLogs: LogLine[] = [
      ...logs,
      { id: Date.now().toString(), type: 'cmd', content: cmd },
    ];

    const lower = cmd.toLowerCase();
    if (lower === 'clear' || lower === 'cls') {
      setLogs([{ id: Date.now().toString(), type: 'text', content: '// Output cleared by user' }]);
      return;
    } else if (lower.includes('java -version')) {
      newLogs.push(
        { id: (Date.now() + 1).toString(), type: 'text', content: 'openjdk version "17.0.17" 2024-10-15' },
        { id: (Date.now() + 2).toString(), type: 'text', content: 'OpenJDK Runtime Environment Temurin-17.0.17+7' },
        { id: (Date.now() + 3).toString(), type: 'success', content: 'JAVA_HOME is mapped to C:\\Program Files\\Java\\jdk-17' }
      );
    } else if (lower.includes('node') && (lower.includes('-v') || lower.includes('--version'))) {
      newLogs.push({ id: (Date.now() + 1).toString(), type: 'text', content: 'v22.17.1 (managed via fnm)' });
    } else if (lower.includes('python')) {
      newLogs.push({
        id: (Date.now() + 1).toString(),
        type: 'warn',
        content: 'Python is not detected in system PATH. Recommended: winget install Python.Python.3.12',
      });
    } else if (lower.includes('git --version')) {
      newLogs.push({ id: (Date.now() + 1).toString(), type: 'text', content: 'git version 2.44.0.windows.1' });
    } else if (lower.includes('rustc --version')) {
      newLogs.push({ id: (Date.now() + 1).toString(), type: 'text', content: 'rustc 1.77.2 (25ef9e3d8 2024-04-09)' });
    } else if (lower.includes('echo $env:java_home')) {
      newLogs.push({ id: (Date.now() + 1).toString(), type: 'success', content: 'C:\\Program Files\\Java\\jdk-17' });
    } else if (lower.includes('devenv doctor')) {
      newLogs.push(
        { id: (Date.now() + 1).toString(), type: 'text', content: 'Running environment diagnostics on 25 system targets...' },
        { id: (Date.now() + 2).toString(), type: 'success', content: 'Diagnostic report generated: 0 PATH collisions detected, 12 active runtimes healthy.' }
      );
    } else if (lower.includes('devenv scan') || lower.includes('scan')) {
      newLogs.push({ id: (Date.now() + 1).toString(), type: 'success', content: 'Launching deep multi-threaded environment scan...' });
      if (onTriggerScan) onTriggerScan();
    } else if (lower === 'help') {
      newLogs.push({
        id: (Date.now() + 1).toString(),
        type: 'text',
        content: 'Available commands: java -version, node --version, git --version, rustc --version, devenv doctor, devenv scan, echo $env:JAVA_HOME, cls, clear',
      });
    } else {
      newLogs.push({
        id: (Date.now() + 1).toString(),
        type: 'text',
        content: `Executed: ${cmd} (exit code 0)`,
      });
    }

    setLogs(newLogs);
  };

  return (
    <div className="fixed bottom-0 left-64 right-0 z-40 flex flex-col select-none transition-all duration-200">
      {/* Drawer Body if open */}
      {isOpen && (
        <div className="w-full bg-[#181c22] border-t border-[#3e4a3d] shadow-2xl flex flex-col max-h-72">
          {/* Drawer Header Strip */}
          <div className="h-9 px-3 bg-[#1c2026] border-b border-[#3e4a3d] flex items-center justify-between select-none">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={onToggle}
                className="flex items-center gap-1 text-[#dfe2eb] hover:text-[#6fdd78] transition-colors focus:outline-none"
              >
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
                <span className="text-[12px] font-semibold">Terminal Output (PowerShell 7.4.1)</span>
              </button>
              <span className="w-1.5 h-1.5 rounded-full bg-[#6fdd78] inline-block animate-pulse"></span>
              <span className="font-mono text-[11px] text-[#889484] hidden sm:inline">Execution Log</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors flex items-center gap-1 ${
                  autoScroll
                    ? 'bg-[#31353c] text-[#6fdd78]'
                    : 'bg-[#181c22] text-[#889484] hover:text-[#dfe2eb]'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">
                  {autoScroll ? 'vertical_align_bottom' : 'pause'}
                </span>
                <span>Auto-scroll {autoScroll ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={handleClear}
                className="px-2 py-0.5 rounded bg-[#31353c] text-[#becab9] hover:text-[#dfe2eb] hover:bg-[#353940] text-[11px] font-mono transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[13px]">clear_all</span>
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Console Output Area */}
          <div
            ref={bodyRef}
            className="p-3 bg-[#0a0e14] font-mono text-[12px] text-[#dfe2eb] flex flex-col gap-1 overflow-y-auto max-h-52 leading-relaxed select-text"
          >
            {logs.map((log) => {
              if (log.type === 'cmd') {
                return (
                  <div key={log.id} className="flex items-center gap-2 mt-1">
                    <span className="text-[#aac7ff] font-semibold">PS C:\Users\Developer&gt;</span>
                    <span className="text-[#dfe2eb]">{log.content}</span>
                  </div>
                );
              }
              if (log.type === 'success') {
                return (
                  <div key={log.id} className="flex items-center gap-1.5 text-[#6fdd78] text-[12px] mt-0.5">
                    <span className="material-symbols-outlined text-[15px]">check_circle</span>
                    <span>{log.content}</span>
                  </div>
                );
              }
              if (log.type === 'warn') {
                return (
                  <div key={log.id} className="text-[#fabc45] pl-4 text-[12px]">
                    {log.content}
                  </div>
                );
              }
              return (
                <div key={log.id} className="text-[#889484] pl-4 text-[12px]">
                  {log.content}
                </div>
              );
            })}
          </div>

          {/* Console Command Input Field */}
          <form
            onSubmit={handleCommand}
            className="flex items-center px-3 py-1.5 bg-[#10141a] border-t border-[#3e4a3d] font-mono text-[12px]"
          >
            <span className="text-[#aac7ff] font-semibold mr-2 shrink-0">PS C:\Users\Developer&gt;</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type command (e.g. java -version, devenv doctor, help)..."
              className="flex-1 bg-transparent text-[#dfe2eb] focus:outline-none placeholder:text-[#889484]/60 font-mono text-[12px]"
            />
            <button
              type="submit"
              className="px-2 py-0.5 bg-[#262a31] hover:bg-[#31353c] text-[#6fdd78] rounded text-[11px] font-mono shrink-0 ml-2"
            >
              Run
            </button>
          </form>
        </div>
      )}

      {/* Docked Status Bar */}
      <footer className="h-8 bg-[#181c22] border-t border-[#3e4a3d] flex items-center justify-between px-3 text-[#becab9] font-mono text-[11px] select-none">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggle}
            className="flex items-center gap-1 hover:text-[#6fdd78] transition-colors focus:outline-none cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#6fdd78]"></span>
            <span>Terminal: ready {isOpen ? '(expanded)' : '(click to open)'}</span>
          </button>
          <span className="text-[#889484]">|</span>
          <span>Active tasks: 0</span>
          <span className="text-[#889484]">|</span>
          <span>UTF-8</span>
        </div>

        <button
          onClick={onToggle}
          className="flex items-center gap-1.5 hover:text-[#dfe2eb] transition-colors"
        >
          <span className="material-symbols-outlined text-[14px] text-[#889484]">keyboard_command_key</span>
          <span>Windows PowerShell 7.4</span>
        </button>
      </footer>
    </div>
  );
};
