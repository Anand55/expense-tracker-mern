import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import categoriesRoutes from './modules/categories/categories.routes';
import expensesRoutes from './modules/expenses/expenses.routes';
import summaryRoutes from './modules/summary/summary.routes';

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/summary', summaryRoutes);

app.get('/api/health', (_req, res) => {
  const db = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ status: 'ok', db });
});

app.use(errorHandler);

export default app;
