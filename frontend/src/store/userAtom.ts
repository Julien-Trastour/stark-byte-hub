import { atom } from "jotai"
import { fetchUsers, updateUser, deleteUser } from "../services/userService"
import type { User } from "../types/user"

// 🧠 Liste globale des utilisateurs (chargée côté admin uniquement)
export const usersAtom = atom<User[]>([])

// 🔄 Action pour recharger les utilisateurs
export const fetchUsersAtom = atom(null, async (_, set) => {
	const users = await fetchUsers()
	set(usersAtom, users)
})

// ✏️ Action pour mettre à jour un utilisateur
export const updateUserAtom = atom(null, async (get, set, { id, data }: { id: string; data: Partial<User> }) => {
	await updateUser(id, data)
	const updatedList = get(usersAtom).map((user) =>
		user.id === id ? { ...user, ...data } : user
	)
	set(usersAtom, updatedList)
})

// ❌ Action pour supprimer un utilisateur
export const deleteUserAtom = atom(null, async (get, set, id: string) => {
	await deleteUser(id)
	const updatedList = get(usersAtom).filter((user) => user.id !== id)
	set(usersAtom, updatedList)
})
