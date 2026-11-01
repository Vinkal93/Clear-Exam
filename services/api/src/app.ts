import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { requestIdMiddleware } from './middleware/requestId';
import { errorHandler } from './middleware/errorHandler';
import { healthRouter } from './routes/health';
import { v1Router } from './routes/v1';

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json({ limit: '2mb' }));
  app.use(requestIdMiddleware);

  // Health route
  app.use('/healthz', healthRouter);

  // API v1
  app.use('/v1', v1Router);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      code: 'RESOURCE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.path}`,
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  });

  // Central error boundary
  app.use(errorHandler);

  return app;
}
