import { useEffect, useRef, useState } from "react";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAtomValue } from "jotai";
import { authAtom } from "../../store/authAtom";
import { useLogout } from "../../hooks/useAuth";

export default function Header() {
	const user = useAtomValue(authAtom);
	const logout = useLogout();
	const navigate = useNavigate();

	const [open, setOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleLogout = async () => {
		await logout();
		navigate("/login");
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<header className="h-16 px-6 flex items-center justify-end border-b bg-[#1e1e1e] border-[#2a2a2a] text-white">
			<div className="relative" ref={dropdownRef}>
				<button
					type="button"
					onClick={() => setOpen((prev) => !prev)}
					className="flex items-center gap-2 text-sm hover:text-[#00aaff] transition"
				>
					<div className="h-8 w-8 rounded-full bg-[#00aaff]/20 flex items-center justify-center text-[#00aaff] uppercase font-bold">
						{user?.firstName?.[0]}
					</div>
					{user?.firstName} {user?.lastName}
					<ChevronDown size={16} />
				</button>

				{open && (
					<div className="absolute right-0 mt-2 bg-[#2a2a2a] text-white rounded shadow-lg overflow-hidden z-50 min-w-[160px] border border-[#3a3a3a]">
						<Link
							to="/profile"
							className="block px-4 py-2 hover:bg-[#00aaff]/10 flex items-center gap-2"
							onClick={() => setOpen(false)}
						>
							<User size={16} /> Profil
						</Link>
						<Link
							to="/settings"
							className="block px-4 py-2 hover:bg-[#00aaff]/10 flex items-center gap-2"
							onClick={() => setOpen(false)}
						>
							<Settings size={16} /> Paramètres
						</Link>
						<button
							type="button"
							onClick={handleLogout}
							className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-400 flex items-center gap-2"
						>
							<LogOut size={16} /> Déconnexion
						</button>
					</div>
				)}
			</div>
		</header>
	);
}
