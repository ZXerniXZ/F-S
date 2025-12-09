import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import CustomCursor from './components/CustomCursor';
import { Language } from './types';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('it');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Theme Toggle Logic
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const content = {
    it: {
      philosophyTitle: "La Filosofia",
      mainStatement: <>La fotografia non serve solo a ricordare una serata:<br className="hidden md:block"/> la rende speciale anche dopo.</>,
      p1: "Trasformiamo il tuo evento in immagini curate, luminose e autentiche, capaci di raccontare davvero l’atmosfera vissuta.",
      p2: "Ogni foto è pensata per emozionare oggi e funzionare domani: ricordi di valore, pronti da condividere e da conservare. Non consegniamo scatti qualsiasi, ma immagini che fanno rivivere la tua notte."
    },
    en: {
      philosophyTitle: "The Philosophy",
      mainStatement: <>Photography isn't just about remembering a night:<br className="hidden md:block"/> it makes it special long after.</>,
      p1: "We transform your event into curated, luminous, and authentic images capable of truly recounting the atmosphere experienced.",
      p2: "Every photo is designed to excite today and work tomorrow: valuable memories, ready to share and keep. We don't deliver just any shots, but images that make your night come alive again."
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-600 dark:selection:text-indigo-200 cursor-none transition-colors duration-300">
      <CustomCursor />
      <Navbar lang={lang} setLang={setLang} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <Hero lang={lang} />
      
      {/* Refined About Section (Split Layout - Mobile Optimized) */}
      <section id="about" className="py-16 md:py-40 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 items-center">
              
              {/* Left: Visual Abstract */}
              <div className="md:col-span-5 relative group cursor-pointer order-1">
                 {/* Aspect Ratio: Video (landscape) on mobile to save vertical space, Portrait on desktop */}
                 <div className="aspect-video md:aspect-[3/4] overflow-hidden rounded-sm relative z-10">
                    <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-colors duration-500 z-20 pointer-events-none mix-blend-overlay"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop" 
                      alt="Atmosphere" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-100 group-hover:scale-105"
                    />
                 </div>
                 {/* Decor frame - adjusted offset for mobile */}
                 <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-full h-full border border-slate-300 dark:border-slate-800 -z-0 group-hover:top-2 group-hover:left-2 md:group-hover:top-4 md:group-hover:left-4 group-hover:border-indigo-500/30 transition-all duration-500"></div>
              </div>

              {/* Right: Content */}
              <div className="md:col-span-7 order-2">
                 <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <span className="w-8 md:w-12 h-px bg-indigo-500"></span>
                    <span className="text-indigo-500 dark:text-indigo-400 font-semibold tracking-[0.2em] uppercase text-[10px] md:text-xs">
                        {t.philosophyTitle}
                    </span>
                 </div>
                 
                 <h3 className="text-2xl md:text-5xl text-slate-900 dark:text-white mb-6 md:mb-8 leading-tight md:leading-[1.15] font-serif font-medium">
                    {t.mainStatement}
                 </h3>
                 
                 <div className="space-y-4 md:space-y-6 text-slate-600 dark:text-slate-400 font-light leading-relaxed text-sm md:text-lg pl-0 md:pl-8 border-l-0 md:border-l border-slate-200 dark:border-slate-800">
                    <p>{t.p1}</p>
                    <p>{t.p2}</p>
                 </div>

                 {/* Signature block */}
                 <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between opacity-70">
                    <div className="font-serif italic text-slate-500 dark:text-slate-400 text-base md:text-lg">Federico & Simone</div>
                    <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">F&S Photography</div>
                 </div>
              </div>

            </div>
         </div>
      </section>

      <Services lang={lang} />
      <Portfolio lang={lang} />
      <Pricing lang={lang} />
      <Contact lang={lang} />
    </div>
  );
};

export default App;