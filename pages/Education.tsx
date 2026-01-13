
import React, { useState } from 'react';
import { EDUCATION_DATA } from '../constants';
import { VideoContent } from '../types';

const Education: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoContent[]>([
    {
      id: 'v1',
      title: 'Tutorial Penggunaan Inhaler',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnail: 'https://picsum.photos/seed/v1/400/225',
      duration: '03:45'
    }
  ]);
  const [showUpload, setShowUpload] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && newVideoTitle) {
      const url = URL.createObjectURL(file);
      const newVideo: VideoContent = {
        id: Date.now().toString(),
        title: newVideoTitle,
        url: url,
        thumbnail: 'https://picsum.photos/seed/' + Math.random() + '/400/225',
        duration: '10:00' // Estimated
      };
      setVideos([newVideo, ...videos]);
      setNewVideoTitle('');
      setShowUpload(false);
      alert("Video berhasil diunggah!");
    }
  };

  const handleVideoError = (id: string) => {
    console.warn(`Video source for ${id} failed to load. Please check connection.`);
  };

  const selectedEdu = EDUCATION_DATA.find(e => e.id === selectedId);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-slate-900 leading-tight">Pusat Edukasi</h2>
        <p className="text-slate-500 text-sm font-medium">Pelajari cara penggunaan obat yang tepat.</p>
      </div>

      {selectedId ? (
        <div className="animate-in fade-in zoom-in duration-300">
           <button 
             onClick={() => setSelectedId(null)}
             className="flex items-center gap-2 text-sky-600 font-black text-sm mb-6 hover:translate-x-[-4px] transition-transform"
           >
             <i className="fa-solid fa-arrow-left"></i> Kembali ke Menu
           </button>
           
           <div className="bg-white rounded-[40px] overflow-hidden shadow-lg border border-sky-50">
             <div className="bg-sky-500 h-40 flex flex-col items-center justify-center text-white relative">
                <i className={`fa-solid ${selectedEdu?.icon} text-8xl opacity-10 absolute`}></i>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                    <i className={`fa-solid ${selectedEdu?.icon} text-3xl`}></i>
                </div>
                <h3 className="text-2xl font-black z-10">{selectedEdu?.title}</h3>
             </div>
             <div className="p-8">
                <div className="flex items-center gap-2 text-sky-600 mb-6">
                  <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center">
                    <i className="fa-solid fa-list-check text-xs"></i>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Tahapan Penggunaan</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-lg font-medium">
                  {selectedEdu?.content}
                </p>
                
                <div className="mt-10 p-6 bg-sky-50 rounded-[32px] border border-sky-100 relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 text-sky-100/50 text-6xl">
                    <i className="fa-solid fa-quote-right"></i>
                  </div>
                  <h4 className="text-sm font-black text-sky-900 mb-2">Saran Apoteker</h4>
                  <p className="text-xs text-sky-800 opacity-80 leading-relaxed font-medium italic">
                    "Gunakan alat bantu ini sesuai instruksi untuk memastikan dosis obat masuk secara efektif ke area target terapi Anda."
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
                className="bg-white p-6 rounded-[32px] border border-sky-50 shadow-sm hover:shadow-xl hover:scale-[1.03] hover:border-sky-200 transition-all flex flex-col items-center text-center gap-4 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center text-3xl group-hover:bg-sky-500 group-hover:text-white transition-all shadow-sm">
                  <i className={`fa-solid ${edu.icon}`}></i>
                </div>
                <span className="font-black text-slate-800 text-sm leading-tight">{edu.title}</span>
                <div className="text-[8px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                  Baca Panduan
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-6 pt-4">
             <div className="flex items-center justify-between">
                <h4 className="font-black text-slate-900 text-lg">Video Pembelajaran</h4>
                <button 
                  onClick={() => setShowUpload(!showUpload)}
                  className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-emerald-100 flex items-center gap-2 hover:bg-emerald-600 active:scale-95 transition-all"
                >
                  <i className="fa-solid fa-upload"></i> UPLOAD
                </button>
             </div>

             {showUpload && (
               <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-emerald-200 animate-in fade-in slide-in-from-top-4 duration-300">
                  <h5 className="font-bold text-slate-800 mb-4">Unggah Video Edukasi</h5>
                  <input 
                    type="text" 
                    placeholder="Judul Video" 
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-emerald-500 font-bold"
                  />
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="video/*" 
                      onChange={handleUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="bg-emerald-50 text-emerald-600 p-8 rounded-xl flex flex-col items-center gap-2 border border-emerald-100">
                      <i className="fa-solid fa-cloud-arrow-up text-3xl"></i>
                      <span className="text-xs font-bold uppercase tracking-widest">Pilih File dari Perangkat</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-4 text-center italic">Durasi maksimal yang disarankan: 10 menit</p>
               </div>
             )}

             <div className="grid gap-6">
                {videos.map(video => (
                  <div key={video.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-sky-50 group hover:shadow-lg transition-all">
                    <div className="relative aspect-video bg-slate-900">
                      <video 
                        src={video.url} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                        controls
                        onError={() => handleVideoError(video.id)}
                      />
                      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-black text-white uppercase tracking-widest">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-5 flex items-center justify-between">
                      <h5 className="font-black text-slate-800 text-sm truncate pr-4">{video.title}</h5>
                      <button className="text-sky-500 hover:text-sky-600 transition-colors">
                        <i className="fa-solid fa-share-nodes"></i>
                      </button>
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
