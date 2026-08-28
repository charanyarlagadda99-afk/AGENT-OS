import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { logger } from './logging/logger.js';
import { errorHandler } from './middleware/error.js';

// Import Routes
import authRoutes from './routes/auth.js';
import agentsRoutes from './routes/agents.js';
import missionsRoutes from './routes/missions.js';
import tasksRoutes from './routes/tasks.js';
import runsRoutes from './routes/runs.js';
import toolsRoutes from './routes/tools.js';
import memoryRoutes from './routes/memory.js';
import workspacesRoutes from './routes/workspaces.js';
import checkpointsRoutes from './routes/checkpoints.js';
import approvalsRoutes from './routes/approvals.js';
import analyticsRoutes from './routes/analytics.js';
import streamRoutes from './routes/stream.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// Middleware
app.use(helmet());

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like server-to-server, Render health checks, or curl)
    if (!origin) return callback(null, true);
    if (process.env.FRONTEND_URL === '*') return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL
    ].filter(Boolean) as string[];

    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive CORS fallback for production Vercel previews
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Production Health Check Endpoint (Required by Render & Antigravity specification)
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'AgentOS API',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentsRoutes);
app.use('/api/missions', missionsRoutes);
app.use('/api', tasksRoutes);
app.use('/api/runs', runsRoutes);
app.use('/api', toolsRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/workspaces', workspacesRoutes);
app.use('/api/checkpoints', checkpointsRoutes);
app.use('/api/approvals', approvalsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/missions', streamRoutes);

// Error handling
app.use(errorHandler);

const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`AgentOS API server running on port ${PORT}`);
});

const gracefulShutdown = () => {
  logger.info('Shutting down gracefully...');
  server.close(() => {
    logger.info('Closed out remaining connections.');
    process.exit(0);
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
