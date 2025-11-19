import React, { useState, useEffect, useRef } from 'react';
import { createChatSession } from '../services/geminiService';
import type { Chat } from '@google/genai';
import type { GeneralChatMessage } from '../types';
import { Spinner } from './Spinner';
import { CloseIcon } from './icons/CloseIcon';
import { PaperPlaneIcon } from './icons/PaperPlaneIcon';
import { useTranslations } from '../hooks/useTranslations';

interface ChatbotProps {
    onClose: () => void;
    caseContext?: string;
}

export const Chatbot: React.FC<ChatbotProps> = ({ onClose, caseContext }) => {
    const [messages, setMessages] = useState<GeneralChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [chat, setChat] = useState<Chat | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const t = useTranslations();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const systemInstruction = caseContext
            ? `You are an AI Case Assistant. Your role is to help the user with their legal case. You have been provided with the initial summary of their case for context. You should answer questions about their case, explain related legal terms and procedures, and provide general guidance. However, you must not provide legal advice. Always remind the user to consult their assigned advocate for official legal advice. Here is the case summary: \n\n---${caseContext}---\n\n`
            : "You are a helpful legal assistant chatbot for the AI Justice Hub. Your goal is to provide general legal information and guidance based on Indian law. You can help users understand legal terms, processes, and even assist them in describing their case for submission. Do not provide legal advice. If a user asks for legal advice, you must tell them to consult with a qualified lawyer.";
        
        const chatSession = createChatSession(systemInstruction);
        setChat(chatSession);

        const welcomeMessage = caseContext
            ? t.chatbot.welcomeCase
            : t.chatbot.welcomeGeneral;

        setMessages([{ sender: 'bot', text: welcomeMessage }]);
    }, [caseContext, t]);

    const handleSend = async () => {
        if (!input.trim() || !chat) return;

        const userMessage: GeneralChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const stream = await chat.sendMessageStream({ message: currentInput });
            let botResponse = '';
            setMessages(prev => [...prev, { sender: 'bot', text: '' }]);
            
            for await (const chunk of stream) {
                botResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { sender: 'bot', text: botResponse };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { sender: 'bot', text: t.chatbot.error }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-8 right-8 w-full max-w-sm h-[calc(100%-4rem)] max-h-[600px] bg-[rgb(var(--card))] rounded-xl shadow-2xl flex flex-col z-50 border border-[rgb(var(--border))]">
            {/* Header */}
            <header className="flex justify-between items-center p-4 border-b border-[rgb(var(--border))] flex-shrink-0">
                <h3 className="font-bold text-lg">{caseContext ? t.chatbot.caseAssistant : t.chatbot.legalAssistant}</h3>
                <button onClick={onClose} className="p-2 rounded-full text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))]">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-[rgb(var(--background))]">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-lg px-4 py-2 max-w-xs shadow-sm ${msg.sender === 'user' ? 'bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]' : 'bg-[rgb(var(--card))] border border-[rgb(var(--border))]'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="rounded-lg px-4 py-2 bg-[rgb(var(--card))] border border-[rgb(var(--border))] flex items-center shadow-sm">
                            <Spinner />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <footer className="p-4 border-t border-[rgb(var(--border))]">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={t.chatbot.placeholder}
                        className="flex-1 bg-[rgb(var(--muted))] border border-[rgb(var(--border))] rounded-full px-4 py-2 focus:ring-2 focus:ring-[rgb(var(--ring))] focus:outline-none"
                    />
                    <button onClick={handleSend} disabled={!input.trim() || isLoading} className="bg-[rgb(var(--primary))] text-white p-3 rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                        <PaperPlaneIcon className="w-5 h-5" />
                    </button>
                </div>
            </footer>
        </div>
    );
};