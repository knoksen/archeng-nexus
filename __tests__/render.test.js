const { JSDOM } = require('jsdom');
const data = require('../data/site-info.json');

describe('render site info', () => {
  let dom;
  let insertSiteInfo;

  beforeEach(() => {
    dom = new JSDOM(`<!DOCTYPE html><html><body>
      <h1 id="page-title"></h1>
      <meta id="meta-description" />
      <div id="features-list"></div>
      <div id="materials-list"></div>
      <div id="tools-list"></div>
      <div id="solutions-list"></div>
    </body></html>`, { url: 'http://localhost' });
    global.window = dom.window;
    global.document = dom.window.document;
    global.localStorage = dom.window.localStorage;
    global.window.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {} });
    global.fetch = () => Promise.reject(new Error('skip'));
    global.alert = () => {};
    jest.spyOn(console, 'error').mockImplementation(() => {});
    ({ insertSiteInfo } = require('../scripts/main.js'));
  });

  afterEach(() => {
    delete global.window;
    delete global.document;
    delete global.localStorage;
    delete global.fetch;
    delete global.alert;
    console.error.mockRestore();
  });

  test('renders feature titles using DOM APIs', () => {
    insertSiteInfo(data);
    const items = document.querySelectorAll('#features-list > div');
    expect(items.length).toBe(data.features.length);
    expect(items[0].querySelector('h3').textContent).toBe(data.features[0].title);
  });

  test('renders text content without HTML parsing', () => {
    const malicious = JSON.parse(JSON.stringify(data));
    malicious.features[0].description = '<img src=x onerror=alert(1)>Test';
    insertSiteInfo(malicious);
    const p = document.querySelector('#features-list p');
    expect(p.textContent).toBe(malicious.features[0].description);
  });
});
