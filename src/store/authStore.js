import { create } from "zustand";
import httpClient from "@/api/httpClient";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  fetchSession: async () => {
    try {
      const res = await httpClient.get("/users/me");
      if (res.success) {
        set({ user: res.data, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch {
      set({ user: null, loading: false });
    }
  },

  logout: async () => {
    await httpClient.post("/logout");
    set({ user: null });
  }
}));
