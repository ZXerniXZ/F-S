import React, { useState, useEffect, useRef } from 'react';
import { Check, Info, Zap, Globe, Clock, Camera, AlertTriangle, Download, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';
import { Language } from '../types';

interface PricingProps {
  lang: Language;
}

// --- BUSINESS LOGIC & RATES ---
const RATES = {
  photographerHourly: 50, // € per hour
  minHours: 2,
  baseIncludedPhotos: 150, 
  extraPhotoCost: 2, // € per extra photo
  webAlbum: {
    basic: 0,   
    private: 30, 
    premium: 90  
  },
  rushFeePercentage: 0.15, 
  travel: {
    local: 0,    // Bergamo
    region: 40,  // Lombardia
    national: 120 // Italia
  }
};

type AlbumType = 'basic' | 'private' | 'premium';
type TravelZone = 'local' | 'region' | 'national';

const TRANSLATIONS = {
  it: {
    badge: "Preventivo Su Misura",
    title: "Costruisci la tua Esperienza",
    subtitle: "Configura il pacchetto ideale. Prezzo in tempo reale.",
    coverageTitle: "Staff & Durata",
    photographers: "Fotografi",
    photographersDesc1: "< 100 ospiti",
    photographersDesc2: "> 100 ospiti",
    duration: "Durata",
    hours: "Ore",
    minHours: "Min. 2 ore",
    visualTitle: "Foto & Edit",
    photosLabel: "Quantità Foto",
    photosCount: "Foto",
    photosNoteIncluded: "150 incluse",
    photosNoteExtra: "+€2/extra",
    digitalTitle: "Web Album",
    albumBasic: "Basic",
    albumBasicPrice: "Incluso",
    albumBasicDesc: "Link pubblico, no password.",
    albumPrivate: "Privato",
    albumPrivateDesc: "Password, no watermark.",
    albumPremium: "Premium",
    albumPremiumDesc: "Brandizzato + Download Social.",
    rushTitle: "Express 48h",
    rushDesc: "+15% sul totale",
    travelTitle: "Trasferta",
    travelLocal: "Bergamo (Gratis)",
    travelRegion: "Lombardia (€40)",
    travelNational: "Italia (€120)",
    summaryTitle: "Stima Preventivo",
    summaryShooting: "Shooting",
    summaryExtraPhotos: "Foto Extra",
    summaryAlbum: "Album Web",
    summaryTravel: "Trasferta",
    summaryRush: "Supplemento Express",
    totalEstimate: "Totale Stimato",
    vatNote: "Incl. tasse. Acconto 30%",
    btnBook: "Prenota",
    btnPdf: "Scarica PDF",
    disclaimerTitle: "Nota Importante",
    disclaimerText: "Prezzo indicativo. Conferma finale previa verifica disponibilità.",
    showDetails: "Vedi Dettagli",
    hideDetails: "Nascondi Dettagli",
    units: "unità"
  },
  en: {
    badge: "Custom Quote",
    title: "Build Your Experience",
    subtitle: "Configure your ideal package. Real-time pricing.",
    coverageTitle: "Staff & Time",
    photographers: "Photographers",
    photographersDesc1: "< 100 guests",
    photographersDesc2: "> 100 guests",
    duration: "Duration",
    hours: "Hours",
    minHours: "Min. 2 hours",
    visualTitle: "Photos & Edit",
    photosLabel: "Photo Count",
    photosCount: "Photos",
    photosNoteIncluded: "150 included",
    photosNoteExtra: "+€2/extra",
    digitalTitle: "Web Album",
    albumBasic: "Basic",
    albumBasicPrice: "Included",
    albumBasicDesc: "Public link, no password.",
    albumPrivate: "Private",
    albumPrivateDesc: "Password, no watermark.",
    albumPremium: "Premium",
    albumPremiumDesc: "Branded + Social Download.",
    rushTitle: "Express 48h",
    rushDesc: "+15% on total",
    travelTitle: "Travel Zone",
    travelLocal: "Bergamo (Free)",
    travelRegion: "Lombardy (€40)",
    travelNational: "Italy (€120)",
    summaryTitle: "Estimated Quote",
    summaryShooting: "Shooting",
    summaryExtraPhotos: "Extra Photos",
    summaryAlbum: "Web Album",
    summaryTravel: "Travel",
    summaryRush: "Rush Fee",
    totalEstimate: "Total Estimate",
    vatNote: "Incl. taxes. Deposit 30%",
    btnBook: "Book Now",
    btnPdf: "Download PDF",
    disclaimerTitle: "Important Note",
    disclaimerText: "Indicative price. Final confirmation subject to availability check.",
    showDetails: "Show Details",
    hideDetails: "Hide Details",
    units: "units"
  }
};

const Pricing: React.FC<PricingProps> = ({ lang }) => {
  // --- STATE ---
  const [photographers, setPhotographers] = useState(1);
  const [hours, setHours] = useState(3);
  const [photoCount, setPhotoCount] = useState(150);
  const [albumType, setAlbumType] = useState<AlbumType>('basic');
  const [isRush, setIsRush] = useState(false);
  const [travelZone, setTravelZone] = useState<TravelZone>('local');
  const [total, setTotal] = useState(0);
  const [breakdown, setBreakdown] = useState<any>({});
  
  // Mobile UI State
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const t = TRANSLATIONS[lang];

  // --- INTERSECTION OBSERVER ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0, // Trigger as soon as any part is visible
        rootMargin: "-20px" // Slight offset to ensure smoother transition
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // --- CALCULATION ENGINE ---
  useEffect(() => {
    const personnelCost = photographers * hours * RATES.photographerHourly;
    const extraPhotos = Math.max(0, photoCount - RATES.baseIncludedPhotos);
    const assetsCost = extraPhotos * RATES.extraPhotoCost;
    const platformCost = RATES.webAlbum[albumType];
    const logisticsCost = RATES.travel[travelZone];
    let subtotal = personnelCost + assetsCost + platformCost + logisticsCost;
    const rushFee = isRush ? subtotal * RATES.rushFeePercentage : 0;
    const finalTotal = subtotal + rushFee;

    setTotal(finalTotal);
    setBreakdown({ personnelCost, assetsCost, platformCost, logisticsCost, rushFee, subtotal });
  }, [photographers, hours, photoCount, albumType, isRush, travelZone]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === 'it' ? 'it-IT' : 'en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
  };

  // --- RENDER HELPERS ---
  const BreakdownItem = ({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) => (
    <div className={`flex justify-between text-xs md:text-sm ${highlight ? 'text-indigo-300' : 'text-slate-400'}`}>
      <span>{label}</span>
      <span className="text-slate-200">{value}</span>
    </div>
  );

  return (
    <section ref={sectionRef} id="pricing" className="py-20 md:py-32 bg-slate-950 border-t border-slate-900/50 relative pb-32 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* HEADER */}
        <div className="text-center mb-10 md:mb-16">
          <span className="text-indigo-400/80 font-semibold tracking-[0.2em] uppercase text-[10px] md:text-xs">{t.badge}</span>
          <h2 className="text-3xl md:text-5xl text-white mt-3 font-serif leading-tight">{t.title}</h2>
          <p className="text-slate-400 mt-3 font-light text-sm md:text-base max-w-xl mx-auto hidden md:block">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* CONTROLS (Left Col) */}
          <div className="lg:col-span-8 space-y-4 md:space-y-6">
            
            {/* 1. COVERAGE (Condensed Mobile) */}
            <div className="bg-slate-900/20 p-5 md:p-8 rounded-sm border border-slate-800">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="text-indigo-400 w-4 h-4 md:w-5 md:h-5" />
                <h3 className="text-base md:text-lg font-serif text-white">{t.coverageTitle}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 md:gap-10">
                {/* Photographers */}
                <div>
                  <div className="flex justify-between text-xs md:text-sm mb-3">
                    <label className="text-slate-300 font-medium">{t.photographers}</label>
                    <span className="text-indigo-400 font-bold">{photographers}</span>
                  </div>
                  <input 
                    type="range" min="1" max="3" step="1"
                    value={photographers}
                    onChange={(e) => setPhotographers(parseInt(e.target.value))}
                    className="w-full h-1.5 md:h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-2">
                    {photographers === 1 ? t.photographersDesc1 : t.photographersDesc2}
                  </p>
                </div>

                {/* Hours */}
                <div>
                  <div className="flex justify-between text-xs md:text-sm mb-3">
                    <label className="text-slate-300 font-medium">{t.duration}</label>
                    <span className="text-indigo-400 font-bold">{hours}h</span>
                  </div>
                  <input 
                    type="range" min="2" max="10" step="1"
                    value={hours}
                    onChange={(e) => setHours(parseInt(e.target.value))}
                    className="w-full h-1.5 md:h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-2">{t.minHours}</p>
                </div>
              </div>
            </div>

            {/* 2. ASSETS */}
            <div className="bg-slate-900/20 p-5 md:p-8 rounded-sm border border-slate-800">
              <div className="flex items-center gap-2 mb-6">
                <Camera className="text-indigo-400 w-4 h-4 md:w-5 md:h-5" />
                <h3 className="text-base md:text-lg font-serif text-white">{t.visualTitle}</h3>
              </div>
              <div>
                <div className="flex justify-between text-xs md:text-sm mb-3">
                  <label className="text-slate-300 font-medium">{t.photosLabel}</label>
                  <span className="text-indigo-400 font-bold">{photoCount}</span>
                </div>
                <input 
                  type="range" min="150" max="500" step="10"
                  value={photoCount}
                  onChange={(e) => setPhotoCount(parseInt(e.target.value))}
                  className="w-full h-1.5 md:h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between mt-2 text-[10px] md:text-xs text-slate-500">
                  <span>{t.photosNoteIncluded}</span>
                  <span>{t.photosNoteExtra}</span>
                </div>
              </div>
            </div>

            {/* 3. DIGITAL (Compact Grid) */}
            <div className="bg-slate-900/20 p-5 md:p-8 rounded-sm border border-slate-800">
              <div className="flex items-center gap-2 mb-6">
                <Globe className="text-indigo-400 w-4 h-4 md:w-5 md:h-5" />
                <h3 className="text-base md:text-lg font-serif text-white">{t.digitalTitle}</h3>
              </div>

              <div className="flex flex-col md:grid md:grid-cols-3 gap-3">
                {[
                    { type: 'basic', label: t.albumBasic, price: t.albumBasicPrice, desc: t.albumBasicDesc },
                    { type: 'private', label: t.albumPrivate, price: `€${RATES.webAlbum.private}`, desc: t.albumPrivateDesc },
                    { type: 'premium', label: t.albumPremium, price: `€${RATES.webAlbum.premium}`, desc: t.albumPremiumDesc }
                ].map((option) => (
                    <div 
                        key={option.type}
                        onClick={() => setAlbumType(option.type as AlbumType)}
                        className={`cursor-pointer p-3 md:p-4 border rounded-sm transition-all relative
                            ${albumType === option.type ? 'bg-indigo-900/20 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.15)]' : 'bg-slate-950/50 border-slate-800'}
                        `}
                    >
                        <div className="flex justify-between items-center md:items-start md:flex-col md:mb-2">
                            <span className={`text-xs md:text-sm font-bold uppercase tracking-wider ${albumType === option.type ? 'text-indigo-400' : 'text-slate-400'}`}>
                                {option.label}
                            </span>
                            <span className="text-sm md:text-lg font-light text-white md:mt-1">{option.price}</span>
                        </div>
                        {/* Description - Hidden on mobile unless selected for space */}
                        <p className={`text-[10px] md:text-xs text-slate-500 leading-tight mt-1 md:mt-0 ${albumType === option.type ? 'block' : 'hidden md:block'}`}>
                            {option.desc}
                        </p>
                    </div>
                ))}
              </div>
            </div>

            {/* 4. EXTRAS & TRAVEL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
               <div 
                  onClick={() => setIsRush(!isRush)}
                  className={`cursor-pointer flex items-center justify-between p-4 md:p-6 rounded-sm border transition-all ${isRush ? 'bg-indigo-900/20 border-indigo-500' : 'bg-slate-900/20 border-slate-800'}`}
                >
                  <div className="flex items-center gap-3">
                    <Zap className={`w-4 h-4 md:w-5 md:h-5 ${isRush ? 'text-indigo-400' : 'text-slate-600'}`} />
                    <div>
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">{t.rushTitle}</h4>
                      <p className="text-[10px] md:text-xs text-slate-500">{t.rushDesc}</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isRush ? 'border-indigo-500 bg-indigo-500' : 'border-slate-600'}`}>
                    {isRush && <Check className="w-3 h-3 text-white" />}
                  </div>
               </div>

               <div className="bg-slate-900/20 p-4 md:p-6 rounded-sm border border-slate-800">
                  <div className="flex items-center gap-2 mb-2 md:mb-4">
                    <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">{t.travelTitle}</h4>
                  </div>
                  <select 
                    value={travelZone}
                    onChange={(e) => setTravelZone(e.target.value as TravelZone)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-300 text-xs md:text-sm p-2 rounded-sm outline-none focus:border-indigo-500"
                  >
                    <option value="local">{t.travelLocal}</option>
                    <option value="region">{t.travelRegion}</option>
                    <option value="national">{t.travelNational}</option>
                  </select>
               </div>
            </div>
            
            {/* MOBILE ONLY: Disclaimer inline */}
            <div className="md:hidden mt-6 flex items-start gap-3 p-4 bg-red-950/10 rounded-sm border border-red-900/20">
                <AlertTriangle className="w-4 h-4 text-red-400/80 mt-0.5 shrink-0" />
                <p className="text-[10px] text-red-200/60 leading-relaxed">{t.disclaimerText}</p>
            </div>

          </div>

          {/* RIGHT COLUMN: DESKTOP SUMMARY (Hidden on Mobile) */}
          <div className="hidden lg:block lg:col-span-4 relative">
            <div className="sticky top-24 bg-slate-900 border border-slate-800 rounded-sm p-8 shadow-2xl">
              <h3 className="text-xl font-serif text-white mb-6 border-b border-slate-800 pb-4">{t.summaryTitle}</h3>
              
              <div className="space-y-4 mb-6">
                <BreakdownItem label={`${t.summaryShooting} (${hours}h x ${photographers})`} value={formatCurrency(breakdown.personnelCost)} />
                {breakdown.assetsCost > 0 && <BreakdownItem label={`${t.summaryExtraPhotos} (+${photoCount - RATES.baseIncludedPhotos})`} value={formatCurrency(breakdown.assetsCost)} />}
                <BreakdownItem label={`${t.summaryAlbum} (${albumType})`} value={breakdown.platformCost === 0 ? 'Included' : formatCurrency(breakdown.platformCost)} />
                {breakdown.logisticsCost > 0 && <BreakdownItem label={t.summaryTravel} value={formatCurrency(breakdown.logisticsCost)} />}
                {isRush && <BreakdownItem label={t.summaryRush} value={formatCurrency(breakdown.rushFee)} highlight />}
              </div>

              <div className="border-t border-slate-800 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-slate-400 text-sm font-medium uppercase tracking-widest">{t.totalEstimate}</span>
                  <span className="text-4xl font-serif text-white">{formatCurrency(total)}</span>
                </div>
                <div className="text-right text-xs text-slate-600 mt-2">
                  {t.vatNote} {formatCurrency(total * 0.30)}
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full py-4 bg-white text-slate-950 font-bold uppercase tracking-widest text-xs hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
                  {t.btnBook} <ArrowRight className="w-4 h-4" />
                </button>
                <button className="w-full py-4 border border-slate-700 text-slate-300 font-bold uppercase tracking-widest text-xs hover:border-white hover:text-white transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> {t.btnPdf}
                </button>
              </div>
              
              <div className="mt-6 flex items-start gap-3 text-[10px] text-slate-500">
                 <Info className="w-3 h-3 mt-0.5 shrink-0" />
                 <p>{t.disclaimerText}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 lg:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-in-out ${isSectionVisible ? 'translate-y-0' : 'translate-y-full'}`}
      >
         {/* Dropdown Details */}
         {showMobileDetails && (
             <div className="bg-slate-900 p-6 border-b border-slate-800 animate-in slide-in-from-bottom-5">
                 <div className="space-y-3 mb-4">
                    <BreakdownItem label={`${t.summaryShooting} (${photographers}p, ${hours}h)`} value={formatCurrency(breakdown.personnelCost)} />
                    {breakdown.assetsCost > 0 && <BreakdownItem label={t.summaryExtraPhotos} value={formatCurrency(breakdown.assetsCost)} />}
                    <BreakdownItem label={`${t.summaryAlbum} (${albumType})`} value={breakdown.platformCost === 0 ? 'Incl.' : formatCurrency(breakdown.platformCost)} />
                    {breakdown.logisticsCost > 0 && <BreakdownItem label={t.summaryTravel} value={formatCurrency(breakdown.logisticsCost)} />}
                    {isRush && <BreakdownItem label={t.summaryRush} value={formatCurrency(breakdown.rushFee)} highlight />}
                 </div>
                 <div className="text-[10px] text-slate-500 text-center border-t border-slate-800 pt-3">
                    {t.vatNote} {formatCurrency(total * 0.30)}
                 </div>
             </div>
         )}
         
         <div className="p-4 flex items-center justify-between gap-4">
            <div className="flex flex-col cursor-pointer" onClick={() => setShowMobileDetails(!showMobileDetails)}>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    {t.totalEstimate} {showMobileDetails ? <ChevronDown className="w-3 h-3"/> : <ChevronUp className="w-3 h-3"/>}
                </span>
                <span className="text-2xl font-serif text-white leading-none mt-1">{formatCurrency(total)}</span>
            </div>
            <button className="px-6 py-3 bg-white text-slate-950 font-bold uppercase tracking-widest text-xs rounded-sm shadow-lg active:scale-95 transition-transform">
                {t.btnBook}
            </button>
         </div>
      </div>
    </section>
  );
};

export default Pricing;