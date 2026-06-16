// mappa-dimensions.js
// Calcolo delle 5 dimensioni della mappa personale dai punteggi del test

/**
 * @param {number} anxious
 * @param {number} avoidant
 * @param {number} secure
 * @returns {number}
 */
function computeDimensionAnsiaEvitamento(anxious, avoidant, secure) {
  if (anxious > avoidant) {
    return Math.max(0, 4 - anxious / 3);
  }
  if (avoidant > anxious) {
    return Math.min(10, 6 + avoidant / 3);
  }
  if (secure > 6) {
    return 5;
  }
  return 5;
}

/**
 * @param {number} anxious
 * @param {number} avoidant
 * @param {number} disorganized
 * @param {number} secure
 * @returns {number}
 */
function computeDimensionFinestraTolleranza(anxious, avoidant, disorganized, secure) {
  if (anxious > 6) {
    return Math.min(10, 6 + anxious / 4);
  }
  if (avoidant > 6) {
    return Math.max(0, 4 - avoidant / 4);
  }
  if (disorganized > 6) {
    return 3 + disorganized / 5;
  }
  if (secure > 6) {
    return 5;
  }
  return 5;
}

/**
 * @param {number} anxious
 * @param {number} avoidant
 * @param {number} secure
 * @returns {number}
 */
function computeDimensionCoscienza(anxious, avoidant, secure) {
  let dim = 4;
  if (secure > 6) {
    dim = 7;
  } else if (anxious > 6 || avoidant > 6) {
    dim = 4;
  }
  return dim;
}

/**
 * @param {number} anxious
 * @param {number} avoidant
 * @param {number} secure
 * @returns {number}
 */
function computeDimensionIntegrazione(anxious, avoidant, secure) {
  if (secure > 6) {
    return 7;
  }
  if (anxious > 6 || avoidant > 6) {
    return 3;
  }
  return 5;
}

/**
 * @param {number} anxious
 * @param {number} avoidant
 * @param {number} disorganized
 * @param {number} secure
 * @returns {number}
 */
function computeDimensionResilienza(anxious, avoidant, disorganized, secure) {
  if (secure > 6) {
    return 7;
  }
  if (anxious > 6 || avoidant > 6 || disorganized > 6) {
    return 3;
  }
  return 5;
}

/**
 * @param {Object} scores
 * @returns {{ dim1: number, dim2: number, dim3: number, dim4: number, dim5: number }}
 */
function computeDimensionsFromTest(scores) {
  const anxious = scores.anxious || 0;
  const avoidant = scores.avoidant || 0;
  const secure = scores.secure || 0;
  const disorganized = scores.disorganized || 0;

  return {
    dim1: computeDimensionAnsiaEvitamento(anxious, avoidant, secure),
    dim2: computeDimensionFinestraTolleranza(anxious, avoidant, disorganized, secure),
    dim3: computeDimensionCoscienza(anxious, avoidant, secure),
    dim4: computeDimensionIntegrazione(anxious, avoidant, secure),
    dim5: computeDimensionResilienza(anxious, avoidant, disorganized, secure),
  };
}

if (typeof window !== 'undefined') {
  window.computeDimensionsFromTest = computeDimensionsFromTest;
}
