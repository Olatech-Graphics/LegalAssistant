import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
// FIX: Import shared types from the centralized types.ts file.
import type { ViewType, Theme, UserRole } from '../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  handleLogout: () => void;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userRole, handleLogout, activeView, setActiveView, theme, setTheme }) => {
  return (
    <div className="flex h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))] font-sans">
      <Sidebar userRole={userRole} activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} handleLogout={handleLogout} theme={theme} setTheme={setTheme} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[rgb(var(--background))]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};