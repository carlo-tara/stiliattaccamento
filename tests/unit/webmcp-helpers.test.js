// webmcp-helpers.test.js
// Unit tests per public/js/modules/webmcp-helpers.js

import { describe, it, expect } from 'vitest';
import { resolve } from 'path';
import { loadPublicScript } from '../helpers/test-utils.js';

loadPublicScript(resolve(__dirname, '../../public/js/modules/webmcp-helpers.js'));

describe('webmcp-helpers.js', () => {
  describe('buildAttachmentAnswerProperties', () => {
    it('should build schema for all questions', () => {
      const properties = buildAttachmentAnswerProperties(12);

      expect(Object.keys(properties)).toHaveLength(12);
      expect(properties.q1.enum).toEqual(['A', 'B', 'C', 'D']);
      expect(properties.q12.description).toContain('domanda 12');
    });
  });

  describe('validateAttachmentAnswers', () => {
    it('should accept valid answers', () => {
      const answers = {};
      for (let i = 1; i <= 12; i++) {
        answers[`q${i}`] = 'B';
      }

      const result = validateAttachmentAnswers(answers);

      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.answers.q1).toBe('B');
      }
    });

    it('should reject missing answers', () => {
      const result = validateAttachmentAnswers({ q1: 'A' });

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toContain('q2');
      }
    });

    it('should reject invalid answer values', () => {
      const answers = {};
      for (let i = 1; i <= 12; i++) {
        answers[`q${i}`] = 'B';
      }
      answers.q5 = 'X';

      const result = validateAttachmentAnswers(answers);

      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toContain('q5');
      }
    });

    it('should reject non-object input', () => {
      const result = validateAttachmentAnswers(null);

      expect(result.valid).toBe(false);
    });
  });

  describe('getAttachmentTestInfoPayload', () => {
    it('should return test metadata', () => {
      const payload = getAttachmentTestInfoPayload();

      expect(payload.questions).toBe(12);
      expect(payload.answerOptions.A).toBe('ansioso');
      expect(payload.answerOptions.D).toBe('oscillante');
    });
  });
});
