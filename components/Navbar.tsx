import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Aperture, Languages, Moon, Sun } from 'lucide-react';
import { Language } from '../types';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ lang, setLang, isDarkMode, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Dynamic Hover State
  const [hoveredRect, setHoveredRect] = useState<{ left: number; width: number; opacity: number }>({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const menuItems = {
    it: [
      { id: 'about', label: 'Filosofia' },
      { id: 'services', label: 'Servizi' },
      { id: 'portfolio', label: 'Portfolio' },
      { id: 'pricing', label: 'Prezzi' }
    ],
    en: [
      { id: 'about', label: 'Philosophy' },
      { id: 'services', label: 'Services' },
      { id: 'portfolio', label: 'Portfolio' },
      { id: 'pricing', label: 'Pricing' }
    ]
  };

  const ctaLabel = lang === 'it' ? 'Contattaci' : 'Inquire';

  // Handle Hover for dynamic pill
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!navRef.current) return;
    const navRect = navRef.current.getBoundingClientRect();
    const itemRect = e.currentTarget.getBoundingClientRect();
    
    setHoveredRect({
      left: itemRect.left - navRect.left,
      width: itemRect.width,
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    setHoveredRect((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b 
        ${isScrolled 
            ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-slate-200 dark:border-slate-800 py-4 shadow-sm' 
            : 'bg-transparent border-transparent py-6 md:py-8'}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo Area */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollTo('hero')}>
            <div className={`p-2 rounded-lg transition-colors duration-300 ${isScrolled ? 'bg-indigo-50 dark:bg-indigo-950/30' : 'bg-transparent'}`}>
                <Aperture className={`w-6 h-6 transition-colors ${isScrolled ? 'text-indigo-600 dark:text-slate-100' : 'text-slate-100'}`} />
            </div>
            <div className="flex flex-col">
              <span className={`font-serif font-bold text-xl tracking-wide leading-none transition-colors ${isScrolled ? 'text-slate-900 dark:text-slate-100' : 'text-slate-100'}`}>F&S</span>
              <span className={`text-[9px] uppercase tracking-[0.3em] transition-colors ${isScrolled ? 'text-slate-500 dark:text-slate-400' : 'text-slate-300/80'}`}>Photography</span>
            </div>
          </div>

          {/* Center Navigation (Dynamic Pill) */}
          <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <div 
                ref={navRef}
                className={`relative flex items-center p-1.5 rounded-full border transition-all duration-500
                ${isScrolled 
                    ? 'bg-slate-100/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 backdrop-blur-sm' 
                    : 'bg-black/20 border-white/10 backdrop-blur-md'
                }`} 
                onMouseLeave={handleMouseLeave}
            >
                {/* The Floating Pill Background */}
                <div 
                    className="absolute h-[calc(100%-0.75rem)] top-1.5 bg-white dark:bg-slate-800 rounded-full shadow-sm transition-all duration-300 ease-out pointer-events-none"
                    style={{
                        left: hoveredRect.left,
                        width: hoveredRect.width,
                        opacity: hoveredRect.opacity,
                    }}
                />

                {menuItems[lang].map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => scrollTo(item.id)}
                        onMouseEnter={handleMouseEnter}
                        className={`relative z-10 px-5 py-2 text-xs font-medium uppercase tracking-[0.15em] transition-colors duration-300
                            ${isScrolled 
                                ? 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white' 
                                : 'text-slate-200 hover:text-white'
                            }
                        `}
                    >
                    {item.label}
                    </button>
                ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Theme Toggle */}
            <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${isScrolled ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400' : 'hover:bg-white/10 text-white/80'}`}
                title={isDarkMode ? "Light Mode" : "Dark Mode"}
            >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Toggle */}
            <button 
              onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
              className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors
                 ${isScrolled ? 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white' : 'text-slate-300 hover:text-white'}
              `}
            >
              <Languages className="w-3 h-3" />
              {lang === 'it' ? 'EN' : 'IT'}
            </button>

            {/* CTA */}
            <button 
              onClick={() => scrollTo('contact')} 
              className={`px-6 py-2.5 font-semibold text-xs uppercase tracking-widest transition-all duration-300 rounded-sm
                ${isScrolled 
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 hover:bg-indigo-600 dark:hover:bg-white hover:shadow-lg' 
                    : 'bg-white text-slate-950 hover:bg-indigo-50'}
              `}
            >
              {ctaLabel}
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full ${isScrolled ? 'text-slate-900 dark:text-white' : 'text-white'}`}
            >
                 {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
                className={`opacity-80 hover:opacity-100 ${isScrolled ? 'text-slate-900 dark:text-white' : 'text-white'}`} 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-8 flex flex-col gap-6 md:hidden animate-in slide-in-from-top-5 shadow-2xl">
            {menuItems[lang].map((item) => (
              <button 
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-2xl font-serif text-slate-800 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white text-left transition-colors"
              >
                {item.label}
              </button>
            ))}
            
            <div className="h-px bg-slate-200 dark:bg-slate-800 w-full my-2"></div>
            
            <div className="flex justify-between items-center">
                <button 
                    onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
                    className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest"
                >
                    <Languages className="w-4 h-4" />
                    {lang === 'it' ? 'English' : 'Italiano'}
                </button>
            </div>

            <button 
              onClick={() => scrollTo('contact')}
              className="w-full py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-bold uppercase tracking-widest mt-2"
            >
              {ctaLabel}
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;