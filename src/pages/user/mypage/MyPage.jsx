import { createElement, useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Box,
  Check,
  ChevronRight,
  Clock,
  CreditCard,
  KeyRound,
  LogOut,
  Shield,
  Sparkles,
  UserCog,
  UserMinus,
  UserPen,
  Users,
  Wallet,
} from "lucide-react";
import { getMyParties } from "@/api/partyApi";
import httpClient from "@/api/httpClient";
import { useBackupCodeModal } from "@/hooks/user/useBackupCodeModal";
import { useLoginHistory } from "@/hooks/user/useLoginHistory";
import { useMyPage } from "@/hooks/user/useMyPage";
import { useAuthStore } from "@/store/authStore";
import { useOtpStore } from "@/store/user/otpStore";
import { formatPhoneNumber } from "@/utils/format";
import {
  MoaBadge,
  MoaButton,
  MoaCard,
  MoaPage,
  MoaPageHeader,
} from "@/shared/ui";
import { BackupCodeDialog } from "./components/BackupCodeDialog";
import { DeleteUserDialog } from "./components/DeleteUserDialog";
import { LoginHistoryCard } from "./components/LoginHistoryCard";
import { OtpDialog } from "./components/OtpDialog";
import { UpdateUserDialog } from "./components/UpdateUserDialog";

function InfoRow({ label, value, badge }) {
  return (
    <div className="flex min-h-12 items-center justify-between gap-4 border-b border-[var(--theme-border-light)] py-3 last:border-b-0">
      <span className="shrink-0 text-sm font-semibold text-[var(--theme-text-muted)]">{label}</span>
      <span className="min-w-0 truncate text-right text-sm font-bold text-[var(--theme-text)]">
        {badge || value || "-"}
      </span>
    </div>
  );
}

