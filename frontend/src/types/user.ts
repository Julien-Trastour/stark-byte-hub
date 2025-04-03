export type Permission = {
	id: string
	name: string
}

export type Role = {
	id: string
	name: string
	permissions: Permission[]
}

export type User = {
	id: string
	email: string
	firstName: string
	lastName: string
	address?: string
	address2?: string
	zipCode?: string
	city?: string
	country?: string
	avatarUrl?: string
	role: Role
	createdAt: string
	updatedAt?: string
}

/* ============================================================================
   🔹 Utilisé pour la création (côté admin) : tous les champs requis + password
============================================================================ */
export type UserInput = {
	firstName: string
	lastName: string
	email: string
	roleId: string
	password?: string
}

/* ============================================================================
   🔹 Utilisé pour la mise à jour (tous les champs facultatifs)
============================================================================ */
export type UpdateUserInput = Partial<UserInput>
