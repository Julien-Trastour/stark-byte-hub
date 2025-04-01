import prisma from '../utils/db.js';

/**
 * ➕ Crée une nouvelle actualité
 * @param {object} data - Données de l'actualité à créer :
 * {
 *   title: string,
 *   description: string (contenu Markdown ou HTML),
 *   tags?: string[],
 *   date?: Date
 * }
 * @returns {Promise<News>}
 */
export const createNews = async (data) => {
  return prisma.news.create({ data });
};

/**
 * 🔍 Récupère toutes les actualités
 * (triées par date décroissante)
 * @returns {Promise<News[]>}
 */
export const getAllNews = async () => {
  return prisma.news.findMany({
    orderBy: { date: 'desc' },
  });
};

/**
 * 🔍 Récupère une actualité par son ID
 * @param {string} id
 * @returns {Promise<News|null>}
 */
export const getNewsById = async (id) => {
  return prisma.news.findUnique({ where: { id } });
};

/**
 * 📝 Met à jour une actualité existante
 * @param {string} id
 * @param {object} data
 * @returns {Promise<News>}
 */
export const updateNews = async (id, data) => {
  return prisma.news.update({ where: { id }, data });
};

/**
 * ❌ Supprime une actualité
 * @param {string} id
 * @returns {Promise<void>}
 */
export const deleteNews = async (id) => {
  await prisma.news.delete({ where: { id } });
};

/**
 * 🔍 (optionnel) Récupère les actualités par tag
 * @param {string} tag
 * @returns {Promise<News[]>}
 */
export const getNewsByTag = async (tag) => {
  return prisma.news.findMany({
    where: {
      tags: {
        has: tag,
      },
    },
    orderBy: { date: 'desc' },
  });
};
