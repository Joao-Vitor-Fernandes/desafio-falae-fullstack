import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { FEEDBACK_CHANNELS, FEEDBACK_STATUSES } from '../types';

// #region helpers
function getQueryString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

function parseId(value: string | string[] | undefined): number | null {
  if (typeof value !== 'string') return null;
  const id = Number(value);
  return Number.isInteger(id) ? id : null;
}

async function findFeedbackOrRespond404(id: number, res: Response) {
  const feedback = await prisma.feedback.findUnique({ where: { id } });
  if (!feedback) {
    res.status(404).json({ message: 'Feedback não encontrado.' });
    return null;
  }
  return feedback;
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

// #region GET /api/feedbacks/:id
export async function getFeedbackById(req: Request, res: Response) {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ message: 'Id inválido.' });
      return;
    }

    const feedback = await findFeedbackOrRespond404(id, res);
    if (!feedback) return;

    res.json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar o feedback.' });
  }
}
// #endregion

// #region GET /api/feedbacks/:id/notes
export async function listFeedbackNotes(req: Request, res: Response) {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ message: 'Id inválido.' });
      return;
    }

    const feedback = await findFeedbackOrRespond404(id, res);
    if (!feedback) return;

    const notes = await prisma.feedbackNote.findMany({
      where: { feedbackId: id },
      orderBy: { createdAt: 'desc' },
    });

    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar as anotações.' });
  }
}
// #endregion

// #region POST /api/feedbacks/:id/notes
export async function addFeedbackNote(req: Request, res: Response) {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ message: 'Id inválido.' });
      return;
    }

    const feedback = await findFeedbackOrRespond404(id, res);
    if (!feedback) return;

    const rawDescription = req.body?.description;
    const description = typeof rawDescription === 'string' ? rawDescription.trim() : '';

    if (description.length === 0) {
      res.status(400).json({
        message: 'A descrição da anotação é obrigatória e não pode conter apenas espaços.',
      });
      return;
    }

    const note = await prisma.feedbackNote.create({
      data: { feedbackId: id, description },
    });

    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar a anotação.' });
  }
}
// #endregion

// #region PATCH /api/feedbacks/:id/status
export async function updateFeedbackStatus(req: Request, res: Response) {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ message: 'Id inválido.' });
      return;
    }

    const feedback = await findFeedbackOrRespond404(id, res);
    if (!feedback) return;

    const status = req.body?.status;
    if (typeof status !== 'string' || !(FEEDBACK_STATUSES as readonly string[]).includes(status)) {
      res.status(400).json({
        message: `Status inválido. Use um dos seguintes: ${FEEDBACK_STATUSES.join(', ')}.`,
      });
      return;
    }

    // Regra de feedback crítico (nota 1 ou 2)
    const isCritic = feedback.rating <= 2;
    if (isCritic && status === 'CONCLUIDO') {
      const notesCount = await prisma.feedbackNote.count({ where: { feedbackId: id } });
      if (notesCount === 0) {
        res.status(422).json({
          message: 'Adicione pelo menos uma anotação antes de concluir um feedback crítico.',
        });
        return;
      }
    }

    const updated = await prisma.feedback.update({
      where: { id },
      data: { status },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar o status.' });
  }
}
// #endregion