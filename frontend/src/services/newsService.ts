import type { NewsItem, NewsInput } from '../types/news'

const BASE_URL = import.meta.env.VITE_API_URL

/* ============================================================================
 * Services API - Actualités
============================================================================ */

/**
 * 🔍 Récupérer toutes les actualités
 */
export async function fetchNews(): Promise<NewsItem[]> {
	const res = await fetch(`${BASE_URL}/news`, {
		credentials: 'include',
	})
	const data = await res.json()

	if (!res.ok) {
		throw new Error(data?.error || "Échec du chargement des actualités")
	}

	return data
}

/**
 * 🔍 Récupérer une actualité par ID
 */
export async function getNewsById(id: string): Promise<NewsItem> {
	const res = await fetch(`${BASE_URL}/news/${id}`, {
		credentials: 'include',
	})
	const data = await res.json()

	if (!res.ok) {
		throw new Error(data?.error || "Actualité introuvable")
	}

	return data
}

/**
 * 🆕 Créer une nouvelle actualité
 */
export async function createNews(data: NewsInput): Promise<NewsItem> {
	const res = await fetch(`${BASE_URL}/news`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(data), // Inclut coverImageId si défini
	})
	const responseData = await res.json()

	if (!res.ok) {
		throw new Error(responseData?.error || "Échec de la création de l’actualité")
	}

	return responseData
}

/**
 * 📝 Mettre à jour une actualité
 */
export async function updateNews(id: string, data: NewsInput): Promise<NewsItem> {
	const res = await fetch(`${BASE_URL}/news/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(data), // Inclut coverImageId si défini
	})
	const responseData = await res.json()

	if (!res.ok) {
		throw new Error(responseData?.error || "Échec de la mise à jour de l’actualité")
	}

	return responseData
}

/**
 * ❌ Supprimer une actualité
 */
export async function deleteNews(id: string): Promise<void> {
	const res = await fetch(`${BASE_URL}/news/${id}`, {
		method: 'DELETE',
		credentials: 'include',
	})

	if (!res.ok) {
		const data = await res.json()
		throw new Error(data?.error || "Échec de la suppression de l’actualité")
	}
}

/**
 * 📤 Upload d’une image d’actualité (via /upload/news-image)
 */
export async function uploadNewsImage(file: File): Promise<{ filename: string }> {
	const formData = new FormData()
	formData.append('file', file)

	const res = await fetch(`${BASE_URL}/upload/news-image`, {
		method: 'POST',
		credentials: 'include',
		body: formData,
	})

	const data = await res.json()

	if (!res.ok) {
		throw new Error(data?.error || "Échec de l’upload de l’image")
	}

	return data // ex: { filename: "cover-123abc.jpg" }
}

/**
 * 📥 Récupérer les images d’actualités disponibles sur le serveur
 */
export async function fetchNewsImages(): Promise<string[]> {
	const res = await fetch(`${BASE_URL}/upload/news-images`, {
		credentials: 'include',
	})
	const data = await res.json()

	if (!res.ok) {
		throw new Error(data?.error || "Échec du chargement des images")
	}

	return data.images
}
