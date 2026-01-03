// constants.js
// Costanti e configurazioni centralizzate

/**
 * Costanti per il sistema di punteggi del test
 */
const TEST_SCORES = {
  // Punteggi per risposta
  ANXIOUS: 3,
  SECURE: 1,
  AVOIDANT: 2,
  DISORGANIZED: 3,
  
  // Numero totale di domande
  TOTAL_QUESTIONS: 12,
  
  // Range massimi per stile
  MAX_ANXIOUS: 36,        // 12 * 3
  MAX_SECURE: 12,         // 12 * 1
  MAX_AVOIDANT: 24,       // 12 * 2
  MAX_DISORGANIZED: 36,   // 12 * 3
  
  // Soglie per livelli
  LEVEL_HIGH_THRESHOLD: 10,
  LEVEL_MEDIUM_THRESHOLD: 7
};

/**
 * Costanti per la mappa personale
 */
const MAP_CONSTANTS = {
  // Numero di dimensioni
  DIMENSIONS_COUNT: 5,
  
  // Range punteggi
  MIN_SCORE: 0,
  MAX_SCORE: 10,
  
  // Soglie per interpretazione media
  LOW_THRESHOLD: 3,
  MEDIUM_THRESHOLD: 6,
  
  // Soglie per livelli
  LEVEL_LOW_MIN: 5,
  LEVEL_LOW_MAX: 6,
  LEVEL_MEDIUM_MIN: 3.5,
  LEVEL_MEDIUM_MAX: 5
};

/**
 * Stili di attaccamento validi
 */
const ATTACHMENT_STYLES = {
  SECURE: 'secure',
  ANXIOUS: 'ansioso',
  AVOIDANT: 'evitante',
  DISORGANIZED: 'disorganizzato', // Mantenuto per retrocompatibilità
  OSCILLANTE: 'oscillante', // Nuovo termine preferito
  
  VALID_STYLES: ['secure', 'ansioso', 'evitante', 'disorganizzato', 'oscillante']
};

/**
 * Livelli validi
 */
const LEVELS = {
  LOW: 'basso',
  MEDIUM: 'medio',
  HIGH: 'alto',
  
  VALID_LEVELS: ['basso', 'medio', 'alto']
};

/**
 * Nomi display per stili
 */
const STYLE_NAMES = {
  'secure': 'Secure',
  'ansioso': 'Ansioso',
  'evitante': 'Evitante',
  'disorganizzato': 'Oscillante', // Display name aggiornato
  'oscillante': 'Oscillante'
};

/**
 * Nomi display per livelli
 */
const LEVEL_NAMES = {
  'basso': 'Basso',
  'medio': 'Medio',
  'alto': 'Alto'
};

/**
 * Etichette dimensioni mappa personale
 */
const MAP_DIMENSIONS = [
  'Ansia ↔ Evitamento',
  'Finestra di Tolleranza',
  'Coscienza dell\'Attaccamento',
  'Capacità di Integrazione',
  'Resilienza Relazionale'
];

