
import React, { useEffect, useState, useMemo } from 'react';
import { fetchDetail } from '../services/mangaApi';
import { ComicDetail, Comic } from '../types';
import ComicCard from '../components/ComicCard';
import { 
  ArrowLeft, BookOpen, Clock, Tag, Search, X, 
  List, ChevronRight, Loader2, Star, Palette, 
  PenTool, Layers, Info, Sparkles, Heart
} from 'lucide-react';

interface DetailPageProps {
  slug: string;
  onBack: () => void;
  onReadChapter: (chapterSlug: string) => void;
  onSelectComic: (slug: string) => void;
  onToggleFavorite: (comic: Comic) => void;
  isFavorite: boolean;
}

const DetailPage: React.FC<DetailPageProps> = ({ slug, onBack, onReadChapter, onSelectComic, onToggleFavorite, isFavorite }) => {
  const [detail, setDetail] = useState<ComicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        const data = await fetchDetail(slug);
        setDetail(data);
      } catch (err) {
        console.error("Failed to load detail:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  const filteredChapters = useMemo(() => {
    if (!detail?.chapter) return [];
    if (!searchQuery.trim()) return detail.chapter;
    return detail.chapter.filter(ch => ch.chapter.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [detail?.chapter, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#0b0e14]">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse">Menghubungkan ke Database...</p>
      </div>
    );
  }

  if (!detail) return <div className="p-20 text-center text-slate-400">Data tidak ditemukan.</div>;

  const currentComic: Comic = {
    title: detail.title,
    img: detail.img,
    ratting: detail.ratting,
    jenis: detail.jenis_komik,
    type: detail.informasi?.[0]?.title || 'Manga',
    chapter: detail.chapter?.[0]?.chapter || 'N/A',
    update: detail.chapter?.[0]?.update || 'Now',
    url: '',
    slug: slug
  };

  return (
    <div className="min-h-screen pb-20 pt-16 md:pt-24 relative overflow-x-hidden bg-[#0b0e14]">
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none">
        <img src={detail.img} className="w-full h-full object-cover blur-[100px] opacity-20 scale-150" alt="bg" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0e14]/0 via-[#0b0e14]/80 to-[#0b0e14]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group bg-white/5 w-fit px-4 py-2 rounded-full border border-white/5">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-bold uppercase text-[10px] tracking-[0.2em]">KEMBALI</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          <div className="lg:w-[320px] xl:w-[380px] flex-shrink-0">
            <div className="lg:sticky lg:top-28 flex flex-col gap-4">
              <div className="relative group mx-auto lg:mx-0 w-full max-w-[300px] lg:max-w-none">
                <div className="aspect-[3/4.2] rounded-[2rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10">
                  <img src={detail.img} alt={detail.title} className="w-full h-full object-cover" />
                </div>
                {detail.ratting && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1.5 rounded-2xl font-black text-sm flex items-center gap-1.5 shadow-xl border border-white/20">
                    <Star className="w-4 h-4 fill-current" /> {detail.ratting}
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => detail.chapter?.[0]?.slug && onReadChapter(detail.chapter[0].slug)}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-orange-500/20 transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest active:scale-95"
                >
                  <BookOpen className="w-6 h-6" /> BACA
                </button>
                <button 
                  onClick={() => onToggleFavorite(currentComic)}
                  title={isFavorite ? "Remove from Favorite" : "Add to Favorite"}
                  className={`w-20 rounded-[1.5rem] flex items-center justify-center transition-all border border-white/10 active:scale-95 ${isFavorite ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
                >
                  <Heart className={`w-8 h-8 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="bg-[#161b22]/60 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/5 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Status</span>
                    <span className="text-sm text-green-400 font-bold">{detail.status}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Tipe</span>
                    <span className="text-sm text-white font-bold">{detail.jenis_komik}</span>
                  </div>
                </div>
                
                <div className="h-px bg-white/5 w-full"></div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <PenTool className="w-4 h-4 text-orange-500 mt-1" />
                    <div><p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Pengarang</p><p className="text-sm text-slate-200 font-medium">{detail.pengarang || 'N/A'}</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Palette className="w-4 h-4 text-blue-500 mt-1" />
                    <div><p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Ilustrator</p><p className="text-sm text-slate-200 font-medium">{detail.ilustrator || 'N/A'}</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-8">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-7xl font-bebas text-white tracking-wider leading-[0.9]">{detail.title}</h1>
                {detail.judul_alternatif && <p className="text-slate-500 text-sm font-medium italic">aka: {detail.judul_alternatif}</p>}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {detail.tema?.map((t, i) => (
                  <span key={i} className="flex items-center gap-2 px-5 py-2 bg-white/5 text-slate-300 text-xs font-bold rounded-full border border-white/5"><Tag className="w-3.5 h-3.5 text-orange-500" /> {t}</span>
                ))}
              </div>

              <div className="bg-[#161b22]/40 rounded-[2rem] p-6 md:p-10 border border-white/5 relative group">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20"><Info className="w-6 h-6 text-orange-500" /></div>
                <h3 className="text-xl font-bebas text-white mb-6 tracking-widest">Sinopsis</h3>
                <p className="text-slate-400 leading-relaxed text-base font-light">{detail.short_sinopsis || 'Tidak ada sinopsis.'}</p>
              </div>

              <div className="mt-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/20"><List className="w-6 h-6 text-blue-500" /></div>
                    <div><h3 className="text-2xl font-bebas text-white tracking-widest leading-none">Chapters</h3><p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Total {detail.chapter?.length || 0} episodes</p></div>
                  </div>
                  <div className="relative group w-full md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" placeholder="Cari chapter..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#161b22]/60 border border-white/5 rounded-full py-3 pl-11 pr-10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500" />
                  </div>
                </div>
                
                <div className="bg-[#161b22]/20 rounded-[2rem] border border-white/5 overflow-hidden">
                  <div className="max-h-[500px] overflow-y-auto p-4 md:p-6 custom-scrollbar-minimal">
                    {filteredChapters.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                        {filteredChapters.map((ch, i) => (
                          <div key={i} onClick={() => ch.slug && onReadChapter(ch.slug)} className="group flex items-center justify-between p-4 bg-[#161b22]/60 hover:bg-orange-500/10 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all cursor-pointer">
                            <div className="flex flex-col gap-1 min-w-0">
                              <span className="text-sm font-black text-slate-200 group-hover:text-orange-500 truncate">{ch.chapter}</span>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-tighter"><Clock className="w-3 h-3" /> {ch.update}</div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all"><ChevronRight className="w-4 h-4" /></div>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-center py-10 text-slate-500">Chapter tidak ditemukan.</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`.custom-scrollbar-minimal::-webkit-scrollbar { width: 6px; } .custom-scrollbar-minimal::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar-minimal::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }`}</style>
    </div>
  );
};

export default DetailPage;
