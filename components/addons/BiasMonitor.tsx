import React, { useState, useCallback } from 'react';
import { monitorForBias } from '../../services/geminiService';
import type { BiasAnalysisResult } from '../../types';
import { Spinner } from '../Spinner';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';
import { useTranslations } from '../../hooks/useTranslations';

export const BiasMonitor: React.FC = () => {
    const [documentText, setDocumentText] = useState('');
    const [result, setResult] = useState<BiasAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const t = useTranslations();

    const handleAnalyze = useCallback(async () => {
        if (!documentText.trim()) {
            setError("Please provide text to analyze for bias.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const analysisResult = await monitorForBias(documentText);
            setResult(analysisResult);
        } catch (e) {
            console.error(e);
            setError("An error occurred during bias analysis. The AI model may have returned an invalid response.");
        } finally {
            setIsLoading(false);
        }
    }, [documentText]);

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-[rgb(var(--card-foreground))]">{t.biasMonitor.title}</h2>
            <div className="flex-shrink-0">
                <p className="text-sm text-[rgb(var(--muted-foreground))] mb-2">{t.biasMonitor.description}</p>
                <textarea
                    value={documentText}
                    onChange={(e) => setDocumentText(e.target.value)}
                    placeholder={t.biasMonitor.placeholder}
                    className="w-full h-32 p-3 border border-[rgb(var(--border))] rounded-md focus:ring-2 focus:ring-[rgb(var(--ring))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
                    disabled={isLoading}
                />
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading || !documentText}
                    className="mt-2 w-full px-6 py-3 bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] font-semibold rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? <><Spinner /> {t.biasMonitor.analyzing}</> : <><ShieldCheckIcon className="w-5 h-5" /> {t.biasMonitor.analyze}</>}
                </button>
            </div>
            <div className="flex-grow mt-4 overflow-y-auto pr-2">
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <Spinner />
                            <p className="mt-2 text-[rgb(var(--muted-foreground))]">{t.biasMonitor.scanning}</p>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg" role="alert">
                        <p><strong className="font-bold">{t.error}: </strong>{error}</p>
                    </div>
                )}
                {result && (
                    <div>
                        {result.has_bias === false ? (
                             <div className="bg-green-500/10 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg" role="alert">
                                <p className="font-bold">{t.biasMonitor.noBias}</p>
                                <p>{t.biasMonitor.noBiasDetails}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-amber-500/10 border-l-4 border-amber-500 text-amber-700 p-4 rounded-r-lg" role="alert">
                                    <p className="font-bold">{t.biasMonitor.biasDetected}</p>
                                    <p>{t.biasMonitor.biasDetectedDetails}</p>
                                </div>
                                {result.findings.map((finding, index) => (
                                    <div key={index} className="bg-[rgb(var(--background))] p-4 rounded-lg border border-[rgb(var(--border))]">
                                        <blockquote className="border-l-4 border-red-500 pl-4 italic text-red-600">
                                            "{finding.phrase}"
                                        </blockquote>
                                        <div className="mt-3 text-sm space-y-2">
                                            <p><strong className="text-[rgb(var(--foreground))]">{t.biasMonitor.biasType}:</strong> <span className="font-mono bg-[rgb(var(--secondary))] text-[rgb(var(--secondary-foreground))] px-2 py-0.5 rounded">{finding.bias_type}</span></p>
                                            <p><strong className="text-[rgb(var(--foreground))]">{t.biasMonitor.explanation}:</strong> {finding.explanation}</p>
                                            <p><strong className="text-[rgb(var(--foreground))]">{t.biasMonitor.suggestion}:</strong> <span className="text-green-600">{finding.suggestion}</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};