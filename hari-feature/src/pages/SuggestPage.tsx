import React from 'react';
import { TopBar } from '../components/TopBar';
import { Header } from '../components/Header';
import { NavBar } from '../components/NavBar';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const SuggestPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <TopBar />
      <Header />
      <NavBar />
      
      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
            <Lightbulb size={40} className="text-orange-500" />
          </div>
          
          <h1 className="text-3xl font-extrabold text-slate-800 mb-4 relative z-10">
            {t('suggest.title')}
          </h1>
          <p className="text-slate-600 mb-8 relative z-10 max-w-md mx-auto">
            {t('suggest.subtitle')}
          </p>
          
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 relative z-10 text-left">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {t('suggest.aiRecs')}
            </h3>
            
            <div className="flex flex-col items-center justify-center bg-white p-8 rounded-xl border border-blue-100 shadow-sm mt-4 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Lightbulb size={32} className="text-blue-500" />
              </div>
              <h4 className="font-bold text-slate-800 text-lg mb-2">{t('suggest.unlock')}</h4>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                {t('suggest.unlockDesc')}
              </p>
              <button 
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition-colors inline-flex items-center justify-center gap-2"
              >
                {t('suggest.loginBtn')} <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
