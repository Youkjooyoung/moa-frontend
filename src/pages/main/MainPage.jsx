import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { landingContent } from "@/features/landing/config/landingContent";
import { useI18n } from "@/hooks/useI18n";
import { useLandingEditorStore } from "@/features/landing/model/landingEditorStore";
import { useMainStore } from "@/store/main/mainStore";
import { getProductIconUrl } from "@/utils/imageUtils";
import { formatLocalizedCurrency } from "@/utils/localeFormat";

const serviceFallbacks = ["Netflix", "Disney+", "YouTube", "Wavve", "TVING", "ChatGPT"];

const getProductName = (product, index) =>
  product?.productName ||
  product?.name ||
  product?.subscriptionName ||
  serviceFallbacks[index % serviceFallbacks.length];

const getProductPrice = (product) =>
  product?.price || product?.productPrice || product?.monthlyPrice || product?.basePrice || 0;

const getPartyName = (party, index) =>
  party?.partyName ||
  party?.productName ||
  party?.subscriptionName ||
  party?.serviceName ||
  `${serviceFallbacks[index % serviceFallbacks.length]} Party`;

const getPartyPrice = (party) =>
  party?.sharePrice || party?.partyPrice || party?.price || party?.monthlyPrice || 0;

function HeroMetric({ metric, t, value }) {
  return (
    <div className="rounded-[var(--theme-radius)] border border-[var(--theme-border-light)] bg-[var(--theme-surface)] px-5 py-4 shadow-[var(--theme-shadow-soft)]">
      <p className="text-2xl font-bold tracking-tight text-[var(--theme-text)]">{value || metric.value}</p>
      <p className="mt-1 text-sm font-medium text-[var(--theme-text-muted)]">{t(metric.labelKey)}</p>
    </div>
  );
}

function ProductCard({ product, index, locale }) {
  const name = getProductName(product, index);
  const imagePath =
    product?.productImage ||
    product?.productLogo ||
    product?.logoImage ||
    product?.imageUrl ||
    product?.logoUrl;
  const imageUrl = getProductIconUrl(imagePath);

  return (
    <Link
      to={product?.productId ? `/product/${product.productId}` : "/product"}
      className="group rounded-[var(--theme-radius)] border border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] p-5 shadow-[var(--theme-shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--theme-shadow-hover)]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--theme-primary-light)] text-sm font-bold text-[var(--theme-primary)]">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-8 w-8 rounded-xl object-contain" />
          ) : (
            name.slice(0, 2).toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-[var(--theme-text)]">{name}</p>
          <p className="mt-1 text-sm font-medium text-[var(--theme-text-muted)]">
            {formatLocalizedCurrency(getProductPrice(product), locale)}
          </p>
        </div>
      </div>
    </Link>
  );
}

function PartyCard({ party, index, locale }) {
  const currentMembers = party?.currentMembers || party?.memberCount || party?.joinedCount || 1;
  const maxMembers = party?.maxMembers || party?.maxPeople || party?.maxProfile || 4;

  return (
    <Link
      to={party?.partyId || party?.id ? `/party/${party.partyId || party.id}` : "/party"}
      className="group rounded-[var(--theme-radius)] border border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] p-5 shadow-[var(--theme-shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--theme-shadow-hover)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-bold text-[var(--theme-text)]">{getPartyName(party, index)}</p>
          <p className="mt-2 text-sm font-medium text-[var(--theme-text-muted)]">
            {formatLocalizedCurrency(getPartyPrice(party), locale)}
          </p>
        </div>
        <span className="rounded-full bg-[var(--theme-primary-light)] px-3 py-1 text-xs font-bold text-[var(--theme-primary)]">
          {currentMembers}/{maxMembers}
        </span>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--theme-surface-muted)]">
        <div
          className="h-full rounded-full bg-[var(--theme-primary)]"
          style={{ width: `${Math.min(100, (currentMembers / maxMembers) * 100)}%` }}
        />
      </div>
    </Link>
  );
}

function SectionShell({ title, children }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--theme-text)] md:text-3xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function EmptyState({ children }) {
  return (
    <div className="rounded-[var(--theme-radius)] border border-dashed border-[var(--theme-border)] bg-[var(--theme-bg-card)] px-6 py-12 text-center text-sm font-medium text-[var(--theme-text-muted)]">
      {children}
    </div>
  );
}

