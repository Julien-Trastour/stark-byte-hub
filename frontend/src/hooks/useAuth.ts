import { useAtomValue, useSetAtom } from "jotai"
import { authAtom, logoutAtom } from "../store/authAtom"

export function useAuth() {
	const user = useAtomValue(authAtom)
	const logout = useSetAtom(logoutAtom)

	return {
		user,
		isAuthenticated: !!user,
		roleName: user?.role?.name ?? null,
		logout,
	}
}
