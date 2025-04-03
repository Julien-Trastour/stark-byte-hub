import { useState } from "react";
import { ShieldPlus } from "lucide-react";
import { useRoles } from "../../hooks/useRoles";
import RoleTable from "../../components/admin/roles/RoleTable";
import RoleFormModal from "../../components/admin/roles/RoleFormModal";
import type { Role } from "../../types/role";
import { Button, Input } from "../../components/ui";

export default function AdminRolesPage() {
	const [showModal, setShowModal] = useState(false);
	const [selectedRole, setSelectedRole] = useState<Role | null>(null);
	const [search, setSearch] = useState("");

	const { data: roles = [], isLoading, error } = useRoles();

	const handleCreate = () => {
		setSelectedRole(null);
		setShowModal(true);
	};

	const handleEdit = (role: Role) => {
		setSelectedRole(role);
		setShowModal(true);
	};

	const filteredRoles = roles.filter((role) =>
		role.name.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div className="p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-white flex items-center gap-2">
					<ShieldPlus size={24} /> Gestion des rôles
				</h1>
				<Button variant="neon" onClick={handleCreate}>
					<ShieldPlus size={16} /> Nouveau rôle
				</Button>
			</div>

			{/* Barre de recherche */}
			<Input
				placeholder="Rechercher un rôle par nom..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="mb-4 w-full max-w-md"
			/>

			{/* Tableau */}
			{isLoading ? (
				<p className="text-gray-400">Chargement des rôles...</p>
			) : error ? (
				<p className="text-red-400">Erreur lors du chargement.</p>
			) : (
				<RoleTable roles={filteredRoles} onEdit={handleEdit} />
			)}

			{/* Modal */}
			{showModal && (
				<RoleFormModal
					role={selectedRole}
					onClose={() => {
						setShowModal(false);
						setSelectedRole(null);
					}}
				/>
			)}
		</div>
	);
}
