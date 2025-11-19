import React, { useState, useCallback } from 'react';
import { performRAGSearch } from '../services/geminiService';
import type { RAGResult } from '../types';
import { Spinner } from './Spinner';
import { UploadIcon } from './icons/UploadIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { SearchIcon } from './icons/SearchIcon';
import { useTranslations } from '../hooks/useTranslations';

export const PrecedentSearch: React.FC = () => {
  const [documentText, setDocumentText] = useState('');
  const [fileName, setFileName] = useState('');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<RAGResult | null>(null);
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

  const handleSearch = useCallback(async () => {
    if (!query.trim() || !documentText.trim()) {
      setError("Please upload a document and enter a search query.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const searchResult = await performRAGSearch(query, documentText);
      setResult(searchResult);
    } catch (e) {
      console.error(e);
      setError("An error occurred during the search. The AI model may have returned an invalid response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [query, documentText]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-4">{t.precedentSearch.title}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-[rgb(var(--card))] p-6 rounded-lg shadow-md border border-[rgb(var(--border))]">
          <h3 className="text-xl font-semibold mb-4 text-[rgb(var(--card-foreground))]">{t.precedentSearch.uploadTitle}</h3>
          <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-[rgb(var(--background))] border-2 border-[rgb(var(--border))] border-dashed rounded-md appearance-none cursor-pointer hover:border-[rgb(var(--primary))] focus:outline-none">
            {fileName ? (
              <div className="text-center">
                <FileTextIcon className="mx-auto h-8 w-8 text-green-500" />
                <span className="mt-2 block text-sm font-medium text-[rgb(var(--foreground))]">{fileName}</span>
              </div>
            ) : (
              <div className="text-center">
                <UploadIcon className="mx-auto h-8 w-8 text-[rgb(var(--muted-foreground))]" />
                <span className="mt-2 block text-sm font-medium text-[rgb(var(--muted-foreground))]">{t.precedentSearch.uploadButton}</span>
              </div>
            )}
            <input type="file" className="hidden" onChange={handleFileChange} accept=".txt" disabled={isLoading} />
          </label>

          <h3 className="text-xl font-semibold mb-2 mt-6 text-[rgb(var(--card-foreground))]">{t.precedentSearch.questionTitle}</h3>
          <p className="text-sm text-[rgb(var(--muted-foreground))] mb-4">{t.precedentSearch.questionDescription}</p>
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.precedentSearch.placeholder}
              className="w-full h-24 p-3 pr-12 border border-[rgb(var(--border))] rounded-md focus:ring-2 focus:ring-[rgb(var(--ring))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
              disabled={isLoading || !documentText}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading || !query || !documentText}
            className="mt-4 w-full px-6 py-3 bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] font-semibold rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? <><Spinner /> {t.precedentSearch.searching}</> : <><SearchIcon className="w-5 h-5" /> {t.search}</>}
          </button>
        </div>

        {/* Output Section */}
        <div className="bg-[rgb(var(--card))] p-6 rounded-lg shadow-md border border-[rgb(var(--border))]">
          <h3 className="text-xl font-semibold mb-4 text-[rgb(var(--card-foreground))]">{t.precedentSearch.insightsTitle}</h3>
          {isLoading && (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <Spinner />
                    <p className="mt-2 text-[rgb(var(--muted-foreground))]">{t.precedentSearch.analyzing}</p>
                </div>
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-700 px-4 py-3 rounded-lg" role="alert">
              <p><strong className="font-bold">{t.error}: </strong>{error}</p>
            </div>
          )}
          {result && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-[rgb(var(--card-foreground))]">{t.precedentSearch.answer}</h4>
                <p className="mt-1 text-[rgb(var(--foreground))] bg-[rgb(var(--muted))] p-3 rounded-md">{result.answer}</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-[rgb(var(--card-foreground))]">{t.precedentSearch.citations}</h4>
                <div className="mt-2 space-y-3">
                  {result.citations.map((citation, index) => (
                    <blockquote key={index} className="border-l-4 border-[rgb(var(--accent))] pl-4 text-[rgb(var(--muted-foreground))] italic">
                      "{citation}"
                    </blockquote>
                  ))}
                </div>
              </div>
            </div>
          )}
          {!isLoading && !error && !result && (
            <div className="flex items-center justify-center h-full text-center text-[rgb(var(--muted-foreground))]">
                <p>{t.precedentSearch.initial}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};