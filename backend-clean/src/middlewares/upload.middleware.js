import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

/**
 * === 📁 Dossiers d'upload ===
 * - uploads/robots
 * - uploads/news
 * - uploads/firmwares
 */
const robotDir = 'uploads/robots';
const newsDir = 'uploads/news';
const firmwareDir = 'uploads/firmwares';

// ✅ Création des dossiers si absents
for (const dir of [robotDir, newsDir, firmwareDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * 🛠️ Crée un moteur de stockage pour multer
 * @param {string} baseDir - Dossier cible
 * @param {string} prefix - Préfixe du nom de fichier
 */
const getStorage = (baseDir, prefix) =>
  multer.diskStorage({
    destination: (_, __, cb) => cb(null, baseDir),
    filename: (_, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${prefix}_${Date.now()}${ext}`;
      cb(null, filename);
    },
  });

const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const firmwareExts = ['.bin', '.hex', '.zip'];

/**
 * 📤 Upload d’image robot (jpg/png/webp, max 5 Mo)
 */
export const uploadRobotImage = multer({
  storage: getStorage(robotDir, 'robot'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (!imageTypes.includes(file.mimetype)) {
      return cb(new Error('Format d’image non supporté.'));
    }
    cb(null, true);
  },
});

/**
 * 📰 Upload d’image actu (jpg/png/webp, max 5 Mo)
 */
export const uploadNewsImage = multer({
  storage: getStorage(newsDir, 'actualite'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (!imageTypes.includes(file.mimetype)) {
      return cb(new Error('Format d’image non supporté.'));
    }
    cb(null, true);
  },
});

/**
 * 🧠 Upload firmware (.bin/.hex/.zip, max 50 Mo)
 */
export const uploadFirmwareFile = multer({
  storage: getStorage(firmwareDir, 'firmware'),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!firmwareExts.includes(ext)) {
      return cb(new Error('Format de firmware non supporté.'));
    }
    cb(null, true);
  },
});
