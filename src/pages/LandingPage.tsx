import React from 'react';
import { TopBar } from '../components/TopBar';
import { Header } from '../components/Header';
import { NavBar } from '../components/NavBar';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, UserCheck, AlertCircle } from 'lucide-react';
import { Footer } from '../components/Footer';

export const LandingPage: React.FC = () => {
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
                Learn
                <div className="relative inline-flex items-center justify-center -rotate-6 transform -translate-y-1 ml-1">
                  <div className="absolute inset-0 bg-[#ffcc00] rounded-full translate-y-[3px] translate-x-[1px]"></div>
                  <span className="relative bg-[#ff9900] text-white px-4 py-1 rounded-full text-2xl sm:text-3xl font-bold shadow-sm">
                    From
                  </span>
                </div>
              </h1>
              <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mt-1 drop-shadow-sm">
                The <span className="text-[#ffdf00]">Best</span>
              </h1>
            </div>

            <hr className="w-full max-w-[220px] border-white/40 my-5" />

            <p className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug drop-shadow-sm">
              Paid Internships in Top<br />Companies
            </p>
          </div>

          {/* Middle Content - Bounding Box Text */}
          <div className="relative z-10 w-full lg:w-[25%] flex items-center justify-center lg:justify-start p-6 lg:p-0">
            <div className="relative border border-white/60 p-5 rounded-sm transform -rotate-6 bg-white/5 backdrop-blur-sm shadow-lg max-w-[280px]">
              {/* Anchor points */}
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-white shadow-sm"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-white shadow-sm"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white shadow-sm"></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white shadow-sm"></div>

              <p className="text-white text-sm leading-relaxed text-center font-medium">
                A step towards <span className="font-extrabold">empowering</span><br />
                our youth and building a<br />
                <span className="font-extrabold">future-ready workforce</span>
              </p>

              {/* Fake cursor icon */}
              <div className="absolute -bottom-5 -right-4 w-5 h-5 text-white drop-shadow-md transform rotate-12 z-20">
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="black" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.5 3L18 13.5L12 14.5L15 21.5L11.5 22.5L8.5 15.5L4 18.5V3Z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Image Area */}
          <div className="relative w-full lg:w-[35%] h-[350px] lg:h-auto z-0 overflow-hidden rounded-r-xl flex items-end justify-center lg:justify-end">
            {/* Soft Radial Glow behind PM Modi */}
            <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white/40 rounded-full blur-[80px] pointer-events-none"></div>

            <img
              src="/pm-modi.avif"

              alt="PM Narendra Modi"
              className="w-full h-full object-cover object-bottom relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
              style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%)', maskImage: 'linear-gradient(to right, transparent, black 15%)' }}
            />
          </div>
        </div>

        {/* Companies Ticker */}
        <div className="w-full max-w-7xl mx-auto mt-6 mb-8 bg-white py-4 px-2 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 px-4 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2 text-[#103058] font-bold text-lg">
              <span className="w-[18px] h-[18px] rounded-full border-2 border-[#103058] flex items-center justify-center text-[11px] font-extrabold pb-[1px]">i</span>
              Paid internships in top companies
            </div>
            <div className="relative mt-4 sm:mt-0 w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input type="text" placeholder="Search company" className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm" />
            </div>
          </div>

          {/* Marquee Animation */}
          <div className="relative w-full flex overflow-hidden mask-image-linear-gradient">
            {/* The wrapping container must have width > 100% and animation */}
            <div className="flex whitespace-nowrap animate-marquee items-center min-w-[200%]">

              {/* Set 1 */}
              <div className="flex items-center justify-around w-1/2 px-4 gap-8">
                <img src="https://logo.clearbit.com/signify.com" alt="Signify" className="h-8 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                <img src="https://logo.clearbit.com/bajajallianz.com" alt="Bajaj Allianz" className="h-10 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                <img src="https://logo.clearbit.com/adani.com" alt="Adani" className="h-8 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                <img src="https://logo.clearbit.com/nhpcindia.com" alt="NHPC" className="h-12 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                <img src="https://logo.clearbit.com/bergerpaints.com" alt="Berger" className="h-12 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                <img src="https://logo.clearbit.com/wipro.com" alt="Wipro" className="h-10 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                <img src="https://logo.clearbit.com/tcs.com" alt="TCS" className="h-8 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>

              {/* Set 2 (Duplicate for seamless loop) */}
              <div className="flex items-center justify-around w-1/2 px-4 gap-8">
                <img src="https://logo.clearbit.com/signify.com" alt="Signify" className="h-8 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                <img src="https://logo.clearbit.com/bajajallianz.com" alt="Bajaj Allianz" className="h-10 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                <img src="https://logo.clearbit.com/adani.com" alt="Adani" className="h-8 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                <img src="https://logo.clearbit.com/nhpcindia.com" alt="NHPC" className="h-12 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                <img src="https://logo.clearbit.com/bergerpaints.com" alt="Berger" className="h-12 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                <img src="https://logo.clearbit.com/wipro.com" alt="Wipro" className="h-10 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                <img src="https://logo.clearbit.com/tcs.com" alt="TCS" className="h-8 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>

            </div>
          </div>
        </div>

        {/* Secondary Banner area */}
        <div className="w-full max-w-7xl mx-auto mt-6 rounded-3xl overflow-hidden relative bg-gradient-to-r from-[#2e1065] via-[#4c1d95] to-[#ea580c] shadow-xl py-6 px-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-4 relative z-10">
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Submit your<br />Application <span className="text-[#ffdf00]">With Ease !</span>
            </h2>
            <div className="bg-[#ffcc00] rounded-xl px-4 py-2 border-2 border-white text-[#854d0e] font-bold text-[13px] max-w-xl shadow-md">
              Financial assistance: Min. ₹9000/month | Internship duration - 6 / 9 months<br />
              | Youth between 18-25 can apply
            </div>
          </div>

          <div className="flex gap-4 sm:gap-8 items-center text-white text-sm font-semibold text-center relative z-10">
            <div className="flex flex-col items-center gap-2 max-w-[120px]">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-purple-900 border-[6px] border-[#ffcc00] shadow-lg relative">
                <Search size={28} />
                <div className="absolute -top-3 bg-white text-[10px] px-2 py-0.5 border border-gray-200 rounded-full font-bold text-gray-500 tracking-wider">SEARCH</div>
              </div>
              <span>Apply for up to<br />3 internships</span>
            </div>

            <ChevronRight size={32} className="text-[#ffdf00] shrink-0" />

            <div className="flex flex-col items-center gap-2 max-w-[120px]">
              <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-rose-500 border-[3px] border-white shadow-lg ring-2 ring-gray-200">
                <div className="w-8 h-2 bg-gray-200 rounded-sm mb-1"></div>
                <UserCheck size={20} className="mb-1 text-slate-800" />
                <div className="flex gap-1"><div className="w-3 h-1 bg-rose-500 rounded-sm"></div><div className="w-3 h-1 bg-rose-500 rounded-sm"></div></div>
              </div>
              <span>Compare internships<br />before applying</span>
            </div>

            <ChevronRight size={32} className="text-[#ffdf00] shrink-0" />

            <div className="flex flex-col items-center gap-2 max-w-[120px]">
              <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-slate-800 border-[3px] border-[#ffcc00] shadow-lg">
                <div className="w-8 h-2 bg-gray-200 rounded-sm mb-1"></div>
                <AlertCircle size={24} />
              </div>
              <span>Read disclaimers<br />carefully</span>
            </div>
          </div>

          {/* Background decorative elements for the banner */}
          <div className="absolute top-0 right-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
