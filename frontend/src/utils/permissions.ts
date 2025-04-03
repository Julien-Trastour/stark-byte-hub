import type { User } from "../types/user";

/**
 * Vérifie si l'utilisateur a une permission spécifique
 * @param user L'utilisateur dont on vérifie les permissions
 * @param permission La permission à vérifier
 * @returns {boolean} true si l'utilisateur a la permission, sinon false
 */
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user || !user.role || !Array.isArray(user.role.permissions)) return false;

  // Si l'utilisateur a toutes les permissions (permission globale)
  if (user.role.permissions.includes("*")) return true;

  // Vérifie si l'utilisateur a la permission spécifique
  return user.role.permissions.includes(permission);
}

/**
 * Vérifie si l'utilisateur a au moins une des permissions spécifiées
 * @param user L'utilisateur dont on vérifie les permissions
 * @param permissions Un tableau de permissions à vérifier
 * @returns {boolean} true si l'utilisateur a au moins une des permissions, sinon false
 */
export function hasAnyPermission(user: User | null, permissions: string[]): boolean {
  if (!user || !user.role || !Array.isArray(user.role.permissions)) return false;

  // Si l'utilisateur a toutes les permissions (permission globale)
  if (user.role.permissions.includes("*")) return true;

  // Vérifie si l'utilisateur a au moins une des permissions demandées
  return permissions.some(permission => user.role.permissions.includes(permission));
}
