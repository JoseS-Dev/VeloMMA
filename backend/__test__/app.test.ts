import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '../app.js';

describe('GET /api/v1', () => {
  it('debe devolver un mensaje de bienvenida', async () => {
    const response = await request(app).get('/api/v1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Bienvenido a la API de VeloMMA');
  });
});