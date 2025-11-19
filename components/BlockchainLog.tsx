import React from 'react';
import { CubeTransparentIcon } from './icons/CubeTransparentIcon';
import { useTranslations } from '../hooks/useTranslations';

export const BlockchainLog: React.FC = () => {
    const t = useTranslations();
    // Mock data
    const logItems = [
        { block: 893451, hash: '0x2a1d...b8e4', event: 'RULING_ISSUED' },
        { block: 893449, hash: '0x9c3f...a221', event: 'EVIDENCE_SUBMITTED' },
        { block: 893412, hash: '0x1e8b...f04c', event: 'MOTION_FILED' },
        { block: 893401, hash: '0x5d0a...337a', event: 'CASE_CREATED' },
    ];
  return (
    <div className="bg-[rgb(var(--card))] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-[rgb(var(--card-foreground))] flex items-center">
        <CubeTransparentIcon className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" />
        {t.blockchainLog.title}
      </h2>
      <div className="space-y-2 text-sm font-mono max-h-48 overflow-y-auto">
        {logItems.map(item => (
            <div key={item.block} className="p-2 bg-[rgb(var(--background))] rounded-md hover:bg-[rgb(var(--muted))]">
                <p className="text-[rgb(var(--muted-foreground))]">{t.blockchainLog.block}: <span className="text-[rgb(var(--foreground))]">{item.block}</span></p>
                <p className="truncate text-[rgb(var(--muted-foreground))]">{t.blockchainLog.hash}: <span className="text-blue-600 dark:text-blue-400">{item.hash}</span></p>
                <p className="text-[rgb(var(--muted-foreground))]">{t.blockchainLog.event}: <span className="font-sans font-semibold text-[rgb(var(--foreground))] bg-[rgb(var(--border))] px-2 py-0.5 rounded">{item.event}</span></p>
            </div>
        ))}
      </div>
      <p className="text-xs text-[rgb(var(--muted-foreground))] mt-4 text-center">{t.blockchainLog.simulated}</p>
    </div>
  );
};