import { NewsItem } from "../../types/news";

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
		<div className="relative bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-4 shadow-md">
			{/* Image (si dispo) */}
			{news.image && (
				<img
					src={news.image}
					alt={news.title}
					className="w-full h-32 object-cover rounded-md mb-3"
				/>
			)}

			{/* Tags */}
			<div className="flex flex-wrap gap-2 mb-2">
				{news.tags.map((tag, i) => (
					<span
						key={i}
						className="capitalize text-xs font-medium text-[#00aaff] bg-[#00aaff]/10 px-2 py-0.5 rounded-full"
					>
						{tag}
					</span>
				))}
			</div>

			{/* Titre */}
			<h3 className="text-white font-bold text-lg">{news.title}</h3>

			{/* Aperçu texte nettoyé */}
			<p className="text-gray-400 text-sm line-clamp-3">{preview}</p>

			{/* Date */}
			<p className="text-gray-500 text-xs mt-2">{formattedDate}</p>

			{/* Bouton d'ouverture */}
			<button
				onClick={() => onOpen(news)}
				aria-label={`Voir plus sur : ${news.title}`}
				className="mt-3 inline-block text-sm text-[#00aaff] hover:underline"
			>
				Voir plus →
			</button>
		</div>
	);
}
