import React, { useImperativeHandle, useRef, forwardRef, useState } from 'react';
import type { CitizenAnalysisResult, RecommendedLawyer } from '../types';
import { Spinner } from './Spinner';
import { RecommendedLawyerCard } from './RecommendedLawyerCard';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { GlobeAltIcon } from './icons/GlobeAltIcon';
import { UsersIcon } from './icons/UsersIcon';
import { useTranslations } from '../hooks/useTranslations';

interface ResultsDisplayProps {
  result: CitizenAnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  onSendRequest: (lawyer: RecommendedLawyer, summary: string) => void;
}

const InfoCard: React.FC<{ title: string; value: string; urgency?: string }> = ({ title, value, urgency }) => {
  const getUrgencyStyles = () => {
    if (!urgency) return { icon: null, color: 'text-[rgb(var(--foreground))]', };
    switch (urgency.toLowerCase()) {
      case 'high':
        return { icon: <ExclamationTriangleIcon className="w-5 h-5 mr-1.5" />, color: 'text-red-500' };
      case 'medium':
        return { icon: <ExclamationTriangleIcon className="w-5 h-5 mr-1.5" />, color: 'text-amber-500' };
      case 'low':
        return { icon: <InformationCircleIcon className="w-5 h-5 mr-1.5" />, color: 'text-blue-500' };
      default:
        return { icon: null, color: 'text-[rgb(var(--foreground))]' };
    }
  };
  const { icon, color } = getUrgencyStyles();
  
  return (
      <div className="bg-[rgb(var(--muted))] p-4 rounded-lg border border-[rgb(var(--border))]">
          <h4 className="text-sm font-semibold text-[rgb(var(--muted-foreground))]">{title}</h4>
          <p className={`text-base font-bold flex items-center mt-1 ${color}`}>
            {icon}
            {value}
          </p>
      </div>
  );
};


export const ResultsDisplay = forwardRef<
  { scrollToLawyers: () => void },
  ResultsDisplayProps
>(({ result, isLoading, error, onSendRequest }, ref) => {
  const lawyersSectionRef = useRef<HTMLDivElement>(null);
  const [showLawyers, setShowLawyers] = useState(false);
  const t = useTranslations();

  useImperativeHandle(ref, () => ({
    scrollToLawyers() {
      setShowLawyers(true);
      setTimeout(() => { // Wait for re-render before scrolling
        lawyersSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    },
  }));
  
  if (isLoading) {
    return (
      <div className="bg-[rgb(var(--card))] p-6 rounded-xl shadow-custom border border-[rgb(var(--border))] text-center">
        <div className="flex justify-center items-center gap-4">
          <Spinner />
          <p className="text-lg text-[rgb(var(--muted-foreground))]">{t.results.analyzing}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl shadow-custom" role="alert">
        <strong className="font-bold">{t.error}: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!result) {
    return null;
  }
  
  return (
    <div className="bg-[rgb(var(--card))] p-6 rounded-xl shadow-custom-lg border border-[rgb(var(--border))]">
      <h2 className="text-2xl font-bold text-[rgb(var(--card-foreground))] mb-6">{t.results.title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title={t.results.caseClassification} value={result.case_classification} />
        <InfoCard title={t.results.urgencyLevel} value={result.urgency} urgency={result.urgency} />
        <InfoCard title={t.results.legalDomain} value={result.legal_domain} />
        <InfoCard title={t.results.primaryIssue} value={result.primary_issue} />
      </div>

      <div className="mt-6 border-t border-[rgb(var(--border))] pt-6">
        <h3 className="text-lg font-semibold text-[rgb(var(--card-foreground))] mb-2">{t.results.legalSummary}</h3>
        <p className="text-[rgb(var(--foreground))] bg-[rgb(var(--muted))] p-4 rounded-md border border-[rgb(var(--border))]">{result.legal_summary}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-[rgb(var(--card-foreground))] mb-2 flex items-center">
            <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
            {t.results.remedy}
        </h3>
        <div className="text-[rgb(var(--foreground))] bg-green-500/10 border-l-4 border-green-500 p-4 rounded-r-md">
           <ol className="list-decimal list-inside space-y-2 pl-2">
                {result.probable_remedy.map((step, index) => (
                    <li key={index} className="text-[rgb(var(--foreground))]">{step}</li>
                ))}
            </ol>
        </div>
      </div>
      
      {result.portal_recommendation && result.portal_recommendation.toLowerCase() !== 'n/a' && (
          <div className="mt-6">
              <h3 className="text-lg font-semibold text-[rgb(var(--card-foreground))] mb-2 flex items-center">
                  <GlobeAltIcon className="w-5 h-5 mr-2 text-blue-500" />
                  {t.results.portal}
              </h3>
              <div className="text-[rgb(var(--foreground))] bg-blue-500/10 p-4 rounded-md">
                  {result.portal_recommendation}
              </div>
          </div>
      )}
      
      <div ref={lawyersSectionRef} className="mt-6 border-t border-[rgb(var(--border))] pt-6">
        <h3 className="text-lg font-semibold text-[rgb(var(--card-foreground))] mb-1">{t.results.lawyerRecommendation}</h3>
         
        {!showLawyers && (
            <div className="text-center p-4 mt-4 bg-[rgb(var(--muted))] rounded-lg border border-[rgb(var(--border))]">
                <p className="text-sm text-[rgb(var(--muted-foreground))] mb-4">{t.results.showLawyersDescription}</p>
                <button
                    onClick={() => setShowLawyers(true)}
                    className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] font-semibold rounded-md hover:opacity-90 transition-all shadow-md"
                    aria-label={t.results.showLawyers}
                >
                    <UsersIcon className="w-5 h-5"/>
                    {t.results.showLawyers}
                </button>
            </div>
        )}

        {showLawyers && (
            <div className="mt-4">
                <p 
                  className="text-sm text-[rgb(var(--muted-foreground))] mb-4"
                  dangerouslySetInnerHTML={{ __html: t.results.lawyerSuggestion.replace('{lawyerType}', result.suggested_lawyer_type) }} 
                />
                
                <div className="bg-blue-500/10 border-l-4 border-blue-500 text-blue-800 dark:text-blue-300 p-4 rounded-r-md mb-4" role="alert">
                  <p className="font-bold flex items-center gap-2"><InformationCircleIcon className="w-5 h-5"/>{t.results.importantNote}</p>
                  <p className="text-sm mt-1">{t.results.importantNoteDetails}</p>
                </div>

                <div className="space-y-4">
                    {result.recommended_lawyers.map((lawyer) => (
                        <RecommendedLawyerCard 
                            key={lawyer.profile_id} 
                            lawyer={lawyer} 
                            onRequest={(selectedLawyer) => onSendRequest(selectedLawyer, result.lawyer_request_summary)}
                        />
                    ))}
                </div>
            </div>
        )}
      </div>

    </div>
  );
});