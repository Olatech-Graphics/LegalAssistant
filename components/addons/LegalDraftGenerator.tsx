import React, { useState, useCallback } from 'react';
import type { LegalDraftType } from '../../types';
import { generateLegalDraft } from '../../services/geminiService';
import { Spinner } from '../Spinner';
import { FeatherIcon } from '../icons/FeatherIcon';
import { useTranslations } from '../../hooks/useTranslations';

export const LegalDraftGenerator: React.FC = () => {
    const [draftType, setDraftType] = useState<LegalDraftType>('Legal Notice');
    const [caseContext, setCaseContext] = useState('');
    const [keyPoints, setKeyPoints] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const t = useTranslations();

    const handleGenerate = useCallback(async () => {
        if (!caseContext.trim() || !keyPoints.trim()) {
            setError("Please provide both case context and key points to include.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const draftResult = await generateLegalDraft(draftType, caseContext, keyPoints);
            setResult(draftResult);
        } catch (e) {
            console.error(e);
            setError("An error occurred while generating the draft. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [draftType, caseContext, keyPoints]);
    
    const handleCopyToClipboard = () => {
        if(result) {
            navigator.clipboard.writeText(result);
            alert(t.draftGenerator.copied);
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-4">{t.draftGenerator.title}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="bg-[rgb(var(--card))] p-6 rounded-lg shadow-md border border-[rgb(var(--border))] space-y-4">
                    <div>
                        <label htmlFor="draftType" className="block text-sm font-medium text-[rgb(var(--card-foreground))]">{t.draftGenerator.docType}</label>
                        <select
                            id="draftType"
                            value={draftType}
                            onChange={(e) => setDraftType(e.target.value as LegalDraftType)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-[rgb(var(--border))] focus:outline-none focus:ring-[rgb(var(--ring))] focus:border-[rgb(var(--ring))] sm:text-sm rounded-md bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
                            disabled={isLoading}
                        >
                            {Object.entries(t.draftGenerator.draftTypes).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="caseContext" className="block text-sm font-medium text-[rgb(var(--card-foreground))]">{t.draftGenerator.caseContext}</label>
                         <textarea
                            id="caseContext"
                            value={caseContext}
                            onChange={(e) => setCaseContext(e.target.value)}
                            rows={6}
                            placeholder={t.draftGenerator.contextPlaceholder}
                            className="mt-1 w-full p-3 border border-[rgb(var(--border))] rounded-md focus:ring-2 focus:ring-[rgb(var(--ring))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
                            disabled={isLoading}
                        />
                    </div>
                     <div>
                        <label htmlFor="keyPoints" className="block text-sm font-medium text-[rgb(var(--card-foreground))]">{t.draftGenerator.keyPoints}</label>
                         <textarea
                            id="keyPoints"
                            value={keyPoints}
                            onChange={(e) => setKeyPoints(e.target.value)}
                            rows={4}
                            placeholder={t.draftGenerator.keyPointsPlaceholder}
                            className="mt-1 w-full p-3 border border-[rgb(var(--border))] rounded-md focus:ring-2 focus:ring-[rgb(var(--ring))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
                            disabled={isLoading}
                        />
                    </div>
                     <button
                        onClick={handleGenerate}
                        disabled={isLoading || !caseContext || !keyPoints}
                        className="w-full px-6 py-3 bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] font-semibold rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? <><Spinner /> {t.draftGenerator.generating}</> : <><FeatherIcon className="w-5 h-5" /> {t.draftGenerator.generate}</>}
                    </button>
                </div>
                {/* Output Section */}
                <div className="bg-[rgb(var(--card))] p-6 rounded-lg shadow-md border border-[rgb(var(--border))] flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-[rgb(var(--card-foreground))]">{t.draftGenerator.outputTitle}</h3>
                        <button 
                            onClick={handleCopyToClipboard}
                            disabled={!result}
                            className="text-sm px-3 py-1.5 bg-[rgb(var(--muted))] text-[rgb(var(--muted-foreground))] font-semibold rounded-md hover:bg-[rgb(var(--border))] disabled:opacity-50"
                        >
                            {t.draftGenerator.copy}
                        </button>
                    </div>
                    <div className="flex-grow bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-md p-4 overflow-y-auto">
                        {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
                        {error && <p className="text-red-500">{error}</p>}
                        {result && <pre className="whitespace-pre-wrap text-sm font-sans">{result}</pre>}
                         {!isLoading && !error && !result && (
                            <div className="flex items-center justify-center h-full text-center text-[rgb(var(--muted-foreground))]">
                                <p>{t.draftGenerator.initial}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};