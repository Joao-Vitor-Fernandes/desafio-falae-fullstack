import { useEffect, useState } from 'react';
import { listFeedbacks } from '../api/feedbacks';
import type { FeedbackListResponse } from '../types/feedback';
import type { Filters } from '../types/filters';

type FetchStatus = 'loading' | 'success' | 'error';

export function useFeedbacks(filters: Filters) {
    const [data, setData] = useState<FeedbackListResponse | null>(null);
    const [status, setStatus] = useState<FetchStatus>('loading');
    const [errorMessage, setErrorMessage] = useState('');
    const [refetchIndex, setRefetchIndex] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setStatus('loading');

        listFeedbacks(filters)
            .then((result) => {
                if (cancelled) return;
                setData(result);
                setStatus('success');
            })
            .catch((error: unknown) => {
                if (cancelled) return;
                setErrorMessage(error instanceof Error ? error.message : 'Erro desconhecido.');
                setStatus('error');
            });

        return () => { cancelled = true; };
    }, [filters.search, filters.channel, filters.status, filters.rating, refetchIndex]);

    function refetch() {
        setRefetchIndex((current) => current + 1);
    }

    return { data, status, errorMessage, refetch };
}