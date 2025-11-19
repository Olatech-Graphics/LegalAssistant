import React, { useState, useCallback } from 'react';
import type { AIResearchPipelineResult, SimilarCaseAnalysisResult, RAGResult } from '../types';
import { getSimilarCases, performRAGSearch, getAIResearchSummary } from '../services/geminiService';
import { Spinner } from './Spinner';
import { FlaskConicalIcon } from './icons/FlaskConicalIcon';
import { useTranslations } from '../hooks/useTranslations';

const pipelineStages = [
    "Analyzing Case Facts...",
    "Finding Similar Judgments...",
    "Retrieving Legal Precedents (RAG)...",
    "Generating Final Summary...",
];

const mockRagResult: RAGResult = {
  answer: "The Transfer of Property Act, 1882, under Section 54, defines 'sale' as a transfer of ownership in exchange for a price paid or promised. The Evidence Act, 1872, Section 101, places the burden of proof on the party who asserts the existence of a fact.",
  citations: [
    "Section 54. 'Sale' defined.—'Sale' is a transfer of ownership in exchange for a price paid or promised or part-paid and part-promised.",
    "Section 101. Burden of proof.—Whoever desires any Court to give judgment as to any legal right or liability dependent on the existence of facts which he asserts, must prove that those facts exist."
  ]
};

export const AIResearchHub: React.FC = () => {
    const [caseFacts, setCaseFacts] = useState('');
    const [result, setResult] = useState<AIResearchPipelineResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentStage, setCurrentStage] = useState(0);
    const t = useTranslations();

    const handlePipelineRun = useCallback(async () => {
        if (!caseFacts.trim()) {
            setError("Please provide detailed case facts to run the pipeline.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        
        try {
            // Stage 1: Analyze Case Facts & Find Similar Cases
            setCurrentStage(1);
            const similarCasesResult = await getSimilarCases(caseFacts);

            // Stage 2: RAG Search
            setCurrentStage(2);
            // In a real app, the RAG context might come from a vector DB search based on caseFacts.
            // For this demo, we use caseFacts as context and mock the result for consistency.
            const ragResult = await performRAGSearch("Find relevant statutes for this case.", caseFacts);

            // Stage 3: Generate Final Summary
            setCurrentStage(3);
            const finalSummary = await getAIResearchSummary(caseFacts, similarCasesResult, ragResult);
            
            setResult(finalSummary);

        } catch (e) {
            console.error(e);
            setError("The AI research pipeline failed. Please check the details and try again.");
        } finally {
            setIsLoading(false);
            setCurrentStage(0);
        }
    }, [caseFacts]);

    return (
        <div>
            <h1 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-1">{t.aiResearchHub.title}</h1>
            <p className="text-[rgb(var(--muted-foreground))] mb-6">{t.aiResearchHub.description}</p>

            <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-[rgb(var(--card-foreground))]">{t.aiResearchHub.step1}</h2>
                <textarea
                    value={caseFacts}
                    onChange={(e) => setCaseFacts(e.target.value)}
                    placeholder={t.aiResearchHub.placeholder}
                    className="w-full h-40 mt-2 p-3 border border-[rgb(var(--border))] rounded-md focus:ring-2 focus:ring-[rgb(var(--ring))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
                    disabled={isLoading}
                />
                <button
                    onClick={handlePipelineRun}
                    disabled={isLoading || !caseFacts.trim()}
                    className="mt-4 w-full sm:w-auto px-6 py-3 bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] font-semibold rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <FlaskConicalIcon className="w-5 h-5" />
                    {isLoading ? t.aiResearchHub.running : t.aiResearchHub.run}
                </button>
            </div>
            
            <div className="mt-6">
                {isLoading && (
                    <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg p-6 text-center">
                        <Spinner />
                        <p className="mt-2 font-semibold text-[rgb(var(--foreground))]">{pipelineStages[currentStage]}</p>
                        <div className="w-full bg-[rgb(var(--muted))] rounded-full h-2.5 mt-4">
                            <div className="bg-[rgb(var(--accent))] h-2.5 rounded-full" style={{ width: `${(currentStage / (pipelineStages.length -1)) * 100}%`, transition: 'width 0.5s ease-in-out' }}></div>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-700 px-4 py-3 rounded-lg" role="alert">
                        <p><strong className="font-bold">{t.error}: </strong>{error}</p>
                    </div>
                )}
                {result && (
                     <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg shadow-md p-6 space-y-4">
                        <h2 className="text-xl font-bold text-[rgb(var(--foreground))]">{t.aiResearchHub.summaryTitle}</h2>
                        
                        <div className="p-4 bg-[rgb(var(--muted))] rounded-lg">
                            <h3 className="font-semibold text-[rgb(var(--card-foreground))]">{t.aiResearchHub.caseContext}</h3>
                            <p className="text-sm text-[rgb(var(--muted-foreground))]">{result.case_context}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-[rgb(var(--card-foreground))]">{t.aiResearchHub.similarCases}</h3>
                            <ul className="list-disc list-inside space-y-1 mt-1 text-sm">
                            {result.similar_cases.map((c, i) => (
                                <li key={i} className="text-[rgb(var(--foreground))]">
                                    <span className="font-medium text-[rgb(var(--accent))]">{c.case_title}</span> ({c.citation}) - {c.court_name}
                                </li>
                            ))}
                            </ul>
                        </div>
                        
                         <div>
                            <h3 className="font-semibold text-[rgb(var(--card-foreground))]">{t.aiResearchHub.ragResults}</h3>
                            <ul className="list-disc list-inside space-y-1 mt-1 text-sm">
                            {result.rag_results.map((r, i) => (
                                <li key={i} className="text-[rgb(var(--foreground))]">
                                    <span className="font-medium">{r.section}:</span> {r.summary}
                                </li>
                            ))}
                            </ul>
                        </div>

                        <div className="p-4 bg-green-500/10 border-l-4 border-green-500 rounded-r-lg">
                            <h3 className="font-semibold text-green-800 dark:text-green-300">{t.aiResearchHub.finalSummary}</h3>
                            <p className="text-sm text-green-700 dark:text-green-200 mt-1">{result.final_summary}</p>
                        </div>
                        
                         <div className="p-4 bg-sky-500/10 border-l-4 border-sky-500 rounded-r-lg">
                            <h3 className="font-semibold text-sky-800 dark:text-sky-300">{t.aiResearchHub.coreArgument}</h3>
                            <p className="text-sm text-sky-700 dark:text-sky-200 mt-1">{result.argument_suggestion}</p>
                        </div>
                     </div>
                )}
            </div>
        </div>
    );
};