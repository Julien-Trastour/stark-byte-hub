import jwt from 'jsonwebtoken';
import prisma from '../utils/db.js';

/**
 * @function requireAuth
 * @description Middleware d’authentification via JWT (Authorization: Bearer ...)
 *
 * 🔐 Vérifie le header Authorization
 * 🔍 Décode le token JWT et récupère l’utilisateur
 * 🔒 Vérifie que le token n’a pas été révoqué
 * ✅ Attache `req.user` à la requête si valide
 * ❌ Sinon → 401 Unauthorized
 */
export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Authentification requise (Bearer token manquant).',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const isRevoked = await prisma.revokedToken.findUnique({
      where: { token },
    });

    if (isRevoked) {
      return res
        .status(401)
        .json({ error: 'Token révoqué. Veuillez vous reconnecter.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ error: 'Utilisateur introuvable. Token invalide.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide ou expiré.' });
  }
};
