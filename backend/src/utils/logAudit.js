import prisma from './db.js';

/**
 * Enregistre une action critique dans les logs d’audit
 * @param {string} userId - ID de l'utilisateur à l'origine de l'action
 * @param {string} action - Nom de l'action (ex: 'delete_robot', 'update_user')
 * @param {object} [metadata] - Données supplémentaires liées à l'action
 * @returns {Promise<void>}
 */
export async function logAuditAction(userId, action, metadata = {}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        metadata,
      },
    });
  } catch (err) {
    console.error('Erreur lors de la journalisation de l’audit :', err);
  }
}
