import { showError } from '../../utils/showError.js'
import { logAudit } from '../../models/v1/log.model.js'

import {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
} from '../../models/v1/news.model.js'

/**
 * @route POST /news
 * @desc Crée une actualité
 * @access Permission: create_news
 */
export const createNewsController = async (req, res) => {
  try {
    const {
      title,
      description,
      tags = [],
      date,
      images = [],
      coverImageId = null,
    } = req.body

    if (!title || !description) {
      return res.status(400).json({ error: 'Titre et description requis.' })
    }

    const news = await createNews({
      title,
      description,
      tags,
      date: date ? new Date(date) : new Date(),
      images,
      coverImageId,
    })

    await logAudit(req.user.id, 'news_created', { newsId: news.id, title })

    res.status(201).json(news)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route GET /news
 * @desc Récupère toutes les actualités
 * @access Permission: view_news
 */
export const getAllNewsController = async (_req, res) => {
  try {
    const news = await getAllNews()
    res.json(news)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route GET /news/:id
 * @desc Récupère une actualité par ID
 * @access Permission: view_news
 */
export const getNewsByIdController = async (req, res) => {
  try {
    const news = await getNewsById(req.params.id)
    if (!news) {
      return res.status(404).json({ error: 'Actualité introuvable.' })
    }
    res.json(news)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route PATCH /news/:id
 * @desc Met à jour une actualité
 * @access Permission: edit_news
 */
export const updateNewsController = async (req, res) => {
  try {
    const {
      title,
      description,
      tags = [],
      date,
      images = [],
      coverImageId = null,
    } = req.body

    const updated = await updateNews(req.params.id, {
      title,
      description,
      tags,
      date: date ? new Date(date) : new Date(),
      images,
      coverImageId,
    })

    await logAudit(req.user.id, 'news_updated', { newsId: req.params.id })

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route DELETE /news/:id
 * @desc Supprime une actualité
 * @access Permission: delete_news
 */
export const deleteNewsController = async (req, res) => {
  try {
    await deleteNews(req.params.id)
    await logAudit(req.user.id, 'news_deleted', { newsId: req.params.id })
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}
