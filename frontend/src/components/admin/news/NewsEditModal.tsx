import { useEffect, useState } from "react";
import { Input, Button, Label } from "../../ui";
import { toast } from "react-hot-toast";
import type { NewsItem } from "../../../types/news";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

interface Props {
  initialData?: NewsItem;
  onClose: () => void;
  onSave: (news: Omit<NewsItem, "id" | "updatedAt">) => Promise<void>;
}

export default function NewsEditModal({ initialData, onClose, onSave }: Props) {
  const isEditing = !!initialData;
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setTags(initialData.tags.join(", "));
      setDescription(initialData.description);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await onSave({
        title,
        tags: tagsArray,
        description,
        date: initialData?.date || new Date().toISOString(),
        createdAt: initialData?.createdAt || new Date().toISOString(),
      });
      toast.success(isEditing ? "Actualité modifiée" : "Actualité créée");
      onClose();
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fadeIn">
      <div className="w-full max-w-2xl rounded-lg border-l-4 border-[#00aaff]/30 bg-[#1e1e1e] p-8 shadow-lg shadow-[#00aaff]/10 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg"
          aria-label="Fermer"
        >
          ✕
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
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Contenu (Markdown)</Label>
            <div data-color-mode="dark" className="bg-[#121212] border border-[#2a2a2a] rounded-md">
              <MDEditor
                value={description}
                onChange={(val = "") => setDescription(val)}
                preview="edit"
                height={300}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="neon" disabled={loading}>
              {loading ? "Enregistrement..." : isEditing ? "Enregistrer" : "Créer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
