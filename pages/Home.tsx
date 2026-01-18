
import React from 'react';
import { Medication, AdherenceLog } from '../types';

interface HomeProps {
  meds: Medication[];
  logs: AdherenceLog[];
  onToggleAdherence: (log: AdherenceLog) => void;
}

const Home: React.FC<HomeProps> = ({ meds, logs, onToggleAdherence }) => {
  const today = new Date().toISOString().split('T')[0];
  const dayName = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });

  const activeMeds = meds.filter(med => {
    const start = new Date(med.startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + med.duration);
    const now = new Date();
    return now >= start && now <= end;
  });

  const dailyTasks = activeMeds.flatMap(m => m.times.map(t => ({ med: m, time: t })))
    .sort((a, b) => a.time.localeCompare(b.time));

  const completedToday = dailyTasks.filter(task => 
    logs.some(l => l.date === today && l.medId === task.med.id && l.timeSlot === task.time && l.taken)
  ).length;

  const progress = dailyTasks.length > 0 ? Math.round((completedToday / dailyTasks.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-6 page-enter">
      {/* Hero Section - Clean Medical Gradient */}
      <div className="bg-gradient-to-br from-sky-500 to-emerald-500 rounded-[32px] p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1">Selamat Datang</h2>
          <p className="text-white/80 text-sm mb-6">Pantau jadwal obat Anda hari ini.</p>
          
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">Progress Hari Ini</p>
              <h3 className="text-xl font-black">{completedToday} dari {dailyTasks.length} Obat</h3>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-white/30 flex items-center justify-center relative">
               <svg className="w-full h-full absolute inset-0 -rotate-90">
                  <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                  <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" 
                    strokeDasharray={150} 
                    strokeDashoffset={150 - (150 * progress) / 100} 
                    className="text-white" strokeLinecap="round" />
                </svg>
                <span className="text-[10px] font-bold">{progress}%</span>
            </div>
          </div>
        </div>
        <i className="fa-solid fa-notes-medical absolute -right-4 -bottom-4 text-8xl opacity-10"></i>
      </div>

      <div className="px-1 flex justify-between items-end">
        <div>
          <h3 className="font-bold text-slate-800">Jadwal Minum Obat</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase">{dayName}</p>
        </div>
        <div className="text-sky-500 text-xs font-bold">Lihat Semua</div>
      </div>

      <div className="space-y-3">
        {dailyTasks.length === 0 ? (
          <div className="medical-card p-10 text-center">
             <i className="fa-solid fa-calendar-check text-4xl text-slate-200 mb-3"></i>
             <p className="text-slate-400 font-bold text-sm">Tidak ada jadwal obat hari ini.</p>
          </div>
        ) : (
          dailyTasks.map((task, idx) => {
            const isTaken = logs.some(l => l.date === today && l.medId === task.med.id && l.timeSlot === task.time && l.taken);
            return (
              <div 
                key={`${task.med.id}-${task.time}-${idx}`}
                className={`flex items-center gap-4 p-4 medical-card transition-all ${isTaken ? 'bg-emerald-50/50 border-emerald-100' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold ${
                  isTaken ? 'bg-emerald-500 text-white' : 'bg-sky-50 text-sky-600'
                }`}>
                  {task.time}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold text-sm truncate ${isTaken ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                    {task.med.name}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {task.med.frequency}
                  </p>
                </div>
                <button 
                  onClick={() => onToggleAdherence({ date: today, medId: task.med.id, timeSlot: task.time, taken: true })}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isTaken ? 'text-emerald-500 bg-emerald-100' : 'text-slate-300 bg-slate-100'
                  }`}
                >
                  <i className="fa-solid fa-circle-check text-xl"></i>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-sky-500 shadow-sm">
          <i className="fa-solid fa-info-circle"></i>
        </div>
        <p className="text-[10px] text-sky-700 font-medium leading-relaxed">
          Punya pertanyaan seputar obat? Gunakan fitur <b>Apoteker AI</b> untuk konsultasi cepat.
        </p>
      </div>
    </div>
  );
};

export default Home;
