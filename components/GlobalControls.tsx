import React, { useState } from 'react';
import { X, Send, Sun, Moon, MessageCirclePlus, Loader2, CheckCircle2 } from 'lucide-react';
import { useUI } from './UIContext';
import { useTheme } from './ThemeContext';
import emailjs from '@emailjs/browser';

// ==========================================
// SECURITY UPDATE:
// Credentials are now loaded from Environment Variables.
// Create a .env file in your project root to store these values.
// ==========================================
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '';

export const RequestSongModal: React.FC = () => {
  const { isRequestModalOpen, setIsRequestModalOpen } = useUI();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isRequestModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
        setErrorMessage("곡 제목은 필수 입력 사항입니다.");
        return;
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        setErrorMessage("이메일 설정 오류: 환경 변수를 확인해주세요.");
        console.error("EmailJS Environment variables are missing.");
        return;
    }

    setStatus('sending');
    setErrorMessage(null);

    try {
        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
                to_email: 'lovelaika7@gmail.com',
                song_title: title,
                artist_name: artist || '정보 없음',
                message: `곡 신청: ${title} - ${artist}`
            },
            EMAILJS_PUBLIC_KEY
        );
        
        setStatus('success');
        
        // Reset and close after delay
        setTimeout(() => {
            setTitle('');
            setArtist('');
            setStatus('idle');
            setIsRequestModalOpen(false);
        }, 2000);

    } catch (error) {
        console.error("Email sending failed", error);
        setStatus('error');
        setErrorMessage("전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
      if (errorMessage) setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={() => { if (status !== 'sending') setIsRequestModalOpen(false); }} 
      />
      
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <button 
            onClick={() => setIsRequestModalOpen(false)}
            disabled={status === 'sending'}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
            <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
            곡 요청하기
        </h2>
        
        {status === 'success' ? (
            <div className="py-10 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-2">
                <CheckCircle2 className="w-16 h-16 text-brand-blue mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">요청 완료!</h3>
                <p className="text-gray-500 dark:text-gray-400">성공적으로 전송되었습니다.</p>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                        곡 제목 <span className="text-brand-blue">*</span>
                    </label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={handleTitleChange}
                        disabled={status === 'sending'}
                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black border focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-medium ${
                            errorMessage ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-zinc-800'
                        }`}
                        placeholder="듣고 싶은 노래 제목을 입력하세요"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                        아티스트 <span className="text-gray-400 font-normal">(선택)</span>
                    </label>
                    <input 
                        type="text" 
                        value={artist}
                        onChange={e => setArtist(e.target.value)}
                        disabled={status === 'sending'}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-800 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-medium"
                        placeholder="가수 이름을 입력하세요"
                    />
                </div>
                
                {errorMessage && (
                    <p className="text-red-500 text-xs font-medium animate-in fade-in">
                        {errorMessage}
                    </p>
                )}

                <button 
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-3.5 mt-2 bg-brand-blue text-white font-bold rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {status === 'sending' ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            전송 중...
                        </>
                    ) : (
                        <>
                            전송하기
                            <Send size={18} />
                        </>
                    )}
                </button>
            </form>
        )}
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