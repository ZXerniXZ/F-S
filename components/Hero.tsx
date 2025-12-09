
import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Language } from '../types';
import { ShaderAnimation } from './ui/ShaderAnimation';
import { Typewriter } from './ui/Typewriter';

interface HeroProps {
  lang: Language;
}

const Hero: React.FC<HeroProps> = ({ lang }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Disable parallax logic on small screens to save performance
      if (window.innerWidth < 768) return;

      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20; // range -10 to 10
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const content = {
    it: {
      // Headline is handled dynamically in JSX for Typewriter integration
      description: "Produciamo contenuti fotografici ad alto impatto per feste, club, festival e progetti privati. Qualità da magazine, velocità da social: editing raffinato, storytelling visivo e consegne rapide per valorizzare ogni momento.",
      btnPortfolio: "Vedi Portfolio",
      btnServices: "I Nostri Servizi"
    },
    en: {
      description: "We produce high-impact photographic content for parties, clubs, festivals, and private projects. Magazine quality, social speed: refined editing, visual storytelling, and rapid delivery to enhance every moment.",
      btnPortfolio: "View Portfolio",
      btnServices: "Our Services"
    }
  };

  const t = content[lang];
  
  // Helper for Google Drive Links
  // Using lh3.googleusercontent.com is often more CORS friendly for WebGL textures than drive.google.com/uc
  const getDriveLink = (id: string) => `https://lh3.googleusercontent.com/d/${id}`;
  
  // Using the specific Drive ID provided
  const bgImage = getDriveLink("1Cj0Htsro1vSWYimabgq1KEdAYD9fKtqA");

  const typewriterWords = lang === 'it' 
    ? ["notte", "storia", "festa", "occasione", "serata"]
    : ["night", "story", "party", "occasion", "evening"];

  return (
    <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Parallax Background with Image & Shader */}
      <div 
        className="absolute inset-0 z-0 scale-110 transition-transform duration-100 ease-out"
        style={{
            transform: `translate3d(${-offset.x}px, ${-offset.y}px, 0) scale(1.1)`
        }}
      >
        {/* Shader Layer contains the image now */}
        <div className="absolute inset-0 z-10 w-full h-full">
            <ShaderAnimation imageUrl={bgImage} />
        </div>

        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-slate-950/60 via-slate-950/30 to-slate-950" />
      </div>

      {/* Floating Content */}
      <div 
        className="relative z-30 text-center px-6 max-w-4xl mx-auto flex flex-col items-center transition-transform duration-200 ease-out"
        style={{
            transform: `translate3d(${offset.x * 0.5}px, ${offset.y * 0.5}px, 0)`
        }}
      >
        <div className="mb-6 flex items-center gap-4 opacity-70">
          <div className="h-[1px] w-8 md:w-12 bg-indigo-400"></div>
          <span className="text-indigo-300 text-[10px] md:text-xs font-semibold tracking-[0.4em] uppercase">Federico & Simone</span>
          <div className="h-[1px] w-8 md:w-12 bg-indigo-400"></div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white mb-6 md:mb-8 leading-[1.1] font-medium text-glow-subtle">
          {lang === 'it' ? "La tua " : "Your "}
          <Typewriter
            text={typewriterWords}
            speed={70}
            waitTime={1500}
            deleteSpeed={40}
            cursorChar={"_"}
            className="text-indigo-400 font-serif"
          />
          <br/>
          <span className="italic text-slate-400 font-normal">
            {lang === 'it' ? "raccontata con stile." : "told with style."}
          </span>
        </h1>
        
        <p className="text-sm md:text-lg text-slate-400 max-w-xl mx-auto font-light leading-relaxed mb-10 md:mb-12">
          {t.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
            <button onClick={() => document.getElementById('portfolio')?.scrollIntoView({behavior: 'smooth'})} className="w-full sm:w-auto px-10 py-4 bg-slate-100 text-slate-950 text-xs font-bold uppercase tracking-widest hover:bg-indigo-50 transition-colors cursor-pointer">
              {t.btnPortfolio}
            </button>
            <button onClick={() => document.getElementById('services')?.scrollIntoView({behavior: 'smooth'})} className="w-full sm:w-auto px-10 py-4 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-widest hover:border-slate-500 hover:text-white transition-all cursor-pointer">
              {t.btnServices}
            </button>
        </div>
      </div>

      <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 text-slate-600 animate-bounce z-30">
        <ChevronDown className="w-6 h-6 opacity-50" />
      </div>
    </section>
  );
};

export default Hero;
