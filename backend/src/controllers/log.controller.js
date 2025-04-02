import prisma from '../utils/db.js';
import { showError } from '../utils/showError.js';

/**
 * @route GET /logs/login
 * @access Admin avec permission logs:view
 * @description Retourne les logs de connexions filtrés (optionnels : userId, ip, since, until)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getLoginLogs = async (req, res) => {
  try {
    const { userId, ip, since, until } = req.query;

    const where = {
      ...(userId && { userId }),
      ...(ip && { ip }),
      ...(since && { createdAt: { gte: new Date(since) } }),
      ...(until && {
        createdAt: {
          ...(since ? { gte: new Date(since) } : {}),
          lte: new Date(until),
        },
      }),
    };

    const logs = await prisma.loginLog.findMany({
      where,
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
    });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route GET /logs/stats
 * @access Admin avec permission logs:view
 * @description Retourne des statistiques sur les connexions (filtrables)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getLoginLogsStats = async (req, res) => {
  try {
    const { userId, ip, since, until } = req.query;

    const where = {
      ...(userId && { userId }),
      ...(ip && { ip }),
      ...(since && { createdAt: { gte: new Date(since) } }),
      ...(until && {
        createdAt: {
          ...(since ? { gte: new Date(since) } : {}),
          lte: new Date(until),
        },
      }),
    };

    const total = await prisma.loginLog.count({ where });

    const byUser = await prisma.loginLog.groupBy({
      by: ['userId'],
      _count: true,
      where,
    });

    const byIp = await prisma.loginLog.groupBy({
      by: ['ip'],
      _count: true,
      where,
    });

    const byDay = await prisma.loginLog.groupBy({
      by: [{ createdAt: true }],
      _count: true,
      where,
    });

    res.json({
      total,
      byUser,
      byIp,
      byDay: byDay.map(({ createdAt, _count }) => ({
        date: createdAt.toISOString().split('T')[0],
        count: _count,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route DELETE /logs/login
 * @access Admin avec permission logs:manage
 * @description Supprime tous les logs de connexion
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 */
export const deleteAllLoginLogs = async (_req, res) => {
  try {
    const result = await prisma.loginLog.deleteMany();
    res.json({
      message: `Tous les logs supprimés (${result.count} entrées).`,
    });
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route DELETE /logs/login/:id
 * @access Admin avec permission logs:manage
 * @description Supprime un log de connexion spécifique
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const deleteLoginLogById = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await prisma.loginLog.findUnique({ where: { id } });
    if (!log) {
      return res.status(404).json({ error: 'Log non trouvé.' });
    }

    await prisma.loginLog.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};
