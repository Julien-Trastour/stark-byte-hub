import type { NewsItem } from "../../types/news";

type Props = {
	news: NewsItem;
	onOpen: (news: NewsItem) => void;
};

// Nettoyage du markdown pour aperçu
function getPlainText(markdown: string): string {
	return markdown
		.replace(/^#{1,6}\s+/gm, "")
		.replace(/\*\*(.*?)\*\*/g, "$1")
		.replace(/\*(.*?)\*/g, "$1")
		.replace(/!\[.*?\]\(.*?\)/g, "")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/`{1,3}[^`]*`{1,3}/g, "")
		.replace(/>\s?/g, "")
		.replace(/[-*_]{3,}/g, "\n")
		.replace(/\n{2,}/g, "\n")
		.replace(/^[\s\n]*|[\s\n]*$/g, "")
		.replace(/\n/g, " ")
		.trim();
}

export default function HomeActu({ news, onOpen }: Props) {
	const preview = getPlainText(news.description).slice(0, 300);
	const formattedDate = new Date(news.date).toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	return (
		<div className="rounded-lg border-l-4 border-[#00aaff]/30 bg-[#1e1e1e] p-6 shadow-lg shadow-[#00aaff]/10">
			{/* Image (si dispo) */}
			{news.image && (
				<img
					src={news.image}
					alt={news.title}
					className="w-full h-32 object-cover rounded-md mb-4"
				/>
			)}

			{/* Tags */}
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

			{/* Titre */}
			<h3 className="text-white font-bold text-lg mb-1">{news.title}</h3>

			{/* Aperçu texte nettoyé */}
			<p className="text-gray-400 text-sm mb-2 line-clamp-3">{preview}</p>

			{/* Date */}
			<p className="text-gray-500 text-xs mb-3">{formattedDate}</p>

			{/* Bouton d'ouverture */}
			<button
				type="button"
				onClick={() => onOpen(news)}
				aria-label={`Voir plus sur : ${news.title}`}
				className="text-sm text-[#00aaff] hover:underline"
			>
				Voir plus →
			</button>
		</div>
	);
}
