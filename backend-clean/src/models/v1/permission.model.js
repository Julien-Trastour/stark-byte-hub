import prisma from '../../utils/db.js';

/**
 * 🔍 Liste toutes les permissions existantes
 * @returns {Promise<Permission[]>}
 */
export const getAllPermissions = () => {
  return prisma.permission.findMany({
    orderBy: { name: 'asc' },
  });
};

/**
 * 🔍 Récupère une permission par son ID
 * @param {string} id
 * @returns {Promise<Permission|null>}
 */
export const getPermissionById = (id) => {
  return prisma.permission.findUnique({
    where: { id },
  });
};

/**
 * ➕ Crée une nouvelle permission
 * @param {{ name: string }} data
 * @returns {Promise<Permission>}
 */
export const createPermission = ({ name }) => {
  return prisma.permission.create({
    data: { name },
  });
};

/**
 * 📝 Met à jour le nom d'une permission
 * @param {string} id
 * @param {{ name: string }} data
 * @returns {Promise<Permission>}
 */
export const updatePermission = (id, { name }) => {
  return prisma.permission.update({
    where: { id },
    data: { name },
  });
};

/**
 * ❌ Supprime une permission par ID
 * @param {string} id
 * @returns {Promise<Permission>}
 */
export const deletePermission = (id) => {
  return prisma.permission.delete({
    where: { id },
  });
};
