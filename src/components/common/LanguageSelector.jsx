import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="appearance-none bg-dark-100 border border-dark-200 text-white rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-neon-cyan hover:border-neon-cyan transition-all"
      >
        <option value="en">EN</option>
        <option value="az">AZ</option>
        <option value="tr">TR</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neon-cyan">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M7 10l5 5 5-5H7z" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;