export default function MainPage() {
  const loadMain = useMainStore((s) => s.loadMain);
  const products = useMainStore((s) => s.products);
  const parties = useMainStore((s) => s.parties);
  const { locale, t } = useI18n();
  const landingEditor = useLandingEditorStore();

  useEffect(() => {
    loadMain();
  }, [loadMain]);

  const productSection = landingContent.sections.find((section) => section.type === "product-grid");
  const partySection = landingContent.sections.find((section) => section.type === "party-grid");
  const ctaSection = landingContent.sections.find((section) => section.type === "cta");
  const localeContent = landingEditor.localeContent?.[locale] || {};
  const textOrDefault = (field, key) => localeContent[field]?.trim() || t(key);
  const visibleProducts = products.slice(0, landingEditor.productMaxItems || productSection?.maxItems || 6);
  const visibleParties = parties.slice(0, landingEditor.partyMaxItems || partySection?.maxItems || 6);

  return (
    <div className="-mt-20 bg-[var(--theme-bg)] pt-20">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--theme-primary-light)] px-4 py-2 text-sm font-bold text-[var(--theme-primary)]">
            <Sparkles className="h-4 w-4" />
            {textOrDefault("badge", landingContent.hero.badgeKey)}
          </div>

          <h1 className="mt-8 max-w-3xl text-5xl font-bold tracking-tight text-[var(--theme-text)] sm:text-6xl lg:text-7xl">
            {textOrDefault("title", landingContent.hero.titleKey)}
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-[var(--theme-text-muted)]">
            {textOrDefault("description", landingContent.hero.descriptionKey)}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to={landingContent.hero.primaryAction.href}
              className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-[var(--theme-primary)] px-6 text-base font-bold text-white shadow-[var(--theme-shadow)] transition hover:bg-[var(--theme-primary-hover)]"
            >
              {textOrDefault("primaryLabel", landingContent.hero.primaryAction.labelKey)}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to={landingContent.hero.secondaryAction.href}
              className="inline-flex h-13 items-center justify-center rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)] px-6 text-base font-bold text-[var(--theme-text)] shadow-[var(--theme-shadow-soft)] transition hover:bg-[var(--theme-surface-muted)]"
            >
              {textOrDefault("secondaryLabel", landingContent.hero.secondaryAction.labelKey)}
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {landingContent.hero.metrics.map((metric, index) => (
              <HeroMetric
                key={metric.labelKey}
                metric={metric}
                t={t}
                value={landingEditor.metricValues?.[index]}
              />
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2rem] border border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] p-5 shadow-[var(--theme-shadow)]">
            <div className="rounded-[1.5rem] bg-[var(--theme-surface-muted)] p-4">
              <div className="grid gap-3">
                {[
                  { icon: ShieldCheck, title: "안전한 파티", desc: "참여 인원과 상태를 한눈에 확인" },
                  { icon: CreditCard, title: "간편한 결제", desc: "구독 결제와 실패 상태를 자동 관리" },
                  { icon: BellRing, title: "정산 알림", desc: "정산 진행 상황을 놓치지 않게 안내" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-4 rounded-2xl bg-[var(--theme-bg-card)] p-4 shadow-[var(--theme-shadow-soft)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--theme-primary)] text-white">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--theme-text)]">{item.title}</p>
                      <p className="text-sm font-medium text-[var(--theme-text-muted)]">{item.desc}</p>
                    </div>
                    <CheckCircle2 className="ml-auto h-5 w-5 text-[var(--theme-secondary)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionShell title={t(productSection.titleKey)}>
        {visibleProducts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product, index) => (
              <ProductCard key={product?.productId || product?.id || index} product={product} index={index} locale={locale} />
            ))}
          </div>
        ) : (
          <EmptyState>{t("landing.section.emptyProducts")}</EmptyState>
        )}
      </SectionShell>

      <SectionShell title={t(partySection.titleKey)}>
        {visibleParties.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleParties.map((party, index) => (
              <PartyCard key={party?.partyId || party?.id || index} party={party} index={index} locale={locale} />
            ))}
          </div>
        ) : (
          <EmptyState>{t("landing.section.emptyParties")}</EmptyState>
        )}
      </SectionShell>

      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-[var(--theme-primary)] px-6 py-12 text-white shadow-[var(--theme-shadow)] md:px-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {textOrDefault("ctaTitle", ctaSection.titleKey)}
              </h2>
              <p className="mt-4 max-w-2xl text-base font-medium text-white/80">
                {textOrDefault("ctaDescription", ctaSection.descriptionKey)}
              </p>
            </div>
            <Link
              to={ctaSection.action.href}
              className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-base font-bold text-[var(--theme-primary)] transition hover:bg-white/90"
            >
              {textOrDefault("ctaButton", ctaSection.action.labelKey)}
              <Users className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
