import * as ModuleModel from '../models/module.model.js';
import { showError } from '../utils/showError.js';

/**
 * @namespace ModuleController
 * @description Contrôleur des modules utilisateurs (activation / désactivation)
 */
export const ModuleController = {
  /**
   * @route GET /modules
   * @description Liste tous les modules disponibles
   * @access Utilisateur connecté
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  getAll: async (req, res) => {
    try {
      const modules = await ModuleModel.getAllModules();
      res.json(modules);
    } catch (err) {
      res.status(500).json({ error: showError(err) });
    }
  },

  /**
   * @route GET /modules/enabled
   * @description Liste les modules activés pour l'utilisateur connecté
   * @access Utilisateur connecté
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  getEnabledForUser: async (req, res) => {
    try {
      const enabled = await ModuleModel.getEnabledModulesForUser(req.user.id);
      res.json(enabled.map((entry) => entry.module));
    } catch (err) {
      res.status(500).json({ error: showError(err) });
    }
  },

  /**
   * @route PATCH /modules/:id/enable
   * @description Active un module pour l’utilisateur connecté
   * @access Utilisateur connecté
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  enable: async (req, res) => {
    try {
      const moduleId = req.params.id;
      const result = await ModuleModel.enableModule(req.user.id, moduleId);
      res.json({ success: true, module: result });
    } catch (err) {
      res.status(500).json({ error: showError(err) });
    }
  },

  /**
   * @route PATCH /modules/:id/disable
   * @description Désactive un module pour l’utilisateur connecté
   * @access Utilisateur connecté
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  disable: async (req, res) => {
    try {
      const moduleId = req.params.id;
      const result = await ModuleModel.disableModule(req.user.id, moduleId);
      res.json({ success: true, module: result });
    } catch (err) {
      res.status(500).json({ error: showError(err) });
    }
  },
};
