import { create } from "zustand";
import type { User } from "../types/user";

type Store = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};
export const useStore = create<Store>((set) => ({
  user: null,
  setUser: (user: User) => set(() => ({ user })),
  clearUser: () => set(() => ({ user: null })),
}));
