import React, { useState } from 'react';
import { TopBar } from '../components/TopBar';
import { Header } from '../components/Header';
import { NavBar } from '../components/NavBar';
import { Search, ChevronRight, UserCheck, AlertCircle } from 'lucide-react';
import { Footer } from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

// Company list with logo.dev domain + brand color fallback
const companies: { name: string; domain: string; abbr: string; color: string }[] = [
  { name: 'Tech Mahindra', domain: 'techmahindra.com', abbr: 'TM', color: '#E31837' },
  { name: 'Wipro', domain: 'wipro.com', abbr: 'WI', color: '#341F97' },
  { name: 'TCS', domain: 'tcs.com', abbr: 'TCS', color: '#000' },
  { name: 'Infosys', domain: 'infosys.com', abbr: 'IN', color: '#007CC3' },
  { name: 'HCL Technologies', domain: 'hcltech.com', abbr: 'HCL', color: '#0076CE' },
  { name: 'Bajaj Allianz', domain: 'bajajallianz.com', abbr: 'BA', color: '#003399' },
  { name: 'Adani Group', domain: 'adani.com', abbr: 'AD', color: '#00529B' },
  { name: 'Berger Paints', domain: 'bergerpaints.com', abbr: 'BP', color: '#E31837' },
  { name: 'NHPC', domain: 'nhpcindia.com', abbr: 'NH', color: '#006400' },
  { name: 'Signify', domain: 'signify.com', abbr: 'SG', color: '#00A1D6' },
  { name: 'L&T', domain: 'larsentoubro.com', abbr: 'L&T', color: '#1A3C6E' },
  { name: 'HDFC Bank', domain: 'hdfcbank.com', abbr: 'HDF', color: '#00408B' },
  { name: 'Maruti Suzuki', domain: 'marutisuzuki.com', abbr: 'MS', color: '#C00' },
  { name: 'Tata Motors', domain: 'tatamotors.com', abbr: 'TATA', color: '#003399' },
  { name: 'Mahindra', domain: 'mahindra.com', abbr: 'MH', color: '#D5001C' },
  { name: 'Reliance', domain: 'ril.com', abbr: 'RI', color: '#003399' },
];

