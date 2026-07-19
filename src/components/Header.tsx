import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="bg-white py-3 px-6 flex justify-between items-center shadow-sm relative z-10">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 border-r border-gray-200 pr-6">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
            alt="State Emblem of India" 
            className="w-10 h-14 object-contain"
          />
          <div className="flex flex-col ml-1">
            <span className="text-sm font-bold leading-tight text-slate-800">{t('header.ministry1')}</span>
            <span className="text-sm font-bold leading-tight text-slate-800">{t('header.ministry2')}</span>
            <span className="text-sm font-bold leading-tight text-slate-800">{t('header.ministry3')}</span>
            <span className="text-[10px] text-slate-500 uppercase">{t('header.gov')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full border-2 border-orange-500 flex items-center justify-center">
            <div className="w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center text-white text-[10px] font-bold">PM</div>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-800">
            <span className="text-blue-900">{t('header.pm')} </span>
            {t('header.internship')}
            <span className="block text-xs font-normal text-orange-500 -mt-1 tracking-widest">{t('header.youth')}</span>
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={() => navigate('/auth')}
          className="flex items-center gap-2 bg-[#ff8c00] hover:bg-[#e67e00] text-white px-6 py-2.5 rounded-md font-bold transition-colors shadow-md"
        >
          <UserCircle2 size={20} />
          {t('header.login')}
        </button>
        <div className="h-10 border-l border-gray-200"></div>
        <div className="flex flex-col items-end">
          <span className="text-blue-900 font-bold text-sm">{t('header.viksit1')}</span>
          <span className="text-blue-900 font-bold text-sm">{t('header.viksit2')}</span>
          <div className="flex gap-1 mt-1">
            <div className="w-4 h-1 bg-orange-500"></div>
            <div className="w-4 h-1 bg-white border border-gray-300"></div>
            <div className="w-4 h-1 bg-green-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
