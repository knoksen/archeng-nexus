const { isAllowedExternalUrl } = require('../desktop/url-security');

describe('external URL validation', () => {
  test.each([
    'https://example.com/path',
    'http://example.com/path',
  ])('allows web URL %s', (url) => {
    expect(isAllowedExternalUrl(url)).toBe(true);
  });

  test.each([
    'javascript:alert(1)',
    'data:text/html,hi',
    'file:///etc/passwd',
    'https://user:password@example.com/',
    'not a URL',
  ])('rejects unsafe URL %s', (url) => {
    expect(isAllowedExternalUrl(url)).toBe(false);
  });
});
