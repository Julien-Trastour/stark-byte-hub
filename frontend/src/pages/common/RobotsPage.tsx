import { useEffect, useState } from "react";
import { Plus, Cpu } from "lucide-react";
import { useNavigate } from "react-router";
import { useAtom, useSetAtom } from "jotai";
import { robotsAtom, fetchRobotsAtom } from "../../store/robotAtom";
import type { Robot } from "../../types/robot";
import RobotCard from "../../components/robots/RobotCard";
import AlertList from "../../components/robots/AlertList";
import LinkRobotModal from "../../components/robots/LinkRobotModal";
import Toast from "../../components/common/Toast";
import { Input, Button, Dialog } from "../../components/ui";
import ErrorBoundary from "../../components/common/ErrorBoundary";
import LoaderFullscreen from "../../components/common/Loader";

export default function RobotsPage() {
	const [robots] = useAtom(robotsAtom);
	const fetchRobots = useSetAtom(fetchRobotsAtom);
	const [search, setSearch] = useState("");
	const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const [alerts] = useState([
		"Mise à jour en attente",
		"Arachnobot Julien – Batterie faible",
	]);

	useEffect(() => {
		const load = async () => {
			try {
				await fetchRobots();
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, [fetchRobots]);	

	useEffect(() => {
		if (toast) {
			const timeout = setTimeout(() => setToast(null), 3000);
			return () => clearTimeout(timeout);
		}
	}, [toast]);

	const refreshRobots = async () => {
		try {
			await fetchRobots();
			setToast({ message: "Robot lié avec succès 🎉", type: "success" });
		} catch {
			setToast({ message: "Erreur lors du rechargement", type: "error" });
		}
	};

	const filteredRobots = robots.filter((r) =>
		(r.name || "").toLowerCase().includes(search.toLowerCase())
	);

	if (loading) return <LoaderFullscreen message="Chargement des robots..." />;

	return (
		<ErrorBoundary>
			<div className="h-full flex flex-col gap-6 animate-fadeInUp delay-[100ms]">
				{/* Titre + bouton */}
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold flex items-center gap-2 text-white">
						<Cpu size={24} /> Mes robots
					</h1>
					<Button variant="neon" onClick={() => setShowModal(true)}>
						<span className="flex items-center gap-1">
							<Plus size={16} /> Ajouter un robot
						</span>
					</Button>
				</div>

				{/* Barre de recherche */}
				<Input
					type="text"
					placeholder="Rechercher un robot..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="bg-[#1e1e1e] border border-[#2a2a2a] text-sm text-white px-4 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#00aaff] placeholder-gray-500"
				/>

				{/* Section Alertes */}
				<AlertList alerts={alerts} />

				{/* Grille de cartes */}
				<section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
					{filteredRobots.length > 0 ? (
						<>
							{filteredRobots.slice(0, 8).map((robot) => (
								<RobotCard
									key={robot.id}
									robot={robot}
									onViewActivity={() => setSelectedRobot(robot)}
									onViewDetails={() => navigate(`/robots/${robot.id}`)}
								/>
							))}
							{Array.from({ length: 8 - Math.min(filteredRobots.length, 8) }).map((_, i) => (
							<div key={`robot-placeholder-${i + filteredRobots.length}`} className="invisible" />
							))}
						</>
					) : (
						<p className="text-sm text-gray-400 italic col-span-full">
							Aucun robot ne correspond à votre recherche.
						</p>
					)}
				</section>

				{/* Bloc "activité" */}
				{selectedRobot && (
					<div className="p-4 border border-[#2a2a2a] bg-[#1e1e1e] rounded-xl mt-2">
						<div className="flex justify-between items-center mb-2">
							<h2 className="text-xl text-white font-bold">
								Activité de {selectedRobot.name || "Robot"}
							</h2>
							<button
								type="button"
								onClick={() => setSelectedRobot(null)}
								className="text-sm text-red-400 hover:text-red-300"
							>
								Fermer
							</button>
						</div>
						<p className="text-sm text-gray-400 italic">
							(À venir : historique, mouvement, alertes détaillées…)
						</p>
					</div>
				)}

				{/* Modale de liaison */}
				{showModal && (
					<Dialog onClose={() => setShowModal(false)}>
						<LinkRobotModal onClose={() => setShowModal(false)} onSuccess={refreshRobots} />
					</Dialog>
				)}

				{/* Toast */}
				{toast && <Toast message={toast.message} type={toast.type} />}
			</div>
		</ErrorBoundary>
	);
}
