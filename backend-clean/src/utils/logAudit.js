import prisma from './db.js';

/**
 * Enregistre un log d’audit dans la base de données.
 *
 * @param {string} userId - ID de l’utilisateur ayant effectué l’action.
 * @param {string} action - Description de l’action effectuée (ex : "user_created", "login", "robot_deleted").
 * @param {object} [metadata={}] - Données additionnelles à enregistrer (objet JSON sérialisable).
 */
export const logAudit = async (userId, action, metadata = {}) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        metadata,
      },
    });
  } catch (err) {
    // Ne jamais faire planter l’app si le log échoue
    console.error('[Audit Log] Échec de l’enregistrement :', err);
  }
};
