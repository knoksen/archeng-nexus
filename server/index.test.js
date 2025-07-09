const request = require('supertest');
const app = require('./index');

describe('POST /api/contact', () => {
  test('responds with status ok', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Test', email: 'test@example.com', message: 'hi' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
