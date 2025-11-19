import React from 'react';
import { CalendarIcon } from '../icons/CalendarIcon';
import { useTranslations } from '../../hooks/useTranslations';

// Mock data for calendar events
const events = [
  { day: 3, title: "Hearing: REQ003" },
  { day: 10, title: "Filing Deadline: Sharma Case" },
  { day: 11, title: "Client Meeting: Priya Desai" },
  { day: 25, title: "Reply Submission" },
];

const CalendarDay: React.FC<{ day: number; event?: { title: string } }> = ({ day, event }) => {
  const isToday = day === 8; // Assuming today is the 8th for demo
  return (
    <div className={`border border-[rgb(var(--border))] bg-[rgb(var(--background))] p-2 h-24 flex flex-col`}>
      <time className={`text-xs font-semibold ${isToday ? 'bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] rounded-full w-5 h-5 flex items-center justify-center' : ''}`}>
        {day}
      </time>
      {event && (
        <div className="mt-1 text-xs bg-blue-500/10 text-blue-700 dark:text-blue-300 p-1 rounded-md overflow-hidden truncate">
          {event.title}
        </div>
      )}
    </div>
  );
};

export const SmartCalendar: React.FC = () => {
    const t = useTranslations();
    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div>
      <h1 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-4 flex items-center gap-2">
        <CalendarIcon className="w-6 h-6" /> {t.smartCalendar.title}
      </h1>
      <div className="bg-[rgb(var(--card))] p-6 rounded-lg shadow-md border border-[rgb(var(--border))]">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{t.smartCalendar.month}</h2>
            <div className="text-sm text-[rgb(var(--muted-foreground))]">
                {t.smartCalendar.placeholder}
            </div>
        </div>
        <div className="grid grid-cols-7 gap-px bg-[rgb(var(--border))] border border-[rgb(var(--border))]">
            {t.smartCalendar.days.map((day: string) => (
                <div key={day} className="text-center text-xs font-bold py-2 bg-[rgb(var(--muted))] text-[rgb(var(--muted-foreground))]">{day}</div>
            ))}
            {daysInMonth.map(day => {
                const event = events.find(e => e.day === day);
                return <CalendarDay key={day} day={day} event={event} />;
            })}
        </div>
        <p className="text-center text-sm text-[rgb(var(--muted-foreground))] mt-4">
            {t.smartCalendar.description}
        </p>
      </div>
    </div>
  );
};