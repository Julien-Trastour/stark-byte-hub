import prisma from '../utils/db.js';
import { RoleName } from '@prisma/client';

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
        connect: { name: RoleName.user }, // rôle par défaut via enum
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
