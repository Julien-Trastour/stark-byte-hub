import jwt from 'jsonwebtoken';
import prisma from '../utils/db.js';

/**
 * @function requireSession
 * @description Middleware de vérification de session via cookie JWT (`token`)
 *
 * 🔐 Vérifie la présence d’un token JWT dans les cookies (`req.cookies.token`)
 * 🔍 Décode le token et charge l’utilisateur avec rôle + permissions
 * ✅ Attache `req.user` si session valide, avec `permissions: string[]`
 * ❌ Sinon, retourne 401 Unauthorized
 */
export const requireSession = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .json({ error: 'Authentification requise. Aucun token fourni.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ error: 'Utilisateur introuvable. Session invalide.' });
    }

    // 🔁 Transforme les permissions en tableau simple de strings
    req.user = {
      ...user,
      role: {
        ...user.role,
        permissions: user.role.permissions.map((p) => p.name),
      },
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token expiré ou invalide.' });
  }
};
