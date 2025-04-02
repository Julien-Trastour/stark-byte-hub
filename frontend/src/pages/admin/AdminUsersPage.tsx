import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { fetchUsersAtom, usersAtom } from "../../store/userAtom";
import type { User } from "../../types/user";
import { Pencil, Trash } from "lucide-react";
import { Button } from "../../components/ui";
import { ConfirmDialog } from "../../components/common/Confirm-dialog";

export default function AdminUsersPage() {
	const users = useAtomValue(usersAtom);
	const fetchUsers = useSetAtom(fetchUsersAtom);
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	const standardUsers = users.filter(u => u.role?.name === "user");
	const adminUsers = users.filter(u => u.role?.name === "admin" || u.role?.name === "superadmin");

	return (
		<div className="p-6 space-y-12">
			<h1 className="text-2xl font-bold text-white">Gestion des utilisateurs</h1>

			{/* Clients */}
			<UserTable title="Utilisateurs clients" users={standardUsers} onDelete={setConfirmDeleteId} />

			{/* Employés */}
			<UserTable title="Utilisateurs employés" users={adminUsers} onDelete={setConfirmDeleteId} />

			{/* Dialog de confirmation */}
			{confirmDeleteId && (
				<ConfirmDialog
					title="Confirmation de suppression"
					description="Souhaitez-vous vraiment supprimer cet utilisateur ?"
					onCancel={() => setConfirmDeleteId(null)}
					onConfirm={() => {
						// TODO: call delete + fetch again
						setConfirmDeleteId(null);
					}}
				/>
			)}
		</div>
	);
}

function UserTable({
	title,
	users,
	onDelete,
}: {
	title: string;
	users: User[];
	onDelete: (id: string) => void;
}) {
	if (users.length === 0) return null;

	return (
		<section className="space-y-4">
			<h2 className="text-xl font-semibold text-[#00aaff]">{title}</h2>
			<div className="overflow-x-auto rounded-xl border border-[#2a2a2a]">
				<table className="w-full text-sm text-white">
					<thead className="bg-[#2a2a2a] text-left text-gray-300">
						<tr>
							<th className="px-4 py-2">Nom</th>
							<th className="px-4 py-2">Email</th>
							<th className="px-4 py-2">Rôle</th>
							<th className="px-4 py-2">Créé le</th>
							<th className="px-4 py-2 text-right">Actions</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user.id} className="border-t border-[#2a2a2a] hover:bg-[#ffffff05]">
								<td className="px-4 py-2">{user.firstName} {user.lastName}</td>
								<td className="px-4 py-2 text-gray-300">{user.email}</td>
								<td className="px-4 py-2 capitalize">{user.role?.name}</td>
								<td className="px-4 py-2 text-gray-400">{new Date(user.createdAt).toLocaleDateString("fr-FR")}</td>
								<td className="px-4 py-2 text-right">
									<div className="flex justify-end gap-2">
										<Button size="sm" variant="outline" className="text-[#00aaff] border-[#00aaff]/40">
											<Pencil size={14} className="mr-1" />
											Modifier
										</Button>
										<Button
											size="sm"
											variant="outline"
											className="text-red-400 border-red-400/40"
											onClick={() => onDelete(user.id)}
										>
											<Trash size={14} className="mr-1" />
											Supprimer
										</Button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
}
