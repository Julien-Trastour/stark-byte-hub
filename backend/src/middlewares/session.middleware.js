import jwt from 'jsonwebtoken';
import { findUserById } from '../models/user.model.js';

/**
 * @function requireSession
 * @description Middleware de vérification de session via cookie JWT (`token`)
 *
 * 🔐 Vérifie la présence d’un token JWT dans les cookies (`req.cookies.token`)
 * 🔍 Décode le token et charge l’utilisateur correspondant
 * ✅ Attache `req.user` si session valide
 * ❌ Sinon, retourne 401 Unauthorized
 *
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse Express
 * @param {Function} next - Callback pour passer au middleware suivant
 * @returns {void}
 */
export const requireSession = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Authentification requise. Aucun token fourni.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur introuvable. Session invalide.' });
    }

    req.user = user;
    if (typeof next === 'function') next();
  } catch (err) {
    return res.status(401).json({ error: 'Token expiré ou invalide.' });
  }
};
