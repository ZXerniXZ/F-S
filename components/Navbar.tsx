import React, { useState, useEffect } from 'react';
import { Menu, X, Aperture } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled ? 'bg-slate-950/90 backdrop-blur-md border-slate-800 py-4' : 'bg-transparent border-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo Area */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollTo('hero')}>
          <Aperture className="w-6 h-6 text-slate-100 opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl tracking-wide text-slate-100 leading-none">F&S</span>
            <span className="text-[9px] text-slate-400 uppercase tracking-[0.3em]">Photography</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {['Philosophy', 'Services', 'Portfolio'].map((item) => (
            <button 
              key={item}
              onClick={() => scrollTo(item.toLowerCase() === 'philosophy' ? 'about' : item.toLowerCase())}
              className="text-xs font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-[0.15em]"
            >
              {item}
            </button>
          ))}
          <button 
            onClick={() => scrollTo('contact')} 
            className="px-6 py-2.5 bg-slate-100 text-slate-950 font-semibold text-xs uppercase tracking-widest hover:bg-white transition-all duration-300"
          >
            Inquire
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white opacity-80 hover:opacity-100" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-950 border-b border-slate-800 p-8 flex flex-col gap-6 md:hidden animate-in slide-in-from-top-5">
          {['Philosophy', 'Services', 'Portfolio', 'Contact'].map((item) => (
            <button 
              key={item}
              onClick={() => scrollTo(item.toLowerCase() === 'philosophy' ? 'about' : item.toLowerCase())}
              className="text-2xl font-serif text-slate-300 hover:text-white text-left"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;