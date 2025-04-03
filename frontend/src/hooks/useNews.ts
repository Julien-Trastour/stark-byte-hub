import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchNews,
  createNews,
  updateNews,
  deleteNews,
} from "../services/newsService"
import type { NewsItem, NewsInput } from "../types/news"

/* ============================================================================
 * 📦 TanStack Query - Actualités
============================================================================ */

/**
 * 📥 Lecture des actualités depuis le cache TanStack
 */
export function useNewsQuery() {
  const query = useQuery<NewsItem[], Error>({
    queryKey: ["news"],
    queryFn: fetchNews,
  })

  return {
    ...query,
    news: query.data || [],
  }
}

/**
 * ➕ Création d’une actualité
 */
export function useCreateNews() {
  const queryClient = useQueryClient()

  return useMutation<NewsItem, Error, NewsInput>({
    mutationFn: createNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] })
    },
  })
}

/**
 * ✏️ Mise à jour d’une actualité
 */
export function useUpdateNews() {
  const queryClient = useQueryClient()

  return useMutation<NewsItem, Error, { id: string; data: NewsInput }>({
    mutationFn: ({ id, data }) => updateNews(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] })
    },
  })
}

/**
 * ❌ Suppression d’une actualité
 */
export function useDeleteNews() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] })
    },
  })
}
