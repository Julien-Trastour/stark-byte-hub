import { useState } from "react"
import { Cpu, AlertTriangle, Clock } from "lucide-react"
import { useAtomValue } from "jotai"
import { useNewsQuery } from "../../hooks/useNews"
import { robotsAtom } from "../../store/robotAtom"
import type { NewsItem } from "../../types/news"
import HomeActu from "../../components/news/HomeActu"
import NewsPreviewModal from "../../components/news/NewsPreviewModal"
import ErrorBoundary from "../../components/common/ErrorBoundary"
import LoaderFullscreen from "../../components/common/Loader"

export default function HomePage() {
	const { news, isLoading, isError } = useNewsQuery()
	const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
	const robots = useAtomValue(robotsAtom)

	const alerts = [
		"Mise à jour en attente",
		"Arachnobot Julien – Batterie faible",
	]

	const activity = {
		week: "2h 30min",
		month: "12h 45min",
		year: "85h 20min",
	}

	if (isLoading) return <LoaderFullscreen message="Chargement des actualités..." />

	return (
		<ErrorBoundary>
			<div className="h-full flex flex-col gap-8">
				{/* Section 1 — Statistiques */}
				<section className="animate-fadeInUp delay-[100ms]">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<StatCard
							icon={<Cpu size={26} />}
							iconBg="bg-[#00aaff]/20 text-[#00aaff]"
							title="Robots liés"
							count={robots.length}
						>
							{robots.length > 0 ? (
								<ul className="space-y-1">
									{robots.map((robot) => (
										<li key={robot.id}>
											{robot.name}{" "}
											<span className="text-gray-500 text-sm">
												({robot.serialNumber})
											</span>
										</li>
									))}
								</ul>
							) : (
								<p className="italic text-gray-500">Aucun robot rattaché actuellement.</p>
							)}
						</StatCard>

						<StatCard
							icon={<AlertTriangle size={26} />}
							iconBg="bg-red-500/20 text-red-500"
							blurColor="bg-red-500/10"
							title="Alertes actives"
							count={alerts.length}
						>
							{alerts.length > 0 ? (
								<ul className="space-y-1">
									{alerts.map((alert) => (
										<li key={alert}>• {alert}</li>
									))}
								</ul>
							) : (
								<p className="italic text-gray-500">Aucune alerte en cours.</p>
							)}
						</StatCard>

						<StatCard
							icon={<Clock size={26} />}
							iconBg="bg-green-500/20 text-green-500"
							blurColor="bg-green-500/10"
							title="Temps d'activité"
							count="Cette semaine"
						>
							<p>
								Semaine : <span className="font-semibold">{activity.week}</span>
							</p>
							<p>
								Mois : <span className="font-semibold">{activity.month}</span>
							</p>
							<p>
								Année : <span className="font-semibold">{activity.year}</span>
							</p>
						</StatCard>
					</div>
				</section>

				{/* Section 2 — Actualités */}
				<section className="animate-fadeInUp delay-[200ms]">
					<h2 className="text-2xl font-bold tracking-wide mb-4 text-white">
						Actualités Stark Byte
					</h2>

					{isError ? (
						<p className="text-sm text-red-400 italic">
							Erreur lors du chargement des actualités.
						</p>
					) : news.length === 0 ? (
						<p className="text-sm text-gray-500 italic">
							Aucune actualité disponible pour le moment.
						</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{news.map((item) => (
								<HomeActu key={item.id} news={item} onOpen={setSelectedNews} />
							))}
						</div>
					)}
				</section>

				{/* Section 3 — Activité récente */}
				<section className="animate-fadeInUp delay-[300ms]">
					<h2 className="text-2xl font-bold tracking-wide mb-4 text-white">Activité récente</h2>
					<div className="bg-[#1e1e1e] rounded-xl p-5 border border-[#2a2a2a] shadow-sm overflow-y-auto">
						<p className="text-[15px] text-gray-400 italic">Aucune activité récente.</p>
					</div>
				</section>

				{/* Modale actu */}
				{selectedNews && (
					<NewsPreviewModal news={selectedNews} onClose={() => setSelectedNews(null)} />
				)}
			</div>
		</ErrorBoundary>
	)
}

function StatCard({
	icon,
	iconBg,
	blurColor = "bg-[#00aaff]/10",
	title,
	count,
	children,
}: {
	icon: React.ReactNode
	iconBg: string
	blurColor?: string
	title: string
	count: string | number
	children: React.ReactNode
}) {
	return (
		<div className="relative rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] shadow-lg overflow-hidden">
			<div className={`absolute -inset-1 z-0 blur-md ${blurColor} rounded-xl`} />
			<div className="relative z-10 p-5 flex flex-col gap-3">
				<div className="flex items-center gap-4">
					<div className={`p-3 rounded-full ${iconBg}`}>{icon}</div>
					<div>
						<p className="text-gray-400 text-[15px]">{title}</p>
						<p className="text-2xl font-bold">{count}</p>
					</div>
				</div>
				<div className="text-[15px] text-gray-300 pl-1 space-y-1">{children}</div>
			</div>
		</div>
	)
}
