import { showError } from '../../utils/showError.js'
import { logAudit } from '../../models/v1/log.model.js'

import {
  getAllRoles as getAllRolesFromModel,
  getRoleById as getRoleByIdFromModel,
  findRoleByName,
  createRole as createRoleInModel,
  updateRole as updateRoleInModel,
  deleteRole as deleteRoleInModel,
  countUsersWithRole
} from '../../models/v1/role.model.js'

/**
 * @route GET /roles
 * @access Permission: view_roles
 * @description Retourne tous les rôles avec leurs permissions
 */
export const getAllRoles = async (_req, res) => {
  try {
    const roles = await getAllRolesFromModel()
    res.json(roles)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route GET /roles/:id
 * @access Permission: view_roles
 * @description Retourne un rôle spécifique
 */
export const getRoleById = async (req, res) => {
  try {
    const role = await getRoleByIdFromModel(req.params.id)
    if (!role) return res.status(404).json({ error: 'Rôle introuvable.' })
    res.json(role)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route POST /roles
 * @access Permission: create_role
 * @description Crée un nouveau rôle avec une liste de permissions
 */
export const createRole = async (req, res) => {
  const { name, permissions = [] } = req.body

  if (!name || !Array.isArray(permissions)) {
    return res.status(400).json({ error: 'Nom et permissions requis.' })
  }

  try {
    const existing = await findRoleByName(name)
    if (existing) {
      return res.status(400).json({ error: 'Ce rôle existe déjà.' })
    }

    const role = await createRoleInModel({ name, permissions })
    await logAudit(req.user.id, 'role_created', { roleName: name })

    res.status(201).json(role)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route PATCH /roles/:id
 * @access Permission: edit_roles
 * @description Met à jour un rôle (nom ou permissions)
 */
export const updateRole = async (req, res) => {
  const { id } = req.params
  const { name, permissions } = req.body

  if (!name && !permissions) {
    return res.status(400).json({ error: 'Aucune donnée à mettre à jour.' })
  }

  try {
    const existing = await getRoleByIdFromModel(id)
    if (!existing) return res.status(404).json({ error: 'Rôle introuvable.' })

    const updated = await updateRoleInModel(id, { name, permissions })
    await logAudit(req.user.id, 'role_updated', {
      roleId: id,
      updates: Object.keys(req.body),
    })

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route DELETE /roles/:id
 * @access Permission: delete_roles
 * @description Supprime un rôle (si non utilisé)
 */
export const deleteRole = async (req, res) => {
  const { id } = req.params

  try {
    const usageCount = await countUsersWithRole(id)
    if (usageCount > 0) {
      return res
        .status(400)
        .json({ error: 'Ce rôle est encore utilisé par des utilisateurs.' })
    }

    await deleteRoleInModel(id)
    await logAudit(req.user.id, 'role_deleted', { roleId: id })

    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}
