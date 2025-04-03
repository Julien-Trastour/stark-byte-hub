import prisma from '../utils/db.js'
import { showError } from '../utils/showError.js'

/**
 * @route GET /roles
 * @access Permission: view_roles
 * @description Retourne tous les rôles avec leurs permissions
 */
export const getAllRoles = async (_req, res) => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' },
      include: {
        permissions: {
          select: { name: true },
        },
      },
    });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route GET /roles/:id
 * @access Permission: view_roles
 * @description Retourne un rôle spécifique
 */
export const getRoleById = async (req, res) => {
  try {
    const role = await prisma.role.findUnique({
      where: { id: req.params.id },
      include: {
        permissions: {
          select: { name: true },
        },
      },
    });

    if (!role) return res.status(404).json({ error: 'Rôle introuvable.' });

    res.json(role);
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route POST /roles
 * @access Permission: create_role
 * @description Crée un nouveau rôle avec une liste de permissions
 */
export const createRole = async (req, res) => {
  const { name, permissions = [] } = req.body;

  if (!name || !Array.isArray(permissions)) {
    return res.status(400).json({ error: 'Nom et permissions requis.' });
  }

  try {
    const existing = await prisma.role.findUnique({ where: { name } });
    if (existing) {
      return res.status(400).json({ error: 'Ce rôle existe déjà.' });
    }

    const role = await prisma.role.create({
      data: {
        name,
        permissions: {
          connect: permissions.map((p) => ({ name: p })),
        },
      },
      include: {
        permissions: {
          select: { name: true },
        },
      },
    });

    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route PATCH /roles/:id
 * @access Permission: edit_roles
 * @description Met à jour un rôle (nom ou permissions)
 */
export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;

  if (!name && !permissions) {
    return res.status(400).json({ error: 'Aucune donnée à mettre à jour.' });
  }

  try {
    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) return res.status(404).json({ error: 'Rôle introuvable.' });

    const updated = await prisma.role.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(permissions && {
          permissions: {
            set: [], // on vide
            connect: permissions.map((p) => ({ name: p })),
          },
        }),
      },
      include: {
        permissions: {
          select: { name: true },
        },
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route DELETE /roles/:id
 * @access Permission: delete_roles
 * @description Supprime un rôle (si non utilisé)
 */
export const deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    const usersWithRole = await prisma.user.count({ where: { roleId: id } });
    if (usersWithRole > 0) {
      return res
        .status(400)
        .json({ error: 'Ce rôle est encore utilisé par des utilisateurs.' });
    }

    await prisma.role.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};
