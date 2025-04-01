import jwt from 'jsonwebtoken';
import prisma from '../utils/db.js';

/**
 * @function requireAuth
 * @description Middleware de vérification d'authentification via JWT (Authorization: Bearer ...)
 * 
 * ✅ Vérifie le token JWT
 * ✅ Charge l'utilisateur depuis la BDD
 * ✅ Attache `req.user` à la requête
 * 
 * ⚠️ En cas de token manquant ou invalide → 401 Unauthorized
 * 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Accès non autorisé.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
      return res.status(401).json({ error: 'Utilisateur introuvable.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Jeton invalide ou expiré.' });
  }
};
