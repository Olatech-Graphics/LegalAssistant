import React, { useState } from 'react';
import type { AppNotification } from '../../types';
import { MailIcon } from '../icons/MailIcon';
import { FeatherIcon } from '../icons/FeatherIcon';
import { GavelIcon } from '../icons/GavelIcon';
import { useTranslations } from '../../hooks/useTranslations';

const initialNotifications: AppNotification[] = [
    { id: 1, icon: 'case', message: 'New case request received from Priya Desai.', timestamp: '2 minutes ago', read: false },
    { id: 2, icon: 'draft', message: 'AI Draft for "Vakalatnama - REQ003" is complete.', timestamp: '1 hour ago', read: false },
    { id: 3, icon: 'system', message: 'System update: Precedent database synchronized.', timestamp: '3 hours ago', read: true },
    { id: 4, icon: 'case', message: 'Case REQ001 has been accepted.', timestamp: 'Yesterday', read: true },
];

const NotificationIcon: React.FC<{ icon: AppNotification['icon'] }> = ({ icon }) => {
    const baseClass = "w-5 h-5";
    switch(icon) {
        case 'case': return <MailIcon className={`${baseClass} text-blue-500`} />;
        case 'draft': return <FeatherIcon className={`${baseClass} text-green-500`} />;
        case 'system': return <GavelIcon className={`${baseClass} text-slate-500`} />;
    }
};

export const Notifications: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const t = useTranslations();
    const [notifications, setNotifications] = useState(initialNotifications);

    const handleMarkAllRead = () => {
        setNotifications(currentNotifications => 
            currentNotifications.map(n => ({ ...n, read: true }))
        );
    };

    return (
        <div className="absolute right-0 mt-2 w-80 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg shadow-xl z-50">
            <div className="p-3 border-b border-[rgb(var(--border))]">
                <h3 className="font-semibold text-sm text-[rgb(var(--card-foreground))]">{t.notifications.title}</h3>
            </div>
            <div className="divide-y divide-[rgb(var(--border))] max-h-96 overflow-y-auto">
                {notifications.map(notification => (
                    <div key={notification.id} className={`p-3 hover:bg-[rgb(var(--muted))] flex items-start gap-3 ${!notification.read ? 'bg-blue-500/5' : ''}`}>
                        <div className="mt-1">
                            <NotificationIcon icon={notification.icon} />
                        </div>
                        <div>
                            <p className="text-sm text-[rgb(var(--foreground))]">{notification.message}</p>
                            <p className="text-xs text-[rgb(var(--muted-foreground))] mt-0.5">{notification.timestamp}</p>
                        </div>
                         {!notification.read && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5 ml-auto"></div>}
                    </div>
                ))}
            </div>
             <div className="p-2 border-t border-[rgb(var(--border))] text-center">
                <button 
                    onClick={handleMarkAllRead}
                    className="text-xs font-medium text-[rgb(var(--primary))] hover:underline"
                >
                    {t.notifications.markAllRead}
                </button>
            </div>
        </div>
    );
};