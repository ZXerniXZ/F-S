import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import CustomCursor from './components/CustomCursor';

const App: React.FC = () => {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200 cursor-none">
      <CustomCursor />
      <Navbar />
      <Hero />
      
      {/* Refined About Section */}
      <div id="about" className="py-20 md:py-32 px-6 bg-slate-950 relative">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-indigo-400/80 font-semibold tracking-[0.2em] uppercase text-xs mb-6 block">The Philosophy</span>
          <h3 className="text-2xl md:text-4xl text-white mb-8 md:mb-10 leading-snug">
            Photography is not just documentation.<br className="hidden md:block"/> It is brand elevation.
          </h3>
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-8 md:mb-10"></div>
          <p className="text-base md:text-lg text-slate-400 leading-relaxed font-light mb-6">
            Federico and Simone bring a dual perspective to event reportage. 
            While one focuses on the technical precision of lighting and atmosphere, the other captures the raw, kinetic energy of the crowd.
          </p>
          <p className="text-base md:text-lg text-slate-400 leading-relaxed font-light">
            The result is a cohesive visual narrative that defines your brand's identity long after the lights go up. We don't just deliver photos; we deliver assets.
          </p>
        </div>
      </div>

      <Services />
      <Portfolio />
      <Contact />
    </div>
  );
};

export default App;