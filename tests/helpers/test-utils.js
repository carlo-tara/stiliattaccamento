// test-utils.js
// Utility functions per i test

import { beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

// Setup DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable',
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.DOMParser = dom.window.DOMParser;

// Mock localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index) => Object.keys(store)[index] || null),
  };
})();

global.localStorage = localStorageMock;

// Mock Chart.js se necessario
global.Chart = vi.fn(() => ({
  destroy: vi.fn(),
  update: vi.fn(),
  render: vi.fn(),
}));

// Mock SurveyJS se necessario
global.Survey = {
  Survey: vi.fn(),
};

// Helper per creare fixture HTML
export function createFixtureHTML(html) {
  document.body.innerHTML = html;
  return document.body;
}

// Helper per pulire DOM
export function cleanupDOM() {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
}

// Helper per caricare script in test
export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Reset localStorage prima di ogni test
beforeEach(() => {
  localStorageMock.clear();
  cleanupDOM();
});

// Cleanup dopo ogni test
afterEach(() => {
  cleanupDOM();
  vi.clearAllMocks();
});

