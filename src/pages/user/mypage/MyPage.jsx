import { createElement, useEffect, useMemo, useState } from "react";
import {
  Clock,
  CreditCard,
  KeyRound,
  Link2,
  LogOut,
  Shield,
  Smartphone,
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
      <span className="shrink-0 text-sm font-semibold text-[var(--theme-text-muted)]">
        {label}
      </span>
      <span className="min-w-0 text-right text-sm font-bold text-[var(--theme-text)]">
        {badge || value || "-"}
      </span>
    </div>
  );
}

function MenuItem({ icon, label, active, danger, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-12 w-full items-center rounded-xl px-4 text-sm font-bold transition ${
        active
          ? "bg-[var(--theme-primary-light)] text-[var(--theme-primary)]"
          : danger
            ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            : "text-[var(--theme-text)] hover:bg-[var(--theme-surface-muted)]"
      }`}
    >
      <span className="inline-flex items-center gap-3">
        {createElement(icon, { className: "h-4 w-4" })}
        {label}
      </span>
    </button>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <MoaCard className="flex min-h-24 items-center gap-4 p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--theme-primary-light)] text-[var(--theme-primary)]">
        {createElement(icon, { className: "h-5 w-5" })}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-black leading-none text-[var(--theme-text)]">
          {value}
        </p>
        <p className="mt-2 text-sm font-semibold text-[var(--theme-text-muted)]">
          {label}
        </p>
      </div>
    </MoaCard>
  );
}

export default function MyPage() {
  const { state, actions } = useMyPage();
  const { user, isAdmin, marketingAgreed, googleConn, kakaoConn, loginProvider } = state;
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
  const providerBadge = loginProvider || "EMAIL";

  const menuItems = useMemo(
    () => [
      { label: "회원정보 수정", icon: UserPen, onClick: () => setUpdateUserOpen(true) },
      { label: "비밀번호 변경", icon: KeyRound, onClick: () => actions.navigate("/mypage/password") },
      { label: "구독/결제 관리", icon: CreditCard, onClick: () => actions.navigate("/subscription") },
      { label: "내 파티 목록", icon: Users, onClick: () => actions.navigate("/my-parties") },
      { label: "내 지갑", icon: Wallet, onClick: () => actions.navigate("/mypage/wallet") },
      { label: "로그인 기록", icon: Clock, active: activeView === "history", onClick: () => setActiveView("history") },
      { label: "회원 탈퇴", icon: UserMinus, danger: true, onClick: () => setDeleteUserOpen(true) },
    ],
    [actions, activeView]
  );

  useEffect(() => {
    const fetchCounts = async () => {
      if (!user?.userId) return;

      try {
        const subResponse = await httpClient.get("/subscription", {
          params: { userId: user.userId },
        });
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
          description="운영 현황과 서비스 콘텐츠를 관리합니다."
        />
        <MoaCard className="grid gap-3 p-5 sm:grid-cols-2">
          <MoaButton onClick={() => actions.navigate("/admin")}>관리자 홈</MoaButton>
          <MoaButton variant="secondary" onClick={() => actions.navigate("/admin/landing")}>
            랜딩 관리
          </MoaButton>
        </MoaCard>
      </MoaPage>
    );
  }

  return (
    <MoaPage className="max-w-6xl">
      <MoaPageHeader
        eyebrow="My MOA"
        title={`${nickname}님의 계정`}
        description="구독, 파티, 결제 수단과 보안 설정을 한곳에서 관리하세요."
      />

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <StatCard icon={CreditCard} label="구독 상품" value={subscriptionCount} />
          <StatCard icon={Users} label="가입 파티" value={partyCount} />
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <MoaCard className="p-3">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <MenuItem key={item.label} {...item} />
              ))}
            </div>
          </MoaCard>

          {activeView === "history" ? (
            <MoaCard className="overflow-hidden p-5">
              <LoginHistoryCard loginHistory={loginHistory?.state} onBack={() => setActiveView("main")} />
            </MoaCard>
          ) : (
            <div className="grid gap-6 xl:grid-cols-2">
              <MoaCard className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <UserPen className="h-5 w-5 text-[var(--theme-primary)]" />
                  <h2 className="text-lg font-black text-[var(--theme-text)]">계정 정보</h2>
                </div>
                <InfoRow label="이메일" value={user.userId || user.email} />
                <InfoRow label="닉네임" value={nickname} />
                <InfoRow label="가입일" value={actions.formatDate(user.regDate || user.joinDate || user.createdAt)} />
                <InfoRow
                  label="마케팅 동의"
                  badge={
                    <MoaBadge tone={marketingAgreed ? "success" : "neutral"}>
                      {marketingAgreed ? "동의" : "미동의"}
                    </MoaBadge>
                  }
                />
              </MoaCard>

              <MoaCard className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-[var(--theme-primary)]" />
                  <h2 className="text-lg font-black text-[var(--theme-text)]">로그인 정보</h2>
                </div>
                <InfoRow label="전화번호" value={formatPhoneNumber(user.phone || "-")} />
                <InfoRow
                  label="로그인 방식"
                  badge={<MoaBadge tone="primary">{providerBadge}</MoaBadge>}
                />

                <div className="mt-6 border-t border-[var(--theme-border-light)] pt-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-[var(--theme-primary)]" />
                    <p className="text-sm font-black text-[var(--theme-text)]">소셜 연결</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <MoaButton
                      variant={googleConn ? "danger" : "secondary"}
                      size="sm"
                      onClick={actions.handleGoogleClick}
                    >
                      GOOGLE {googleConn ? "해제" : "연결"}
                    </MoaButton>
                    <MoaButton
                      variant={kakaoConn ? "danger" : "secondary"}
                      size="sm"
                      onClick={actions.handleKakaoClick}
                    >
                      KAKAO {kakaoConn ? "해제" : "연결"}
                    </MoaButton>
                  </div>
                </div>

                <div className="mt-6 border-t border-[var(--theme-border-light)] pt-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[var(--theme-primary)]" />
                    <p className="text-sm font-black text-[var(--theme-text)]">보안 설정</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--theme-bg)] p-4">
                    <div>
                      <p className="font-black text-[var(--theme-text)]">OTP</p>
                      <p className="text-sm text-[var(--theme-text-muted)]">
                        {otp.enabled ? "사용 중" : "사용 안 함"}
                      </p>
                    </div>
                    <MoaButton variant="secondary" size="sm" onClick={openOtp}>
                      {otp.enabled ? "해제" : "설정"}
                    </MoaButton>
                  </div>
                </div>
              </MoaCard>
            </div>
          )}
        </div>

        <MoaCard className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black text-[var(--theme-text)]">계정 세션</p>
            <p className="mt-1 text-sm text-[var(--theme-text-muted)]">
              공용 기기에서는 사용 후 로그아웃해 주세요.
            </p>
          </div>
          <MoaButton variant="secondary" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            로그아웃
          </MoaButton>
        </MoaCard>
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
