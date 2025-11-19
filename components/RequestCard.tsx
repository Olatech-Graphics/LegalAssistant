import React from 'react';
import type { CaseRequest } from '../types';
import { ChatIcon } from './icons/ChatIcon';
import { useTranslations } from '../hooks/useTranslations';

interface RequestCardProps {
    request: CaseRequest;
    onAccept?: () => void;
    onReject?: () => void;
    onOpenChat?: (caseId: string) => void;
}

const StatusBadge: React.FC<{ status: CaseRequest['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full";
    switch (status) {
        case 'Accepted':
            return <span className={`${baseClasses} bg-green-100 text-green-800`}>Accepted</span>;
        case 'Rejected':
            return <span className={`${baseClasses} bg-red-100 text-red-800`}>Rejected</span>;
        case 'Pending':
            return <span className={`${baseClasses} bg-amber-100 text-amber-800 animate-pulse`}>Pending</span>;
        default:
            return null;
    }
};

const UrgencyBadge: React.FC<{ urgency: CaseRequest['urgency'] }> = ({ urgency }) => {
    const baseClasses = "px-2 py-0.5 text-xs font-medium rounded";
     switch (urgency) {
        case 'High':
            return <span className={`${baseClasses} bg-red-500/10 text-red-700`}>High Urgency</span>;
        case 'Medium':
            return <span className={`${baseClasses} bg-amber-500/10 text-amber-700`}>Medium Urgency</span>;
        case 'Low':
            return <span className={`${baseClasses} bg-sky-500/10 text-sky-700`}>Low Urgency</span>;
        default:
            return null;
    }
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onAccept, onReject, onOpenChat }) => {
    const t = useTranslations();
    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    const isClickable = request.status === 'Accepted' && onOpenChat;

    return (
        <div 
            onClick={isClickable ? () => onOpenChat(request.id) : undefined}
            className={`bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg shadow-sm p-4 transition-all ${isClickable ? 'hover:shadow-md hover:border-[rgb(var(--primary))] cursor-pointer' : ''}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-[rgb(var(--card-foreground))]">{request.userName}</h3>
                    <p className="text-xs text-[rgb(var(--muted-foreground))]">{t.requestCard.received.replace('{timeAgo}', timeAgo(request.timestamp))}</p>
                </div>
                <div className="flex items-center gap-2">
                    {isClickable && <ChatIcon className="w-5 h-5 text-[rgb(var(--primary))]"/>}
                    <StatusBadge status={request.status} />
                </div>
            </div>
            <p className="text-sm text-[rgb(var(--foreground))] my-3 p-3 bg-[rgb(var(--muted))] rounded-md">{request.caseSummary}</p>

            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[rgb(var(--muted-foreground))]">{t.requestCard.domain}:</span>
                    <span className="text-xs font-medium bg-[rgb(var(--secondary))] text-[rgb(var(--secondary-foreground))] px-2 py-0.5 rounded">{request.legalDomain}</span>
                    <UrgencyBadge urgency={request.urgency} />
                </div>
                {request.status === 'Pending' && onAccept && onReject && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); onReject(); }}
                            className="px-4 py-1.5 text-sm font-semibold text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                        >
                            {t.requestCard.reject}
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onAccept(); }}
                            className="px-4 py-1.5 text-sm font-semibold text-[rgb(var(--primary-foreground))] bg-[rgb(var(--primary))] rounded-md hover:opacity-90 transition-opacity"
                        >
                            {t.requestCard.accept}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};