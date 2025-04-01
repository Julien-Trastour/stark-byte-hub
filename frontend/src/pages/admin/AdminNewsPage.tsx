import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash } from 'lucide-react'
import { useAtom, useSetAtom } from 'jotai'
import { newsAtom, fetchNewsAtom } from '../../store/newsAtom'
import { deleteNews, createNews, updateNews } from '../../services/newsService'
import type { NewsItem } from '../../types/news'
import NewsEditModal from '../../components/admin/news/NewsEditModal'
import { Button } from '../../components/ui'
import { ConfirmDialog } from '../../components/common/Confirm-dialog'

export default function AdminNewsPage() {
  const [newsList] = useAtom(newsAtom)
  const fetchNews = useSetAtom(fetchNewsAtom)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  const handleDeleteConfirmed = async () => {
    if (!confirmDeleteId) return
    try {
      await deleteNews(confirmDeleteId)
      await fetchNews()
    } catch (err) {
      console.error('Erreur suppression actu :', err)
    } finally {
      setConfirmDeleteId(null)
    }
  }

  const handleSave = async (data: Omit<NewsItem, 'id' | 'updatedAt'>) => {
    try {
      if (editingNews) {
        await updateNews(editingNews.id, data)
      } else {
        await createNews(data)
      }
      await fetchNews()
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
            variant='neon'
            onClick={() => {
          setEditingNews(null)
          setModalOpen(true)
        }}>
          <Plus size={16} /> Ajouter une actu
        </Button>
      </div>

      {/* Liste d’actualités */}
      {newsList.length === 0 ? (
        <p className="text-gray-400">Aucune actualité pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {newsList.map((news) => {
            const plainText = news.description
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

            return (
              <div
                key={news.id}
                className="relative bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-4 shadow-md"
              >
                <div className="flex flex-wrap gap-2 mb-2">
                  {news.tags.map((tag) => (
                    <span
                      key={tag}
                      className="capitalize text-xs font-medium text-[#00aaff] bg-[#00aaff]/10 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-white font-bold text-lg">{news.title}</h3>

                <p className="text-gray-400 text-sm line-clamp-3">{plainText}</p>

                <p className="text-gray-500 text-xs mt-1">
                  {new Date(news.date).toLocaleDateString('fr-FR')}
                </p>

                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    className="flex-1 text-[#00aaff] border-[#00aaff]/40 hover:bg-[#00aaff] hover:text-black"
                    onClick={() => {
                      setEditingNews(news)
                      setModalOpen(true)
                    }}
                  >
                    <Pencil size={14} className="inline-block mr-1" /> Modifier
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-400 border-red-400/40 hover:bg-red-500 hover:text-black"
                    onClick={() => setConfirmDeleteId(news.id)}
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
