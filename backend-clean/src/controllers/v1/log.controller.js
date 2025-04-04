import prisma from '../../utils/db.js'
import { showError } from '../../utils/showError.js'

/**
 * @route GET /logs/login
 * @desc Liste les logs de connexion
 * @access Permission: logs:view
 * @tags Logs
 */
export const getLoginLogs = async (req, res) => {
  try {
    const { userId, ip, since, until } = req.query

    const where = {
      ...(userId && { userId }),
      ...(ip && { ip }),
      ...(since && { timestamp: { gte: new Date(since) } }),
      ...(until && {
        timestamp: {
          ...(since ? { gte: new Date(since) } : {}),
          lte: new Date(until),
        },
      }),
    }

    const logs = await prisma.loginLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    res.json(logs)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route GET /logs/stats
 * @desc Statistiques des connexions
 * @access Permission: logs:view
 * @tags Logs
 */
export const getLoginLogsStats = async (req, res) => {
  try {
    const { userId, ip, since, until } = req.query

    const where = {
      ...(userId && { userId }),
      ...(ip && { ip }),
      ...(since && { timestamp: { gte: new Date(since) } }),
      ...(until && {
        timestamp: {
          ...(since ? { gte: new Date(since) } : {}),
          lte: new Date(until),
        },
      }),
    }

    const total = await prisma.loginLog.count({ where })

    const byUser = await prisma.loginLog.groupBy({
      by: ['userId'],
      _count: true,
      where,
    })

    const byIp = await prisma.loginLog.groupBy({
      by: ['ip'],
      _count: true,
      where,
    })

    const byDay = await prisma.loginLog.groupBy({
      by: ['timestamp'],
      _count: true,
      where,
    })

    res.json({
      total,
      byUser,
      byIp,
      byDay: byDay.map(({ timestamp, _count }) => ({
        date: timestamp.toISOString().split('T')[0],
        count: _count,
      })),
    })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route DELETE /logs/login
 * @desc Supprime tous les logs de connexion
 * @access Permission: logs:manage
 * @tags Logs
 */
export const deleteAllLoginLogs = async (_req, res) => {
  try {
    const result = await prisma.loginLog.deleteMany()
    res.json({ message: `Tous les logs supprimés (${result.count})` })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route DELETE /logs/login/:id
 * @desc Supprime un log de connexion
 * @access Permission: logs:manage
 * @tags Logs
 */
export const deleteLoginLogById = async (req, res) => {
  try {
    const { id } = req.params
    const log = await prisma.loginLog.findUnique({ where: { id } })
    if (!log) return res.status(404).json({ error: 'Log introuvable.' })

    await prisma.loginLog.delete({ where: { id } })
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route GET /logs/audit
 * @desc Liste les logs d’audit
 * @access Permission: logs:view
 * @tags Logs
 */
export const getAuditLogs = async (_req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })
    res.json(logs)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route GET /logs/audit/:id
 * @desc Détail d’un log d’audit
 * @access Permission: logs:view
 * @tags Logs
 */
export const getAuditLogById = async (req, res) => {
  try {
    const log = await prisma.auditLog.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })
    if (!log) return res.status(404).json({ error: 'Log introuvable.' })
    res.json(log)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route DELETE /logs/audit
 * @desc Supprime tous les logs d’audit
 * @access Permission: logs:manage
 * @tags Logs
 */
export const deleteAllAuditLogs = async (_req, res) => {
  try {
    const result = await prisma.auditLog.deleteMany()
    res.json({ message: `Logs audit supprimés (${result.count})` })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route DELETE /logs/audit/:id
 * @desc Supprime un log d’audit
 * @access Permission: logs:manage
 * @tags Logs
 */
export const deleteAuditLogById = async (req, res) => {
  try {
    const log = await prisma.auditLog.findUnique({ where: { id: req.params.id } })
    if (!log) return res.status(404).json({ error: 'Log introuvable.' })

    await prisma.auditLog.delete({ where: { id: req.params.id } })
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route GET /logs/robot
 * @desc Liste les logs robot
 * @access Permission: logs:view
 * @tags Logs
 */
export const getRobotLogs = async (_req, res) => {
  try {
    const logs = await prisma.robotLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        robot: {
          select: {
            id: true,
            serialNumber: true,
            model: true,
            name: true,
          },
        },
      },
    })
    res.json(logs)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route GET /logs/robot/:id
 * @desc Détail d’un log robot
 * @access Permission: logs:view
 * @tags Logs
 */
export const getRobotLogById = async (req, res) => {
  try {
    const log = await prisma.robotLog.findUnique({
      where: { id: req.params.id },
      include: {
        robot: {
          select: {
            id: true,
            serialNumber: true,
            model: true,
            name: true,
          },
        },
      },
    })
    if (!log) return res.status(404).json({ error: 'Log introuvable.' })
    res.json(log)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route DELETE /logs/robot
 * @desc Supprime tous les logs robot
 * @access Permission: logs:manage
 * @tags Logs
 */
export const deleteAllRobotLogs = async (_req, res) => {
  try {
    const result = await prisma.robotLog.deleteMany()
    res.json({ message: `Logs robot supprimés (${result.count})` })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route DELETE /logs/robot/:id
 * @desc Supprime un log robot
 * @access Permission: logs:manage
 * @tags Logs
 */
export const deleteRobotLogById = async (req, res) => {
  try {
    const log = await prisma.robotLog.findUnique({ where: { id: req.params.id } })
    if (!log) return res.status(404).json({ error: 'Log introuvable.' })

    await prisma.robotLog.delete({ where: { id: req.params.id } })
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}
