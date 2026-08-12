import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import feedbackRoutes from './routes/feedback.routes';

const app = express();

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// Rota teste
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', feedbackRoutes);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});