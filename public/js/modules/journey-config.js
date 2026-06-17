// journey-config.js
// Configurazione percorso guidato per stile × livello (content-voice)

const JOURNEY_STYLE_LABELS = {
  secure: 'Secure',
  ansioso: 'Ansioso',
  evitante: 'Evitante',
  disorganizzato: 'Oscillante',
};

const JOURNEY_LEVEL_LABELS = {
  basso: 'basso',
  medio: 'medio',
  alto: 'alto',
};

/**
 * @typedef {Object} JourneyStep
 * @property {string} label
 * @property {string} href
 * @property {string} [anchor]
 * @property {string} [duration]
 * @property {string} [description]
 * @property {string} [eftFrame]
 * @property {'story'|'couple'|'exercise'|'wiki'} [type]
 */

/**
 * @typedef {Object} JourneyConfig
 * @property {JourneyStep} immediate
 * @property {JourneyStep} understand
 * @property {JourneyStep} connect
 * @property {boolean} disclaimer
 * @property {string} [greeting]
 */

/** @type {Record<string, JourneyConfig>} */
const JOURNEY_CONFIGS = {
  'ansioso-basso': {
    greeting: 'Hai un profilo ansioso con intensità bassa: i pattern ci sono, ma spesso li gestisci.',
    immediate: {
      label: 'Respira prima di scrivere',
      href: 'profili/ansioso-basso.html',
      anchor: 'strategie-pratiche',
      duration: '2 min',
      description: 'Quando senti il bisogno di controllare, ferma tutto e prova il respiro 4-6-8.',
    },
    understand: {
      label: 'Perché cerchi rassicurazione',
      href: 'profili/ansioso-basso.html',
      anchor: 'cosa-succede',
      eftFrame:
        'In EFT, la ricerca di vicinanza non è "controllo": è protesta per connessione quando il legame sembra a rischio.',
    },
    connect: {
      label: 'Storia: Giulia tra distanza e panico',
      href: 'storie-reali/giulia.html',
      type: 'story',
    },
    disclaimer: false,
  },
  'ansioso-medio': {
    greeting: 'Ansioso medio: il sistema di allarme si attiva spesso, e ti costa fatica.',
    immediate: {
      label: 'Aspetta due ore prima di contattare',
      href: 'profili/ansioso-medio.html',
      anchor: 'strategie-pratiche',
      duration: '2 ore',
      description: 'Quando il panico sale, scrivi i pensieri invece di inviarli subito.',
    },
    understand: {
      label: 'Il ciclo che si ripete',
      href: 'dinamiche-coppia.html',
      anchor: 'ansioso-evitante',
      eftFrame:
        'Il nemico non è te né il partner: è il ciclo inseguire–ritirarsi. Riconoscerlo è già metà del lavoro.',
    },
    connect: {
      label: 'Storia: Marco impara a fermarsi',
      href: 'storie-reali/marco.html',
      type: 'story',
    },
    disclaimer: false,
  },
  'ansioso-alto': {
    greeting: 'Ansioso alto: il panico può governarti prima che tu possa scegliere.',
    immediate: {
      label: 'Ferma tutto e respira (4-6-8)',
      href: 'profili/ansioso-alto.html',
      anchor: 'strategie-pratiche',
      duration: '2 min',
      description: 'Il panico è qui, non è la realtà. Respira prima di qualsiasi messaggio.',
    },
    understand: {
      label: 'Cosa succede nel corpo',
      href: 'profili/ansioso-alto.html',
      anchor: 'cosa-succede',
      eftFrame:
        'La protesta per connessione può diventare intensa. Non sei "troppo": il corpo sta cercando sicurezza come ha imparato a fare.',
    },
    connect: {
      label: 'Quando ha senso chiedere supporto',
      href: 'quando-cercare-aiuto.html',
      type: 'wiki',
    },
    disclaimer: true,
  },
  'evitante-basso': {
    greeting: 'Evitante basso: ami lo spazio, ma a volte la distanza protegge più del necessario.',
    immediate: {
      label: 'Un messaggio di presenza al giorno',
      href: 'profili/evitante-basso.html',
      anchor: 'strategie-pratiche',
      duration: '1 min',
      description: 'Non serve una conversazione lunga: una presenza breve tiene vivo il legame.',
    },
    understand: {
      label: 'Perché ti ritiri',
      href: 'profili/evitante-basso.html',
      anchor: 'cosa-succede',
      eftFrame:
        'Il ritiro protegge l\'autonomia quando la vicinanza sembra minacciosa. Non è rifiuto: è un riflesso.',
    },
    connect: {
      label: 'Storia: Giulia e il bisogno di spazio',
      href: 'storie-reali/giulia.html',
      type: 'story',
    },
    disclaimer: false,
  },
  'evitante-medio': {
    greeting: 'Evitante medio: l\'intimità può sembrare una trappola, anche quando vuoi vicinanza.',
    immediate: {
      label: 'Nomina quando hai bisogno di spazio',
      href: 'profili/evitante-medio.html',
      anchor: 'strategie-pratiche',
      duration: '5 min',
      description: 'Dire "mi serve mezz\'ora" è meglio che sparire senza spiegazione.',
    },
    understand: {
      label: 'Il ciclo distanza–pressione',
      href: 'dinamiche-coppia.html',
      anchor: 'ansioso-evitante',
      eftFrame:
        'Quando il partner cerca vicinanza, il ritiro si attiva. In EFT, entrambe le posizioni hanno senso nel ciclo.',
    },
    connect: {
      label: 'Come supportare senza pressare',
      href: 'come-supportare-partner.html',
      type: 'couple',
    },
    disclaimer: false,
  },
  'evitante-alto': {
    greeting: 'Evitante alto: la protezione può isolarti più di quanto vorresti.',
    immediate: {
      label: 'Un contatto non verbale al giorno',
      href: 'profili/evitante-alto.html',
      anchor: 'strategie-pratiche',
      duration: '5 min',
      description: 'Un abbraccio, una mano sulla spalla: il corpo comunica prima delle parole.',
    },
    understand: {
      label: 'Cosa c\'è sotto l\'evitamento',
      href: 'profili/evitante-alto.html',
      anchor: 'cosa-succede',
      eftFrame:
        'Sotto il distacco c\'è spesso un bisogno di attaccamento soppresso. Riconoscerlo non ti rende debole.',
    },
    connect: {
      label: 'Quando ha senso chiedere supporto',
      href: 'quando-cercare-aiuto.html',
      type: 'wiki',
    },
    disclaimer: true,
  },
  'secure-basso': {
    greeting: 'Secure basso: in generale stai bene in relazione, con qualche attivazione occasionale.',
    immediate: {
      label: 'Check-in settimanale col partner',
      href: 'profili/secure-basso.html',
      anchor: 'strategie-pratiche',
      duration: '10 min',
      description: 'Una conversazione breve su come state vi tiene allineati.',
    },
    understand: {
      label: 'Mantenere la consapevolezza',
      href: 'profili/secure-basso.html',
      anchor: 'cosa-succede',
      eftFrame:
        'Anche con un profilo secure, sotto stress i vecchi pattern possono riemergere. Osservarli è prevenzione, non allarme.',
    },
    connect: {
      label: 'Percorso di consapevolezza',
      href: 'approfondimenti/crescita.html',
      type: 'wiki',
    },
    disclaimer: false,
  },
  'secure-medio': {
    greeting: 'Secure medio: hai una base solida e puoi approfondire la consapevolezza relazionale.',
    immediate: {
      label: 'Pratica di presenza (A.R.E.)',
      href: 'profili/secure-medio.html',
      anchor: 'strategie-pratiche',
      duration: '5 min',
      description: 'Accessibilità, responsività, coinvolgimento: tre parole per stare presente.',
    },
    understand: {
      label: 'Supportare gli altri nel ciclo',
      href: 'come-supportare-partner.html',
      eftFrame:
        'Chi ha un profilo secure può diventare base sicura per il partner senza perdersi nel ciclo.',
    },
    connect: {
      label: 'Dinamiche di coppia',
      href: 'dinamiche-coppia.html',
      type: 'couple',
    },
    disclaimer: false,
  },
  'secure-alto': {
    greeting: 'Secure alto: la flessibilità relazionale è una risorsa — da coltivare, non da performance.',
    immediate: {
      label: 'Offri presenza senza risolvere',
      href: 'profili/secure-alto.html',
      anchor: 'strategie-pratiche',
      duration: '10 min',
      description: 'Stare accanto al disagio del partner senza dover "fixare" è già supporto.',
    },
    understand: {
      label: 'Riparare il legame (EFT)',
      href: 'libri/hold-me-tight.html',
      eftFrame:
        'Johnson parla di riparare il legame, non di perfezione. Puoi aiutare il ciclo a spezzarsi.',
    },
    connect: {
      label: 'Storie di consapevolezza',
      href: 'storie-reali.html',
      type: 'story',
    },
    disclaimer: false,
  },
  'disorganizzato-basso': {
    greeting: 'Oscillante basso: a volte vicinanza, a volte fuga — ma riesci a notare lo switch.',
    immediate: {
      label: 'Nota quando cambi strategia',
      href: 'profili/disorganizzato-basso.html',
      anchor: 'strategie-pratiche',
      duration: '3 min',
      description: 'Un segnale nel corpo ti avvisa prima che la testa giustifichi.',
    },
    understand: {
      label: 'Perché oscilli',
      href: 'profili/disorganizzato-basso.html',
      anchor: 'cosa-succede',
      eftFrame:
        'Cercare e fuggere insieme è esauriente. In EFT, entrambi i bisogni sono reali — il ciclo li mette in conflitto.',
    },
    connect: {
      label: 'Storia: Andrea tra vicinanza e fuga',
      href: 'storie-reali/andrea.html',
      type: 'story',
    },
    disclaimer: false,
  },
  'disorganizzato-medio': {
    greeting: 'Oscillante medio: le oscillazioni sono frequenti e possono confondere te e il partner.',
    immediate: {
      label: 'STOP: ferma la reazione',
      href: 'profili/disorganizzato-medio.html',
      anchor: 'strategie-pratiche',
      duration: '5 min',
      description: 'Stop, respira, osserva, poi scegli — prima di agire nel panico o nella chiusura.',
    },
    understand: {
      label: 'Il doppio segnale',
      href: 'stili-base.html',
      anchor: 'oscillante',
      eftFrame:
        'Dire "ti amo" mentre il corpo fugge crea confusione. Riconoscere il doppio segnale riduce il dramma.',
    },
    connect: {
      label: 'Storia: Nina e le oscillazioni',
      href: 'storie-reali/nina.html',
      type: 'story',
    },
    disclaimer: true,
  },
  'disorganizzato-alto': {
    greeting: 'Oscillante alto: il corpo può passare da panico a chiusura in pochi minuti.',
    immediate: {
      label: 'Grounding: i 5 sensi',
      href: 'profili/disorganizzato-alto.html',
      anchor: 'strategie-pratiche',
      duration: '5 min',
      description: 'Nome 5 cose che vedi, 4 che tocchi — riporta il corpo nel presente.',
    },
    understand: {
      label: 'Non sei incoerente: sei in conflitto',
      href: 'profili/disorganizzato-alto.html',
      anchor: 'cosa-succede',
      eftFrame:
        'Il conflitto interno tra vicinanza e protezione non è "instabilità caratteriale". È un pattern che si può osservare.',
    },
    connect: {
      label: 'Quando ha senso chiedere supporto',
      href: 'quando-cercare-aiuto.html',
      type: 'wiki',
    },
    disclaimer: true,
  },
};

