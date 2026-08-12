import { Router } from 'express';
import {
  listFeedbacks,
  getFeedbackById,
  listFeedbackNotes,
} from '../controllers/feedback.controller';

const router = Router();

router.get('/feedbacks', listFeedbacks);
router.get('/feedbacks/:id', getFeedbackById);
router.get('/feedbacks/:id/notes', listFeedbackNotes);

export default router;