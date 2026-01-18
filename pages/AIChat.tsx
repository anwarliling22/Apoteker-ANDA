
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Medication } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatProps {
  meds: Medication[];
}

const AIChat: React.FC<AIChatProps> = ({ meds }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Halo! Saya Apoteker AI RSUD Lasinrang. Ada yang bisa saya bantu terkait penggunaan obat Anda hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const medContext = meds.length > 0 
        ? `Pasien saat ini memiliki daftar obat: ${meds.map(m => `${m.name} (${m.frequency}, ${m.duration} hari)`).join(', ')}.`
        : "Pasien belum memasukkan daftar obat di aplikasi.";

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `Anda adalah asisten Apoteker profesional dan ramah dari RSUD Lasinrang Pinrang. 
          Nama aplikasi ini adalah "Apoteker Anda".
          Gunakan bahasa Indonesia yang santun. 
          Bantu pasien memahami aturan pakai, interaksi obat, dan cara penyimpanan. 
          JANGAN memberikan diagnosis penyakit berat. 
          Saran medis selalu diakhiri dengan anjuran konsultasi ke Apoteker/Dokter di RSUD Lasinrang jika gejala berlanjut.
          Konteks Pasien: ${medContext}`,
        }
      });

      const aiResponse = response.text || "Mohon maaf, sistem sedang sibuk. Silakan coba lagi nanti.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Maaf, terjadi gangguan koneksi. Pastikan internet Anda aktif." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] -mt-4 -mx-4">
      {/* Header Info */}
      <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center gap-3">
         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Online • Asisten Virtual</span>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 bg-slate-50/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`relative max-w-[85%] px-5 py-4 rounded-[28px] text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-br-none' 
                : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
            }`}>
              {msg.content}
              <div className={`absolute bottom-[-18px] text-[8px] font-bold text-slate-300 uppercase ${msg.role === 'user' ? 'right-2' : 'left-2'}`}>
                {msg.role === 'user' ? 'Anda' : 'Apoteker AI'}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white px-5 py-4 rounded-[28px] rounded-tl-none border border-slate-100 flex gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ketik pesan..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 text-sm font-medium transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-12 h-12 bg-sky-500 text-white rounded-2xl flex items-center justify-center disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-sky-100 active:scale-90"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
        <p className="text-[9px] text-center text-slate-400 mt-3 font-medium">
          Informasi AI perlu divalidasi dengan tenaga medis profesional.
        </p>
      </div>
    </div>
  );
};

export default AIChat;
