import { FEEDBACK_CHANNELS, FEEDBACK_STATUSES } from '../types/feedback';
import type { Filters } from '../types/filters';
import { CHANNEL_LABELS, STATUS_LABELS } from '../utils/labels';

type FiltersBarProps = {
    filters: Filters;
    onChange: (updates: Partial<Filters>) => void;
    onClear: () => void;
};

export function FiltersBar({ filters, onChange, onClear }: FiltersBarProps) {
    const hasActiveFilters = Boolean(
        filters.search || filters.channel || filters.status || filters.rating,
    );

    return (
        <div className="bg-white rounded-lg shadow p-4 mb-4 flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
                <label className="block text-sm text-slate-600 mb-1">Buscar</label>
                <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => onChange({ search: e.target.value })}
                    placeholder="Nome do cliente ou comentário..."
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
            </div>

            <div>
                <label className="block text-sm text-slate-600 mb-1">Canal</label>
                <select
                    value={filters.channel}
                    onChange={(e) => onChange({ channel: e.target.value as Filters['channel'] })}
                    className="border border-slate-300 rounded-md px-3 py-2 text-sm"
                >
                    <option value="">Todos</option>
                    {FEEDBACK_CHANNELS.map((channel) => (
                        <option key={channel} value={channel}>{CHANNEL_LABELS[channel]}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm text-slate-600 mb-1">Status</label>
                <select
                    value={filters.status}
                    onChange={(e) => onChange({ status: e.target.value as Filters['status'] })}
                    className="border border-slate-300 rounded-md px-3 py-2 text-sm"
                >
                    <option value="">Todos</option>
                    {FEEDBACK_STATUSES.map((status) => (
                        <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm text-slate-600 mb-1">Nota</label>
                <select
                    value={filters.rating}
                    onChange={(e) => onChange({ rating: e.target.value })}
                    className="border border-slate-300 rounded-md px-3 py-2 text-sm"
                >
                    <option value="">Todas</option>
                    {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n}</option>
                    ))}
                </select>
            </div>

            <button
                type="button"
                onClick={onClear}
                disabled={!hasActiveFilters}
                className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                Limpar filtros
            </button>
        </div>
    );
}