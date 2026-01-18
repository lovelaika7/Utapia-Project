import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ChevronLeft, Sparkles, X, Loader2 } from 'lucide-react';
import { LyricLine, Genre } from '../types';

const SongDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { songs, artistMeta, loading } = useData();
  
  const song = songs.find(s => s.id === id);
  // Prefer ArtistMeta from separate sheet, fallback to Song's own translated artist name
  const currentArtistMeta = song ? artistMeta[song.artist] : null;

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-brand-blue">
            <Loader2 className="animate-spin w-12 h-12 mb-4" />
        </div>
    );
  }

  if (!song) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <h2 className="text-2xl font-bold mb-4">곡을 찾을 수 없습니다</h2>
        <Link to="/" className="text-brand-blue hover:underline">홈으로 돌아가기</Link>
      </div>
    );
  }

  // Use tags if available, otherwise fallback to genre
  // This supports splitting "J-POP, ANIMATION" into multiple chips
  const displayChips = (song.tags && song.tags.length > 0) ? song.tags : [song.genre];
  const uniqueChips = Array.from(new Set(displayChips));

  const displayLyrics: LyricLine[] = song.lyrics;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white pb-24 md:pb-0 font-sans">
      
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
        
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
          
          {/* Left Column (Sticky on PC) */}
          <div className="contents lg:block lg:sticky lg:top-24 lg:col-span-4 lg:order-1">
             
             {/* Back Button */}
             <div className="hidden lg:block mb-6">
                <Link to="/" className="inline-flex items-center text-gray-500 hover:text-brand-blue transition-colors">
                    <ChevronLeft size={20} />
                    <span className="ml-1 font-medium">라이브러리로 돌아가기</span>
                </Link>
             </div>

             {/* Meta Info Section */}
             <div className="order-2 lg:order-none w-full mb-8 lg:mb-6">
                <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl p-5 border border-gray-100 dark:border-zinc-800 w-full">
                    
                    <div className="flex flex-row items-start gap-5 lg:flex-col lg:items-start">
                        {/* Cover Image */}
                        <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-full lg:h-auto lg:aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0 lg:mb-6 shadow-lg">
                            <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                        </div>
                        
                        {/* Text Info */}
                        <div className="flex-1 min-w-0 w-full pt-1 lg:pt-0">
                            {/* Title (Original) */}
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1 leading-tight break-words text-gray-900 dark:text-white lg:overflow-visible">
                                {song.title}
                            </h1>

                            {/* Title (Translated) */}
                            {song.translatedTitle && (
                                <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium mb-3 lg:whitespace-normal">
                                    {song.translatedTitle}
                                </p>
                            )}

                            {/* Artist (Original) */}
                            <Link to={`/?artist=${encodeURIComponent(song.artist)}`} className="block w-fit text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-0.5 hover:text-brand-blue transition-colors truncate">
                                {song.artist}
                            </Link>

                            {/* Artist (Translated) */}
                            {(currentArtistMeta?.subName || song.artistSubName) && (
                                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-4 truncate">
                                    {currentArtistMeta?.subName || song.artistSubName}
                                </p>
                            )}
                            
                            {/* Album & Year - Increased Spacing */}
                            <div className="flex items-center gap-3 text-sm md:text-base text-gray-500 dark:text-gray-400 mb-5">
                                <span className="truncate max-w-[150px]">{song.album}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></span>
                                <span className="flex-shrink-0">{song.releaseYear}</span>
                            </div>

                            {/* Category Chips - Separated */}
                            <div className="flex flex-wrap gap-2">
                                {uniqueChips.map((cat, idx) => (
                                    <Link 
                                        to={`/?filter=${cat}`}
                                        key={`${cat}-${idx}`} 
                                        className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-brand-blue hover:text-white dark:hover:bg-brand-blue transition-all text-xs font-bold tracking-wide uppercase border border-gray-200 dark:border-zinc-700 hover:border-transparent"
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
             </div>

             {/* AI Interpretation Section */}
             {song.aiInterpretation && (
                 <div className="order-4 lg:order-none w-full pb-40 lg:pb-0 mt-12 lg:mt-6">
                    <div className="bg-gradient-to-br from-brand-blue/5 to-purple-500/5 dark:from-brand-blue/10 dark:to-purple-500/10 backdrop-blur-md rounded-2xl p-6 border border-brand-blue/20 dark:border-brand-blue/30 shadow-sm w-full">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-brand-blue" />
                            <h3 className="font-bold text-gray-900 dark:text-white">AI 해석</h3>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                            {song.aiInterpretation}
                        </p>
                    </div>
                 </div>
             )}

          </div>

          {/* Right Column */}
          <div className="contents lg:block lg:col-span-8 lg:order-2"> 
            
            {/* Video Player */}
            <div className="order-1 lg:order-none w-full aspect-video rounded-2xl mb-8 relative z-20 bg-black shadow-none ring-1 ring-gray-100 dark:ring-zinc-800">
                 <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden">
                     {song.youtubeId ? (
                        <iframe 
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${song.youtubeId}?origin=${window.location.origin}&enablejsapi=1`} 
                            title="YouTube video player" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                     ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-500">
                             영상 정보를 불러올 수 없습니다.
                         </div>
                     )}
                 </div>
            </div>

            {/* Lyrics Section */}
            <div className="order-3 lg:order-none py-4 md:px-0 min-h-[50vh] w-full">
               <div className="space-y-12">
                   {displayLyrics.length > 0 ? (
                       displayLyrics.map((line, index) => (
                        <div key={index} className="group transition-all duration-300 hover:pl-2">
                            
                            {/* 1. Original Lyric (White/Dark) - Bold, Large */}
                            <p className="text-2xl md:text-3xl font-extrabold leading-relaxed text-gray-900 dark:text-gray-100 mb-2 break-keep">
                                {line.original}
                            </p>
                            
                            {/* 2. Romanization/Pronunciation (Gray) - Medium size, muted */}
                            {line.romanization && (
                                <p className="text-lg text-gray-500 dark:text-gray-400 mb-2 font-medium break-keep">
                                    {line.romanization}
                                </p>
                            )}
                            
                            {/* 3. Translation (Brand Blue) - Highlight color */}
                            {line.translation && (
                                <p className="text-xl md:text-2xl text-brand-blue font-bold break-keep leading-relaxed mt-1">
                                    {line.translation}
                                </p>
                            )}
                        </div>
                    ))
                   ) : (
                       <div className="text-center text-gray-500 py-10">
                           가사 정보가 아직 등록되지 않았습니다.
                       </div>
                   )}
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SongDetail;