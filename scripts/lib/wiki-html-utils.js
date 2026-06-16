// wiki-html-utils.js
// Utility condivise per pulizia HTML wiki

/**
 * @param {string} html
 * @returns {string}
 */
function stripWikiListInlineStyles(html) {
  return html
    .replace(
      /<ul style="margin-left: var\(--spacing-6\); margin-top: var\(--spacing-4\);">/g,
      '<ul>'
    )
    .replace(
      /<ol style="margin-left: var\(--spacing-6\); margin-top: var\(--spacing-4\);">/g,
      '<ol>'
    )
    .replace(
      /<ul style="margin-left: var\(--spacing-6\); margin-top: var\(--spacing-2\);">/g,
      '<ul class="wiki-list--compact">'
    )
    .replace(/<li style="margin-bottom: var\(--spacing-2\);">/g, '<li>')
    .replace(/<li style="margin-bottom: var\(--spacing-3\);">/g, '<li class="wiki-list-item--spaced">')
    .replace(
      /<h3 style="margin-top: var\(--spacing-6\);">/g,
      '<h3 class="wiki-subheading">'
    )
    .replace(
      /<h3 style="margin-top: var\(--spacing-4\);">/g,
      '<h3 class="wiki-subheading wiki-subheading--tight">'
    )
    .replace(
      /<h3 style="margin-top: 0;">/g,
      '<h3 class="wiki-subheading wiki-subheading--flush">'
    )
    .replace(
      /<h3 style="margin-top: var\(--spacing-8\); margin-bottom: var\(--spacing-4\);">/g,
      '<h3 class="wiki-subheading wiki-subheading--section">'
    )
    .replace(/<h4 style="margin-top: var\(--spacing-4\);">/g, '<h4 class="wiki-subheading--tight">')
    .replace(/<p style="margin-top: var\(--spacing-4\);">/g, '<p class="wiki-paragraph--spaced">')
    .replace(/<p style="margin-top: var\(--spacing-2\);">/g, '<p class="wiki-paragraph--compact">')
    .replace(
      /<p style="margin-bottom: var\(--spacing-4\);">/g,
      '<p class="wiki-paragraph--bottom-spaced">'
    )
    .replace(
      /<p style="margin-top: var\(--spacing-2\); font-style: italic;">/g,
      '<p class="wiki-note wiki-note--italic">'
    )
    .replace(
      /<p style="margin-top: var\(--spacing-4\); font-size: var\(--font-size-sm\);">/g,
      '<p class="wiki-note">'
    )
    .replace(/<p style="margin-left: var\(--spacing-4\);">/g, '<p class="wiki-indent">')
    .replace(
      /<p class="text-center mb-8" style="font-size: var\(--font-size-lg\);">/g,
      '<p class="text-center mb-8 wiki-lead">'
    )
    .replace(
      /<div class="card mb-6" style="border-left: 4px solid var\(--color-accent-secure\);">/g,
      '<div class="card card--accent mb-6">'
    )
    .replace(
      /<div class="card mb-6" style="border-left: 4px solid var\(--color-accent\);">/g,
      '<div class="card card--accent-primary mb-6">'
    )
    .replace(
      /<div class="card mb-8" style="background-color: var\(--color-surface-elevated\);">/g,
      '<div class="card card--elevated mb-8">'
    )
    .replace(
      /<div class="card mb-8" style="background: linear-gradient\(135deg, rgba\(168, 213, 186, 0\.1\) 0%, rgba\(168, 213, 186, 0\.05\) 100%\);">/g,
      '<div class="card card--accent mb-8">'
    )
    .replace(
      /<div class="card mb-6" style="background: linear-gradient\(135deg, rgba\(168, 213, 186, 0\.08\) 0%, rgba\(168, 213, 186, 0\.03\) 100%\); border-left: 4px solid var\(--color-accent-secure\);">/g,
      '<div class="card card--accent-soft mb-6">'
    )
    .replace(
      /<div class="card" style="margin-top: var\(--spacing-6\); background-color: var\(--color-surface-elevated\);">/g,
      '<div class="card card--elevated card--spaced-top">'
    )
    .replace(
      /<div class="card" style="margin-top: var\(--spacing-4\); background-color: var\(--color-surface-elevated\);">/g,
      '<div class="card card--elevated card--spaced-top-tight">'
    )
    .replace(
      /<div class="card" style="margin-top: var\(--spacing-4\); background-color: var\(--color-surface-elevated\); font-family: var\(--font-family-mono\); font-size: var\(--font-size-sm\);">/g,
      '<div class="card card--elevated card--mono card--spaced-top-tight">'
    )
    .replace(
      /<a href="([^"]+)" class="btn btn-secondary" style="text-align: center;">/g,
      '<a href="$1" class="btn btn-secondary btn--center">'
    )
    .replace(
      /<div class="grid grid-3" style="margin-top: var\(--spacing-6\);">/g,
      '<div class="grid grid-3 grid--spaced-top">'
    )
    .replace(
      /<div class="grid grid-2" style="margin-top: var\(--spacing-6\);">/g,
      '<div class="grid grid-2 grid--spaced-top">'
    );
}

module.exports = {
  stripWikiListInlineStyles,
};
