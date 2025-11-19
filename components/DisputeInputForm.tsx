import React, { useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { Spinner } from './Spinner';
import { useTranslations } from '../hooks/useTranslations';

interface DisputeInputFormProps {
  onAnalyze: (disputeText: string) => void;
  isLoading: boolean;
}

export const DisputeInputForm: React.FC<DisputeInputFormProps> = ({ onAnalyze, isLoading }) => {
  const [disputeText, setDisputeText] = useState('');
  const [fileName, setFileName] = useState('');
  const t = useTranslations();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setDisputeText(text);
        setFileName(file.name);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid .txt file.");
      setFileName('');
    }
    // Reset file input value to allow re-uploading the same file
    event.target.value = '';
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAnalyze(disputeText);
  };

  return (
    <div className="bg-[rgb(var(--card))] p-6 rounded-xl shadow-custom-lg border border-[rgb(var(--border))] mb-8">
      <h2 className="text-2xl font-semibold mb-2 text-[rgb(var(--card-foreground))]">{t.disputeInput.title}</h2>
      <p className="text-[rgb(var(--muted-foreground))] mb-6">
        {t.disputeInput.description}
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={disputeText}
          onChange={(e) => setDisputeText(e.target.value)}
          placeholder={t.disputeInput.placeholder}
          className="w-full h-48 p-3 border border-[rgb(var(--border))] rounded-md focus:ring-2 focus:ring-[rgb(var(--ring))] focus:border-[rgb(var(--primary))] transition duration-200 bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
          disabled={isLoading}
        />
        
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--muted))] text-[rgb(var(--muted-foreground))] rounded-md cursor-pointer hover:bg-[rgb(var(--border))] transition">
            <UploadIcon className="w-5 h-5" />
            <span>{fileName ? t.disputeInput.uploading.replace('{fileName}', fileName) : t.disputeInput.upload}</span>
            <input type="file" className="hidden" onChange={handleFileChange} accept=".txt" disabled={isLoading} />
          </label>
          <button
            type="submit"
            disabled={isLoading || !disputeText}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] text-[rgb(var(--primary-foreground))] font-semibold rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading ? <><Spinner /> {t.disputeInput.analyzing}</> : t.disputeInput.analyze}
          </button>
        </div>
      </form>
      <p className="text-xs text-[rgb(var(--muted-foreground))] mt-6 text-center">
        <strong>{t.disputeInput.privacy}</strong> {t.disputeInput.privacyDetails}
      </p>
    </div>
  );
};
