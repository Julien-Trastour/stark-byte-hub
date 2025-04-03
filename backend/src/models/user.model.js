import prisma from '../utils/db.js';
import pkg from '@prisma/client';

const { Role } = pkg;  // Assurer que c'est bien le modèle Role de Prisma

/**
 * 🔍 Recherche un utilisateur par email
 * @param {string} email
 * @returns {Promise<User|null>}
 */
export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
};

/**
 * 🔍 Recherche un utilisateur par ID
 * @param {string} id
 * @returns {Promise<User|null>}
 */
export const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    include: { role: true },
  });
};

/**
 * ➕ Crée un nouvel utilisateur
 * @param {Object} data - Données du nouvel utilisateur
 * @returns {Promise<User>}
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
  // S'assurer de l'attribution correcte du rôle
  const role = await prisma.role.findUnique({
    where: { name: 'user' }, // On suppose que le rôle est nommé 'user'
  });

  if (!role) {
    throw new Error('Le rôle spécifié n\'existe pas');
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
      role: {
        connect: { id: role.id },
      },
    },
  });
};

/**
 * 📝 Met à jour le profil d’un utilisateur
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<User>}
 */
export const updateUserProfile = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

/**
 * 🔒 Met à jour le mot de passe d’un utilisateur
 * @param {string} id
 * @param {string} hashedPassword
 * @returns {Promise<User>}
 */
export const updateUserPassword = async (id, hashedPassword) => {
  return prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });
};
