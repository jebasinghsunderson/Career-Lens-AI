import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';
import { AshokaChakra } from './AshokaChakra';

export const LanguageModal: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  if (language !== null) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-100 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="mb-6 flex gap-4 items-center">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
              alt="State Emblem of India" 
              className="w-12 h-16 object-contain"
            />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to PM Internship</h2>
          <p className="text-slate-500 mb-8 font-medium">Please select your preferred language to proceed.</p>
          
          <div className="grid grid-cols-2 gap-4 w-full mb-6">
            <button
              onClick={() => setLanguage('English')}
              className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center text-slate-600 group-hover:text-blue-600 transition-colors">
                <span className="text-xl font-bold">A</span>
              </div>
              <span className="font-bold text-slate-700 group-hover:text-blue-700">English</span>
            </button>

            <button
              onClick={() => setLanguage('Hindi')}
              className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-orange-100 flex items-center justify-center text-slate-600 group-hover:text-orange-600 transition-colors">
                <span className="text-xl font-bold">अ</span>
              </div>
              <span className="font-bold text-slate-700 group-hover:text-orange-700">हिन्दी (Hindi)</span>
            </button>
          </div>
          
          <div className="flex items-center text-xs text-slate-400 gap-1 mt-4">
            <Globe size={14} />
            You can change this later from the top menu
          </div>
        </div>
      </div>
    </div>
  );
};
