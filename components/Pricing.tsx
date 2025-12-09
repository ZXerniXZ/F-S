
import React, { useState, useEffect } from 'react';
import { Check, Info, Zap, Globe, Clock, Calendar as CalendarIcon, ArrowRight, ChevronUp, ChevronDown, HelpCircle, Layout, Lock, Star, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Language } from '../types';
import { PricingTable, PricingFeature, PricingPlan } from './ui/pricing-table';

interface PricingProps {
  lang: Language;
}

// --- CONSTANTS FOR CALCULATOR ---
const RATES = {
  photographerHourly: 50,
  teamSize: 2, 
  baseIncludedPhotos: 150, 
  extraPhotoCost: 2, 
  webAlbum: {
    basic: 0,   
    private: 50, 
    premium: 150  
  },
  rushFeePercentage: 0.15, 
  travel: {
    local: 0,    // Bergamo
    region: 50,  // Lombardia
    national: 200 // Italia
  }
};

type AlbumType = 'basic' | 'private' | 'premium';
type TravelZone = 'local' | 'region' | 'national';

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  it: {
    sectionBadge: "Investimento",
    title: "Scegli la tua Esperienza",
    subtitle: "Pacchetti curati per ogni esigenza o una soluzione costruita interamente su misura.",
    tabPackages: "Pacchetti",
    tabCustom: "Crea il tuo",
    
    // Custom Calculator
    badge: "Preventivo Su Misura",
    customTitle: "Costruisci la tua Esperienza",
    customSubtitle: "Configura il pacchetto ideale. Prezzo in tempo reale.",
    dateLocTitle: "Data & Luogo",
    dateLabel: "Data Evento",
    locationLabel: "Location / Città",
    zoneLabel: "Distanza",
    zoneLocal: "Bergamo (0km)",
    zoneRegion: "Lombardia (<100km)",
    zoneNational: "Italia (>100km)",
    rushTriggered: "Tariffa Express applicata (<48h)",
    infoDate: "Seleziona la data dell'evento. Le prenotazioni effettuate con meno di 48 ore di anticipo comportano una maggiorazione del 15% per la riorganizzazione immediata del team.",
    infoLocation: "Inserisci la città. Seleziona la fascia chilometrica corretta partendo dalla nostra sede (Treviglio/Bergamo) per calcolare i costi di trasferta.",
    coverageTitle: "Durata Servizio",
    hours: "Ore di Shooting",
    teamIncluded: "Team F&S (2 Fotografi) incluso",
    infoCoverage: "Il servizio include sempre la presenza di entrambi i fotografi (Federico & Simone) per garantire la massima copertura. Il conteggio delle ore parte dall'arrivo in location.",
    visualTitle: "Quantità Foto",
    photosLabel: "Foto Consegnate",
    photosNoteIncluded: "150 incluse",
    photosNoteExtra: "+€2/extra",
    infoAssets: "Il numero di foto finali post-prodotte. 150 foto sono ideali per una serata standard. Aumenta la quantità per festival o eventi di lunga durata.",
    digitalTitle: "Esperienza Digitale",
    albumBasic: "Link Standard",
    albumBasicDesc: "Galleria pubblica semplice.",
    albumPrivate: "Area Riservata",
    albumPrivateDesc: "Password, No Watermark, HD.",
    albumPremium: "Brand Experience",
    albumPremiumDesc: "Sito dedicato con TUO logo.",
    infoAlbum: "Scegli come i tuoi ospiti vedranno le foto. 'Brand Experience' trasforma la galleria in un sito web personalizzato con il tuo logo.",
    summaryTitle: "Stima Preventivo",
    summaryShooting: "Shooting (2 Ph)",
    summaryExtraPhotos: "Foto Extra",
    summaryAlbum: "Piattaforma Web",
    summaryTravel: "Trasferta",
    summaryRush: "Supplemento Express",
    totalEstimate: "Totale Stimato",
    vatNote: "Incl. tasse. Acconto 30%",
    btnBook: "Prenota Data",
    disclaimerText: "Prezzo indicativo. Conferma finale previa verifica disponibilità.",
  },
  en: {
    sectionBadge: "Investment",
    title: "Choose Your Experience",
    subtitle: "Curated packages for every need or a fully custom tailored solution.",
    tabPackages: "Packages",
    tabCustom: "Create Your Own",

    // Custom Calculator
    badge: "Custom Quote",
    customTitle: "Build Your Experience",
    customSubtitle: "Configure your ideal package. Real-time pricing.",
    dateLocTitle: "Date & Location",
    dateLabel: "Event Date",
    locationLabel: "Location / City",
    zoneLabel: "Distance",
    zoneLocal: "Bergamo (0km)",
    zoneRegion: "Lombardy (<100km)",
    zoneNational: "Italy (>100km)",
    rushTriggered: "Express Fee applied (<48h)",
    infoDate: "Select your event date. Bookings made less than 48 hours in advance incur a 15% surcharge for immediate team reorganization.",
    infoLocation: "Enter the city. Select the correct distance range starting from our HQ (Treviglio/Bergamo) to calculate travel costs.",
    coverageTitle: "Service Duration",
    hours: "Shooting Hours",
    teamIncluded: "F&S Team (2 Photographers) included",
    infoCoverage: "The service always includes both photographers (Federico & Simone) to ensure maximum coverage. Hours count starts upon arrival at the venue.",
    visualTitle: "Photo Count",
    photosLabel: "Delivered Photos",
    photosNoteIncluded: "150 included",
    photosNoteExtra: "+€2/extra",
    infoAssets: "The number of final post-produced photos. 150 photos are ideal for a standard night. Increase the quantity for festivals or long-duration events.",
    digitalTitle: "Digital Experience",
    albumBasic: "Standard Link",
    albumBasicDesc: "Simple public gallery.",
    albumPrivate: "Private Area",
    albumPrivateDesc: "Password, No Watermark, HD.",
    albumPremium: "Brand Experience",
    albumPremiumDesc: "Dedicated site with YOUR logo.",
    infoAlbum: "Choose how your guests view photos. 'Brand Experience' turns the gallery into a custom website with your logo, perfect for maintaining brand identity.",
    summaryTitle: "Estimated Quote",
    summaryShooting: "Shooting (2 Ph)",
    summaryExtraPhotos: "Extra Photos",
    summaryAlbum: "Web Platform",
    summaryTravel: "Travel",
    summaryRush: "Rush Fee",
    totalEstimate: "Total Estimate",
    vatNote: "Incl. taxes. Deposit 30%",
    btnBook: "Book Date",
    disclaimerText: "Indicative price. Final confirmation subject to availability check.",
  }
};

