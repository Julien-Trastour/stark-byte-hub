import prisma from '../utils/db.js';

/**
 * Récupère tous les rôles
 */
export const getAllRoles = () => {
  return prisma.role.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      permissions: true,
      createdAt: true,
    },
  });
};

/**
 * Récupère un rôle par ID
 * @param {string} id
 */
export const getRoleById = (id) => {
  return prisma.role.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      permissions: true,
      createdAt: true,
    },
  });
};

/**
 * Crée un nouveau rôle
 * @param {{ name: string, permissions: string[] }} data
 */
export const createRole = (data) => {
  return prisma.role.create({
    data,
    select: {
      id: true,
      name: true,
      permissions: true,
      createdAt: true,
    },
  });
};

/**
 * Met à jour un rôle
 * @param {string} id
 * @param {{ name?: string, permissions?: string[] }} data
 */
export const updateRole = (id, data) => {
  return prisma.role.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      permissions: true,
      createdAt: true,
    },
  });
};

/**
 * Supprime un rôle
 * @param {string} id
 */
export const deleteRole = (id) => {
  return prisma.role.delete({ where: { id } });
};

/**
 * Compte le nombre d'utilisateurs ayant un rôle donné
 * @param {string} roleId
 */
export const countUsersWithRole = (roleId) => {
  return prisma.user.count({ where: { roleId } });
};
