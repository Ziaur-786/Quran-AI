import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  X, 
  Trophy, 
  Bookmark, 
  FileText, 
  Settings, 
  Globe, 
  Volume2, 
  Moon, 
  Sun, 
  BookOpen, 
  Info, 
  Sparkles, 
  ChevronRight,
  LayoutGrid,
  BookA
} from 'lucide-react';

export default function MoreDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const navigateTo = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end md:hidden animate-fade-in-up">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-4/5 max-w-sm h-full bg-[#082218] border-l border-[#C5A059]/30 shadow-2xl flex flex-col p-5 overflow-y-auto text-[#F5F1E6]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#C5A059]/20 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C5A059] to-[#8B6914] p-0.5 flex items-center justify-center">
              <img src="/quran-logo.svg" alt="Quran AI" className="w-full h-full object-contain" />
            </div>
            <span className="font-outfit font-bold text-lg text-[#C5A059]">Quran AI</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#F5F1E6]/70 hover:text-[#F5F1E6] hover:bg-[#0c2e23]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Learning & Features Section */}
        <div className="space-y-1 mb-5">
          <p className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider px-2 mb-2">Learning Modules</p>
          
          <button
            onClick={() => navigateTo('/progress')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#0c2e23] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Trophy size={18} className="text-[#C5A059]" />
              <span className="text-sm font-medium">My Progress & Streaks</span>
            </div>
            <ChevronRight size={16} className="text-[#F5F1E6]/40" />
          </button>

          <button
            onClick={() => navigateTo('/live-quran')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#0c2e23] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <BookOpen size={18} className="text-[#C5A059]" />
              <span className="text-sm font-medium">Live Quran 3D Book</span>
            </div>
            <span className="text-[10px] bg-[#C5A059]/20 text-[#C5A059] px-2 py-0.5 rounded-full font-bold">604 Safa</span>
          </button>

          <button
            onClick={() => navigateTo('/vocab')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#0c2e23] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <LayoutGrid size={18} className="text-[#C5A059]" />
              <span className="text-sm font-medium">Vocabulary Flashcards</span>
            </div>
            <ChevronRight size={16} className="text-[#F5F1E6]/40" />
          </button>

          <button
            onClick={() => navigateTo('/qaida')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#0c2e23] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <BookA size={18} className="text-[#C5A059]" />
              <span className="text-sm font-medium">Learn Qaida (Alphabet)</span>
            </div>
            <ChevronRight size={16} className="text-[#F5F1E6]/40" />
          </button>
        </div>

        {/* Bookmarks & Saved */}
        <div className="space-y-1 mb-5">
          <p className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider px-2 mb-2">Saved & Study</p>
          
          <button
            onClick={() => navigateTo('/progress?tab=bookmarks')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#0c2e23] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Bookmark size={18} className="text-[#C5A059]" />
              <span className="text-sm font-medium">Bookmarks</span>
            </div>
            <ChevronRight size={16} className="text-[#F5F1E6]/40" />
          </button>

          <button
            onClick={() => navigateTo('/progress?tab=notes')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#0c2e23] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-[#C5A059]" />
              <span className="text-sm font-medium">Ayah Notes</span>
            </div>
            <ChevronRight size={16} className="text-[#F5F1E6]/40" />
          </button>
        </div>

        {/* Quick Settings */}
        <div className="space-y-1 mb-5">
          <p className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider px-2 mb-2">Preferences</p>
          
          <button
            onClick={() => navigateTo('/quran')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#0c2e23] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-[#C5A059]" />
              <span className="text-sm font-medium">Translation Languages</span>
            </div>
            <span className="text-xs text-[#F5F1E6]/50">Eng, Hi, Ur, Bn</span>
          </button>

          <button
            onClick={() => navigateTo('/quran')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#0c2e23] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Volume2 size={18} className="text-[#C5A059]" />
              <span className="text-sm font-medium">Audio Reciters</span>
            </div>
            <span className="text-xs text-[#F5F1E6]/50">Alafasy</span>
          </button>
        </div>

        {/* App Info Footer */}
        <div className="mt-auto pt-4 border-t border-[#C5A059]/20 text-center">
          <p className="text-xs font-semibold text-[#C5A059]">Quran AI v2.0</p>
          <p className="text-[11px] text-[#F5F1E6]/50 mt-0.5">Read, Understand & Learn</p>
        </div>
      </div>
    </div>
  );
}
