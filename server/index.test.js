const request = require('supertest');

// Configure allowed origins for tests
process.env.ALLOWED_ORIGINS = 'http://allowed.com';
const app = require('./index');

describe('POST /api/contact', () => {
  test('responds with status ok', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Test', email: 'test@example.com', message: 'hi' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('includes CORS headers', async () => {
    const res = await request(app)
      .post('/api/contact')
      .set('Origin', 'http://allowed.com')
      .send({ name: 'Test', email: 'test@example.com', message: 'hi' });
    expect(res.headers['access-control-allow-origin']).toBe('http://allowed.com');
  });

  afterAll(() => {
    delete process.env.ALLOWED_ORIGINS;
  });
});
