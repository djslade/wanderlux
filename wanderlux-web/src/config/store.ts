import { create } from "zustand";
import type { User } from "../types/user";

type Store = {
  user: User | null;
  fetched: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setFetched: () => void;
};
export const useStore = create<Store>((set) => ({
  user: null,
  fetched: false,
  setUser: (user: User) => set(() => ({ user })),
  clearUser: () => set(() => ({ user: null })),
  setFetched: () => set(() => ({ fetched: true })),
}));
