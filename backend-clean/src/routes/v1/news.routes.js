import express from 'express';
import {
  createNewsController,
  getAllNewsController,
  getNewsByIdController,
  updateNewsController,
  deleteNewsController,
} from '../../controllers/v1/news.controller.js';
import { requireSession } from '../../middlewares/session.middleware.js';
import { hasPermission } from '../../middlewares/hasPermission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: News
 *   description: Gestion des actualités publiées dans le hub
 */

// 🔐 Toutes les routes nécessitent une session active
router.use(requireSession);

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Liste toutes les actualités
 *     tags: [News]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des actualités
 *       403:
 *         description: Permission refusée
 */
router.get('/', hasPermission('view_news'), getAllNewsController);

/**
 * @swagger
 * /news/{id}:
 *   get:
 *     summary: Détail d’une actualité
 *     tags: [News]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l’actualité
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Actualité trouvée
 *       403:
 *         description: Permission refusée
 *       404:
 *         description: Actualité non trouvée
 */
router.get('/:id', hasPermission('view_news'), getNewsByIdController);

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Crée une nouvelle actualité
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
 *                 example: Nouvelle mise à jour disponible
 *               description:
 *                 type: string
 *                 example: Une nouvelle version du firmware est disponible...
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["mise à jour", "firmware"]
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-04"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["/uploads/news/image1.png"]
 *               coverImageId:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Actualité créée
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Permission refusée
 */
router.post('/', hasPermission('create_news'), createNewsController);

/**
 * @swagger
 * /news/{id}:
 *   patch:
 *     summary: Met à jour une actualité existante
 *     tags: [News]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l’actualité
 *         schema:
 *           type: string
 *     requestBody:
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
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               coverImageId:
 *                 type: string
 *                 nullable: true
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
 *     summary: Supprime une actualité
 *     tags: [News]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l’actualité
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
