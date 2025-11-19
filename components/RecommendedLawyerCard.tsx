import React from 'react';
import type { RecommendedLawyer } from '../types';
import { UserPlusIcon } from './icons/UserPlusIcon';
import { useTranslations } from '../hooks/useTranslations';

interface RecommendedLawyerCardProps {
  lawyer: RecommendedLawyer;
  onRequest: (lawyer: RecommendedLawyer) => void;
}

export const RecommendedLawyerCard: React.FC<RecommendedLawyerCardProps> = ({ lawyer, onRequest }) => {
  const t = useTranslations();
  return (
    <div className="bg-[rgb(var(--muted))] p-4 rounded-xl border border-[rgb(var(--border))] transition-all duration-300 hover:shadow-custom hover:border-[rgb(var(--primary))]">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <div>
          <h4 className="font-bold text-lg text-[rgb(var(--foreground))]">{lawyer.name}</h4>
          <p className="text-sm text-[rgb(var(--primary))] font-medium">{lawyer.specialization}</p>
        </div>
        <button
          onClick={() => onRequest(lawyer)}
          className="mt-3 sm:mt-0 flex-shrink-0 px-4 py-2 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] text-[rgb(var(--primary-foreground))] font-semibold text-sm rounded-md hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
        >
          <UserPlusIcon className="w-4 h-4" />
          {lawyer.contact_option}
        </button>
      </div>
      <div className="mt-3 pt-3 border-t border-[rgb(var(--border))] grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-[rgb(var(--muted-foreground))] block text-xs">{t.recommendedLawyer.location}</span>
          <span className="font-semibold text-[rgb(var(--foreground))]">{lawyer.location}</span>
        </div>
        <div>
          <span className="text-[rgb(var(--muted-foreground))] block text-xs">{t.recommendedLawyer.experience}</span>
          <span className="font-semibold text-[rgb(var(--foreground))]">{lawyer.experience_years} {t.recommendedLawyer.years}</span>
        </div>
        <div>
          <span className="text-[rgb(var(--muted-foreground))] block text-xs">{t.recommendedLawyer.successRate}</span>
          <span className="font-semibold text-green-600 dark:text-green-400">{lawyer.success_rate}</span>
        </div>
      </div>
    </div>
  );
};