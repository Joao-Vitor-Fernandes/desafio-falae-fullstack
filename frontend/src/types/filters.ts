import type { FeedbackChannel, FeedbackStatus } from './feedback';

export type Filters = {
    search: string;
    channel: FeedbackChannel | '';
    status: FeedbackStatus | '';
    rating: string;
};

export const EMPTY_FILTERS: Filters = {
    search: '',
    channel: '',
    status: '',
    rating: '',
};