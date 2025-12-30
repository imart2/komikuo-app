
import React from 'react';
import { Comic } from '../types';
import ComicCard from '../components/ComicCard';
import { Heart, Ghost, ArrowLeft, Sparkles } from 'lucide-react';

interface FavoritePageProps {
  favorites: Comic[];
  onSelectComic: (slug: string) => void;
}

const FavoritePage: React.FC<FavoritePageProps> = ({ favorites, onSelectComic }) => {
  return (
    <div className="container mx-auto px-4 md:px-8 pt-32 pb-20 animate-fade-in min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 shadow-xl">
            <Heart className="w-8 h-8 text-orange-500 fill-current" />
          </div>
          <div>
            <h1 className="text-4xl md:text-6xl font-bebas text-white tracking-widest leading-none">
              Favorit Saya
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-wider">Koleksi komik kesayangan Anda</p>
          </div>
        </div>
        
        <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total</span>
          <span className="text-orange-500 font-black text-xl leading-none">{favorites.length} <span className="text-slate-600 text-sm uppercase">Judul</span></span>
        </div>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
          {favorites.map((comic, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <ComicCard comic={comic} onClick={onSelectComic} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-40 flex flex-col items-center gap-8 text-center">
          <div className="relative">
            <Ghost className="w-24 h-24 text-slate-800 animate-bounce" />
            <div className="absolute inset-0 bg-orange-500/10 blur-[50px] rounded-full"></div>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bebas text-white tracking-widest">Waduh, Masih Kosong!</h2>
            <p className="text-slate-500 max-w-sm mx-auto font-medium">
              Kamu belum menambahkan komik ke daftar favorit. Yuk, cari komik seru dan klik ikon hati untuk menyimpannya di sini.
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()} // Hack to go home if logic allows
            className="flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-black text-sm transition-all uppercase tracking-widest shadow-xl shadow-orange-500/20 active:scale-95"
          >
            <Sparkles className="w-5 h-5" /> Cari Komik Seru
          </button>
        </div>
      )}
    </div>
  );
};

export default FavoritePage;
