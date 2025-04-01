import { atom } from "jotai";
import { NewsItem } from "../types/news";
import * as newsService from "../services/newsService";

// 💾 Atom principal contenant la liste des actualités
export const newsAtom = atom<NewsItem[]>([]);

/* ============================================================================
 * ATOMS DÉRIVÉS — Actions centralisées
 * ============================================================================
 */

// 🔄 Recharger toutes les actualités
export const fetchNewsAtom = atom(null, async (_, set) => {
	const data = await newsService.fetchNews();
	set(newsAtom, data);
});

// ➕ Ajouter une actualité
export const addNewsAtom = atom(
	null,
	async (get, set, newItem: Omit<NewsItem, "id" | "updatedAt">) => {
		const created = await newsService.createNews(newItem);
		set(newsAtom, [...get(newsAtom), created]);
	}
);

// 📝 Modifier une actualité
export const updateNewsAtom = atom(
	null,
	async (get, set, { id, data }: { id: string; data: Partial<NewsItem> }) => {
		const updated = await newsService.updateNews(id, data);
		set(newsAtom, get(newsAtom).map((n) => (n.id === id ? updated : n)));
	}
);

// ❌ Supprimer une actualité
export const deleteNewsAtom = atom(
	null,
	async (get, set, id: string) => {
		await newsService.deleteNews(id);
		set(newsAtom, get(newsAtom).filter((n) => n.id !== id));
	}
);