function IconBubble({ icon, tone = "blue", className = "" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
    purple: "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
    red: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300",
    slate: "bg-slate-50 text-slate-600 dark:bg-white/10 dark:text-slate-200",
  };

  return (
    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tones[tone]} ${className}`}>
      {createElement(icon, { className: "h-5 w-5" })}
    </span>
  );
}

function QuickAction({ icon, title, onClick, tone }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-36 flex-col justify-between rounded-3xl border border-[var(--theme-border-light)] bg-[var(--theme-surface)] p-5 text-left shadow-[var(--theme-shadow-soft)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg dark:hover:border-blue-500/30"
    >
      <div className="flex items-center justify-between">
        <IconBubble icon={icon} tone={tone} />
        <ChevronRight className="h-5 w-5 text-[var(--theme-text-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--theme-primary)]" />
      </div>
      <div>
        <p className="text-base font-black text-[var(--theme-text)]">{title}</p>
      </div>
    </button>
  );
}

function SummaryCard({ icon, title, value, actionLabel, onClick, tone }) {
  return (
    <MoaCard className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-bold text-[var(--theme-text-muted)]">{title}</p>
          <p className="mt-3 text-4xl font-black leading-none text-[var(--theme-text)]">{value}</p>
        </div>
        <IconBubble icon={icon} tone={tone} className="h-11 w-11" />
      </div>
      {actionLabel && (
        <button
          type="button"
          onClick={onClick}
          className="mt-5 h-10 w-full rounded-xl border border-[var(--theme-border)] text-sm font-bold text-[var(--theme-text)] transition hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)]"
        >
          {actionLabel}
        </button>
      )}
    </MoaCard>
  );
}

function SideMenuItem({ icon, title, onClick, active, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-4 border-b border-[var(--theme-border-light)] px-1 py-5 text-left last:border-b-0 ${
        active ? "rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 shadow-sm dark:border-blue-500/30 dark:bg-blue-500/10" : ""
      }`}
    >
      <span className={danger ? "text-red-500" : active ? "text-[var(--theme-primary)]" : "text-[var(--theme-text-muted)]"}>
        {createElement(icon, { className: "h-6 w-6" })}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-base font-black ${danger ? "text-red-500" : "text-[var(--theme-text)]"}`}>
          {title}
        </span>
      </span>
      <ChevronRight className={`h-5 w-5 transition group-hover:translate-x-1 ${danger ? "text-red-500" : "text-[var(--theme-text-muted)]"}`} />
    </button>
  );
}

function CompletionPanel({ percent, otpEnabled, marketingAgreed, onSecurityClick }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <MoaCard className="p-6">
      <h2 className="text-lg font-black text-[var(--theme-text)]">계정 완성도</h2>
      <div className="mt-5 flex items-center gap-5">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="7" className="text-blue-50 dark:text-white/10" />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="text-[var(--theme-primary)]"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-[var(--theme-text)]">
            {percent}%
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="hidden">
            더 안전한 계정을 위해 보안 설정을 확인해 주세요.
          </p>
          <div className="space-y-2 text-sm font-bold">
            <CompletionRow done label="이메일 인증" />
            <CompletionRow done={marketingAgreed} label="알림 설정" />
            <CompletionRow done={otpEnabled} label="OTP 설정" />
          </div>
        </div>
      </div>
      <MoaButton className="mt-6 w-full" onClick={onSecurityClick}>
        보안 설정 바로가기
      </MoaButton>
    </MoaCard>
  );
}

function CompletionRow({ done, label }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[var(--theme-text-muted)]">{label}</span>
      {done ? (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
          <Check className="h-3.5 w-3.5" />
        </span>
      ) : (
        <MoaBadge tone="neutral">미완료</MoaBadge>
      )}
    </div>
  );
}

export default function MyPage() {
  const { state, actions } = useMyPage();
  const { user, isAdmin, marketingAgreed, googleConn, kakaoConn } = state;
  const [activeView, setActiveView] = useState("main");
  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const [partyCount, setPartyCount] = useState(0);
  const [updateUserOpen, setUpdateUserOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const logout = useAuthStore((store) => store.logout);

  const otp = {
    enabled: useOtpStore((s) => s.enabled),
    modalOpen: useOtpStore((s) => s.modalOpen),
    mode: useOtpStore((s) => s.mode),
    qrUrl: useOtpStore((s) => s.qrUrl),
    code: useOtpStore((s) => s.code),
    loading: useOtpStore((s) => s.loading),
  };

  const backup = useBackupCodeModal();
  const loginHistory = useLoginHistory({
    size: 10,
    enabled: activeView === "history" && !!user,
  });

  const nickname =
    user?.nickname ||
    user?.name ||
    user?.userName ||
    user?.userId?.split("@")[0] ||
    "회원";

  const connectedCount = Number(Boolean(googleConn)) + Number(Boolean(kakaoConn));
  const registeredPayments = Number(Boolean(user?.cardId || user?.cardName || user?.billingKey || user?.paymentMethod));
  const completionPercent = useMemo(() => {
    const checks = [
      Boolean(user?.userId || user?.email),
      Boolean(user?.phone),
      Boolean(marketingAgreed),
      Boolean(otp.enabled),
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [marketingAgreed, otp.enabled, user?.email, user?.phone, user?.userId]);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!user?.userId) return;

      try {
        const subResponse = await httpClient.get("/subscription");
        const subscriptions = Array.isArray(subResponse)
          ? subResponse
          : subResponse?.data || [];
        setSubscriptionCount(
          subscriptions.filter((item) => item.subscriptionStatus === "ACTIVE").length
        );

        const partyResponse = await getMyParties();
        const parties = Array.isArray(partyResponse)
          ? partyResponse
          : partyResponse?.data || [];
        setPartyCount(parties.length);
      } catch (error) {
        console.error("Failed to fetch mypage counts:", error);
      }
    };

    fetchCounts();
  }, [user?.userId]);

  useEffect(() => {
    if (otp.enabled) backup.fetchExistingCodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp.enabled]);

  useEffect(() => {
    if (user) useOtpStore.getState().setEnabled(!!user.otpEnabled);
  }, [user]);

  const handleOtpConfirm = async () => {
    const result = await actions.otp.confirmOtp?.();

    if (result?.success && result.mode === "enable") {
      if (backup.issued) {
        await backup.openExistingCodes();
      } else {
        await backup.issueBackupCodes();
      }
    }
  };

  const openOtp = () => {
    if (!otp.enabled) {
      actions.otp.openSetup?.();
    } else {
      actions.otp.prepareDisable?.();
    }
    actions.handleOtpModalChange?.(true);
  };

  const handleLogout = async () => {
    await logout();
    actions.navigate("/");
  };

  if (!user) return null;

  if (isAdmin) {
    return (
      <MoaPage className="max-w-5xl">
        <MoaPageHeader
          eyebrow="Admin"
          title="관리자 계정"
          description=""
        />
        <MoaCard className="grid gap-3 p-5 sm:grid-cols-2">
          <MoaButton onClick={() => actions.navigate("/admin")}>관리자 대시보드</MoaButton>
          <MoaButton variant="secondary" onClick={() => actions.navigate("/admin/landing")}>
            랜딩 콘텐츠 관리
          </MoaButton>
        </MoaCard>
      </MoaPage>
    );
  }

  if (activeView === "history") {
    return (
      <MoaPage className="max-w-5xl">
        <MoaPageHeader
          eyebrow="Account activity"
          title="로그인 기록"
          description=""
          onBack={() => setActiveView("main")}
          backLabel="마이페이지로"
        />
        <MoaCard className="overflow-hidden p-5">
          <LoginHistoryCard loginHistory={loginHistory?.state} onBack={() => setActiveView("main")} />
        </MoaCard>
      </MoaPage>
    );
  }

  const sideMenu = [
    {
      icon: UserCog,
      title: "내 계정",
      description: "계정 정보 및 기본 설정",
      active: true,
      onClick: () => setUpdateUserOpen(true),
    },
    {
      icon: CreditCard,
      title: "구독/결제",
      description: "구독 현황 및 결제 관리",
      onClick: () => actions.navigate("/subscription"),
    },
    {
      icon: Users,
      title: "파티 관리",
      description: "가입 파티 및 파티 찾기",
      onClick: () => actions.navigate("/my-parties"),
    },
    {
      icon: Shield,
      title: "보안",
      description: "보안 설정 및 인증 관리",
      onClick: openOtp,
    },
    {
      icon: Wallet,
      title: "내 지갑",
      description: "결제 수단 및 지갑 관리",
      onClick: () => actions.navigate("/mypage/wallet"),
    },
    {
      icon: Clock,
      title: "로그인 기록",
      description: "최근 로그인 활동 확인",
      onClick: () => setActiveView("history"),
    },
    {
      icon: UserMinus,
      title: "회원 탈퇴",
      description: "계정 탈퇴 및 데이터 삭제",
      danger: true,
      onClick: () => setDeleteUserOpen(true),
    },
  ];

  return (
    <MoaPage className="max-w-none px-4 sm:px-6 lg:px-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-8">
          <MoaCard className="relative overflow-hidden rounded-[28px] p-8 sm:p-10">
            <div className="absolute right-8 top-8 hidden h-44 w-44 rounded-[40px] bg-gradient-to-br from-blue-300 via-blue-500 to-blue-700 shadow-2xl shadow-blue-500/20 rotate-6 lg:block">
              <div className="absolute left-1/2 top-9 h-12 w-12 -translate-x-1/2 rounded-full bg-white/90 shadow-lg" />
              <div className="absolute bottom-10 left-1/2 h-12 w-28 -translate-x-1/2 rounded-[999px_999px_34px_34px] bg-white/90 shadow-lg" />
              <div className="absolute bottom-7 right-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-500 shadow-xl">
                <Sparkles className="h-7 w-7" />
              </div>
            </div>
            <div className="relative max-w-2xl">
              <p className="text-sm font-black text-[var(--theme-primary)]">My MOA</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-[var(--theme-text)] sm:text-5xl">
                {nickname}님의 계정
              </h1>
              <p className="hidden">
                구독, 파티, 결제 수단과 보안 설정을 한곳에서 관리하세요.
              </p>
            </div>
          </MoaCard>

          <section>
            <h2 className="mb-4 text-lg font-black text-[var(--theme-text)]">빠른 실행</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <QuickAction icon={UserPen} title="회원정보 수정" description="개인 정보를 관리하세요" tone="blue" onClick={() => setUpdateUserOpen(true)} />
              <QuickAction icon={KeyRound} title="비밀번호 변경" description="계정 보안을 강화하세요" tone="purple" onClick={() => actions.navigate("/mypage/password")} />
              <QuickAction icon={CreditCard} title="결제수단 관리" description="결제 수단을 관리하세요" tone="green" onClick={() => actions.navigate("/mypage/wallet")} />
              <QuickAction icon={Users} title="내 파티 보기" description="참여 중인 파티를 확인하세요" tone="purple" onClick={() => actions.navigate("/my-parties")} />
              <QuickAction icon={Shield} title="OTP 설정" description="2단계 인증을 설정하세요" tone="blue" onClick={openOtp} />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard icon={Box} title="구독 현황" value={subscriptionCount} helper="구독 상품" actionLabel="구독 상품 보기" tone="blue" onClick={() => actions.navigate("/subscription")} />
            <SummaryCard icon={Users} title="가입 파티" value={partyCount} helper="가입 파티" actionLabel="내 파티 보기" tone="blue" onClick={() => actions.navigate("/my-parties")} />
            <SummaryCard icon={CreditCard} title="결제 수단" value={registeredPayments} helper="등록된 카드" actionLabel="결제수단 관리" tone="blue" onClick={() => actions.navigate("/mypage/wallet")} />
            <SummaryCard icon={BadgeCheck} title="보안 상태" value={otp.enabled ? "안전" : "확인"} helper={otp.enabled ? "보안 설정 정상" : "OTP 설정 권장"} actionLabel="보안 설정 관리" tone="green" onClick={openOtp} />
          </section>

          <MoaCard className="p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-black text-[var(--theme-text)]">계정 정보</h2>
              <MoaButton variant="secondary" size="sm" onClick={() => setUpdateUserOpen(true)}>
                <UserPen className="h-4 w-4" />
                수정
              </MoaButton>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-[var(--theme-border-light)] px-5">
                <InfoRow label="이메일" value={user.userId || user.email} />
                <InfoRow label="닉네임" value={nickname} />
                <InfoRow label="가입일" value={actions.formatDate(user.regDate || user.joinDate || user.createdAt)} />
                <InfoRow
                  label="마케팅 동의"
                  badge={<MoaBadge tone={marketingAgreed ? "success" : "neutral"}>{marketingAgreed ? "동의" : "미동의"}</MoaBadge>}
                />
              </div>

              <div className="rounded-2xl border border-[var(--theme-border-light)] px-5">
                <InfoRow label="전화번호" value={formatPhoneNumber(user.phone || "-")} />
                <InfoRow
                  label="소셜 계정"
                  value={connectedCount > 0 ? `${connectedCount}개 연결` : "미연결"}
                />
                <div className="border-b border-[var(--theme-border-light)] py-4 last:border-b-0">
                  <p className="mb-3 text-sm font-semibold text-[var(--theme-text-muted)]">소셜 연결</p>
                  <div className="flex flex-wrap gap-2">
                    <MoaButton variant={googleConn ? "danger" : "secondary"} size="sm" onClick={actions.handleGoogleClick}>
                      GOOGLE {googleConn ? "해제" : "연결"}
                    </MoaButton>
                    <MoaButton variant={kakaoConn ? "danger" : "secondary"} size="sm" onClick={actions.handleKakaoClick}>
                      KAKAO {kakaoConn ? "해제" : "연결"}
                    </MoaButton>
                  </div>
                </div>
              </div>
            </div>
          </MoaCard>
        </div>

        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <MoaCard className="p-5">
            <div className="space-y-1">
              {sideMenu.map((item) => (
                <SideMenuItem key={item.title} {...item} />
              ))}
            </div>
          </MoaCard>

          <CompletionPanel
            percent={completionPercent}
            otpEnabled={otp.enabled}
            marketingAgreed={marketingAgreed}
            onSecurityClick={openOtp}
          />

          <MoaButton variant="secondary" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            로그아웃
          </MoaButton>
        </aside>
      </div>

      <OtpDialog
        open={otp.modalOpen}
        onOpenChange={actions.handleOtpModalChange}
        otp={otp}
        actions={actions}
        handleOtpConfirm={handleOtpConfirm}
      />
      <BackupCodeDialog backup={backup} />
      <UpdateUserDialog open={updateUserOpen} onOpenChange={setUpdateUserOpen} />
      <DeleteUserDialog open={deleteUserOpen} onOpenChange={setDeleteUserOpen} />
    </MoaPage>
  );
}
