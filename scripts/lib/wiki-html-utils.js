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
    .replace(/<h4 style="margin-top: var\(--spacing-6\);">/g, '<h4 class="wiki-subheading--section">')
    .replace(
      /<p class="text-center mb-6" style="font-size: var\(--font-size-lg\); color: var\(--color-text-secondary\);">/g,
      '<p class="text-center mb-6 wiki-lead wiki-lead--secondary">'
    )
    .replace(
      /<div class="card mb-6" style="background: linear-gradient\(135deg, rgba\(168, 213, 186, 0\.1\) 0%, rgba\(168, 213, 186, 0\.05\) 100%\);">/g,
      '<div class="card card--accent-soft mb-6">'
    )
    .replace(
      /<p style="font-style: italic; font-size: var\(--font-size-lg\);">/g,
      '<p class="wiki-note wiki-note--italic wiki-note--lg">'
    )
    .replace(
      /<p class="text-secondary" style="font-size: var\(--font-size-sm\);">/g,
      '<p class="wiki-note">'
    )
    .replace(
      /<div class="grid grid-2" style="margin-top: var\(--spacing-6\);">/g,
      '<div class="grid grid-2 grid--spaced-top">'
    )
    .replace(
      /<table style="width: 100%; border-collapse: collapse; margin-top: var\(--spacing-4\);">/g,
      '<table class="wiki-table">'
    )
    .replace(
      /<table style="width: 100%; border-collapse: collapse;">/g,
      '<table class="wiki-table wiki-table--grid wiki-table--center">'
    )
    .replace(
      /<tr style="background-color: var\(--color-surface-elevated\);">/g,
      '<tr class="wiki-table__head">'
    )
    .replace(
      /<th style="padding: var\(--spacing-3\); text-align: left; border-bottom: 1px solid var\(--color-border\);">/g,
      '<th>'
    )
    .replace(
      /<td style="padding: var\(--spacing-3\); border-bottom: 1px solid var\(--color-border\);">/g,
      '<td>'
    )
    .replace(
      /<td style="padding: var\(--spacing-3\);">/g,
      '<td>'
    )
    .replace(
      /<th style="padding: var\(--spacing-3\); text-align: left; border: 1px solid var\(--color-border\);">/g,
      '<th>'
    )
    .replace(
      /<th style="padding: var\(--spacing-3\); text-align: center; border: 1px solid var\(--color-border\);">/g,
      '<th>'
    )
    .replace(
      /<td style="padding: var\(--spacing-3\); border: 1px solid var\(--color-border\); font-weight: 600;">/g,
      '<td>'
    )
    .replace(
      /<td style="padding: var\(--spacing-3\); border: 1px solid var\(--color-border\); text-align: center;"/g,
      '<td>'
    )
    .replace(
      /<td style="padding: var\(--spacing-3\); border: 1px solid var\(--color-border\);">/g,
      '<td>'
    )
    .replace(/<p style="margin-top: var\(--spacing-6\);">/g, '<p class="wiki-paragraph--spaced wiki-paragraph--spaced-lg">')
    .replace(
      /<div class="card" style="margin-top: var\(--spacing-4\);">/g,
      '<div class="card card--spaced-top-tight">'
    )
    .replace(
      /<h3 style="margin-top: var\(--spacing-8\);">/g,
      '<h3 class="wiki-subheading--section">'
    )
    .replace(/<h4 style="margin-top: 0;">/g, '<h4 class="wiki-subheading--flush-h4">')
    .replace(
      /<div class="grid grid-2" style="margin-top: var\(--spacing-4\);">/g,
      '<div class="grid grid-2 grid--spaced-top-tight">'
    )
    .replace(
      /<div class="grid grid-3" style="margin-top: var\(--spacing-4\);">/g,
      '<div class="grid grid-3 grid--spaced-top-tight">'
    )
    .replace(
      /<div class="card" style="background-color: var\(--color-surface-elevated\); margin-top: var\(--spacing-4\);">/g,
      '<div class="card card--elevated-spaced">'
    )
    .replace(
      /<div class="card" style="background-color: rgba\(244, 165, 174, 0\.1\);">/g,
      '<div class="card card--anxious-soft">'
    )
    .replace(
      /<div class="card mb-8" style="background-color: rgba\(244, 165, 174, 0\.1\); border-left: 4px solid var\(--color-accent-anxious\);">/g,
      '<div class="card mb-8 card--anxious-accent">'
    )
    .replace(
      /<div class="card" style="margin-top: var\(--spacing-6\); background-color: var\(--color-surface-elevated\); border-left: 4px solid var\(--color-accent-secure\);">/g,
      '<div class="card card--secure-accent">'
    )
    .replace(
      /<div class="card mt-8" style="border-left: 4px solid var\(--color-accent-secure\);">/g,
      '<div class="card mt-8 card--accent">'
    )
    .replace(
      /<div class="card card--accent-soft mb-6" style="margin-top: var\(--spacing-4\);">/g,
      '<div class="card card--accent-soft mb-6 card--spaced-top-tight">'
    )
    .replace(
      /<p style="font-size: var\(--font-size-sm\); color: var\(--color-text-secondary\); margin-top: var\(--spacing-4\);">/g,
      '<p class="wiki-note">'
    )
    .replace(
      /<p style="font-size: var\(--font-size-sm\); margin-top: var\(--spacing-4\);">/g,
      '<p class="wiki-note">'
    )
    .replace(
      /<div class="card" style="margin-top: var\(--spacing-6\);">/g,
      '<div class="card card--spaced-top">'
    );
}

module.exports = {
  stripWikiListInlineStyles,
};
