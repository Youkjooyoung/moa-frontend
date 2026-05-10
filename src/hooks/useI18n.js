import { translations } from "@/i18n/translations";
import { useLocaleStore } from "@/store/localeStore";

export function useI18n() {
  const { locale, setLocale, toggleLocale } = useLocaleStore();

  const t = (key, fallback = key) => {
    return translations[locale]?.[key] ?? translations.ko?.[key] ?? fallback;
  };

  return {
    locale,
    setLocale,
    toggleLocale,
    t,
  };
}
