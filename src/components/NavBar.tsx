import React from 'react';
import { Home, FileText, HelpCircle, BookOpen, PlayCircle, Image, Star, Book, Smartphone, Headset, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navItems = [
    { name: t('nav.home'), icon: <Home size={16} />, path: '/' },
    { name: t('nav.suggestMe'), icon: <Lightbulb size={16} />, path: '/suggest' },
    { name: t('nav.guidelines'), icon: <FileText size={16} />, path: '#' },
    { name: t('nav.faqs'), icon: <HelpCircle size={16} />, path: '#' },
    { name: t('nav.manuals'), icon: <BookOpen size={16} />, path: '#' },
    { name: t('nav.videos'), icon: <PlayCircle size={16} />, path: '#' },
    { name: t('nav.gallery'), icon: <Image size={16} />, path: '#' },
    { name: t('nav.benefits'), icon: <Star size={16} />, path: '#' },
    { name: t('nav.compendium'), icon: <Book size={16} />, path: '#' },
    { name: t('nav.mobileApp'), icon: <Smartphone size={16} />, path: '#' },
    { name: t('nav.support'), icon: <Headset size={16} />, path: '#' },
  ];

  return (
    <div className="bg-[#1e3a5f] text-white py-3 px-6 shadow-md relative z-20">
      <div className="flex items-center gap-6 text-sm font-bold tracking-wide overflow-x-auto">
        {navItems.map((item, index) => (
          <button 
            key={index} 
            onClick={() => {
              if (item.path && item.path !== '#') {
                navigate(item.path);
              }
            }}
            className="flex items-center gap-2 hover:text-orange-400 transition-colors whitespace-nowrap"
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};
