
import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

export const AnalyticsDashboard: React.FC = () => {
  const t = useTranslations();
  return (
    <div>
      <h1 className="text-3xl font-bold text-[rgb(var(--foreground))] mb-4">{t.analyticsDashboard.title}</h1>
      <div className="bg-[rgb(var(--card))] p-8 rounded-lg shadow-md text-center border border-[rgb(var(--border))]">
        <h2 className="text-2xl font-semibold text-[rgb(var(--card-foreground))]">{t.analyticsDashboard.comingSoon}</h2>
        <p className="text-[rgb(var(--muted-foreground))] mt-2">{t.analyticsDashboard.description}</p>
      </div>
    </div>
  );
};
