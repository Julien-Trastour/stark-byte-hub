import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useRegisterMutation } from "../../hooks/useAuth";
import type { RegisterPayload } from "../../types/auth";

export default function Register() {
	const navigate = useNavigate();
	const { mutate: register, isPending, error } = useRegisterMutation();

	const [form, setForm] = useState<RegisterPayload>({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		address: "",
		address2: "",
		zipCode: "",
		city: "",
		country: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		register(form, {
			onSuccess: () => navigate("/"),
		});
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
					<p className="text-sm font-mono text-gray-400">
						Inscription au{" "}
						<span className="text-[#00aaff] animate-pulse">réseau Stark Byte</span>
					</p>
				</div>

				{error && (
					<div className="rounded bg-red-500/20 p-2 text-center text-red-400">
						{error instanceof Error ? error.message : "Erreur inconnue"}
					</div>
				)}

				<div className="grid grid-cols-2 gap-4">
					<input name="firstName" type="text" placeholder="Prénom" value={form.firstName} onChange={handleChange} required className="rounded-md border border-[#444444] bg-[#333333] px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-[#00aaff]" />
					<input name="lastName" type="text" placeholder="Nom" value={form.lastName} onChange={handleChange} required className="rounded-md border border-[#444444] bg-[#333333] px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-[#00aaff]" />
				</div>

				<input name="email" type="email" placeholder="Adresse email" value={form.email} onChange={handleChange} required className="w-full rounded-md border border-[#444444] bg-[#333333] px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-[#00aaff]" />

				<input name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} required className="w-full rounded-md border border-[#444444] bg-[#333333] px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-[#00aaff]" />

				<input name="address" type="text" placeholder="Adresse" value={form.address} onChange={handleChange} className="w-full rounded-md border border-[#444444] bg-[#333333] px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-[#00aaff]" />

				<input name="address2" type="text" placeholder="Complément d’adresse" value={form.address2} onChange={handleChange} className="w-full rounded-md border border-[#444444] bg-[#333333] px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-[#00aaff]" />

				<div className="grid grid-cols-2 gap-4">
					<input name="zipCode" type="text" placeholder="Code postal" value={form.zipCode} onChange={handleChange} className="rounded-md border border-[#444444] bg-[#333333] px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-[#00aaff]" />
					<input name="city" type="text" placeholder="Ville" value={form.city} onChange={handleChange} className="rounded-md border border-[#444444] bg-[#333333] px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-[#00aaff]" />
				</div>

				<input name="country" type="text" placeholder="Pays" value={form.country} onChange={handleChange} className="w-full rounded-md border border-[#444444] bg-[#333333] px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-[#00aaff]" />

				<button
					type="submit"
					disabled={isPending}
					className="group relative w-full overflow-hidden rounded-md border border-[#00aaff] py-3 font-semibold tracking-wide text-[#00aaff] transition-colors hover:bg-[#00aaff] hover:text-[#121212] disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<span className="relative z-10">{isPending ? "Création..." : "S’INSCRIRE"}</span>
					<span className="absolute inset-0 h-full w-full bg-[#00aaff]/10 blur-md" />
				</button>

				<div className="text-center">
					<Link to="/login" className="text-sm text-[#00aaff] underline">
						Déjà un compte ? Se connecter
					</Link>
				</div>
			</form>
		</div>
	);
}
