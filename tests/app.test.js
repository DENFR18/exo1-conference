const request = require('supertest');
const app = require('../src/index');

describe('Routes API', () => {
  test('GET /health retourne status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.version).toBeDefined();
  });

  test('GET /api/info retourne les infos de l\'app', async () => {
    const res = await request(app).get('/api/info');
    expect(res.statusCode).toBe(200);
    expect(res.body.app).toBe('Demo Web App');
    expect(res.body.stack).toBeDefined();
  });
});
