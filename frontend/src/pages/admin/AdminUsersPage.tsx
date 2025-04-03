import { useState } from "react";
import { useUsers, useDeleteUser } from "../../hooks/useUsers";
import { ConfirmDialog } from "../../components/common/Confirm-dialog";
import UsersTable from "../../components/admin/users/UsersTable";
import UserFormModal from "../../components/admin/users/UserFormModal";
import type { User } from "../../types/user";
import { Button } from "../../components/ui";
import { Plus } from "lucide-react";

export default function AdminUsersPage() {
	const { data: users = [], isLoading } = useUsers();
	const deleteUser = useDeleteUser();

	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
	const [selectedUser, setSelectedUser] = useState<User | null | undefined>(undefined);

	// Regrouper les utilisateurs par nom de rôle
	const groupedUsers = users.reduce<Record<string, User[]>>((acc, user) => {
		const role = user.role?.name || "inconnu";
		if (!acc[role]) acc[role] = [];
		acc[role].push(user);
		return acc;
	}, {});

	// Optionnel : ordonner les rôles (superadmin > admin > dev > user > autres)
	const roleOrder = ["superadmin", "admin", "dev", "user"];

	const sortedRoles = Object.keys(groupedUsers).sort((a, b) => {
		const indexA = roleOrder.indexOf(a);
		const indexB = roleOrder.indexOf(b);
		if (indexA === -1 && indexB === -1) return a.localeCompare(b);
		if (indexA === -1) return 1;
		if (indexB === -1) return -1;
		return indexA - indexB;
	});

	return (
		<div className="p-6 space-y-12">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-white">Gestion des utilisateurs</h1>
				<Button variant="neon" onClick={() => setSelectedUser(null)}>
					<Plus className="w-4 h-4 mr-1" />
					Ajouter un utilisateur
				</Button>
			</div>

			{isLoading ? (
				<p className="text-gray-400">Chargement des utilisateurs...</p>
			) : (
				sortedRoles.map((role) => (
					<UsersTable
						key={role}
						title={`Utilisateurs ${role}`}
						users={groupedUsers[role]}
						onDelete={setConfirmDeleteId}
						onEdit={(user) => setSelectedUser(user)}
					/>
				))
			)}

			{selectedUser !== undefined && (
				<UserFormModal user={selectedUser} onClose={() => setSelectedUser(undefined)} />
			)}

			{confirmDeleteId && (
				<ConfirmDialog
					title="Confirmation de suppression"
					description="Souhaitez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible."
					onCancel={() => setConfirmDeleteId(null)}
					onConfirm={async () => {
						await deleteUser.mutateAsync(confirmDeleteId);
						setConfirmDeleteId(null);
					}}
				/>
			)}
		</div>
	);
}
