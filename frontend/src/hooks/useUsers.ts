import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
	fetchUsers,
	deleteUserById,
	updateUser,
	createUser,
} from "../services/userService"
import type { User, UpdateUserInput, UserInput } from "../types/user"

/* ============================================================================
   🔹 Liste des utilisateurs
============================================================================ */

export function useUsers() {
	return useQuery<User[]>({
		queryKey: ["users"],
		queryFn: fetchUsers,
	})
}

/* ============================================================================
   🔹 Création d’un utilisateur
============================================================================ */

export function useCreateUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: UserInput) => createUser(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] })
		},
	})
}

/* ============================================================================
   🔹 Mise à jour d’un utilisateur
============================================================================ */

export function useUpdateUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
			updateUser(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] })
		},
	})
}

/* ============================================================================
   🔹 Suppression d’un utilisateur
============================================================================ */

export function useDeleteUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: deleteUserById,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] })
		},
	})
}