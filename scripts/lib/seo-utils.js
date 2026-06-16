// seo-utils.js
// Utility condivise per sanitizzazione meta SEO

/**
 * Tronca al limite preferendo un confine di parola (evita "guari" invece di "guarigione").
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
function truncateAtWord(text, maxLength) {
  if (!text || text.length <= maxLength) {
    return text;
  }

  const slice = text.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(' ');

  if (lastSpace > maxLength * 0.6) {
    return slice.slice(0, lastSpace).trim();
  }

  return slice.trim();
}

/**
 * @param {string} text
 * @param {number} [maxLength=160]
 * @returns {string}
 */
function sanitizeMetaText(text, maxLength = 160) {
  if (!text) {
    return '';
  }
  const collapsed = text.replace(/\s+/g, ' ').trim();
  return truncateAtWord(collapsed, maxLength);
}

/**
 * @param {Date} date
 * @returns {string} ISO 8601 date (YYYY-MM-DD)
 */
function toIsoDate(date) {
  return date.toISOString().split('T')[0];
}

module.exports = {
  truncateAtWord,
  sanitizeMetaText,
  toIsoDate,
};
