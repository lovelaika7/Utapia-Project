import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, MessageCirclePlus } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useUI } from './UIContext';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { setIsRequestModalOpen } = useUI();

  return (
    <nav className="relative md:fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-transparent transition-colors duration-300 border-b border-transparent dark:border-white/5">
      <div className="max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-center h-16">
          
          {/* Centered Designed Logo */}
          <Link to="/" className="flex items-center gap-2 group" aria-label="Utapia Home">
            {/* Custom SVG Logo Design */}
            <svg width="140" height="40" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-105">
                <defs>
                    <linearGradient id="brand-gradient" x1="0" y1="0" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00c6c6" />
                        <stop offset="100%" stopColor="#00c6ff" />
                    </linearGradient>
                </defs>
                {/* Icon Part */}
                <circle cx="20" cy="20" r="16" fill="url(#brand-gradient)" />
                <path d="M20 12V28M16 18L20 28L24 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                
                {/* Text Part 'Utapia' with custom path/style */}
                <text x="44" y="28" fontFamily="sans-serif" fontSize="24" fontWeight="800" fill={theme === 'dark' ? 'white' : '#111'}>
                    Utapia
                </text>
            </svg>
          </Link>

          {/* Actions (Absolute Right) - Hidden on mobile (md:flex) */}
          <div className="absolute right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-3 sm:gap-4">
            
             {/* Theme Toggle (Swapped Position) */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:text-brand-blue dark:hover:text-brand-blue transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Request Song Link - Trigger Modal (Swapped Position) */}
            <button 
                onClick={() => setIsRequestModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:text-brand-blue dark:hover:text-brand-blue transition-colors text-gray-600 dark:text-gray-300"
            >
                {/* Updated Icon: Removed question mark */}
                <MessageCirclePlus size={20} />
                <span className="hidden sm:inline text-sm font-medium">곡 요청</span>
            </button>
            
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;