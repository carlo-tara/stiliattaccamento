import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/helpers/test-utils.js'],
    include: ['tests/unit/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'public/js/test-surveyjs.js', // SurveyJS integration, not our code
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@public': resolve(__dirname, './public'),
      '@js': resolve(__dirname, './public/js'),
    },
  },
});

