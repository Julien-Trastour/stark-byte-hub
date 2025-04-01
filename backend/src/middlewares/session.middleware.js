import jwt from 'jsonwebtoken';
import { findUserById } from '../models/user.model.js';

/**
 * @function requireSession
 * @description Middleware de vérification de session via cookie JWT (`token`)
 *
 * ✅ Vérifie le cookie JWT
 * ✅ Charge l'utilisateur depuis la BDD
 * ✅ Attache `req.user`
 *
 * ⚠️ Sinon → erreur 401 Unauthorized
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
export const requireSession = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Session requise (aucun token trouvé)' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Session invalide (utilisateur introuvable)' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expirée ou invalide' });
  }
};
