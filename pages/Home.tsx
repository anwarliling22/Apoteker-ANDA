
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

  // Filter meds that are currently active based on start date and duration
  const activeMeds = meds.filter(med => {
    const start = new Date(med.startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + med.duration);
    const now = new Date();
    return now >= start && now <= end;
  });

  return (
    <div className="space-y-6">
      {/* Date Header */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-sky-50">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{dayName}</h2>
            <p className="text-slate-500 text-sm">Jadwal Minum Obat Anda</p>
          </div>
          <div className="bg-sky-100 text-sky-600 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg">
            {new Date().getDate()}
          </div>
        </div>
        
        {/* Calendar Strip Placeholder */}
        <div className="flex justify-between">
          {[...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - 3 + i);
            const isToday = d.toDateString() === new Date().toDateString();
            return (
              <div key={i} className={`flex flex-col items-center gap-1 p-2 rounded-2xl ${isToday ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400'}`}>
                <span className="text-[10px] font-bold uppercase">{d.toLocaleDateString('id-ID', { weekday: 'short' })}</span>
                <span className="text-sm font-bold">{d.getDate()}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Schedule */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <i className="fa-solid fa-clock text-sky-500"></i>
            Hari Ini
          </h3>
          <span className="text-xs bg-sky-100 text-sky-600 px-2 py-1 rounded-full font-bold">
            {activeMeds.length} Obat Aktif
          </span>
        </div>

        {activeMeds.length === 0 ? (
          <div className="bg-white/50 border-2 border-dashed border-sky-200 rounded-3xl p-8 text-center">
            <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-3 text-sky-300">
              <i className="fa-solid fa-pills text-3xl"></i>
            </div>
            <p className="text-slate-500 text-sm font-medium">Belum ada jadwal obat hari ini.</p>
            <button className="mt-4 text-sky-600 text-sm font-bold hover:underline">Tambah Obat +</button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeMeds.map(med => (
              <div key={med.id} className="space-y-2">
                {med.times.map(time => {
                  const isTaken = logs.some(l => l.date === today && l.medId === med.id && l.timeSlot === time && l.taken);
                  return (
                    <div 
                      key={`${med.id}-${time}`}
                      className={`group flex items-center gap-4 p-4 rounded-3xl border transition-all duration-300 ${
                        isTaken 
                        ? 'bg-emerald-50 border-emerald-100 opacity-75' 
                        : 'bg-white border-sky-50 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-colors ${
                        isTaken ? 'bg-emerald-500 text-white' : 'bg-sky-50 text-sky-500'
                      }`}>
                        {time}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold truncate ${isTaken ? 'text-emerald-900 line-through' : 'text-slate-800'}`}>
                          {med.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {med.frequency}
                        </p>
                      </div>
                      <button 
                        onClick={() => onToggleAdherence({ date: today, medId: med.id, timeSlot: time, taken: true })}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isTaken 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-slate-100 text-slate-400 hover:bg-sky-500 hover:text-white'
                        }`}
                      >
                        <i className={`fa-solid ${isTaken ? 'fa-check' : 'fa-plus'}`}></i>
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Education Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-5 rounded-3xl text-white shadow-xl shadow-emerald-200/50">
        <div className="flex items-center gap-3 mb-3">
          <i className="fa-solid fa-lightbulb text-yellow-300"></i>
          <h4 className="font-bold">Tips Hari Ini</h4>
        </div>
        <p className="text-sm opacity-90 leading-relaxed mb-4">
          Pastikan minum obat tepat waktu sesuai anjuran apoteker untuk hasil terapi yang maksimal.
        </p>
        <button className="bg-white/20 hover:bg-white/30 transition-colors text-white text-xs font-bold py-2 px-4 rounded-xl border border-white/30">
          Selengkapnya
        </button>
      </div>
    </div>
  );
};

export default Home;
