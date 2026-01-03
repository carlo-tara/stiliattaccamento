// config-surveyjs.js
// Configurazione tema per SurveyJS

/**
 * Configurazione tema SurveyJS
 * @returns {Object} Configurazione tema
 */
function getSurveyJSTheme() {
  return {
    colorPalette: 'light',
    isPanelless: false,
    font: {
      family: 'var(--font-family-base)',
      size: 'var(--font-size-base)'
    },
    color: {
      primary: 'var(--color-accent-secure)',
      primaryLight: 'var(--color-accent-secure)',
      primaryForeground: 'var(--color-bg-primary)',
      background: 'var(--color-surface)',
      backgroundDim: 'var(--color-surface-elevated)',
      foreground: 'var(--color-text-primary)',
      foregroundLight: 'var(--color-text-secondary)',
      border: 'var(--color-border)',
      borderLight: 'rgba(184, 169, 212, 0.1)',
      error: '#f4a5ae',
      headerBackground: 'var(--color-surface)',
      headerForeground: 'var(--color-text-primary)',
      headerTitle: 'var(--color-text-primary)',
      headerDescription: 'var(--color-text-secondary)',
      shadows: 'none'
    },
    font: {
      family: 'var(--font-family-base)',
      size: 'var(--font-size-base)',
      weight: '400',
      lineHeight: 'var(--line-height-normal)'
    },
    spacing: {
      baseUnit: 4,
      small: 'var(--spacing-2)',
      medium: 'var(--spacing-4)',
      large: 'var(--spacing-6)'
    },
    borderRadius: {
      small: 'var(--radius-sm)',
      medium: 'var(--radius-md)',
      large: 'var(--radius-lg)'
    }
  };
}

