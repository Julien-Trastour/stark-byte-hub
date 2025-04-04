import { showError } from '../../utils/showError.js'
import { logAudit } from '../../models/v1/log.model.js'

import {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission
} from '../../models/v1/permission.model.js'

/**
 * @route GET /permissions
 * @desc Récupère toutes les permissions
 * @access Permission: view_permissions
 */
export const getPermissionsController = async (_req, res) => {
  try {
    const permissions = await getAllPermissions()
    res.json(permissions)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route GET /permissions/:id
 * @desc Récupère une permission par ID
 * @access Permission: view_permissions
 */
export const getPermissionController = async (req, res) => {
  try {
    const permission = await getPermissionById(req.params.id)
    if (!permission) {
      return res.status(404).json({ error: 'Permission introuvable.' })
    }
    res.json(permission)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route POST /permissions
 * @desc Crée une nouvelle permission
 * @access Permission: create_permission
 */
export const createPermissionController = async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Nom requis.' })
    }

    const permission = await createPermission({ name })
    await logAudit(req.user.id, 'permission_created', { name })

    res.status(201).json(permission)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route PATCH /permissions/:id
 * @desc Met à jour une permission
 * @access Permission: edit_permission
 */
export const updatePermissionController = async (req, res) => {
  try {
    const { name } = req.body
    const { id } = req.params

    const existing = await getPermissionById(id)
    if (!existing) {
      return res.status(404).json({ error: 'Permission introuvable.' })
    }

    const permission = await updatePermission(id, { name })
    await logAudit(req.user.id, 'permission_updated', { id, name })

    res.json(permission)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route DELETE /permissions/:id
 * @desc Supprime une permission
 * @access Permission: delete_permission
 */
export const deletePermissionController = async (req, res) => {
  const { id } = req.params

  try {
    const existing = await getPermissionById(id)
    if (!existing) {
      return res.status(404).json({ error: 'Permission introuvable.' })
    }

    await deletePermission(id)
    await logAudit(req.user.id, 'permission_deleted', { id })

    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}
