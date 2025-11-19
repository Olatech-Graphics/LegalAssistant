
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../types';
import { LanguagesIcon } from './icons/LanguagesIcon';

const languageOptions: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'bn', label: 'বাংলা' },
  { value: 'mr', label: 'मराठी' },
  { value: 'ta', label: 'தமிழ்' },
  { value: 'te', label: 'తెలుగు' },
  { value: 'kn', label: 'ಕನ್ನಡ' },
];

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative">
      <LanguagesIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--muted-foreground))] pointer-events-none" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="pl-10 pr-4 py-2 border border-transparent rounded-full bg-transparent text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--background))] focus:ring-[rgb(var(--ring))] appearance-none"
        aria-label="Select language"
      >
        {languageOptions.map(option => (
          <option key={option.value} value={option.value} className="bg-[rgb(var(--card))] text-[rgb(var(--foreground))]">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
