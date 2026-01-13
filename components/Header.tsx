
import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  onChatClick: () => void;
  activePage: Page;
}

const Header: React.FC<HeaderProps> = ({ onChatClick, activePage }) => {
  const getTitle = () => {
    switch (activePage) {
      case 'home': return 'Apoteker ANDA';
      case 'meds': return 'Obat Saya';
      case 'track': return 'Grafik Kepatuhan';
      case 'edu': return 'Edukasi';
      case 'settings': return 'Pengaturan';
      case 'ai-chat': return 'Apoteker AI';
      default: return 'Apoteker Anda';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 max-w-md mx-auto z-50 glass-morphism px-5 py-3 flex items-center justify-between border-b border-sky-100">
      <div className="flex items-center gap-3">
        {/* Hospital Logo */}
        <div className="relative w-10 h-10 flex items-center justify-center">
           <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
             <path d="M40 5 L60 5 L60 40 L95 40 L95 60 L60 60 L60 95 L40 95 Z" fill="#D1D5DB" />
             <path d="M5 40 L40 40 L40 5 L40 95 L40 60 L5 60 Z" fill="#22C55E" />
             <rect x="5" y="40" width="45" height="20" fill="#22C55E" />
             <path 
               d="M15 10 C 30 50, 70 50, 85 90" 
               stroke="#EAB308" 
               strokeWidth="12" 
               fill="none" 
               strokeLinecap="round"
               className="drop-shadow-sm"
             />
           </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">
            {getTitle()}
          </h1>
          <p className="text-[10px] uppercase tracking-wider text-sky-600 font-bold">
            RSUD LASINRANG
          </p>
        </div>
      </div>
      
      {/* AI Chat Entry - Resized even smaller (w-6 h-6) */}
      <button 
        onClick={onChatClick}
        className="flex flex-col items-center group transition-all"
      >
        <div className="w-6 h-6 flex items-center justify-center group-hover:scale-110 transition-transform">
          {/* Stylized speech bubble "i" logo as SVG */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Bubble Outline */}
            <path 
              d="M50 15 C 28 15, 10 30, 10 50 C 10 62, 18 73, 30 80 L 25 90 L 40 85 C 43 85, 47 85, 50 85 C 72 85, 90 70, 90 50 C 90 30, 72 15, 50 15 Z" 
              fill="none" 
              stroke="#334155" 
              strokeWidth="6" 
              strokeLinejoin="round"
            />
            {/* Info Dot */}
            <circle cx="53" cy="38" r="6" fill="#334155" />
            {/* Info Stem (Stylized 'i') */}
            <path 
              d="M55 48 C 50 48, 48 50, 48 55 L 48 70 C 48 75, 50 78, 55 78" 
              fill="none" 
              stroke="#334155" 
              strokeWidth="8" 
              strokeLinecap="round" 
            />
          </svg>
        </div>
        <span className="text-[7px] font-black text-slate-500 uppercase tracking-tighter mt-0.5 group-hover:text-sky-600 transition-colors">
          tanya IA
        </span>
      </button>
    </header>
  );
};

export default Header;
