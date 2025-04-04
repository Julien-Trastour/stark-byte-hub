import { useState } from 'react'
import { Plus, Pencil, Trash } from 'lucide-react'
import type { NewsItem, NewsInput } from '../../types/news'
import {
  useNewsQuery,
  useCreateNews,
  useUpdateNews,
  useDeleteNews,
} from '../../hooks/useNews'
import NewsEditModal from '../../components/admin/news/NewsEditModal'
import { Button } from '../../components/ui'
import { ConfirmDialog } from '../../components/common/Confirm-dialog'

export default function AdminNewsPage() {
  const { news, isLoading, isError } = useNewsQuery()
  const createNews = useCreateNews()
  const updateNews = useUpdateNews()
  const deleteNews = useDeleteNews()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const handleDeleteConfirmed = async () => {
    if (!confirmDeleteId) return
    try {
      await deleteNews.mutateAsync(confirmDeleteId)
    } catch (err) {
      console.error('Erreur suppression actu :', err)
    } finally {
      setConfirmDeleteId(null)
    }
  }

  const handleSave = async (data: NewsInput) => {
    try {
      if (editingNews) {
        await updateNews.mutateAsync({ id: editingNews.id, data })
      } else {
        await createNews.mutateAsync(data)
      }
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de l’actu :', err)
    } finally {
      setModalOpen(false)
      setEditingNews(null)
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Gestion des actualités</h1>
        <Button
          variant="neon"
          onClick={() => {
            setEditingNews(null)
            setModalOpen(true)
          }}
        >
          <Plus size={16} /> Ajouter une actu
        </Button>
      </div>

      {/* Chargement / erreur */}
      {isLoading ? (
        <p className="text-gray-400">Chargement en cours...</p>
      ) : isError ? (
        <p className="text-red-500">Erreur lors du chargement des actualités.</p>
      ) : news.length === 0 ? (
        <p className="text-gray-400">Aucune actualité pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {news.map((item) => {
            const plainText = item.description
              .replace(/^#{1,6}\s+/gm, '')
              .replace(/\*\*(.*?)\*\*/g, '$1')
              .replace(/\*(.*?)\*/g, '$1')
              .replace(/!\[.*?\]\(.*?\)/g, '')
              .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
              .replace(/`{1,3}[^`]*`{1,3}/g, '')
              .replace(/>\s?/g, '')
              .replace(/[-*_]{3,}/g, '\n')
              .replace(/\n{2,}/g, '\n')
              .replace(/^[\s\n]*|[\s\n]*$/g, '')
              .replace(/\n/g, ' ')
              .trim()
              .slice(0, 300)

            const imageUrl = item.images[0]?.url ?? null

            return (
              <div
                key={item.id}
                className="rounded-lg border-l-4 border-[#00aaff]/30 bg-[#1e1e1e] p-6 shadow-lg shadow-[#00aaff]/10"
              >
                {/* Aperçu image */}
                {imageUrl && (
                  <div className="w-full aspect-square mb-4 overflow-hidden rounded-md">
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="capitalize text-xs font-medium text-[#00aaff] bg-[#00aaff]/10 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Titre & extrait */}
                <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-2 line-clamp-3">{plainText}</p>
                <p className="text-gray-500 text-xs mb-3">
                  {new Date(item.date).toLocaleDateString('fr-FR')}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-[#00aaff] border-[#00aaff]/40 hover:bg-[#00aaff] hover:text-black"
                    onClick={() => {
                      setEditingNews(item)
                      setModalOpen(true)
                    }}
                  >
                    <Pencil size={14} className="inline-block mr-1" /> Modifier
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-400 border-red-400/40 hover:bg-red-500 hover:text-black"
                    onClick={() => setConfirmDeleteId(item.id)}
                  >
                    <Trash size={14} className="inline-block mr-1" /> Supprimer
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal édition */}
      {modalOpen && (
        <NewsEditModal
          onClose={() => {
            setModalOpen(false)
            setEditingNews(null)
          }}
          onSave={handleSave}
          initialData={editingNews || undefined}
        />
      )}

      {/* Confirmation suppression */}
      {confirmDeleteId && (
        <ConfirmDialog
          title="Confirmation de suppression"
          description="Souhaitez-vous vraiment supprimer cette actualité ?"
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={handleDeleteConfirmed}
        />
      )}
    </div>
  )
}
