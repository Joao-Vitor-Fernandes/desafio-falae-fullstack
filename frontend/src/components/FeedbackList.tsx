import type { FeedbackListResponse } from '../types/feedback';
import { FeedbackListItem } from './FeedbackListItem';

type FeedbackListProps = {
    status: 'loading' | 'success' | 'error';
    data: FeedbackListResponse | null;
    errorMessage: string;
    onSelect: (id: number) => void;
};

export function FeedbackList({ status, data, errorMessage, onSelect }: FeedbackListProps) {
    if (status === 'error') {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6 text-center">
                Erro ao carregar feedbacks: {errorMessage}
            </div>
        );
    }

    if (data === null) {
        return <div className="text-slate-400 text-center py-12">Carregando feedbacks...</div>;
    }

    if (data.data.length === 0) {
        return (
            <div className="text-slate-400 text-center py-12">
                Nenhum feedback encontrado com os filtros selecionados.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {data.data.map((feedback) => (
                <FeedbackListItem key={feedback.id} feedback={feedback} onClick={() => onSelect(feedback.id)} />
            ))}
        </div>
    );
}