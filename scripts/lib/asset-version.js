// Versione unica per cache-bust di CSS/JS in produzione (_headers: immutable + max-age=1y).
// Incrementare ad ogni deploy che modifica CSS o JS bundle.
module.exports = {
  CSS_VERSION: '1.3.6',
  JS_VERSION: '1.3.4',
  SW_CACHE_NAME: 'stili-attaccamento-v11',
};
