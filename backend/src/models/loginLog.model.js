import prisma from '../utils/db.js';

/**
 * Enregistre une tentative de connexion
 * @param {Object} params
 * @param {string} params.email
 * @param {boolean} params.success
 * @param {string} [params.userId]
 * @param {string} params.ip
 * @param {string} [params.userAgent]
 */
export const logLoginAttempt = async ({ email, success, userId, ip, userAgent }) => {
  try {
    await prisma.loginLog.create({
      data: {
        email,
        success,
        userId,
        ip,
        userAgent,
      },
    });
  } catch (err) {
    console.error('Erreur lors du log de connexion :', err);
  }
};
