// minify-options.js — opzioni condivise per HTML (preserva marker inject)

/** Commenti HTML da non rimuovere (regex per ignoreCustomComments). */
const INJECT_COMMENT_PATTERNS = [
  /Site shell:/,
  /Site analytics/,
  /End site analytics/,
];

/** @type {import('html-minifier-terser').Options} */
const HTML_MINIFY_OPTIONS = {
  collapseWhitespace: true,
  conservativeCollapse: true,
  removeComments: true,
  ignoreCustomComments: INJECT_COMMENT_PATTERNS,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  collapseBooleanAttributes: true,
  removeOptionalTags: false,
  sortAttributes: false,
  sortClassName: false,
  minifyURLs: false,
  minifyCSS: true,
  processScripts: ['application/ld+json'],
};

module.exports = {
  INJECT_COMMENT_PATTERNS,
  HTML_MINIFY_OPTIONS,
};
