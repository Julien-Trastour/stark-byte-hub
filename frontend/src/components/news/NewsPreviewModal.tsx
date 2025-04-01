import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import type { NewsItem } from '../../types/news'

type Props = {
  news: NewsItem | null
  onClose: () => void
}

export default function NewsPreviewModal({ news, onClose }: Props) {
  if (!news) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-lg border-l-4 border-[#00aaff]/30 bg-[#1e1e1e] p-8 shadow-lg shadow-[#00aaff]/10 text-white relative my-12">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg"
          aria-label="Fermer"
        >
          ✕
        </button>

        <div className="space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {news.tags.map((tag) => (
              <span
                key={tag}
                className="capitalize text-xs font-medium text-[#00aaff] bg-[#00aaff]/10 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <h2 className="text-2xl font-bold tracking-wide mb-1">{news.title}</h2>

          <p className="text-sm text-gray-400">
            {new Date(news.date).toLocaleDateString('fr-FR')}
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
                code: (props) => {
                  const {
                    inline,
                    className,
                    children,
                    ...rest
                  } = props as {
                    inline?: boolean
                    className?: string
                    children: React.ReactNode
                  }
                  return inline ? (
                    <code className="bg-[#2a2a2a] px-1 py-0.5 rounded text-[#00aaff]" {...rest}>
                      {children}
                    </code>
                  ) : (
                    <pre className="bg-[#121212] p-4 rounded text-sm overflow-auto">
                      <code className={className} {...rest}>{children}</code>
                    </pre>
                  )
                },
                hr: () => <hr className="my-6 border-[#333]" />,
              }}
            >
              {news.description}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}
