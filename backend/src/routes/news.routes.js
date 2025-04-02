import express from 'express';
import {
  createNewsController,
  getAllNewsController,
  getNewsByIdController,
  updateNewsController,
  deleteNewsController,
} from '../controllers/news.controller.js';
import { requireSession } from '../middlewares/session.middleware.js';
import { hasPermission } from '../middlewares/hasPermission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: News
 *   description: Gestion des actualités
 */

// 🔒 Toutes les routes nécessitent une session utilisateur
router.use(requireSession);

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Récupère toutes les actualités
 *     tags: [News]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des actualités
 */
router.get('/', getAllNewsController);

/**
 * @swagger
 * /news/{id}:
 *   get:
 *     summary: Récupère une actualité par son ID
 *     tags: [News]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de l’actualité
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Actualité trouvée
 *       404:
 *         description: Actualité non trouvée
 */
router.get('/:id', getNewsByIdController);

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Crée une nouvelle actualité (requiert "create_news")
 *     tags: [News]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Actualité créée
 *       403:
 *         description: Permission refusée
 */
router.post('/', hasPermission('create_news'), createNewsController);

/**
 * @swagger
 * /news/{id}:
 *   patch:
 *     summary: Met à jour une actualité par son ID (requiert "edit_news")
 *     tags: [News]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Actualité mise à jour
 *       404:
 *         description: Actualité non trouvée
 *       403:
 *         description: Permission refusée
 */
router.patch('/:id', hasPermission('edit_news'), updateNewsController);

/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     summary: Supprime une actualité par son ID (requiert "delete_news")
 *     tags: [News]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Actualité supprimée
 *       404:
 *         description: Actualité non trouvée
 *       403:
 *         description: Permission refusée
 */
router.delete('/:id', hasPermission('delete_news'), deleteNewsController);

export default router;
