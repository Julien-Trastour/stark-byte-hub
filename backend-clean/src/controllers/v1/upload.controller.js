import { showError } from '../../utils/showError.js'
import { logAudit } from '../../models/v1/log.model.js'
import fs from 'node:fs'
import path from 'node:path'

/**
 * @route POST /upload/robot-image
 * @desc Upload d’une image pour un robot
 * @access Permission: upload_robot_image
 */
export const uploadRobotImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Fichier manquant.' })
    }

    const fileUrl = `/uploads/robots/${req.file.filename}`

    await logAudit(req.user.id, 'upload_robot_image', {
      filename: req.file.filename,
      url: fileUrl,
    })

    res.status(201).json({
      message: 'Image robot uploadée avec succès.',
      filename: req.file.filename,
      url: fileUrl,
    })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route POST /upload/news-image
 * @desc Upload d’une image pour une actualité
 * @access Permission: upload_news_image
 */
export const uploadNewsImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Fichier manquant.' })
    }

    const fileUrl = `/uploads/news/${req.file.filename}`

    await logAudit(req.user.id, 'upload_news_image', {
      filename: req.file.filename,
      url: fileUrl,
    })

    res.status(201).json({
      success: 1,
      file: {
        url: fileUrl,
      },
    })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route GET /upload/news-images
 * @desc Liste toutes les images uploadées pour les actualités
 * @access Permission: upload_news_image
 */
export const getNewsImages = async (_req, res) => {
  try {
    const dirPath = path.join(process.cwd(), 'public/uploads/news')
    const files = fs.readdirSync(dirPath)

    const urls = files.map((filename) => ({
      url: `/uploads/news/${filename}`,
      filename,
    }))

    res.json(urls)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route POST /upload/firmware
 * @desc Upload d’un firmware (.bin, .hex, .zip)
 * @access Permission: upload_firmware
 */
export const uploadFirmwareFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Fichier manquant.' })
    }

    const fileUrl = `/uploads/firmwares/${req.file.filename}`

    await logAudit(req.user.id, 'upload_firmware', {
      filename: req.file.filename,
      url: fileUrl,
    })

    res.status(201).json({
      message: 'Firmware uploadé avec succès.',
      filename: req.file.filename,
      url: fileUrl,
    })
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}