/**
 * @param {string} stile
 * @param {string} livello
 * @returns {string}
 */
function getJourneyKey(stile, livello) {
  const validStyles = ['secure', 'ansioso', 'evitante', 'disorganizzato'];
  const validLevels = ['basso', 'medio', 'alto'];
  const s = validStyles.includes(stile) ? stile : 'secure';
  const l = validLevels.includes(livello) ? livello : 'basso';
  return `${s}-${l}`;
}

/**
 * @param {string} stile
 * @param {string} livello
 * @returns {JourneyConfig}
 */
function getJourneyConfig(stile, livello) {
  const key = getJourneyKey(stile, livello);
  return JOURNEY_CONFIGS[key] || JOURNEY_CONFIGS['secure-basso'];
}

/**
 * @param {string} stile
 * @returns {string}
 */
function getStyleLabel(stile) {
  return JOURNEY_STYLE_LABELS[stile] || JOURNEY_STYLE_LABELS.secure;
}

/**
 * @param {string} livello
 * @returns {string}
 */
function getLevelLabel(livello) {
  return JOURNEY_LEVEL_LABELS[livello] || 'basso';
}

/**
 * @param {JourneyStep} step
 * @param {string} [basePath]
 * @returns {string}
 */
function buildStepHref(step, basePath = '') {
  if (!step || !step.href) {
    return '#';
  }
  const path = basePath + step.href;
  if (step.anchor) {
    return `${path}#${step.anchor}`;
  }
  return path;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    JOURNEY_CONFIGS,
    JOURNEY_STYLE_LABELS,
    JOURNEY_LEVEL_LABELS,
    getJourneyKey,
    getJourneyConfig,
    getStyleLabel,
    getLevelLabel,
    buildStepHref,
  };
}

if (typeof window !== 'undefined') {
  window.JOURNEY_CONFIGS = JOURNEY_CONFIGS;
  window.getJourneyKey = getJourneyKey;
  window.getJourneyConfig = getJourneyConfig;
  window.getStyleLabel = getStyleLabel;
  window.getLevelLabel = getLevelLabel;
  window.buildStepHref = buildStepHref;
}
