import React from 'react';
import type { ViewType } from '../types';
import { CaseRequests } from './CaseRequests';
import { AIResearchHub } from './AIResearchHub';
import { SimilarCaseAnalyzer } from './SimilarCaseAnalyzer';
import { PrecedentSearch } from './PrecedentSearch';
import { ArgumentBuilder } from './ArgumentBuilder';
import { LegalDraftGenerator } from './addons/LegalDraftGenerator';
import { SmartCalendar } from './addons/SmartCalendar';
import { FEATURE_FLAGS } from '../featureFlags';

interface AdvocateDashboardProps {
  activeView: ViewType;
}

export const AdvocateDashboard: React.FC<AdvocateDashboardProps> = ({ activeView }) => {

  const renderContent = () => {
    switch (activeView) {
      case 'airesearch':
        return <AIResearchHub />;
      case 'aidrafts':
        return FEATURE_FLAGS.aiDraftGenerator ? <LegalDraftGenerator /> : <CaseRequests />;
      case 'similarcases':
        return <SimilarCaseAnalyzer />;
      case 'search':
        return <PrecedentSearch />;
      case 'builder':
        return <ArgumentBuilder />;
      case 'calendar':
        return FEATURE_FLAGS.smartCalendar ? <SmartCalendar /> : <CaseRequests />;
      case 'dashboard':
      default:
        return <CaseRequests />;
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
};