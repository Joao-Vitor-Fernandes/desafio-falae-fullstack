import { apiFetch } from './client';
import type { FeedbackListResponse } from '../types/feedback';
import type { Filters } from '../types/filters';

export function listFeedbacks(filters: Filters): Promise<FeedbackListResponse> {
    const params = new URLSearchParams();

    if (filters.search) params.set('search', filters.search);
    if (filters.channel) params.set('channel', filters.channel);
    if (filters.status) params.set('status', filters.status);
    if (filters.rating) params.set('rating', filters.rating);

    const query = params.toString();
    return apiFetch<FeedbackListResponse>(`/feedbacks${query ? `?${query}` : ''}`);
}