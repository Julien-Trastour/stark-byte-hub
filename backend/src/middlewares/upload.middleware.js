import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

/**
 * === 📁 Dossiers d'upload ===
 * - `uploads/robots` : images des robots
 * - `uploads/news` : images intégrées dans les actualités (Markdown)
 * - `uploads/firmwares` : fichiers firmware pour les robots
 */
const robotDir = 'uploads/robots';
const newsDir = 'uploads/news';
const firmwareDir = 'uploads/firmwares';

// ✅ Création dynamique des dossiers si nécessaires
const uploadDirs = [robotDir, newsDir, firmwareDir];
for (const dir of uploadDirs) {
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * 📦 Crée une configuration de stockage Multer
 * @param {string} baseDir - Répertoire de destination
 * @param {string} prefix - Préfixe du nom de fichier
 * @returns {multer.StorageEngine}
 */
const getStorage = (baseDir, prefix) =>
  multer.diskStorage({
    destination: (_, __, cb) => cb(null, baseDir),
    filename: (_, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = `${prefix}_${Date.now()}${ext}`;
      cb(null, name);
    },
  });

/**
 * 📤 Upload image de robot
 * Formats acceptés : jpg, png, webp
 * Taille max : 5 Mo
 * @type {multer.Multer}
 */
export const uploadRobotImage = multer({
  storage: getStorage(robotDir, 'robot'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Format d’image non supporté.'));
    }
    cb(null, true);
  },
});

/**
 * 📰 Upload image pour les actualités (Markdown)
 * Formats acceptés : jpg, png, webp
 * Taille max : 5 Mo
 * @type {multer.Multer}
 */
export const uploadNewsImage = multer({
  storage: getStorage(newsDir, 'actualite'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Format d’image non supporté.'));
    }
    cb(null, true);
  },
});

/**
 * 🧠 Upload de fichier firmware (.bin, .hex, .zip)
 * Formats acceptés : bin, hex, zip
 * Taille max : 50 Mo
 * @type {multer.Multer}
 */
export const uploadFirmwareFile = multer({
  storage: getStorage(firmwareDir, 'firmware'),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = ['application/octet-stream', 'application/zip', 'application/x-hex'];
    const extAllowed = ['.bin', '.hex', '.zip'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!extAllowed.includes(ext)) {
      return cb(new Error('Format de firmware non supporté.'));
    }
    cb(null, true);
  },
});
