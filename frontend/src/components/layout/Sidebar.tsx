import {
	Home,
	LayoutDashboard,
	Users,
	Cpu,
	Newspaper,
	UploadCloud,
} from "lucide-react";
import { Link } from "react-router";
import { useAtomValue } from "jotai";
import { authAtom } from "../../store/authAtom";

export default function Sidebar() {
	const user = useAtomValue(authAtom);

	return (
		<aside className="w-64 p-6 flex flex-col gap-6 bg-[#1e1e1e] text-white border-r border-[#2a2a2a]">
			<img
				src="/stark_byte_hub_logo_white_transparent.svg"
				alt="Stark Byte Hub"
				className="h-12 mb-4"
			/>

			<nav className="flex flex-col gap-5 text-base">
				<Link
					to="/"
					className="flex items-center gap-3 text-gray-300 hover:text-[#00aaff] hover:pl-1 transition-all"
				>
					<Home size={20} /> Accueil
				</Link>

				<Link
					to="/robots"
					className="flex items-center gap-3 text-gray-300 hover:text-[#00aaff] hover:pl-1 transition-all"
				>
					<LayoutDashboard size={20} /> Mes robots
				</Link>

				{user?.role?.name === "admin" && (
					<>
						<div className="mt-6 border-t border-[#2a2a2a] pt-4" />
						<p className="text-sm text-gray-400 uppercase mb-3 tracking-widest">
							Administration
						</p>
						<Link
							to="/admin/users"
							className="flex items-center gap-3 text-gray-300 hover:text-[#00aaff] hover:pl-1 transition-all"
						>
							<Users size={20} /> Gestion utilisateurs
						</Link>
						<Link
							to="/admin/robots"
							className="flex items-center gap-3 text-gray-300 hover:text-[#00aaff] hover:pl-1 transition-all"
						>
							<Cpu size={20} /> Gestion des robots
						</Link>
						<Link
							to="/admin/news"
							className="flex items-center gap-3 text-gray-300 hover:text-[#00aaff] hover:pl-1 transition-all"
						>
							<Newspaper size={20} /> Gestion des news
						</Link>
						<Link
							to="/admin/firmwares"
							className="flex items-center gap-3 text-gray-300 hover:text-[#00aaff] hover:pl-1 transition-all"
						>
							<UploadCloud size={20} /> Gestion des firmwares
						</Link>
					</>
				)}
			</nav>
		</aside>
	);
}
