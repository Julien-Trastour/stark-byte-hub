import express from 'express';
import { requireSession } from '../../middlewares/session.middleware.js';
import { hasPermission } from '../../middlewares/hasPermission.middleware.js';
import {
  uploadRobotImage,
  uploadNewsImage,
  uploadFirmwareFile,
  getNewsImages,
} from '../../controllers/v1/upload.controller.js';
import {
  uploadRobotImage as multerRobotImage,
  uploadNewsImage as multerNewsImage,
  uploadFirmwareFile as multerFirmware,
} from '../../middlewares/upload.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: Upload de fichiers (images, firmwares…)
 */

router.use(requireSession);

/**
 * @swagger
 * /upload/robot-image:
 *   post:
 *     summary: Upload d’image pour un robot
 *     tags: [Uploads]
 *     security:
 *       - cookieAuth: []
 */
router.post(
  '/robot-image',
  hasPermission('upload_robot_image'),
  multerRobotImage.single('file'),
  uploadRobotImage
);

/**
 * @swagger
 * /upload/news-image:
 *   post:
 *     summary: Upload d’image pour une actualité (éditeur Markdown)
 *     tags: [Uploads]
 *     security:
 *       - cookieAuth: []
 */
router.post(
  '/news-image',
  hasPermission('upload_news_image'),
  multerNewsImage.single('file'),
  uploadNewsImage
);

/**
 * @swagger
 * /upload/news-images:
 *   get:
 *     summary: Liste les images uploadées pour les actualités
 *     tags: [Uploads]
 *     security:
 *       - cookieAuth: []
 */
router.get('/news-images', hasPermission('upload_news_image'), getNewsImages);

/**
 * @swagger
 * /upload/firmware:
 *   post:
 *     summary: Upload d’un fichier firmware (.bin, .hex, .zip)
 *     tags: [Uploads]
 *     security:
 *       - cookieAuth: []
 */
router.post(
  '/firmware',
  hasPermission('upload_firmware'),
  multerFirmware.single('file'),
  uploadFirmwareFile
);

export default router;
