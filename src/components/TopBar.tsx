import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TopBar: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="bg-[#1a1a1a] text-white text-xs py-1 px-4 flex justify-between items-center border-b border-gray-700">
      <div className="flex items-center gap-2">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg" 
          alt="India Flag" 
          className="w-4 h-3"
        />
        <span className="font-medium tracking-wide">भारत सरकार / Government of India</span>
      </div>
      <div className="flex items-center gap-4 divide-x divide-gray-600">
        <div className="px-4 flex gap-2">
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black font-bold">A</div>
          <div className="w-5 h-5 rounded-full bg-black border border-white flex items-center justify-center text-white font-bold">A</div>
        </div>
        <div className="pl-4 relative flex items-center">
          <button className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-white border border-gray-600 transition-colors">
            <Globe size={14} />
            <select 
              className="bg-transparent text-white outline-none cursor-pointer appearance-none pr-4"
              value={language || 'English'}
              onChange={(e) => setLanguage(e.target.value as any)}
            >
              <option value="English" className="text-black">English</option>
              <option value="Hindi" className="text-black">हिन्दी</option>
            </select>
            <div className="absolute right-2 pointer-events-none">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

