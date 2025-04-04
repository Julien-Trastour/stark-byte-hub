import { showError } from '../../utils/showError.js'
import { logAudit } from '../../models/v1/log.model.js'

import {
  getAllModules,
  getEnabledModulesForUser,
  enableModule,
  disableModule
} from '../../models/v1/module.model.js'

/**
 * @route GET /modules
 * @desc Liste tous les modules disponibles
 * @access Utilisateur connecté
 */
export const getAllModulesController = async (_req, res) => {
  try {
    const modules = await getAllModules()
    res.json(modules)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route GET /modules/enabled
 * @desc Liste les modules activés pour l'utilisateur connecté
 * @access Utilisateur connecté
 */
export const getEnabledModulesController = async (req, res) => {
  try {
    const enabled = await getEnabledModulesForUser(req.user.id)
    res.json(enabled)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route PATCH /modules/:id/enable
 * @desc Active un module pour l’utilisateur connecté
 * @access Utilisateur connecté
 */
export const enableModuleController = async (req, res) => {
  try {
    const result = await enableModule(req.user.id, req.params.id)

    await logAudit(req.user.id, 'module_enabled', {
      moduleId: req.params.id,
    })

    res.json({ success: true, module: result })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route PATCH /modules/:id/disable
 * @desc Désactive un module pour l’utilisateur connecté
 * @access Utilisateur connecté
 */
export const disableModuleController = async (req, res) => {
  try {
    const result = await disableModule(req.user.id, req.params.id)

    await logAudit(req.user.id, 'module_disabled', {
      moduleId: req.params.id,
    })

    res.json({ success: true, module: result })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}
