import { useEffect, useState } from "react"
import { Input, Button, Label } from "../../ui"
import { toast } from "react-hot-toast"
import type { NewsItem, NewsInput } from "../../../types/news"
import { uploadNewsImage } from "../../../services/newsService"
import MDEditor from "@uiw/react-md-editor"
import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"
import ImageLibrary from "../../news/ImageLibrary"

interface Props {
  initialData?: NewsItem
  onClose: () => void
  onSave: (news: NewsInput) => Promise<void>
}

export default function NewsEditModal({ initialData, onClose, onSave }: Props) {
  const isEditing = !!initialData
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [description, setDescription] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setTags(initialData.tags.join(", "))
      setDescription(initialData.description)
      const urls = initialData.images.map((img) => img.url)
      setExistingImages(urls)
      setCoverImageUrl(initialData.coverImage?.url ?? urls[0] ?? null)
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    try {
      const images: string[] = [...existingImages]

      if (imageFile) {
        const res = await uploadNewsImage(imageFile)
        const fullUrl = `${import.meta.env.VITE_API_URL}/uploads/news/${res.filename}`
        images.push(fullUrl)
        if (!coverImageUrl) setCoverImageUrl(fullUrl)
      } else if (selectedImageUrl) {
        images.push(selectedImageUrl)
        if (!coverImageUrl) setCoverImageUrl(selectedImageUrl)
      }

      await onSave({
        title,
        tags: tagsArray,
        description,
        date: initialData?.date || new Date().toISOString(),
        images,
        coverImageUrl,
      })

      toast.success(isEditing ? "Actualité modifiée" : "Actualité créée")
      onClose()
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fadeIn">
      <div className="w-full max-w-2xl rounded-lg border-l-4 border-[#00aaff]/30 bg-[#1e1e1e] p-8 shadow-lg shadow-[#00aaff]/10 relative max-h-[95vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg"
          aria-label="Fermer"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-6 text-white">
          {isEditing ? "Modifier l'actualité" : "Nouvelle actualité"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (séparés par une virgule)</Label>
            <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="description">Contenu (Markdown)</Label>
            <div
              data-color-mode="dark"
              className="bg-[#121212] border border-[#2a2a2a] rounded-md"
            >
              <MDEditor
                value={description}
                onChange={(val = "") => setDescription(val)}
                preview="edit"
                height={300}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image">Image (upload depuis votre PC)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <ImageLibrary
              onSelectImage={(url) => {
                setSelectedImageUrl(url)
                setImageFile(null)
              }}
            />
          </div>

          {existingImages.length > 0 && (
            <div className="pt-4 space-y-2">
              <p className="text-sm text-white mb-1">Images existantes :</p>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((url) => (
                  <button
                    key={url}
                    type="button"
                    className={`relative border rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#00aaff] ${
                      url === coverImageUrl
                        ? "border-[#00aaff] ring-2 ring-[#00aaff]"
                        : "border-[#333]"
                    }`}
                    onClick={() => setCoverImageUrl(url)}
                    aria-label="Définir comme image de couverture"
                  >
                    <img
                      src={url}
                      alt="Aperçu"
                      className="w-24 h-24 object-cover cursor-pointer"
                    />
                    {url === coverImageUrl && (
                      <span className="absolute bottom-1 right-1 bg-[#00aaff] text-black text-xs px-1 py-0.5 rounded">
                        Couverture
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="neon" disabled={loading}>
              {loading
                ? "Enregistrement..."
                : isEditing
                ? "Enregistrer"
                : "Créer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
