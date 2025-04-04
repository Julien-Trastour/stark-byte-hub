import prisma from '../../utils/db.js'

/**
 * 📄 Crée un log générique (niveau info, warning, error…)
 *
 * @param {string} level - Niveau du log (info, warning, error, etc.)
 * @param {string} message - Message principal du log
 * @param {object} [context] - Contexte ou métadonnées additionnelles (facultatif)
 */
export const createLog = async (level, message, context = {}) => {
  try {
    await prisma.log.create({
      data: {
        level,
        message,
        context,
      },
    })
  } catch (err) {
    console.error('[Log] Erreur lors de la création du log standard :', err)
  }
}

/**
 * 🤖 Log d’un évènement robot
 *
 * @param {string} robotId - ID du robot concerné
 * @param {string} event - Nom ou type de l’évènement (ex : "battery_low")
 * @param {object} [details] - Données supplémentaires liées à l’évènement
 */
export const logRobotEvent = async (robotId, event, details = {}) => {
  try {
    await prisma.robotLog.create({
      data: {
        robotId,
        event,
        details,
      },
    })
  } catch (err) {
    console.error('[RobotLog] Erreur lors de l’enregistrement de l’évènement robot :', err)
  }
}

/**
 * 🕵️ Log d’audit (action utilisateur)
 *
 * @param {string} userId - ID de l’utilisateur ayant effectué l’action
 * @param {string} action - Type d’action (ex : "robot_deleted", "role_updated", "login")
 * @param {object} [metadata] - Métadonnées liées à l’action (facultatif)
 */
export const logAudit = async (userId, action, metadata = {}) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        metadata,
      },
    })
  } catch (err) {
    console.error('[AuditLog] Échec de l’enregistrement de l’action :', err)
  }
}

/**
 * 👤 Log d’une tentative de connexion
 *
 * @param {string} email - Email utilisé lors de la tentative
 * @param {boolean} success - Succès ou échec de la tentative
 * @param {string} ip - Adresse IP du client
 * @param {string} userAgent - User-Agent du client
 * @param {string|null} userId - ID utilisateur si login réussi
 */
export const logLoginAttempt = async (email, success, ip, userAgent, userId = null) => {
  try {
    await prisma.loginLog.create({
      data: {
        email,
        success,
        ip,
        userAgent,
        userId,
        timestamp: new Date(),
      },
    })
  } catch (err) {
    console.error('[LoginLog] Échec du log de tentative de connexion :', err)
  }
}
