/**
 * @function isAdmin
 * @description Middleware qui vérifie si l'utilisateur a le rôle "admin"
 *
 * 🔒 Si ce n’est pas le cas → erreur 403 Forbidden
 * ✅ Sinon → `next()`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
export const isAdmin = (req, res, next) => {
  const role = req.user?.role?.name?.toLowerCase();

  if (!role || role !== 'admin') {
    return res.status(403).json({ error: 'Accès refusé : réservée aux administrateurs.' });
  }

  next();
};
