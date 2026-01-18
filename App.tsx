
import React, { useState, useEffect, useCallback } from 'react';
import { Page, Medication, AdherenceLog, PatientInfo } from './types';
import Home from './pages/Home';
import MedicationList from './pages/MedicationList';
import Tracker from './pages/Tracker';
import Education from './pages/Education';
import Settings from './pages/Settings';
import AIChat from './pages/AIChat';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import { GoogleGenAI, Modality } from "@google/genai";

// Audio Decoding Helpers
const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const decodeRawPcm = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [meds, setMeds] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<AdherenceLog[]>([]);
  const [patient, setPatient] = useState<PatientInfo>({
    name: '',
    birthDate: '',
    medicalId: '',
    address: '',
    phone: ''
  });
  const [activeAlarm, setActiveAlarm] = useState<{ med: Medication, time: string } | null>(null);

  useEffect(() => {
    const savedMeds = localStorage.getItem('apoteker_meds');
    if (savedMeds) setMeds(JSON.parse(savedMeds));
    const savedLogs = localStorage.getItem('apoteker_logs');
    if (savedLogs) setLogs(JSON.parse(savedLogs));
    const savedPatient = localStorage.getItem('apoteker_patient');
    if (savedPatient) setPatient(JSON.parse(savedPatient));

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => localStorage.setItem('apoteker_meds', JSON.stringify(meds)), [meds]);
  useEffect(() => localStorage.setItem('apoteker_logs', JSON.stringify(logs)), [logs]);
  useEffect(() => localStorage.setItem('apoteker_patient', JSON.stringify(patient)), [patient]);

  const playTTS = async (voice: 'male' | 'female') => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const voiceName = voice === 'male' ? 'Kore' : 'Puck'; 
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Halo bapak atau ibu. Waktunya minum obat Anda. Jangan lupa ya!` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const bytes = decodeBase64(base64Audio);
        const audioBuffer = await decodeRawPcm(bytes, audioContext, 24000, 1);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        if (audioContext.state === 'suspended') await audioContext.resume();
        source.start();
      }
    } catch (e) {
      console.error("TTS failed", e);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTimeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':');

      meds.forEach(med => {
        const startDate = new Date(med.startDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + med.duration);
        
        if (now >= startDate && now <= endDate) {
          med.times.forEach(time => {
            if (time === currentTimeStr) {
              const alreadyNotified = logs.find(l => l.date === today && l.medId === med.id && l.timeSlot === time && l.notifiedAt && (Date.now() - l.notifiedAt < 61000));
              const alreadyTaken = logs.find(l => l.date === today && l.medId === med.id && l.timeSlot === time && l.taken);

              if (!alreadyNotified && !alreadyTaken) {
                setActiveAlarm({ med, time });
                if (Notification.permission === "granted") {
                  new Notification(`Waktunya Obat: ${med.name}`, {
                    body: `Jadwal: ${time}. Klik untuk detail.`,
                  });
                }
                if (med.alarmSound !== 'device') playTTS(med.alarmSound as 'male' | 'female');
                setLogs(prev => [...prev, { date: today, medId: med.id, timeSlot: time, taken: false, notifiedAt: Date.now() }]);
              }
            }
          });
        }
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [meds, logs]);

  const addMedication = (newMed: Medication) => {
    setMeds(prev => {
      const idx = prev.findIndex(m => m.id === newMed.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = newMed;
        return updated;
      }
      return [...prev, newMed];
    });
    setCurrentPage('meds');
  };

  const deleteMedication = (id: string) => {
    setMeds(prev => prev.filter(m => m.id !== id));
    setLogs(prev => prev.filter(l => l.medId !== id));
  };

  const toggleAdherence = (log: AdherenceLog) => {
    setLogs(prev => {
      const exists = prev.find(l => l.date === log.date && l.medId === log.medId && l.timeSlot === log.timeSlot);
      if (exists) {
        return prev.map(l => (l === exists ? { ...l, taken: !l.taken, notifiedAt: Date.now() } : l));
      } else {
        return [...prev, { ...log, taken: true, notifiedAt: Date.now() }];
      }
    });
    setActiveAlarm(null);
  };

  const renderPage = () => {
    const pageClass = "page-transition px-4 py-4 pt-20";
    switch (currentPage) {
      case 'home': return <div className={pageClass}><Home meds={meds} logs={logs} onToggleAdherence={toggleAdherence} /></div>;
      case 'meds': return <div className={pageClass}><MedicationList meds={meds} onAdd={addMedication} onDelete={deleteMedication} /></div>;
      case 'track': return <div className={pageClass}><Tracker meds={meds} logs={logs} /></div>;
      case 'edu': return <div className={pageClass}><Education /></div>;
      case 'settings': return <div className={pageClass}><Settings onNavigate={setCurrentPage} patient={patient} /></div>;
      case 'ai-chat': return <div className={pageClass}><AIChat meds={meds} /></div>;
      case 'profile': return <div className={pageClass}><Profile patient={patient} onUpdate={setPatient} onBack={() => setCurrentPage('settings')} /></div>;
      default: return <div className={pageClass}><Home meds={meds} logs={logs} onToggleAdherence={toggleAdherence} /></div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-sky-50 text-slate-800 pb-20 max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <Header onChatClick={() => setCurrentPage('ai-chat')} activePage={currentPage} />
      
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>

      <BottomNav activePage={currentPage} onPageChange={setCurrentPage} />

      {activeAlarm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full rounded-[40px] p-8 text-center shadow-2xl border-4 border-sky-100 animate-in zoom-in slide-in-from-bottom-10 duration-500">
            <div className="w-24 h-24 bg-sky-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-sky-200 animate-bounce">
              <i className="fa-solid fa-bell text-4xl"></i>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Waktunya Minum Obat!</h2>
            <p className="text-sky-600 font-bold text-lg mb-6">{activeAlarm.med.name} - {activeAlarm.time}</p>
            <div className="grid gap-4">
              <button 
                onClick={() => toggleAdherence({ date: new Date().toISOString().split('T')[0], medId: activeAlarm.med.id, timeSlot: activeAlarm.time, taken: true })}
                className="w-full bg-emerald-500 text-white font-black py-5 rounded-3xl shadow-lg shadow-emerald-200 text-lg active:scale-95 transition-all"
              >
                <i className="fa-solid fa-check mr-2"></i> Sudah Diminum
              </button>
              <button 
                onClick={() => setActiveAlarm(null)}
                className="w-full bg-amber-500 text-white font-black py-5 rounded-3xl shadow-lg shadow-amber-200 text-lg active:scale-95 transition-all"
              >
                <i className="fa-solid fa-clock mr-2"></i> Nanti Saja
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="fixed -top-24 -right-24 w-64 h-64 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="fixed -bottom-24 -left-24 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none z-0"></div>
    </div>
  );
};

export default App;
