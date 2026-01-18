import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MOCK_SONGS, ARTIST_META } from '../constants';
import { Play, Search, ChevronLeft, ChevronRight, Mic2, X, ChevronRight as ArrowRight } from 'lucide-react';
import { Song, Genre } from '../types';

type FilterType = 'ALL' | 'NEW' | Genre;

const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  
  // UI States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isArtistListOpen, setIsArtistListOpen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24; 

  const [currentArtistPage, setCurrentArtistPage] = useState(1);
  const artistItemsPerPage = 36;

  // Search Logic States
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // Search Filters - Multi Select
  const [searchYears, setSearchYears] = useState<string[]>([]); // Empty means ALL
  const [searchCategories, setSearchCategories] = useState<FilterType[]>([]); // Empty means ALL

  // Filters Definition
  const filters: { id: FilterType; label: string }[] = [
    { id: 'ALL', label: '전체' },
    { id: 'NEW', label: 'NEW' },
    { id: 'K-POP', label: 'K-POP' },
    { id: 'J-POP', label: 'J-POP' },
    { id: 'ANIMATION', label: 'ANIMATION' },
    { id: 'MOVIE', label: 'MOVIE' },
    { id: 'DRAMA', label: 'DRAMA' },
    { id: 'GAME', label: 'GAME' },
    { id: 'OST', label: 'OST' },
  ];

  // Handle URL Params for Artist Linking & Reset on Home Click & Category Filters
  useEffect(() => {
    const artistParam = searchParams.get('artist');
    const filterParam = searchParams.get('filter');

    if (artistParam) {
        setSelectedArtist(artistParam);
        setIsArtistListOpen(false);
        setFilter('ALL');
    } else if (filterParam) {
        // Check if filterParam is valid
        const validFilter = filters.find(f => f.id === filterParam);
        if (validFilter) {
            setFilter(validFilter.id as FilterType);
            setSelectedArtist(null);
            setIsArtistListOpen(false);
        } else {
             setFilter('ALL');
        }
    } else {
        // Reset if no params (e.g. clicking Logo to go to /)
        setSelectedArtist(null);
        setFilter('ALL');
        setIsArtistListOpen(false);
    }
  }, [searchParams]);

  const years = ['2025', '2024', '2023', '2022', '2016'];

  // Scroll Handler for Mobile Control Hiding
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Threshold to avoid small jitters
      if (Math.abs(currentScrollY - lastScrollY) < 10) return;

      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        // Scrolling Down -> Hide
        setShowControls(false);
      } else {
        // Scrolling Up -> Show
        setShowControls(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Extract artists
  const uniqueArtists = Array.from(new Set(MOCK_SONGS.map(s => s.artist))).sort();

  // Artist Pagination Logic
  const totalArtistPages = Math.ceil(uniqueArtists.length / artistItemsPerPage);
  const currentArtists = uniqueArtists.slice(
    (currentArtistPage - 1) * artistItemsPerPage,
    currentArtistPage * artistItemsPerPage
  );

  // Main Grid Filtering Logic
  const filteredSongs = MOCK_SONGS.filter(song => {
    // Artist Priority
    if (selectedArtist) {
        return song.artist === selectedArtist;
    }

    // Category Filter
    if (filter === 'NEW') {
      const currentYear = new Date().getFullYear();
      return parseInt(song.releaseYear) >= currentYear;
    } else if (filter !== 'ALL') {
      return song.genre === filter;
    }

    return true;
  });

  // Search Modal Filtering Logic
  const searchResults = MOCK_SONGS.filter(song => {
      const matchesKeyword = song.title.toLowerCase().includes(searchKeyword.toLowerCase()) || 
                             song.artist.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                             song.album.toLowerCase().includes(searchKeyword.toLowerCase());
      
      const matchesYear = searchYears.length === 0 || searchYears.includes(song.releaseYear);
      const matchesCategory = searchCategories.length === 0 || searchCategories.includes(song.genre);

      return matchesKeyword && matchesYear && matchesCategory;
  });

  // Pagination for Grid
  const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, selectedArtist]);

  const currentSongs = filteredSongs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleArtistSelect = (artist: string) => {
      setSelectedArtist(artist);
      setIsArtistListOpen(false); // Close artist list
      setFilter('ALL'); // Reset genre filter
      setSearchParams({ artist });
  };

  const handleArtistClickInCard = (e: React.MouseEvent, artist: string) => {
      e.preventDefault(); // Prevent navigating to song detail
      setSelectedArtist(artist);
      setIsArtistListOpen(false);
      setSearchParams({ artist });
  };

  const handleBackToLibrary = () => {
      setSelectedArtist(null);
      setFilter('ALL');
      setSearchParams({});
  };

  const toggleSearchYear = (y: string) => {
      setSearchYears(prev => 
          prev.includes(y) ? prev.filter(item => item !== y) : [...prev, y]
      );
  };

  const toggleSearchCategory = (c: FilterType) => {
      setSearchCategories(prev => 
          prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]
      );
  };

  // Generic Page Number Generator
  const getPageNumbers = (current: number, total: number) => {
    const maxPagesToShow = 10;
    const startPage = Math.floor((current - 1) / maxPagesToShow) * maxPagesToShow + 1;
    const endPage = Math.min(startPage + maxPagesToShow - 1, total);
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Check if Artist Icon should be active (List Open OR Artist Selected)
  const isArtistActive = isArtistListOpen || selectedArtist !== null;

  return (
    <div className="min-h-screen pb-20 md:pb-0 relative">
      
      <div className="max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Top Controls Area - Sticky with updated style & Mobile Hide Logic */}
        {/* Updated: sticky top-0 for mobile, md:top-16 for PC because GNB is fixed on PC */}
        <div 
            className={`flex flex-col gap-6 mb-8 sticky top-0 md:top-16 z-30 bg-white/80 dark:bg-black/80 py-4 backdrop-blur-md transition-all duration-300 ease-in-out ${
                showControls ? 'translate-y-0 opacity-100' : '-translate-y-[120%] opacity-0 pointer-events-none'
            } md:translate-y-0 md:opacity-100 md:pointer-events-auto`}
        >
            
            <div className="flex items-center justify-between gap-4">
                
                {/* 1. Artist Icon & Search Trigger */}
                <div className="flex items-center gap-3 w-full">
                    {/* Artist Toggle Button */}
                    <button 
                        onClick={() => {
                            setIsArtistListOpen(!isArtistListOpen);
                            if (selectedArtist && !isArtistListOpen) {
                                setSelectedArtist(null);
                                setSearchParams({});
                            }
                        }}
                        className={`p-3 rounded-full transition-colors flex-shrink-0 border ${
                            isArtistActive
                            ? 'bg-brand-blue text-white border-transparent' 
                            : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
                        }`}
                        aria-label="Artists"
                    >
                        <Mic2 size={20} />
                    </button>

                    {/* Fake Search Input to trigger Modal */}
                    {/* Added min-w-0 to prevent horizontal scroll on mobile due to flex item growing too wide */}
                    <button 
                        onClick={() => setIsSearchOpen(true)}
                        className={`flex-grow flex items-center px-4 py-2.5 rounded-full bg-white dark:bg-transparent text-gray-400 border hover:border-brand-blue/30 transition-all group min-w-0 ${
                            selectedArtist 
                            ? 'border-brand-blue/50 ring-1 ring-brand-blue/20' 
                            : 'border-gray-200 dark:border-zinc-700'
                        }`}
                    >
                        <Search className="h-5 w-5 mr-3 group-hover:text-brand-blue transition-colors flex-shrink-0" />
                        <span className="text-lg truncate font-medium">
                            {selectedArtist ? `${selectedArtist}` : '검색어를 입력하거나 조건을 선택하세요...'}
                        </span>
                    </button>
                </div>
            </div>

            {/* 2. Categories OR Back Button */}
            {!isArtistListOpen && (
                <div className="relative">
                     {selectedArtist ? (
                        /* Back to Library Button (Replaces Filters when artist is selected) */
                        <div className="flex items-center">
                            <button 
                                onClick={handleBackToLibrary}
                                className="inline-flex items-center text-gray-500 hover:text-brand-blue transition-colors px-1"
                            >
                                <ChevronLeft size={20} />
                                <span className="ml-1 font-medium">라이브러리로 돌아가기</span>
                            </button>
                        </div>
                     ) : (
                        /* Genre Tabs */
                        <>
                            {/* Gradient Fade Masks for Overflow */}
                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none z-10" />
                            
                            {/* Filters Container - Left Aligned */}
                            <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 snap-x scroll-smooth touch-pan-x">
                                {filters.map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => {
                                        setFilter(f.id);
                                        setSelectedArtist(null);
                                    }}
                                    className={`px-5 py-2.5 rounded-full text-base font-semibold whitespace-nowrap transition-all snap-start border ${
                                    filter === f.id && !selectedArtist
                                        ? 'bg-brand-blue text-white border-transparent'
                                        : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700'
                                    }`}
                                >
                                    {f.label}
                                </button>
                                ))}
                            </div>
                        </>
                     )}
                </div>
            )}
        </div>

        {/* Content Area */}
        {isArtistListOpen ? (
            /* Artist List View */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="text-2xl font-bold mb-6 px-2">아티스트</h2>
                
                {/* Artist Grid: 1 Col Mobile, 2 Cols PC */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    {currentArtists.map((artistName) => {
                        const meta = ARTIST_META[artistName] || { 
                            name: artistName, 
                            subName: 'Artist', 
                            imageUrl: `https://picsum.photos/seed/${artistName}/200` 
                        };
                        return (
                            <button 
                                key={artistName}
                                onClick={() => handleArtistSelect(artistName)}
                                className="flex items-center py-4 pr-4 pl-0 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors group w-full text-left rounded-xl"
                            >
                                {/* Image Left - with Zoom Effect */}
                                <div className="w-28 h-28 rounded-xl overflow-hidden mr-5 flex-shrink-0">
                                    <img 
                                        src={meta.imageUrl} 
                                        alt={artistName} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                
                                {/* Text Center */}
                                <div className="flex-grow">
                                    <div className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">
                                        {meta.name}
                                    </div>
                                    <div className="text-base text-gray-500 dark:text-gray-400 mt-1">
                                        {meta.subName}
                                    </div>
                                </div>
                                {/* Arrow Right */}
                                <ArrowRight className="text-gray-300 group-hover:text-brand-blue transition-colors w-6 h-6" />
                            </button>
                        );
                    })}
                </div>

                {/* Artist Pagination */}
                {uniqueArtists.length > artistItemsPerPage && (
                    <div className="flex justify-center items-center gap-2 py-12">
                        <button
                        onClick={() => setCurrentArtistPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentArtistPage === 1}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
                        >
                        <ChevronLeft size={20} />
                        </button>
                        
                        <div className="flex items-center gap-1">
                        {getPageNumbers(currentArtistPage, totalArtistPages).map(pageNum => (
                            <button
                            key={pageNum}
                            onClick={() => setCurrentArtistPage(pageNum)}
                            className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                                currentArtistPage === pageNum
                                ? 'bg-brand-blue text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                            }`}
                            >
                            {pageNum}
                            </button>
                        ))}
                        </div>

                        <button
                        onClick={() => setCurrentArtistPage(prev => Math.min(prev + 1, totalArtistPages))}
                        disabled={currentArtistPage === totalArtistPages}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
                        >
                        <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        ) : (
            /* Song Grid View */
            <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 animate-in fade-in duration-500">
                {currentSongs.map((song) => (
                    <SongCard 
                        key={song.id} 
                        song={song} 
                        onArtistClick={handleArtistClickInCard}
                    />
                ))}
                {filteredSongs.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-500 dark:text-gray-400">
                    조건에 맞는 곡이 없습니다.
                    </div>
                )}
                </div>

                {/* Song Pagination */}
                {filteredSongs.length > 0 && (
                <div className="flex justify-center items-center gap-2 py-12">
                    <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
                    >
                    <ChevronLeft size={20} />
                    </button>
                    
                    <div className="flex items-center gap-1">
                    {getPageNumbers(currentPage, totalPages).map(pageNum => (
                        <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                            currentPage === pageNum
                            ? 'bg-brand-blue text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                        }`}
                        >
                        {pageNum}
                        </button>
                    ))}
                    </div>

                    <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
                    >
                    <ChevronRight size={20} />
                    </button>
                </div>
                )}
            </>
        )}
      </div>

      {/* Search Modal (Bottom Sheet style) */}
      {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsSearchOpen(false)}
              />
              
              {/* Modal Content */}
              <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl shadow-2xl h-[85vh] sm:h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
                  
                  {/* Header */}
                  <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-3">
                      <Search className="text-brand-blue ml-2" />
                      <input 
                        type="text" 
                        autoFocus
                        placeholder="곡 제목, 아티스트 검색..." 
                        className="flex-grow bg-transparent border-none outline-none text-lg text-gray-900 dark:text-white placeholder-gray-400"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                      />
                      <button 
                        onClick={() => setIsSearchOpen(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
                      >
                          <X className="text-gray-500" />
                      </button>
                  </div>

                  {/* Filters Area */}
                  <div className="p-6 space-y-6 bg-gray-50 dark:bg-black/20">
                      {/* Year Chips */}
                      <div>
                          <p className="text-xs font-bold text-gray-500 mb-3 uppercase">연도</p>
                          <div className="flex flex-wrap gap-2">
                              {years.map(y => (
                                  <button
                                    key={y}
                                    onClick={() => toggleSearchYear(y)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                                        searchYears.includes(y)
                                        ? 'bg-brand-blue border-brand-blue text-white' 
                                        : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400'
                                    }`}
                                  >
                                      {y}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Category Chips - Filter out ALL and NEW */}
                      <div>
                          <p className="text-xs font-bold text-gray-500 mb-3 uppercase">카테고리</p>
                          <div className="flex flex-wrap gap-2">
                                {filters.filter(f => f.id !== 'ALL' && f.id !== 'NEW').map(f => (
                                    <button
                                        key={f.id}
                                        onClick={() => toggleSearchCategory(f.id)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                                            (f.id === 'ALL' && searchCategories.length === 0) || (f.id !== 'ALL' && searchCategories.includes(f.id))
                                            ? 'bg-brand-blue border-brand-blue text-white' 
                                            : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400'
                                        }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                          </div>
                      </div>
                  </div>

                  {/* Results List - Custom Scrollbar */}
                  <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
                      <p className="text-xs font-bold text-gray-500 mb-3">검색 결과 ({searchResults.length})</p>
                      <div className="space-y-2">
                          {searchResults.map(song => (
                              <Link 
                                to={`/song/${song.id}`} 
                                key={song.id}
                                onClick={() => setIsSearchOpen(false)}
                                className="flex items-center p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors group"
                              >
                                  <img src={song.coverUrl} className="w-12 h-12 rounded-lg object-cover mr-3" alt="" />
                                  <div className="flex-grow min-w-0">
                                      <div className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-brand-blue">{song.title}</div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{song.artist} • {song.releaseYear}</div>
                                  </div>
                              </Link>
                          ))}
                          {searchResults.length === 0 && (
                              <div className="text-center py-10 text-gray-400">
                                  검색 결과가 없습니다.
                              </div>
                          )}
                      </div>
                  </div>

              </div>
          </div>
      )}

      {/* Styles for custom scrollbar in modal */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </div>
  );
};

const SongCard: React.FC<{ 
    song: Song; 
    onArtistClick: (e: React.MouseEvent, artist: string) => void;
}> = ({ song, onArtistClick }) => {
  // Find artist meta for korean name
  const artistMeta = ARTIST_META[song.artist];

  return (
    <div className="flex flex-col h-full bg-transparent group">
      {/* Cover Link - Removed Hover Dim/Play Icon */}
      <Link to={`/song/${song.id}`} className="relative block mb-4">
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-zinc-800">
            <img 
            src={song.coverUrl} 
            alt={song.title} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
        </div>
      </Link>
      
      {/* Content: 4 Lines */}
      <div className="flex flex-col">
        {/* 1. Original Title (Black) */}
        {/* Updated: Added group-hover:text-brand-blue */}
        <Link to={`/song/${song.id}`} className="font-bold text-gray-900 dark:text-white text-xl leading-tight mb-1 group-hover:text-brand-blue transition-colors break-words break-keep" title={song.title}>
          {song.title}
        </Link>

        {/* 2. Translated Title (Gray) */}
        {song.translatedTitle && (
             <Link to={`/song/${song.id}`} className="text-base text-gray-500 mb-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors break-words break-keep">
                {song.translatedTitle}
            </Link>
        )}
        
        {/* 3. Original Artist (Black/Clickable) + Translated Artist (Gray) Row */}
        <div className="flex items-center gap-2 mt-1 min-w-0">
             <button 
                onClick={(e) => onArtistClick(e, song.artist)}
                className="text-base font-semibold text-gray-900 dark:text-white truncate text-left hover:text-brand-blue transition-colors flex-shrink-0 max-w-[70%]"
            >
                {song.artist}
            </button>
            
            {artistMeta && (
                <span className="text-sm text-gray-500 truncate flex-shrink min-w-0">
                    {artistMeta.subName}
                </span>
            )}
        </div>
      </div>
    </div>
  );
}

export default Home;