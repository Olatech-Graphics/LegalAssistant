import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { CaseRequest, CaseChatMessage, UserRole, NextStepsResponse } from '../types';
import { Spinner } from './Spinner';
import { CloseIcon } from './icons/CloseIcon';
import { PaperPlaneIcon } from './icons/PaperPlaneIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { DoubleCheckIcon } from './icons/DoubleCheckIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { useTranslations } from '../hooks/useTranslations';


interface CaseChatProps {
    caseRequest: CaseRequest;
    messages: CaseChatMessage[];
    currentUserRole: UserRole;
    onClose: () => void;
    onSendMessage: (text: string) => void;
    getSummary: (history: CaseChatMessage[]) => Promise<string>;
    getSuggestedNextSteps: (history: CaseChatMessage[]) => Promise<NextStepsResponse>;
}

export const CaseChat: React.FC<CaseChatProps> = ({ caseRequest, messages, currentUserRole, onClose, onSendMessage, getSummary, getSuggestedNextSteps }) => {
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summary, setSummary] = useState<string | null>(null);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestionsResult, setSuggestionsResult] = useState<NextStepsResponse | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const t = useTranslations();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Simulate other user typing when they send a message
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role !== currentUserRole) {
                setIsTyping(true);
                const timer = setTimeout(() => setIsTyping(false), 1500);
                return () => clearTimeout(timer);
            }
        }
    }, [messages, currentUserRole]);


    const handleSend = () => {
        if (!input.trim()) return;
        onSendMessage(input);
        setInput('');
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          handleSend();
        }
    };
    
    const handleSummarize = async () => {
        setIsSummarizing(true);
        setSummary(null);
        setSuggestionsResult(null);
        try {
            const result = await getSummary(messages);
            setSummary(result);
        } catch (error) {
            setSummary("Could not generate a summary at this time.");
        } finally {
            setIsSummarizing(false);
        }
    };

    const handleSuggestNextSteps = async () => {
        setIsSuggesting(true);
        setSummary(null);
        setSuggestionsResult(null);
        try {
            const result = await getSuggestedNextSteps(messages);
            setSuggestionsResult(result);
        } catch (error) {
            setSuggestionsResult({ suggestions: [], clarification_needed: "Sorry, I was unable to generate suggestions at this time." });
        } finally {
            setIsSuggesting(false);
        }
    };

    return (
        <div className="bg-[rgb(var(--card))] text-[rgb(var(--card-foreground))] rounded-xl shadow-lg w-full h-full flex flex-col border border-[rgb(var(--border))]">
            {/* Header */}
            <header className="flex justify-between items-center p-4 border-b border-[rgb(var(--border))] flex-shrink-0">
                <div>
                    <h3 className="font-bold text-lg">{t.caseChat.title.replace('{caseId}', caseRequest.id)}</h3>
                    <p className="text-sm text-[rgb(var(--muted-foreground))]">
                        {t.caseChat.conversationWith.replace('{userName}', currentUserRole === 'advocate' ? caseRequest.userName : 'Your Advocate')}
                    </p>
                </div>
                <button onClick={onClose} className="p-2 rounded-full text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))]">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-[rgb(var(--background))]">
                {messages.map((msg, index) => {
                    const isMyMessage = msg.role === currentUserRole;
                    // A message is considered "read" if there is at least one subsequent message from the other party.
                    const hasBeenRead = isMyMessage && messages.slice(index + 1).some(m => m.role !== currentUserRole);

                    return (
                        <div key={msg.id} className={`flex mb-3 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                            <div className={`rounded-lg px-4 py-2 max-w-lg shadow-sm ${isMyMessage ? 'bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]' : 'bg-[rgb(var(--card))] border border-[rgb(var(--border))]'}`}>
                                <p className="text-sm">{msg.text}</p>
                                <div className={`flex items-center gap-1.5 mt-1 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                                    <p className="text-xs opacity-70">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    {hasBeenRead && <DoubleCheckIcon className="w-4 h-4 text-blue-300" />}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="rounded-lg px-4 py-2 bg-[rgb(var(--card))] border border-[rgb(var(--border))] flex items-center shadow-sm">
                            <Spinner />
                            <span className="ml-2 text-sm text-[rgb(var(--muted-foreground))]">{t.caseChat.typing}</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            
             {/* AI Results Section */}
            {(summary || suggestionsResult) && (
                 <div className="p-4 border-t border-[rgb(var(--border))] bg-[rgb(var(--muted))] flex-shrink-0">
                    {summary && (
                        <>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><LightbulbIcon className="w-5 h-5 text-amber-500"/> {t.caseChat.aiSummary}</h4>
                            <div className="text-xs max-h-24 overflow-y-auto prose prose-sm text-[rgb(var(--foreground))] bg-[rgb(var(--background))] p-2 rounded-md" dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }} />
                        </>
                    )}
                    {suggestionsResult && (
                        <>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-sky-500"/> {t.caseChat.aiNextSteps}</h4>
                            <div className="text-xs max-h-24 overflow-y-auto text-[rgb(var(--foreground))] bg-[rgb(var(--background))] p-2 rounded-md">
                                {suggestionsResult.clarification_needed ? (
                                    <p className="italic text-amber-600">{suggestionsResult.clarification_needed}</p>
                                ) : (
                                    <ul className="list-disc list-inside space-y-1">
                                        {suggestionsResult.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}


            {/* Footer */}
            <footer className="p-4 border-t border-[rgb(var(--border))] bg-[rgb(var(--card))] flex-shrink-0">
                <div className="flex items-center gap-2">
                     <button 
                        onClick={handleSuggestNextSteps}
                        disabled={isSuggesting || messages.length === 0}
                        className="p-2 text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--primary))] rounded-full disabled:opacity-50"
                        title={t.caseChat.suggestNextSteps}
                    >
                        {isSuggesting ? <Spinner /> : <SparklesIcon className="w-6 h-6" />}
                    </button>
                    <button 
                        onClick={handleSummarize}
                        disabled={isSummarizing || messages.length === 0}
                        className="p-2 text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--primary))] rounded-full disabled:opacity-50"
                        title={t.caseChat.askForSummary}
                    >
                        {isSummarizing ? <Spinner /> : <LightbulbIcon className="w-6 h-6" />}
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={t.caseChat.placeholder}
                        className="flex-1 bg-[rgb(var(--muted))] border border-[rgb(var(--border))] rounded-full px-4 py-2 focus:ring-2 focus:ring-[rgb(var(--ring))] focus:outline-none"
                    />
                    <button onClick={handleSend} disabled={!input.trim()} className="bg-[rgb(var(--primary))] text-white p-3 rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                        <PaperPlaneIcon className="w-5 h-5" />
                    </button>
                </div>
            </footer>
        </div>
    );
};