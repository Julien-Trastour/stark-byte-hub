import { showError } from '../utils/showError.js';

/**
 * @route POST /upload/robot-image
 * @access Permission : upload_robot_image
 * @description Upload de photo pour un robot
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const uploadRobotImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Fichier manquant.' });
    }

    const fileUrl = `/uploads/robots/${req.file.filename}`;

    res.status(201).json({
      message: 'Image uploadée avec succès.',
      filename: req.file.filename,
      url: fileUrl,
    });
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route POST /upload/news-image
 * @access Permission : upload_news_image
 * @description Upload d’image insérée dans une actualité (éditeur Markdown)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const uploadNewsImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Fichier manquant.' });
    }

    const fileUrl = `/uploads/news/${req.file.filename}`;

    // Compatible avec les éditeurs type Editor.js ou CKEditor
    res.status(201).json({
      success: 1,
      file: {
        url: fileUrl,
      },
    });
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};

/**
 * @route POST /upload/firmware
 * @access Permission : upload_firmware
 * @description Upload d’un fichier firmware (.bin, .hex, .zip)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const uploadFirmwareFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Fichier manquant.' });
    }

    const fileUrl = `/uploads/firmwares/${req.file.filename}`;

    res.status(201).json({
      message: 'Firmware uploadé avec succès.',
      filename: req.file.filename,
      url: fileUrl,
    });
  } catch (err) {
    res.status(500).json({ error: showError(err) });
  }
};
