// webmcp-helpers.js
// Utility condivise per integrazione WebMCP (API imperativa)

/** @type {readonly string[]} */
const ATTACHMENT_ANSWER_VALUES = ['A', 'B', 'C', 'D'];

const ATTACHMENT_ANSWER_LABELS = {
  A: 'ansioso',
  B: 'secure',
  C: 'evitante',
  D: 'oscillante',
};

/**
 * @returns {boolean}
 */
function isWebMcpSupported() {
  return typeof document !== 'undefined' && 'modelContext' in document;
}

/**
 * @param {number} questionCount
 * @returns {Record<string, object>}
 */
function buildAttachmentAnswerProperties(questionCount) {
  const properties = {};
  for (let i = 1; i <= questionCount; i++) {
    properties[`q${i}`] = {
      type: 'string',
      enum: [...ATTACHMENT_ANSWER_VALUES],
      description: `Risposta alla domanda ${i}: A=ansioso, B=secure, C=evitante, D=oscillante.`,
    };
  }
  return properties;
}

/**
 * @param {unknown} answers
 * @param {number} [questionCount=12]
 * @returns {{ valid: true, answers: Record<string, string> } | { valid: false, error: string }}
 */
function validateAttachmentAnswers(answers, questionCount = 12) {
  if (!answers || typeof answers !== 'object') {
    return { valid: false, error: 'Risposte del test non valide: oggetto mancante.' };
  }

  const normalized = /** @type {Record<string, string>} */ ({});

  for (let i = 1; i <= questionCount; i++) {
    const key = `q${i}`;
    const value = /** @type {Record<string, unknown>} */ (answers)[key];

    if (typeof value !== 'string' || !ATTACHMENT_ANSWER_VALUES.includes(value)) {
      return {
        valid: false,
        error: `Risposta non valida per ${key}: usa A, B, C o D.`,
      };
    }

    normalized[key] = value;
  }

  return { valid: true, answers: normalized };
}

/**
 * @returns {object}
 */
function getAttachmentTestInfoPayload() {
  return {
    questions: 12,
    durationMinutes: 10,
    answerOptions: { ...ATTACHMENT_ANSWER_LABELS },
    output: 'stile prevalente e livello (basso, medio, alto)',
  };
}
