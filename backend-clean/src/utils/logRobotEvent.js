import prisma from './db.js';

/**
 * Crée un log pour un robot spécifique.
 *
 * @function logRobotEvent
 * @param {string} robotId - ID du robot concerné.
 * @param {'info'|'warning'|'error'|'debug'} type - Type de log.
 * @param {string} message - Message du log à enregistrer.
 * @returns {Promise<void>} Rien si tout se passe bien, erreur loguée sinon.
 */
export async function logRobotEvent(robotId, type, message) {
  try {
    await prisma.log.create({
      data: {
        robotId,
        type,
        message,
      },
    });
  } catch (err) {
    console.error('[Robot Log] Échec de l’enregistrement :', err);
  }
}