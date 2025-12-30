
import React, { useEffect, useState, useMemo } from 'react';
import { fetchSearch } from '../services/mangaApi';
import { Comic } from '../types';
import ComicCard from '../components/ComicCard';
import { Loader2, Search, Frown, ChevronLeft, ChevronRight } from 'lucide-react';

interface SearchPageProps {
  query: string;
  onSelectComic: (slug: string) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ query, onSelectComic }) => {
  const [results, setResults] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Konfigurasi Pagination
  // 15 item = 3 baris pada grid 5 kolom (desktop)
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    const performSearch = async () => {
      if (!query) return;
      setLoading(true);
      setCurrentPage(1); // Reset ke halaman 1 setiap pencarian baru
      window.scrollTo(0, 0);
      try {
        const data = await fetchSearch(query);
        setResults(data);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    };
    performSearch();
  }, [query]);

  // Hitung data yang ditampilkan berdasarkan halaman aktif
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return results.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [results, currentPage]);

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-slate-500 font-bold tracking-widest text-xs uppercase">Mencari "{query}"...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 pt-28 pb-20 animate-fade-in">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
            <Search className="w-8 h-8 text-orange-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-bebas text-white tracking-widest leading-none">
              Hasil Pencarian
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-2">
              Ditemukan <span className="text-white font-bold">{results.length}</span> komik untuk: <span className="text-orange-500 font-bold">"{query}"</span>
            </p>
          </div>
        </div>

        {/* Indikator Halaman di Header (Hanya muncul jika ada pagination) */}
        {totalPages > 1 && (
          <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Halaman</span>
            <span className="text-orange-500 font-black text-xl leading-none">{currentPage} <span className="text-slate-600 text-sm">/ {totalPages}</span></span>
          </div>
        )}
      </div>

      {results.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
            {paginatedResults.map((comic, index) => (
              <ComicCard key={index} comic={comic} onClick={onSelectComic} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-20 flex flex-col items-center gap-6">
              <div className="flex items-center gap-4">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-orange-500 text-white rounded-full font-bold transition-all disabled:opacity-20 disabled:hover:bg-white/5 border border-white/10 active:scale-95 group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> SEBELUMNYA
                </button>
                
                <div className="hidden sm:flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Logika untuk hanya menampilkan beberapa nomor halaman jika terlalu banyak
                    if (totalPages > 5 && Math.abs(pageNum - currentPage) > 1 && pageNum !== 1 && pageNum !== totalPages) {
                      if (pageNum === 2 || pageNum === totalPages - 1) return <span key={pageNum} className="text-slate-700">...</span>;
                      return null;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-xl font-bold transition-all ${
                          currentPage === pageNum 
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                          : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-orange-500 text-white rounded-full font-bold transition-all border border-white/10 active:scale-95 group"
                >
                  SELANJUTNYA <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
                Menampilkan {paginatedResults.length} dari {results.length} hasil
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="py-32 flex flex-col items-center gap-6 text-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
            <Frown className="w-12 h-12 text-slate-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bebas text-white tracking-widest">Tidak Ada Hasil</h2>
            <p className="text-slate-500 max-w-xs">Maaf, kami tidak dapat menemukan komik dengan judul "{query}". Coba kata kunci lain.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
