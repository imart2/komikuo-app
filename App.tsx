
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import ReadingPage from './pages/ReadingPage';
import ListingPage from './pages/ListingPage';
import SearchPage from './pages/SearchPage';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import DMCA from './pages/legal/DMCA';
import FavoritePage from './pages/FavoritePage';
import { Comic, Notification } from './types';

type View = 'home' | 'detail' | 'reader' | 'popular' | 'latest' | 'colored' | 'search' | 'type' | 'genre' | 'privacy' | 'terms' | 'dmca' | 'favorite';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [prevView, setPrevView] = useState<View>('home');
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  
  // State Global Baru
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Comic[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load favorites from local storage
  useEffect(() => {
    const savedFavs = localStorage.getItem('komikuo_favs');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
  }, []);

  const toggleFavorite = (comic: Comic) => {
    let newFavs: Comic[] = [];
    const exists = favorites.find(f => f.slug === comic.slug);
    
    if (exists) {
      newFavs = favorites.filter(f => f.slug !== comic.slug);
      addNotification(`Dihapus dari favorit: ${comic.title.substring(0, 20)}...`);
    } else {
      newFavs = [...favorites, comic];
      addNotification(`Ditambahkan ke favorit: ${comic.title.substring(0, 20)}...`);
    }
    
    setFavorites(newFavs);
    localStorage.setItem('komikuo_favs', JSON.stringify(newFavs));
  };

  const addNotification = (message: string) => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'favorite'
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 10)); // Simpan 10 terakhir
  };

  const clearNotifications = () => setNotifications([]);

  const navigateToHome = () => {
    setCurrentView('home');
    setPrevView('home');
    window.scrollTo(0, 0);
  };

  const navigateToDetail = (slug: string) => {
    if (currentView !== 'detail' && currentView !== 'reader' && currentView !== 'search') {
      setPrevView(currentView);
    }
    setSelectedSlug(slug);
    setCurrentView('detail');
    window.scrollTo(0, 0);
  };

  const navigateToReader = (chapterSlug: string) => {
    setSelectedChapter(chapterSlug);
    setCurrentView('reader');
    window.scrollTo(0, 0);
  };

  const handleNavNavigate = (view: any) => {
    setCurrentView(view);
    setPrevView(view);
    window.scrollTo(0, 0);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView('search');
    window.scrollTo(0, 0);
  };

  const handleSelectType = (type: string) => {
    setSelectedType(type);
    setCurrentView('type');
    setPrevView('type');
    window.scrollTo(0, 0);
  };

  const handleSelectGenre = (genre: string) => {
    setSelectedGenre(genre);
    setCurrentView('genre');
    setPrevView('genre');
    window.scrollTo(0, 0);
  };

  const handleBackFromDetail = () => {
    setCurrentView(prevView);
    window.scrollTo(0, 0);
  };

  const navigateToLegal = (view: 'privacy' | 'terms' | 'dmca') => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onSelectComic={navigateToDetail} onSelectType={handleSelectType} />;
      case 'detail':
        return (
          <DetailPage 
            slug={selectedSlug} 
            onBack={handleBackFromDetail} 
            onReadChapter={navigateToReader}
            onSelectComic={navigateToDetail}
            onToggleFavorite={toggleFavorite}
            isFavorite={favorites.some(f => f.slug === selectedSlug)}
          />
        );
      case 'reader':
        return (
          <ReadingPage 
            slug={selectedChapter} 
            onBack={() => navigateToDetail(selectedSlug)}
            onNavigate={navigateToReader}
          />
        );
      case 'popular':
      case 'latest':
      case 'colored':
        return <ListingPage type={currentView as any} onSelectComic={navigateToDetail} />;
      case 'type':
        return <ListingPage type="type" categoryName={selectedType} onSelectComic={navigateToDetail} />;
      case 'genre':
        return <ListingPage type="genre" categoryName={selectedGenre} onSelectComic={navigateToDetail} />;
      case 'search':
        return <SearchPage query={searchQuery} onSelectComic={navigateToDetail} />;
      case 'privacy':
        return <PrivacyPolicy onBack={navigateToHome} />;
      case 'terms':
        return <TermsOfService onBack={navigateToHome} />;
      case 'dmca':
        return <DMCA onBack={navigateToHome} />;
      case 'favorite':
        return <FavoritePage favorites={favorites} onSelectComic={navigateToDetail} />;
      default:
        return <HomePage onSelectComic={navigateToDetail} onSelectType={handleSelectType} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14]">
      {currentView !== 'reader' && (
        <Navbar 
          onNavigate={handleNavNavigate} 
          onSearch={handleSearch}
          onSelectType={handleSelectType}
          onSelectGenre={handleSelectGenre}
          currentView={currentView}
          isLoggedIn={isLoggedIn}
          notifications={notifications}
          onClearNotifications={clearNotifications}
          onToggleLogin={() => setIsLoggedIn(!isLoggedIn)}
        />
      )}
      
      {renderContent()}

      {currentView !== 'reader' && (
        <footer className="bg-[#0b0e14] border-t border-slate-800 py-16 mt-20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="flex flex-col items-center md:items-start gap-4">
                <div className="flex items-center gap-2">
                  <button onClick={navigateToHome} className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center rotate-3 shadow-lg shadow-orange-500/20">
                      <span className="text-white font-bebas text-2xl">KU</span>
                    </div>
                    <span className="font-bebas text-3xl text-white tracking-widest uppercase">KOMIKUO</span>
                  </button>
                </div>
                <p className="text-slate-500 text-sm max-w-xs text-center md:text-left">
                  Platform baca komik digital terbaik dengan koleksi terlengkap dan pengalaman membaca tanpa gangguan.
                </p>
              </div>
              
              <div className="flex gap-12 text-sm">
                <div className="flex flex-col gap-4">
                  <span className="text-white font-bold uppercase tracking-widest text-xs">Navigasi</span>
                  <button onClick={() => navigateToHome()} className="text-slate-500 hover:text-orange-500 transition-colors text-left">Beranda</button>
                  <button onClick={() => handleNavNavigate('favorite')} className="text-slate-500 hover:text-orange-500 transition-colors text-left">Favorit Saya</button>
                  <button onClick={() => handleNavNavigate('popular')} className="text-slate-500 hover:text-orange-500 transition-colors text-left">Populer</button>
                </div>
                <div className="flex flex-col gap-4">
                  <span className="text-white font-bold uppercase tracking-widest text-xs">Legal</span>
                  <button onClick={() => navigateToLegal('privacy')} className="text-slate-500 hover:text-white transition-colors text-left">Privacy Policy</button>
                  <button onClick={() => navigateToLegal('terms')} className="text-slate-500 hover:text-white transition-colors text-left">Terms of Service</button>
                  <button onClick={() => navigateToLegal('dmca')} className="text-slate-500 hover:text-white transition-colors text-left">DMCA</button>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-2">
                <p className="text-sm text-slate-600">
                  © 2024 KomikUo Project. Made with ❤️ for Readers.
                </p>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer">
                    <span className="text-[10px] font-black uppercase tracking-tighter">FB</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer">
                    <span className="text-[10px] font-black uppercase tracking-tighter">TW</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer">
                    <span className="text-[10px] font-black uppercase tracking-tighter">IG</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
