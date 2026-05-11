import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Filter,
  Plus,
  RotateCcw,
  Search,
  Users,
} from "lucide-react";
import { usePartyStore } from "@/store/party/partyStore";
import { useAuthStore } from "@/store/authStore";
import {
  MoaBadge,
  MoaButton,
  MoaCard,
  MoaEmptyState,
  MoaInput,
  MoaPage,
  MoaPageHeader,
} from "@/components/common/MoaPage";
import { useI18n } from "@/hooks/useI18n";
import { getProductImageCandidates } from "@/utils/imageUtils";
import { formatLocalizedCurrency, formatLocalizedDate } from "@/utils/localeFormat";

const statusFilters = [
  { value: "", labelKey: "common.all" },
  { value: "RECRUITING", labelKey: "party.status.recruiting" },
  { value: "ACTIVE", labelKey: "party.status.active" },
];

const sortOptions = [
  { value: "latest", labelKey: "party.sort.latest" },
  { value: "start_date_asc", labelKey: "party.sort.startDateAsc" },
  { value: "popularity", labelKey: "party.sort.popularity" },
  { value: "price_low", labelKey: "party.sort.priceLow" },
  { value: "price_high", labelKey: "party.sort.priceHigh" },
];

function getStatusMeta(status, remainingSlots, t) {
  if (status === "RECRUITING" && remainingSlots === 1) {
    return { label: t("party.status.almostFull"), tone: "warning" };
  }

  const map = {
    RECRUITING: { label: t("party.status.recruiting"), tone: "success" },
    ACTIVE: { label: t("party.status.active"), tone: "primary" },
    PENDING_PAYMENT: { label: t("party.status.pendingPayment"), tone: "warning" },
    CLOSED: { label: t("party.status.closed"), tone: "neutral" },
  };

  return map[status] || map.RECRUITING;
}

function PartyLogo({ party }) {
  const candidates = getProductImageCandidates(party, "logo");
  const [imageIndex, setImageIndex] = useState(0);
  const imageUrl = candidates[imageIndex];

  if (imageUrl) {
    return (
      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-[var(--theme-border-light)] bg-[var(--theme-surface)]">
        <img
          src={imageUrl}
          alt={party.productName || "MOA"}
          className="h-full w-full object-contain"
          onError={() => setImageIndex((current) => current + 1)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--theme-primary-light)] text-lg font-bold text-[var(--theme-primary)]">
      {party.productName?.slice(0, 1) || "M"}
    </div>
  );
}

