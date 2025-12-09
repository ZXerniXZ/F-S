import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface Work {
    url: string;
    client: string;
    category: string;
    year: string;
}

const Portfolio: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<Work | null>(null);

  const works: Work[] = [
    {
      url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop",
      client: "Club Haus 80s",
      category: "Nightlife",
      year: "2024"
    },
    {
      url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop",
      client: "Sonar Festival",
      category: "Live Stage",
      year: "2023"
    },
    {
      url: "https://images.unsplash.com/photo-1574391884720-385075a85263?q=80&w=1000&auto=format&fit=crop",
      client: "Private Gala",
      category: "Portraiture",
      year: "2024"
    },
    {
      url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop",
      client: "Boiler Room",
      category: "Event",
      year: "2023"
    },
    {
      url: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1000&auto=format&fit=crop",
      client: "Milan Fashion Week",
      category: "Afterparty",
      year: "2024"
    },
    {
      url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000&auto=format&fit=crop",
      client: "Elrow",
      category: "Atmosphere",
      year: "2023"
    }
  ];

  return (
    <section id="portfolio" className="py-20 md:py-32 bg-slate-950 border-t border-slate-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 md:mb-24 text-center">
          <span className="text-indigo-400/80 font-semibold tracking-[0.2em] uppercase text-xs">Selected Works</span>
          <h2 className="text-3xl md:text-5xl text-white mt-4 font-serif">A Visual Archive</h2>
        </div>

        {/* 
            Mobile: Horizontal Scroll Snap
            Desktop: Grid
        */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 pb-8 md:pb-0 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
          {works.map((work, idx) => (
            <div 
                key={idx} 
                className="group cursor-pointer flex-shrink-0 w-[85vw] md:w-auto snap-center"
                onClick={() => setSelectedImage(work)}
            >
              <div className="relative overflow-hidden mb-4 bg-slate-900 aspect-[3/4] rounded-sm">
                <img 
                  src={work.url} 
                  alt={work.client} 
                  className="w-full h-full object-cover transform transition-transform duration-1000 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/10 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 hidden md:flex">
                    <ZoomIn className="text-white w-8 h-8 opacity-70" />
                </div>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800 pb-2 group-hover:border-slate-600 transition-colors">
                <div>
                  <h3 className="text-lg text-slate-200 font-serif italic">{work.client}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">{work.category}</p>
                </div>
                <span className="text-xs text-slate-600 font-mono">{work.year}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 md:mt-20 text-center">
             <button className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] hover:text-white transition-colors border-b border-transparent hover:border-white pb-1 cursor-pointer">
                View Complete Archive
             </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={() => setSelectedImage(null)}
        >
            <button 
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors cursor-pointer z-50"
                onClick={() => setSelectedImage(null)}
            >
                <X className="w-8 h-8" />
            </button>

            <div 
                className="relative max-w-5xl max-h-[90vh] w-full"
                onClick={(e) => e.stopPropagation()} 
            >
                <img 
                    src={selectedImage.url} 
                    alt={selectedImage.client} 
                    className="w-full h-full object-contain max-h-[80vh] md:max-h-[85vh] shadow-2xl"
                />
                <div className="mt-4 text-center">
                    <h3 className="text-xl md:text-2xl font-serif text-white">{selectedImage.client}</h3>
                    <p className="text-indigo-400 uppercase tracking-widest text-xs mt-2">{selectedImage.category}</p>
                </div>
            </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;