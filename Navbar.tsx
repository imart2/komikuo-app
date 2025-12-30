
import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, Bell, User, ChevronDown, Tag, LayoutGrid, Heart, Trash2, Book, Layers, ChevronRight } from 'lucide-react';
import { fetchTypes, fetchGenres } from '../services/mangaApi';
import { Notification } from '../types';

interface NavbarProps {
  onNavigate: (view: any) => void;
  onSearch: (query: string) => void;
  onSelectType: (type: string) => void;
  onSelectGenre: (genre: string) => void;
  currentView: string;
  isLoggedIn: boolean;
  notifications: Notification[];
  onClearNotifications: () => void;
  onToggleLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onNavigate, onSearch, onSelectType, onSelectGenre, currentView, 
  isLoggedIn, notifications, onClearNotifications, onToggleLogin 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [types, setTypes] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  
  // Desktop Menu States
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const [genreMenuOpen, setGenreMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);

  // Mobile Menu States
  const [mobileTypesOpen, setMobileTypesOpen] = useState(false);
  const [mobileGenresOpen, setMobileGenresOpen] = useState(false);

  const typeRef = useRef<HTMLDivElement>(null);
  const genreRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update transparansi navbar
      setIsScrolled(currentScrollY > 20);

      // Logika Sembunyi/Muncul Navbar
      // Jika menu mobile terbuka, jangan sembunyikan navbar
      if (mobileMenuOpen) {
        setIsVisible(true);
      } else {
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
          // Scroll ke bawah
          setIsVisible(false);
        } else {
          // Scroll ke atas
          setIsVisible(true);
        }
      }
      lastScrollY.current = currentScrollY;
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) setTypeMenuOpen(false);
      if (genreRef.current && !genreRef.current.contains(event.target as Node)) setGenreMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setNotifMenuOpen(false);
    };

    const loadCategories = async () => {
      const [typesData, genresData] = await Promise.all([fetchTypes(), fetchGenres()]);
      setTypes(typesData);
      setGenres(genresData);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousedown', handleClickOutside);
    loadCategories();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]); // Re-run effect saat menu mobile dibuka/tutup agar listener up-to-date

  // Mencegah scroll body saat menu mobile terbuka
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const handleNavClick = (view: any) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setTypeMenuOpen(false);
    setGenreMenuOpen(false);
    setNotifMenuOpen(false);
  };

  const handleCategorySelect = (type: 'type' | 'genre', value: string) => {
    if (type === 'type') onSelectType(value);
    else onSelectGenre(value);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      setMobileMenuOpen(false);
      setSearchInput('');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setIsVisible(true); // Pastikan tetap terlihat saat dibuka
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-[100] transition-all duration-500 transform ${
        isScrolled ? 'bg-[#0b0e14]/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
      } ${
        isVisible || mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button onClick={() => handleNavClick('home')} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center rotate-3">
              <span className="text-white font-bebas text-2xl tracking-tighter">KU</span>
            </div>
            <span className="font-bebas text-3xl text-white tracking-wider hidden sm:block">KOMIKUO</span>
          </button>

          <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <button onClick={() => handleNavClick('home')} className={`uppercase tracking-widest text-[11px] font-bold ${currentView === 'home' ? 'text-orange-500' : 'text-slate-300 hover:text-orange-500'}`}>Home</button>
            <button onClick={() => handleNavClick('favorite')} className={`flex items-center gap-1.5 uppercase tracking-widest text-[11px] font-bold ${currentView === 'favorite' ? 'text-orange-500' : 'text-slate-300 hover:text-orange-500'}`}>
              <Heart className={`w-3.5 h-3.5 ${currentView === 'favorite' ? 'fill-orange-500' : ''}`} /> Favorites
            </button>
            
            <div className="relative" ref={typeRef}>
              <button onClick={() => setTypeMenuOpen(!typeMenuOpen)} className={`flex items-center gap-1 uppercase tracking-widest text-[11px] font-bold ${currentView === 'type' ? 'text-orange-500' : 'text-slate-300 hover:text-orange-500'}`}>
                Types <ChevronDown className={`w-3 h-3 transition-transform ${typeMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {typeMenuOpen && (
                <div className="absolute top-full left-0 mt-3 w-48 bg-[#161b22] border border-white/10 rounded-xl py-2 animate-fade-in shadow-2xl">
                  {types.map(t => (
                    <button key={t} onClick={() => { onSelectType(t); setTypeMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-orange-500 uppercase tracking-widest transition-colors">{t}</button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={genreRef}>
              <button onClick={() => setGenreMenuOpen(!genreMenuOpen)} className={`flex items-center gap-1 uppercase tracking-widest text-[11px] font-bold ${currentView === 'genre' ? 'text-orange-500' : 'text-slate-300 hover:text-orange-500'}`}>
                Genres <ChevronDown className={`w-3 h-3 transition-transform ${genreMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {genreMenuOpen && (
                <div className="absolute top-full left-0 mt-3 w-[450px] bg-[#161b22] border border-white/10 rounded-2xl p-5 animate-fade-in grid grid-cols-3 gap-1 shadow-2xl">
                  {genres.map(g => (
                    <button key={g} onClick={() => { onSelectGenre(g); setGenreMenuOpen(false); }} className="text-left px-3 py-2 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-lg uppercase tracking-wider transition-colors">{g}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
            <input type="text" placeholder="Cari komik..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="bg-slate-800/50 border border-slate-700/50 rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-white transition-all" />
            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
          </form>

          <div className="relative" ref={notifRef}>
            <button onClick={() => setNotifMenuOpen(!notifMenuOpen)} className="p-2 text-slate-400 hover:text-white transition-colors relative">
              <Bell className="w-6 h-6" />
              {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>}
              {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full"></span>}
            </button>
            {notifMenuOpen && (
              <div className="absolute top-full right-0 mt-3 w-72 bg-[#161b22] border border-white/10 rounded-2xl shadow-2xl animate-fade-in overflow-hidden">
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Notifikasi</span>
                  {notifications.length > 0 && (
                    <button onClick={onClearNotifications} className="text-[9px] text-red-400 hover:text-red-300 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Trash2 className="w-2.5 h-2.5" /> Bersihkan
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? notifications.map(n => (
                    <div key={n.id} className="p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                      <p className="text-xs text-slate-200 font-medium leading-relaxed">{n.message}</p>
                      <span className="text-[9px] text-slate-500 mt-1 block font-bold">{n.time}</span>
                    </div>
                  )) : (
                    <div className="p-10 text-center">
                      <Bell className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-20" />
                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Tidak ada kabar baru</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={onToggleLogin}
            className="flex items-center gap-2 p-1.5 pr-4 rounded-full bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700 transition-colors group"
          >
            <div className={`w-8 h-8 rounded-full ${isLoggedIn ? 'bg-orange-500' : 'bg-slate-600'} flex items-center justify-center transition-colors`}>
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-200">
              {isLoggedIn ? 'Reader' : 'Login'}
            </span>
          </button>

          <button className="lg:hidden p-2 text-slate-400 hover:text-white" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Improved Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[70px] bg-[#0b0e14] z-[90] overflow-y-auto animate-fade-in border-t border-white/5 h-[calc(100vh-70px)]">
          <div className="p-6 flex flex-col gap-6 pb-24">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input type="text" placeholder="Cari komik..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            </form>

            <div className="flex flex-col gap-2">
              <button onClick={() => handleNavClick('home')} className="flex items-center gap-4 text-2xl font-bebas tracking-[0.2em] p-4 rounded-2xl hover:bg-white/5 text-slate-300 text-left border border-transparent hover:border-white/5">
                <LayoutGrid className="w-6 h-6 text-orange-500" /> HOME
              </button>
              
              <button onClick={() => handleNavClick('favorite')} className="flex items-center gap-4 text-2xl font-bebas tracking-[0.2em] p-4 rounded-2xl hover:bg-white/5 text-slate-300 text-left border border-transparent hover:border-white/5">
                <Heart className="w-6 h-6 text-red-500" /> FAVORITES
              </button>

              <div className="flex flex-col">
                <button 
                  onClick={() => setMobileTypesOpen(!mobileTypesOpen)} 
                  className="flex items-center justify-between gap-4 text-2xl font-bebas tracking-[0.2em] p-4 rounded-2xl hover:bg-white/5 text-slate-300 border border-transparent hover:border-white/5"
                >
                  <div className="flex items-center gap-4"><Book className="w-6 h-6 text-blue-500" /> TYPES</div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${mobileTypesOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileTypesOpen && (
                  <div className="grid grid-cols-1 gap-2 p-2 mt-2 bg-white/5 rounded-2xl animate-fade-in">
                    {types.map(t => (
                      <button 
                        key={t} 
                        onClick={() => handleCategorySelect('type', t)}
                        className="flex items-center justify-between w-full text-left px-5 py-4 text-xs font-black text-slate-400 hover:text-white uppercase tracking-[0.2em]"
                      >
                        {t} <ChevronRight className="w-4 h-4 text-slate-600" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <button 
                  onClick={() => setMobileGenresOpen(!mobileGenresOpen)} 
                  className="flex items-center justify-between gap-4 text-2xl font-bebas tracking-[0.2em] p-4 rounded-2xl hover:bg-white/5 text-slate-300 border border-transparent hover:border-white/5"
                >
                  <div className="flex items-center gap-4"><Layers className="w-6 h-6 text-purple-500" /> GENRES</div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${mobileGenresOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileGenresOpen && (
                  <div className="grid grid-cols-2 gap-2 p-4 mt-2 bg-white/5 rounded-2xl animate-fade-in">
                    {genres.map(g => (
                      <button 
                        key={g} 
                        onClick={() => handleCategorySelect('genre', g)}
                        className="text-left py-3 text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest"
                      >
                        • {g}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-auto pt-10 border-t border-white/5">
              <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] text-center">KomikUo Project v1.0</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
