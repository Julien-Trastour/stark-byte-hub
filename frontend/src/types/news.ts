export type NewsItem = {
  id: string
  title: string
  description: string
  date: string
  tags: string[]
  image?: string
  createdAt: string
  updatedAt: string
}

/**
 * Données à envoyer pour créer ou mettre à jour une actualité.
 * L'image est uploadée séparément via /upload/news-image.
 */
export type NewsInput = Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt' | 'image'>
