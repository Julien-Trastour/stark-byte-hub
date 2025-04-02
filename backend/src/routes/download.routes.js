import fs from 'node:fs';
import path from 'node:path';
import { showError } from '../utils/showError.js';
import { RobotModel } from '../models/robot.model.js';
import prisma from '../utils/db.js';
import { Parser } from 'json2csv';

const firmwareDir = path.resolve('uploads/firmwares');

/**
 * @route GET /download/firmwares
 * @access Permission: download_firmware
 * @description Liste les fichiers firmware disponibles dans le dossier
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 */
export const listFirmwares = async (_req, res) => {
  try {
    const files = fs
      .readdirSync(firmwareDir)
      .filter((f) => f !== '.gitkeep');

    const data = files.map((filename) => {
      const filePath = path.join(firmwareDir, filename);
      const stats = fs.statSync(filePath);

      return {
        name: filename,
        size: stats.size,
        url: `/uploads/firmwares/${filename}`,
        updatedAt: stats.mtime.toISOString(),
      };
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route GET /download/firmwares/:filename
 * @access Permission: download_firmware
 * @description Télécharge un fichier firmware spécifique
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const downloadFirmware = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(firmwareDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Fichier introuvable.' });
    }

    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route GET /download/robots.csv
 * @access Permission: export_robots
 * @description Génère un fichier CSV contenant la liste complète des robots
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 */
export const downloadRobotsCSV = async (_req, res) => {
  try {
    const robots = await prisma.robot.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const rows = robots.map((r) => ({
      numero_de_serie: r.serialNumber,
      modele: r.model,
      firmware: r.firmware || '',
      couleur: r.color,
      controle: r.controllable ? 'Oui' : 'Non',
      utilisateur: r.user ? `${r.user.firstName} ${r.user.lastName}` : '',
      email: r.user?.email || '',
      date_mise_en_service: r.commissionedAt?.toISOString() || '',
      date_creation: r.createdAt.toISOString(),
    }));

    const parser = new Parser({ delimiter: ';' });
    const csv = parser.parse(rows);

    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.attachment('robots.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};
