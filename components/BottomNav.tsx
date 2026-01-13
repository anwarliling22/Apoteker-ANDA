
import React from 'react';
import { Page } from '../types';

interface BottomNavProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage, onPageChange }) => {
  const items = [
    { id: 'home', icon: 'fa-house', label: 'Home' },
    { id: 'meds', icon: 'fa-pills', label: 'Obat' },
    { id: 'track', icon: 'fa-chart-line', label: 'Grafik' },
    { id: 'edu', icon: 'fa-book-medical', label: 'Edukasi' },
    { id: 'settings', icon: 'fa-gear', label: 'Profil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass-morphism border-t border-sky-100 py-2 safe-area-bottom z-50">
      <div className="flex justify-around items-center px-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id as Page)}
            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 min-w-[64px] ${
              activePage === item.id 
                ? 'text-sky-600' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg ${activePage === item.id ? 'scale-110' : ''}`}></i>
            <span className="text-[10px] font-semibold">{item.label}</span>
            {activePage === item.id && (
              <span className="w-1 h-1 bg-sky-600 rounded-full"></span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
