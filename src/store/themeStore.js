import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Theme Store with localStorage persistence
export const useThemeStore = create(
  persist(
    (set, get) => ({
      // Current theme: 'classic' | 'dark' | 'pop' | 'portrait' | 'christmas'
      theme: "christmas",

      // Set theme
      setTheme: (theme) => {
        set({ theme });
        // Also update legacy localStorage key for backward compatibility
        localStorage.setItem("partyListTheme", theme);
      },

      // Get current theme
      getTheme: () => get().theme,

      // Cycle through themes
      cycleTheme: () => {
        const themes = ["classic", "dark", "pop", "portrait", "christmas"];
        const currentIndex = themes.indexOf(get().theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        get().setTheme(themes[nextIndex]);
      },
    }),
    {
      name: "app-theme-storage",
      storage: createJSONStorage(() => localStorage),
      // Force christmas theme on rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Force set to christmas theme
          state.theme = "christmas";
          localStorage.setItem("partyListTheme", "christmas");
        }
      },
    }
  )
);
