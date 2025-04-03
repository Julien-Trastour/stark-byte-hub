import { useState } from "react";
import { ShieldCheck, Plus } from "lucide-react";
import { usePermissions } from "../../hooks/useRoles";
import PermissionTable from "../../components/admin/roles/PermissionTable";
import PermissionModal from "../../components/admin/roles/PermissionModal";
import { Button, Input } from "../../components/ui";
import type { Permission } from "../../types/role";

export default function AdminPermissionsPage() {
	const [showModal, setShowModal] = useState(false);
	const [search, setSearch] = useState("");

	const { data: permissions = [], isLoading, error } = usePermissions();

	const filteredPermissions = permissions.filter((perm: Permission) =>
		perm.name.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div className="p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-white flex items-center gap-2">
					<ShieldCheck size={24} />
					Gestion des permissions
				</h1>
				<Button variant="neon" onClick={() => setShowModal(true)}>
					<Plus className="w-4 h-4 mr-2" />
					Nouvelle permission
				</Button>
			</div>

			{/* Barre de recherche */}
			<Input
				placeholder="Rechercher une permission..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="mb-4 w-full max-w-md"
			/>

			{/* Tableau */}
			{isLoading ? (
				<p className="text-gray-400">Chargement des permissions...</p>
			) : error ? (
				<p className="text-red-400">Erreur lors du chargement.</p>
			) : (
				<PermissionTable permissions={filteredPermissions} />
			)}

			{/* Modal */}
			{showModal && <PermissionModal onClose={() => setShowModal(false)} />}
		</div>
	);
}
