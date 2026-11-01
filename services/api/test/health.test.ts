import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

describe('Health and Governance API', () => {
  const app = createApp();

  it('GET /healthz returns 200 OK with pass status and requestId', async () => {
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('pass');
    expect(res.body.service).toBe('clearexam-api');
    expect(res.body).toHaveProperty('requestId');
    expect(res.headers['x-request-id']).toBeDefined();
  });

  it('GET /v1/status returns 200 operational', async () => {
    const res = await request(app).get('/v1/status');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('operational');
    expect(res.body.version).toBe('v1');
  });

  it('Unknown route returns 404 with standard error envelope', async () => {
    const res = await request(app).get('/unknown-path');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('RESOURCE_NOT_FOUND');
    expect(res.body).toHaveProperty('requestId');
    expect(res.body).toHaveProperty('timestamp');
  });
});
