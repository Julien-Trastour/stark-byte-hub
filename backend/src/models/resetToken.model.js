import prisma from '../utils/db.js';

/**
 * 🔐 Crée un token de réinitialisation de mot de passe
 * @param {string} userId - L'ID de l'utilisateur concerné
 * @param {string} token - Le token généré (UUID ou chaîne sécurisée)
 * @param {Date} expiresAt - Date d'expiration du token
 * @returns {Promise<PasswordResetToken>}
 */
export const createResetToken = async (userId, token, expiresAt) => {
  return prisma.passwordResetToken.create({
    data: { userId, token, expiresAt },
  });
};

/**
 * 🔍 Recherche un token de réinitialisation
 * @param {string} token
 * @returns {Promise<PasswordResetToken|null>}
 */
export const findResetToken = async (token) => {
  return prisma.passwordResetToken.findUnique({
    where: { token },
  });
};

/**
 * ❌ Supprime un token de réinitialisation (utilisé ou expiré)
 * @param {string} token
 * @returns {Promise<void>}
 */
export const deleteResetToken = async (token) => {
  await prisma.passwordResetToken.delete({
    where: { token },
  });
};

/**
 * 🧹 Supprime tous les tokens expirés (nettoyage régulier)
 * @returns {Promise<number>} - Nombre de tokens supprimés
 */
export const deleteExpiredResetTokens = async () => {
  const result = await prisma.passwordResetToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  return result.count;
};
