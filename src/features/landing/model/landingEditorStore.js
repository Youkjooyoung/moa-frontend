import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const defaultLocaleContent = {
  ko: {
    badge: "",
    title: "",
    description: "",
    primaryLabel: "",
    secondaryLabel: "",
    ctaTitle: "",
    ctaDescription: "",
    ctaButton: "",
  },
  en: {
    badge: "",
    title: "",
    description: "",
    primaryLabel: "",
    secondaryLabel: "",
    ctaTitle: "",
    ctaDescription: "",
    ctaButton: "",
  },
};

const defaultEditorState = {
  localeContent: defaultLocaleContent,
  metricValues: ["75%", "24+", "Auto"],
  productMaxItems: 6,
  partyMaxItems: 6,
  publishedAt: null,
};

export const useLandingEditorStore = create(
  persist(
    (set) => ({
      ...defaultEditorState,
      updateLocaleContent: (locale, patch) =>
        set((state) => ({
          localeContent: {
            ...state.localeContent,
            [locale]: {
              ...(state.localeContent[locale] || {}),
              ...patch,
            },
          },
        })),
      updateMetricValue: (index, value) =>
        set((state) => ({
          metricValues: state.metricValues.map((item, itemIndex) =>
            itemIndex === index ? value : item
          ),
        })),
      updateSectionLimit: (key, value) =>
        set({
          [key]: Number(value) > 0 ? Number(value) : 1,
        }),
      publish: () => set({ publishedAt: new Date().toISOString() }),
      reset: () => set(defaultEditorState),
    }),
    {
      name: "moa-landing-editor-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        localeContent: state.localeContent,
        metricValues: state.metricValues,
        productMaxItems: state.productMaxItems,
        partyMaxItems: state.partyMaxItems,
        publishedAt: state.publishedAt,
      }),
    }
  )
);
