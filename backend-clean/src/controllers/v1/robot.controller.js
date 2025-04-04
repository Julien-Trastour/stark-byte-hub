import { showError } from '../../utils/showError.js'
import { logAudit } from '../../models/v1/log.model.js'
import { RobotModel } from '../../models/v1/robot.model.js'
import prisma from '../../utils/db.js'

/**
 * @route GET /robots
 * @desc Récupère les robots liés à l’utilisateur connecté
 * @access Utilisateur connecté
 */
export const getUserRobots = async (req, res) => {
  try {
    const robots = await RobotModel.getByUserId(req.user.id)
    res.json(robots)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route GET /robots/all
 * @desc Récupère tous les robots (admin)
 * @access Permission: view_all_robots
 */
export const getAllRobots = async (_req, res) => {
  try {
    const robots = await RobotModel.getAll()
    res.json(robots)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route GET /robots/:id
 * @desc Récupère un robot spécifique
 * @access Propriétaire ou permission "*"
 */
export const getRobotById = async (req, res) => {
  try {
    const robot = await RobotModel.getById(req.params.id)
    const isOwner = robot?.userId === req.user.id
    const hasRight = req.user.role?.permissions.includes('*') || isOwner

    if (!robot || !hasRight) {
      return res.status(404).json({ error: 'Robot introuvable ou accès refusé.' })
    }

    res.json(robot)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route POST /robots
 * @desc Crée un robot
 * @access Permission: create_robot
 */
export const createRobot = async (req, res) => {
  try {
    const { serialNumber, linkKey, firmware, color, controllable, model } = req.body

    if (!serialNumber || !linkKey || !firmware || !color || controllable === undefined || !model) {
      return res.status(400).json({ error: 'Champs requis manquants.' })
    }

    const robot = await RobotModel.create({ serialNumber, linkKey, firmware, color, controllable, model })

    await logAudit(req.user.id, 'robot_created', {
      robotId: robot.id,
      serialNumber,
    })

    res.status(201).json(robot)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route POST /robots/import
 * @desc Importe une liste de robots
 * @access Permission: import_robots
 */
export const importRobots = async (req, res) => {
  const robots = req.body
  if (!Array.isArray(robots)) {
    return res.status(400).json({ error: 'Le format attendu est un tableau.' })
  }

  const created = []
  const ignored = []

  for (const raw of robots) {
    const data = {
      ...raw,
      controllable: String(raw.controllable).toLowerCase() === 'true',
    }

    const isValid =
      typeof data.serialNumber === 'string' &&
      typeof data.linkKey === 'string' &&
      typeof data.model === 'string' &&
      typeof data.firmware === 'string' &&
      typeof data.color === 'string' &&
      typeof data.controllable === 'boolean'

    if (!isValid) {
      ignored.push(raw)
      continue
    }

    try {
      const robot = await RobotModel.create(data)
      created.push(robot)

      await logAudit(req.user.id, 'robot_imported', {
        robotId: robot.id,
        serialNumber: robot.serialNumber,
      })
    } catch {
      ignored.push(raw)
    }
  }

  res.status(201).json({
    createdCount: created.length,
    ignoredCount: ignored.length,
    created,
    ignored,
  })
}

/**
 * @route POST /robots/link
 * @desc Lie un robot à un utilisateur
 * @access Utilisateur connecté
 */
export const linkRobotToUser = async (req, res) => {
  const { serialNumber, linkKey, name } = req.body

  try {
    const robot = await prisma.robot.findUnique({ where: { serialNumber } })

    if (!robot || robot.linkKey !== linkKey) {
      return res.status(400).json({ error: 'N° de série ou clé incorrecte.' })
    }

    if (robot.userId) {
      return res.status(400).json({ error: 'Ce robot est déjà lié à un compte.' })
    }

    const updated = await prisma.robot.update({
      where: { id: robot.id },
      data: {
        userId: req.user.id,
        name,
      },
    })

    await logAudit(req.user.id, 'robot_linked', {
      robotId: updated.id,
      serialNumber: updated.serialNumber,
    })

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route PUT /robots/:id
 * @desc Met à jour un robot
 * @access Propriétaire ou permission "*"
 */
export const updateRobot = async (req, res) => {
  try {
    const robot = await RobotModel.getById(req.params.id)
    const isOwner = robot?.userId === req.user.id
    const hasRight = req.user.role?.permissions.includes('*') || isOwner

    if (!robot || !hasRight) {
      return res.status(404).json({ error: 'Robot introuvable ou accès refusé.' })
    }

    const updated = await RobotModel.update(req.params.id, req.body)

    await logAudit(req.user.id, 'robot_updated', {
      robotId: updated.id,
    })

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route DELETE /robots/:id
 * @desc Supprime un robot
 * @access Propriétaire ou permission "*"
 */
export const deleteRobot = async (req, res) => {
  try {
    const robot = await RobotModel.getById(req.params.id)
    const isOwner = robot?.userId === req.user.id
    const hasRight = req.user.role?.permissions.includes('*') || isOwner

    if (!robot || !hasRight) {
      return res.status(404).json({ error: 'Robot introuvable ou accès refusé.' })
    }

    await RobotModel.delete(req.params.id)

    await logAudit(req.user.id, 'robot_deleted', {
      robotId: robot.id,
      serialNumber: robot.serialNumber,
    })

    res.json({ message: 'Robot supprimé avec succès.' })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}
