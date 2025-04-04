/**
 * @function hasPermission
 * @description Middleware de vérification d'autorisation basée sur les permissions du rôle utilisateur.
 *
 * 🔐 Vérifie si `req.user.role.permissions` contient la permission requise
 * 🛡️ Le wildcard `*` accorde tous les droits (ex : superadmin)
 * ✅ Si la permission est présente → passe au middleware suivant
 * ❌ Sinon → 403 Forbidden avec message clair
 *
 * @param {string} requiredPermission - Permission attendue (ex : "manage:users")
 * @returns {(req: import('express').Request, res: import('express').Response, next: Function) => void}
 */
export function hasPermission(requiredPermission) {
    return (req, res, next) => {
      const user = req.user;
  
      // 🧱 Vérification basique
      if (!user || !user.role || !Array.isArray(user.role.permissions)) {
        return res.status(403).json({
          error: 'Accès refusé : rôle ou permissions non définis.',
        });
      }
  
      const { permissions } = user.role;
  
      // 🟢 Autorisation si wildcard * ou permission présente
      const granted =
        permissions.includes('*') || permissions.includes(requiredPermission);
  
      if (!granted) {
        return res.status(403).json({
          error: `Permission requise : ${requiredPermission}`,
        });
      }
  
      // ✅ Autorisé
      next();
    };
  }
  