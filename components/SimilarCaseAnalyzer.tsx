import React, { useState, useCallback } from 'react';
import type { SimilarCaseAnalysisResult } from '../types';
import { getSimilarCases } from '../services/geminiService';
import { Spinner } from './Spinner';
import { SearchIcon } from './icons/SearchIcon';
import { CaseResultCard } from './CaseResultCard';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { useTranslations } from '../hooks/useTranslations';


export const SimilarCaseAnalyzer: React.FC = () => {
    const [caseFacts, setCaseFacts] = useState('');
    const [result, setResult] = useState<SimilarCaseAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const t = useTranslations();

    const handleAnalyze = useCallback(async () => {
        if (!caseFacts.trim()) {
            setError("Please provide the case facts to analyze.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const analysisResult = await getSimilarCases(caseFacts);
            setResult(analysisResult);
        } catch (e) {
            console.error(e);
            setError("An error occurred while finding similar cases. The AI model may have returned an invalid response. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [caseFacts]);

    return (
        <div>
            <h1 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-4">{t.similarCaseAnalyzer.title}</h1>
            <div className="bg-[rgb(var(--card))] p-6 rounded-lg shadow-md border border-[rgb(var(--border))]">
              <p className="text-[rgb(var(--muted-foreground))] mt-1 mb-4">{t.similarCaseAnalyzer.description}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                  <textarea
                      value={caseFacts}
                      onChange={(e) => setCaseFacts(e.target.value)}
                      placeholder={t.similarCaseAnalyzer.placeholder}
                      className="flex-grow h-28 sm:h-auto p-3 border border-[rgb(var(--border))] rounded-md focus:ring-2 focus:ring-[rgb(var(--ring))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
                      disabled={isLoading}
                  />
                  <button
                      onClick={handleAnalyze}
                      disabled={isLoading || !caseFacts}
                      className="w-full sm:w-auto px-6 py-3 bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] font-semibold rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                      {isLoading ? <><Spinner /> {t.similarCaseAnalyzer.finding}</> : <><SearchIcon className="w-5 h-5" /> {t.similarCaseAnalyzer.button}</>}
                  </button>
              </div>

              <div className="mt-6">
                  {isLoading && (
                      <div className="flex items-center justify-center text-center p-4">
                          <div className="flex items-center gap-3">
                              <Spinner />
                              <p className="text-[rgb(var(--muted-foreground))]">{t.similarCaseAnalyzer.analyzing}</p>
                          </div>
                      </div>
                  )}
                  {error && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-700 px-4 py-3 rounded-lg" role="alert">
                          <p><strong className="font-bold">{t.error}: </strong>{error}</p>
                      </div>
                  )}
                  {result && (
                      <div className="space-y-4">
                          <div className="bg-[rgb(var(--muted))] p-4 rounded-lg">
                               <h3 className="text-lg font-semibold text-[rgb(var(--card-foreground))] mb-2 flex items-center gap-2">
                                  <InformationCircleIcon className="w-5 h-5 text-[rgb(var(--accent))]" />
                                  {t.similarCaseAnalyzer.summaryTitle}
                              </h3>
                              <p className="text-sm text-[rgb(var(--muted-foreground))] mb-2"><strong>{t.similarCaseAnalyzer.caseContext}:</strong> {result.case_context_summary}</p>
                              <p className="text-sm text-[rgb(var(--foreground))]"><strong>{t.similarCaseAnalyzer.overallFinding}:</strong> {result.overall_summary}</p>
                          </div>

                          <div>
                              {result.similar_cases_found.map((caseItem, index) => (
                                  <CaseResultCard key={index} caseItem={caseItem} />
                              ))}
                          </div>
                          
                           <div className="text-[rgb(var(--foreground))] bg-green-500/10 border-l-4 border-green-500 p-4 rounded-r-md">
                              <h4 className="font-semibold flex items-center gap-2 mb-1">
                                  <CheckCircleIcon className="w-5 h-5 text-green-600"/>
                                  {t.similarCaseAnalyzer.suggestedAction}
                              </h4>
                              <p className="text-sm">{result.suggested_action}</p>
                          </div>

                      </div>
                  )}
              </div>
            </div>
        </div>
    );
};