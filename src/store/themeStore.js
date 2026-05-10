import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const normalizeTheme = (theme) => {
  if (theme === "dark" || theme === "system") return theme;
  return "light";
};

const resolveTheme = (theme, systemTheme) => {
  if (theme === "system") return systemTheme;
  return normalizeTheme(theme);
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: "light",
      systemTheme: "light",
      resolvedTheme: "light",

      setTheme: (theme) => {
        const nextTheme = normalizeTheme(theme);
        const resolvedTheme = resolveTheme(nextTheme, get().systemTheme);
        set({ theme: nextTheme, resolvedTheme });
        localStorage.setItem("partyListTheme", nextTheme);
      },

      setSystemTheme: (systemTheme) => {
        const nextSystemTheme = systemTheme === "dark" ? "dark" : "light";
        set({
          systemTheme: nextSystemTheme,
          resolvedTheme: resolveTheme(get().theme, nextSystemTheme),
        });
      },

      toggleTheme: () => {
        const nextTheme = get().resolvedTheme === "dark" ? "light" : "dark";
        get().setTheme(nextTheme);
      },

      cycleTheme: () => {
        const themes = ["light", "dark", "system"];
        const currentIndex = themes.indexOf(get().theme);
        get().setTheme(themes[(currentIndex + 1) % themes.length]);
      },

      getTheme: () => get().theme,
      getResolvedTheme: () => get().resolvedTheme,
    }),
    {
      name: "app-theme-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.theme = normalizeTheme(state.theme);
        state.resolvedTheme = resolveTheme(state.theme, state.systemTheme || "light");
      },
    }
  )
);
