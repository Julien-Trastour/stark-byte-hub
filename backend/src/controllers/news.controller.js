import * as NewsModel from '../models/news.model.js';
import { showError } from '../utils/showError.js';

/**
 * @route POST /news
 * @access Admin uniquement
 * @description Crée une actualité avec titre, contenu HTML, tags, date
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createNewsController = async (req, res) => {
  try {
    const { title, description, tags = [], date } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Titre et description requis.' });
    }

    const news = await NewsModel.createNews({
      title,
      description,
      tags,
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route GET /news
 * @access Utilisateur connecté
 * @description Liste toutes les actualités
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getAllNewsController = async (req, res) => {
  try {
    const news = await NewsModel.getAllNews();
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route GET /news/:id
 * @access Utilisateur connecté
 * @description Récupère une actualité par ID
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getNewsByIdController = async (req, res) => {
  try {
    const news = await NewsModel.getNewsById(req.params.id);
    if (!news) {
      return res.status(404).json({ error: 'Actualité introuvable.' });
    }
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route PATCH /news/:id
 * @access Admin uniquement
 * @description Met à jour une actualité
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const updateNewsController = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.date) {
      data.date = new Date(data.date);
    }

    const updated = await NewsModel.updateNews(req.params.id, data);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route DELETE /news/:id
 * @access Admin uniquement
 * @description Supprime une actualité
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const deleteNewsController = async (req, res) => {
  try {
    await NewsModel.deleteNews(req.params.id);
    res.json({ message: 'Actualité supprimée avec succès.' });
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};
