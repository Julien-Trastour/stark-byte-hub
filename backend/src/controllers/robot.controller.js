import { RobotModel } from '../models/robot.model.js';
import prisma from '../utils/db.js';
import { showError } from '../utils/showError.js';

/**
 * @namespace RobotController
 * @description Contrôleur principal des robots
 */
export const RobotController = {
  /**
   * @route GET /robots
   * @access Utilisateur connecté
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
   * @access Admin uniquement
   */
  getAll: async (req, res) => {
    if (req.user.role?.name !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé.' });
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
   * @access Admin ou Propriétaire
   */
  getOne: async (req, res) => {
    try {
      const robot = await RobotModel.getById(req.params.id);
      const isAdmin = req.user.role?.name === 'admin';
      const isOwner = robot?.userId === req.user.id;

      if (!robot || (!isAdmin && !isOwner)) {
        return res.status(404).json({ error: 'Robot introuvable ou accès refusé.' });
      }

      res.json(robot);
    } catch (err) {
      res.status(500).json({ error: showError(err) });
    }
  },

  /**
   * @route POST /robots
   * @access Admin uniquement
   */
  create: async (req, res) => {
    if (req.user.role?.name !== 'admin') {
      return res.status(403).json({ error: 'Seul un administrateur peut créer un robot.' });
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

      res.status(201).json(robot);
    } catch (err) {
      res.status(500).json({ error: showError(err) });
    }
  },

  /**
   * @route POST /robots/import
   * @access Admin uniquement
   */
  importMany: async (req, res) => {
    if (req.user.role?.name !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé.' });
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

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: showError(err) });
    }
  },

  /**
   * @route PUT /robots/:id
   * @access Admin ou Propriétaire
   */
  update: async (req, res) => {
    try {
      const robot = await RobotModel.getById(req.params.id);
      const isAdmin = req.user.role?.name === 'admin';
      const isOwner = robot?.userId === req.user.id;

      if (!robot || (!isAdmin && !isOwner)) {
        return res.status(404).json({ error: 'Robot introuvable ou accès refusé.' });
      }

      const updated = await RobotModel.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: showError(err) });
    }
  },

  /**
   * @route DELETE /robots/:id
   * @access Admin ou Propriétaire
   */
  remove: async (req, res) => {
    try {
      const robot = await RobotModel.getById(req.params.id);
      const isAdmin = req.user.role?.name === 'admin';
      const isOwner = robot?.userId === req.user.id;

      if (!robot || (!isAdmin && !isOwner)) {
        return res.status(404).json({ error: 'Robot introuvable ou accès refusé.' });
      }

      await RobotModel.delete(req.params.id);
      res.json({ message: 'Robot supprimé avec succès.' });
    } catch (err) {
      res.status(500).json({ error: showError(err) });
    }
  },
};
