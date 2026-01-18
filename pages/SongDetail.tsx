import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_SONGS, ARTIST_META } from '../constants';
import { ChevronLeft, Sparkles, X } from 'lucide-react';
import { LyricLine, Genre } from '../types';

const SongDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const song = MOCK_SONGS.find(s => s.id === id);
  const artistMeta = song ? ARTIST_META[song.artist] : null;

  if (!song) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <h2 className="text-2xl font-bold mb-4">곡을 찾을 수 없습니다</h2>
        <Link to="/" className="text-brand-blue hover:underline">홈으로 돌아가기</Link>
      </div>
    );
  }

  // Define Main Categories (Matches Home.tsx filters)
  const validCategories: Genre[] = ['K-POP', 'J-POP', 'ANIMATION', 'MOVIE', 'DRAMA', 'GAME', 'OST'];
  
  // Filter chips to only include valid main categories
  const displayChips = [song.genre, ...song.tags].filter((tag) => 
    validCategories.includes(tag as Genre)
  );
  // Remove duplicates
  const uniqueChips = Array.from(new Set(displayChips));

  // Logic to fill lyrics to at least 15 lines for demo purposes
  const MIN_LINES = 15;
  let displayLyrics: LyricLine[] = [...song.lyrics];
  while (displayLyrics.length < MIN_LINES) {
      displayLyrics = [...displayLyrics, ...song.lyrics];
  }
  if (displayLyrics.length > 20) {
      displayLyrics = displayLyrics.slice(0, 20); 
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white pb-24 md:pb-0">
      
      {/* Background Blur Effect */}
      <div 
        className="fixed inset-0 z-0 opacity-20 dark:opacity-30 pointer-events-none blur-3xl scale-110"
        style={{ 
            backgroundImage: `url(${song.coverUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
        }}
      />

      <div className="max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-6">
        
        {/* 
            Layout Strategy:
            Mobile Order: Video -> Meta -> Lyrics -> AI
            Desktop Order: Left Col (Meta, AI) | Right Col (Video, Lyrics)
        */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
          
          {/* Left Column (Wrapper) - Sticky on PC */}
          <div className="contents lg:block lg:sticky lg:top-24 lg:col-span-4 lg:order-1">
             
             {/* Back Button (Moved inside sticky, hidden on mobile) */}
             <div className="hidden lg:block mb-6">
                <Link to="/" className="inline-flex items-center text-gray-500 hover:text-brand-blue transition-colors">
                    <ChevronLeft size={20} />
                    <span className="ml-1 font-medium">라이브러리로 돌아가기</span>
                </Link>
             </div>

             {/* Meta Info Section - Order 2 on Mobile */}
             <div className="order-2 lg:order-none w-full mb-8 lg:mb-6">
                
                {/* Song Meta Info - Restored BG, Removed Shadow, Updated Mobile Layout */}
                <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl p-5 border border-gray-100 dark:border-zinc-800 w-full">
                    
                    {/* Mobile: Row (Image Left, Text Right) | Desktop: Col (Image Top, Text Bottom) */}
                    <div className="flex flex-row items-start gap-5 lg:flex-col lg:items-start">
                        
                        {/* Cover Image 
                            - Increased size (w-32)
                            - Removed shadow
                            - Left alignment (via flex row order)
                        */}
                        <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-full lg:h-auto lg:aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0 lg:mb-6">
                            <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                        </div>
                        
                        {/* Text Info */}
                        <div className="flex-1 min-w-0 w-full pt-1 lg:pt-0">
                            {/* 1. Original Title */}
                            {/* Updated: break-keep -> break-words to fix mobile overflow */}
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1 leading-tight break-words text-gray-900 dark:text-white lg:overflow-visible">
                                {song.title}
                            </h1>

                            {/* 2. Translated Title */}
                            {song.translatedTitle && (
                                <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium mb-3 lg:whitespace-normal">
                                    {song.translatedTitle}
                                </p>
                            )}

                            {/* 3. Artist */}
                            <Link to={`/?artist=${encodeURIComponent(song.artist)}`} className="block w-fit text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-0.5 hover:text-brand-blue transition-colors truncate">
                                {song.artist}
                            </Link>

                            {/* 4. Translated Artist */}
                            {artistMeta && (
                                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-1 truncate">
                                    {artistMeta.subName}
                                </p>
                            )}
                            
                            {/* 5. Album & Year (Added) */}
                            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-4 md:mb-6 truncate">
                                {song.album} • {song.releaseYear}
                            </p>

                            {/* Category Chips - Link to Home with filter */}
                            <div className="flex flex-wrap gap-2">
                                {uniqueChips.map((cat, idx) => (
                                    <Link 
                                        to={`/?filter=${cat}`}
                                        key={`${cat}-${idx}`} 
                                        className="px-3 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white transition-colors text-xs font-bold tracking-wide uppercase"
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

             </div>

             {/* AI Interpretation Section - Order 4 on Mobile (Last) */}
             {/* Added mt-12 for mobile gap between lyrics and AI */}
             <div className="order-4 lg:order-none w-full pb-40 lg:pb-0 mt-12 lg:mt-6">
                {/* Restored Gradient BG */}
                <div className="bg-gradient-to-br from-brand-blue/5 to-purple-500/5 dark:from-brand-blue/10 dark:to-purple-500/10 backdrop-blur-md rounded-2xl p-6 border border-brand-blue/20 dark:border-brand-blue/30 shadow-sm w-full">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-brand-blue" />
                        <h3 className="font-bold text-gray-900 dark:text-white">AI 해석</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        이 곡은 아티스트의 독특한 감성과 현대적인 비트가 어우러진 곡으로, 
                        가사 전반에 걸쳐 사랑과 성장에 대한 은유가 담겨 있습니다. 
                        특히 후렴구의 반복적인 멜로디는 듣는 이로 하여금 깊은 여운을 남기며, 
                        뮤직비디오의 시각적 요소와 결합되어 곡의 주제를 더욱 강조합니다.
                    </p>
                </div>
             </div>

          </div>

          {/* Right Column (Wrapper) */}
          <div className="contents lg:block lg:col-span-8 lg:order-2"> 
            
            {/* Video Placeholder - Order 1 on Mobile */}
            {/* Removed sticky for both PC and Mobile. It will simply scroll. */}
            <div 
                className="order-1 lg:order-none w-full aspect-video rounded-2xl mb-8 relative z-20 bg-black shadow-none"
            >
                 <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden">
                     <iframe 
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${song.youtubeId}`} 
                        title="YouTube video player" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                 </div>
            </div>

            {/* Lyrics Section - Order 3 on Mobile */}
            <div className="order-3 lg:order-none py-2 md:px-0 min-h-[50vh] w-full">
               <div className="space-y-12">
                   {displayLyrics.map((line, index) => (
                       <div key={index} className="group transition-all duration-300 hover:pl-2">
                           
                           {/* 1. Original Lyric */}
                           <p className="text-2xl md:text-3xl font-semibold leading-relaxed text-gray-900 dark:text-gray-100 mb-2 font-sans break-keep">
                               {line.original}
                           </p>
                           
                           {/* 2. Pronunciation (Romanization field, now Hangul) - Changed to Gray/Neutral */}
                           {line.romanization && (
                               <p className="text-lg text-gray-500 dark:text-gray-400 mb-2 font-medium">
                                   {line.romanization}
                               </p>
                           )}
                           
                           {/* 3. Translation (Korean) - Changed to Brand Blue + Larger size */}
                           {line.translation && (
                               <p className="text-xl md:text-2xl text-brand-blue font-bold break-keep leading-relaxed">
                                   {line.translation}
                               </p>
                           )}
                       </div>
                   ))}
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SongDetail;