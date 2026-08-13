import type { Indicators } from '../types/feedback';

type IndicatorsPanelProps = {
    indicators: Indicators | null;
};

export function IndicatorsPanel({ indicators }: IndicatorsPanelProps) {
    const cards = [
        { label: 'Total de feedbacks', value: indicators ? indicators.total : '—' },
        { label: 'Nota média', value: indicators ? indicators.averageRating.toFixed(1) : '—' },
        { label: 'Positivos', value: indicators ? indicators.positiveCount : '—' },
        { label: 'Críticos', value: indicators ? indicators.criticalCount : '—' },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {cards.map((card) => (
                <div key={card.label} className="bg-white rounded-lg shadow p-4 text-center">
                    <p className="text-2xl font-semibold text-slate-800">{card.value}</p>
                    <p className="text-sm text-slate-500">{card.label}</p>
                </div>
            ))}
        </div>
    );
}