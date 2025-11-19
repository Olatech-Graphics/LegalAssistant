import React from 'react';
import { SignalIcon } from './icons/SignalIcon';
import { useTranslations } from '../hooks/useTranslations';

export const LiveCaseFeed: React.FC = () => {
  const t = useTranslations();
  // Mock data to simulate live updates
  const feedItems = [
    { time: '14:32:15', event: 'Motion to suppress filed by defense.', case: 'C-2024-1138' },
    { time: '14:31:58', event: 'Evidence log #78B submitted by prosecution.', case: 'C-2024-1138' },
    { time: '14:29:04', event: 'Case #C-2024-1255 hearing scheduled.', case: 'C-2024-1255' },
    { time: '14:28:11', event: 'Witness testimony recorded.', case: 'C-2024-1138' },
  ];

  return (
    <div className="bg-[rgb(var(--card))] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-[rgb(var(--card-foreground))] flex items-center">
        <SignalIcon className="w-6 h-6 mr-2 text-red-500 animate-pulse" />
        {t.liveCaseFeed.title}
      </h2>
      <div className="space-y-3 text-sm max-h-48 overflow-y-auto">
        {feedItems.map((item, index) => (
          <div key={index} className="flex items-start">
            <span className="font-mono text-[rgb(var(--muted-foreground))] mr-3">{item.time}</span>
            <p className="text-[rgb(var(--foreground))]">
              <span className="font-semibold">{item.case}:</span> {item.event}
            </p>
          </div>
        ))}
      </div>
       <p className="text-xs text-[rgb(var(--muted-foreground))] mt-4 text-center">{t.liveCaseFeed.simulated}</p>
    </div>
  );
};