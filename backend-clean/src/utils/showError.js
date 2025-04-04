import { logger } from './logger.js';

/**
 * Transforme une erreur brute en message utilisateur lisible.
 * 🔐 En développement, loggue aussi l’erreur complète dans la console.
 *
 * @function showError
 * @param {unknown} err - Erreur capturée (peut être de n’importe quel type)
 * @returns {string} Message simplifié à afficher à l’utilisateur
 */
export function showError(err) {
  // 🔎 Log complet uniquement en développement
  logger.error('[Erreur complète]', err);

  // 🧠 Cas 1 : Erreur JS classique
  if (err instanceof Error) {
    return err.message;
  }

  // 🧠 Cas 2 : String brute
  if (typeof err === 'string') {
    return err;
  }

  // 🧠 Cas 3 : Objet avec message
  if (typeof err === 'object' && err !== null && 'message' in err) {
    return String(err.message);
  }

  // 🧠 Cas 4 : Inconnu
  return 'Une erreur est survenue.';
}