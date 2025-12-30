
import React, { useEffect, useState } from 'react';
import { fetchPopular, fetchLatest, fetchColored, fetchTypes } from '../services/mangaApi';
import { Comic } from '../types';
import HorizontalComicList from '../components/HorizontalComicList';
import { Flame, Sparkles, Palette, ChevronRight, Loader2, AlertCircle, Filter } from 'lucide-react';

interface HomePageProps {
  onSelectComic: (slug: string) => void;
  onSelectType: (type: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSelectComic, onSelectType }) => {
  const [popular, setPopular] = useState<Comic[]>([]);
  const [latest, setLatest] = useState<Comic[]>([]);
  const [colored, setColored] = useState<Comic[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const results = await Promise.allSettled([
          fetchPopular(),
          fetchLatest(1),
          fetchColored(1),
          fetchTypes()
        ]);
        
        if (results[0].status === 'fulfilled') setPopular(results[0].value);
        if (results[1].status === 'fulfilled') setLatest(results[1].value);
        if (results[2].status === 'fulfilled') setColored(results[2].value);
        if (results[3].status === 'fulfilled') setTypes(results[3].value);

      } catch (err) {
        console.error("Critical failure loading home data:", err);
        setError("Gagal memuat data dari server. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#0b0e14]">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse uppercase tracking-widest text-xs">Mempersiapkan Perpustakaan...</p>
      </div>
    );
  }

  const featuredComic = popular[0];

  const getTypeStyle = (type: string) => {
    switch(type.toLowerCase()) {
      case 'manga': return 'from-blue-500 to-cyan-500 shadow-blue-500/20';
      case 'manhwa': return 'from-orange-500 to-red-500 shadow-orange-500/20';
      case 'manhua': return 'from-purple-500 to-pink-500 shadow-purple-500/20';
      default: return 'from-slate-500 to-slate-700 shadow-slate-500/20';
    }
  };

  return (
    <main className="pb-20">
      {/* Hero Banner Section */}
      <section className="relative h-[85vh] min-h-[550px] w-full overflow-hidden">
        {featuredComic && (
          <>
            <div className="absolute inset-0">
              <img 
                src={featuredComic.img} 
                alt={featuredComic.title} 
                className="w-full h-full object-cover brightness-[0.3] scale-105 blur-[1px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/60 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e14] via-transparent to-transparent"></div>
            </div>

            <div className="relative container mx-auto md:mt-10 px-4 md:px-8 h-full flex flex-col justify-center">
              <div className="max-w-3xl flex flex-col gap-6 animate-fade-in pt-12">
                <div className="flex items-center gap-3">
                  <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">Featured</span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Flame className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold uppercase tracking-tighter">Trending Today</span>
                  </div>
                </div>
                
                <h1 className="text-5xl md:text-8xl font-bebas leading-[0.85] tracking-tight text-white drop-shadow-2xl">
                  {featuredComic.title}
                </h1>
                
                <div className="flex items-center gap-6 text-sm font-medium text-slate-300">
                  {featuredComic.jenis && <span className="flex items-center gap-1.5"><Palette className="w-4 h-4 text-orange-400" /> {featuredComic.jenis}</span>}
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">{featuredComic.type}</span>
                  <span className="text-orange-400 font-bold">{featuredComic.chapter}</span>
                </div>

                <p className="text-slate-400 line-clamp-3 md:text-lg max-w-xl">
                  Jelajahi dunia {featuredComic.title}. Sebuah mahakarya cerita, aksi, dan emosi. Mulai petualanganmu di chapter terbaru sekarang.
                </p>

                <div className="flex flex-wrap gap-4 mt-4">
                  <button 
                    onClick={() => featuredComic.slug && onSelectComic(featuredComic.slug)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-orange-500/30 transition-all flex items-center gap-2 group text-lg"
                  >
                    BACA SEKARANG <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Type Circles Filter Section */}
      <section className="container mx-auto px-4 md:px-8 md:mt-10 relative z-20">
        <div className="bg-[#161b22]/80 backdrop-blur-2xl p-6 md:p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Pilih Berdasarkan Tipe</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => onSelectType(type)}
                  className="group flex flex-col items-center gap-3 transition-transform active:scale-90"
                >
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${getTypeStyle(type)} flex items-center justify-center text-white font-bebas text-3xl md:text-4xl tracking-tighter shadow-xl group-hover:scale-110 transition-all border-4 border-[#0b0e14]`}>
                    {type[0]}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-300 group-hover:text-orange-500 transition-colors">
                    {type}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 1. Most Popular Section */}
      <section id="popular" className="container mx-auto px-4 md:px-8 mt-24 relative z-10 mb-24">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500/20 rounded-xl border border-orange-500/20 shadow-inner">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-bebas text-white uppercase tracking-widest leading-none">Most Popular</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Favorit komunitas bulan ini</p>
            </div>
          </div>
        </div>
        <HorizontalComicList comics={popular} onSelectComic={onSelectComic} />
      </section>

      {/* 2. Manga Terbaru Section */}
      <section id="latest" className="container mx-auto px-4 md:px-8 mb-24">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/20 shadow-inner">
              <Sparkles className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-bebas text-white uppercase tracking-widest leading-none">Komik Terbaru</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Baru saja diperbarui</p>
            </div>
          </div>
        </div>
        <HorizontalComicList comics={latest} onSelectComic={onSelectComic} />
      </section>

      {/* 3. Manga Berwarna Section */}
      <section id="colored" className="container mx-auto px-4 md:px-8">
        <div className="bg-gradient-to-br from-purple-500/5 via-orange-500/5 to-transparent p-6 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/20 shadow-inner">
                <Palette className="w-7 h-7 text-purple-500" />
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-bebas text-white uppercase tracking-widest leading-none">Komik Berwarna</h2>
                <p className="text-sm text-slate-500 mt-1 font-medium italic">Karya seni memukau dengan warna penuh.</p>
              </div>
            </div>
          </div>
          <HorizontalComicList comics={colored} onSelectComic={onSelectComic} />
        </div>
      </section>
    </main>
  );
};

export default HomePage;
