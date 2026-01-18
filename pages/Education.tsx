
import React, { useState } from 'react';
import { EDUCATION_DATA } from '../constants';
import { VideoContent } from '../types';

const Education: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [videos] = useState<VideoContent[]>([
    {
      id: 'v1',
      title: 'Tutorial Penggunaan Inhaler',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnail: 'https://picsum.photos/seed/med1/800/450',
      duration: '03:45'
    },
    {
      id: 'v2',
      title: 'Cara Tetes Mata yang Benar',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnail: 'https://picsum.photos/seed/med2/800/450',
      duration: '02:15'
    }
  ]);

  const selectedEdu = EDUCATION_DATA.find(e => e.id === selectedId);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-1 px-1">
        <h2 className="text-2xl font-black text-slate-900 leading-tight">Pusat Belajar</h2>
        <p className="text-slate-400 text-sm font-medium">Panduan resmi penggunaan obat & alat medis.</p>
      </div>

      {selectedId ? (
        <div className="animate-in fade-in zoom-in duration-500">
           <button 
             onClick={() => setSelectedId(null)}
             className="flex items-center gap-2 text-sky-600 font-black text-xs mb-6 px-4 py-2 bg-sky-50 rounded-xl hover:bg-sky-100 transition-colors"
           >
             <i className="fa-solid fa-chevron-left"></i> Kembali ke Menu
           </button>
           
           <div className="bg-white rounded-[40px] overflow-hidden shadow-xl border border-slate-100">
             <div className="bg-slate-900 p-10 flex flex-col items-center justify-center text-white relative overflow-hidden">
                <i className={`fa-solid ${selectedEdu?.icon} text-9xl opacity-5 absolute -right-4 -bottom-4`}></i>
                <div className="w-20 h-20 bg-sky-500 rounded-3xl flex items-center justify-center mb-4 shadow-xl shadow-sky-500/20">
                    <i className={`fa-solid ${selectedEdu?.icon} text-3xl`}></i>
                </div>
                <h3 className="text-2xl font-black z-10 text-center">{selectedEdu?.title}</h3>
             </div>
             <div className="p-8">
                <div className="flex items-center gap-3 text-slate-400 mb-6">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                    <i className="fa-solid fa-list-ol text-[10px] text-slate-900"></i>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Panduan Bertahap</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-lg font-medium whitespace-pre-line">
                  {selectedEdu?.content}
                </p>
                
                <div className="mt-10 p-6 bg-emerald-50 rounded-[32px] border border-emerald-100 relative overflow-hidden">
                  <div className="absolute right-[-10px] bottom-[-10px] text-emerald-100 text-6xl opacity-30">
                    <i className="fa-solid fa-user-doctor"></i>
                  </div>
                  <h4 className="text-xs font-black text-emerald-900 uppercase tracking-widest mb-2">Tips Apoteker</h4>
                  <p className="text-sm text-emerald-800 font-medium italic">
                    "Gunakan teknik ini secara konsisten agar obat dapat terserap sempurna oleh tubuh Anda."
                  </p>
                </div>
             </div>
           </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            {EDUCATION_DATA.map(edu => (
              <button
                key={edu.id}
                onClick={() => setSelectedId(edu.id)}
                className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.03] transition-all flex flex-col items-center text-center gap-4 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center text-3xl group-hover:bg-sky-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-sky-100 transition-all">
                  <i className={`fa-solid ${edu.icon}`}></i>
                </div>
                <span className="font-black text-slate-800 text-xs leading-tight">{edu.title}</span>
                <div className="text-[8px] bg-slate-100 text-slate-400 px-3 py-1.5 rounded-lg font-black uppercase tracking-widest group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  Lihat
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-6 pt-6">
             <div className="flex items-center justify-between px-1">
                <h4 className="font-black text-slate-900 text-lg">Video Tutorial</h4>
                <div className="h-1 w-12 bg-sky-500 rounded-full"></div>
             </div>

             <div className="grid gap-6">
                {videos.map(video => (
                  <div key={video.id} className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-slate-100 group">
                    <div className="relative aspect-video overflow-hidden">
                      <img src={video.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={video.title} />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                         <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-sky-500 shadow-xl group-hover:scale-110 transition-transform">
                            <i className="fa-solid fa-play ml-1"></i>
                         </div>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black text-white">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-5 flex items-center justify-between">
                      <h5 className="font-black text-slate-800 text-sm truncate pr-4">{video.title}</h5>
                      <i className="fa-solid fa-arrow-up-right-from-square text-slate-300 text-xs group-hover:text-sky-500 transition-colors"></i>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Education;
