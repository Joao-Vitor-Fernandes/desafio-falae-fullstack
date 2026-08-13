import { apiFetch } from './client';
import type { Feedback, FeedbackListResponse, FeedbackNote, FeedbackStatus } from '../types/feedback';
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

export function getFeedback(id: number): Promise<Feedback> {
    return apiFetch<Feedback>(`/feedbacks/${id}`);
}

export function listFeedbackNotes(id: number): Promise<FeedbackNote[]> {
    return apiFetch<FeedbackNote[]>(`/feedbacks/${id}/notes`);
}

export function addFeedbackNote(id: number, description: string): Promise<FeedbackNote> {
    return apiFetch<FeedbackNote>(`/feedbacks/${id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ description }),
    });
}

export function updateFeedbackStatus(id: number, status: FeedbackStatus): Promise<Feedback> {
    return apiFetch<Feedback>(`/feedbacks/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
}