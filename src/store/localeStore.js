import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const supportedLocales = ["ko", "en"];

const normalizeLocale = (locale) => (supportedLocales.includes(locale) ? locale : "ko");

export const useLocaleStore = create(
  persist(
    (set, get) => ({
      locale: "ko",

      setLocale: (locale) => set({ locale: normalizeLocale(locale) }),

      toggleLocale: () => {
        const nextLocale = get().locale === "ko" ? "en" : "ko";
        set({ locale: nextLocale });
      },
    }),
    {
      name: "app-locale-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ locale: state.locale }),
      onRehydrateStorage: () => (state) => {
        if (state) state.locale = normalizeLocale(state.locale);
      },
    }
  )
);
