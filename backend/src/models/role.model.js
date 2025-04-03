import prisma from '../utils/db.js';

/**
 * 🔍 Récupère tous les rôles
 */
export const getAllRoles = () => {
  return prisma.role.findMany({
    orderBy: { name: 'asc' },
    include: {
      permissions: {
        select: { name: true },
      },
    },
  });
};

/**
 * 🔍 Récupère un rôle par ID
 * @param {string} id
 */
export const getRoleById = (id) => {
  return prisma.role.findUnique({
    where: { id },
    include: {
      permissions: {
        select: { name: true },
      },
    },
  });
};

/**
 * ➕ Crée un nouveau rôle
 * @param {{ name: string, permissions: string[] }} data
 */
export const createRole = async ({ name, permissions }) => {
  return prisma.role.create({
    data: {
      name,
      permissions: {
        connect: permissions.map((permName) => ({ name: permName })),
      },
    },
    include: {
      permissions: {
        select: { name: true },
      },
    },
  });
};

/**
 * 📝 Met à jour un rôle
 * @param {string} id
 * @param {{ name?: string, permissions?: string[] }} data
 */
export const updateRole = async (id, { name, permissions }) => {
  const updates = {
    ...(name && { name }),
    ...(permissions && {
      permissions: {
        set: [], // on vide avant de reconnecter
        connect: permissions.map((permName) => ({ name: permName })),
      },
    }),
  };

  return prisma.role.update({
    where: { id },
    data: updates,
    include: {
      permissions: {
        select: { name: true },
      },
    },
  });
};

/**
 * ❌ Supprime un rôle
 * @param {string} id
 */
export const deleteRole = (id) => {
  return prisma.role.delete({ where: { id } });
};

/**
 * 🔢 Compte le nombre d’utilisateurs pour un rôle
 * @param {string} roleId
 */
export const countUsersWithRole = (roleId) => {
  return prisma.user.count({ where: { roleId } });
};
