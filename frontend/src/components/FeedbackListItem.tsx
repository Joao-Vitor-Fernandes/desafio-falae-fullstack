import type { Feedback } from '../types/feedback';
import { CHANNEL_LABELS, STATUS_BADGE_CLASSES, STATUS_LABELS } from '../utils/labels';
import { formatDate } from '../utils/formatDate';
import { RatingStars } from './RatingStars';

type FeedbackListItemProps = {
    feedback: Feedback;
    onClick: () => void;
};

export function FeedbackListItem({ feedback, onClick }: FeedbackListItemProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full text-left bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-medium text-slate-800">{feedback.customerName}</h3>
                        <RatingStars rating={feedback.rating} />
                    </div>
                    {feedback.comment && (
                        <p className="text-sm text-slate-500 line-clamp-2">{feedback.comment}</p>
                    )}
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_BADGE_CLASSES[feedback.status]}`}>
                        {STATUS_LABELS[feedback.status]}
                    </span>
                    <span className="text-xs text-slate-400">{CHANNEL_LABELS[feedback.channel]}</span>
                    <span className="text-xs text-slate-400">{formatDate(feedback.createdAt)}</span>
                </div>
            </div>
        </button>
    );
}