import { Trash2 } from "lucide-react";
import type { Permission } from "../../../types/role";
import { useDeletePermission } from "../../../hooks/useRoles";

type Props = {
	permissions: Permission[];
};

export default function PermissionTable({ permissions }: Props) {
	const deletePermission = useDeletePermission();

	return (
		<div className="overflow-auto rounded-xl border border-[#2a2a2a] bg-[#1e1e1e]">
			<table className="w-full text-sm text-left rounded-xl overflow-hidden">
				<thead className="bg-[#2a2a2a] text-white">
					<tr>
						<th className="px-4 py-3">Nom</th>
						<th className="px-4 py-3 text-right">Actions</th>
					</tr>
				</thead>
				<tbody className="text-white divide-y divide-[#2a2a2a]">
					{permissions.map((perm) => (
						<tr key={perm.id} className="hover:bg-[#242424] transition-colors">
							<td className="px-4 py-3 font-medium">{perm.name}</td>
							<td className="px-4 py-3">
								<div className="flex justify-end">
									<button
										type="button"
										onClick={() => deletePermission.mutate(perm.id)}
										title="Supprimer"
										className="text-red-400 hover:text-red-300"
									>
										<Trash2 size={16} />
									</button>
								</div>
							</td>
						</tr>
					))}

					{permissions.length === 0 && (
						<tr>
							<td colSpan={2} className="px-4 py-4 text-center text-gray-500">
								Aucune permission définie.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
