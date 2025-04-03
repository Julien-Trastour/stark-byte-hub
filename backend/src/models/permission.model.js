import prisma from "../utils/db.js";

/**
 * 🔍 Liste toutes les permissions
 * @returns {Promise<Permission[]>}
 */
export const getAllPermissions = async () => {
  return prisma.permission.findMany({ orderBy: { name: "asc" } });
};

/**
 * 🔍 Récupère une permission par ID
 * @param {string} id
 * @returns {Promise<Permission|null>}
 */
export const getPermissionById = async (id) => {
  return prisma.permission.findUnique({ where: { id } });
};

/**
 * ➕ Crée une nouvelle permission
 * @param {{ name: string }} data
 * @returns {Promise<Permission>}
 */
export const createPermission = async (data) => {
  return prisma.permission.create({ data });
};

/**
 * 📝 Met à jour une permission
 * @param {string} id
 * @param {{ name: string }} data
 * @returns {Promise<Permission>}
 */
export const updatePermission = async (id, data) => {
  return prisma.permission.update({ where: { id }, data });
};

/**
 * ❌ Supprime une permission
 * @param {string} id
 * @returns {Promise<void>}
 */
export const deletePermission = async (id) => {
  await prisma.permission.delete({ where: { id } });
};
