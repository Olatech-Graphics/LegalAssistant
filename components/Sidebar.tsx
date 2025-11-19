import React from 'react';
// FIX: Import shared types from the centralized types.ts file.
import type { ViewType, UserRole } from '../types';
import { SearchIcon } from './icons/SearchIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { UsersIcon } from './icons/UsersIcon';
import { GavelIcon } from './icons/GavelIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { useTranslations } from '../hooks/useTranslations';
import { MailIcon } from './icons/MailIcon';
import { FlaskConicalIcon } from './icons/FlaskConicalIcon';
import { FileClockIcon } from './icons/FileClockIcon';
import { FeatherIcon } from './icons/FeatherIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { FEATURE_FLAGS } from '../featureFlags';


interface SidebarProps {
  userRole: UserRole;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

interface NavItemProps {
  view: ViewType;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: (view: ViewType) => void;
}

const NavItem: React.FC<NavItemProps> = ({ view, label, icon, isActive, onClick }) => (
  <button
    onClick={() => onClick(view)}
    className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 relative rounded-md ${
      isActive
        ? 'bg-[rgb(var(--primary))] text-white shadow-lg'
        : 'text-slate-300 hover:bg-white/10 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

const getNavItemsForRole = (role: UserRole, t: any) => {
    const judgeItems = [
        { view: 'dashboard' as ViewType, label: t.sidebar.judgesDashboard, icon: <GavelIcon className="h-5 w-5" /> },
        { view: 'analytics' as ViewType, label: t.sidebar.judicialAnalytics, icon: <ChartBarIcon className="h-5 w-5" /> },
    ];

    const advocateItems = [
        { view: 'dashboard' as ViewType, label: t.advocateNav.caseRequests, icon: <MailIcon className="h-5 w-5" />, flag: true },
        { view: 'airesearch' as ViewType, label: t.advocateNav.aiResearch, icon: <FlaskConicalIcon className="h-5 w-5" />, flag: true },
        { view: 'aidrafts' as ViewType, label: t.advocateNav.aiDrafts, icon: <FeatherIcon className="h-5 w-5" />, flag: FEATURE_FLAGS.aiDraftGenerator },
        { view: 'similarcases' as ViewType, label: t.advocateNav.similarCases, icon: <FileClockIcon className="h-5 w-5" />, flag: true },
        { view: 'search' as ViewType, label: t.advocateNav.precedentSearch, icon: <SearchIcon className="h-5 w-5" />, flag: true },
        { view: 'builder' as ViewType, label: t.advocateNav.argumentBuilder, icon: <UsersIcon className="h-5 w-5" />, flag: true },
        { view: 'calendar' as ViewType, label: t.advocateNav.smartCalendar, icon: <CalendarIcon className="h-5 w-5" />, flag: FEATURE_FLAGS.smartCalendar },
    ].filter(item => item.flag);

    const citizenItems = [
        { view: 'dashboard' as ViewType, label: t.sidebar.citizenDashboard, icon: <UsersIcon className="h-5 w-5" /> },
        { view: 'case_filing' as ViewType, label: t.sidebar.caseFiling, icon: <FileTextIcon className="h-5 w-5" /> },
    ];
    
    switch (role) {
        case 'judge': return judgeItems;
        case 'advocate': return advocateItems;
        case 'citizen': return citizenItems;
        default: return [];
    }
}


export const Sidebar: React.FC<SidebarProps> = ({ userRole, activeView, setActiveView }) => {
  const t = useTranslations();
  const navItems = getNavItemsForRole(userRole, t);

  const handleNavigation = (view: ViewType) => {
     setActiveView(view);
  }


  return (
    <div className="hidden lg:flex w-64 bg-slate-900/[0.95] dark:bg-slate-900/[0.9] text-white flex-col p-4">
      <div className="flex items-center justify-center h-16">
        <h2 className="text-xl font-bold tracking-wider text-white">{t.sidebar.title}</h2>
      </div>
      <nav className="flex-1 mt-6 space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.view}
            view={item.view}
            label={item.label}
            icon={item.icon}
            isActive={activeView === item.view}
            onClick={handleNavigation}
          />
        ))}
      </nav>
       <div className="p-4 text-center">
            <p className="text-xs text-slate-400">{t.sidebar.compliance}</p>
        </div>
    </div>
  );
};