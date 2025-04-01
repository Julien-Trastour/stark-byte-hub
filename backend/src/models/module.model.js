import prisma from '../utils/db.js';

/**
 * 🔍 Récupère tous les modules disponibles
 * @returns {Promise<Module[]>}
 */
export const getAllModules = () => {
  return prisma.module.findMany();
};

/**
 * 🔍 Récupère les modules activés pour un utilisateur donné
 * @param {string} userId
 * @returns {Promise<Module[]>}
 */
export const getEnabledModulesForUser = (userId) => {
  return prisma.userModule.findMany({
    where: { userId, enabled: true },
    include: { module: true },
  });
};

/**
 * ✅ Active un module pour un utilisateur
 * @param {string} userId
 * @param {string} moduleId
 * @returns {Promise<UserModule>}
 */
export const enableModule = (userId, moduleId) => {
  return prisma.userModule.upsert({
    where: { userId_moduleId: { userId, moduleId } },
    update: { enabled: true },
    create: { userId, moduleId, enabled: true },
  });
};

/**
 * ❌ Désactive un module pour un utilisateur
 * @param {string} userId
 * @param {string} moduleId
 * @returns {Promise<UserModule>}
 */
export const disableModule = (userId, moduleId) => {
  return prisma.userModule.upsert({
    where: { userId_moduleId: { userId, moduleId } },
    update: { enabled: false },
    create: { userId, moduleId, enabled: false },
  });
};

/**
 * 🔐 Vérifie si un module est activé pour un utilisateur
 * @param {string} userId
 * @param {string} moduleId
 * @returns {Promise<boolean>}
 */
export const isModuleEnabled = async (userId, moduleId) => {
  const record = await prisma.userModule.findUnique({
    where: { userId_moduleId: { userId, moduleId } },
  });
  return !!record?.enabled;
};

/**
 * (Optionnel) 🔍 Récupère tous les modules activés, tous utilisateurs confondus
 * @returns {Promise<UserModule[]>}
 */
export const getAllEnabledModules = () => {
  return prisma.userModule.findMany({
    where: { enabled: true },
    include: { user: true, module: true },
  });
};
