import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: {},
  setUser: (user) => set((state) => ({ ...state, user })),
}));

export default useAuthStore;