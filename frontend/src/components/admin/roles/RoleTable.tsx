import { Pencil, Trash2 } from "lucide-react"
import type { Role } from "../../../types/role"

type Props = {
	roles: Role[]
	onEdit: (role: Role) => void
	onDelete?: (role: Role) => void
}

export default function RoleTable({ roles, onEdit, onDelete }: Props) {
	return (
		<div className="overflow-auto rounded-xl border border-[#2a2a2a] bg-[#1e1e1e]">
			<table className="w-full text-sm text-left rounded-xl overflow-hidden">
				<thead className="bg-[#2a2a2a] text-white">
					<tr>
						<th className="px-4 py-3">Nom</th>
						<th className="px-4 py-3">Permissions</th>
						<th className="px-4 py-3 text-right">Actions</th>
					</tr>
				</thead>
				<tbody className="text-white divide-y divide-[#2a2a2a]">
					{roles.map((role) => {
						const hasAllPermissions = role.permissions.some(
							(p) => (typeof p === "string" && p === "*") || (typeof p === "object" && p.name === "*")
						)

						const permissionLabels = role.permissions
							.map((p) => (typeof p === "string" ? p : p.name))
							.join(", ")

						return (
							<tr key={role.id} className="hover:bg-[#242424] transition-colors">
								<td className="px-4 py-3 font-medium">{role.name}</td>
								<td className="px-4 py-3 text-sm text-gray-300">
									{hasAllPermissions ? (
										<span className="text-green-400 italic">Toutes les permissions</span>
									) : role.permissions.length > 0 ? (
										<span className="text-gray-400">{permissionLabels}</span>
									) : (
										<span className="text-gray-500 italic">Aucune</span>
									)}
								</td>
								<td className="px-4 py-3">
									<div className="flex justify-end gap-2">
										<button
											type="button"
											onClick={() => onEdit(role)}
											title="Modifier"
											className="text-blue-400 hover:text-blue-300"
										>
											<Pencil size={16} />
										</button>
										{onDelete && (
											<button
												type="button"
												onClick={() => onDelete(role)}
												title="Supprimer"
												className="text-red-400 hover:text-red-300"
											>
												<Trash2 size={16} />
											</button>
										)}
									</div>
								</td>
							</tr>
						)
					})}

					{roles.length === 0 && (
						<tr>
							<td colSpan={3} className="px-4 py-4 text-center text-gray-500">
								Aucun rôle trouvé.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
