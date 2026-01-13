
import React from 'react';
import { Medication, AdherenceLog } from '../types';

interface TrackerProps {
  meds: Medication[];
  logs: AdherenceLog[];
}

const Tracker: React.FC<TrackerProps> = ({ meds, logs }) => {
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const getDayInitial = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'short' });
  };

  const calculateAdherence = (medId: string) => {
    const med = meds.find(m => m.id === medId);
    if (!med) return 0;
    
    const medLogs = logs.filter(l => l.medId === medId && l.taken);
    const expectedPerDay = med.times.length;
    const totalExpected = expectedPerDay * med.duration;
    
    return Math.min(Math.round((medLogs.length / totalExpected) * 100), 100);
  };

  const overallAdherence = meds.length > 0 
    ? Math.round(meds.reduce((acc, curr) => acc + calculateAdherence(curr.id), 0) / meds.length)
    : 0;

  return (
    <div className="space-y-6 pb-10">
      {/* Overall Score Circle */}
      <div className="bg-white p-8 rounded-[40px] border border-sky-50 shadow-sm flex flex-col items-center">
        <div className="relative w-40 h-40 flex items-center justify-center mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
            <circle 
              cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
              strokeDasharray={440} 
              strokeDashoffset={440 - (440 * overallAdherence) / 100} 
              className="text-sky-500 transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-black text-slate-900">{overallAdherence}%</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kepatuhan</span>
          </div>
        </div>
        <p className="text-center text-slate-500 text-sm font-medium leading-relaxed max-w-[240px]">
          {overallAdherence > 80 ? 'Luar biasa! Pertahankan kepatuhan minum obat Anda.' : 'Ayo tingkatkan kedisiplinan minum obat Anda untuk hasil maksimal.'}
        </p>
      </div>

      <div className="bg-gradient-to-br from-indigo-500 to-sky-600 p-7 rounded-[40px] text-white shadow-xl shadow-sky-200/50">
        <h3 className="text-lg font-black mb-1">Riwayat Mingguan</h3>
        <p className="text-[10px] uppercase font-bold tracking-widest opacity-70 mb-8">Statistik 7 Hari Terakhir</p>
        
        <div className="flex items-end justify-between gap-3 h-36">
          {last7Days.map(date => {
            const count = logs.filter(l => l.date === date && l.taken).length;
            const max = meds.reduce((acc, curr) => acc + curr.times.length, 0) || 1;
            const height = Math.min((count / max) * 100, 100);
            
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full bg-white/20 rounded-2xl relative overflow-hidden h-full group">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                    style={{ height: `${height}%` }}
                  ></div>
                  {/* Tooltip on hover simulation */}
                  <div className="absolute top-1 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-bold">{count}</span>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter">{getDayInitial(date)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-black text-slate-900 px-2 flex items-center gap-2">
          <i className="fa-solid fa-chart-simple text-sky-500"></i>
          Detail Per Obat
        </h4>
        {meds.length === 0 ? (
          <p className="text-center text-slate-400 py-10 bg-white rounded-3xl border border-sky-50 italic text-sm">Belum ada data obat aktif.</p>
        ) : (
          meds.map(med => {
            const percent = calculateAdherence(med.id);
            return (
              <div key={med.id} className="bg-white p-6 rounded-[32px] border border-sky-50 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center">
                      <i className="fa-solid fa-pills"></i>
                    </div>
                    <div>
                      <h5 className="font-black text-slate-800 text-sm leading-none mb-1">{med.name}</h5>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{med.frequency}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black ${percent > 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {percent}% Tercapai
                  </div>
                </div>
                
                <div className="w-full bg-slate-50 h-4 rounded-full overflow-hidden border border-slate-100 p-1">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${percent > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Awal: {new Date(med.startDate).toLocaleDateString('id-ID')}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Target: {med.duration} Hari</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Tracker;
