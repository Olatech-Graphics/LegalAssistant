import React, { useEffect, useRef } from 'react';
import type { Chart } from 'chart.js';
import type { ChartData } from '../types';
import { useTranslations } from '../hooks/useTranslations';

declare global {
    interface Window {
        Chart: typeof Chart;
    }
}

const RulingDistributionChart: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);
    const t = useTranslations();

    const data: ChartData = {
        labels: ['Affirmed', 'Reversed', 'Remanded', 'Dismissed'],
        datasets: [{
            label: 'Ruling Distribution',
            data: [65, 18, 12, 5],
            backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 99, 132, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(153, 102, 255, 0.7)',
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1
        }]
    };

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstance.current = new window.Chart(ctx, {
                    type: 'doughnut',
                    data: data,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: t.judicialAnalytics.rulingDistribution }
                        }
                    }
                });
            }
        }
        return () => chartInstance.current?.destroy();
    }, [t]);

    return <canvas ref={chartRef}></canvas>;
};

const StatuteFrequencyChart: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);
    const t = useTranslations();
    
    const data: ChartData = {
        labels: ['Statute 198.A', 'Precedent B v. C', 'Regulation 42-CFR', 'Statute 210.F', 'Precedent X v. Y'],
        datasets: [{
            label: 'Citations in Past 100 Cases',
            data: [82, 65, 41, 35, 19],
            backgroundColor: ['rgba(75, 192, 192, 0.7)'],
            borderColor: ['rgba(75, 192, 192, 1)'],
            borderWidth: 1
        }]
    };
    
    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstance.current = new window.Chart(ctx, {
                    type: 'bar',
                    data: data,
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        plugins: {
                            legend: { display: false },
                            title: { display: true, text: t.judicialAnalytics.statuteFrequency }
                        },
                         scales: {
                            x: { beginAtZero: true }
                        }
                    }
                });
            }
        }
        return () => chartInstance.current?.destroy();
    }, [t]);

    return <canvas ref={chartRef}></canvas>;
}


export const JudicialAnalyticsDashboard: React.FC = () => {
  const t = useTranslations();
  return (
    <div>
      <h1 className="text-3xl font-bold text-[rgb(var(--foreground))] mb-6">{t.judicialAnalytics.title}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[rgb(var(--card))] p-6 rounded-lg shadow-md">
            <RulingDistributionChart />
        </div>
        <div className="bg-[rgb(var(--card))] p-6 rounded-lg shadow-md">
            <StatuteFrequencyChart />
        </div>
      </div>
    </div>
  );
};