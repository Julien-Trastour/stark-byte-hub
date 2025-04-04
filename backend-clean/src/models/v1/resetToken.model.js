import prisma from '../../utils/db.js';

/**
 * 🔐 Crée un token de réinitialisation de mot de passe
 * @param {string} userId - ID de l’utilisateur
 * @param {string} token - Token sécurisé (UUID, CUID ou autre)
 * @param {Date} expiresAt - Date d’expiration du token
 * @returns {Promise<PasswordResetToken>}
 */
export const createResetToken = (userId, token, expiresAt) => {
  return prisma.passwordResetToken.create({
    data: { userId, token, expiresAt },
  });
};

/**
 * 🔍 Récupère un token de réinitialisation par sa valeur
 * @param {string} token
 * @returns {Promise<PasswordResetToken|null>}
 */
export const findResetToken = (token) => {
  return prisma.passwordResetToken.findUnique({
    where: { token },
  });
};

/**
 * ❌ Supprime un token de réinitialisation spécifique
 * @param {string} token
 * @returns {Promise<void>}
 */
export const deleteResetToken = (token) => {
  return prisma.passwordResetToken.delete({
    where: { token },
  });
};

/**
 * 🧹 Nettoie les tokens expirés
 * @returns {Promise<number>} - Nombre de tokens supprimés
 */
export const deleteExpiredResetTokens = async () => {
  const result = await prisma.passwordResetToken.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });
  return result.count;
};
