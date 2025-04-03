import { useSetAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import { authAtom } from "../store/authAtom";
import {
	loginUser,
	registerUser,
	sendResetLink,
	resetPassword,
	logout as logoutApi,
	fetchMe,
} from "../services/authService";
import type { User } from "../types/user";
import type { LoginPayload, RegisterPayload } from "../types/auth";

// 🔐 Hydrate l'état au démarrage
export function useAuthInit() {
	const setUser = useSetAtom(authAtom);
  
	return async () => {
	  try {
		const user = await fetchMe();
		
		if (user) {
		  setUser({
			...user,
			role: user.role,
		  });
		}
	  } catch {
		setUser(null);
	  }
	};
}

// 🔐 Login
export function useLoginMutation() {
	const setUser = useSetAtom(authAtom);

	return useMutation<User, Error, LoginPayload>({
		mutationFn: async (creds) => loginUser(creds.email, creds.password),
		onSuccess: (user) => {
		setUser(user); // Mise à jour de l'utilisateur dans l'état global

		// Si nécessaire, tu peux ici ajouter des vérifications supplémentaires pour les permissions
		// et les rôles, ou des logiques supplémentaires selon ton cas d'usage.
		},
	});
}
  
// 🆕 Register
export function useRegisterMutation() {
	const setUser = useSetAtom(authAtom);

	return useMutation<User, Error, RegisterPayload>({
		mutationFn: async (data) => registerUser(data),
		onSuccess: (user) => {
		setUser(user); // Mise à jour de l'utilisateur dans l'état global

		// Si tu as besoin de mettre à jour des permissions ou des rôles à ce stade, tu peux aussi le faire ici.
		},
	});
}

// 🚪 Logout
export function useLogout() {
	const setUser = useSetAtom(authAtom);

	return async () => {
		await logoutApi();
		setUser(null);
	};
}

// Reset Link
export function useSendResetLink() {
	return useMutation<string, Error, string>({
		mutationFn: sendResetLink,
	});
}

// Reset password
export function useResetPassword() {
	return useMutation<string, Error, { token: string; newPassword: string }>({
		mutationFn: ({ token, newPassword }) => resetPassword(token, newPassword),
	});
}