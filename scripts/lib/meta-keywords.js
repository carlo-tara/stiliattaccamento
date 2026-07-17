// meta-keywords.js
// Keyword per pagina (meta keywords — richieste da audit SEO)

const BASE_KEYWORDS = ['stili di attaccamento', 'attaccamento adulto'];

const PAGE_KEYWORDS = {
  'index.html': [
    'stili di attaccamento',
    'profili attaccamento',
    'consapevolezza relazionale',
    'teoria dell\'attaccamento',
    'modelli operativi interni',
  ],
  'test.html': [
    'test stile di attaccamento',
    'test attaccamento',
    'test attaccamento gratuito',
    'autovalutazione attaccamento',
    'questionario attaccamento',
  ],
  'stili-base.html': [
    '4 tipi di attaccamento',
    'tipi di attaccamento',
    'attaccamento sicuro',
    'attaccamento ansioso',
    'attaccamento evitante',
    'attaccamento oscillante',
  ],
  'modello-gradienti.html': [
    'paura abbandono',
    'paura dell\'abbandono',
    'modello a gradienti',
    'ansia evitamento',
    'intensità attaccamento',
  ],
  'archetipi.html': ['archetipi junghiani', 'profili attaccamento', 'tarocchi attaccamento'],
  'fondamenti.html': [
    'modelli operativi interni',
    'MOI attaccamento',
    'Bowlby attaccamento',
    'Ainsworth',
    'base sicura',
  ],
  'mappa-personale.html': ['mappa personale attaccamento', 'profilo attaccamento'],
  'esercizi.html': ['esercizi attaccamento', 'consapevolezza relazionale'],
  'dinamiche-coppia.html': [
    'ciclo ansioso evitante',
    'dinamiche di coppia',
    'coppia ansioso evitante',
  ],
  'come-supportare-partner.html': [
    'come supportare partner evitante',
    'partner evitante',
    'supportare partner ansioso',
    'supportare partner evitante',
    'relazioni di coppia',
  ],
  'quando-cercare-aiuto.html': ['terapia attaccamento', 'quando cercare aiuto', 'supporto psicologico'],
  'storie-reali.html': ['storie attaccamento', 'esperienze relazionali'],
  'risorse.html': ['glossario attaccamento', 'risorse attaccamento'],
  'libri.html': ['libri attaccamento', 'letture attaccamento'],
  'approfondimenti.html': ['approfondimenti attaccamento', 'relazioni e attaccamento'],
  'da-dove-inizi.html': ['percorso attaccamento', 'da dove iniziare'],
  'il-tuo-percorso.html': ['percorso personalizzato', 'consapevolezza attaccamento'],
  'mazzo-tarocchi.html': ['tarocchi attaccamento', 'archetipi attaccamento'],
};

const APPROFONDIMENTI_KEYWORDS = {
  'approfondimenti/sessualita.html': ['attaccamento sessualità', 'intimità emotiva'],
  'approfondimenti/genitorialita.html': ['attaccamento genitorialità', 'genitorialità'],
  'approfondimenti/lutto.html': ['attaccamento lutto', 'elaborazione perdita'],
  'approfondimenti/separazione.html': ['attaccamento separazione', 'fine relazione'],
  'approfondimenti/tradimento.html': ['attaccamento tradimento', 'fiducia relazione'],
  'approfondimenti/lavoro.html': ['attaccamento lavoro', 'relazioni lavoro'],
  'approfondimenti/amicizie.html': ['attaccamento amicizie', 'amicizia e attaccamento'],
  'approfondimenti/finanze.html': ['attaccamento denaro', 'autonomia economica'],
  'approfondimenti/focusing.html': ['focusing attaccamento', 'consapevolezza corporea'],
  'approfondimenti/crescita.html': ['crescita personale', 'consapevolezza relazionale'],
  'approfondimenti/famiglia.html': ['attaccamento famiglia', 'dinamiche familiari'],
};

const LIBRI_KEYWORDS = {
  'libri/attached.html': ['Attached libro', 'stili attaccamento coppia'],
  'libri/hold-me-tight.html': ['Hold Me Tight', 'Tenersi stretti', 'EFT terapia di coppia'],
  'libri/love-sense.html': ['Love Sense', 'Sue Johnson attaccamento'],
  'libri/hold-me-tight-workbook.html': ['Hold Me Tight Workbook', 'conversazioni EFT'],
  'libri/secure-base.html': ['Secure Base Bowlby', 'base sicura'],
  'libri/come-stai.html': ['Come stai libro', 'focusing'],
  'libri/polysecure.html': ['Polysecure', 'attaccamento poliamoria'],
  'libri/adult-attachment-interview.html': ['Adult Attachment Interview', 'AAI attaccamento'],
  'libri/emotional-intelligence.html': ['intelligenza emotiva', 'relazioni'],
  'libri/the-body-keeps-the-score.html': ['corpo trauma', 'attaccamento trauma'],
  'libri/the-body-remembers.html': ['trauma corpo', 'attaccamento oscillante'],
  'libri/the-gifts-of-imperfection.html': ['vergogna', 'attaccamento evitante'],
};

const PROFILE_STYLE_KEYWORDS = {
  ansioso: ['attaccamento ansioso', 'paura abbandono'],
  evitante: ['attaccamento evitante', 'paura intimità'],
  secure: ['attaccamento sicuro', 'base sicura'],
  disorganizzato: ['attaccamento oscillante', 'attaccamento disorganizzato'],
};

const PROFILE_LEVEL_KEYWORDS = {
  alto: 'intensità alta',
  medio: 'intensità media',
  basso: 'intensità bassa',
};

function getProfileKeywords(relativePath) {
  const match = relativePath.match(/^profili\/(ansioso|evitante|secure|disorganizzato)-(alto|medio|basso)\.html$/);
  if (!match) {
    return null;
  }

  const [, style, level] = match;
  return [
    ...PROFILE_STYLE_KEYWORDS[style],
    PROFILE_LEVEL_KEYWORDS[level],
    'profilo attaccamento',
  ];
}

function getStoriaKeywords(relativePath) {
  if (!relativePath.startsWith('storie-reali/')) {
    return null;
  }
  return ['storia attaccamento', 'consapevolezza relazionale', 'esperienza personale'];
}

/**
 * @param {string} relativePath - es. index.html, profili/ansioso-alto.html
 * @returns {string} keyword comma-separated, max ~255 caratteri
 */
function getMetaKeywords(relativePath) {
  const keywords = [...BASE_KEYWORDS];

  if (PAGE_KEYWORDS[relativePath]) {
    keywords.push(...PAGE_KEYWORDS[relativePath]);
  } else if (APPROFONDIMENTI_KEYWORDS[relativePath]) {
    keywords.push(...APPROFONDIMENTI_KEYWORDS[relativePath]);
  } else if (LIBRI_KEYWORDS[relativePath]) {
    keywords.push(...LIBRI_KEYWORDS[relativePath]);
  } else {
    const profileKw = getProfileKeywords(relativePath);
    if (profileKw) {
      keywords.push(...profileKw);
    } else {
      const storiaKw = getStoriaKeywords(relativePath);
      if (storiaKw) {
        keywords.push(...storiaKw);
      }
    }
  }

  const unique = [...new Set(keywords.map((k) => k.trim()).filter(Boolean))];
  let result = unique.join(', ');
  if (result.length > 255) {
    result = result.slice(0, 252).replace(/,[^,]*$/, '');
  }
  return result;
}

module.exports = {
  getMetaKeywords,
  BASE_KEYWORDS,
};
