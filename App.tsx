import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Shield, 
  Phone, 
  Globe, 
  MessageSquare, 
  Info, 
  ExternalLink, 
  ChevronRight, 
  Search, 
  Filter, 
  AlertTriangle, 
  Home, 
  BookOpen, 
  Flag,
  Send,
  Loader2,
  Menu,
  X,
  CreditCard,
  UserX,
  Lock,
  MessageCircle,
  HelpCircle,
  Clock,
  LayoutDashboard,
  Zap,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Wrench,
  User,
  Activity,
  Map,
  Scale,
  Building2,
  Fingerprint,
  RefreshCcw,
  Sparkles,
  ShieldAlert,
  Newspaper,
  Cpu,
  Eye,
  Scan,
  ShieldCheck,
  Target,
  Terminal,
  Radio,
  Wifi,
  History,
  FileText,
  Share2,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Configuration & Constants ---
const REGIONS = {
  IT: {
    id: 'IT',
    name: 'Italy',
    flag: '🇮🇹',
    certName: 'ACN (Agenzia per la Cybersicurezza Nazionale)',
    certAgency: 'Polizia Postale (CNAIPIC)',
    reportingLink: 'https://www.commissariatodips.it/',
    stats: { portals: 6, helplines: 3, updates: 18, incidents: '3,240' }
  },
  LV: {
    id: 'LV',
    name: 'Latvia',
    flag: '🇱🇻',
    certName: 'National Cyber Security Centre (NCSC)',
    certAgency: 'CERT.LV (Incident Response)',
    reportingLink: 'https://latvija.gov.lv/',
    stats: { portals: 6, helplines: 4, updates: 15, incidents: '1,120' }
  }
};

