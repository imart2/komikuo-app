
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ComicCard from './ComicCard';
import { Comic } from '../types';

interface HorizontalComicListProps {
  comics: Comic[];
  onSelectComic: (slug: string) => void;
}

const HorizontalComicList: React.FC<HorizontalComicListProps> = ({ comics, onSelectComic }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/list px-2">
      {/* Tombol Navigasi - Sekarang lebih kontras dan selalu ada (semi-transparan di mobile) */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-[-10px] lg:left-[-25px] top-[40%] -translate-y-1/2 z-30 bg-[#1e293b]/95 hover:bg-orange-500 text-white p-2.5 lg:p-3.5 rounded-full shadow-2xl transition-all flex items-center justify-center border border-white/10 active:scale-90 hover:scale-110"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
      </button>

      <button 
        onClick={() => scroll('right')}
        className="absolute right-[-10px] lg:right-[-25px] top-[40%] -translate-y-1/2 z-30 bg-[#1e293b]/95 hover:bg-orange-500 text-white p-2.5 lg:p-3.5 rounded-full shadow-2xl transition-all flex items-center justify-center border border-white/10 active:scale-90 hover:scale-110"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
      </button>

      {/* Container List Komik */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 md:gap-6 pb-8 pt-2 snap-x snap-mandatory no-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        {comics.length > 0 ? (
          comics.map((comic, i) => (
            <div key={i} className="min-w-[160px] sm:min-w-[200px] md:min-w-[220px] snap-start">
              <ComicCard comic={comic} onClick={onSelectComic} />
            </div>
          ))
        ) : (
          <div className="flex gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="min-w-[160px] sm:min-w-[200px] md:min-w-[220px] aspect-[3/4.2] bg-slate-800 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HorizontalComicList;
