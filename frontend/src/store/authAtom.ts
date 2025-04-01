import { atom } from "jotai";
import {
	fetchMe,
	loginUser,
	registerUser,
	logout as logoutApi,
} from "../services/authService";
import type { User } from "../types/user";

// 1. État global de l'utilisateur
export const authAtom = atom<User | null>(null);

// 2. Action : recharger depuis le backend
export const fetchUserAtom = atom(null, async (_, set) => {
	try {
		const user = await fetchMe();
		set(authAtom, user);
	} catch {
		set(authAtom, null);
	}
});

// 3. Action : login (et hydrate le store)
export const loginAtom = atom(null, async (_, set, { email, password }: { email: string; password: string }) => {
	const user = await loginUser(email, password);
	set(authAtom, user);
});

// 4. Action : register (et hydrate le store)
export const registerAtom = atom(
	null,
	async (_, set, newUser: {
		firstName: string;
		lastName: string;
		email: string;
		password: string;
		address?: string;
		address2?: string;
		zipCode?: string;
		city?: string;
		country?: string;
	}) => {
		const user = await registerUser(newUser);
		set(authAtom, user);
	}
);

// 5. Action : logout
export const logoutAtom = atom(null, async (_, set) => {
	await logoutApi();
	set(authAtom, null);
});
