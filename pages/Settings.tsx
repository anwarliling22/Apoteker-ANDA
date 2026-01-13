
import React, { useRef } from 'react';
import { Page, PatientInfo } from '../types';

interface SettingsProps {
  onNavigate: (page: Page) => void;
  patient: PatientInfo;
}

const Settings: React.FC<SettingsProps> = ({ onNavigate, patient }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Apoteker Anda - RSUD Lasinrang',
          text: 'Gunakan aplikasi Apoteker Anda untuk memantau jadwal obat Anda pasca rawat inap.',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      alert("Browser Anda tidak mendukung fitur berbagi.");
    }
  };

  const exportData = () => {
    const data = {
      meds: JSON.parse(localStorage.getItem('apoteker_meds') || '[]'),
      logs: JSON.parse(localStorage.getItem('apoteker_logs') || '[]'),
      patient: JSON.parse(localStorage.getItem('apoteker_patient') || '{}')
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_apoteker_anda_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.meds) localStorage.setItem('apoteker_meds', JSON.stringify(data.meds));
        if (data.logs) localStorage.setItem('apoteker_logs', JSON.stringify(data.logs));
        if (data.patient) localStorage.setItem('apoteker_patient', JSON.stringify(data.patient));
        alert("Data berhasil dipulihkan! Aplikasi akan memuat ulang.");
        window.location.reload();
      } catch (err) {
        alert("File backup tidak valid.");
      }
    };
    reader.readAsText(file);
  };

  const sections = [
    { title: 'AKUN', items: [
      { id: 'profile', icon: 'fa-user', label: 'Profil Saya', color: 'text-sky-500', action: () => onNavigate('profile') },
      { id: 'hospital', icon: 'fa-hospital', label: 'Data RSUD Lasinrang', color: 'text-emerald-500' },
    ]},
    { title: 'DATA & PENYIMPANAN', items: [
      { id: 'export', icon: 'fa-file-export', label: 'Cadangkan Data (Export)', color: 'text-blue-500', action: exportData },
      { id: 'import', icon: 'fa-file-import', label: 'Pulihkan Data (Import)', color: 'text-purple-500', action: () => fileInputRef.current?.click() },
      { id: 'status', icon: 'fa-database', label: 'Status: Penyimpanan Lokal', color: 'text-slate-400', sublabel: 'Data hanya tersimpan di HP ini' },
    ]},
    { title: 'LAINNYA', items: [
      { id: 'rate', icon: 'fa-star', label: 'Beri Rating Aplikasi', color: 'text-yellow-500', action: () => alert("Terima kasih!") },
      { id: 'share', icon: 'fa-share-nodes', label: 'Bagikan Aplikasi', color: 'text-pink-500', action: handleShare },
    ]}
  ];

  const profileImage = patient.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name || 'user'}`;

  return (
    <div className="space-y-6 pb-10">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={importData} 
        className="hidden" 
        accept=".json"
      />
      
      <div className="flex flex-col items-center py-6">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-sky-400 to-emerald-400 p-1.5 mb-6 shadow-2xl overflow-hidden">
            <img 
              src={profileImage} 
              className="w-full h-full rounded-full object-cover bg-white"
              alt="Profile"
            />
          </div>
          <button 
            onClick={() => onNavigate('profile')}
            className="absolute bottom-8 right-0 bg-white shadow-xl text-sky-600 w-10 h-10 rounded-full flex items-center justify-center border-2 border-sky-50"
          >
            <i className="fa-solid fa-pen-to-square text-xs"></i>
          </button>
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-1">{patient.name || 'Nama Pasien'}</h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">ID: {patient.medicalId || 'PJ-2025-XXX'}</p>
      </div>

      <div className="space-y-8">
        {sections.map(section => (
          <div key={section.title} className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-6">{section.title}</h4>
            <div className="bg-white rounded-[40px] border border-sky-50 shadow-sm overflow-hidden p-2">
              {section.items.map((item: any, idx) => (
                <button 
                  key={item.label}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between p-5 rounded-[32px] hover:bg-slate-50 transition-colors ${idx !== section.items.length - 1 ? 'mb-1' : ''}`}
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${item.color} shadow-sm`}>
                      <i className={`fa-solid ${item.icon} text-lg`}></i>
                    </div>
                    <div>
                        <span className="font-bold text-slate-700 block">{item.label}</span>
                        {item.sublabel && <span className="text-[9px] text-slate-400 font-bold uppercase">{item.sublabel}</span>}
                    </div>
                  </div>
                  <i className="fa-solid fa-chevron-right text-slate-200 text-xs"></i>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-10 pb-4 px-2">
        <p className="text-[10px] text-center text-slate-300 mt-8 uppercase tracking-[0.4em] font-black">
          Versi 1.0.1 PROTOTYPE • 2025 RSUD Lasinrang
        </p>
      </div>
    </div>
  );
};

export default Settings;
