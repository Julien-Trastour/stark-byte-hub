/**
 * @function hasPermission
 * @description Middleware de vérification d'autorisation basée sur les permissions du rôle utilisateur.
 *
 * 🔐 Vérifie si `req.user.role.permissions` contient la permission requise
 * 🛡️ Le wildcard `*` accorde tous les droits (ex : superadmin)
 * ✅ Si la permission est présente → passe au middleware suivant
 * ❌ Sinon → 403 Forbidden
 *
 * @param {string} requiredPermission - Permission attendue (ex : "manage:users")
 * @returns {(req: import('express').Request, res: import('express').Response, next: Function) => void}
 */
export function hasPermission(requiredPermission) {
  return (req, res, next) => {
    const permissions = req.user?.role?.permissions;

    const hasAccess =
      Array.isArray(permissions) &&
      (permissions.includes('*') || permissions.includes(requiredPermission));

    if (!hasAccess) {
      return res.status(403).json({ error: 'Permission refusée' });
    }

    if (typeof next === 'function') next();
  };
}
