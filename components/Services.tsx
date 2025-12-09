import React, { useRef, useState } from 'react';
import { ArrowRight, Globe, Image, Zap } from 'lucide-react';

const Services: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  const services = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Live Reportage",
      subtitle: "Event Photography",
      description: "Comprehensive coverage leveraging low-light mastery. We capture the VIP experience, the stage production, and the crowd energy with unobtrusive professionalism."
    },
    {
      icon: <Image className="w-8 h-8" />,
      title: "Editorial Curation",
      subtitle: "Post-Production",
      description: "Speed without compromise. We hand-select and grade images to match your venue's color palette and mood. Delivered within 24 hours for maximum social impact."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Digital Galleries",
      subtitle: "Client Experience",
      description: "Elevate your guest experience with a dedicated, branded web portal for every event. No generic drive links—just a sleek, shareable platform that drives traffic back to you."
    }
  ];

  return (
    <section id="services" className="py-20 md:py-32 bg-slate-950 relative border-t border-slate-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-20 gap-4 md:gap-8">
          <div>
            <span className="text-indigo-400/80 font-semibold tracking-[0.2em] uppercase text-xs">Our Expertise</span>
            <h2 className="text-3xl md:text-5xl text-white mt-4 font-serif italic">Services & Solutions</h2>
          </div>
          <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
            Tailored packages designed for nightlife groups, festivals, and luxury event planners.
          </p>
        </div>

        {/* Spotlight Grid Container */}
        <div 
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative grid grid-cols-1 md:grid-cols-3 gap-1 bg-slate-900/50 border border-slate-800/30 rounded-lg overflow-hidden"
        >
          {/* Spotlight Gradient Overlay - Visible mostly on Desktop */}
          <div 
            className="hidden md:block pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
            style={{
                opacity,
                background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`
            }}
          />

          {services.map((service, index) => (
            <div key={index} className="group relative bg-slate-950 p-8 md:p-12 hover:bg-slate-950/80 transition-colors duration-500 z-10 cursor-default border-b md:border-b-0 border-slate-900 last:border-0">
                {/* Spotlight Card Border Effect */}
                <div 
                    className="hidden md:block pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(255, 255, 255, 0.05), transparent 40%)`
                    }}
                />

              <div className="mb-6 md:mb-8 text-indigo-400 opacity-60 group-hover:opacity-100 transition-opacity relative z-20">
                {service.icon}
              </div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 relative z-20">{service.subtitle}</h4>
              <h3 className="text-xl md:text-2xl font-serif text-slate-100 mb-4 md:mb-6 group-hover:translate-x-2 transition-transform duration-300 relative z-20">{service.title}</h3>
              <p className="text-slate-400 leading-relaxed font-light text-sm mb-6 md:mb-8 relative z-20">
                {service.description}
              </p>
              
              <div className="md:absolute md:bottom-12 md:left-12 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 transform md:translate-y-4 md:group-hover:translate-y-0 relative z-20">
                <span className="inline-flex items-center text-xs font-bold text-white uppercase tracking-widest cursor-pointer">
                  Learn More <ArrowRight className="w-3 h-3 ml-2" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;