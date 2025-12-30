
import React, { useEffect, useState } from 'react';
import { fetchPopular, fetchLatest, fetchColored, fetchByType, fetchByGenre } from '../services/mangaApi';
import { Comic } from '../types';
import ComicCard from '../components/ComicCard';
import { Loader2, ChevronLeft, ChevronRight, Flame, Sparkles, Palette, Book, BookOpen, Layers, Tag } from 'lucide-react';

interface ListingPageProps {
  type: 'popular' | 'latest' | 'colored' | 'type' | 'genre';
  categoryName?: string; // Digunakan untuk 'type' atau 'genre'
  onSelectComic: (slug: string) => void;
}

const ListingPage: React.FC<ListingPageProps> = ({ type, categoryName, onSelectComic }) => {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        if (type === 'popular') {
          const data = await fetchPopular();
          setComics(data);
          setTotalPages(1);
        } else if (type === 'latest') {
          const data = await fetchLatest(page);
          setComics(data);
          setTotalPages(100); 
        } else if (type === 'colored') {
          const data = await fetchColored(page);
          setComics(data);
          setTotalPages(50);
        } else if (type === 'type' && categoryName) {
          const { comics, totalPages: total } = await fetchByType(categoryName, page);
          setComics(comics);
          setTotalPages(total);
        } else if (type === 'genre' && categoryName) {
          const { comics, totalPages: total } = await fetchByGenre(categoryName, page);
          setComics(comics);
          setTotalPages(total);
        }
      } catch (err) {
        console.error("Error loading listing data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [type, categoryName, page]);

  // Reset page when switching category
  useEffect(() => {
    setPage(1);
  }, [type, categoryName]);

  const getHeaderInfo = () => {
    switch(type) {
      case 'popular': return { text: 'Manga Terpopuler', icon: <Flame className="w-8 h-8 text-orange-500" />, sub: 'Daftar komik yang paling banyak dibaca', color: 'orange' };
      case 'latest': return { text: 'Update Terbaru', icon: <Sparkles className="w-8 h-8 text-blue-500" />, sub: 'Jangan lewatkan chapter terbaru setiap harinya', color: 'blue' };
      case 'colored': return { text: 'Manga Berwarna', icon: <Palette className="w-8 h-8 text-purple-500" />, sub: 'Koleksi komik dengan visual penuh warna', color: 'purple' };
      case 'type': {
        const t = categoryName?.toLowerCase() || '';
        if (t === 'manga') return { text: 'Manga Collection', icon: <Book className="w-8 h-8 text-cyan-400" />, sub: 'Komik asal Jepang dengan gaya klasik', color: 'cyan' };
        if (t === 'manhwa') return { text: 'Manhwa Collection', icon: <BookOpen className="w-8 h-8 text-orange-400" />, sub: 'Komik asal Korea Selatan yang memukau', color: 'orange' };
        if (t === 'manhua') return { text: 'Manhua Collection', icon: <Layers className="w-8 h-8 text-pink-400" />, sub: 'Komik asal China dengan cerita epik', color: 'pink' };
        return { text: `${categoryName} List`, icon: <Book className="w-8 h-8 text-slate-400" />, sub: `Daftar komik kategori ${categoryName}`, color: 'slate' };
      }
      case 'genre': return { text: `Genre: ${categoryName}`, icon: <Tag className="w-8 h-8 text-indigo-400" />, sub: `Menampilkan semua komik dengan genre ${categoryName}`, color: 'indigo' };
    }
  };

  const header = getHeaderInfo();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4 bg-[#0b0e14]">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-slate-500 font-bold tracking-widest text-xs uppercase">Memuat Koleksi {categoryName || type}...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 pt-32 pb-20 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-xl">
            {header?.icon}
          </div>
          <div>
            <h1 className="text-4xl md:text-6xl font-bebas text-white tracking-widest leading-none">
              {header?.text}
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-wider">{header?.sub}</p>
          </div>
        </div>
        
        {/* Simple Page Indicator */}
        {type !== 'popular' && (
          <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Halaman</span>
            <span className="text-orange-500 font-black text-xl leading-none">{page} <span className="text-slate-600 text-sm">/ {totalPages}</span></span>
          </div>
        )}
      </div>

      {/* Grid Display */}
      {comics.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
          {comics.map((comic, index) => (
            <ComicCard key={index} comic={comic} onClick={onSelectComic} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center gap-4">
          <BookOpen className="w-12 h-12 text-slate-700" />
          <p className="text-slate-500 font-bold tracking-widest uppercase">Tidak ada data ditemukan.</p>
        </div>
      )}

      {/* Pagination Controls */}
      {type !== 'popular' && totalPages > 1 && (
        <div className="mt-20 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-orange-500 text-white rounded-full font-bold transition-all disabled:opacity-20 disabled:hover:bg-white/5 border border-white/10 active:scale-95 group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> SEBELUMNYA
            </button>
            
            <div className="hidden sm:flex items-center gap-2">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum = page;
                if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;

                if (pageNum < 1 || pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-12 h-12 rounded-xl font-bold transition-all ${
                      page === pageNum 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button 
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-orange-500 text-white rounded-full font-bold transition-all border border-white/10 active:scale-95 group disabled:opacity-20"
            >
              SELANJUTNYA <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
            Halaman {page} dari estimasi {totalPages} halaman
          </p>
        </div>
      )}
    </div>
  );
};

export default ListingPage;
