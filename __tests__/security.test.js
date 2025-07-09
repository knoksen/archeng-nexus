const request = require('supertest');
const app = require('../server/index');

describe('security headers', () => {
  test('helmet sets common security headers', async () => {
    const res = await request(app).get('/');
    expect(res.headers['x-dns-prefetch-control']).toBe('off');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    // helmet adds CSP based on our configuration
    expect(res.headers['content-security-policy']).toBeDefined();
  });
});