const CompanyLogo: React.FC<{ name: string; domain: string; abbr: string; color: string }> = ({ name, domain, abbr, color }) => {
  const [iconFailed, setIconFailed] = useState(false);

  // Google's favicon service — always free, always works, no API key needed
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  return (
    <div className="flex items-center gap-3 shrink-0 px-5 h-16 hover:opacity-80 transition-opacity duration-200 group">
      {/* Icon area */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-gray-100 bg-white shadow-sm"
        style={{ minWidth: 40 }}
      >
        {!iconFailed ? (
          <img
            src={faviconUrl}
            alt={name}
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
            onError={() => setIconFailed(true)}
          />
        ) : (
          <span
            className="text-white font-extrabold text-[9px] text-center leading-tight px-0.5"
            style={{ backgroundColor: color }}
          >
            {abbr}
          </span>
        )}
      </div>
      {/* Company name */}
      <span className="text-[13px] font-semibold text-gray-700 whitespace-nowrap leading-tight group-hover:text-gray-900 transition-colors">
        {name}
      </span>
    </div>
  );
};

// Vertical divider between logos
const Divider = () => <div className="w-px h-9 bg-gray-200 shrink-0 self-center" />;

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <TopBar />
      <Header />
      <NavBar />

      {/* Hero Section */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto rounded-xl overflow-hidden relative bg-[#2a55e5] shadow-xl flex flex-col lg:flex-row min-h-[450px]">

          {/* Modi Blurred Background Overlay */}
          <div className="absolute inset-0 z-0 opacity-30 blur-[12px] mix-blend-overlay" style={{ backgroundImage: "url('/pm-modi.avif')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>

          {/* Left Content Area */}
          <div className="relative z-10 w-full lg:w-[40%] p-8 sm:p-12 lg:pl-16 flex flex-col justify-center">
            <div className="flex flex-col mb-4 relative z-10">
              <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-[1.1] tracking-tight flex items-center gap-3">
                {t('landing.learn')}
                <div className="relative inline-flex items-center justify-center -rotate-6 transform -translate-y-1 ml-1">
                  <div className="absolute inset-0 bg-[#ffcc00] rounded-full translate-y-[3px] translate-x-[1px]"></div>
                  <span className="relative bg-[#ff9900] text-white px-4 py-1 rounded-full text-2xl sm:text-3xl font-bold shadow-sm">
                    {t('landing.from')}
                  </span>
                </div>
              </h1>
              <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mt-1 drop-shadow-sm">
                {t('landing.the')} <span className="text-[#ffdf00]">{t('landing.best')}</span>
              </h1>
            </div>

            <hr className="w-full max-w-[220px] border-white/40 my-5" />

            <p className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug drop-shadow-sm whitespace-pre-line">
              {t('landing.paidTop')}
            </p>
          </div>

          {/* Middle Content - Bounding Box Text */}
          <div className="relative z-10 w-full lg:w-[25%] flex items-center justify-center lg:justify-start p-6 lg:p-0">
            <div className="relative border border-white/60 p-5 rounded-sm transform -rotate-6 bg-white/5 backdrop-blur-sm shadow-lg max-w-[280px]">
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-white shadow-sm"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-white shadow-sm"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white shadow-sm"></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white shadow-sm"></div>

              <p className="text-white text-sm leading-relaxed text-center font-medium whitespace-pre-line">
                {t('landing.step')}
              </p>

              <div className="absolute -bottom-5 -right-4 w-5 h-5 text-white drop-shadow-md transform rotate-12 z-20">
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="black" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.5 3L18 13.5L12 14.5L15 21.5L11.5 22.5L8.5 15.5L4 18.5V3Z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Image Area */}
          <div className="relative w-full lg:w-[35%] h-[350px] lg:h-auto z-0 overflow-hidden rounded-r-xl flex items-end justify-center lg:justify-end">
            <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white/40 rounded-full blur-[80px] pointer-events-none"></div>
            <img
              src="/pm-modi.avif"
              alt="PM Narendra Modi"
              className="w-full h-full object-cover object-bottom relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
              style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%)', maskImage: 'linear-gradient(to right, transparent, black 15%)' }}
            />
          </div>
        </div>

        {/* ── Companies Ticker ── */}
        <div className="w-full max-w-7xl mx-auto mt-6 mb-8 bg-white border border-gray-100 shadow-sm">

          {/* Header row */}
          <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 text-[#103058] font-bold text-sm">
              <span className="w-[16px] h-[16px] rounded-full border-2 border-[#103058] flex items-center justify-center text-[10px] font-extrabold">i</span>
              {t('landing.paidTopRow')}
            </div>
            <div className="relative mt-3 sm:mt-0 w-full sm:w-56">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={14} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('landing.searchComp')}
                className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
              />
            </div>
          </div>

          {/* Scrolling logos strip — exactly like the reference image */}
          <div
            className="relative w-full overflow-hidden py-3"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
            }}
          >
            <div
              className="flex items-center animate-marquee"
              style={{ width: 'max-content' }}
            >
              {/* Set 1 */}
              {companies.map((c, i) => (
                <React.Fragment key={`a-${i}`}>
                  <CompanyLogo {...c} />
                  <Divider />
                </React.Fragment>
              ))}
              {/* Set 2 — duplicate for seamless loop */}
              {companies.map((c, i) => (
                <React.Fragment key={`b-${i}`}>
                  <CompanyLogo {...c} />
                  <Divider />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Secondary Banner area */}
        <div className="w-full max-w-7xl mx-auto mt-6 rounded-3xl overflow-hidden relative bg-gradient-to-r from-[#2e1065] via-[#4c1d95] to-[#ea580c] shadow-xl py-6 px-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-4 relative z-10">
            <h2 className="text-4xl font-extrabold text-white leading-tight whitespace-pre-line">
              {t('landing.submit')} <span className="text-[#ffdf00]">{t('landing.withEase')}</span>
            </h2>
            <div className="bg-[#ffcc00] rounded-xl px-4 py-2 border-2 border-white text-[#854d0e] font-bold text-[13px] max-w-xl shadow-md whitespace-pre-line">
              {t('landing.financeAssistance')}
            </div>
          </div>

          <div className="flex gap-4 sm:gap-8 items-center text-white text-sm font-semibold text-center relative z-10">
            <div className="flex flex-col items-center gap-2 max-w-[120px]">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-purple-900 border-[6px] border-[#ffcc00] shadow-lg relative">
                <Search size={28} />
                <div className="absolute -top-3 bg-white text-[10px] px-2 py-0.5 border border-gray-200 rounded-full font-bold text-gray-500 tracking-wider">{t('landing.search')}</div>
              </div>
              <span className="whitespace-pre-line">{t('landing.applyUpTo')}</span>
            </div>

            <ChevronRight size={32} className="text-[#ffdf00] shrink-0" />

            <div className="flex flex-col items-center gap-2 max-w-[120px]">
              <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-rose-500 border-[3px] border-white shadow-lg ring-2 ring-gray-200">
                <div className="w-8 h-2 bg-gray-200 rounded-sm mb-1"></div>
                <UserCheck size={20} className="mb-1 text-slate-800" />
                <div className="flex gap-1">
                  <div className="w-3 h-1 bg-rose-500 rounded-sm"></div>
                  <div className="w-3 h-1 bg-rose-500 rounded-sm"></div>
                </div>
              </div>
              <span className="whitespace-pre-line">{t('landing.compare')}</span>
            </div>

            <ChevronRight size={32} className="text-[#ffdf00] shrink-0" />

            <div className="flex flex-col items-center gap-2 max-w-[120px]">
              <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-slate-800 border-[3px] border-[#ffcc00] shadow-lg">
                <div className="w-8 h-2 bg-gray-200 rounded-sm mb-1"></div>
                <AlertCircle size={24} />
              </div>
              <span className="whitespace-pre-line">{t('landing.read')}</span>
            </div>
          </div>

          {/* Background decorative elements */}
          <div className="absolute top-0 right-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
