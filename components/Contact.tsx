
import React from 'react';
import { Mail, ArrowUpRight } from 'lucide-react';
import { Language } from '../types';

interface ContactProps {
  lang: Language;
}

const Contact: React.FC<ContactProps> = ({ lang }) => {
  const content = {
    it: {
      title: "Collaboriamo.",
      description: "Stiamo accettando prenotazioni per la stagione 2024/2025. Fornisci i dettagli del tuo evento per una proposta su misura.",
      studio: "Studio",
      location: <>Treviglio, Italia<br/>Disponibili in tutto il Nord Italia</>,
      contact: "Contatti",
      socials: "Social",
      formName: "Nome / Azienda",
      formDate: "Data Evento",
      formEmail: "Indirizzo Email",
      formDetails: "Dettagli Progetto",
      btnSend: "Invia Richiesta"
    },
    en: {
      title: "Let's Collaborate.",
      description: "We are currently accepting bookings for the 2024/2025 season. Please provide details about your event for a tailored proposal.",
      studio: "Studio",
      location: <>Treviglio, Italy<br/>Available in Northern Italy</>,
      contact: "Contact",
      socials: "Socials",
      formName: "Name / Company",
      formDate: "Event Date",
      formEmail: "Email Address",
      formDetails: "Project Details",
      btnSend: "Send Inquiry"
    }
  };

  const t = content[lang];

  return (
    <footer id="contact" className="bg-slate-100 dark:bg-slate-950 relative pt-20 md:pt-32 pb-12 border-t border-slate-200 dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-7xl font-serif text-slate-900 dark:text-white mb-6">{t.title}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg font-light max-w-xl mx-auto">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          
          {/* Contact Info */}
          <div className="md:col-span-4 space-y-8 md:pt-8 order-2 md:order-1">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{t.studio}</h4>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-loose">
                {t.location}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{t.contact}</h4>
              <a href="mailto:navonifederico777@gmail.com" className="text-slate-700 dark:text-slate-300 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block mb-2">
                navonifederico777@gmail.com
              </a>
              <span className="text-slate-700 dark:text-slate-300 text-sm block">+39 3270934054</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{t.socials}</h4>
              <div className="flex flex-col gap-2">
                <a href="#" className="text-slate-700 dark:text-slate-300 text-sm hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 group">
                  Instagram <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
                </a>
                <a href="#" className="text-slate-700 dark:text-slate-300 text-sm hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 group">
                  LinkedIn <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-8 bg-white dark:bg-slate-900/20 p-6 md:p-12 rounded-sm border border-slate-200 dark:border-slate-800 order-1 md:order-2 shadow-sm dark:shadow-none">
            <form className="space-y-6 md:space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="group">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">{t.formName}</label>
                  <input type="text" className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 py-3 text-slate-900 dark:text-slate-200 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-colors rounded-none" />
                </div>
                <div className="group">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">{t.formDate}</label>
                  <input type="text" className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 py-3 text-slate-900 dark:text-slate-200 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-colors rounded-none" />
                </div>
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">{t.formEmail}</label>
                <input type="email" className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 py-3 text-slate-900 dark:text-slate-200 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-colors rounded-none" />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">{t.formDetails}</label>
                <textarea rows={4} className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 py-3 text-slate-900 dark:text-slate-200 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-colors resize-none rounded-none"></textarea>
              </div>
              <div className="text-right">
                <button className="w-full md:w-auto px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold uppercase tracking-widest text-xs hover:bg-indigo-600 dark:hover:bg-indigo-50 transition-colors">
                  {t.btnSend}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-200 dark:border-slate-900 text-[10px] text-slate-500 uppercase tracking-widest">
          <span>&copy; {new Date().getFullYear()} Federico & Simone</span>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-400 transition-colors">Impressum</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
