import { createElement, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  ChevronRight,
  CreditCard,
  Loader2,
  Plus,
  ShieldCheck,
  Trash2,
  Wallet,
  Zap,
} from "lucide-react";
import { useWalletStore } from "@/store/wallet/walletStore";
import { useAuthStore } from "@/store/authStore";
import { requestBillingAuth } from "@/utils/paymentHandler";
import { handleApiError } from "@/utils/errorHandler";
import { toast } from "@/utils/toast";
import {
  getBankLogo,
  getBankTheme,
  getCardLogo,
  getCardTheme,
} from "@/utils/logoHelper";
import { MoaButton, MoaCard, MoaPage, MoaPageHeader } from "@/shared/ui";

function LogoBox({ logoPath, label, fallback: FallbackIcon, themeStyle }) {
  return (
    <div className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl ${themeStyle.bg}`}>
      {logoPath ? (
        <img
          src={logoPath}
          alt={label}
          className="h-full w-full object-contain p-2"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        createElement(FallbackIcon, { className: `h-6 w-6 ${themeStyle.text}` })
      )}
    </div>
  );
}

function WalletMethodCard({
  title,
  actionLabel,
  helper,
  icon: Icon,
  onHistory,
  onClick,
  onDelete,
  children,
}) {
  return (
    <MoaCard className="p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {createElement(Icon, { className: "h-5 w-5 text-[var(--theme-primary)]" })}
          <h2 className="font-black text-[var(--theme-text)]">{title}</h2>
        </div>
        <button
          type="button"
          onClick={onHistory}
          className="text-sm font-bold text-[var(--theme-primary)] hover:underline"
        >
          내역 보기
        </button>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="flex min-h-24 w-full items-center gap-4 rounded-2xl border border-[var(--theme-border-light)] bg-[var(--theme-bg)] p-4 text-left transition hover:border-[var(--theme-primary)] hover:bg-[var(--theme-primary-light)]/40"
      >
        {children || (
          <>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--theme-primary-light)] text-[var(--theme-primary)]">
              <Plus className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-black text-[var(--theme-text)]">{actionLabel}</p>
              <p className="mt-1 text-sm text-[var(--theme-text-muted)]">{helper}</p>
            </div>
          </>
        )}
        <ChevronRight className="ml-auto h-5 w-5 shrink-0 text-[var(--theme-text-muted)]" />
      </button>

      {onDelete && (
        <MoaButton type="button" variant="ghost" className="mt-3 w-full justify-center text-red-500" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
          삭제
        </MoaButton>
      )}
    </MoaCard>
  );
}

export default function MyWalletPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthStore();
  const deposits = useWalletStore((state) => state.deposits);
  const account = useWalletStore((state) => state.account);
  const card = useWalletStore((state) => state.card);
  const loadingWallet = useWalletStore((state) => state.loading.wallet);
  const loadWalletData = useWalletStore((state) => state.loadWalletData);
  const getTotalDeposit = useWalletStore((state) => state.getTotalDeposit);
  const deleteAccountAction = useWalletStore((state) => state.deleteAccount);
  const deleteCardAction = useWalletStore((state) => state.deleteCard);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.warning("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) loadWalletData();
  }, [user, loadWalletData]);

  const goHistory = (tab) => {
    navigate(`/user/financial-history?tab=${tab}`);
  };

  const handleRegisterCard = async () => {
    try {
      if (!user) {
        toast.warning("로그인이 필요합니다.");
        navigate("/login");
        return;
      }
      await requestBillingAuth(user.userId);
    } catch (error) {
      const errorMessage = error?.message || "";
      if (errorMessage.includes("취소") || errorMessage.includes("cancel")) return;
      console.error("Card registration failed:", error);
      toast.error(handleApiError(error).message);
    }
  };

  const handleAccountClick = () => {
    if (!account || window.confirm("등록된 정산 계좌를 변경하시겠습니까?")) {
      navigate("/user/account-register");
    }
  };

  const handleCardClick = () => {
    if (!card) {
      handleRegisterCard();
      return;
    }
    if (window.confirm("등록된 결제 카드를 변경하시겠습니까?")) {
      requestBillingAuth(user.userId);
    }
  };

  const totalDeposit = getTotalDeposit();
  const loading = authLoading || (loadingWallet && !account && !card);

  if (loading) {
    return (
      <MoaPage className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--theme-primary)]" />
      </MoaPage>
    );
  }

  const accountTheme = getBankTheme(account?.bankName);
  const cardTheme = getCardTheme(card?.cardCompany);

  return (
    <MoaPage className="max-w-5xl">
      <MoaPageHeader
        eyebrow="Wallet"
        title="내 지갑"
        description=""
        backLabel="목록으로"
        onBack={() => navigate("/mypage")}
      />

      <div className="space-y-6">
        <button
          type="button"
          onClick={() => goHistory("deposit")}
          className="w-full rounded-2xl bg-[var(--theme-primary)] p-6 text-left text-white shadow-[var(--theme-shadow)] transition hover:translate-y-[-1px] hover:bg-[var(--theme-primary-hover)]"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-white/80">
            <ShieldCheck className="h-4 w-4" />
            총 보증금
          </div>
          <div className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {totalDeposit.toLocaleString("ko-KR")}원
          </div>
          <div className="mt-4 flex items-center justify-between text-sm font-semibold text-white/80">
            <span>{deposits?.length || 0}건 보관 중</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1">
              내역 보기
              <ChevronRight className="h-4 w-4" />
            </span>
          </div>
        </button>

        <div className="grid gap-5 md:grid-cols-2">
          <WalletMethodCard
            title="정산 계좌"
            actionLabel="계좌 등록하기"
            helper="정산받을 계좌를 등록하세요."
            icon={Building2}
            onHistory={(event) => {
              event.stopPropagation();
              goHistory("settlement");
            }}
            onClick={handleAccountClick}
            onDelete={
              account
                ? (event) => {
                    event.stopPropagation();
                    if (window.confirm("정산 계좌를 삭제하시겠습니까?")) {
                      deleteAccountAction();
                    }
                  }
                : null
            }
          >
            {account && (
              <>
                <LogoBox
                  logoPath={getBankLogo(account.bankName)}
                  label={account.bankName}
                  fallback={Building2}
                  themeStyle={accountTheme}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-black text-[var(--theme-text)]">{account.bankName}</p>
                  <p className="mt-1 font-mono text-sm text-[var(--theme-text-muted)]">
                    {account.accountNumber?.replace(/(\d{4})(\d{2})(.*)/, "$1-$2-******")}
                  </p>
                </div>
              </>
            )}
          </WalletMethodCard>

          <WalletMethodCard
            title="결제 카드"
            actionLabel="카드 등록하기"
            helper="자동 결제에 사용할 카드를 등록하세요."
            icon={CreditCard}
            onHistory={(event) => {
              event.stopPropagation();
              goHistory("payment");
            }}
            onClick={handleCardClick}
            onDelete={
              card
                ? (event) => {
                    event.stopPropagation();
                    if (window.confirm("결제 카드를 삭제하시겠습니까?")) {
                      deleteCardAction();
                    }
                  }
                : null
            }
          >
            {card && (
              <>
                <LogoBox
                  logoPath={getCardLogo(card.cardCompany)}
                  label={card.cardCompany}
                  fallback={CreditCard}
                  themeStyle={cardTheme}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-black text-[var(--theme-text)]">{card.cardCompany}</p>
                  <p className="mt-1 font-mono text-sm text-[var(--theme-text-muted)]">
                    **** **** **** {card.cardNumber?.slice(-4) || "****"}
                  </p>
                </div>
              </>
            )}
          </WalletMethodCard>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <MoaCard className="p-5">
            <ShieldCheck className="mb-3 h-5 w-5 text-[var(--theme-primary)]" />
            <p className="text-sm font-semibold text-[var(--theme-text-muted)]">안전 보증금</p>
            <p className="mt-1 font-black text-[var(--theme-text)]">파티 종료까지 안전하게 보관됩니다.</p>
          </MoaCard>
          <MoaCard className="p-5">
            <Zap className="mb-3 h-5 w-5 text-[var(--theme-primary)]" />
            <p className="text-sm font-semibold text-[var(--theme-text-muted)]">자동 결제</p>
            <p className="mt-1 font-black text-[var(--theme-text)]">등록된 카드로 간편하게 처리됩니다.</p>
          </MoaCard>
        </div>
      </div>
    </MoaPage>
  );
}
