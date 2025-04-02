import rateLimit from 'express-rate-limit';

/**
 * Limiteur global générique (par défaut)
 */
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Trop de requêtes, réessayez plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Limite brute-force sur /auth/login
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Limite brute-force sur /auth/forgot-password
 */
export const forgotPasswordRateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 3,
  message: { error: 'Trop de demandes de réinitialisation. Réessayez plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});