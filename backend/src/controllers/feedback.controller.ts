import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { FEEDBACK_CHANNELS, FEEDBACK_STATUSES } from '../types';

// #region helpers
function getQueryString(value: unknown): string | undefined {
    return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}
// #endregion

// #region GET /api/feedbacks
export async function listFeedbacks(req: Request, res: Response) {
    try {
        const channel = getQueryString(req.query.channel);
        const status = getQueryString(req.query.status);
        const search = getQueryString(req.query.search);
        const ratingParam = getQueryString(req.query.rating);
        const rating = ratingParam !== undefined ? Number(ratingParam) : undefined;

        const where: Prisma.FeedbackWhereInput = {};

        if (channel && (FEEDBACK_CHANNELS as readonly string[]).includes(channel)) {
            where.channel = channel;
        }

        if (status && (FEEDBACK_STATUSES as readonly string[]).includes(status)) {
            where.status = status;
        }

        if (rating !== undefined && Number.isInteger(rating)) {
            where.rating = rating;
        }

        if (search) {
            where.OR = [
                { customerName: { contains: search } },
                { comment: { contains: search } },
            ];
        }

        const feedbacks = await prisma.feedback.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        const total = feedbacks.length;
        const averageRating =
            total > 0
                ? Math.round((feedbacks.reduce((sum, f) => sum + f.rating, 0) / total) * 10) / 10
                : 0;
        const positiveCount = feedbacks.filter((f) => f.rating >= 4).length;
        const criticalCount = feedbacks.filter((f) => f.rating <= 2).length;

        res.json({
            data: feedbacks,
            indicators: { total, averageRating, positiveCount, criticalCount },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar feedbacks.' });
    }
}
// #endregion