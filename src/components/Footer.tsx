import React from 'react';
import { MapPin, Mail, Phone, QrCode, Play } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b2b4e] text-white pt-6 pb-12 w-full font-sans">
      {/* Top Logos & Visitor Counter */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8 flex flex-col md:flex-row justify-between items-center border-b border-blue-800 pb-6 gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-16 bg-white/10 rounded flex items-center justify-center p-1">
             <div className="w-8 h-10 border-2 border-white rounded-t-full"></div>
          </div>
          <div className="text-xs font-bold leading-tight tracking-wider uppercase">
            <span className="bg-white text-[#0b2b4e] px-1 mr-1">M</span> Ministry Of<br />
            <span className="bg-white text-[#0b2b4e] px-1 mr-1">C</span> Corporate<br />
            <span className="bg-white text-[#0b2b4e] px-1 mr-1">A</span> Affairs<br />
            <span className="text-[9px] font-normal tracking-[0.2em] text-blue-300">Government of India</span>
          </div>
        </div>

        <div className="border border-blue-400/50 bg-blue-900/40 rounded-md py-3 px-12 text-center shadow-inner">
          <p className="text-white text-sm font-bold mb-1">Total Visitors</p>
          <p className="text-orange-500 font-extrabold text-3xl tracking-widest">5,60,21,967</p>
        </div>

        <div className="flex flex-col items-end">
           <span className="text-red-500 font-extrabold text-xl tracking-tighter">BISAG-N</span>
           <div className="text-white font-extrabold text-2xl leading-none">MeitY</div>
           <div className="text-[8px] uppercase tracking-widest text-blue-200 mt-1">Engineering to Imagineering</div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 pr-4">
          <h3 className="text-orange-500 text-2xl font-bold mb-4 leading-tight">About PM Internship<br/>Scheme</h3>
          <p className="text-sm text-blue-100 leading-relaxed text-justify">
            The Prime Minister's Internship Scheme (PMIS) is part of the
            Prime Minister's package of five schemes and initiatives
            designed to facilitate employment, skilling, and other
            opportunities for India's youth. PMIS is aimed at youth
            currently not in full time employment, providing them with
            paid internship opportunities in leading companies across
            India. The objective of this scheme is to enhance the
            employability of Indian youth. The pilot phase of the scheme
            is currently underway.
          </p>
        </div>

        <div className="col-span-1">
          <h3 className="text-orange-500 text-2xl font-bold mb-4">Get to Know</h3>
          <ul className="text-sm text-blue-100 space-y-3">
            <li><a href="#" className="hover:text-white transition-colors">Benefits</a></li>
            <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Gallery</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Notifications</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Raise a ticket</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="col-span-1">
          <h3 className="text-orange-500 text-2xl font-bold mb-4 leading-tight">Download Mobile<br/>App</h3>
          <p className="text-sm text-blue-100 mb-6 leading-relaxed">
            Click the button below to download the app or scan
            the QR code with your phone.
          </p>
          <div className="inline-flex items-center gap-3 bg-[#0a1e36] border border-blue-400/40 rounded-lg p-2 pr-3 hover:bg-[#0f2a4a] transition-colors cursor-pointer">
            <div className="flex items-center gap-2 bg-black px-3 py-1.5 rounded">
               <Play size={24} className="text-green-400 fill-current" />
               <div className="flex flex-col">
                 <span className="text-[10px] text-gray-300 leading-none">GET IT ON</span>
                 <span className="text-base font-medium leading-tight text-white">Google Play</span>
               </div>
            </div>
            <div className="bg-white p-1 rounded">
               <QrCode size={40} className="text-slate-900" />
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <h3 className="text-orange-500 text-2xl font-bold mb-4">Contact Us</h3>
          <div className="text-sm text-blue-100 space-y-6">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-white mt-1 shrink-0" />
              <p className="leading-relaxed">3rd Floor, Kartavya Bhawan 1, Kartavya Path,<br/>Central Secretariat, New Delhi-110001</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-white shrink-0" />
              <a href="mailto:pminternship@mca.gov.in" className="hover:text-white">pminternship@mca.gov.in</a>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-white shrink-0" />
              <a href="mailto:pmisindustrysupport@mca.gov.in" className="hover:text-white break-all">pmisindustrysupport@mca.gov.in</a>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Phone size={20} className="text-white shrink-0" />
              <span className="text-xl text-white font-medium">1800 11 6090</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
