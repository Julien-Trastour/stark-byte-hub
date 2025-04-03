import { useEffect, useState } from "react"
import type { Role, Permission } from "../../../types/role"
import {
	useCreateRole,
	useUpdateRole,
	usePermissions,
} from "../../../hooks/useRoles"
import { Input, Label, Button, Checkbox, Dialog } from "../../ui"

type Props = {
	role: Role | null
	onClose: () => void
}

export default function RoleFormModal({ role, onClose }: Props) {
	const isEdit = !!role
	const [name, setName] = useState("")
	const [permissions, setPermissions] = useState<string[]>([])

	const createRole = useCreateRole()
	const updateRole = useUpdateRole()
	const { data: availablePermissions = [], isLoading } = usePermissions()

	// Réinitialise les champs à chaque ouverture
	useEffect(() => {
		if (role) {
			setName(role.name)
			setPermissions(role.permissions.map((p) => p.name))
		} else {
			setName("")
			setPermissions([])
		}
	}, [role])

	const togglePermission = (permName: string) => {
		setPermissions((prev) =>
			prev.includes(permName)
				? prev.filter((p) => p !== permName)
				: [...prev, permName]
		)
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (isEdit) {
			updateRole.mutate({ id: role.id, data: { name, permissions } })
		} else {
			createRole.mutate({ name, permissions })
		}
		onClose()
	}

	return (
		<Dialog onClose={onClose}>
			<div className="w-full max-w-3xl rounded-lg border-l-4 border-[#00aaff]/30 bg-[#1e1e1e] p-8 shadow-lg shadow-[#00aaff]/10 relative">
				{/* Bouton de fermeture */}
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg"
					aria-label="Fermer"
				>
					✕
				</button>

				<h2 className="text-2xl font-bold mb-6 text-white">
					{isEdit ? "Modifier un rôle" : "Créer un nouveau rôle"}
				</h2>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<Label htmlFor="name">Nom du rôle</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>

					<div>
						<Label>Permissions</Label>

						{isLoading ? (
							<p className="text-sm text-gray-400 mt-2">Chargement des permissions...</p>
						) : (
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
								{availablePermissions.map((perm: Permission) => (
									<Checkbox
										key={perm.id}
										label={perm.name}
										checked={permissions.includes(perm.name)}
										onChange={() => togglePermission(perm.name)}
									/>
								))}
							</div>
						)}
					</div>

					<div className="flex justify-end gap-3 pt-4">
						<Button type="button" variant="outline" onClick={onClose}>
							Annuler
						</Button>
						<Button type="submit" variant="neon">
							{isEdit ? "Mettre à jour" : "Créer"}
						</Button>
					</div>
				</form>
			</div>
		</Dialog>
	)
}
