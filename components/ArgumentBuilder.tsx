import React, { useState, useCallback } from 'react';
import { generateArguments } from '../services/geminiService';
import type { ArgumentBuilderResult } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { Spinner } from './Spinner';
import { GavelIcon } from './icons/GavelIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';

export const ArgumentBuilder: React.FC = () => {
    const t = useTranslations();
    const [caseFacts, setCaseFacts] = useState('');
    const [legalStance, setLegalStance] = useState<'Plaintiff' | 'Defendant'>('Plaintiff');
    const [desiredOutcome, setDesiredOutcome] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ArgumentBuilderResult | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!caseFacts.trim() || !desiredOutcome.trim()) {
            setError("Please fill in all the fields.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const response = await generateArguments(caseFacts, desiredOutcome, legalStance);
            setResult(response);
        } catch (e) {
            console.error(e);
            setError("An error occurred while generating the argument. The AI model may have returned an invalid response.");
        } finally {
            setIsLoading(false);
        }
    }, [caseFacts, desiredOutcome, legalStance]);

    return (
        <div>
            <h1 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-1">{t.argumentBuilder.title}</h1>
            <p className="text-[rgb(var(--muted-foreground))] mb-6">{t.argumentBuilder.description}</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Column */}
                <div className="bg-[rgb(var(--card))] p-6 rounded-lg shadow-md border border-[rgb(var(--border))]">
                    <h2 className="text-xl font-semibold mb-4">{t.argumentBuilder.formTitle}</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="caseFacts" className="block text-sm font-medium text-[rgb(var(--card-foreground))]">{t.argumentBuilder.caseFactsLabel}</label>
                            <textarea
                                id="caseFacts"
                                value={caseFacts}
                                onChange={(e) => setCaseFacts(e.target.value)}
                                rows={8}
                                placeholder={t.argumentBuilder.caseFactsPlaceholder}
                                className="mt-1 w-full p-3 border border-[rgb(var(--border))] rounded-md focus:ring-2 focus:ring-[rgb(var(--ring))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--card-foreground))]">{t.argumentBuilder.stanceLabel}</label>
                            <div className="mt-2 grid grid-cols-2 gap-3">
                                <label className={`relative flex cursor-pointer rounded-lg border p-4 focus-within:ring-2 focus-within:ring-[rgb(var(--ring))] ${legalStance === 'Plaintiff' ? 'bg-[rgb(var(--primary))] border-[rgb(var(--primary))] text-white' : 'bg-transparent border-[rgb(var(--border))]'}`}>
                                    <input type="radio" name="legalStance" value="Plaintiff" checked={legalStance === 'Plaintiff'} onChange={() => setLegalStance('Plaintiff')} className="sr-only" />
                                    <span className="text-sm font-medium">{t.argumentBuilder.plaintiff}</span>
                                </label>
                                <label className={`relative flex cursor-pointer rounded-lg border p-4 focus-within:ring-2 focus-within:ring-[rgb(var(--ring))] ${legalStance === 'Defendant' ? 'bg-[rgb(var(--primary))] border-[rgb(var(--primary))] text-white' : 'bg-transparent border-[rgb(var(--border))]'}`}>
                                    <input type="radio" name="legalStance" value="Defendant" checked={legalStance === 'Defendant'} onChange={() => setLegalStance('Defendant')} className="sr-only" />
                                    <span className="text-sm font-medium">{t.argumentBuilder.defendant}</span>
                                </label>
                            </div>
                        </div>
                        <div>
                             <label htmlFor="desiredOutcome" className="block text-sm font-medium text-[rgb(var(--card-foreground))]">{t.argumentBuilder.outcomeLabel}</label>
                             <input
                                type="text"
                                id="desiredOutcome"
                                value={desiredOutcome}
                                onChange={(e) => setDesiredOutcome(e.target.value)}
                                placeholder={t.argumentBuilder.outcomePlaceholder}
                                className="mt-1 w-full p-3 border border-[rgb(var(--border))] rounded-md focus:ring-2 focus:ring-[rgb(var(--ring))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !caseFacts || !desiredOutcome}
                            className="w-full px-6 py-3 bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] font-semibold rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? <><Spinner /> {t.argumentBuilder.generatingButton}</> : <><GavelIcon className="w-5 h-5" /> {t.argumentBuilder.generateButton}</>}
                        </button>
                    </div>
                </div>

                {/* Output Column */}
                <div className="bg-[rgb(var(--card))] p-6 rounded-lg shadow-md border border-[rgb(var(--border))]">
                    <h2 className="text-xl font-semibold mb-4">{t.argumentBuilder.resultsTitle}</h2>
                    <div className="h-[calc(100vh - 200px)] overflow-y-auto pr-2">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <Spinner />
                                <p className="mt-2 text-[rgb(var(--muted-foreground))]">{t.argumentBuilder.generatingButton}</p>
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-700 px-4 py-3 rounded-lg" role="alert">
                                <p><strong className="font-bold">{t.error}: </strong>{error}</p>
                            </div>
                        )}
                        {!isLoading && !error && !result && (
                            <div className="flex items-center justify-center h-full text-center text-[rgb(var(--muted-foreground))]">
                                <p>{t.argumentBuilder.initialPrompt}</p>
                            </div>
                        )}
                        {result && (
                            <div className="space-y-6">
                                <div className="p-4 bg-[rgb(var(--muted))] rounded-lg">
                                    <h3 className="font-semibold text-lg text-[rgb(var(--card-foreground))] mb-2 flex items-center gap-2"><LightbulbIcon className="w-5 h-5 text-amber-500"/> {t.argumentBuilder.coreArgument}</h3>
                                    <p className="text-md text-[rgb(var(--foreground))]">{result.core_argument}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg text-[rgb(var(--card-foreground))] mb-2 flex items-center gap-2"><CheckCircleIcon className="w-5 h-5 text-green-500"/> {t.argumentBuilder.supportingPoints}</h3>
                                    <div className="space-y-3">
                                        {result.supporting_points.map((item, index) => (
                                            <div key={index} className="bg-[rgb(var(--background))] p-3 rounded-md border border-[rgb(var(--border))]">
                                                <p className="font-semibold text-[rgb(var(--foreground))]">{item.point}</p>
                                                <p className="text-sm text-[rgb(var(--muted-foreground))] mt-1">{item.explanation}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="font-semibold text-lg text-[rgb(var(--card-foreground))] mb-2 flex items-center gap-2"><ShieldCheckIcon className="w-5 h-5 text-red-500"/> {t.argumentBuilder.counterArguments}</h3>
                                    <div className="space-y-3">
                                        {result.potential_counter_arguments.map((item, index) => (
                                            <div key={index} className="bg-[rgb(var(--background))] p-3 rounded-md border border-[rgb(var(--border))]">
                                                <p className="text-sm font-semibold text-red-600 dark:text-red-400">{t.argumentBuilder.opposingArgument}: <span className="font-normal text-[rgb(var(--muted-foreground))]">{item.argument}</span></p>
                                                <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-2">{t.argumentBuilder.rebuttal}: <span className="font-normal text-[rgb(var(--muted-foreground))]">{item.rebuttal}</span></p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg text-[rgb(var(--card-foreground))] mb-2 flex items-center gap-2"><FileTextIcon className="w-5 h-5 text-blue-500"/> {t.argumentBuilder.evidenceChecklist}</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-[rgb(var(--foreground))] bg-[rgb(var(--background))] p-3 rounded-md border border-[rgb(var(--border))]">
                                        {result.evidence_checklist.map((item, index) => <li key={index}>{item}</li>)}
                                    </ul>
                                </div>

                                 <div>
                                    <h3 className="font-semibold text-lg text-[rgb(var(--card-foreground))] mb-2 flex items-center gap-2"><BookmarkIcon className="w-5 h-5 text-indigo-500"/> {t.argumentBuilder.suggestedPrecedents}</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-[rgb(var(--foreground))] bg-[rgb(var(--background))] p-3 rounded-md border border-[rgb(var(--border))]">
                                        {result.suggested_precedents.map((item, index) => <li key={index}>{item}</li>)}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
