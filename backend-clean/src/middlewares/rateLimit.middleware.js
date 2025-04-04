import rateLimit from 'express-rate-limit';

/**
 * 🌐 Limiteur global (100 requêtes / 15 min)
 * Protège l'API contre les abus généraux
 */
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Trop de requêtes, réessayez plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 🔐 Limiteur login (5 essais / 15 min)
 * Protection contre les attaques par force brute
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 📧 Limiteur mot de passe oublié (3 demandes / 30 min)
 * Empêche le spam de reset password
 */
export const forgotPasswordRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 3,
  message: { error: 'Trop de demandes de réinitialisation. Réessayez plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 👤 Limiteur inscription (3 inscriptions / 15 min)
 * Limite les créations de comptes abusives
 */
export const registerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { error: 'Trop de tentatives d’inscription. Réessayez plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});
