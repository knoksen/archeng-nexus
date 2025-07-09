const { JSDOM } = require('jsdom');

describe('theme toggle', () => {
  let toggleTheme;
  beforeEach(() => {
    // create DOM with a root html element
    const dom = new JSDOM(`<!DOCTYPE html><html></html>`, { url: 'http://localhost' });
    global.document = dom.window.document;
    global.window = dom.window;
    global.localStorage = window.localStorage;

    toggleTheme = function () {
      const html = document.documentElement;
      if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    };
  });

  afterEach(() => {
    delete global.document;
    delete global.window;
    delete global.localStorage;
  });

  test('updates localStorage when toggling', () => {
    toggleTheme();
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    toggleTheme();
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
