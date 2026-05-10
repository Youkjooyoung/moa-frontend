export const landingContent = {
  hero: {
    badgeKey: "landing.badge",
    titleKey: "landing.hero.title",
    descriptionKey: "landing.hero.description",
    primaryAction: { labelKey: "landing.hero.primary", href: "/party" },
    secondaryAction: { labelKey: "landing.hero.secondary", href: "/product" },
    metrics: [
      { labelKey: "landing.metric.saving", value: "75%" },
      { labelKey: "landing.metric.parties", value: "24+" },
      { labelKey: "landing.metric.flow", value: "Auto" },
    ],
  },
  sections: [
    {
      id: "products",
      type: "product-grid",
      titleKey: "landing.section.products",
      maxItems: 6,
    },
    {
      id: "parties",
      type: "party-grid",
      titleKey: "landing.section.parties",
      maxItems: 6,
    },
    {
      id: "cta",
      type: "cta",
      titleKey: "landing.cta.title",
      descriptionKey: "landing.cta.description",
      action: { labelKey: "landing.cta.button", href: "/signup" },
    },
  ],
};
