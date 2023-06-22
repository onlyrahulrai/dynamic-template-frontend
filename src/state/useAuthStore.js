import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set((state) => ({ ...state, user })),
}));

export default useAuthStore;