import prisma from '../../utils/db.js';

/**
 * 🔍 Recherche un utilisateur par email (avec rôle + permissions)
 * @param {string} email
 * @returns {Promise<User|null>}
 */
export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
    include: {
      role: {
        include: { permissions: true },
      },
    },
  });
};

/**
 * 🔍 Recherche un utilisateur par ID (avec rôle + permissions)
 * @param {string} id
 * @returns {Promise<User|null>}
 */
export const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      role: {
        include: { permissions: true },
      },
    },
  });
};

/**
 * 👥 Récupère tous les utilisateurs (avec rôle + permissions)
 */
export const getAllUsers = async () => {
  return prisma.user.findMany({
    include: {
      role: {
        include: { permissions: true },
      },
    },
  });
};

/**
 * ➕ Crée un nouvel utilisateur (attribution automatique du rôle `user`)
 * @param {Object} data - Données utilisateur (sans roleId)
 */
export const createUser = async ({
  email,
  password,
  firstName,
  lastName,
  address = null,
  address2 = null,
  zipCode = null,
  city = null,
  country = null,
}) => {
  const role = await prisma.role.findUnique({
    where: { name: 'user' },
  });

  if (!role) {
    throw new Error("Le rôle par défaut 'user' est introuvable.");
  }

  return prisma.user.create({
    data: {
      email,
      password,
      firstName,
      lastName,
      address,
      address2,
      zipCode,
      city,
      country,
      roleId: role.id,
    },
  });
};

/**
 * ✏️ Met à jour les infos de profil d’un utilisateur (hors mot de passe)
 * @param {string} id - ID de l’utilisateur
 * @param {Object} data - Données à mettre à jour
 */
export const updateUserProfile = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

/**
 * 🔒 Met à jour le mot de passe d’un utilisateur
 * @param {string} id - ID utilisateur
 * @param {string} hashedPassword - Nouveau mot de passe (hashé)
 */
export const updateUserPassword = async (id, hashedPassword) => {
  return prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });
};

/**
 * ❌ Supprime un utilisateur par ID
 * @param {string} id
 */
export const deleteUser = async (id) => {
  return prisma.user.delete({
    where: { id },
  });
};