// --- PACKAGES DATA ---
const getPackagesData = (lang: 'it' | 'en') => {
  const isIt = lang === 'it';
  
  const features: PricingFeature[] = [
    { 
      name: isIt ? "2 Fotografi (F&S)" : "2 Photographers (F&S)", 
      included: "starter" 
    },
    { 
      name: isIt ? "Ore di copertura" : "Coverage Hours", 
      included: "starter", 
      values: { starter: "3h", pro: "4h", all: "6h" }
    },
    { 
      name: isIt ? "Foto consegnate" : "Delivered Photos", 
      included: "starter", 
      values: { starter: "80-120", pro: "150-220", all: "250-350" }
    },
    { 
      name: isIt ? "Editing" : "Editing", 
      included: "starter", 
      values: { starter: isIt ? "Base" : "Basic", pro: isIt ? "Avanzato" : "Advanced", all: isIt ? "Editoriale" : "Editorial" }
    },
    { 
      name: isIt ? "Consegna" : "Delivery", 
      included: "starter", 
      values: { starter: "48h", pro: "24h", all: "12h" }
    },
    { 
      name: isIt ? 'Mini set "Highlights"' : 'Mini set "Highlights"', 
      included: "pro", 
      values: { starter: "—", pro: isIt ? "Opzionale" : "Optional", all: isIt ? "✔️ (entro 1h)" : "✔️ (within 1h)" }
    },
    { 
      name: isIt ? "Galleria Web" : "Web Gallery", 
      included: "starter", 
      values: { starter: "Standard", pro: "Premium", all: "Premium" }
    },
    { 
      name: isIt ? "Area Privata (pw)" : "Private Area (pw)", 
      included: "pro" 
    },
    { 
      name: isIt ? "No Watermark" : "No Watermark", 
      included: "starter" 
    },
    { 
      name: isIt ? "Sito Brandizzato" : "Branded Site", 
      included: "pro", 
      values: { starter: "—", pro: "✔️", all: isIt ? "Completo" : "Complete" }
    },
    { 
      name: isIt ? "Analisi dati" : "Data Analysis", 
      included: "pro", 
      values: { starter: "—", pro: "Base", all: isIt ? "Avanzata" : "Advanced" }
    },
    { 
      name: isIt ? "Disponibilità galleria" : "Gallery Availability", 
      included: "starter", 
      values: { starter: isIt ? "30 giorni" : "30 days", pro: isIt ? "3 mesi" : "3 months", all: isIt ? "12 mesi" : "12 months" }
    },
    { 
      name: isIt ? "Priorità date" : "Date Priority", 
      included: "all" 
    }
  ];

  const plans: PricingPlan[] = [
    {
      name: "Essential",
      level: "starter",
      price: { monthly: 350, yearly: 350 },
      description: isIt ? "Ideale per eventi privati o piccole serate club." : "Ideal for private events or small club nights.",
      popular: false
    },
    {
      name: "Pro",
      level: "pro",
      price: { monthly: 600, yearly: 600 },
      description: isIt ? "Il best-seller. Copertura completa della notte." : "The best-seller. Complete night coverage.",
      popular: true
    },
    {
      name: "Elite",
      level: "all",
      price: { monthly: 950, yearly: 950 },
      description: isIt ? "La soluzione definitiva per Festival e Brand." : "The ultimate solution for Festivals and Brands.",
      popular: false
    }
  ];

  return { features, plans };
};


