import { useEffect, useState, type FormEvent } from 'react';
import type { Feedback, FeedbackNote, FeedbackStatus } from '../types/feedback';
import { FEEDBACK_STATUSES } from '../types/feedback';
import {
    getFeedback,
    listFeedbackNotes,
    addFeedbackNote,
    updateFeedbackStatus,
} from '../api/feedbacks';
import { ApiError } from '../api/client';
import { CHANNEL_LABELS, STATUS_LABELS, STATUS_BADGE_CLASSES } from '../utils/labels';
import { formatDate } from '../utils/formatDate';
import { RatingStars } from './RatingStars';

type FeedbackDetailModalProps = {
    feedbackId: number;
    onClose: () => void;
    onStatusChanged: () => void;
};

export function FeedbackDetailModal({ feedbackId, onClose, onStatusChanged }: FeedbackDetailModalProps) {
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [notes, setNotes] = useState<FeedbackNote[]>([]);
    const [loadStatus, setLoadStatus] = useState<'loading' | 'success' | 'error'>('loading');

    const [noteText, setNoteText] = useState('');
    const [submittingNote, setSubmittingNote] = useState(false);
    const [noteError, setNoteError] = useState<string | null>(null);
    const [noteSuccess, setNoteSuccess] = useState(false);

    const [changingStatus, setChangingStatus] = useState(false);
    const [statusError, setStatusError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoadStatus('loading');

        Promise.all([getFeedback(feedbackId), listFeedbackNotes(feedbackId)])
            .then(([feedbackResult, notesResult]) => {
                if (cancelled) return;
                setFeedback(feedbackResult);
                setNotes(notesResult);
                setLoadStatus('success');
            })
            .catch(() => {
                if (cancelled) return;
                setLoadStatus('error');
            });

        return () => { cancelled = true; };
    }, [feedbackId]);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') onClose();
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    async function handleAddNote(event: FormEvent) {
        event.preventDefault();
        setNoteError(null);
        setNoteSuccess(false);

        const trimmed = noteText.trim();
        if (trimmed.length === 0) {
            setNoteError('A anotação não pode ficar em branco.');
            return;
        }

        setSubmittingNote(true);
        try {
            const created = await addFeedbackNote(feedbackId, trimmed);
            setNotes((current) => [created, ...current]);
            setNoteText('');
            setNoteSuccess(true);
        } catch (error) {
            setNoteError(error instanceof Error ? error.message : 'Erro ao registrar a anotação.');
        } finally {
            setSubmittingNote(false);
        }
    }

    async function handleStatusChange(newStatus: FeedbackStatus) {
        if (!feedback || newStatus === feedback.status) return;

        setChangingStatus(true);
        setStatusError(null);

        try {
            const updated = await updateFeedbackStatus(feedbackId, newStatus);
            setFeedback(updated);
            onStatusChanged();
        } catch (error) {
            if (error instanceof ApiError) {
                setStatusError(error.message);
            } else {
                setStatusError('Erro ao atualizar o status.');
            }
        } finally {
            setChangingStatus(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-lg font-semibold text-slate-800">Detalhes do feedback</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none" aria-label="Fechar">
                            ×
                        </button>
                    </div>

                    {loadStatus === 'loading' && <p className="text-slate-400 text-center py-8">Carregando...</p>}
                    {loadStatus === 'error' && (
                        <p className="text-red-600 text-center py-8">Erro ao carregar os detalhes do feedback.</p>
                    )}

                    {loadStatus === 'success' && feedback && (
                        <>
                            <div className="mb-5 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-medium text-slate-800">{feedback.customerName}</h3>
                                    <RatingStars rating={feedback.rating} />
                                </div>
                                <p className="text-sm text-slate-500">
                                    {CHANNEL_LABELS[feedback.channel]} · {formatDate(feedback.createdAt)}
                                </p>
                                {feedback.comment && (
                                    <p className="text-sm text-slate-700 mt-2 bg-slate-50 rounded-md p-3">{feedback.comment}</p>
                                )}
                            </div>

                            <div className="mb-5">
                                <label className="block text-sm text-slate-600 mb-1">Status</label>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <select
                                        value={feedback.status}
                                        onChange={(event) => handleStatusChange(event.target.value as FeedbackStatus)}
                                        disabled={changingStatus}
                                        className="border border-slate-300 rounded-md px-3 py-2 text-sm disabled:opacity-50"
                                    >
                                        {FEEDBACK_STATUSES.map((s) => (
                                            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                                        ))}
                                    </select>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_BADGE_CLASSES[feedback.status]}`}>
                                        {STATUS_LABELS[feedback.status]}
                                    </span>
                                    {changingStatus && <span className="text-xs text-slate-400">Atualizando...</span>}
                                </div>
                                {statusError && (
                                    <p className="text-sm text-red-600 mt-2 bg-red-50 border border-red-200 rounded-md p-2">
                                        {statusError}
                                    </p>
                                )}
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-slate-700 mb-2">Anotações internas ({notes.length})</h4>
                                {notes.length === 0 && (
                                    <p className="text-sm text-slate-400 mb-3">Nenhuma anotação registrada ainda.</p>
                                )}
                                <ul className="space-y-2 mb-4">
                                    {notes.map((note) => (
                                        <li key={note.id} className="bg-slate-50 rounded-md p-3">
                                            <p className="text-sm text-slate-700">{note.description}</p>
                                            <p className="text-xs text-slate-400 mt-1">{formatDate(note.createdAt)}</p>
                                        </li>
                                    ))}
                                </ul>

                                <form onSubmit={handleAddNote} className="space-y-2">
                                    <textarea
                                        value={noteText}
                                        onChange={(event) => { setNoteText(event.target.value); setNoteError(null); }}
                                        placeholder="Escreva uma anotação..."
                                        rows={3}
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                                    />
                                    {noteError && <p className="text-sm text-red-600">{noteError}</p>}
                                    {noteSuccess && !noteError && <p className="text-sm text-green-600">Anotação registrada com sucesso.</p>}
                                    <button
                                        type="submit"
                                        disabled={submittingNote}
                                        className="px-4 py-2 text-sm rounded-md bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 transition-colors"
                                    >
                                        {submittingNote ? 'Salvando...' : 'Adicionar anotação'}
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}