const INITIAL_DATA = {
  IT: {
    helplines: [
      { id: 1, type: 'Emergency', name: 'Emergency Services', contact: '112', availability: '24/7', languages: 'Italian, English', desc: 'Immediate police intervention or physical threat.', icon: 'phone', country: 'Italy', flag: '🇮🇹' },
      { id: 2, type: 'Support', name: 'Stalking & Cyber-harassment', contact: '1522', availability: '24/7', languages: 'Italian', desc: 'Support for stalking, domestic violence, and online harassment.', icon: 'phone', country: 'Italy', flag: '🇮🇹' },
      { id: 3, type: 'Protection', name: 'Child Protection (Emergencies)', contact: '114', availability: '24/7', languages: 'Italian', desc: 'Emergency assistance for children in danger online or offline.', icon: 'phone', country: 'Italy', flag: '🇮🇹' },
      { id: 4, type: 'Consultation', name: 'Adiconsum (Consumer Support)', contact: '06 4417021', availability: 'Mon-Fri', languages: 'Italian', desc: 'Assistance for online shopping scams and consumer rights.', icon: 'wrench', country: 'Italy', flag: '🇮🇹' }
    ],
    portals: [
      { id: 'it-p1', category: 'General Cybercrime', title: 'Polizia Postale', action: 'Online Reporting Portal', url: 'https://www.commissariatodips.it/', desc: 'Primary portal for reporting scams, phishing, and general online fraud.', country: 'Italy', flag: '🇮🇹' },
      { id: 'it-p2', category: 'Technical Incidents', title: 'ACN (CSIRT Italia)', action: 'Report an Incident', url: 'https://www.csirt.gov.it/', desc: 'DDoS, malware intrusions, and attacks on critical infrastructure.', country: 'Italy', flag: '🇮🇹' },
      { id: 'it-p3', category: 'Financial Fraud', title: "Arbitro Bancario Finanziario", action: 'Complaint Portal', url: 'https://www.arbitrobancariofinanziario.it/', desc: 'Official disputes regarding unauthorized banking transactions.', country: 'Italy', flag: '🇮🇹' },
      { id: 'it-p4', category: 'Data Breach / GDPR', title: 'Garante Privacy', action: 'Data Breach Notification', url: 'https://www.garanteprivacy.it/', desc: 'Official GDPR breach notifications and privacy violations.', country: 'Italy', flag: '🇮🇹' },
      { id: 'it-p5', category: 'Identity Theft', title: 'AgID (Digital Identity)', action: 'Identity Support', url: 'https://www.agid.gov.it/', desc: 'Guidance on compromised SPID or CIE digital identities.', country: 'Italy', flag: '🇮🇹' },
      { id: 'it-p6', category: 'Content Takedown', title: 'Stop-IT (Save the Children)', action: 'Report Abuse', url: 'https://www.stop-it.it/', desc: 'Reporting child sexual abuse material (CSAM) for immediate takedown.', country: 'Italy', flag: '🇮🇹' }
    ],
    articles: [
      { 
        id: 'it-1', 
        type: 'GOVT ADVISORY', 
        title: 'New Ransomware Variant Targeting SMBs', 
        date: '2026-02-06', 
        source: 'ACN', 
        img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
        content: `A sophisticated ransomware strain, dubbed 'Hydra-IT', has been detected targeting small and medium-sized businesses across the Lombardy and Lazio regions. The attack typically begins with a highly personalized phishing email impersonating national tax authorities. Once inside the network, the malware uses advanced lateral movement techniques to compromise local backup servers before initiating encryption. 

        Mitigation Steps:
        1. Implement multi-factor authentication for all remote access points.
        2. Ensure offline backups are maintained and tested weekly.
        3. Conduct employee awareness training focusing on SPF/DKIM verification.
        4. Apply the latest security patches to all RDP and VPN infrastructure.`
      },
      { 
        id: 'it-2', 
        type: 'EDUCATIONAL', 
        title: 'Securing Your SPID Identity', 
        date: '2026-02-04', 
        source: 'CyberGuard Tips', 
        img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
        content: `The SPID (Sistema Pubblico di Identità Digitale) is a critical gateway to Italian government services. Recent reports indicate an uptick in 'credential harvesting' sites mimicking SPID login pages. This briefing outlines the essential protocols for maintaining your digital identity security.

        Core Protocols:
        - Never share your SPID credentials via SMS or WhatsApp, even if the sender claims to be 'Poste Italiane' or 'Aruba'.
        - Always use the official 'App IO' or provider-specific apps for Level 2 and Level 3 authentication.
        - Regularly check your access logs within your identity provider's dashboard to ensure no unauthorized logins have occurred.`
      },
      { 
        id: 'it-3', 
        type: 'CASE STUDY', 
        title: 'Major Botnet Dismantled in Milan Operations', 
        date: '2026-01-28', 
        source: 'Polizia Postale', 
        img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800',
        content: `In a joint operation between the Polizia Postale (CNAIPIC) and Europol, a significant botnet command-and-control (C2) infrastructure has been dismantled. The network, which consisted of over 15,000 compromised IoT devices across Italy, was primarily used for coordinated DDoS attacks against financial institutions.

        Operational Outcome:
        - 4 primary C2 servers seized in Milan data centers.
        - 2 individuals detained for questioning.
        - Identification of a previously unknown vulnerability in consumer-grade routers.
        - Release of a national 'cleaning tool' for affected ISP customers.`
      }
    ]
  },
  LV: {
    helplines: [
      { id: 101, type: 'Emergency', name: 'Emergency Services', contact: '112', availability: '24/7', languages: 'LV, EN, RU', desc: 'Immediate police intervention or physical threat.', icon: 'phone', country: 'Latvia', flag: '🇱🇻' },
      { id: 102, type: 'Technical', name: 'CERT.LV Incident Line', contact: '+371 67085888', availability: '24/7', languages: 'Latvian, English', desc: 'Technical assistance for hacking, DDoS, or system breaches.', icon: 'wrench', country: 'Latvia', flag: '🇱🇻' },
      { id: 103, type: 'Support', name: 'Drossinternets.lv', contact: '+371 27722292', availability: 'Mon-Fri', languages: 'Latvian, English', desc: 'Hotline for reporting illegal content and online harassment.', icon: 'phone', country: 'Latvia', flag: '🇱🇻' },
      { id: 104, type: 'Consumer', name: 'PTAC (Consumer Rights)', contact: '+371 65452554', availability: 'Mon-Fri', languages: 'Latvian', desc: 'Assistance for e-commerce fraud and consumer disputes.', icon: 'user', country: 'Latvia', flag: '🇱🇻' }
    ],
    portals: [
      { id: 'lv-p1', category: 'General Cybercrime', title: 'Latvija.gov.lv', action: 'Official E-Application', url: 'https://latvija.gov.lv/', desc: 'File electronic reports to the State Police for any online crime.', country: 'Latvia', flag: '🇱🇻' },
      { id: 'lv-p2', category: 'Technical Incidents', title: 'CERT.LV', action: 'Incident Report Form', url: 'https://cert.lv/en/report-incident', desc: 'Report DDoS, malware, hacking, and technical vulnerabilities.', country: 'Latvia', flag: '🇱🇻' },
      { id: 'lv-p3', category: 'Data Breach / GDPR', title: 'Data State Inspectorate', action: 'Report Breach', url: 'https://www.dvi.gov.lv/en', desc: 'Official portal for reporting personal data breaches and privacy issues.', country: 'Latvia', flag: '🇱🇻' },
      { id: 'lv-p4', category: 'Financial Fraud', title: 'Finance Latvia', action: 'Fraud Support', url: 'https://www.financelatvia.eu/en/fraud-prevention/', desc: 'Resources and reporting guidance for banking and investment fraud.', country: 'Latvia', flag: '🇱🇻' },
      { id: 'lv-p5', category: 'Content Takedown', title: 'Drossinternets.lv', action: 'Report Content', url: 'https://drossinternets.lv/en/report', desc: 'Reporting illegal content, hate speech, and child abuse material.', country: 'Latvia', flag: '🇱🇻' }
    ],
    articles: [
      { 
        id: 'lv-1', 
        type: 'HIGH-PROFILE CASE', 
        title: 'Major Crypto Fraud Ring Dismantled in Riga', 
        date: '2026-02-05', 
        source: 'Latvian Police', 
        img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800',
        content: `Latvian State Police, in coordination with the National Cyber Security Centre (NCSC), successfully conducted a raid on an unlicensed cryptocurrency exchange operation based in Riga. The ring is suspected of laundering over €2.5 million obtained through 'pig butchering' investment scams targeting Baltic citizens.

        Technical Insight:
        The group utilized advanced obfuscation techniques on the blockchain and operated multiple shell companies to funnel funds. Victims were lured through social media advertisements promising 500% weekly returns on 'AI-driven' crypto trading bots.`
      },
      { 
        id: 'lv-2', 
        type: 'GOVT ADVISORY', 
        title: 'Phishing Campaign Targeting Latvian Banking', 
        date: '2026-02-01', 
        source: 'CERT.LV', 
        img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
        content: `CERT.LV has issued an urgent warning regarding a new SMS-based phishing campaign (Smishing) targeting customers of major commercial banks in Latvia. The messages claim that the user's Smart-ID access has been blocked due to suspicious activity and provide a malicious link.

        Key Warning Signs:
        - The URL often uses '.com' or '.net' instead of the official banking '.lv' domains.
        - Messages are often sent from foreign phone numbers (+44, +380).
        - High sense of urgency ("Act within 10 minutes or lose access").`
      }
    ]
  }
};