const Tooltip = ({ text, active, toggle }: { text: string; active: boolean; toggle: () => void }) => {
  return (
    <div className="relative inline-block ml-2">
      <button 
        onClick={toggle}
        className={`p-1 rounded-full transition-colors ${active ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300' : 'text-slate-400 hover:text-indigo-500'}`}
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      {active && (
        <div className="absolute left-0 top-full mt-2 w-64 md:w-80 p-3 bg-slate-800 text-slate-200 text-xs rounded-lg shadow-xl z-50 leading-relaxed animate-in fade-in zoom-in-95 origin-top-left">
            {text}
        </div>
      )}
    </div>
  );
};

const Pricing: React.FC<PricingProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'custom'>('packages');
  const t = TRANSLATIONS[lang];
  const { features, plans } = getPackagesData(lang);

  // --- CALCULATOR STATE ---
  const [date, setDate] = useState<string>('');
  const [locationName, setLocationName] = useState('');
  const [travelZone, setTravelZone] = useState<TravelZone>('local');
  const [hours, setHours] = useState(3);
  const [photoCount, setPhotoCount] = useState(150);
  const [albumType, setAlbumType] = useState<AlbumType>('basic');
  const [total, setTotal] = useState(0);
  const [breakdown, setBreakdown] = useState<any>({});
  const [isRush, setIsRush] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  
  // Logic Engine for Calculator
  useEffect(() => {
    let rush = false;
    if (date) {
        const eventDate = new Date(date);
        const today = new Date();
        const diffTime = eventDate.getTime() - today.getTime();
        const diffHours = diffTime / (1000 * 3600); 
        if (diffHours < 48 && diffHours > -24) rush = true;
    }
    setIsRush(rush);

    const personnelCost = RATES.teamSize * hours * RATES.photographerHourly;
    const extraPhotos = Math.max(0, photoCount - RATES.baseIncludedPhotos);
    const assetsCost = extraPhotos * RATES.extraPhotoCost;
    const platformCost = RATES.webAlbum[albumType];
    const logisticsCost = RATES.travel[travelZone];
    
    let subtotal = personnelCost + assetsCost + platformCost + logisticsCost;
    const rushFee = rush ? subtotal * RATES.rushFeePercentage : 0;
    const finalTotal = subtotal + rushFee;

    setTotal(finalTotal);
    setBreakdown({ personnelCost, assetsCost, platformCost, logisticsCost, rushFee, subtotal });
  }, [date, hours, photoCount, albumType, travelZone]);

  const toggleTooltip = (id: string) => setActiveTooltip(activeTooltip === id ? null : id);
  const formatCurrency = (amount: number) => new Intl.NumberFormat(lang === 'it' ? 'it-IT' : 'en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);

  const BreakdownItem = ({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) => (
    <div className={`flex justify-between text-xs md:text-sm ${highlight ? 'text-indigo-600 dark:text-indigo-300 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
      <span>{label}</span>
      <span className="text-slate-800 dark:text-slate-200 font-medium">{value}</span>
    </div>
  );

  return (
    <section id="pricing" className="py-20 md:py-32 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900/50 relative pb-40 md:pb-32 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* HEADER */}
        <div className="text-center mb-8 md:mb-16">
          <span className="text-indigo-600 dark:text-indigo-400/80 font-semibold tracking-[0.2em] uppercase text-[10px] md:text-xs">{t.sectionBadge}</span>
          <h2 className="text-3xl md:text-5xl text-slate-900 dark:text-white mt-3 font-serif leading-tight">{t.title}</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 font-light text-sm md:text-base max-w-xl mx-auto hidden md:block">
            {t.subtitle}
          </p>

          {/* TAB SWITCHER */}
          <div className="flex justify-center mt-8 md:mt-12">
            <div className="p-1 bg-slate-200 dark:bg-slate-800 rounded-full flex gap-1">
                <button 
                  onClick={() => setActiveTab('packages')}
                  className={`px-4 md:px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${activeTab === 'packages' ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
                >
                  <Sparkles className="w-3 h-3" /> {t.tabPackages}
                </button>
                <button 
                  onClick={() => setActiveTab('custom')}
                  className={`px-4 md:px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${activeTab === 'custom' ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
                >
                  <SlidersHorizontal className="w-3 h-3" /> {t.tabCustom}
                </button>
            </div>
          </div>
        </div>

        {/* --- VIEW: PACKAGES --- */}
        {activeTab === 'packages' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <PricingTable 
                    features={features} 
                    plans={plans} 
                    defaultPlan="pro"
                 />
             </div>
        )}

        {/* --- VIEW: CUSTOM CALCULATOR --- */}
        {activeTab === 'custom' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
              
              {/* LEFT COL: CONFIGURATION */}
              <div className="lg:col-span-8 space-y-6 md:space-y-8">
                
                {/* 1. DATE & LOCATION */}
                <div className="bg-white dark:bg-slate-900/40 p-5 md:p-8 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm relative group hover:border-indigo-500/20 transition-all">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <CalendarIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-serif text-slate-900 dark:text-white">{t.dateLocTitle}</h3>
                        <Tooltip text={t.infoDate} active={activeTooltip === 'date'} toggle={() => toggleTooltip('date')} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.dateLabel}</label>
                            <input 
                                type="date" 
                                min={new Date().toISOString().split('T')[0]}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            />
                            {isRush && (
                                <div className="mt-2 flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-medium animate-pulse">
                                    <Zap className="w-3 h-3" /> {t.rushTriggered}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{t.locationLabel}</label>
                                <Tooltip text={t.infoLocation} active={activeTooltip === 'location'} toggle={() => toggleTooltip('location')} />
                            </div>
                          
                            <div className="space-y-3">
                                <input 
                                    type="text" 
                                    placeholder="es. Club Alcatraz, Milano"
                                    value={locationName}
                                    onChange={(e) => setLocationName(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                                />
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'local', label: t.zoneLocal },
                                        { id: 'region', label: t.zoneRegion },
                                        { id: 'national', label: t.zoneNational }
                                    ].map((zone) => (
                                        <button
                                            key={zone.id}
                                            onClick={() => setTravelZone(zone.id as TravelZone)}
                                            className={`px-2 py-2 text-[10px] uppercase font-bold tracking-wider rounded border transition-all truncate
                                                ${travelZone === zone.id 
                                                    ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-200 dark:text-slate-900' 
                                                    : 'bg-transparent text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                                                }
                                            `}
                                        >
                                            {zone.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. DURATION & QUANTITY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="bg-white dark:bg-slate-900/40 p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm relative hover:border-indigo-500/20 transition-all">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                                <Clock className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-serif text-slate-900 dark:text-white">{t.coverageTitle}</h3>
                            <Tooltip text={t.infoCoverage} active={activeTooltip === 'coverage'} toggle={() => toggleTooltip('coverage')} />
                        </div>
                        
                        <div className="flex justify-between text-xs md:text-sm mb-4">
                            <label className="text-slate-600 dark:text-slate-300 font-medium">{t.hours}</label>
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{hours}h</span>
                        </div>
                        <input 
                            type="range" min="2" max="10" step="1"
                            value={hours}
                            onChange={(e) => setHours(parseInt(e.target.value))}
                            className="w-full h-1.5 md:h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500"
                        />
                        <div className="mt-4 flex items-center gap-2 text-[10px] md:text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded border border-emerald-100 dark:border-emerald-900/30">
                            <Check className="w-3 h-3" /> {t.teamIncluded}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900/40 p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm relative hover:border-indigo-500/20 transition-all">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                                <Layout className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-serif text-slate-900 dark:text-white">{t.visualTitle}</h3>
                            <Tooltip text={t.infoAssets} active={activeTooltip === 'assets'} toggle={() => toggleTooltip('assets')} />
                        </div>

                        <div className="flex justify-between text-xs md:text-sm mb-4">
                            <label className="text-slate-600 dark:text-slate-300 font-medium">{t.photosLabel}</label>
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{photoCount}</span>
                        </div>
                        <input 
                            type="range" min="150" max="600" step="10"
                            value={photoCount}
                            onChange={(e) => setPhotoCount(parseInt(e.target.value))}
                            className="w-full h-1.5 md:h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500"
                        />
                        <div className="flex justify-between mt-3 text-[10px] text-slate-400">
                            <span>{t.photosNoteIncluded}</span>
                            <span>{t.photosNoteExtra}</span>
                        </div>
                    </div>
                </div>

                {/* 3. WEB ALBUM */}
                <div className="bg-white dark:bg-slate-900/40 p-5 md:p-8 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm relative hover:border-indigo-500/20 transition-all">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Globe className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-serif text-slate-900 dark:text-white">{t.digitalTitle}</h3>
                        <Tooltip text={t.infoAlbum} active={activeTooltip === 'album'} toggle={() => toggleTooltip('album')} />
                    </div>

                    <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory md:snap-none -mx-5 px-5 md:mx-0 md:px-0 scrollbar-hide">
                        {/* Basic */}
                        <div 
                            onClick={() => setAlbumType('basic')}
                            className={`min-w-[80vw] md:min-w-0 snap-center cursor-pointer p-4 rounded-lg border-2 transition-all duration-300 flex flex-col justify-between h-auto md:h-full relative overflow-hidden
                                ${albumType === 'basic' 
                                    ? 'bg-white dark:bg-slate-800 border-indigo-500 shadow-lg scale-[1.02]' 
                                    : 'bg-slate-50 dark:bg-slate-950/50 border-transparent hover:border-slate-300 dark:hover:border-slate-700 opacity-70 hover:opacity-100'
                                }
                            `}
                        >
                            <div>
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">{t.albumBasic}</h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{t.albumBasicDesc}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <span className="text-xs font-mono text-slate-400">FREE</span>
                                {albumType === 'basic' && <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center"><Check className="w-2 h-2 text-white" /></div>}
                            </div>
                        </div>

                        {/* Private */}
                        <div 
                            onClick={() => setAlbumType('private')}
                            className={`min-w-[80vw] md:min-w-0 snap-center cursor-pointer p-4 rounded-lg border-2 transition-all duration-300 flex flex-col justify-between h-auto md:h-full relative overflow-hidden
                                ${albumType === 'private' 
                                    ? 'bg-white dark:bg-slate-800 border-indigo-500 shadow-lg scale-[1.02]' 
                                    : 'bg-slate-50 dark:bg-slate-950/50 border-transparent hover:border-slate-300 dark:hover:border-slate-700 opacity-70 hover:opacity-100'
                                }
                            `}
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Lock className="w-3 h-3 text-indigo-500" />
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.albumPrivate}</h4>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{t.albumPrivateDesc}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <span className="text-xs font-mono text-slate-400">€{RATES.webAlbum.private}</span>
                                {albumType === 'private' && <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center"><Check className="w-2 h-2 text-white" /></div>}
                            </div>
                        </div>

                        {/* Premium */}
                        <div 
                            onClick={() => setAlbumType('premium')}
                            className={`min-w-[80vw] md:min-w-0 snap-center cursor-pointer p-4 rounded-lg border-2 transition-all duration-300 flex flex-col justify-between h-auto md:h-full relative overflow-hidden
                                ${albumType === 'premium' 
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 shadow-lg scale-[1.02]' 
                                    : 'bg-slate-50 dark:bg-slate-950/50 border-transparent hover:border-slate-300 dark:hover:border-slate-700 opacity-70 hover:opacity-100'
                                }
                            `}
                        >
                            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg">TOP</div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.albumPremium}</h4>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{t.albumPremiumDesc}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <span className="text-xs font-mono text-slate-400">€{RATES.webAlbum.premium}</span>
                                {albumType === 'premium' && <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center"><Check className="w-2 h-2 text-white" /></div>}
                            </div>
                        </div>
                    </div>
                </div>

              </div>

              {/* RIGHT COLUMN: SUMMARY PANEL */}
              <div className="hidden lg:block lg:col-span-4 relative">
                <div className="sticky top-24 bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-xl">
                  <h3 className="text-xl font-serif text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">{t.summaryTitle}</h3>
                  
                  <div className="space-y-4 mb-6">
                    <BreakdownItem label={`${t.summaryShooting} (${hours}h)`} value={formatCurrency(breakdown.personnelCost)} />
                    {breakdown.assetsCost > 0 && <BreakdownItem label={`${t.summaryExtraPhotos} (+${photoCount - RATES.baseIncludedPhotos})`} value={formatCurrency(breakdown.assetsCost)} />}
                    <BreakdownItem label={`${t.summaryAlbum} (${albumType})`} value={breakdown.platformCost === 0 ? 'Included' : formatCurrency(breakdown.platformCost)} />
                    {breakdown.logisticsCost > 0 && <BreakdownItem label={t.summaryTravel} value={formatCurrency(breakdown.logisticsCost)} />}
                    {isRush && <BreakdownItem label={t.summaryRush} value={formatCurrency(breakdown.rushFee)} highlight />}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mb-8">
                    <div className="flex justify-between items-end">
                      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-widest">{t.totalEstimate}</span>
                      <span className="text-4xl font-serif text-slate-900 dark:text-white animate-in slide-in-from-bottom-2 duration-300 key={total}">{formatCurrency(total)}</span>
                    </div>
                    <div className="text-right text-xs text-slate-500 dark:text-slate-600 mt-2">
                      {t.vatNote} {formatCurrency(total * 0.30)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold uppercase tracking-widest text-xs hover:bg-indigo-600 dark:hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 rounded-lg shadow-lg hover:shadow-indigo-500/20"
                    >
                      {t.btnBook} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="mt-6 flex items-start gap-3 text-[10px] text-slate-500 leading-relaxed">
                    <Info className="w-3 h-3 mt-0.5 shrink-0" />
                    <p>{t.disclaimerText}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* MOBILE STICKY BOTTOM BAR (Only visible for Custom tab) */}
      {activeTab === 'custom' && (
        <div 
            className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 lg:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-5px_20px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-in-out`}
        >
            {showMobileDetails && (
                <div className="bg-white dark:bg-slate-900 p-6 border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-5 max-h-[50vh] overflow-y-auto">
                    <div className="space-y-3 mb-4">
                        <BreakdownItem label={`${t.summaryShooting} (${hours}h)`} value={formatCurrency(breakdown.personnelCost)} />
                        {breakdown.assetsCost > 0 && <BreakdownItem label={t.summaryExtraPhotos} value={formatCurrency(breakdown.assetsCost)} />}
                        <BreakdownItem label={`${t.summaryAlbum} (${albumType})`} value={breakdown.platformCost === 0 ? 'Incl.' : formatCurrency(breakdown.platformCost)} />
                        {breakdown.logisticsCost > 0 && <BreakdownItem label={t.summaryTravel} value={formatCurrency(breakdown.logisticsCost)} />}
                        {isRush && <BreakdownItem label={t.summaryRush} value={formatCurrency(breakdown.rushFee)} highlight />}
                    </div>
                    <div className="text-[10px] text-slate-500 text-center border-t border-slate-100 dark:border-slate-800 pt-3">
                        {t.vatNote} {formatCurrency(total * 0.30)}
                    </div>
                </div>
            )}
            
            <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex flex-col cursor-pointer" onClick={() => setShowMobileDetails(!showMobileDetails)}>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        {t.totalEstimate} {showMobileDetails ? <ChevronDown className="w-3 h-3"/> : <ChevronUp className="w-3 h-3"/>}
                    </span>
                    <span className="text-2xl font-serif text-slate-900 dark:text-white leading-none mt-1">{formatCurrency(total)}</span>
                </div>
                <button 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold uppercase tracking-widest text-xs rounded-lg shadow-lg active:scale-95 transition-transform"
                >
                    {t.btnBook}
                </button>
            </div>
        </div>
      )}
    </section>
  );
};

export default Pricing;