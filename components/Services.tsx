import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, Globe, Image, Zap } from 'lucide-react';
import { Language } from '../types';

interface ServicesProps {
  lang: Language;
}

const Services: React.FC<ServicesProps> = ({ lang }) => {
  // Desktop Refs & State
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  // Mobile Refs & State
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // Desktop Mouse Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!desktopContainerRef.current) return;
    const div = desktopContainerRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  // Mobile Scroll Handler
  const handleMobileScroll = () => {
    if (!mobileContainerRef.current) return;
    const scrollLeft = mobileContainerRef.current.scrollLeft;
    const width = mobileContainerRef.current.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setActiveSlide(index);
  };

  const translations = {
    it: {
      expertise: "La Nostra Esperienza",
      title: "Servizi & Soluzioni",
      description: "Pacchetti su misura pensati per gruppi nightlife, festival e event planner di lusso.",
      services: [
        {
          title: "Reportage Live",
          subtitle: "Fotografia Eventi",
          description: "Copertura completa sfruttando la maestria in condizioni di scarsa illuminazione. Catturiamo l'esperienza VIP, la produzione scenica e l'energia della folla.",
          badge: "Best Seller"
        },
        {
          title: "Curatela Editoriale",
          subtitle: "Post-Produzione",
          description: "Velocità senza compromessi. Selezioniamo e coloriamo le immagini per abbinarle alla palette e al mood del tuo locale. Consegnate entro 24 ore.",
          badge: "24h Delivery"
        },
        {
          title: "Gallerie Digitali",
          subtitle: "Esperienza Cliente",
          description: "Eleva l'esperienza dei tuoi ospiti con un portale web dedicato e brandizzato per ogni evento. Niente link generici—solo una piattaforma elegante.",
          badge: "Premium"
        }
      ],
      learnMore: "Scopri di più"
    },
    en: {
      expertise: "Our Expertise",
      title: "Services & Solutions",
      description: "Tailored packages designed for nightlife groups, festivals, and luxury event planners.",
      services: [
        {
          title: "Live Reportage",
          subtitle: "Event Photography",
          description: "Comprehensive coverage leveraging low-light mastery. We capture the VIP experience, the stage production, and the crowd energy.",
          badge: "Best Seller"
        },
        {
          title: "Editorial Curation",
          subtitle: "Post-Production",
          description: "Speed without compromise. We hand-select and grade images to match your venue's color palette and mood. Delivered within 24 hours.",
          badge: "24h Delivery"
        },
        {
          title: "Digital Galleries",
          subtitle: "Client Experience",
          description: "Elevate your guest experience with a dedicated, branded web portal for every event. No generic drive links—just a sleek platform.",
          badge: "Premium"
        }
      ],
      learnMore: "Learn More"
    }
  };

  const t = translations[lang];

  const services = [
    { icon: <Zap className="w-6 h-6 md:w-8 md:h-8" />, ...t.services[0] },
    { icon: <Image className="w-6 h-6 md:w-8 md:h-8" />, ...t.services[1] },
    { icon: <Globe className="w-6 h-6 md:w-8 md:h-8" />, ...t.services[2] }
  ];

  return (
    <section id="services" className="py-16 md:py-32 bg-slate-950 relative border-t border-slate-900/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-20 gap-4 md:gap-8">
          <div>
            <span className="text-indigo-400/80 font-semibold tracking-[0.2em] uppercase text-xs">{t.expertise}</span>
            <h2 className="text-3xl md:text-5xl text-white mt-4 font-serif italic">{t.title}</h2>
          </div>
          <p className="text-slate-400 max-w-sm text-sm leading-relaxed hidden md:block">
            {t.description}
          </p>
        </div>

        {/* --- DESKTOP VIEW (Spotlight Grid) --- */}
        <div 
            ref={desktopContainerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="hidden md:grid grid-cols-3 gap-1 bg-slate-900/50 border border-slate-800/30 rounded-lg overflow-hidden relative"
        >
          {/* Spotlight Gradient Overlay */}
          <div 
            className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
            style={{
                opacity,
                background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`
            }}
          />

          {services.map((service, index) => (
            <div key={index} className="group relative bg-slate-950 p-12 hover:bg-slate-950/80 transition-colors duration-500 z-10 cursor-default border-l border-slate-900 first:border-l-0">
                {/* Spotlight Card Border Effect */}
                <div 
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(255, 255, 255, 0.05), transparent 40%)`
                    }}
                />

              <div className="mb-8 text-indigo-400 opacity-60 group-hover:opacity-100 transition-opacity relative z-20">
                {service.icon}
              </div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 relative z-20">{service.subtitle}</h4>
              <h3 className="text-2xl font-serif text-slate-100 mb-6 group-hover:translate-x-2 transition-transform duration-300 relative z-20">{service.title}</h3>
              <p className="text-slate-400 leading-relaxed font-light text-sm mb-8 relative z-20">
                {service.description}
              </p>
              
              <div className="absolute bottom-12 left-12 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 relative z-20">
                <span className="inline-flex items-center text-xs font-bold text-white uppercase tracking-widest cursor-pointer">
                  {t.learnMore} <ArrowRight className="w-3 h-3 ml-2" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* --- MOBILE VIEW (Horizontal Snap Carousel) --- */}
        <div className="md:hidden relative">
          
          {/* Scroll Container */}
          <div 
            ref={mobileContainerRef}
            onScroll={handleMobileScroll}
            className="flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-6 px-6 scrollbar-hide gap-4"
          >
            {services.map((service, index) => {
              const isActive = index === activeSlide;
              
              return (
                <div 
                  key={index} 
                  className={`
                    relative snap-center flex-shrink-0 w-[85vw] p-6 rounded-2xl border transition-all duration-500 ease-out flex flex-col justify-between min-h-[320px]
                    ${isActive 
                      ? 'bg-slate-900/80 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)] scale-100 opacity-100' 
                      : 'bg-slate-950 border-slate-800 scale-95 opacity-60'
                    }
                  `}
                >
                  {/* Card Content */}
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-3 rounded-xl transition-colors duration-500 ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-900 text-slate-600'}`}>
                        {service.icon}
                      </div>
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${isActive ? 'border-indigo-500/30 text-indigo-300' : 'border-slate-800 text-slate-600'}`}>
                        {service.badge}
                      </span>
                    </div>

                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{service.subtitle}</h4>
                    <h3 className={`text-2xl font-serif mb-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`}>
                      {service.title}
                    </h3>
                    <p className="text-slate-400 text-sm font-light leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Bottom Action */}
                  <div className={`mt-6 pt-6 border-t ${isActive ? 'border-indigo-500/20' : 'border-slate-800'}`}>
                     <span className={`inline-flex items-center text-xs font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-600'}`}>
                        {t.learnMore} <ArrowRight className={`w-3 h-3 ml-2 transition-transform ${isActive ? 'translate-x-1' : ''}`} />
                     </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Indicators */}
          <div className="flex justify-center gap-2 mt-2">
            {services.map((_, i) => (
              <div 
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${i === activeSlide ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-800'}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Services;