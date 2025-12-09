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
      
      {/* Refined About Section */}
      <div id="about" className="py-20 md:py-32 px-6 bg-slate-100 dark:bg-slate-950 relative transition-colors duration-300">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-indigo-500 dark:text-indigo-400/80 font-semibold tracking-[0.2em] uppercase text-xs mb-6 block">{t.philosophyTitle}</span>
          <h3 className="text-2xl md:text-4xl text-slate-900 dark:text-white mb-8 md:mb-10 leading-snug">
            {t.mainStatement}
          </h3>
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-800 to-transparent mb-8 md:mb-10"></div>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-light mb-6">
            {t.p1}
          </p>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-light">
            {t.p2}
          </p>
        </div>
      </div>

      <Services lang={lang} />
      <Portfolio lang={lang} />
      <Pricing lang={lang} />
      <Contact lang={lang} />
    </div>
  );
};

export default App;