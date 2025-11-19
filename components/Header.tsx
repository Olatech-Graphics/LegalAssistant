import React, { useState } from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
// FIX: Import shared types from the centralized types.ts file.
import type { Theme, UserRole } from '../types';
import { FEATURE_FLAGS } from '../featureFlags';
import { BellIcon } from './icons/BellIcon';
import { Notifications } from './addons/Notifications';
import { useTranslations } from '../hooks/useTranslations';
import { LanguageSelector } from './LanguageSelector';


interface HeaderProps {
    userRole: UserRole;
    handleLogout: () => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export const Header: React.FC<HeaderProps> = ({ userRole, handleLogout, theme, setTheme }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const t = useTranslations();
    
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const getRoleTitle = (role: UserRole) => {
        return t.roles[role];
    }

    const getInitials = (role: UserRole) => {
        switch (role) {
            case 'citizen': return 'C';
            case 'advocate': return 'A';
            case 'judge': return 'J';
        }
    }

    return (
        <header className="bg-[rgb(var(--card))] text-[rgb(var(--card-foreground))] shadow-custom border-b border-[rgb(var(--border))]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-semibold text-[rgb(var(--foreground))]">{t.header.title}</h1>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <LanguageSelector />
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--background))] focus:ring-[rgb(var(--ring))]"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                        </button>
                        
                        {FEATURE_FLAGS.realTimeNotifications && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(prev => !prev)}
                                    className="p-2 rounded-full text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--background))] focus:ring-[rgb(var(--ring))]"
                                    aria-label="Toggle notifications"
                                >
                                    <BellIcon className="h-6 w-6" />
                                    <span className="absolute top-1 right-1.5 flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                </button>
                                {showNotifications && <Notifications onClose={() => setShowNotifications(false)} />}
                            </div>
                        )}

                         <div className="flex items-center space-x-3">
                            <div className="hidden sm:block text-right">
                                <div className="font-medium text-sm text-[rgb(var(--foreground))]">{t.header.welcome}</div>
                                <div className="text-xs text-[rgb(var(--muted-foreground))]">{getRoleTitle(userRole)}</div>
                            </div>
                            <div className="h-10 w-10 bg-slate-300 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-500 dark:text-slate-300 border-2 border-white dark:border-slate-800">
                                {getInitials(userRole)}
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-2 text-sm font-medium rounded-md text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--background))] focus:ring-[rgb(var(--ring))]"
                        >
                            {t.header.logout}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};