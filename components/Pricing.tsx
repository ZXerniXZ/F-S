import React, { useState, useRef, useEffect } from 'react';
import { Check, Sparkles, Send, Bot, Terminal } from 'lucide-react';
import { streamChat } from '../services/geminiService';

const pricingData = [
  {
    name: "Basic",
    price: "€150",
    description: "Essential coverage for intimate events.",
    features: [
      "1 Photographer",
      "Up to 2 hours coverage",
      "Selection of 30 best photos",
      "Basic post-editing (color, light)",
      "Simple public online mini-album",
      "Delivery: 7-10 days"
    ],
    highlight: false
  },
  {
    name: "Standard",
    price: "€200 - €240",
    description: "The balanced choice. Best value.",
    features: [
      "2 Photographers",
      "Full night coverage (3-4 hours)",
      "Selection of 40-60 best photos",
      "Full premium post-editing",
      "Private password-protected site",
      "HD Downloads for guests",
      "6 months hosting included",
      "Delivery: 5-7 days"
    ],
    highlight: true
  },
  {
    name: "Premium",
    price: "€320 - €380",
    description: "The ultimate brand experience.",
    features: [
      "2 Pro Photographers",
      "Extended coverage (up to 5 hours)",
      "Top 100 photos selection",
      "Advanced retouching (skin, objects)",
      "Custom branded premium website",
      "One-click full album download",
      "10 'Social-Ready' fast edits",
      "12 months hosting included",
      "Delivery: 3-5 days"
    ],
    highlight: false
  }
];

const SYSTEM_INSTRUCTION = `
You are the AI Concierge for "Federico & Simone Photography". 
Your goal is to help potential clients choose the best photography package for their event.
Be professional, concise, and have a "cool/nightlife" vibe.

Here are the packages:
1. BASIC (€150): 1 photographer, 2 hours, 30 photos, basic edit, 7-10 days delivery. Good for small parties or low budget.
2. STANDARD (€200-240): 2 photographers, 3-4 hours, 40-60 photos, full edit, private site with password, 5-7 days delivery. Best value, highly recommended.
3. PREMIUM (€320-380): 2 photographers, 5 hours, 100 photos, advanced retouching, custom branded site, 10 social-ready pics, 3-5 days delivery. VIP experience.

Ask the user about:
- Type of event?
- Duration?
- Do they need a private website?
- Budget sensitivity?

Then recommend the best package. Keep responses short (under 50 words unless explaining details).
`;

const Pricing: React.FC = () => {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: "model", text: "Hi! Not sure which package fits your vibe? Tell me about your event and I'll recommend the perfect setup." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      // Convert UI messages to API history format
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      let fullResponse = "";
      
      await streamChat(
        history, 
        userMsg, 
        (chunk) => {
          fullResponse += chunk;
          setMessages(prev => {
            const newArr = [...prev];
            // If the last message is model, update it, otherwise add new
            if (newArr[newArr.length - 1].role === "model" && newArr[newArr.length - 1].text !== history[history.length - 1]?.parts[0]?.text) {
               newArr[newArr.length - 1].text = fullResponse;
               return newArr;
            } else {
               return [...newArr, { role: "model", text: fullResponse }];
            }
          });
        },
        SYSTEM_INSTRUCTION
      );
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: "model", text: "Network glitch. Try again?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="pricing" className="py-20 md:py-32 bg-slate-950 border-t border-slate-900/50 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-24">
          <span className="text-indigo-400/80 font-semibold tracking-[0.2em] uppercase text-xs">Investment</span>
          <h2 className="text-3xl md:text-5xl text-white mt-4 font-serif">Select Your Coverage</h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20">
          {pricingData.map((pkg, idx) => (
            <div 
              key={idx} 
              className={`relative flex flex-col p-8 md:p-10 rounded-sm transition-all duration-300 group
                ${pkg.highlight 
                  ? 'bg-slate-900 border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.1)]' 
                  : 'bg-slate-950 border border-slate-800 hover:border-slate-700'
                }
              `}
            >
              {pkg.highlight && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest translate-x-2 -translate-y-2">
                  Best Value
                </div>
              )}
              
              <h3 className="text-xl font-serif text-white mb-2">{pkg.name}</h3>
              <div className="text-2xl md:text-3xl font-light text-indigo-400 mb-4">{pkg.price}</div>
              <p className="text-slate-500 text-sm mb-8 font-light min-h-[40px]">{pkg.description}</p>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {pkg.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <span className="font-light">{feat}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 text-xs font-bold uppercase tracking-widest transition-colors
                ${pkg.highlight 
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }
              `}>
                Choose {pkg.name}
              </button>
            </div>
          ))}
        </div>

        {/* AI Concierge Section */}
        <div className="max-w-4xl mx-auto mt-12">
            <div className="flex items-center gap-3 mb-4 opacity-70">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">AI Concierge</span>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 rounded-sm overflow-hidden flex flex-col md:flex-row">
                {/* Visual Side (Hidden on small mobile) */}
                <div className="hidden md:flex w-1/3 bg-slate-900 p-8 flex-col justify-between border-r border-slate-800">
                    <div>
                        <Bot className="w-8 h-8 text-slate-400 mb-4" />
                        <h4 className="text-white font-serif text-lg mb-2">Need advice?</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Our digital assistant knows every detail of our packages. Tell us about your event duration and needs.
                        </p>
                    </div>
                    <div className="text-[10px] text-slate-600 font-mono">
                        System: Online<br/>
                        Latency: 12ms
                    </div>
                </div>

                {/* Chat Interface */}
                <div className="flex-1 flex flex-col h-[400px]">
                    {/* Message Area */}
                    <div 
                        ref={scrollRef}
                        className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-hide"
                    >
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 text-sm font-light leading-relaxed rounded-sm 
                                    ${msg.role === 'user' 
                                        ? 'bg-indigo-600/20 text-indigo-100 border border-indigo-500/20' 
                                        : 'bg-slate-800/50 text-slate-300 border border-slate-700/50'
                                    }`}>
                                    {msg.role === 'model' && <Terminal className="w-3 h-3 text-indigo-400 mb-2 inline-block mr-2" />}
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800/50 p-4 rounded-sm">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-slate-900 border-t border-slate-800">
                        <form 
                            className="flex gap-2"
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        >
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Example: It's a birthday party, about 4 hours long..."
                                className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
                            />
                            <button 
                                type="submit"
                                disabled={loading}
                                className="bg-white text-slate-950 px-4 flex items-center justify-center hover:bg-indigo-50 disabled:opacity-50 transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;