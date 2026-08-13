const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api';

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new ApiError(body?.message ?? `Erro na requisição (${response.status})`, response.status);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}