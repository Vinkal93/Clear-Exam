import { Router } from 'express';

export const v1Router = Router();

// Version 1 router mounted at /v1
v1Router.get('/status', (req, res) => {
  res.status(200).json({
    version: 'v1',
    status: 'operational',
    timestamp: new Date().toISOString(),
    requestId: req.id
  });
});
