import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CreditCard,
  Users,
  User,
  ChevronRight,
  Shield,
  Bell
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

function Hero({ textOrDefault }) {
  return (
    <div className="md:col-span-2 bg-[var(--theme-bg-card)] rounded-[32px] p-8 md:p-12 lg:p-14 flex flex-col justify-between relative overflow-hidden group shadow-[var(--theme-shadow-soft)] transition-transform duration-300 hover:-translate-y-1">
      <div className="z-10 relative">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--theme-primary-light)] text-[var(--theme-primary)] text-[15px] font-bold mb-6 tracking-tight shadow-sm">
          {textOrDefault("badge", landingContent.hero.badgeKey)}
        </div>

        <h1 className="text-[40px] sm:text-[48px] md:text-[56px] leading-[1.25] font-extrabold text-[var(--theme-text)] tracking-tight mb-5 break-keep whitespace-pre-wrap">
          {textOrDefault("title", landingContent.hero.titleKey).replace("\\n", "\n")}
        </h1>

        <p className="text-[18px] md:text-[20px] text-[var(--theme-text-muted)] font-semibold leading-relaxed max-w-[420px] break-keep">
          {textOrDefault("description", landingContent.hero.descriptionKey)}
        </p>
      </div>

      <div className="mt-10 md:mt-16 z-10 flex flex-wrap gap-3">
        <Link to={landingContent.hero.primaryAction.href} className="bg-[var(--theme-text)] hover:opacity-80 text-[var(--theme-bg)] px-8 py-4 rounded-[20px] font-bold text-[18px] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl w-full sm:w-auto h-[60px]">
          {textOrDefault("primaryLabel", landingContent.hero.primaryAction.labelKey)}
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link to="/subscriptions" className="bg-[var(--theme-surface-muted)] hover:bg-[var(--theme-border-light)] text-[var(--theme-text)] px-8 py-4 rounded-[20px] font-bold text-[18px] transition-all flex items-center justify-center w-full sm:w-auto h-[60px]">
          {textOrDefault("secondaryLabel", landingContent.hero.secondaryAction.labelKey)}
        </Link>
      </div>
    </div>
  );
}

function KeyStats({ metrics, metricValues, t }) {
  const savingValue = metricValues?.[0] || metrics[0].value;
  const savingLabel = t(metrics[0].labelKey);
  const partiesValue = metricValues?.[1] || metrics[1].value;
  const partiesLabel = t(metrics[1].labelKey);

  // Extract number and sign for parties
  const partiesNum = partiesValue.replace(/[^0-9]/g, '');
  const partiesSign = partiesValue.replace(/[0-9]/g, '');

  return (
    <div className="md:col-span-1 flex flex-col gap-4 md:gap-6">
      <div className="flex-1 bg-[var(--theme-primary)] rounded-[32px] p-8 md:p-10 flex flex-col justify-center relative overflow-hidden group shadow-[var(--theme-shadow-soft)] transition-transform duration-300 hover:-translate-y-1">
        <div className="relative z-10">
          <p className="text-white/80 font-bold text-[16px] mb-2 tracking-tight">{savingLabel}</p>
          <h3 className="text-[56px] md:text-[64px] font-extrabold text-white leading-none tracking-tighter">{savingValue}</h3>
        </div>
      </div>

      <div className="flex-1 bg-[var(--theme-bg-card)] rounded-[32px] p-8 md:p-10 flex flex-col justify-center shadow-[var(--theme-shadow-soft)] transition-transform duration-300 hover:-translate-y-1 group">
        <p className="text-[var(--theme-text-muted)] font-bold text-[16px] mb-2 tracking-tight">{partiesLabel}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-[56px] md:text-[64px] font-extrabold text-[var(--theme-text)] leading-none tracking-tighter">{partiesNum}</h3>
          {partiesSign && <span className="text-[32px] font-extrabold text-[var(--theme-primary)]">{partiesSign}</span>}
        </div>
      </div>
    </div>
  );
}

