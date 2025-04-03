import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	fetchRoles,
	createRole,
	updateRole,
	deleteRole,
	fetchPermissions,
	createPermission,
	deletePermission,
} from "../services/roleService";
import type { Role, Permission } from "../types/role";

// 🔹 Récupération des rôles
export function useRoles() {
	return useQuery<Role[]>({
		queryKey: ["roles"],
		queryFn: fetchRoles,
	});
}

// 🔹 Récupération des permissions
export function usePermissions() {
	return useQuery<Permission[]>({
		queryKey: ["permissions"],
		queryFn: fetchPermissions,
	});
}

// 🔹 Création de rôle
export function useCreateRole() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createRole,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["roles"] });
		},
	});
}

// 🔹 Mise à jour de rôle
export function useUpdateRole() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: { name?: string; permissions?: string[] } }) =>
			updateRole(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["roles"] });
		},
	});
}

// 🔹 Suppression de rôle
export function useDeleteRole() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteRole,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["roles"] });
		},
	});
}

// 🔹 Création de permission
export function useCreatePermission() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createPermission,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["permissions"] });
		},
	});
}

// 🔹 Suppression de permission
export function useDeletePermission() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deletePermission,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["permissions"] });
		},
	});
}
