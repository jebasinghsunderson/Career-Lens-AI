import React from 'react';
import { Home, FileText, HelpCircle, BookOpen, PlayCircle, Image, Star, Book, Smartphone, Headset, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NavBar: React.FC = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'HOME', icon: <Home size={16} />, path: '/' },
    { name: 'SUGGEST ME', icon: <Lightbulb size={16} />, path: '/suggest' },
    { name: 'GUIDELINES', icon: <FileText size={16} />, path: '#' },
    { name: 'FAQS', icon: <HelpCircle size={16} />, path: '#' },
    { name: 'MANUALS', icon: <BookOpen size={16} />, path: '#' },
    { name: 'GUIDANCE VIDEOS', icon: <PlayCircle size={16} />, path: '#' },
    { name: 'GALLERY', icon: <Image size={16} />, path: '#' },
    { name: 'BENEFITS', icon: <Star size={16} />, path: '#' },
    { name: 'COMPENDIUM', icon: <Book size={16} />, path: '#' },
    { name: 'MOBILE APP', icon: <Smartphone size={16} />, path: '#' },
    { name: 'SUPPORT', icon: <Headset size={16} />, path: '#' },
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
