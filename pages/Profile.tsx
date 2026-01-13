
import React, { useState, useRef } from 'react';
import { PatientInfo } from '../types';

interface ProfileProps {
  patient: PatientInfo;
  onUpdate: (info: PatientInfo) => void;
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ patient, onUpdate, onBack }) => {
  const [formData, setFormData] = useState<PatientInfo>(patient);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onBack();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const profileImage = formData.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name || 'user'}`;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-500">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-sky-50 shadow-sm">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <h2 className="text-xl font-black text-slate-900">Data Diri Pasien</h2>
        <div className="w-10"></div>
      </div>

      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-sky-50">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Upload Section */}
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-sky-400 to-emerald-400 p-1 shadow-xl overflow-hidden">
                <img 
                  src={profileImage} 
                  className="w-full h-full rounded-full object-cover bg-white"
                  alt="Profile"
                />
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <i className="fa-solid fa-camera text-white text-2xl"></i>
              </button>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg transform translate-x-1 translate-y-1"
              >
                <i className="fa-solid fa-camera text-xs"></i>
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ketuk foto untuk mengganti</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="cth: Budi Santoso"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-sky-500 font-bold"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tanggal Lahir</label>
              <input 
                type="date" 
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-sky-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nomor Rekam Medis</label>
              <input 
                type="text" 
                value={formData.medicalId}
                onChange={(e) => setFormData({...formData, medicalId: e.target.value})}
                placeholder="cth: PJ-2024-001"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-sky-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Alamat Lengkap</label>
              <textarea 
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Alamat domisili saat ini..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-sky-500 font-bold resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nomor Telepon / WhatsApp</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="cth: 0812XXXXXXXX"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-sky-500 font-bold"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-sky-500 text-white font-black py-5 rounded-[32px] shadow-lg shadow-sky-200 hover:bg-sky-600 transition-all text-lg"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
