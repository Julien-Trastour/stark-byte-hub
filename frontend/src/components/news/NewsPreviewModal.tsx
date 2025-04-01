import { useEffect, useState } from "react";
import FocusTrap from "focus-trap-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/Label";
import { NewsItem } from "../../types/news";

type Props = {
  news: NewsItem | null;
  onClose: () => void;
  onSave?: (updated: Partial<NewsItem>) => void;
  editable?: boolean;
};

export default function NewsPreviewModal({ news, onClose, onSave, editable = false }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Empêche scroll body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Fermer avec ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    if (news) {
      setTitle(news.title);
      setDescription(news.description);
    }
  }, [news]);

  if (!news) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({ title, description });
      setIsEditing(false);
    }
  };

  return (
    <FocusTrap>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 animate-fadeIn">
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-6 w-full max-w-4xl min-w-[320px] sm:min-w-[768px] text-white relative shadow-xl max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg"
            aria-label="Fermer"
          >
            ✕
          </button>

          {editable && !isEditing && (
            <div className="absolute top-4 left-4">
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Modifier
              </Button>
            </div>
          )}

          <div className="space-y-4 mt-2">
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag, i) => (
                <span
                  key={i}
                  className="capitalize text-xs font-medium text-[#00aaff] bg-[#00aaff]/10 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {!isEditing ? (
              <>
                <h2 className="text-2xl font-bold tracking-wide">{news.title}</h2>
                <p className="text-sm text-gray-400">
                  {new Date(news.date).toLocaleDateString("fr-FR")}
                </p>
                <hr className="border-[#2a2a2a]" />

                <div className="prose prose-invert max-w-none text-sm">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h1: (props) => <h1 className="text-3xl font-bold mt-4 mb-2" {...props} />,
                      h2: (props) => <h2 className="text-2xl font-semibold mt-4 mb-2" {...props} />,
                      h3: (props) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
                      p: (props) => <p className="my-2" {...props} />,
                      ul: (props) => <ul className="list-disc ml-6 my-2" {...props} />,
                      ol: (props) => <ol className="list-decimal ml-6 my-2" {...props} />,
                      blockquote: (props) => (
                        <blockquote
                          className="border-l-4 border-[#00aaff] pl-4 italic my-4 text-gray-300"
                          {...props}
                        />
                      ),
                      code: ({ inline, className, children, ...rest }: any) =>
                        inline ? (
                          <code className="bg-[#2a2a2a] px-1 py-0.5 rounded text-[#00aaff]" {...rest}>
                            {children}
                          </code>
                        ) : (
                          <pre className="bg-[#121212] p-4 rounded text-sm overflow-auto">
                            <code className={className} {...rest}>
                              {children}
                            </code>
                          </pre>
                        ),
                      hr: () => <hr className="my-6 border-[#333]" />,
                    }}
                  >
                    {news.description}
                  </ReactMarkdown>
                </div>
              </>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div>
                  <Label htmlFor="description">Contenu (Markdown)</Label>
                  <Textarea
                    id="description"
                    rows={12}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" variant="neon">
                    Enregistrer
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </FocusTrap>
  );
}
