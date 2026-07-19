import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES, LANG_NATIVE_LABELS } from '../i18n/languages';
import { Globe } from 'lucide-react';

const SCRIPT_MAP: Record<string, string> = {
  English: 'A',
  Hindi: 'अ',
  Bengali: 'অ',
  Telugu: 'అ',
  Marathi: 'अ',
  Tamil: 'அ',
  Urdu: 'ا',
  Gujarati: 'અ',
  Kannada: 'ಅ',
  Odia: 'ଅ',
  Malayalam: 'അ',
  Punjabi: 'ਅ',
  Assamese: 'অ'
};

export const LanguageModal: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  if (language !== null) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-3xl w-full relative overflow-hidden my-auto">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-100 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="flex flex-col items-center text-center relative z-10">
          {/* India emblem */}
          <div className="mb-5">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
              alt="State Emblem of India"
              className="w-12 h-16 object-contain mx-auto"
            />
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-1">{t('langModal.welcome')}</h2>
          <p className="text-slate-500 mb-8 font-medium text-sm">{t('langModal.selectLang')}</p>

          {/* Language grid — 4 columns on md+, 3 on sm, 2 on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full mb-6">
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                id={`lang-btn-${lang.toLowerCase()}`}
                onClick={() => setLanguage(lang)}
                className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 active:scale-95 transition-all group shadow-sm cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                  <span className="text-xl font-bold text-slate-600 group-hover:text-blue-600">{SCRIPT_MAP[lang]}</span>
                </div>
                {/* Native script label */}
                <span className="font-semibold text-xs text-slate-800 group-hover:text-blue-700 leading-tight">
                  {LANG_NATIVE_LABELS[lang]}
                </span>
                {/* English label underneath */}
                <span className="text-[10px] text-slate-400 group-hover:text-blue-400">{lang}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center text-xs text-slate-400 gap-1">
            <Globe size={13} />
            <span>{t('langModal.changeLater')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
