import express from 'express';
import { requireSession } from '../middlewares/session.middleware.js';
import { hasPermission } from '../middlewares/hasPermission.middleware.js';
import {
  uploadRobotImage as uploadRobotImageController,
  uploadNewsImage as uploadNewsImageController,
  uploadFirmwareFile as uploadFirmwareController,
} from '../controllers/upload.controller.js';

import {
  uploadRobotImage as multerRobotImage,
  uploadNewsImage as multerNewsImage,
  uploadFirmwareFile as multerFirmware,
} from '../middlewares/upload.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: Upload de fichiers (images, firmwares…)
 */

// 🔑 Authentification requise pour certains uploads, mais pas pour les fichiers statiques
router.use(requireSession);

/**
 * @swagger
 * /upload/robot-image:
 *   post:
 *     summary: Upload d’image pour un robot
 *     tags: [Uploads]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image robot uploadée avec succès
 *       403:
 *         description: Permission refusée
 */
router.post(
  '/robot-image',
  hasPermission('upload_robot_image'),
  multerRobotImage.single('file'),
  uploadRobotImageController
);

/**
 * @swagger
 * /upload/news-image:
 *   post:
 *     summary: Upload d’image pour une actualité (éditeur Markdown)
 *     tags: [Uploads]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image actualité uploadée avec succès
 *       403:
 *         description: Permission refusée
 */
router.post(
  '/news-image',
  hasPermission('upload_news_image'),
  multerNewsImage.single('file'),
  uploadNewsImageController
);

/**
 * @swagger
 * /upload/firmware:
 *   post:
 *     summary: Upload d’un fichier firmware (.bin, .hex, .zip)
 *     tags: [Uploads]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Firmware uploadé avec succès
 *       403:
 *         description: Permission refusée
 */
router.post(
  '/firmware',
  hasPermission('upload_firmware'),
  multerFirmware.single('file'),
  uploadFirmwareController
);

// 🔑 Serve static files from the 'uploads' folder (public access)
// Expose images in 'uploads/news' publicly
router.use('/uploads', express.static('uploads'));

export default router;
