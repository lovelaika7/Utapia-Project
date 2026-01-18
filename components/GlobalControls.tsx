import React, { useState } from 'react';
import { X, Send, Sun, Moon, MessageCirclePlus } from 'lucide-react';
import { useUI } from './UIContext';
import { useTheme } from './ThemeContext';

export const RequestSongModal: React.FC = () => {
  const { isRequestModalOpen, setIsRequestModalOpen } = useUI();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isRequestModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Custom Validation
    if (!title.trim()) {
        setError("곡 제목은 필수 입력 사항입니다.");
        return;
    }

    // Simulate sending to admin
    console.log(`[ADMIN SENT]\nSong: ${title}\nArtist: ${artist || 'Unknown'}`);
    alert(`요청이 전송되었습니다.\n곡명: ${title}\n아티스트: ${artist || '-'}`);
    
    setTitle('');
    setArtist('');
    setError(null);
    setIsRequestModalOpen(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
      if (error && e.target.value.trim()) {
          setError(null);
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsRequestModalOpen(false)} 
      />
      
      {/* Modal - Removed border */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <button 
            onClick={() => setIsRequestModalOpen(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
            <X size={20} />
        </button>
        
        {/* Header - Removed Icon */}
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
            곡 요청하기
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    곡 제목 <span className="text-brand-blue">*</span>
                </label>
                <input 
                    type="text" 
                    value={title}
                    onChange={handleTitleChange}
                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black border focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-medium ${
                        error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-zinc-800'
                    }`}
                    placeholder="듣고 싶은 노래 제목을 입력하세요"
                />
                {error && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    아티스트 <span className="text-gray-400 font-normal">(선택)</span>
                </label>
                <input 
                    type="text" 
                    value={artist}
                    onChange={e => setArtist(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-800 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-medium"
                    placeholder="가수 이름을 입력하세요"
                />
            </div>
            <button 
                type="submit"
                className="w-full py-3.5 mt-2 bg-brand-blue text-white font-bold rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/20"
            >
                전송하기
                <Send size={18} />
            </button>
        </form>
      </div>
    </div>
  );
};

export const FloatingControls: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { setIsRequestModalOpen } = useUI();

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 md:hidden">
      <button 
        onClick={toggleTheme}
        className="p-4 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 rounded-full shadow-lg border border-gray-100 dark:border-zinc-700 active:scale-90 transition-all"
        aria-label="Toggle Theme"
      >
        {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
      </button>
      <button 
        onClick={() => setIsRequestModalOpen(true)}
        className="p-4 bg-brand-blue text-white rounded-full shadow-lg shadow-brand-blue/30 active:scale-90 transition-all"
        aria-label="Request Song"
      >
        <MessageCirclePlus size={24} />
      </button>
    </div>
  );
};