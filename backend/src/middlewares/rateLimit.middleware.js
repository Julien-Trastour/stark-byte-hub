import rateLimit from 'express-rate-limit';

/**
 * Limiteur global générique (par défaut)
 * Ce middleware applique une limite globale sur toutes les requêtes entrantes.
 * Il permet de limiter le nombre de requêtes sur une période définie pour éviter les abus.
 * 
 * @constant {rateLimit} limiter
 * @type {Object}
 * @description Limitation de 100 requêtes par période de 15 minutes.
 * @see https://www.npmjs.com/package/express-rate-limit
 */
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite de 100 requêtes
  message: { error: 'Trop de requêtes, réessayez plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Limiteur de tentative de connexion pour éviter les attaques par brute-force.
 * Ce middleware limite le nombre de tentatives de connexion successives à 5 par période de 15 minutes.
 * 
 * @constant {rateLimit} loginRateLimiter
 * @type {Object}
 * @description Limite de 5 tentatives de connexion par période de 15 minutes.
 * @see https://www.npmjs.com/package/express-rate-limit
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limite de 5 tentatives
  message: { error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Limiteur de tentative de réinitialisation du mot de passe pour éviter les attaques par brute-force.
 * Ce middleware limite le nombre de demandes de réinitialisation de mot de passe à 3 par période de 30 minutes.
 * 
 * @constant {rateLimit} forgotPasswordRateLimiter
 * @type {Object}
 * @description Limite de 3 demandes de réinitialisation de mot de passe par période de 30 minutes.
 * @see https://www.npmjs.com/package/express-rate-limit
 */
export const forgotPasswordRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 3, // Limite de 3 tentatives
  message: { error: 'Trop de demandes de réinitialisation. Réessayez plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Limiteur de tentative d'inscription pour éviter les inscriptions abusives.
 * Ce middleware limite le nombre d'inscriptions à 3 par période de 15 minutes.
 * 
 * @constant {rateLimit} registerRateLimiter
 * @type {Object}
 * @description Limite de 3 inscriptions par période de 15 minutes.
 * @see https://www.npmjs.com/package/express-rate-limit
 */
export const registerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limite de 3 inscriptions par période
  message: { error: 'Trop de tentatives d’inscription. Réessayez plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});
