import { RobotModel } from '../models/robot.model.js';
import prisma from '../utils/db.js';
import { showError } from '../utils/showError.js';
import { logAuditAction } from '../utils/logAudit.js';

/**
 * @namespace RobotController
 * @description Contrôleur principal pour la gestion des robots
 */
export const RobotController = {
  /**
   * @route GET /robots
   * @access Utilisateur connecté
   * @description Récupère tous les robots liés à l'utilisateur connecté
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  getAllByUser: async (req, res) => {
    try {
      const robots = await RobotModel.getByUserId(req.user.id);
      res.json(robots);
    } catch (err) {
      res.status(500).json({ error: showError(err) });
    }
  },

  /**
   * @route GET /robots/all
   * @access Permission : view_all_robots
   * @description Récupère tous les robots existants en base (admin uniquement)
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  getAll: async (req, res) => {
    if (!req.user.role?.permissions.includes('view_all_robots')) {
      return res.status(403).json({ error: 'Permission requise.' });
    }

    try {
      const robots = await RobotModel.getAll();
      res.json(robots);
    } catch (err) {
      res.status(500).json({ error: showError(err) });
    }
  },

  /**
   * @route GET /robots/:id
   * @access Propriétaire ou permission "*"
   * @description Récupère le détail d'un robot spécifique
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  getOne: async (req, res) => {
    try {
      const robot = await RobotModel.getById(req.params.id);
      const isOwner = robot?.userId === req.user.id;
      const hasRight = req.user.role?.permissions.includes('*') || isOwner;

      if (!robot || !hasRight) {
        return res.status(404).json({ error: 'Robot introuvable ou accès refusé.' });
      }

      res.json(robot);
    } catch (err) {
      res.status(500).json({ error: showError(err) });
    }
  },

  /**
   * @route POST /robots
   * @access Permission : create_robot
   * @description Crée un nouveau robot
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  create: async (req, res) => {
    if (!req.user.role?.permissions.includes('create_robot')) {
      return res.status(403).json({ error: 'Permission requise pour créer un robot.' });
    }

    const { serialNumber, linkKey, firmware, color, controllable, model } = req.body;

    if (!serialNumber || !linkKey || !firmware || !color || controllable === undefined || !model) {
      return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    try {
      const robot = await RobotModel.create({
        serialNumber,
        linkKey,
        firmware,
        color,
        controllable,
        model,
      });

      await logAuditAction(req.user.id, 'create_robot', {
        robotId: robot.id,
        serialNumber: robot.serialNumber,
        model,
      });

      res.status(201).json(robot);
    } catch (err) {
      res.status(500).json({ error: showError(err) });
    }
  },

  /**
   * @route POST /robots/import
   * @access Permission : import_robots
   * @description Importe plusieurs robots depuis un tableau JSON
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  importMany: async (req, res) => {
    if (!req.user.role?.permissions.includes('import_robots')) {
      return res.status(403).json({ error: 'Permission refusée pour l’import.' });
    }

    const robots = req.body;
    if (!Array.isArray(robots)) {
      return res.status(400).json({ error: 'Le format attendu est un tableau.' });
    }

    const created = [];
    const ignored = [];

    for (const raw of robots) {
      const data = {
        ...raw,
        controllable: String(raw.controllable).toLowerCase() === 'true',
      };

      const isValid =
        typeof data.serialNumber === 'string' &&
        typeof data.linkKey === 'string' &&
        typeof data.model === 'string' &&
        typeof data.firmware === 'string' &&
        typeof data.color === 'string' &&
        typeof data.controllable === 'boolean';

      if (isValid) {
        try {
          const robot = await RobotModel.create(data);
          created.push(robot);

          await logAuditAction(req.user.id, 'import_robot', {
            robotId: robot.id,
            serialNumber: robot.serialNumber,
          });
        } catch {
          ignored.push(raw);
        }
      } else {
        ignored.push(raw);
      }
    }

    res.status(201).json({
      createdCount: created.length,
      ignoredCount: ignored.length,
      created,
      ignored,
    });
  },

  /**
   * @route POST /robots/link
   * @access Utilisateur connecté
   * @description Lie un robot existant à l’utilisateur via serialNumber + linkKey
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  linkToUser: async (req, res) => {
    const { serialNumber, linkKey, name } = req.body;

    try {
      const robot = await prisma.robot.findUnique({ where: { serialNumber } });

      if (!robot || robot.linkKey !== linkKey) {
        return res.status(400).json({ error: 'N° de série ou clé incorrecte.' });
      }

      if (robot.userId) {
        return res.status(400).json({ error: 'Ce robot est déjà lié à un compte.' });
      }

      const updated = await prisma.robot.update({
        where: { id: robot.id },
        data: {
          userId: req.user.id,
          name,
        },
      });

      await logAuditAction(req.user.id, 'link_robot', {
        robotId: updated.id,
        serialNumber: updated.serialNumber,
      });

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: showError(err) });
    }
  },

  /**
   * @route PUT /robots/:id
   * @access Propriétaire ou permission "*"
   * @description Met à jour les données d’un robot
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  update: async (req, res) => {
    try {
      const robot = await RobotModel.getById(req.params.id);
      const isOwner = robot?.userId === req.user.id;
      const hasRight = req.user.role?.permissions.includes('*') || isOwner;

      if (!robot || !hasRight) {
        return res.status(404).json({ error: 'Robot introuvable ou accès refusé.' });
      }

      const updated = await RobotModel.update(req.params.id, req.body);

      await logAuditAction(req.user.id, 'update_robot', {
        robotId: updated.id,
        serialNumber: updated.serialNumber,
      });

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: showError(err) });
    }
  },

  /**
   * @route DELETE /robots/:id
   * @access Propriétaire ou permission "*"
   * @description Supprime un robot existant
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  remove: async (req, res) => {
    try {
      const robot = await RobotModel.getById(req.params.id);
      const isOwner = robot?.userId === req.user.id;
      const hasRight = req.user.role?.permissions.includes('*') || isOwner;

      if (!robot || !hasRight) {
        return res.status(404).json({ error: 'Robot introuvable ou accès refusé.' });
      }

      await RobotModel.delete(req.params.id);

      await logAuditAction(req.user.id, 'delete_robot', {
        robotId: robot.id,
        serialNumber: robot.serialNumber,
      });

      res.json({ message: 'Robot supprimé avec succès.' });
    } catch (err) {
      res.status(500).json({ error: showError(err) });
    }
  },
};
