import React, { useState } from 'react';
import type { SimilarCase } from '../types';
import { GavelIcon } from './icons/GavelIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { useTranslations } from '../hooks/useTranslations';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface CaseResultCardProps {
    caseItem: SimilarCase;
}

const RelevanceMeter: React.FC<{ score: number }> = ({ score }) => {
    const percentage = Math.round(score * 100);
    let colorClass = 'bg-slate-400';
    if (percentage > 90) colorClass = 'bg-green-500';
    else if (percentage > 80) colorClass = 'bg-sky-500';
    else if (percentage > 70) colorClass = 'bg-amber-500';

    return (
        <div className="w-full bg-[rgb(var(--border))] rounded-full h-1.5">
            <div className={`${colorClass} h-1.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
        </div>
    );
};

export const CaseResultCard: React.FC<CaseResultCardProps> = ({ caseItem }) => {
    const t = useTranslations();
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        setIsSaved(true);
    };

    return (
        <div className="bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-lg p-4 my-4 transition-shadow hover:shadow-lg hover:border-[rgb(var(--accent))]">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-base font-bold text-[rgb(var(--accent))]">{caseItem.case_title}</h4>
                    <p className="text-xs text-[rgb(var(--muted-foreground))] font-mono">{caseItem.citation_or_year} &bull; {caseItem.court_name}</p>
                </div>
                 <button 
                    onClick={handleSave}
                    disabled={isSaved}
                    className="ml-4 flex-shrink-0 text-xs px-2.5 py-1.5 bg-[rgb(var(--muted))] text-[rgb(var(--muted-foreground))] font-semibold rounded-md hover:bg-[rgb(var(--border))] transition-colors flex items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isSaved ? <CheckCircleIcon className="w-3.5 h-3.5 text-green-500" /> : <BookmarkIcon className="w-3.5 h-3.5" />}
                    {isSaved ? t.caseResultCard.save.replace('Save', 'Saved') : t.caseResultCard.save}
                </button>
            </div>

            <div className="my-3">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-[rgb(var(--muted-foreground))]">{t.caseResultCard.relevanceScore}</span>
                    <span className="text-xs font-semibold">{Math.round(caseItem.relevance_score * 100)}%</span>
                </div>
                <RelevanceMeter score={caseItem.relevance_score} />
            </div>
            
            <div className="space-y-2 text-sm">
                <div>
                    <h5 className="font-semibold text-[rgb(var(--foreground))]">{t.caseResultCard.summary}</h5>
                    <p className="text-[rgb(var(--muted-foreground))]">{caseItem.summary_of_decision}</p>
                </div>
                <div>
                    <h5 className="font-semibold text-[rgb(var(--foreground))] flex items-center gap-1.5">
                        <GavelIcon className="w-4 h-4" />
                        {t.caseResultCard.takeaway}
                    </h5>
                    <p className="text-[rgb(var(--foreground))] font-medium bg-[rgb(var(--muted))] p-2 rounded-md border-l-4 border-[rgb(var(--accent))]">{caseItem.legal_takeaway}</p>
                </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[rgb(var(--border))]">
                 <h5 className="text-xs font-semibold text-[rgb(var(--muted-foreground))] mb-1">{t.caseResultCard.sectionsCited}</h5>
                 <div className="flex flex-wrap gap-1.5">
                    {caseItem.key_sections_cited.map((section, idx) => (
                        <span key={idx} className="text-xs font-mono bg-[rgb(var(--secondary))] text-[rgb(var(--secondary-foreground))] px-2 py-0.5 rounded-full">
                            {section}
                        </span>
                    ))}
                 </div>
            </div>
        </div>
    );
};