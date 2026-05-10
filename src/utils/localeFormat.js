const localeMap = {
  ko: "ko-KR",
  en: "en-US",
};

export const toIntlLocale = (locale = "ko") => localeMap[locale] || localeMap.ko;

export const formatLocalizedCurrency = (value, locale = "ko") => {
  const amount = Number(value || 0);
  const intlLocale = toIntlLocale(locale);

  if (locale === "en") {
    return new Intl.NumberFormat(intlLocale, {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return `${new Intl.NumberFormat(intlLocale).format(amount)}원`;
};

export const formatLocalizedDate = (value, locale = "ko") => {
  if (!value) return "";
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
};
