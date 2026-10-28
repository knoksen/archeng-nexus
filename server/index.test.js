const request = require('supertest');

const { createApp } = require('./index');

let app;

describe('POST /api/contact', () => {
  beforeEach(() => {
    app = createApp({ allowedOrigins: ['http://allowed.com'] });
  });

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

  test('does not grant CORS access to unlisted origins', async () => {
    const res = await request(app)
      .post('/api/contact')
      .set('Origin', 'https://untrusted.example')
      .send({ name: 'Test', email: 'test@example.com', message: 'hi' });

    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  test('exposes a health endpoint for startup verification', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test.each([
    ['/health/live', { status: 'live' }],
    ['/health/ready', { status: 'ready' }],
  ])('exposes non-sensitive health status at %s', async (path, expectedBody) => {
    const res = await request(app).get(path);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expectedBody);
  });

  test('does not trust forwarded IP headers by default', () => {
    expect(app.get('trust proxy')).toBe(false);
  });

  test('rejects invalid email', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Test', email: 'invalid', message: 'hi' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0]).not.toHaveProperty('value');
  });

  test('rejects missing name', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ email: 'test@example.com', message: 'hi' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test('rejects empty message', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Test', email: 'test@example.com', message: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test('rejects non-string fields', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: ['Test'], email: 'test@example.com', message: 'hi' });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].field).toBe('name');
  });

  test('does not log contact form personal data', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await request(app)
      .post('/api/contact')
      .send({ name: 'Private Name', email: 'private@example.com', message: 'Private message' });

    expect(logSpy).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  test('rate limits repeated valid submissions', async () => {
    const limitedApp = createApp({ allowedOrigins: ['http://allowed.com'] });
    const submissions = await Promise.all(
      Array.from({ length: 6 }, () => request(limitedApp)
        .post('/api/contact')
        .send({ name: 'Test', email: 'test@example.com', message: 'hi' }))
    );

    expect(submissions.slice(0, 5).every((response) => response.statusCode === 200)).toBe(true);
    expect(submissions[5].statusCode).toBe(429);
  });

  test('rejects oversized JSON bodies', async () => {
    const res = await request(app)
      .post('/api/contact')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ name: 'Test', email: 'test@example.com', message: 'x'.repeat(11000) }));

    expect(res.statusCode).toBe(413);
    expect(res.body.error).toBe('Request body too large');
  });
});
