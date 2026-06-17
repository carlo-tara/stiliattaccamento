// mappa-profile-render.js
// Rendering del risultato profilo nella mappa personale

const MAPPA_STYLE_LABELS = {
  secure: 'Secure',
  ansioso: 'Ansioso',
  evitante: 'Evitante',
  disorganizzato: 'Oscillante',
};

const MAPPA_DIMENSION_LABELS = [
  'Ansia ↔ Evitamento',
  'Finestra di Tolleranza',
  "Coscienza dell'Attaccamento",
  'Capacità di Integrazione',
  'Resilienza Relazionale',
];

/**
 * @param {Array<number>} punteggi
 * @param {number} media
 * @returns {{ stile: string, livello: string }}
 */
function resolveProfileStyle(punteggi, media) {
  const [dim1, , , dim4] = punteggi;
  const livello = identificaLivello(media);
  let stile = 'secure';

  if (dim1 <= 4) {
    stile = 'ansioso';
  } else if (dim1 >= 6) {
    stile = 'evitante';
  } else if (dim4 <= 3 && punteggi[1] <= 3) {
    stile = 'disorganizzato';
  }

  return { stile, livello };
}

/**
 * @param {HTMLElement} container
 * @param {string} tag
 * @param {Object} [attrs]
 * @param {string} [text]
 * @returns {HTMLElement}
 */
function createProfileElement(container, tag, attrs = {}, text = '') {
  if (typeof createSafeElement === 'function') {
    return createSafeElement(tag, attrs, text);
  }
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'class') {
      el.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else {
      el.setAttribute(key, value);
    }
  });
  if (text) {
    el.textContent = text;
  }
  return el;
}

/**
 * @param {Array<number>} punteggi
 * @param {number} media
 * @param {string} stile
 * @param {string} livello
 */
function renderProfileResult(punteggi, media, stile, livello) {
  const profileResult = document.getElementById('profile-result');
  const profileContent = document.getElementById('profile-content');

  if (!profileResult || !profileContent) {
    return;
  }

  const stileNome = MAPPA_STYLE_LABELS[stile] || MAPPA_STYLE_LABELS.secure;
  const livelloNome = livello.toLowerCase();
  const validStile =
    typeof isValidAttachmentStyle === 'function' && isValidAttachmentStyle(stile) ? stile : 'secure';
  const validLivello =
    typeof isValidLevel === 'function' && isValidLevel(livelloNome) ? livelloNome : 'basso';
  const profiloUrl = `profili/${validStile}-${validLivello}.html`;

  profileContent.replaceChildren();

  profileContent.appendChild(createProfileElement(profileContent, 'h3', {}, `${stileNome} ${livello}`));

  const mediaP = createProfileElement(profileContent, 'p');
  const mediaStrong = createProfileElement(mediaP, 'strong', {}, 'Media complessiva: ');
  mediaP.append(mediaStrong, document.createTextNode(`${media.toFixed(1)}/10`));
  profileContent.appendChild(mediaP);

  const punteggiP = createProfileElement(profileContent, 'p');
  punteggiP.appendChild(createProfileElement(punteggiP, 'strong', {}, 'I tuoi punteggi: '));
  profileContent.appendChild(punteggiP);

  const punteggiList = createProfileElement(profileContent, 'ul', {
    class: 'mappa-profile__scores',
  });
  MAPPA_DIMENSION_LABELS.forEach((label, index) => {
    punteggiList.appendChild(
      createProfileElement(punteggiList, 'li', {}, `${label}: ${punteggi[index].toFixed(1)}/10`)
    );
  });
  profileContent.appendChild(punteggiList);

  const profileLinkP = createProfileElement(profileContent, 'p', { class: 'mappa-profile__actions' });
  profileLinkP.appendChild(
    createProfileElement(
      profileLinkP,
      'a',
      { href: 'il-tuo-percorso.html', class: 'btn btn-primary' },
      'Il tuo percorso'
    )
  );
  profileContent.appendChild(profileLinkP);

  const profiloLinkP = createProfileElement(profileContent, 'p', { class: 'mappa-profile__actions' });
  profiloLinkP.appendChild(
    createProfileElement(
      profiloLinkP,
      'a',
      { href: profiloUrl, class: 'btn btn-secondary' },
      `Vedi il profilo: ${stileNome} ${livello}`
    )
  );
  profileContent.appendChild(profiloLinkP);

  const eserciziLinkP = createProfileElement(profileContent, 'p', { class: 'mappa-profile__actions' });
  eserciziLinkP.appendChild(
    createProfileElement(
      eserciziLinkP,
      'a',
      { href: 'esercizi.html', class: 'btn btn-secondary' },
      'Vedi esercizi specifici'
    )
  );
  profileContent.appendChild(eserciziLinkP);

  const journeyHost = createProfileElement(profileContent, 'div', {
    id: 'mappa-journey-steps',
    class: 'mappa-profile__journey',
  });
  profileContent.appendChild(journeyHost);

  if (typeof renderJourneyNextSteps === 'function') {
    renderJourneyNextSteps(journeyHost, {
      stile: validStile,
      livello: validLivello,
      basePath: '',
      compact: true,
    });
  }

  profileResult.style.display = 'block';
}

/**
 * @param {Array<number>} punteggi
 * @param {number} media
 */
function identificaProfilo(punteggi, media) {
  const { stile, livello } = resolveProfileStyle(punteggi, media);
  renderProfileResult(punteggi, media, stile, livello);
}

if (typeof window !== 'undefined') {
  window.renderProfileResult = renderProfileResult;
  window.resolveProfileStyle = resolveProfileStyle;
}
