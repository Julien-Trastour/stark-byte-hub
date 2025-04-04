import prisma from '../../utils/db.js'

/**
 * ➕ Crée une actualité avec images (optionnelles) et image de couverture
 * @param {{
 *   title: string,
 *   description: string,
 *   tags?: string[],
 *   date?: Date,
 *   images?: string[],
 *   coverImageId?: string
 * }} data
 * @returns {Promise<import('@prisma/client').News>}
 */
export const createNews = async (data) => {
  const { images = [], coverImageId = null, ...newsData } = data

  return prisma.news.create({
    data: {
      ...newsData,
      coverImageId,
      images: {
        create: images.map((url) => ({ url })),
      },
    },
    include: {
      images: true,
      coverImage: true,
    },
  })
}

/**
 * 🔍 Récupère toutes les actualités triées par date
 * @returns {Promise<import('@prisma/client').News[]>}
 */
export const getAllNews = async () => {
  return prisma.news.findMany({
    orderBy: { date: 'desc' },
    include: {
      images: true,
      coverImage: true,
    },
  })
}

/**
 * 🔍 Récupère une actualité par son ID
 * @param {string} id
 * @returns {Promise<import('@prisma/client').News|null>}
 */
export const getNewsById = async (id) => {
  return prisma.news.findUnique({
    where: { id },
    include: {
      images: true,
      coverImage: true,
    },
  })
}

/**
 * 📝 Met à jour une actualité (remplace ses images)
 * @param {string} id
 * @param {{
 *   title?: string,
 *   description?: string,
 *   tags?: string[],
 *   date?: Date,
 *   images?: string[],
 *   coverImageId?: string
 * }} data
 * @returns {Promise<import('@prisma/client').News>}
 */
export const updateNews = async (id, data) => {
  const { images = [], coverImageId = null, ...updateData } = data

  const [, updatedNews] = await prisma.$transaction([
    prisma.image.deleteMany({ where: { newsId: id } }),
    prisma.news.update({
      where: { id },
      data: {
        ...updateData,
        coverImageId,
        images: {
          create: images.map((url) => ({ url })),
        },
      },
      include: {
        images: true,
        coverImage: true,
      },
    }),
  ])

  return updatedNews
}

/**
 * ❌ Supprime une actualité par ID
 * @param {string} id
 * @returns {Promise<void>}
 */
export const deleteNews = async (id) => {
  await prisma.news.delete({ where: { id } })
}

/**
 * 🔍 Récupère les actualités contenant un tag donné
 * @param {string} tag
 * @returns {Promise<import('@prisma/client').News[]>}
 */
export const getNewsByTag = async (tag) => {
  return prisma.news.findMany({
    where: {
      tags: { has: tag },
    },
    orderBy: { date: 'desc' },
    include: {
      images: true,
      coverImage: true,
    },
  })
}
