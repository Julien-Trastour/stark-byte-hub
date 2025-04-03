import fs from 'node:fs';
import path from 'node:path';
import { showError } from '../utils/showError.js';
import { RobotModel } from '../models/robot.model.js';
import { Parser } from 'json2csv';

const firmwareDir = path.resolve('uploads/firmwares');

/**
 * @route GET /download/firmwares
 * @access Permission : download_firmware
 * @description Liste tous les fichiers firmware disponibles avec leurs métadonnées
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 */
export const listFirmwares = async (_req, res) => {
  try {
    const files = fs.readdirSync(firmwareDir).filter((f) => f !== '.gitkeep');

    const detailed = files.map((filename) => {
      const filePath = path.join(firmwareDir, filename);
      const stat = fs.statSync(filePath);

      return {
        filename,
        size: stat.size, // en octets
        uploadedAt: stat.birthtime, // date de création du fichier
        url: `/download/firmwares/${filename}`,
      };
    });

    res.json(detailed);
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route GET /download/firmwares/:filename
 * @access Permission : download_firmware
 * @description Télécharge un fichier firmware spécifique
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const downloadFirmware = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(firmwareDir, filename);

  try {
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
 * @access Permission : export_robots
 * @description Exporte la liste des robots au format CSV
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 */
export const downloadRobotsCSV = async (_req, res) => {
  try {
    const robots = await RobotModel.getAllForExport();

    const rows = robots.map((r) => ({
      nom: r.name || '',
      modele: r.model || '',
      numero_de_serie: r.serialNumber,
      firmware: r.firmware || '',
      couleur: r.color,
      controle: r.controllable ? 'Oui' : 'Non',
      utilisateur: r.user ? `${r.user.firstName} ${r.user.lastName}` : '',
      email_utilisateur: r.user?.email || '',
      date_mise_en_service: r.commissionedAt?.toISOString() || '',
      date_creation: r.createdAt.toISOString(),
    }));

    const parser = new Parser({ delimiter: ';' });
    const csv = parser.parse(rows);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=robots.csv');
    res.status(200).send(csv);
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};
