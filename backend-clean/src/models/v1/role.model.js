import prisma from '../../utils/db.js'

/**
 * 🔍 Récupère tous les rôles avec leurs permissions
 */
export const getAllRoles = () => {
  return prisma.role.findMany({
    orderBy: { name: 'asc' },
    include: {
      permissions: {
        select: { name: true },
      },
    },
  })
}

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
  })
}

/**
 * 🔍 Récupère un rôle par son nom
 * @param {string} name
 */
export const findRoleByName = (name) => {
  return prisma.role.findUnique({
    where: { name },
    include: {
      permissions: {
        select: { name: true },
      },
    },
  })
}

/**
 * ➕ Crée un nouveau rôle avec permissions associées
 * @param {{ name: string, permissions?: string[] }} data
 */
export const createRole = ({ name, permissions }) => {
  return prisma.role.create({
    data: {
      name,
      permissions: permissions?.length
        ? {
            connect: permissions.map((permName) => ({ name: permName })),
          }
        : undefined,
    },
    include: {
      permissions: {
        select: { name: true },
      },
    },
  })
}

/**
 * 📝 Met à jour un rôle (nom + permissions)
 * @param {string} id
 * @param {{ name?: string, permissions?: string[] }} data
 */
export const updateRole = (id, { name, permissions }) => {
  const data = {}
  if (name) data.name = name
  if (permissions) {
    data.permissions = {
      set: [], // reset des permissions
      connect: permissions.map((permName) => ({ name: permName })),
    }
  }

  return prisma.role.update({
    where: { id },
    data,
    include: {
      permissions: {
        select: { name: true },
      },
    },
  })
}

/**
 * ❌ Supprime un rôle
 * @param {string} id
 */
export const deleteRole = (id) => {
  return prisma.role.delete({ where: { id } })
}

/**
 * 🔢 Compte le nombre d’utilisateurs associés à un rôle
 * @param {string} roleId
 */
export const countUsersWithRole = (roleId) => {
  return prisma.user.count({
    where: { roleId },
  })
}
