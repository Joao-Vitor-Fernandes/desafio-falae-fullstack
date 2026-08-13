import { useState } from 'react';
import { IndicatorsPanel } from '../components/IndicatorsPanel';
import { FiltersBar } from '../components/FiltersBar';
import { FeedbackList } from '../components/FeedbackList';
import { useFeedbacks } from '../hooks/useFeedbacks';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { EMPTY_FILTERS, type Filters } from '../types/filters';

export function HomePage() {
    const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
    const debouncedSearch = useDebouncedValue(filters.search, 400);

    const { data, status, errorMessage } = useFeedbacks({ ...filters, search: debouncedSearch });

    function handleFiltersChange(updates: Partial<Filters>) {
        setFilters((current) => ({ ...current, ...updates }));
    }

    function handleClearFilters() {
        setFilters(EMPTY_FILTERS);
    }

    function handleSelectFeedback(id: number) {
        // A Parte 8 abre o modal/painel de detalhes usando esse id
        console.log('Feedback selecionado:', id);
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <h1 className="text-xl font-semibold text-slate-800">Falaê! Feedbacks</h1>
                    <p className="text-sm text-slate-500">Acompanhamento de feedbacks do restaurante</p>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-6">
                <IndicatorsPanel indicators={data?.indicators ?? null} />

                {status === 'loading' && data !== null && (
                    <p className="text-xs text-slate-400 mb-2">Atualizando...</p>
                )}

                <FiltersBar filters={filters} onChange={handleFiltersChange} onClear={handleClearFilters} />

                <FeedbackList status={status} data={data} errorMessage={errorMessage} onSelect={handleSelectFeedback} />
            </main>
        </div>
    );
}