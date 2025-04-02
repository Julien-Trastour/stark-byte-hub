import type { User } from "../types/user";

const BASE_URL = import.meta.env.VITE_API_URL;

/* ============================================================================
// Services qui gèrent les appels API utilisateurs
============================================================================ */

/**
 * 🔍 Récupérer tous les utilisateurs (admin uniquement)
 */
export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/users`, {
    credentials: "include",
  });
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Échec du chargement des utilisateurs");
  }
  return res.json();
}

/**
 * 🔍 Récupérer un utilisateur par ID (admin uniquement)
 */
export async function getUserById(id: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    credentials: "include",
  });
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Utilisateur introuvable");
  }
  return res.json();
}

/**
 * 📝 Modifier un utilisateur (admin uniquement)
 */
export async function updateUser(
  id: string,
  data: Partial<User>
): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Échec de la mise à jour de l'utilisateur");
  }
  return res.json();
}

/**
 * ❌ Supprimer un utilisateur (admin uniquement)
 */
export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Échec de la suppression de l'utilisateur");
  }
}
