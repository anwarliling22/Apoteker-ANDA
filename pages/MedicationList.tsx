
import React, { useState } from 'react';
import { Medication } from '../types';
import { FREQUENCY_OPTIONS } from '../constants';

interface MedicationListProps {
  meds: Medication[];
  onAdd: (med: Medication) => void;
  onDelete: (id: string) => void;
}

const MedicationList: React.FC<MedicationListProps> = ({ meds, onAdd, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState(FREQUENCY_OPTIONS[0]);
  const [duration, setDuration] = useState('7');
  const [times, setTimes] = useState<string[]>(['08:00']);
  const [alarmSound, setAlarmSound] = useState<'male' | 'female' | 'device'>('female');

  const startEdit = (med: Medication) => {
    setEditingId(med.id);
    setName(med.name);
    setFrequency(med.frequency);
    setDuration(med.duration.toString());
    setTimes(med.times);
    setAlarmSound(med.alarmSound || 'female');
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMed: Medication = {
      id: editingId || Date.now().toString(),
      name,
      frequency,
      duration: parseInt(duration),
      times,
      startDate: new Date().toISOString().split('T')[0],
      alarmSound
    };
    onAdd(newMed);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setFrequency(FREQUENCY_OPTIONS[0]);
    setDuration('7');
    setTimes(['08:00']);
    setAlarmSound('female');
  };

  const handleAddTime = () => {
    setTimes([...times, '08:00']);
  };

  const updateTime = (index: number, val: string) => {
    const newTimes = [...times];
    newTimes[index] = val;
    setTimes(newTimes);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Obat-obatan Saya</h2>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-sky-500 text-white w-10 h-10 rounded-2xl shadow-lg shadow-sky-200 flex items-center justify-center hover:bg-sky-600 transition-colors"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-[32px] shadow-lg border border-sky-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">{editingId ? 'Edit Obat' : 'Tambah Obat'}</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 p-2">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Nama Obat</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth: Metformin, Paracetamol"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Frekuensi</label>
                <select 
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none"
                >
                  {FREQUENCY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Durasi (Hari)</label>
                <input 
                  required
                  type="number" 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Nada Alarm (Suara AI)</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'male', label: 'Laki-laki', icon: 'fa-person' },
                  { id: 'female', label: 'Perempuan', icon: 'fa-person-dress' },
                  { id: 'device', label: 'Perangkat', icon: 'fa-mobile-screen' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setAlarmSound(s.id as any)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${
                      alarmSound === s.id ? 'bg-sky-500 text-white border-sky-500 shadow-md' : 'bg-white text-slate-400 border-slate-100 hover:border-sky-200'
                    }`}
                  >
                    <i className={`fa-solid ${s.icon} text-lg`}></i>
                    <span className="text-[10px] font-bold">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jam Pemakaian</label>
              <div className="grid grid-cols-2 gap-2">
                {times.map((time, idx) => (
                  <div key={idx} className="flex gap-1">
                    <input 
                      type="time" 
                      value={time}
                      onChange={(e) => updateTime(idx, e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 focus:outline-none text-sm font-bold"
                    />
                    {times.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => setTimes(times.filter((_, i) => i !== idx))}
                        className="text-red-400 px-2"
                      >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button 
                type="button" 
                onClick={handleAddTime}
                className="text-sky-600 text-xs font-bold flex items-center justify-center w-full py-2 border-2 border-dashed border-sky-100 rounded-xl hover:bg-sky-50"
              >
                <i className="fa-solid fa-plus mr-1"></i> Tambah Jam
              </button>
            </div>

            <button 
              type="submit"
              className="w-full bg-sky-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-sky-200 hover:bg-sky-600 transition-all mt-4 text-lg"
            >
              {editingId ? 'Simpan Perubahan' : 'Simpan Obat'}
            </button>
          </form>
        </div>
      ) : (
        <div className="grid gap-4 pb-10">
          {meds.length === 0 ? (
            <div className="p-16 text-center text-slate-300 bg-white rounded-[40px] border border-sky-50">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl opacity-50">
                <i className="fa-solid fa-box-open"></i>
               </div>
               <p className="font-bold">Belum ada daftar obat.</p>
               <p className="text-xs mt-1">Tekan tombol + di atas untuk menambah.</p>
            </div>
          ) : (
            meds.map(med => (
              <div key={med.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-sky-50 group hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                      <i className="fa-solid fa-capsules"></i>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-lg leading-tight">{med.name}</h4>
                      <p className="text-[10px] font-bold text-sky-500 uppercase tracking-wider">{med.frequency} • {med.duration} Hari</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEdit(med)}
                      className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:bg-sky-50 hover:text-sky-500 flex items-center justify-center transition-all"
                    >
                      <i className="fa-solid fa-pen text-xs"></i>
                    </button>
                    <button 
                      onClick={() => onDelete(med.id)}
                      className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all"
                    >
                      <i className="fa-solid fa-trash text-xs"></i>
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {med.times.map(t => (
                    <span key={t} className="text-[10px] font-black bg-slate-50 text-slate-500 px-3 py-2 rounded-xl border border-slate-100 uppercase tracking-wider">
                      <i className="fa-regular fa-bell mr-1 text-sky-500"></i> {t}
                    </span>
                  ))}
                  <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-2 rounded-xl border border-emerald-100 uppercase tracking-wider">
                    <i className="fa-solid fa-microphone-lines mr-1"></i> {med.alarmSound}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MedicationList;
