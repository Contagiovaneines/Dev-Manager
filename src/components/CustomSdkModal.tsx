import React, { useState } from 'react';

interface CustomSdkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (lang: { name: string; path: string; addToPath: boolean }) => void;
}

export const CustomSdkModal: React.FC<CustomSdkModalProps> = ({
  isOpen,
  onClose,
  onRegister,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [path, setPath] = useState('');
  const [addToPath, setAddToPath] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    onRegister({
      name: identifier.trim(),
      path: path.trim() || 'C:\\tools\\custom-sdk\\bin',
      addToPath,
    });
    setIdentifier('');
    setPath('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-xl bg-[#262a31] border border-[#3e4a3d] p-4 shadow-2xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#6fdd78]">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span className="font-semibold text-[14px] text-[#dfe2eb]">Add Custom Language / SDK Path</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#becab9] hover:text-[#dfe2eb] transition-colors p-1"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="text-[12px] text-[#becab9] leading-relaxed">
          Manually attach portable toolchains, embedded interpreters, or custom GCC/Clang distributions to your current user session.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-1">
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-[#dfe2eb]">Language Identifier</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. Zig, Nim, Haskell, Lua, Elixir..."
              className="h-8 px-2.5 rounded bg-[#0a0e14] border border-[#3e4a3d] text-[#dfe2eb] text-[13px] focus:outline-none focus:border-[#6fdd78] transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-[#dfe2eb]">Binary / Home Directory (PATH)</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="C:\tools\custom-sdk\bin"
                className="flex-1 h-8 px-2.5 rounded bg-[#0a0e14] border border-[#3e4a3d] text-[#dfe2eb] font-mono text-[11px] focus:outline-none focus:border-[#6fdd78] transition-colors"
              />
              <button
                type="button"
                onClick={() => setPath('C:\\tools\\' + (identifier ? identifier.toLowerCase() : 'custom') + '\\bin')}
                className="h-8 px-3 rounded bg-[#1c2026] hover:bg-[#353940] border border-[#3e4a3d] text-[#dfe2eb] text-[12px] font-medium transition-colors"
              >
                Browse...
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <input
              id="addToPathCheckbox"
              type="checkbox"
              checked={addToPath}
              onChange={(e) => setAddToPath(e.target.checked)}
              className="rounded bg-[#0a0e14] text-[#6fdd78] focus:ring-0 cursor-pointer accent-[#6fdd78] w-4 h-4"
            />
            <label htmlFor="addToPathCheckbox" className="text-[12px] text-[#dfe2eb] cursor-pointer">
              Append automatically to User Environment PATH
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#3e4a3d] mt-1">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-3 rounded bg-[#1c2026] hover:bg-[#31353c] text-[#dfe2eb] text-[12px] font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-8 px-4 rounded bg-[#6fdd78] hover:bg-[#34a547] text-[#00390e] text-[12px] font-semibold transition-colors shadow-sm"
            >
              Register Toolchain
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
