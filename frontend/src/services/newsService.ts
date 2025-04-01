import type { NewsItem } from "../types/news";
import { newsAtom } from "../store/newsAtom";
import { getDefaultStore } from "jotai";

const BASE_URL = import.meta.env.VITE_API_URL
const store = getDefaultStore();

const handleError = async (res: Response, fallbackMsg: string) => {
	let message = fallbackMsg;
	try {
		const err = await res.json();
		message = err?.error || err?.message || fallbackMsg;
	} catch {}
	throw new Error(message);
};

// 🔍 GET /news — récupère toutes les actualités
export async function fetchNews(): Promise<NewsItem[]> {
	const res = await fetch(`${BASE_URL}/news`, { credentials: "include" });
	if (!res.ok) await handleError(res, "Erreur lors du chargement des actualités");
	const data = await res.json();
	store.set(newsAtom, data);
	return data;
}

// 🔍 GET /news/:id
export async function fetchNewsById(id: string): Promise<NewsItem> {
	const res = await fetch(`${BASE_URL}/news/${id}`, { credentials: "include" });
	if (!res.ok) await handleError(res, "Actualité introuvable");
	return res.json();
}

// ➕ POST /news
export async function createNews(data: Omit<NewsItem, "id" | "createdAt" | "updatedAt">): Promise<NewsItem> {
	const res = await fetch(`${BASE_URL}/news`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(data),
	});
	if (!res.ok) await handleError(res, "Erreur lors de la création de l’actualité");
	const created = await res.json();
	store.set(newsAtom, [...store.get(newsAtom), created]);
	return created;
}

// ✏️ PATCH /news/:id
export async function updateNews(id: string, data: Partial<NewsItem>): Promise<NewsItem> {
	const res = await fetch(`${BASE_URL}/news/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(data),
	});
	if (!res.ok) await handleError(res, "Erreur lors de la mise à jour");
	const updated = await res.json();
	store.set(newsAtom, store.get(newsAtom).map((n) => (n.id === id ? updated : n)));
	return updated;
}

// ❌ DELETE /news/:id
export async function deleteNews(id: string): Promise<{ message: string }> {
	const res = await fetch(`${BASE_URL}/news/${id}`, {
		method: "DELETE",
		credentials: "include",
	});
	if (!res.ok) await handleError(res, "Erreur lors de la suppression");
	const result = await res.json();
	store.set(newsAtom, store.get(newsAtom).filter((n) => n.id !== id));
	return result;
}
