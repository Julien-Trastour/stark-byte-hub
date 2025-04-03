import type { Role, Permission } from "../types/role";

const BASE_URL = import.meta.env.VITE_API_URL;

async function api<T = unknown>(
	endpoint: string,
	options?: RequestInit,
	parseJson = true
): Promise<T> {
	const res = await fetch(`${BASE_URL}${endpoint}`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...(options?.headers || {}),
		},
		...options,
	});

	const data = parseJson ? await res.json() : null;

	if (!res.ok) {
		throw new Error(data?.error || "Erreur inconnue");
	}

	return data as T;
}

/* ============================================================================
 * RÔLES
 * ============================================================================
 */

export async function fetchRoles(): Promise<Role[]> {
	const roles = await api<Role[]>("/roles");
	console.debug("[SERVICE] roles fetched:", roles);
	return roles;
}

export async function createRole(input: {
	name: string;
	permissions: string[]; // permission names
}): Promise<Role> {
	return await api<Role>("/roles", {
		method: "POST",
		body: JSON.stringify(input),
	});
}

export async function updateRole(
	id: string,
	updates: { name?: string; permissions?: string[] }
): Promise<Role> {
	return await api<Role>(`/roles/${id}`, {
		method: "PATCH",
		body: JSON.stringify(updates),
	});
}

export async function deleteRole(id: string): Promise<void> {
	await api(`/roles/${id}`, { method: "DELETE" }, false);
}

/* ============================================================================
 * PERMISSIONS
 * ============================================================================
 */

export async function fetchPermissions(): Promise<Permission[]> {
	const permissions = await api<Permission[]>("/permissions");
	console.debug("[SERVICE] permissions fetched:", permissions);
	return permissions;
}

export async function createPermission(input: { name: string }): Promise<Permission> {
	return await api<Permission>("/permissions", {
		method: "POST",
		body: JSON.stringify(input),
	});
}

export async function deletePermission(id: string): Promise<void> {
	await api(`/permissions/${id}`, { method: "DELETE" }, false);
}
