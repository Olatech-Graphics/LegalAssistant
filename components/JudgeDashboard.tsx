import React, { useState } from 'react';
import { ExplainableAI } from './ExplainableAI';
import { LiveCaseFeed } from './LiveCaseFeed';
import { BlockchainLog } from './BlockchainLog';
import { FEATURE_FLAGS } from '../featureFlags';
import { BiasMonitor } from './addons/BiasMonitor';
import { EyeIcon } from './icons/EyeIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { useTranslations } from '../hooks/useTranslations';

type JudgeView = 'explainability' | 'biasmonitor';

export const JudgeDashboard: React.FC = () => {
    const [activeView, setActiveView] = useState<JudgeView>('explainability');
    const t = useTranslations();

  return (
    <div>
        <h1 className="text-3xl font-bold text-[rgb(var(--foreground))] mb-6">{t.judgeDashboard.title}</h1>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Content: Explainable AI & Add-ons */}
            <div className="xl:col-span-2">
                 <div className="bg-[rgb(var(--card))] p-6 rounded-lg shadow-md h-full flex flex-col">
                    {FEATURE_FLAGS.aiBiasMonitor && (
                         <div className="border-b border-[rgb(var(--border))] mb-4">
                            <nav className="-mb-px flex space-x-6">
                                <button onClick={() => setActiveView('explainability')} className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeView === 'explainability' ? 'border-[rgb(var(--primary))] text-[rgb(var(--primary))]' : 'border-transparent text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))]'}`}>
                                    <EyeIcon className="w-5 h-5"/>
                                    {t.judgeDashboard.explainableAI}
                                </button>
                                <button onClick={() => setActiveView('biasmonitor')} className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeView === 'biasmonitor' ? 'border-[rgb(var(--primary))] text-[rgb(var(--primary))]' : 'border-transparent text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))]'}`}>
                                    <ShieldCheckIcon className="w-5 h-5"/>
                                    {t.judgeDashboard.biasMonitor}
                                </button>
                            </nav>
                        </div>
                    )}
                   
                    {activeView === 'explainability' && <ExplainableAI />}
                    {activeView === 'biasmonitor' && FEATURE_FLAGS.aiBiasMonitor && <BiasMonitor />}
                 </div>
            </div>

            {/* Side Content: Transparency Layers */}
            <div className="space-y-6">
                <LiveCaseFeed />
                <BlockchainLog />
            </div>
        </div>
    </div>
  );
};