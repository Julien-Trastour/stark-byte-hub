import type { User, UserInput, UpdateUserInput } from "../types/user"

const BASE_URL = import.meta.env.VITE_API_URL

/* ============================================================================
 * Services API - Utilisateurs (admin uniquement)
============================================================================ */

/**
 * 🔍 Récupérer tous les utilisateurs
 */
export async function fetchUsers(): Promise<User[]> {
	const res = await fetch(`${BASE_URL}/users`, {
		credentials: "include",
	})
	const data = await res.json()

	if (!res.ok) {
		throw new Error(data?.error || "Échec du chargement des utilisateurs")
	}

	return data
}

/**
 * 🔍 Récupérer un utilisateur par ID
 */
export async function getUserById(id: string): Promise<User> {
	const res = await fetch(`${BASE_URL}/users/${id}`, {
		credentials: "include",
	})
	const data = await res.json()

	if (!res.ok) {
		throw new Error(data?.error || "Utilisateur introuvable")
	}

	return data
}

/**
 * 🆕 Créer un nouvel utilisateur
 */
export async function createUser(data: UserInput): Promise<User> {
	const res = await fetch(`${BASE_URL}/users`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(data),
	})
	const responseData = await res.json()

	if (!res.ok) {
		throw new Error(responseData?.error || "Échec de la création de l'utilisateur")
	}

	return responseData
}

/**
 * 📝 Mettre à jour un utilisateur
 */
export async function updateUser(id: string, data: UpdateUserInput): Promise<User> {
	const res = await fetch(`${BASE_URL}/users/${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(data),
	})
	const responseData = await res.json()

	if (!res.ok) {
		throw new Error(responseData?.error || "Échec de la mise à jour de l'utilisateur")
	}

	return responseData
}

/**
 * ❌ Supprimer un utilisateur
 */
export async function deleteUserById(id: string): Promise<void> {
	const res = await fetch(`${BASE_URL}/users/${id}`, {
		method: "DELETE",
		credentials: "include",
	})
	if (!res.ok) {
		const data = await res.json()
		throw new Error(data?.error || "Échec de la suppression de l'utilisateur")
	}
}