function PopularSubscriptions({ products, locale, title }) {
  return (
    <div className="md:col-span-2 bg-[var(--theme-bg-card)] rounded-[32px] p-6 md:p-8 shadow-[var(--theme-shadow-soft)] transition-transform duration-300 hover:-translate-y-1 flex flex-col h-full justify-between">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] md:text-[24px] font-extrabold text-[var(--theme-text)] tracking-tight">{title}</h2>
        <Link to="/subscriptions" className="bg-[var(--theme-surface-muted)] text-[var(--theme-text-muted)] hover:bg-[var(--theme-border-light)] px-4 py-2 rounded-full font-bold text-[13px] transition-colors">
          전체보기
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 flex-1">
        {products.map((product, idx) => {
          const name = getProductName(product, idx);
          const imagePath = product?.productImage || product?.productLogo || product?.logoImage || product?.imageUrl || product?.logoUrl;
          const imageUrl = getProductIconUrl(imagePath);
          return (
            <Link key={product?.productId || product?.id || idx} to={product?.productId ? `/product/${product.productId}` : "/product"} className="bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-muted)] transition-colors rounded-[20px] p-4 flex items-center gap-3.5 cursor-pointer group">
              <div className="w-11 h-11 rounded-full bg-[var(--theme-bg-card)] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0 border border-[var(--theme-border-light)] text-[var(--theme-text)] font-bold text-sm">
                {imageUrl ? (
                  <img src={imageUrl} alt={name} className="w-6 h-6 object-contain" />
                ) : (
                  name.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-[var(--theme-text)] text-[15px] truncate">{name}</span>
                <span className="font-semibold text-[var(--theme-text-muted)] text-[13px]">{formatLocalizedCurrency(getProductPrice(product), locale)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Features() {
  const featureList = [
    { icon: Shield, title: "안전한 파티", desc: "참여 인원과 상태를 한눈에 확인하여 믿을 수 있는 구독을 시작하세요." },
    { icon: CreditCard, title: "간편한 결제", desc: "복잡한 송금 없이, 자동 결제와 실패 관리까지 지원합니다." },
    { icon: Bell, title: "정산 알림", desc: "정산 시기를 놓치지 않도록 적시에 알림을 보내드립니다." },
  ];

  return (
    <div className="md:col-span-1 bg-[var(--theme-bg-card)] rounded-[32px] p-6 md:p-8 flex flex-col gap-6 shadow-[var(--theme-shadow-soft)] transition-transform duration-300 hover:-translate-y-1 h-full justify-between">
      <h2 className="text-[22px] md:text-[24px] font-extrabold text-[var(--theme-text)] tracking-tight leading-[1.3]">
        안전하고<br/>투명하게
      </h2>

      <div className="flex flex-col justify-between flex-1 gap-4">
        {featureList.map((item, idx) => (
          <div key={idx} className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-[var(--theme-surface-muted)] flex items-center justify-center shrink-0">
              <item.icon className="w-5 h-5 text-[var(--theme-text)]" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--theme-text)] text-[15px] mb-1">{item.title}</h3>
              <p className="text-[var(--theme-text-muted)] font-semibold text-[13px] leading-relaxed break-keep">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CurrentParties({ parties, locale, title }) {
  return (
    <div className="md:col-span-3 bg-[var(--theme-bg-card)] rounded-[32px] p-8 md:p-10 shadow-[var(--theme-shadow-soft)]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-[24px] md:text-[28px] font-extrabold text-[var(--theme-text)] tracking-tight">{title}</h2>
          <span className="hidden sm:inline-flex items-center px-3 py-1 bg-[var(--theme-primary-light)] text-[var(--theme-primary)] font-bold text-[13px] rounded-full">
            실시간 업데이트
          </span>
        </div>
        <Link to="/party" className="flex items-center gap-1 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] font-bold text-[16px] transition-colors">
          더보기 <ChevronRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {parties.map((party, idx) => {
          const currentMembers = party?.currentMembers || party?.memberCount || party?.joinedCount || 1;
          const maxMembers = party?.maxMembers || party?.maxPeople || party?.maxProfile || 4;
          const percentage = Math.min(100, Math.round((currentMembers / maxMembers) * 100));
          const isNearlyFull = currentMembers === maxMembers - 1;

          return (
            <Link key={party?.partyId || party?.id || idx} to={party?.partyId || party?.id ? `/party/${party.partyId || party.id}` : "/party"} className="bg-[var(--theme-surface)] border border-[var(--theme-border-light)] rounded-[28px] p-6 hover:border-[var(--theme-primary)]/20 hover:shadow-[0_8px_20px_rgba(49,130,246,0.06)] transition-all cursor-pointer group flex flex-col">

              <div className="flex items-start justify-between mb-6">
                <div className="flex flex-col gap-1">
                  {isNearlyFull && (
                    <span className="text-[12px] font-extrabold px-2 py-0.5 rounded-md self-start bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400">
                      마감직전
                    </span>
                  )}
                  <span className="font-bold text-[var(--theme-text)] text-[20px]">{getPartyName(party, idx)}</span>
                </div>
                <span className="bg-[var(--theme-bg-card)] border border-[var(--theme-border)] px-3 py-1.5 rounded-full text-[var(--theme-text)] font-extrabold text-[14px] shadow-sm group-hover:border-[var(--theme-primary)]/20 transition-colors">
                  {formatLocalizedCurrency(getPartyPrice(party), locale)}
                </span>
              </div>

              <div className="mt-auto">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-[var(--theme-text-muted)]">
                    <div className="w-6 h-6 rounded-full bg-[var(--theme-border-light)] flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-[var(--theme-text-muted)]" />
                    </div>
                    <span className="font-bold text-[14px]">{currentMembers}/{maxMembers} 모집</span>
                  </div>
                  <span className="font-extrabold text-[var(--theme-primary)] text-[14px]">{percentage}%</span>
                </div>

                <div className="w-full h-2.5 bg-[var(--theme-border-light)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--theme-primary)] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

            </Link>
          );
        })}
      </div>
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
  const visibleParties = parties.slice(0, landingEditor.partyMaxItems || partySection?.maxItems || 4); // changed to 4 to fit grid

  return (
    <div className="-mt-20 bg-[var(--theme-bg)] pt-20 pb-16 selection:bg-[var(--theme-primary)] selection:text-white">
      <section aria-label="홈 주요 콘텐츠" className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 mt-8 md:mt-10 flex flex-col gap-4 md:gap-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Hero textOrDefault={textOrDefault} />
          <KeyStats metrics={landingContent.hero.metrics} metricValues={landingEditor.metricValues} t={t} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <PopularSubscriptions products={visibleProducts} locale={locale} title={t(productSection.titleKey)} />
          <Features />
        </div>

        <CurrentParties parties={visibleParties} locale={locale} title={t(partySection.titleKey)} />
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 mt-16 md:mt-24">
        <div className="rounded-[32px] bg-[var(--theme-primary)] px-6 py-12 text-white shadow-[var(--theme-shadow)] md:px-12">
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
              className="inline-flex h-[60px] items-center justify-center gap-2 rounded-[20px] bg-white px-8 text-[18px] font-bold text-[var(--theme-primary)] transition hover:bg-white/90 shadow-lg"
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
