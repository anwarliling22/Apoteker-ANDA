
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
    { id: 'track', icon: 'fa-chart-line', label: 'Progres' },
    { id: 'edu', icon: 'fa-book-medical', label: 'Info' },
    { id: 'settings', icon: 'fa-user-gear', label: 'Akun' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 safe-area-bottom z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center px-2 py-3">
        {items.map((item) => {
          const isActive = activePage === item.id || (item.id === 'settings' && activePage === 'profile');
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id as Page)}
              className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all ${
                isActive ? 'text-sky-500' : 'text-slate-300'
              }`}
            >
              <i className={`fa-solid ${item.icon} text-lg`}></i>
              <span className="text-[9px] font-bold uppercase tracking-tighter">
                {item.label}
              </span>
              {isActive && <div className="w-1 h-1 bg-sky-500 rounded-full mt-0.5"></div>}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
