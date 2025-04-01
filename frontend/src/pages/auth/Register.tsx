import { useState } from "react";
import { useSetAtom } from "jotai";
import { useNavigate, Link } from "react-router";
import { registerAtom } from "../../store/authAtom";

export default function Register() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [address, setAddress] = useState("");
	const [address2, setAddress2] = useState("");
	const [zipCode, setZipCode] = useState("");
	const [city, setCity] = useState("");
	const [country, setCountry] = useState("");
	const [error, setError] = useState("");

	const navigate = useNavigate();
	const register = useSetAtom(registerAtom);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");

		try {
			await register({
				firstName,
				lastName,
				email,
				password,
				address,
				address2,
				zipCode,
				city,
				country,
			});
			navigate("/");
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Erreur inconnue");
			}
		}
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
						{error}
					</div>
				)}

				<div className="grid grid-cols-2 gap-4">
					<input
						type="text"
						placeholder="Prénom"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						required
						className="rounded-md border border-[#444444] bg-[#333333] px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-[#00aaff]"
					/>

					<input
						type="text"
						placeholder="Nom"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						required
						className="rounded-md border border-[#444444] bg-[#333333] px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-[#00aaff]"
					/>
				</div>

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

				<input
					type="text"
					placeholder="Adresse"
					value={address}
					onChange={(e) => setAddress(e.target.value)}
					className="w-full rounded-md border border-[#444444] bg-[#333333] px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-[#00aaff]"
				/>

				<input
					type="text"
					placeholder="Complément d’adresse"
					value={address2}
					onChange={(e) => setAddress2(e.target.value)}
					className="w-full rounded-md border border-[#444444] bg-[#333333] px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-[#00aaff]"
				/>

				<div className="grid grid-cols-2 gap-4">
					<input
						type="text"
						placeholder="Code postal"
						value={zipCode}
						onChange={(e) => setZipCode(e.target.value)}
						className="rounded-md border border-[#444444] bg-[#333333] px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-[#00aaff]"
					/>

					<input
						type="text"
						placeholder="Ville"
						value={city}
						onChange={(e) => setCity(e.target.value)}
						className="rounded-md border border-[#444444] bg-[#333333] px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-[#00aaff]"
					/>
				</div>

				<input
					type="text"
					placeholder="Pays"
					value={country}
					onChange={(e) => setCountry(e.target.value)}
					className="w-full rounded-md border border-[#444444] bg-[#333333] px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-[#00aaff]"
				/>

				<button
					type="submit"
					className="group relative w-full overflow-hidden rounded-md border border-[#00aaff] py-3 font-semibold tracking-wide text-[#00aaff] transition-colors hover:bg-[#00aaff] hover:text-[#121212]"
				>
					<span className="relative z-10">S’INSCRIRE</span>
					<span className="absolute inset-0 h-full w-full bg-[#00aaff]/10 blur-md"></span>
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
