import { Router } from 'express';
import {
  listFeedbacks,
  getFeedbackById,
  listFeedbackNotes,
  addFeedbackNote,
  updateFeedbackStatus,
} from '../controllers/feedback.controller';

const router = Router();

router.get('/feedbacks', listFeedbacks);
router.get('/feedbacks/:id', getFeedbackById);
router.get('/feedbacks/:id/notes', listFeedbackNotes);
router.post('/feedbacks/:id/notes', addFeedbackNote);
router.patch('/feedbacks/:id/status', updateFeedbackStatus);

export default router;