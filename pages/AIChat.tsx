
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
    { role: 'assistant', content: 'Halo! Saya Apoteker AI dari RSUD Lasinrang. Ada yang bisa saya bantu terkait penggunaan obat Anda?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const medContext = meds.length > 0 
        ? `Pasien sedang mengonsumsi: ${meds.map(m => `${m.name} (${m.frequency})`).join(', ')}.`
        : "Pasien belum mendaftarkan obat di aplikasi.";

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `Anda adalah Apoteker virtual ramah dari RSUD Lasinrang Pinrang. 
          Tugas Anda membantu pasien memahami aturan pakai, efek samping, dan cara penyimpanan obat. 
          Gunakan bahasa Indonesia yang santun dan profesional. 
          Selalu ingatkan pasien untuk berkonsultasi langsung dengan apoteker di RSUD Lasinrang jika ada keluhan serius.
          Konteks Medis Pasien: ${medContext}`,
        }
      });

      const aiResponse = response.text || "Maaf, saya sedang mengalami kendala teknis. Silakan coba sesaat lagi.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Maaf, terjadi kesalahan koneksi. Pastikan Anda memiliki akses internet." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] -mt-4 -mx-4">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-sky-500 text-white rounded-tr-none shadow-md' 
                : 'bg-white text-slate-700 rounded-tl-none border border-sky-50 shadow-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-sky-50 flex gap-1">
              <span className="w-2 h-2 bg-sky-300 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-sky-300 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-sky-300 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-white border-t border-sky-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tanyakan sesuatu..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="absolute right-2 w-10 h-10 bg-sky-500 text-white rounded-xl flex items-center justify-center disabled:opacity-50"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2 italic">
          AI dapat membuat kesalahan. Selalu verifikasi informasi dengan tenaga medis profesional.
        </p>
      </div>
    </div>
  );
};

export default AIChat;