export default function PartyListPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { locale, t } = useI18n();
  const {
    parties,
    myParties,
    products,
    loading,
    hasMore,
    loadParties,
    loadMyParties,
    loadProducts,
  } = usePartyStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("RECRUITING");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const params = useMemo(
    () => ({
      keyword: debouncedQuery,
      partyStatus: selectedStatus || null,
      productId: selectedProductId || null,
      startDate: startDate || null,
      sort: sortBy,
    }),
    [debouncedQuery, selectedStatus, selectedProductId, startDate, sortBy]
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (user) loadMyParties();
  }, [loadMyParties, user]);

  useEffect(() => {
    loadParties(params, true);
  }, [loadParties, params]);

  const myPartyIds = useMemo(
    () => new Set((Array.isArray(myParties) ? myParties : []).map((party) => party.partyId)),
    [myParties]
  );

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("");
    setSelectedProductId("");
    setStartDate("");
    setSortBy("latest");
  };

  const moveToParty = (partyId) => {
    if (!user) {
      navigate("/login", { state: { from: "/party" } });
      return;
    }

    navigate(`/party/${partyId}`, { state: { from: "/party" } });
  };

  const isInitialLoading = loading.parties && parties.length === 0;

  return (
    <MoaPage>
      <MoaPageHeader
        eyebrow={t("party.eyebrow")}
        title={t("party.title")}
        description={t("party.description")}
        action={
          <div className="flex gap-2">
            {user && (
              <MoaButton variant="secondary" onClick={() => navigate("/my-parties")}>
                {t("party.mine")}
              </MoaButton>
            )}
            <MoaButton onClick={() => navigate("/party/create")}>
              <Plus className="h-4 w-4" />
              {t("party.create")}
            </MoaButton>
          </div>
        }
      />

      <MoaCard className="mb-8 p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-text-muted)]" />
            <MoaInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("party.search")}
              className="pl-11"
            />
          </div>

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-[var(--theme-text-muted)]" />
              {statusFilters.map((filter) => (
                <MoaButton
                  key={filter.value}
                  size="sm"
                  variant={selectedStatus === filter.value ? "primary" : "secondary"}
                  onClick={() => setSelectedStatus(filter.value)}
                >
                  {t(filter.labelKey)}
                </MoaButton>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="h-9 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 text-sm font-semibold text-[var(--theme-text)] outline-none"
              >
                <option value="">{t("party.allProducts")}</option>
                {products.map((product) => (
                  <option key={product.productId} value={product.productId}>
                    {product.productName}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (e.target.value) setSortBy("start_date_asc");
                }}
                className="h-9 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 text-sm font-semibold text-[var(--theme-text)] outline-none"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 text-sm font-semibold text-[var(--theme-text)] outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </option>
                ))}
              </select>
              <MoaButton size="sm" variant="ghost" onClick={resetFilters}>
                <RotateCcw className="h-4 w-4" />
                {t("common.reset")}
              </MoaButton>
            </div>
          </div>
        </div>
      </MoaCard>

      {isInitialLoading ? (
        <MoaEmptyState title={t("party.loading")} />
      ) : parties.length === 0 ? (
        <MoaEmptyState
          title={t("party.empty")}
          description={t("party.emptyDescription")}
          action={<MoaButton onClick={resetFilters}>{t("common.reset")}</MoaButton>}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {parties.map((party) => {
              const remainingSlots = (party.maxMembers || 0) - (party.currentMembers || 0);
              const status = getStatusMeta(party.partyStatus, remainingSlots, t);
              const isMine = myPartyIds.has(party.partyId);
              const isLeader = user?.userId === party.partyLeaderId;

              return (
                <MoaCard
                  key={party.partyId}
                  as="button"
                  type="button"
                  onClick={() => moveToParty(party.partyId)}
                  className="flex h-full flex-col p-5 text-left transition hover:-translate-y-1 hover:border-[var(--theme-primary)] hover:shadow-[var(--theme-shadow)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <PartyLogo party={party} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--theme-primary)]">
                          {party.productName || t("product.categoryFallback")}
                        </p>
                        <h3 className="mt-1 truncate text-lg font-bold text-[var(--theme-text)]">
                          {party.title || party.productName || t("party.title")}
                        </h3>
                      </div>
                    </div>
                    <MoaBadge tone={status.tone}>{status.label}</MoaBadge>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-[var(--theme-surface-muted)] p-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--theme-text-muted)]">
                        <Calendar className="h-3.5 w-3.5" />
                        {t("party.startDate")}
                      </div>
                      <p className="mt-1 text-sm font-bold text-[var(--theme-text)]">
                        {formatLocalizedDate(party.startDate, locale) || "-"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[var(--theme-surface-muted)] p-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--theme-text-muted)]">
                        <Users className="h-3.5 w-3.5" />
                        {t("party.members")}
                      </div>
                      <p className="mt-1 text-sm font-bold text-[var(--theme-text)]">
                        {party.currentMembers || 0}/{party.maxMembers || 0}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-end justify-between border-t border-[var(--theme-border-light)] pt-4">
                    <div>
                      <p className="text-xs font-semibold text-[var(--theme-text-muted)]">{t("party.monthlyFee")}</p>
                      <p className="mt-1 text-xl font-bold text-[var(--theme-text)]">
                        {formatLocalizedCurrency(party.monthlyFee, locale)}
                      </p>
                    </div>
                    {(isLeader || isMine) && (
                      <MoaBadge tone={isLeader ? "warning" : "primary"}>
                        {isLeader ? t("party.role.leader") : t("party.role.member")}
                      </MoaBadge>
                    )}
                  </div>
                </MoaCard>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            {hasMore ? (
              <MoaButton
                variant="secondary"
                disabled={loading.parties}
                onClick={() => loadParties(params, false)}
              >
                {loading.parties ? t("common.loading") : t("common.more")}
              </MoaButton>
            ) : (
              <p className="text-sm font-semibold text-[var(--theme-text-muted)]">
                {t("party.allLoaded")}
              </p>
            )}
          </div>
        </>
      )}
    </MoaPage>
  );
}
