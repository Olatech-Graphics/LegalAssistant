import React, { useState, useCallback } from 'react';
import { getPrecedentAnalysis } from '../services/geminiService';
import type { PrecedentAnalysisResult } from '../types';
import { Spinner } from './Spinner';
import { UploadIcon } from './icons/UploadIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { GavelIcon } from './icons/GavelIcon';
import { useTranslations } from '../hooks/useTranslations';

export const ExplainableAI: React.FC = () => {
  const [documentText, setDocumentText] = useState('');
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState<PrecedentAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setDocumentText(text);
        setFileName(file.name);
        setResult(null);
        setError(null);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid .txt file.");
      setFileName('');
      setDocumentText('');
    }
    event.target.value = '';
  };

  const handleAnalyze = useCallback(async () => {
    if (!documentText.trim()) {
      setError("Please upload a document to analyze.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await getPrecedentAnalysis(documentText);
      setResult(analysisResult);
    } catch (e) {
      console.error(e);
      setError("An error occurred during analysis. The AI model may have returned an invalid response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [documentText]);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-[rgb(var(--card-foreground))]">{t.explainableAI.title}</h2>
      
      <div className="flex-shrink-0 border-b border-[rgb(var(--border))] pb-4 mb-4">
        <div className="grid sm:grid-cols-2 gap-4 items-center">
            <label className="flex flex-col items-center justify-center w-full h-24 px-4 transition bg-[rgb(var(--background))] border-2 border-[rgb(var(--border))] border-dashed rounded-md appearance-none cursor-pointer hover:border-[rgb(var(--primary))]">
              {fileName ? (
                <div className="text-center">
                  <FileTextIcon className="mx-auto h-7 w-7 text-green-500" />
                  <span className="mt-1 block text-sm font-medium text-[rgb(var(--foreground))]">{fileName}</span>
                </div>
              ) : (
                <div className="text-center">
                  <UploadIcon className="mx-auto h-7 w-7 text-[rgb(var(--muted-foreground))]" />
                  <span className="mt-1 block text-sm font-medium text-[rgb(var(--muted-foreground))]">{t.explainableAI.upload}</span>
                </div>
              )}
              <input type="file" className="hidden" onChange={handleFileChange} accept=".txt" disabled={isLoading} />
            </label>
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !documentText}
              className="w-full h-24 px-6 py-3 bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] font-semibold rounded-md hover:opacity-90 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-opacity"
            >
              {isLoading ? <><Spinner /> {t.explainableAI.analyzing}</> : <><GavelIcon className="w-5 h-5" /> {t.explainableAI.analyze}</>}
            </button>
        </div>
      </div>

      <div className="flex-grow mt-4 overflow-y-auto pr-2">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Spinner />
              <p className="mt-2 text-[rgb(var(--muted-foreground))]">{t.explainableAI.deepAnalysis}</p>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg" role="alert">
            <p><strong className="font-bold">{t.error}: </strong>{error}</p>
          </div>
        )}
        {result && (
          <div className="space-y-6">
            <div className="bg-[rgb(var(--background))] p-4 rounded-lg">
              <h3 className="text-lg font-bold text-[rgb(var(--foreground))] border-b border-[rgb(var(--border))] pb-2 mb-3">{t.explainableAI.keyArguments}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong className="text-blue-500 dark:text-blue-400 block mb-1">{t.explainableAI.plaintiff}:</strong> <p className="text-[rgb(var(--foreground))]">{result.keyArguments.plaintiff}</p></div>
                <div><strong className="text-green-500 dark:text-green-400 block mb-1">{t.explainableAI.defendant}:</strong> <p className="text-[rgb(var(--foreground))]">{result.keyArguments.defendant}</p></div>
              </div>
            </div>
            
            <div className="bg-[rgb(var(--background))] p-4 rounded-lg">
              <h3 className="text-lg font-bold text-[rgb(var(--foreground))] border-b border-[rgb(var(--border))] pb-2 mb-3">{t.explainableAI.influencingStatutes}</h3>
              <div className="space-y-3">
                {result.influencingStatutes.map((item, index) => (
                  <div key={index} className="bg-[rgb(var(--card))] p-3 rounded-md border border-[rgb(var(--border))]">
                    <p className="font-semibold text-[rgb(var(--foreground))]">{item.statute}</p>
                    <blockquote className="border-l-4 border-indigo-500/50 pl-3 my-1 text-sm text-[rgb(var(--muted-foreground))] italic">"{item.quote}"</blockquote>
                    <p className="text-xs text-[rgb(var(--foreground))]"><strong className="font-medium">{t.explainableAI.relevance}:</strong> {item.relevance}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[rgb(var(--background))] p-4 rounded-lg">
              <h3 className="text-lg font-bold text-[rgb(var(--foreground))] border-b border-[rgb(var(--border))] pb-2 mb-3">{t.explainableAI.consistencyCheck}</h3>
               {result.consistencyCheck.length > 0 ? (
                    result.consistencyCheck.map((item, index) => (
                        <div key={index} className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-sm mb-2">
                            <p className="font-semibold text-amber-600 dark:text-amber-400">Issue: {item.issue}</p>
                            <p className="text-amber-700 dark:text-amber-300">{item.explanation}</p>
                        </div>
                    ))
                ) : <p className="text-sm text-green-600 dark:text-green-400 bg-green-500/10 p-3 rounded-lg">{t.explainableAI.noInconsistencies}</p>}
            </div>

             <div className="bg-[rgb(var(--background))] p-4 rounded-lg">
              <h3 className="text-lg font-bold text-[rgb(var(--foreground))] border-b border-[rgb(var(--border))] pb-2 mb-3">{t.explainableAI.biasDetection}</h3>
              <div className={`p-3 rounded-lg text-sm ${result.biasDetection.warning.includes('No potential bias') ? 'bg-green-500/10 text-green-700 dark:text-green-300' : 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20'}`}>
                <p>{result.biasDetection.warning}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};