import { atom } from "jotai";
import type { User } from "../types/user";

export const authAtom = atom<User | null>(null);
