import { useEffect, useState } from "react";
import { useCreatePermission } from "../../../hooks/useRoles";
import { Dialog, Input, Label, Button } from "../../ui";

type Props = {
	onClose: () => void;
};

export default function PermissionModal({ onClose }: Props) {
	const [name, setName] = useState("");
	const createPermission = useCreatePermission();

	// Réinitialise le champ à l’ouverture
	useEffect(() => {
		setName("");
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || createPermission.isPending) return;

		createPermission.mutate(
			{ name },
			{
				onSuccess: () => {
					onClose();
				},
			}
		);
	};

	return (
		<Dialog onClose={onClose}>
			<div className="w-full max-w-md bg-[#1e1e1e] p-6 rounded-lg border-l-4 border-[#00aaff]/30 shadow-lg shadow-[#00aaff]/10 relative">
				{/* Bouton de fermeture */}
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg"
					aria-label="Fermer"
				>
					✕
				</button>

				<h2 className="text-xl font-semibold text-white mb-4">Ajouter une permission</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="name">Nom de la permission</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="ex: view_users"
							autoFocus
							required
						/>
					</div>

					<div className="flex justify-end gap-3 pt-4">
						<Button type="button" variant="outline" onClick={onClose}>
							Annuler
						</Button>
						<Button type="submit" variant="neon" disabled={createPermission.isPending}>
							Créer
						</Button>
					</div>
				</form>
			</div>
		</Dialog>
	);
}
