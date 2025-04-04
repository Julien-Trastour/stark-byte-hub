import { useState, useEffect } from "react"
import { Check, Copy } from "lucide-react"
import { fetchNewsImages } from "../../services/newsService"

interface ImageLibraryProps {
  onSelectImage: (url: string) => void
}

const ImageLibrary: React.FC<ImageLibraryProps> = ({ onSelectImage }) => {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imageList = await fetchNewsImages()

        // Corrige les URLs si elles ne sont pas absolues
        const fullUrls = imageList.map((url) =>
          url.startsWith("http") ? url : `${import.meta.env.VITE_API_URL}${url}`
        )

        setImages(fullUrls)
      } catch (err) {
        console.error("Erreur lors du chargement des images", err)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  const handleSelect = (url: string) => {
    setSelectedImage(url)
    onSelectImage(url)
    setCopied(false)
  }

  const handleCopy = async () => {
    if (selectedImage) {
      await navigator.clipboard.writeText(selectedImage)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">Bibliothèque d'images</h3>

      {loading ? (
        <p className="text-gray-400">Chargement des images...</p>
      ) : images.length === 0 ? (
        <p className="text-gray-500">Aucune image disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => handleSelect(image)}
              className={`w-full h-32 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#00aaff] cursor-pointer ${
                selectedImage === image ? "ring-2 ring-[#00aaff]" : ""
              }`}
              aria-label={`Sélectionner ${image.split("/").pop()}`}
            >
              <img
                src={image}
                alt={image.split("/").pop() || `illustration ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="mt-6 space-y-3">
          <p className="text-sm text-white font-medium">Image sélectionnée :</p>

          <img
            src={selectedImage}
            alt="Aperçu"
            className="w-full max-w-xs rounded-md border border-[#333]"
          />

          <div className="flex gap-2 items-center">
            <input
              type="text"
              readOnly
              value={selectedImage}
              className="flex-1 bg-[#1e1e1e] border border-[#2a2a2a] px-3 py-2 rounded-md text-sm text-white"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="text-sm px-3 py-2 rounded-md bg-[#00aaff]/20 text-[#00aaff] hover:bg-[#00aaff]/30"
            >
              {copied ? (
                <span className="flex items-center gap-1">
                  <Check size={16} /> Copié
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Copy size={16} /> Copier
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageLibrary
