
import React, { useEffect, useState, useCallback } from 'react';
import { fetchChapterImages } from '../services/mangaApi';
import { ChapterData } from '../types';
import { ArrowLeft, ChevronLeft, ChevronRight, Settings, Loader2, Info, Layout, Share2, RefreshCw, AlertTriangle } from 'lucide-react';

interface ReadingPageProps {
  slug: string;
  onBack: () => void;
  onNavigate: (newSlug: string) => void;
}

// Sub-component untuk menangani masing-masing gambar secara efisien
const ReadingImage: React.FC<{ 
  src: string; 
  index: number; 
  onLoaded: () => void;
  isPriority: boolean;
}> = ({ src, index, onLoaded, isPriority }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [retryKey, setRetryKey] = useState(0);

  const handleLoad = () => {
    setStatus('success');
    onLoaded();
  };

  const handleError = () => {
    setStatus('error');
  };

  const handleRetry = () => {
    setStatus('loading');
    setRetryKey(prev => prev + 1);
  };

  return (
    <div className="w-full relative min-h-[400px] sm:min-h-[600px] flex flex-col items-center justify-center bg-black/20 border-b border-white/5">
      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-[#06080a]">
          <Loader2 className="w-8 h-8 text-orange-500/40 animate-spin" />
          <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Loading Page {index + 1}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 bg-red-950/10 backdrop-blur-sm">
          <AlertTriangle className="w-10 h-10 text-red-500/50" />
          <div className="text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gagal memuat halaman {index + 1}</p>
            <button 
              onClick={handleRetry}
              className="mt-3 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black rounded-full border border-white/10 transition-all uppercase tracking-widest"
            >
              <RefreshCw className="w-3 h-3" /> Coba Lagi
            </button>
          </div>
        </div>
      )}

      <img 
        key={`${src}-${retryKey}`}
        src={src} 
        alt={`Halaman ${index + 1}`} 
        className={`w-full h-auto block select-none pointer-events-none transition-all duration-700 ${status === 'success' ? 'opacity-100' : 'opacity-0'}`} 
        loading={isPriority ? "eager" : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
        // Hint browser to prioritize the first few images
        {...(isPriority ? { fetchpriority: "high" } : {})}
      />
      
      <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black text-slate-500 border border-white/5 pointer-events-none tracking-widest">
        {index + 1}
      </div>
    </div>
  );
};

const ReadingPage: React.FC<ReadingPageProps> = ({ slug, onBack, onNavigate }) => {
  const [data, setData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNav, setShowNav] = useState(true);
  const [imageLoadedCount, setImageLoadedCount] = useState(0);

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      setImageLoadedCount(0);
      const res = await fetchChapterImages(slug);
      setData(res);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Failed to load chapter:", err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setShowNav(currentScroll < lastScroll || currentScroll < 100);
      lastScroll = currentScroll;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleImageLoaded = () => {
    setImageLoadedCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#0b0e14]">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-orange-500 rounded-lg rotate-45 animate-pulse"></div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-white font-bebas text-2xl tracking-widest uppercase">Mempersiapkan Chapter</p>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Mengoptimalkan jalur gambar untuk koneksi Anda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06080a] select-none flex flex-col items-center">
      {/* Dynamic Header */}
      <nav className={`fixed top-0 w-full z-50 bg-[#0b0e14]/95 backdrop-blur-md border-b border-white/5 transition-transform duration-500 shadow-2xl ${showNav ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack} 
              className="p-2.5 hover:bg-white/5 rounded-xl transition-all active:scale-90 border border-transparent hover:border-white/10"
            >
              <ArrowLeft className="w-6 h-6 text-slate-300" />
            </button>
            <div className="flex flex-col max-w-[150px] sm:max-w-md">
              <h2 className="text-sm font-black text-white line-clamp-1 uppercase tracking-tight">{data?.title}</h2>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-orange-500 font-black uppercase tracking-[0.2em] animate-pulse">Immersive Reader</span>
                <span className="text-[9px] text-slate-500 font-bold">•</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{imageLoadedCount} / {data?.images.length} LOADED</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-900/50 rounded-2xl p-1 border border-white/5 backdrop-blur-sm shadow-inner">
              <button 
                disabled={!data?.prev_slug}
                onClick={() => data?.prev_slug && onNavigate(data.prev_slug)}
                className="p-2 text-slate-300 disabled:opacity-20 hover:bg-white/5 rounded-xl transition-all active:scale-90"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="w-px h-6 bg-white/10 mx-1"></div>
              <button 
                disabled={!data?.next_slug}
                onClick={() => data?.next_slug && onNavigate(data.next_slug)}
                className="p-2 text-slate-300 disabled:opacity-20 hover:bg-white/5 rounded-xl transition-all active:scale-90"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Reader Content */}
      <div className="w-full max-w-[950px] pt-20 flex flex-col items-center bg-black/40 relative shadow-[0_0_100px_rgba(0,0,0,0.5)]">
        {data?.images && data.images.length > 0 ? (
          data.images.map((img, i) => (
            <ReadingImage 
              key={i} 
              src={img} 
              index={i} 
              onLoaded={handleImageLoaded}
              isPriority={i < 2} // Preload 2 halaman pertama
            />
          ))
        ) : (
          <div className="py-40 text-center flex flex-col items-center gap-6 px-8">
            <div className="p-6 bg-red-500/10 rounded-full border border-red-500/20">
              <Info className="w-16 h-16 text-red-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bebas text-white tracking-widest">DATABASE ERROR</h3>
              <p className="text-slate-400 max-w-sm">Maaf, endpoint API tidak mengembalikan daftar gambar. Silakan hubungi admin atau coba chapter lain.</p>
            </div>
            <button 
              onClick={onBack}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold border border-white/10 transition-all uppercase tracking-widest text-xs"
            >
              Kembali ke Detail
            </button>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="w-full container mx-auto px-4 pb-32 pt-16 flex flex-col items-center gap-10">
        <div className="w-full max-w-lg h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <button 
            disabled={!data?.prev_slug}
            onClick={() => data?.prev_slug && onNavigate(data.prev_slug)}
            className="w-full sm:w-64 flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-2xl font-bold transition-all disabled:opacity-20 border border-white/5 active:scale-95 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
            <span className="uppercase tracking-widest text-xs">Previous</span>
          </button>
          
          <button 
            disabled={!data?.next_slug}
            onClick={() => data?.next_slug && onNavigate(data.next_slug)}
            className="w-full sm:w-64 flex items-center justify-center gap-3 px-8 py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black transition-all disabled:opacity-20 shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] active:scale-95 group"
          >
            <span className="uppercase tracking-widest text-sm">Next Chapter</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <button 
          onClick={onBack} 
          className="group flex items-center gap-3 text-slate-600 hover:text-white transition-all text-xs font-black uppercase tracking-[0.3em]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Selesai Membaca
        </button>
      </div>

      {/* Scroll to Top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 p-4 bg-[#1e293b]/80 backdrop-blur-md text-white rounded-2xl shadow-2xl transition-all z-40 active:scale-90 border border-white/10 ${showNav ? 'translate-y-24 opacity-0' : 'translate-y-0 opacity-100'}`}
      >
        <Layout className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ReadingPage;
