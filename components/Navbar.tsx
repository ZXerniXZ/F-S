import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Aperture, Languages, Moon, Sun, ArrowRight } from 'lucide-react';
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
      // Optimization: Only update state if value changes to avoid re-renders
      const shouldBeScrolled = window.scrollY > 20;
      setIsScrolled(prev => {
        if (prev !== shouldBeScrolled) return shouldBeScrolled;
        return prev;
      });
    };
    
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Header height offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
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
            ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-slate-200 dark:border-slate-800 py-3 md:py-4 shadow-sm' 
            : 'bg-transparent border-transparent py-5 md:py-8'}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo Area */}
          <div className="flex items-center gap-3 cursor-pointer group relative z-50" onClick={() => scrollTo('hero')}>
            <div className={`p-2 rounded-lg transition-colors duration-300 ${isScrolled ? 'bg-indigo-50 dark:bg-indigo-950/30' : 'bg-white/10 backdrop-blur-sm'}`}>
                <Aperture className={`w-5 h-5 md:w-6 md:h-6 transition-colors ${isScrolled ? 'text-indigo-600 dark:text-slate-100' : 'text-slate-100'}`} />
            </div>
            <div className="flex flex-col">
              <span className={`font-serif font-bold text-lg md:text-xl tracking-wide leading-none transition-colors ${isScrolled ? 'text-slate-900 dark:text-slate-100' : 'text-slate-100'}`}>F&S</span>
              <span className={`text-[8px] md:text-[9px] uppercase tracking-[0.3em] transition-colors ${isScrolled ? 'text-slate-500 dark:text-slate-400' : 'text-slate-300/80'}`}>Photography</span>
            </div>
          </div>

          {/* Center Navigation (Dynamic Pill) - DESKTOP */}
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

          {/* Right Actions - DESKTOP */}
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

          {/* Mobile Toggle & Actions */}
          <div className="flex items-center gap-2 md:hidden relative z-50">
             <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all active:scale-95 ${isScrolled ? 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800' : 'text-white bg-white/10 backdrop-blur-sm'}`}
            >
                 {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button 
                className={`p-2 rounded-full transition-all active:scale-95 ${isScrolled ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800' : 'text-white bg-white/10 backdrop-blur-sm'}`} 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Floating Menu (Glass Card) */}
        {isMobileMenuOpen && (
          <div className="absolute top-20 left-4 right-4 md:hidden z-40 animate-in zoom-in-95 fade-in duration-300 origin-top">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl p-6 flex flex-col gap-2">
                
                {menuItems[lang].map((item, idx) => (
                <button 
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className="group flex items-center justify-between w-full p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    style={{ animationDelay: `${idx * 50}ms` }}
                >
                    <span className="text-lg font-serif text-slate-800 dark:text-slate-200">{item.label}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                </button>
                ))}
                
                <div className="h-px bg-slate-200 dark:bg-slate-800 w-full my-2"></div>
                
                <div className="flex items-center justify-between p-2">
                    <button 
                        onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
                        className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-indigo-500 transition-colors"
                    >
                        <Languages className="w-4 h-4" />
                        {lang === 'it' ? 'English' : 'Italiano'}
                    </button>
                    
                     <button 
                        onClick={() => scrollTo('contact')}
                        className="px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-bold uppercase tracking-widest text-xs rounded-lg shadow-lg"
                        >
                        {ctaLabel}
                    </button>
                </div>
            </div>
            
            {/* Click outside closer overlay */}
            <div 
                className="fixed inset-0 -z-10 bg-black/20 backdrop-blur-[2px]" 
                style={{ top: '80px' }}
                onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;