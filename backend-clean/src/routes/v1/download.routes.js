import { Router } from 'express';
import {
  listFirmwares,
  downloadFirmware,
  downloadRobotsCSV,
} from '../../controllers/v1/download.controller.js';
import { requireSession } from '../../middlewares/session.middleware.js';
import { hasPermission } from '../../middlewares/hasPermission.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Download
 *   description: Téléchargement de fichiers
 */

router.use(requireSession);

/**
 * @swagger
 * /download/firmwares:
 *   get:
 *     summary: Liste les firmwares disponibles
 *     tags: [Download]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des fichiers firmware
 */
router.get('/firmwares', hasPermission('download_firmware'), listFirmwares);

/**
 * @swagger
 * /download/firmwares/{filename}:
 *   get:
 *     summary: Télécharge un fichier firmware
 *     tags: [Download]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: filename
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Nom du fichier firmware
 *     responses:
 *       200:
 *         description: Fichier téléchargé
 *       404:
 *         description: Fichier introuvable
 */
router.get('/firmwares/:filename', hasPermission('download_firmware'), downloadFirmware);

/**
 * @swagger
 * /download/robots.csv:
 *   get:
 *     summary: Export CSV des robots
 *     tags: [Download]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Fichier CSV généré
 *       403:
 *         description: Permission refusée
 */
router.get('/robots.csv', hasPermission('export_robots'), downloadRobotsCSV);

export default router;
