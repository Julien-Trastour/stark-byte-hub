import fs from 'node:fs'
import path from 'node:path'
import { Parser } from 'json2csv'

import { showError } from '../../utils/showError.js'
import { logAudit } from '../../models/v1/log.model.js'
import { RobotModel } from '../../models/v1/robot.model.js'

const firmwareDir = path.resolve('uploads/firmwares')

/**
 * @route GET /download/firmwares
 * @desc Liste les firmwares disponibles avec métadonnées
 * @access Permission: download_firmware
 */
export const listFirmwares = async (_req, res) => {
  try {
    const files = fs.readdirSync(firmwareDir).filter((f) => f !== '.gitkeep')

    const detailed = files.map((filename) => {
      const filePath = path.join(firmwareDir, filename)
      const stat = fs.statSync(filePath)

      return {
        filename,
        size: stat.size,
        uploadedAt: stat.birthtime,
        url: `/download/firmwares/${filename}`,
      }
    })

    res.json(detailed)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route GET /download/firmwares/:filename
 * @desc Télécharge un fichier firmware spécifique
 * @access Permission: download_firmware
 */
export const downloadFirmware = async (req, res) => {
  const { filename } = req.params
  const filePath = path.join(firmwareDir, filename)

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Fichier introuvable.' })
    }

    await logAudit(req.user.id, 'download_firmware', { filename })

    res.download(filePath)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}

/**
 * @route GET /download/robots.csv
 * @desc Exporte la liste des robots au format CSV
 * @access Permission: export_robots
 */
export const downloadRobotsCSV = async (req, res) => {
  try {
    const robots = await RobotModel.getAllForExport()

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
    }))

    const parser = new Parser({ delimiter: ';' })
    const csv = parser.parse(rows)

    await logAudit(req.user.id, 'export_robots_csv', { count: rows.length })

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename=robots.csv')
    res.status(200).send(csv)
  } catch (err) {
    res.status(500).json({ error: showError(err) })
  }
}
