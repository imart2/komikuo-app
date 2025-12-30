
import React from 'react';
import { Star, Clock, Palette } from 'lucide-react';
import { Comic } from '../types';

interface ComicCardProps {
  comic: Comic;
  onClick: (slug: string) => void;
}

const ComicCard: React.FC<ComicCardProps> = ({ comic, onClick }) => {
  const isColored = comic.jenis?.toLowerCase().includes('warna');
  
  return (
    <div 
      className="group relative flex flex-col gap-3 cursor-pointer animate-fade-in h-full"
      onClick={() => comic.slug && onClick(comic.slug)}
    >
      <div className="relative aspect-[3/4.2] overflow-hidden rounded-2xl shadow-xl transition-all duration-500 group-hover:scale-[1.02] border border-white/5">
        <img 
          src={comic.img} 
          alt={comic.title} 
          className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-60"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/comic/300/420';
          }}
        />
        
        {/* Overlays */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {isColored && (
            <div className="bg-orange-600 text-[10px] font-black text-white px-2 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-tight shadow-lg">
              <Palette className="w-2.5 h-2.5" /> Color
            </div>
          )}
          <div className="bg-slate-900/90 backdrop-blur-sm text-[10px] font-bold text-slate-200 px-2 py-0.5 rounded-md uppercase tracking-tight shadow-lg border border-white/5">
            {comic.type || 'Manga'}
          </div>
        </div>

        {comic.ratting && (
          <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-md flex items-center gap-1 z-10 border border-white/5 shadow-lg">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-[11px] font-black text-white">{comic.ratting}</span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-xs shadow-2xl transition-colors uppercase tracking-widest border border-white/10">
            Read Now
          </button>
        </div>
        
        {/* Gradient shadow for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      <div className="flex flex-col gap-1 px-1">
        <h3 className="font-bold text-sm line-clamp-2 leading-snug group-hover:text-orange-500 transition-colors h-10">
          {comic.title}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px] font-bold text-slate-300 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
            {comic.chapter || 'N/A'}
          </span>
          <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 uppercase tracking-tighter">
            <Clock className="w-3 h-3" />
            <span>{comic.update}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComicCard;
