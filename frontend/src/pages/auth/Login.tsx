import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useLoginMutation } from "../../hooks/useAuth";

export default function Login() {
	const navigate = useNavigate();
	const { mutate: login, isPending, error } = useLoginMutation();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		login(
			{ email, password },
			{
				onSuccess: () => navigate("/"),
			}
		);
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-[#121212] px-4">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-md space-y-6 rounded-lg border-l-4 border-[#00aaff]/30 bg-[#1e1e1e] p-8 shadow-lg shadow-[#00aaff]/10"
			>
				<div className="text-center">
					<img
						src="/stark_byte_hub_logo_white_transparent.svg"
						alt="Stark Byte Hub Logo"
						className="mx-auto mb-5 h-20"
					/>
					<p className="mt-2 text-sm font-mono text-gray-400">
						Connexion au{" "}
						<span className="text-[#00aaff] animate-pulse">nœud principal...</span>
					</p>
				</div>

				{error && (
					<div className="rounded bg-red-500/20 p-2 text-center text-red-400">
						{error instanceof Error ? error.message : "Erreur inconnue"}
					</div>
				)}

				<input
					type="email"
					placeholder="Adresse email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					className="w-full rounded-md border border-[#444444] bg-[#333333] px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-[#00aaff]"
				/>

				<input
					type="password"
					placeholder="Mot de passe"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					className="w-full rounded-md border border-[#444444] bg-[#333333] px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-[#00aaff]"
				/>

				<button
					type="submit"
					disabled={isPending}
					className="group relative w-full overflow-hidden rounded-md border border-[#00aaff] py-3 font-semibold tracking-wide text-[#00aaff] transition-colors hover:bg-[#00aaff] hover:text-[#121212] disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<span className="relative z-10">{isPending ? "Connexion..." : "SE CONNECTER"}</span>
					<span className="absolute inset-0 h-full w-full bg-[#00aaff]/10 blur-md" />
				</button>

				<div className="text-center">
					<Link to="/forgot-password" className="text-sm text-[#00aaff] underline">
						Mot de passe oublié ?
					</Link>
				</div>

				<div className="text-center">
					<Link to="/register" className="text-xs text-gray-400 underline">
						Créer un compte
					</Link>
				</div>
			</form>
		</div>
	);
}
