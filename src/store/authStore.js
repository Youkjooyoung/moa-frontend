import { create } from "zustand";
import httpClient from "@/api/httpClient";
import { useLoginStore } from "./user/loginStore";
import { useOtpStore } from "./user/otpStore";

const PASSWORD_STORAGE_KEYS = [
  "login-password",
  "password",
  "pwd",
  "user-password",
  "pwd-remember",
];

export const purgeLoginPasswords = () => {
  [localStorage, sessionStorage].forEach((storage) => {
    PASSWORD_STORAGE_KEYS.forEach((key) => {
      try {
        storage.removeItem(key);
      } catch {
        // Storage can be unavailable in privacy modes.
      }
    });
  });

  try {
    useLoginStore.getState().setField("password", "");
    useLoginStore.getState().setField("otpCode", "");
  } catch {
    // The login store may not be initialized yet.
  }
};

try {
  localStorage.removeItem("auth-storage");
} catch {
  // Legacy token cleanup is best effort.
}

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  accessTokenExpiresIn: null,
  loading: false,
  initialized: false,

  setTokens: ({ accessToken, accessTokenExpiresIn }) => {
    set({
      accessToken: accessToken || null,
      accessTokenExpiresIn: Number(accessTokenExpiresIn) || null,
    });
  },

  setUser: (user) => set({ user }),

  clearAuth: () => {
    set({
      user: null,
      accessToken: null,
      accessTokenExpiresIn: null,
      loading: false,
      initialized: true,
    });
  },

  fetchSession: async () => {
    if (get().loading) return;
    set({ loading: true });

    try {
      const res = await httpClient.get("/users/me");
      if (res?.success && res.data) {
        set({ user: res.data });
        useOtpStore.getState().setEnabled(!!res.data.otpEnabled);
        return res.data;
      }
      get().clearAuth();
      return null;
    } catch {
      get().clearAuth();
      return null;
    } finally {
      set({ loading: false, initialized: true });
    }
  },

  logout: async () => {
    try {
      await httpClient.post("/auth/logout");
    } finally {
      purgeLoginPasswords();
      get().clearAuth();
    }
  },
}));
