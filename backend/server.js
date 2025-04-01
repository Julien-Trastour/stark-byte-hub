import 'dotenv/config';
// Chargement des variables d'environnement

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


// === Imports routes souche ===
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import robotRoutes from './src/routes/robot.routes.js';
import newsRoutes from './src/routes/news.routes.js';

// === Imports routes modules ===
// import visionRoutes from './src/modules/vision/vision.routes.js';
// Création de l'app
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globaux
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Routes API souche
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/robots', robotRoutes);
app.use('/news', newsRoutes);

// Routes API modules
// app.use('/vision', visionRoutes);

// Lancement serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
