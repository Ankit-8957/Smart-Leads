import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;