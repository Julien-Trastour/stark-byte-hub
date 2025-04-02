import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';

// === 📦 Routes principales ===
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import robotRoutes from './src/routes/robot.routes.js';
import newsRoutes from './src/routes/news.routes.js';
import logRoutes from './src/routes/log.routes.js';
import roleRoutes from './src/routes/role.routes.js';
import uploadRoutes from './src/routes/upload.routes.js';
import downloadRoutes from './src/routes/download.routes.js';

// === 🧩 Modules additionnels (ex. : vision) ===
// import visionRoutes from './src/modules/vision/vision.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// === 🌐 Middlewares globaux ===
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// === 📁 Fichiers statiques (uploads) ===
app.use('/uploads', express.static(path.resolve('uploads')));

// === 🚀 Routes API principales ===
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/robots', robotRoutes);
app.use('/news', newsRoutes);
app.use('/logs', logRoutes);
app.use('/roles', roleRoutes);
app.use('/upload', uploadRoutes);
app.use('/download', downloadRoutes);

// === 🔌 Modules supplémentaires ===
// app.use('/vision', visionRoutes);

// === 🟢 Lancement du serveur ===
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
