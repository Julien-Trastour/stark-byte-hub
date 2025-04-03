import {
    getAllPermissions,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
  } from "../models/permission.model.js";
  
  /**
   * GET /permissions
   */
  export const getPermissionsController = async (req, res) => {
    try {
      const permissions = await getAllPermissions();
      res.json(permissions);
    } catch (err) {
      console.error("Erreur getPermissions:", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };
  
  /**
   * GET /permissions/:id
   */
  export const getPermissionController = async (req, res) => {
    try {
      const permission = await getPermissionById(req.params.id);
      if (!permission) {
        return res.status(404).json({ error: "Permission introuvable" });
      }
      res.json(permission);
    } catch (err) {
      console.error("Erreur getPermission:", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };
  
  /**
   * POST /permissions
   */
  export const createPermissionController = async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Nom requis" });
      }
  
      const permission = await createPermission({ name });
      res.status(201).json(permission);
    } catch (err) {
      console.error("Erreur createPermission:", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };
  
  /**
   * PATCH /permissions/:id
   */
  export const updatePermissionController = async (req, res) => {
    try {
      const { name } = req.body;
  
      const existing = await getPermissionById(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Permission introuvable" });
      }
  
      const permission = await updatePermission(req.params.id, { name });
      res.json(permission);
    } catch (err) {
      console.error("Erreur updatePermission:", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };
  
  /**
   * DELETE /permissions/:id
   */
  export const deletePermissionController = async (req, res) => {
    try {
      const existing = await getPermissionById(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Permission introuvable" });
      }
  
      await deletePermission(req.params.id);
      res.status(204).send();
    } catch (err) {
      console.error("Erreur deletePermission:", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };
  