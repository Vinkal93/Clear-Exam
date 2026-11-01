import { Router } from 'express';
import { authRouter } from './auth';
import { adminUsersRouter } from './admin/users';
import { publicCatalogRouter } from './catalog';
import { adminCatalogRouter } from './admin/catalog';
import { adminQuestionsRouter } from './admin/questions';

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

// Public dynamic exam catalog (read-only for students/guests)
v1Router.use('/catalog', publicCatalogRouter);

// Super Admin dynamic catalog management (RBAC guarded)
v1Router.use('/admin/catalog', adminCatalogRouter);

// Question bank authoring, review, and import endpoints (RBAC guarded)
v1Router.use('/admin/questions', adminQuestionsRouter);
