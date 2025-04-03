import type { User } from "../types/user"

const BASE_URL = import.meta.env.VITE_API_URL

async function api<T = unknown>(
	endpoint: string,
	options?: RequestInit,
	parseJson = true
): Promise<T> {
	const res = await fetch(`${BASE_URL}${endpoint}`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...(options?.headers || {}),
		},
		...options,
	})

	const data = parseJson ? await res.json() : null

	if (!res.ok) {
		throw new Error(data?.error || "Erreur inconnue")
	}

	return data
}

/* ============================================================================
 * AUTHENTIFICATION
 * ============================================================================
 */

export async function loginUser(email: string, password: string): Promise<User> {
	const data = await api<{ user: User }>("/auth/login", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	})
	return data.user
}

export async function registerUser(input: {
	firstName: string
	lastName: string
	email: string
	password: string
	address?: string
	address2?: string
	zipCode?: string
	city?: string
	country?: string
}): Promise<User> {
	const data = await api<{ user: User }>("/auth/register", {
		method: "POST",
		body: JSON.stringify(input),
	})
	return data.user
}

export async function logout(): Promise<void> {
	await api("/auth/logout", { method: "POST" }, false)
}

export async function fetchMe(): Promise<User> {
	const data = await api<{ user: User }>("/auth/me")
	return data.user
}

/* ============================================================================
 * RÉINITIALISATION DE MOT DE PASSE
 * ============================================================================
 */

export async function sendResetLink(email: string): Promise<string> {
	const data = await api<{ message: string }>("/auth/forgot-password", {
		method: "POST",
		body: JSON.stringify({ email }),
	})
	return data.message
}

export async function resetPassword(token: string, newPassword: string): Promise<string> {
	const data = await api<{ message: string }>("/auth/reset-password", {
		method: "POST",
		body: JSON.stringify({ token, newPassword }),
	})
	return data.message
}