// --- Article Reader Modal Component ---
const ArticleModal = ({ article, isOpen, onClose }: { article: any, isOpen: boolean, onClose: () => void }) => {
  if (!isOpen || !article) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      >
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={onClose}></div>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col"
        >
          <div className="p-8 md:p-12 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-1">Intelligence Briefing</p>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Reference: {article.id.toUpperCase()}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full transition-all active:scale-90">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="relative h-64 md:h-96 w-full">
              <img src={article.img} className="w-full h-full object-cover" alt={article.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-8 md:left-12 right-12">
                 <span className="bg-red-600 text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.3em] shadow-2xl mb-6 inline-block">
                  {article.type}
                </span>
                <h2 className="text-4xl md:text-6xl font-serif font-medium tracking-tighter leading-tight text-slate-900">{article.title}</h2>
              </div>
            </div>

            <div className="p-8 md:p-12 md:pt-0 pb-20">
              <div className="flex flex-wrap items-center gap-8 mb-12 border-y border-slate-100 py-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Newspaper size={20} /></div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Source Agency</p>
                    <p className="text-sm font-bold text-slate-900">{article.source}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Clock size={20} /></div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Published Date</p>
                    <p className="text-sm font-bold text-slate-900">{article.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Lock size={20} /></div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Classification</p>
                    <p className="text-sm font-bold text-emerald-600">PUBLIC ADVISORY</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <p className="text-xl md:text-2xl font-serif text-slate-700 leading-relaxed whitespace-pre-line mb-12">
                  {article.content}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 pt-12 border-t border-slate-100">
                 <button className="flex items-center justify-center space-x-3 bg-slate-900 text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all">
                   <Download size={18} />
                   <span>Download Briefing (PDF)</span>
                 </button>
                 <button className="flex items-center justify-center space-x-3 bg-slate-50 text-slate-900 border border-slate-200 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all">
                   <Share2 size={18} />
                   <span>Share Intelligence</span>
                 </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- AI ChatBot Component ---
const ChatBot = ({ region, isOpen, onClose }: { region: any, isOpen: boolean, onClose: () => void }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hello! I am your CyberGuard Assistant for ${region.name}. I can help you identify scams, find reporting portals, or guide you through a cyber incident. How can I assist you?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async () => {
    const textToSend = input.trim();
    if (!textToSend || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    setInput('');
    setIsLoading(true);
    setErrorMessage('');

    const regionData = INITIAL_DATA[region.id as keyof typeof INITIAL_DATA];
    const systemPrompt = `You are an expert Cybersecurity Victim Support Assistant for ${region.name}. 
    Local Resources: ${JSON.stringify(regionData.helplines)}. 
    Portals: ${JSON.stringify(regionData.portals)}.
    Strict Guidelines:
    1. If a physical threat is mentioned, emphasize calling 112 immediately.
    2. Provide empathetic, step-by-step guidance.
    3. Use technical but accessible language.
    4. Focus on official resources in ${region.name}.`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: textToSend }] }],
        config: {
          systemInstruction: systemPrompt,
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response");
      
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setErrorMessage("I'm having trouble connecting to my knowledge base. Please try again later or contact local emergency services if urgent.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-4 right-4 md:bottom-24 md:right-6 w-[92vw] md:w-[450px] h-[80vh] md:h-[700px] bg-white rounded-[2rem] shadow-2xl border border-slate-200 z-[100] flex flex-col overflow-hidden"
    >
      <div className="bg-slate-900 text-white p-7 flex justify-between items-center relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none scale-150 rotate-12"><Terminal size={120} /></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg"><MessageSquare size={20} className="text-white" /></div>
          <div>
            <p className="font-black text-xs uppercase tracking-[0.2em] leading-none mb-1 text-blue-400">Tactical Intel</p>
            <p className="text-lg font-serif font-medium tracking-tight">CyberGuard {region.name}</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-2.5 rounded-full transition-all active:scale-90 relative z-10"><X size={20} /></button>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-7 space-y-8 bg-slate-50/30">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn(
              "max-w-[88%] p-5 rounded-[1.75rem] text-sm leading-relaxed",
              m.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-none shadow-xl' 
                : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-sm'
            )}>
              <div className="markdown-body">
                <Markdown>{m.content}</Markdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-5 rounded-[1.75rem] rounded-tl-none flex items-center space-x-4 shadow-sm">
              <div className="flex space-x-1.5">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Consulting Secure Node...</span>
            </div>
          </div>
        )}
        {errorMessage && (
          <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-3">
            <AlertTriangle className="text-red-500 shrink-0" size={18} />
            <p className="text-xs font-bold text-red-600 uppercase tracking-tight">{errorMessage}</p>
          </div>
        )}
      </div>

      <div className="p-7 bg-white border-t border-slate-100 shrink-0">
        <div className="flex space-x-3 bg-slate-50 p-2.5 rounded-[1.5rem] border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
            placeholder="Describe your security issue..." 
            className="flex-1 text-sm bg-transparent border-none focus:ring-0 px-4 font-medium placeholder:text-slate-400 outline-none" 
          />
          <button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()} 
            className="bg-blue-600 text-white p-3.5 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Interactive Threat Scanner Component ---
const ThreatScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const scanSteps = [
    "Initializing protocol...",
    "Analyzing connection headers...",
    "Scanning for SQLi patterns...",
    "Verifying SSL/TLS certificates...",
    "Checking known phishing databases...",
    "Finalizing integrity report..."
  ];

  const startScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setProgress(0);
    setLogs([]);
    
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 8;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          setScanResult({
            score: 96,
            status: "PROTECTED",
            msg: "Your connection protocol and session parameters meet Grade-A intelligence standards."
          });
        }, 500);
      }
      setProgress(current);
      
      const stepIndex = Math.floor((current / 100) * scanSteps.length);
      if (scanSteps[stepIndex] && !logs.includes(scanSteps[stepIndex])) {
        setLogs(prev => [...prev.slice(-3), scanSteps[stepIndex]]);
      }
    }, 120);
  };

  return (
    <div className="bg-slate-900 text-white rounded-[3.5rem] p-10 md:p-16 shadow-2xl relative overflow-hidden group border border-white/5">
      <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-transform duration-[3s]"><Target size={300} /></div>
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg"><Radio size={18} className="animate-pulse" /></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Internal Integrity Diagnostic</span>
          </div>
          
          <h3 className="text-5xl md:text-7xl font-serif font-medium mb-8 tracking-tighter leading-[0.9]">Session <br /><span className="italic text-slate-400 font-normal underline decoration-blue-500/30 decoration-8 underline-offset-8">Vulnerability Check</span></h3>
          
          <p className="text-slate-400 text-xl font-medium font-serif mb-10 max-w-xl leading-relaxed">Ensure your browser environment meets the required security standards for handling sensitive intelligence.</p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {!isScanning && !scanResult && (
              <button onClick={startScan} className="w-full sm:w-auto flex items-center justify-center space-x-4 bg-white text-slate-900 px-12 py-6 rounded-[1.75rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all shadow-2xl active:scale-95">
                <span>Start Intelligence Scan</span>
                <Scan size={20} />
              </button>
            )}

            {isScanning && (
              <div className="w-full space-y-6">
                <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full transition-all duration-300 relative" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex flex-col space-y-2">
                  {logs.map((log, i) => (
                    <div key={i} className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-500 first:text-blue-400">
                      <ChevronRight size={12} />
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scanResult && (
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="flex items-center space-x-5">
                  <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-3xl border border-emerald-500/20 shadow-lg"><ShieldCheck size={40} /></div>
                  <div>
                    <p className="text-4xl font-black tracking-tighter text-emerald-400">{scanResult.status}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Security Index: {scanResult.score}/100</p>
                  </div>
                </div>
                <button onClick={() => setScanResult(null)} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white border-b border-slate-700 pb-1 transition-all">Re-Scan Node</button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-72 h-72 md:w-96 md:h-96 border-2 border-white/5 rounded-full flex items-center justify-center relative group">
            <div className="w-56 h-56 md:w-72 md:h-72 border border-white/10 rounded-full flex items-center justify-center shadow-inner relative">
               <div className="text-center relative z-10">
                 <Lock size={80} className={cn("mx-auto transition-all duration-1000", isScanning ? 'scale-125 text-blue-500 animate-pulse' : 'text-slate-700')} />
                 {isScanning && <p className="mt-6 text-xl font-serif font-medium tracking-tighter animate-pulse">{Math.round(progress)}%</p>}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [activeTab, setActiveTab] = useState('homepage');
  const [activeRegion, setActiveRegion] = useState(REGIONS.IT);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [dynamicArticles, setDynamicArticles] = useState<any[]>([]);
  const [liveThreats, setLiveThreats] = useState<string[]>([]);

  const fetchLiveIntel = async () => {
    setIsSyncing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const prompt = `Find the latest 3-4 cybersecurity news articles and active threats specifically for ${activeRegion.name} (dated late 2025 or 2026). 
      Return the data as a JSON array of objects with these properties:
      - id: string (unique)
      - type: string (e.g., 'LIVE THREAT', 'GOVT ADVISORY', 'NEWS')
      - title: string
      - date: string (YYYY-MM-DD)
      - source: string
      - img: string (use a relevant unsplash URL)
      - content: string (detailed summary)
      
      Also provide a separate list of 3-5 short "Live Threat" strings for a ticker.
      
      Format your response EXACTLY like this:
      {
        "articles": [...],
        "threats": ["threat 1", "threat 2", ...]
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        },
      });

      const data = JSON.parse(response.text || '{}');
      if (data.articles) setDynamicArticles(data.articles);
      if (data.threats) setLiveThreats(data.threats);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Failed to fetch live intel:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchLiveIntel();
  }, [activeRegion]);

  const refreshNews = async () => {
    await fetchLiveIntel();
  };

  const currentData = INITIAL_DATA[activeRegion.id as keyof typeof INITIAL_DATA];
  const sortedArticles = useMemo(() => {
    const combined = [...dynamicArticles, ...currentData.articles];
    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [currentData.articles, dynamicArticles]);
  const allHelplines = useMemo(() => [...INITIAL_DATA.IT.helplines, ...INITIAL_DATA.LV.helplines], []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Intelligence Ticker */}
      <div className="bg-slate-900 text-white py-2.5 px-6 border-b border-white/5 relative z-[60]">
        <div className="max-w-7xl mx-auto flex items-center overflow-hidden">
          <div className="flex items-center mr-10 text-blue-500 shrink-0 border-r border-white/10 pr-10">
            <Wifi size={14} className="mr-3 animate-pulse" />
            <span className="text-[9px] font-black tracking-[0.5em] uppercase">Intelligence Stream // Operational</span>
          </div>
          <div className="flex space-x-16 animate-marquee whitespace-nowrap">
            {liveThreats.length > 0 ? (
              liveThreats.map((threat, i) => (
                <span key={i} className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">
                  Live Threat: <span className="text-red-500">{threat}</span>
                </span>
              ))
            ) : (
              <>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Region Node: <span className="text-white font-black">{activeRegion.name} Verified</span></span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Active Protocol: <span className="text-emerald-400">CyberGuard v4.1</span></span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Security Threat: <span className="text-amber-500">Elevated Monitoring</span></span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Last Intel Sync: <span className="text-blue-400">{lastUpdated}</span></span>
              </>
            )}
          </div>
        </div>
      </div>

      <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[60] py-1">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4 cursor-pointer shrink-0 group" onClick={() => setActiveTab('homepage')}>
            <div className="bg-slate-900 p-2.5 rounded-[1.25rem] text-white shadow-xl group-hover:bg-blue-600 transition-colors">
              <Shield size={26} className="group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none">CyberGuard</span>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-600 mt-1">Intelligence</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-12">
            {['homepage', 'dashboard', 'resources'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={cn(
                "capitalize font-black text-[11px] uppercase tracking-[0.2em] transition-all relative",
                activeTab === tab ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
              )}>
                {tab}
                {activeTab === tab && <span className="absolute -bottom-2.5 left-0 right-0 h-1 bg-blue-600 rounded-full" />}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-slate-100 p-1.5 rounded-2xl">
              {Object.values(REGIONS).map(r => (
                <button 
                  key={r.id} 
                  onClick={() => setActiveRegion(r)}
                  className={cn(
                    "px-4 py-2 rounded-[0.85rem] text-[10px] font-black uppercase tracking-widest transition-all",
                    activeRegion.id === r.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  )}
                >
                  {r.name}
                </button>
              ))}
            </div>
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-[1.25rem] font-black text-[10px] flex items-center space-x-2 shadow-xl uppercase tracking-[0.2em] transition-all active:scale-95 group">
              <Phone size={14} className="group-hover:animate-bounce" />
              <span>Call 112</span>
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-3 text-slate-900 hover:bg-slate-100 rounded-2xl transition-colors">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="relative">
        <div className="absolute top-0 left-0 w-full h-[1000px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none -z-10"></div>

        {activeTab === 'homepage' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <section className="max-w-7xl mx-auto px-6 pt-20 lg:pt-32 pb-40 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-7 relative z-10">
                <div className="inline-flex items-center space-x-3 bg-slate-900 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-2xl">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>National Security Portal</span>
                </div>
                <h1 className="text-6xl md:text-8xl lg:text-[130px] font-serif font-medium text-slate-900 leading-[0.8] mb-12 tracking-tighter">Unified <br /> <span className="italic text-slate-400 font-normal underline decoration-blue-600/20 decoration-8 underline-offset-8">Cybercrime</span> <br /> Intelligence</h1>
                <p className="text-slate-500 text-2xl max-w-2xl mb-16 font-medium leading-relaxed font-serif">A government-standard repository for reporting protocols, localized threat intel, and expert support in Italy and Latvia.</p>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <button onClick={() => setActiveTab('dashboard')} className="w-full sm:w-auto bg-slate-900 text-white px-12 py-7 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-blue-600 transition-all active:scale-95">Access Command Center</button>
                  <button onClick={() => setIsChatOpen(true)} className="w-full sm:w-auto flex items-center justify-center space-x-4 text-slate-900 font-black text-[11px] uppercase tracking-[0.3em] px-12 py-7 rounded-[2rem] bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-xl">
                    <MessageCircle size={22} className="text-blue-600" />
                    <span>Consult Intel AI</span>
                  </button>
                </div>
              </div>
              <div className="lg:col-span-5 relative">
                <div className="rounded-[100px] overflow-hidden shadow-2xl bg-slate-900 aspect-[4/5] flex items-center justify-center p-0 group border-[12px] border-white ring-1 ring-slate-100">
                  <img src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover rounded-[88px] opacity-60 transition-transform duration-[3s]" alt="Secure Intel Grid" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-56 h-56 border-2 border-white/10 rounded-full flex items-center justify-center animate-pulse mb-12 shadow-2xl relative">
                       <Lock size={80} className="text-white" />
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl px-10 py-4 rounded-[2rem] border border-white/20 shadow-2xl">
                      <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] mb-1">Encrypted Node</p>
                      <p className="text-2xl font-serif font-medium text-blue-400 italic">verified://{activeRegion.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="max-w-7xl mx-auto px-6 py-20">
              <ThreatScanner />
            </section>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-6 py-20 animate-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-1 bg-blue-600 rounded-full"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Tactical Dashboard</span>
                </div>
                <h1 className="text-7xl md:text-9xl font-serif font-medium tracking-tighter mb-6 leading-none">Command <br /><span className="italic text-slate-400 font-normal">Center</span></h1>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-32">
              <div className="md:col-span-8 bg-white p-12 rounded-[4rem] border border-slate-100 shadow-lg relative group overflow-hidden cursor-pointer" onClick={() => setSelectedArticle(sortedArticles[0])}>
                <p className="text-[10px] font-black text-blue-600 mb-8 uppercase tracking-[0.4em]">Primary Security Alert</p>
                <h3 className="text-5xl font-serif font-medium mb-10 tracking-tighter leading-tight max-w-2xl group-hover:text-blue-600 transition-colors">{sortedArticles[0]?.title}</h3>
                <button className="flex items-center space-x-4 bg-slate-900 text-white px-10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl">
                  <span>Open Intelligence Briefing</span>
                  <ArrowRight size={18} />
                </button>
              </div>
              <div className="md:col-span-4 bg-blue-600 p-12 rounded-[4rem] text-white shadow-xl flex flex-col justify-between relative overflow-hidden group">
                <div>
                  <p className="text-[10px] font-black text-blue-200 mb-4 uppercase tracking-[0.4em]">Sector Incidents</p>
                  <p className="text-9xl font-serif font-medium tracking-tighter mb-4">{activeRegion.stats.incidents}</p>
                </div>
                <p className="text-xl font-serif font-medium italic opacity-80 leading-snug">Reports filed across {activeRegion.name} nodes this year.</p>
              </div>
            </div>
            <h2 className="text-5xl font-serif font-medium tracking-tighter mb-16 border-b border-slate-100 pb-10">Verified National Infrastructure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {currentData.portals.map((portal) => (
                <div key={portal.id} className="bg-white border border-slate-100 rounded-[3.5rem] p-12 shadow-sm hover:border-blue-500 transition-all group flex flex-col justify-between h-full relative">
                  <div className="absolute top-12 right-12"><ExternalLink size={24} className="text-slate-200 group-hover:text-blue-500 transition-colors" /></div>
                  <div>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] bg-blue-50 px-5 py-2 rounded-full border border-blue-100 mb-10 inline-block">{portal.category}</span>
                    <h3 className="text-4xl font-serif font-medium mb-6 tracking-tighter leading-tight group-hover:text-blue-600 transition-colors">{portal.title}</h3>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10 font-serif italic">{portal.desc}</p>
                  </div>
                  <a href={portal.url} target="_blank" rel="noopener noreferrer" className="w-full text-center bg-slate-900 text-white py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-2xl active:scale-95">
                    Launch Official {portal.action}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="max-w-7xl mx-auto px-6 py-20 animate-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
              <div>
                <div className="flex items-center space-x-3 mb-6 text-blue-600">
                  <BookOpen size={24} />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">Intel Depository</span>
                </div>
                <h1 className="text-7xl md:text-9xl font-serif font-medium tracking-tighter mb-6 leading-none">Intelligence <br /><span className="italic text-slate-400 font-normal">Library</span></h1>
              </div>
              <button 
                onClick={refreshNews} 
                disabled={isSyncing}
                className={cn(
                  "bg-slate-900 text-white px-10 py-6 rounded-[2rem] flex items-center space-x-4 text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl transition-all",
                  isSyncing ? 'opacity-50' : 'hover:bg-blue-600 active:scale-95'
                )}
              >
                <RefreshCcw size={18} className={isSyncing ? 'animate-spin' : ''} />
                <span>{isSyncing ? 'Synchronizing Repository...' : 'Refresh Local Intel'}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-40">
              {sortedArticles.map((art) => (
                <div key={art.id} className="group cursor-pointer" onClick={() => setSelectedArticle(art)}>
                  <div className="rounded-[4rem] overflow-hidden aspect-[16/11] mb-10 relative shadow-2xl border-[10px] border-white ring-1 ring-slate-100">
                    <img src={art.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" alt={art.title} />
                    <div className="absolute top-8 left-8">
                      <span className="bg-red-600 text-white text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-[0.3em] shadow-xl">
                        {art.type}
                      </span>
                    </div>
                  </div>
                  <div className="px-4">
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">
                      <div className="flex items-center"><Newspaper size={14} className="mr-3 text-blue-600" /> {art.source}</div>
                      <div className="flex items-center"><Clock size={14} className="mr-3" /> {art.date}</div>
                    </div>
                    <h3 className="text-4xl font-serif font-medium mb-8 leading-[1.1] group-hover:text-blue-600 transition-colors tracking-tighter">{art.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 pt-40 pb-20 text-white border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-24 mb-32">
            <div className="lg:col-span-4">
              <div className="flex items-center space-x-4 mb-12 group cursor-pointer" onClick={() => setActiveTab('homepage')}>
                <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-xl"><Shield size={36} /></div>
                <div className="flex flex-col">
                  <span className="text-4xl font-black tracking-tighter leading-none">CyberGuard</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400 mt-2">Global Intelligence Hub</span>
                </div>
              </div>
              <p className="text-slate-400 text-2xl leading-relaxed mb-16 font-serif italic font-medium">Verified national resources for cybercrime resilience in Italy and Latvia.</p>
            </div>
            <div className="lg:col-span-2">
              <h4 className="font-black text-[10px] uppercase tracking-[0.5em] text-blue-400 mb-12">NAVIGATION</h4>
              <ul className="space-y-8 text-xl font-serif font-medium">
                {['Homepage', 'Dashboard', 'Resources'].map(item => (
                  <li key={item} onClick={() => setActiveTab(item.toLowerCase())} className="cursor-pointer hover:text-blue-400 transition-colors">{item}</li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-6">
              <div className="bg-white/5 border border-white/10 p-12 rounded-[4rem] shadow-2xl relative group overflow-hidden">
                <div className="flex items-center justify-between mb-12">
                   <div className="flex items-center space-x-4">
                     <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                     <span className="text-[11px] font-black uppercase tracking-[0.4em] text-red-500">Global Emergency Hub</span>
                   </div>
                </div>
                <div className="bg-red-600 text-white py-8 rounded-[2.5rem] text-8xl md:text-[120px] font-black mb-10 tracking-tighter shadow-2xl text-center">112</div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-10 right-10 w-24 h-24 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all z-[90] group border border-white/10"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-transparent opacity-60 rounded-[2.5rem]"></div>
        {isChatOpen ? <X size={36} className="relative z-10" /> : <MessageCircle size={36} className="relative z-10" />}
      </button>

      <ArticleModal 
        article={selectedArticle} 
        isOpen={!!selectedArticle} 
        onClose={() => setSelectedArticle(null)} 
      />
      <ChatBot region={activeRegion} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
