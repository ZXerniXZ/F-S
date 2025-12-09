import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { Language } from '../types';
import { Timeline } from './ui/Timeline';

interface PortfolioProps {
  lang: Language;
}

interface Work {
    url: string;
    client: string;
    category: string;
    year: string;
}

const Portfolio: React.FC<PortfolioProps> = ({ lang }) => {
  const [selectedImage, setSelectedImage] = useState<Work | null>(null);

  const content = {
    it: {
      subtitle: "Lavori Selezionati",
      title: "Archivio Visivo",
      description: "Un viaggio attraverso gli eventi che abbiamo raccontato negli ultimi anni.",
    },
    en: {
      subtitle: "Selected Works",
      title: "A Visual Archive",
      description: "A journey through the events we have chronicled over the past few years.",
    }
  };

  const t = content[lang];

  // Data grouped by logic for the timeline
  const works2024: Work[] = [
    {
      url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop",
      client: "Club Haus 80s",
      category: "Nightlife",
      year: "2024"
    },
    {
      url: "https://images.unsplash.com/photo-1574391884720-385075a85263?q=80&w=1000&auto=format&fit=crop",
      client: "Private Gala",
      category: "Portraiture",
      year: "2024"
    },
    {
      url: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1000&auto=format&fit=crop",
      client: "Milan Fashion Week",
      category: "Afterparty",
      year: "2024"
    }
  ];

  const works2023: Work[] = [
    {
      url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop",
      client: "Sonar Festival",
      category: "Live Stage",
      year: "2023"
    },
    {
      url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop",
      client: "Boiler Room",
      category: "Event",
      year: "2023"
    },
    {
      url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000&auto=format&fit=crop",
      client: "Elrow",
      category: "Atmosphere",
      year: "2023"
    }
  ];

  const renderGrid = (works: Work[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {works.map((work, idx) => (
        <div 
            key={idx} 
            className="group cursor-pointer relative rounded-lg overflow-hidden border border-slate-800/50 hover:border-indigo-500/50 transition-colors"
            onClick={() => setSelectedImage(work)}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <img 
              src={work.url} 
              alt={work.client} 
              className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <ZoomIn className="text-white w-8 h-8 opacity-80" />
            </div>
          </div>
          <div className="p-4 bg-slate-900/40 backdrop-blur-sm">
             <h4 className="text-slate-200 font-serif italic text-lg">{work.client}</h4>
             <span className="text-xs text-indigo-400 uppercase tracking-widest">{work.category}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const timelineData = [
    {
      title: "2024",
      content: (
        <div>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mb-8 font-light leading-relaxed">
            {lang === 'it' 
              ? "Un anno caratterizzato da eventi esclusivi e collaborazioni internazionali. Dalla moda milanese alle notti private più riservate." 
              : "A year characterized by exclusive events and international collaborations. From Milan fashion to the most private nightlife."}
          </p>
          {renderGrid(works2024)}
        </div>
      ),
    },
    {
      title: "2023",
      content: (
        <div>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mb-8 font-light leading-relaxed">
             {lang === 'it' 
              ? "Il consolidamento nei grandi festival e club. Energia pura, grandi folle e la ricerca costante dello scatto perfetto in movimento." 
              : "Consolidation in major festivals and clubs. Pure energy, large crowds, and the constant search for the perfect shot in motion."}
          </p>
          {renderGrid(works2023)}
        </div>
      ),
    },
    {
      title: "Origins",
      content: (
        <div>
           <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mb-4 font-light leading-relaxed">
             {lang === 'it' 
              ? "Dove tutto è iniziato. Piccoli club, tanta passione e la definizione del nostro stile 'dark & moody' che ci contraddistingue oggi." 
              : "Where it all began. Small clubs, lots of passion, and the definition of our 'dark & moody' style that distinguishes us today."}
          </p>
          <div className="grid grid-cols-2 gap-4">
             <img 
                src="https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=1000&auto=format&fit=crop"
                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full opacity-50 hover:opacity-100 transition-opacity duration-500"
                alt="Early days"
             />
             <img 
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop"
                className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full opacity-50 hover:opacity-100 transition-opacity duration-500"
                alt="Camera gear"
             />
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="portfolio" className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900/50">
      
      {/* Header Section outside timeline for title */}
      <div className="pt-20 md:pt-32 px-6 max-w-7xl mx-auto">
        <div className="mb-4 text-center md:text-left">
          <span className="text-indigo-500 dark:text-indigo-400/80 font-semibold tracking-[0.2em] uppercase text-xs">{t.subtitle}</span>
          <h2 className="text-3xl md:text-5xl text-slate-900 dark:text-white mt-4 font-serif">{t.title}</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-xl font-light">
            {t.description}
          </p>
        </div>
      </div>

      {/* The Timeline Component */}
      <Timeline data={timelineData} />

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={() => setSelectedImage(null)}
        >
            <button 
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors cursor-pointer z-50"
                onClick={() => setSelectedImage(null)}
            >
                <X className="w-8 h-8" />
            </button>

            <div 
                className="relative max-w-6xl max-h-[90vh] w-full flex flex-col items-center"
                onClick={(e) => e.stopPropagation()} 
            >
                <img 
                    src={selectedImage.url} 
                    alt={selectedImage.client} 
                    className="w-full h-full object-contain max-h-[80vh] shadow-2xl rounded-sm"
                />
                <div className="mt-6 text-center">
                    <h3 className="text-2xl md:text-3xl font-serif text-white">{selectedImage.client}</h3>
                    <div className="flex items-center justify-center gap-3 mt-2">
                        <span className="text-indigo-400 uppercase tracking-widest text-xs font-bold">{selectedImage.category}</span>
                        <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                        <span className="text-slate-400 font-mono text-sm">{selectedImage.year}</span>
                    </div>
                </div>
            </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;