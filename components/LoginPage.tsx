import React from 'react';
import { GavelIcon } from './icons/GavelIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { UsersIcon } from './icons/UsersIcon';
// FIX: Import shared types from the centralized types.ts file.
import type { UserRole } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

const RoleCard: React.FC<{
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  onSelect: (role: UserRole) => void;
}> = ({ role, title, description, icon, onSelect }) => (
  <button
    onClick={() => onSelect(role)}
    className="w-full text-left p-6 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl shadow-custom hover:shadow-custom-lg hover:border-[rgb(var(--primary))] focus:ring-2 focus:ring-[rgb(var(--ring))] focus:outline-none transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
  >
    <div className="flex items-center">
      <div className="p-3 bg-[rgb(var(--muted))] rounded-full mr-4 border border-[rgb(var(--border))]">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[rgb(var(--card-foreground))]">{title}</h3>
        <p className="text-sm text-[rgb(var(--muted-foreground))] mt-1">{description}</p>
      </div>
    </div>
  </button>
);

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const t = useTranslations();
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[rgb(var(--background))] p-4 font-sans relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-900/[0.2] dark:via-purple-900/[0.15] dark:to-pink-900/[0.1]"></div>
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(15 23 42 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
              backgroundPosition: 'center',
            }}
          ></div>
        </div>
      <div className="w-full max-w-2xl mx-auto z-10">
        <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-[rgb(var(--foreground))] tracking-tight">{t.login.mainTitle}</h1>
            <p className="mt-3 text-lg text-[rgb(var(--muted-foreground))]">{t.login.subtitle}</p>
        </div>
        
        <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl p-8 shadow-custom-lg backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
          <h2 className="text-2xl font-semibold text-center text-[rgb(var(--card-foreground))] mb-6">{t.login.selectRole}</h2>
          <div className="space-y-4">
            <RoleCard
              role="citizen"
              title={t.login.citizenTitle}
              description={t.login.citizenDescription}
              icon={<UsersIcon className="h-6 w-6 text-[rgb(var(--primary))]" />}
              onSelect={onLogin}
            />
            <RoleCard
              role="advocate"
              title={t.login.advocateTitle}
              description={t.login.advocateDescription}
              icon={<BriefcaseIcon className="h-6 w-6 text-[rgb(var(--primary))]" />}
              onSelect={onLogin}
            />
            <RoleCard
              role="judge"
              title={t.login.judgeTitle}
              description={t.login.judgeDescription}
              icon={<GavelIcon className="h-6 w-6 text-[rgb(var(--primary))]" />}
              onSelect={onLogin}
            />
          </div>
        </div>
         <p className="text-xs text-[rgb(var(--muted-foreground))] mt-6 text-center">
            {t.login.compliance}
        </p>
      </div>
    </div>
  );
};