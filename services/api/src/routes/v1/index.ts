import { Router } from 'express';
import { authRouter } from './auth';
import { adminUsersRouter } from './admin/users';

export const v1Router = Router();

// Operational status endpoint
v1Router.get('/status', (req, res) => {
  res.status(200).json({
    version: 'v1',
    status: 'operational',
    timestamp: new Date().toISOString(),
    requestId: req.id
  });
});

// Authentication and user profile endpoints
v1Router.use('/auth', authRouter);

// Administrative user & role management endpoints
v1Router.use('/admin/users', adminUsersRouter);
