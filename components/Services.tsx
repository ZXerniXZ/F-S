
import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, Globe, Image, Zap, X, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Language } from '../types';

interface ServicesProps {
  lang: Language;
}

interface ServiceDetail {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
  longDescription: string;
  features: string[];
}

const Services: React.FC<ServicesProps> = ({ lang }) => {
  // Container Refs
  const sectionRef = useRef<HTMLElement>(null);
  
  // State
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);

  // Mobile Scroll Logic
  const mobileContainerRef = useRef<HTMLDivElement>(null);

  // Mouse Handler for Global Section Spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedService]);

  const translations = {
    it: {
      expertise: "La Nostra Esperienza",
      title: "Servizi & Soluzioni",
      description: "Pacchetti su misura pensati per gruppi nightlife, festival e event planner di lusso.",
      learnMore: "Scopri di più",
      back: "Torna ai Servizi",
      bookService: "Richiedi questo servizio",
      featuresTitle: "Cosa è incluso",
      services: [
        {
          title: "Fotografi Professionisti",
          subtitle: "Fotografia Eventi",
          description: "Realizziamo reportage live con un approccio discreto e altamente tecnico, garantendo immagini impeccabili anche in condizioni di scarsa illuminazione.",
          badge: "Best Seller",
          longDescription: "Il nostro team è specializzato nel catturare l'essenza dell'evento senza interferire con l'esperienza degli ospiti. Utilizziamo attrezzatura all'avanguardia per gestire le condizioni di luce più complesse, tipiche di club e festival notturni. Non ci limitiamo a documentare: creiamo immagini iconiche che definiscono il brand del tuo evento.",
          features: [
            "Copertura completa dell'evento (Backstage, Stage, Crowd)",
            "Gestione avanzata luci basse e strobo",
            "Consegna selezione 'Best of' in tempo reale",
            "Nessun limite di scatti",
            "Team scalabile (da 1 a 5 fotografi)"
          ]
        },
        {
          title: "Editing",
          subtitle: "Post-Produzione",
          description: "Ci occupiamo di una post-produzione accurata e veloce. Selezioniamo gli scatti migliori e li trattiamo con un color grading personalizzato.",
          badge: "24h Delivery",
          longDescription: "La post-produzione è dove lo stile prende forma. Non applichiamo filtri standard: sviluppiamo un look personalizzato per ogni cliente che rispecchi l'identità visiva del brand. Il nostro flusso di lavoro è ottimizzato per la velocità, garantendo materiali pronti per i social media la mattina seguente all'evento.",
          features: [
            "Color Correction personalizzata",
            "Selezione editoriale degli scatti migliori",
            "Ritocco base pelle e imperfezioni",
            "Esportazione ottimizzata per Web e Stampa",
            "Consegna garantita entro 24 ore"
          ]
        },
        {
          title: "Siti Web Personalizzati",
          subtitle: "Esperienza Cliente",
          description: "Offri ai tuoi ospiti un’esperienza digitale esclusiva con gallerie online eleganti e completamente brandizzate.",
          badge: "Premium",
          longDescription: "Dimentica le cartelle Drive o i link Wetransfer anonimi. Creiamo un portale web dedicato per il tuo evento, completamente brandizzato con il tuo logo e i tuoi colori. Un'esperienza premium che permette agli ospiti di cercare, visualizzare e scaricare le proprie foto in un ambiente curato e professionale.",
          features: [
            "Dominio personalizzato o sottodominio",
            "Design responsive (Mobile First)",
            "Area riservata con password opzionale",
            "Download diretto in alta risoluzione",
            "Integrazione pixel social per remarketing"
          ]
        }
      ]
    },
    en: {
      expertise: "Our Expertise",
      title: "Services & Solutions",
      description: "Tailored packages designed for nightlife groups, festivals, and luxury event planners.",
      learnMore: "Learn More",
      back: "Back to Services",
      bookService: "Request this service",
      featuresTitle: "What's included",
      services: [
        {
          title: "Live Reportage",
          subtitle: "Event Photography",
          description: "Comprehensive coverage leveraging low-light mastery. We capture the VIP experience, the stage production, and the crowd energy.",
          badge: "Best Seller",
          longDescription: "Our team specializes in capturing the essence of the event without interfering with the guest experience. We use state-of-the-art equipment to handle the most complex lighting conditions typical of nightclubs and festivals. We don't just document: we create iconic images that define your event's brand.",
          features: [
            "Full event coverage (Backstage, Stage, Crowd)",
            "Advanced low-light and strobe handling",
            "Real-time 'Best of' delivery",
            "No shot limit",
            "Scalable team (1 to 5 photographers)"
          ]
        },
        {
          title: "Editorial Curation",
          subtitle: "Post-Production",
          description: "Speed without compromise. We hand-select and grade images to match your venue's color palette and mood.",
          badge: "24h Delivery",
          longDescription: "Post-production is where style takes shape. We don't apply standard filters: we develop a custom look for each client that reflects the brand's visual identity. Our workflow is optimized for speed, ensuring social media-ready materials the morning after the event.",
          features: [
            "Custom Color Correction",
            "Editorial selection of best shots",
            "Basic skin and imperfection retouching",
            "Optimized export for Web and Print",
            "Guaranteed delivery within 24 hours"
          ]
        },
        {
          title: "Digital Galleries",
          subtitle: "Client Experience",
          description: "Elevate your guest experience with a dedicated, branded web portal for every event. No generic drive links.",
          badge: "Premium",
          longDescription: "Forget anonymous Drive folders or Wetransfer links. We create a dedicated web portal for your event, completely branded with your logo and colors. A premium experience that allows guests to search, view, and download their photos in a curated and professional environment.",
          features: [
            "Custom domain or subdomain",
            "Responsive Design (Mobile First)",
            "Private area with optional password",
            "Direct high-resolution download",
            "Social pixel integration for remarketing"
          ]
        }
      ]
    }
  };

  const t = translations[lang];

  const servicesData = [
    { icon: <Zap className="w-6 h-6 md:w-8 md:h-8" />, ...t.services[0] },
    { icon: <Image className="w-6 h-6 md:w-8 md:h-8" />, ...t.services[1] },
    { icon: <Globe className="w-6 h-6 md:w-8 md:h-8" />, ...t.services[2] }
  ];

  return (
    <>
      <section 
        id="services" 
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="py-20 md:py-32 bg-slate-950 relative border-t border-slate-900/50 overflow-hidden"
      >
        {/* Global Spotlight Gradient Overlay (Covering the whole section) */}
        <div 
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-0"
            style={{
                opacity,
                background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.06), transparent 40%)`
            }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-24 gap-6 md:gap-8">
            <div>
              <span className="text-indigo-400/80 font-semibold tracking-[0.2em] uppercase text-xs">{t.expertise}</span>
              <h2 className="text-4xl md:text-6xl text-white mt-4 font-serif italic">{t.title}</h2>
            </div>
            <p className="text-slate-400 max-w-sm text-sm md:text-base leading-relaxed hidden md:block border-l border-indigo-500/30 pl-6">
              {t.description}
            </p>
          </div>

          {/* --- DESKTOP VIEW (Cards) --- */}
          <div className="hidden md:grid grid-cols-3 gap-6 relative">
            {servicesData.map((service, index) => (
              <div 
                  key={index} 
                  className="group relative flex flex-col h-full bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 hover:border-indigo-500/30 rounded-xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 z-10"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-8 relative z-20">
                    <div className="p-3 rounded-lg bg-slate-800/50 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                      {service.icon}
                    </div>
                    <span className="px-3 py-1 rounded-full border border-slate-700 bg-slate-900/50 text-[10px] uppercase tracking-widest text-slate-400 font-bold group-hover:border-indigo-500/30 group-hover:text-indigo-300 transition-colors">
                        {service.badge}
                    </span>
                </div>

                {/* Content */}
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 relative z-20 group-hover:text-slate-400">{service.subtitle}</h4>
                <h3 className="text-2xl lg:text-3xl font-serif text-slate-100 mb-6 group-hover:text-white transition-colors relative z-20">
                    {service.title}
                </h3>
                
                <div className="flex-grow relative z-20">
                    <p className="text-slate-400 leading-relaxed font-light text-sm">
                      {service.description}
                    </p>
                </div>
                
                {/* Footer / CTA */}
                <div className="mt-8 pt-6 border-t border-slate-800/50 group-hover:border-indigo-500/20 relative z-20">
                  <button 
                      onClick={() => setSelectedService(service)}
                      className="flex items-center justify-between w-full text-xs font-bold text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors"
                  >
                    <span>{t.learnMore}</span>
                    <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center group-hover:bg-indigo-500 group-hover:border-indigo-500 transition-all duration-300">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* --- MOBILE VIEW (Horizontal Snap Carousel) --- */}
          <div className="md:hidden relative">
            <div 
              ref={mobileContainerRef}
              onScroll={handleMobileScroll}
              className="flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-6 px-6 scrollbar-hide gap-4"
            >
              {servicesData.map((service, index) => {
                const isActive = index === activeSlide;
                return (
                  <div 
                    key={index} 
                    className={`
                      relative snap-center flex-shrink-0 w-[85vw] p-6 rounded-2xl border transition-all duration-500 ease-out flex flex-col justify-between min-h-[380px]
                      ${isActive 
                        ? 'bg-slate-900/80 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)] scale-100 opacity-100' 
                        : 'bg-slate-950 border-slate-800 scale-95 opacity-60'
                      }
                    `}
                  >
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
                    <div className={`mt-6 pt-6 border-t ${isActive ? 'border-indigo-500/20' : 'border-slate-800'}`}>
                      <button 
                          onClick={() => setSelectedService(service)}
                          className={`flex items-center justify-between w-full text-xs font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-600'}`}
                      >
                          {t.learnMore} <ArrowRight className={`w-3 h-3 ml-2 transition-transform ${isActive ? 'translate-x-1' : ''}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-2 mt-2">
              {servicesData.map((_, i) => (
                <div 
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${i === activeSlide ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-800'}`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* --- FULL SCREEN DETAIL PAGE OVERLAY --- */}
      {selectedService && (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col animate-in slide-in-from-bottom-10 duration-500 overflow-y-auto">
          
          {/* Nav / Close */}
          <div className="sticky top-0 z-50 flex items-center justify-between p-6 md:p-8 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
             <button 
                onClick={() => setSelectedService(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest"
             >
                <ArrowLeft className="w-4 h-4" /> {t.back}
             </button>
             <button 
                onClick={() => setSelectedService(null)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
             >
                <X className="w-6 h-6" />
             </button>
          </div>

          <div className="max-w-4xl mx-auto w-full px-6 py-12 md:py-20">
             
             {/* Header */}
             <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                   <div className="p-3 md:p-4 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {selectedService.icon}
                   </div>
                   <span className="px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-[10px] md:text-xs uppercase tracking-widest text-indigo-300 font-bold">
                       {selectedService.badge}
                   </span>
                </div>
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">{selectedService.subtitle}</h4>
                <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight mb-8">
                    {selectedService.title}
                </h2>
                <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-2xl">
                    {selectedService.longDescription}
                </p>
             </div>

             {/* Divider */}
             <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-12"></div>

             {/* Features Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                   <h3 className="text-xl font-serif text-white mb-6">{t.featuresTitle}</h3>
                   <ul className="space-y-4">
                      {selectedService.features.map((feature, idx) => (
                         <li key={idx} className="flex items-start gap-3 text-slate-400 group">
                            <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5 group-hover:text-indigo-400 transition-colors" />
                            <span className="leading-relaxed">{feature}</span>
                         </li>
                      ))}
                   </ul>
                </div>
                
                {/* CTA Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col justify-center items-center text-center">
                   <h3 className="text-xl font-serif text-white mb-2">Ready to start?</h3>
                   <p className="text-slate-400 text-sm mb-6">Contattaci per un preventivo personalizzato su questo servizio.</p>
                   <button 
                      onClick={() => {
                        setSelectedService(null);
                        setTimeout(() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'}), 100);
                      }}
                      className="w-full py-4 bg-white text-slate-950 font-bold uppercase tracking-widest text-xs hover:bg-indigo-50 transition-colors rounded-sm"
                   >
                      {t.bookService}
                   </button>
                </div>
             </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Services;
