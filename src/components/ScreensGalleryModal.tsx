import React, { useState } from 'react';
import { SCREEN_REFERENCES } from '../data/mockData';
import { ScreenType } from '../types';

interface ScreensGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScreen: (screen: ScreenType, modalTarget?: 'conflict' | 'restore-modal' | 'diff-split' | 'diff-unified') => void;
}

export const ScreensGalleryModal: React.FC<ScreensGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectScreen,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = ['all', 'Overview', 'Languages', 'Toolchain Details', 'Diagnostics', 'Settings', 'Diff Viewer', 'Modal Dialog'];

  const filteredScreens = selectedCategory === 'all'
    ? SCREEN_REFERENCES
    : SCREEN_REFERENCES.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleCopyTag = (imageName: string, title: string, id: string) => {
    const tag = `<img src="${imageName}" alt="${title}" class="rounded-lg shadow border border-outline" />`;
    navigator.clipboard?.writeText(tag);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopySnippet = (snippet: string, id: string) => {
    navigator.clipboard?.writeText(snippet);
    setCopiedId('snippet-' + id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-5xl max-h-[90vh] bg-[#181c22] border border-[#3e4a3d] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#1c2026] border-b border-[#3e4a3d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6fdd78]/15 text-[#6fdd78] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">collections</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-bold text-[#dfe2eb]">
                  Galeria de Telas &amp; Links Diretos para Imagens
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#34a547] text-[#00320b] font-mono text-[10px] font-bold">
                  11 TELAS COMPLETAS
                </span>
              </div>
              <p className="text-[12px] text-[#becab9] mt-0.5">
                Responde à pergunta: <strong className="text-[#dfe2eb]">"É possível adicionar links diretos para as imagens do HTML?"</strong> — Sim! Veja como usar tags diretas <code className="text-[#6fdd78] bg-[#0a0e14] px-1 py-0.5 rounded font-mono text-[11px]">&lt;img src="Image X.png" /&gt;</code> ou navegue para qualquer tela interativa.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#becab9] hover:bg-[#31353c] hover:text-[#dfe2eb] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tip Banner explaining direct HTML image linking */}
        <div className="px-5 py-2.5 bg-[#10141a] border-b border-[#3e4a3d] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[12px]">
          <div className="flex items-center gap-2 text-[#fabc45]">
            <span className="material-symbols-outlined text-[16px] shrink-0">tips_and_updates</span>
            <span>
              <strong>Como adicionar links diretos no HTML:</strong> Use caminhos relativos como <code className="text-[#aac7ff] font-mono">src="Image 1.png"</code> ou URLs completas de hospedagem no atributo <code className="text-[#aac7ff] font-mono">src</code> da tag <code className="text-[#aac7ff] font-mono">&lt;img&gt;</code>.
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 font-mono text-[11px] text-[#becab9]">
            <span className="text-[#889484]">Total:</span>
            <span className="text-[#6fdd78] font-bold">11 Imagens / Telas</span>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-5 py-2 bg-[#1c2026] border-b border-[#3e4a3d] flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-colors capitalize whitespace-nowrap ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#6fdd78] text-[#00390e] font-semibold'
                  : 'bg-[#0a0e14] text-[#becab9] hover:text-[#dfe2eb] hover:bg-[#262a31]'
              }`}
            >
              {cat === 'all' ? 'Todas as Telas (11)' : cat}
            </button>
          ))}
        </div>

        {/* Screen Cards Grid */}
        <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScreens.map((screen) => (
            <div
              key={screen.id}
              className="bg-[#1c2026] hover:bg-[#262a31] border border-[#3e4a3d] hover:border-[#6fdd78]/60 rounded-xl p-3.5 flex flex-col justify-between transition-all group shadow-md"
            >
              <div>
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-[#6fdd78]/20 text-[#6fdd78] flex items-center justify-center font-mono text-[11px] font-bold">
                      {screen.number}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#0a0e14] border border-[#3e4a3d] text-[10px] font-mono text-[#becab9] uppercase">
                      {screen.category}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#889484] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">image</span>
                    {screen.imageName}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-[14px] font-bold text-[#dfe2eb] group-hover:text-[#6fdd78] transition-colors leading-tight">
                  {screen.title}
                </h3>
                <p className="text-[11px] font-medium text-[#889484] mt-0.5 leading-snug">
                  {screen.subtitle}
                </p>
                <p className="text-[12px] text-[#becab9] mt-2 line-clamp-3 leading-relaxed">
                  {screen.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-[#3e4a3d] flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    onSelectScreen(screen.screenTarget, screen.modalTarget);
                    onClose();
                  }}
                  className="w-full h-8 px-3 rounded-lg bg-[#6fdd78] hover:bg-[#34a547] text-[#00390e] font-semibold text-[12px] flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>Abrir Tela Interativa</span>
                </button>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleCopyTag(screen.imageName, screen.title, screen.id)}
                    className="h-7 px-2 bg-[#0a0e14] hover:bg-[#353940] border border-[#3e4a3d] text-[#dfe2eb] rounded text-[11px] font-mono flex items-center justify-center gap-1 transition-colors"
                    title="Copiar tag <img src='...'> para colar no HTML"
                  >
                    <span className="material-symbols-outlined text-[13px] text-[#aac7ff]">code</span>
                    <span>{copiedId === screen.id ? 'Copiado!' : 'Tag <img>'}</span>
                  </button>

                  <button
                    onClick={() => handleCopySnippet(screen.htmlSnippet, screen.id)}
                    className="h-7 px-2 bg-[#0a0e14] hover:bg-[#353940] border border-[#3e4a3d] text-[#dfe2eb] rounded text-[11px] font-mono flex items-center justify-center gap-1 transition-colors"
                    title="Copiar trecho do blueprint HTML"
                  >
                    <span className="material-symbols-outlined text-[13px] text-[#fabc45]">content_copy</span>
                    <span>{copiedId === 'snippet-' + screen.id ? 'Copiado!' : 'Snippet HTML'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#10141a] border-t border-[#3e4a3d] flex items-center justify-between text-[12px] text-[#becab9]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#6fdd78]">check_circle</span>
            <span>Todas as 11 telas e modais estão totalmente implementados e funcionais neste app.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#262a31] hover:bg-[#31353c] text-[#dfe2eb] font-medium text-[12px] transition-colors"
          >
            Fechar Galeria
          </button>
        </div>
      </div>
    </div>
  );
};
