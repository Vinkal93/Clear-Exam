import { Router, Request, Response } from 'express';
import { env } from '../config/env';

export const healthRouter = Router();

healthRouter.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'pass',
    service: 'clearexam-api',
    version: '1.0.0',
    environment: env.NODE_ENV,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    requestId: req.id,
    checks: {
      systemMemory: {
        status: 'pass',
        freeMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
      },
      firebase: {
        status: env.FIREBASE_AUTH_EMULATOR_HOST || env.FIREBASE_PROJECT_ID ? 'configured' : 'unconfigured',
        projectId: env.FIREBASE_PROJECT_ID,
        mode: env.FIREBASE_AUTH_EMULATOR_HOST ? 'emulator' : 'cloud'
      }
    }
  });
});
