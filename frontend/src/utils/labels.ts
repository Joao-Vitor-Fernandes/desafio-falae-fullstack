import type { FeedbackChannel, FeedbackStatus } from '../types/feedback';

export const CHANNEL_LABELS: Record<FeedbackChannel, string> = {
    GOOGLE: 'Google',
    IFOOD: 'iFood',
    PESQUISA: 'Pesquisa',
};

export const STATUS_LABELS: Record<FeedbackStatus, string> = {
    NOVO: 'Novo',
    EM_ANALISE: 'Em análise',
    CONCLUIDO: 'Concluído',
};

export const STATUS_BADGE_CLASSES: Record<FeedbackStatus, string> = {
    NOVO: 'bg-blue-100 text-blue-700',
    EM_ANALISE: 'bg-amber-100 text-amber-700',
    CONCLUIDO: 'bg-green-100 text-green-700',
};