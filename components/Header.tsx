
import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  onChatClick: () => void;
  activePage: Page;
}

const Header: React.FC<HeaderProps> = ({ onChatClick, activePage }) => {
  const getTitle = () => {
    switch (activePage) {
      case 'home': return 'Beranda';
      case 'meds': return 'Obat Saya';
      case 'track': return 'Statistik';
      case 'edu': return 'Edukasi';
      case 'settings': return 'Akun';
      case 'ai-chat': return 'Apoteker AI';
      case 'profile': return 'Profil';
      default: return 'Apoteker Anda';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 max-w-md mx-auto z-50 bg-white/90 backdrop-blur-md safe-area-top border-b border-slate-100">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white shadow-sm">
             <i className="fa-solid fa-house-medical text-sm"></i>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 tracking-tight leading-none">
              {getTitle()}
            </h1>
            <p className="text-[8px] uppercase tracking-widest text-sky-500 font-bold mt-0.5">
              RSUD Lasinrang Pinrang
            </p>
          </div>
        </div>
        
        <button 
          onClick={onChatClick}
          className="w-9 h-9 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center transition-all active:scale-90 border border-slate-100"
        >
          <i className="fa-solid fa-comment-medical"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
