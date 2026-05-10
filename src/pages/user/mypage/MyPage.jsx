import { createElement, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Clock,
  CreditCard,
  KeyRound,
  LogOut,
  Shield,
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

function StatCard({ icon, label, value, helper }) {
  return (
    <MoaCard className="flex min-h-24 items-center gap-4 p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--theme-primary-light)] text-[var(--theme-primary)]">
        {createElement(icon, { className: "h-5 w-5" })}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-black leading-none text-[var(--theme-text)]">{value}</p>
        <p className="mt-2 text-sm font-semibold text-[var(--theme-text)]">{label}</p>
        {helper && <p className="mt-1 text-xs font-medium text-[var(--theme-text-muted)]">{helper}</p>}
      </div>
    </MoaCard>
  );
}

function ActionTile({ icon, title, description, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-28 w-full items-start justify-between gap-4 rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-[var(--theme-shadow-soft)] ${
        danger
          ? "border-red-100 bg-red-50/70 text-red-600 dark:border-red-500/20 dark:bg-red-500/10"
          : "border-[var(--theme-border-light)] bg-[var(--theme-surface)] text-[var(--theme-text)] hover:border-[var(--theme-primary)]/30"
      }`}
    >
      <span className="flex min-w-0 gap-4">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            danger ? "bg-red-100 text-red-600 dark:bg-red-500/15" : "bg-[var(--theme-primary-light)] text-[var(--theme-primary)]"
          }`}
        >
          {createElement(icon, { className: "h-5 w-5" })}
        </span>
        <span className="min-w-0">
          <span className="block text-base font-black">{title}</span>
          <span className={`mt-1 block text-sm leading-6 ${danger ? "text-red-500/80" : "text-[var(--theme-text-muted)]"}`}>
            {description}
          </span>
        </span>
      </span>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-80" />
    </button>
  );
}

function ConnectedAccount({ label, connected, onClick }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--theme-bg)] p-4">
      <div className="min-w-0">
        <p className="font-black text-[var(--theme-text)]">{label}</p>
        <p className="mt-1 text-sm text-[var(--theme-text-muted)]">
          {connected ? "계정이 연결되어 있습니다" : "간편 로그인을 연결할 수 있습니다"}
        </p>
      </div>
      <MoaButton variant={connected ? "secondary" : "primary"} size="sm" onClick={onClick}>
        {connected ? "해제" : "연결"}
      </MoaButton>
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

  const accountStatus = useMemo(() => {
    const connectedCount = Number(Boolean(googleConn)) + Number(Boolean(kakaoConn));
    return {
      securityLabel: otp.enabled ? "OTP 사용 중" : "OTP 미설정",
      socialLabel: connectedCount > 0 ? `간편 로그인 ${connectedCount}개 연결` : "간편 로그인 미연결",
    };
  }, [googleConn, kakaoConn, otp.enabled]);

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
          description="관리자 권한으로 서비스 운영 화면에 접근할 수 있습니다."
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
          description="최근 접속 내역을 확인하고 낯선 활동이 있는지 점검하세요."
          onBack={() => setActiveView("main")}
          backLabel="마이페이지"
        />
        <MoaCard className="overflow-hidden p-5">
          <LoginHistoryCard loginHistory={loginHistory?.state} onBack={() => setActiveView("main")} />
        </MoaCard>
      </MoaPage>
    );
  }

  return (
    <MoaPage className="max-w-6xl">
      <MoaPageHeader
        eyebrow="My MOA"
        title={`${nickname}님의 계정`}
        description="내 정보, 결제 수단, 파티 활동과 보안 설정을 한곳에서 관리하세요."
        action={
          <MoaButton variant="secondary" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            로그아웃
          </MoaButton>
        }
      />

      <div className="space-y-6">
        <MoaCard className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[1.4fr_1fr]">
            <div className="p-6 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-[var(--theme-primary)]">계정 요약</p>
                  <h2 className="mt-2 text-2xl font-black text-[var(--theme-text)]">
                    {nickname}님, 오늘도 안전하게 관리 중입니다
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--theme-text-muted)]">
                    민감한 로그인 방식명 대신 연결 상태와 보안 상태만 보여줍니다.
                  </p>
                </div>
                <MoaBadge tone={otp.enabled ? "success" : "warning"}>
                  {accountStatus.securityLabel}
                </MoaBadge>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <StatCard icon={CreditCard} label="구독 상품" value={subscriptionCount} helper="현재 이용 중" />
                <StatCard icon={Users} label="가입 파티" value={partyCount} helper="참여 내역 기준" />
              </div>
            </div>

            <div className="border-t border-[var(--theme-border-light)] bg-[var(--theme-bg)] p-6 sm:p-7 lg:border-l lg:border-t-0">
              <p className="text-sm font-black text-[var(--theme-text)]">빠른 확인</p>
              <div className="mt-4 space-y-3">
                <InfoRow label="연락처" value={formatPhoneNumber(user.phone || "-")} />
                <InfoRow label="간편 로그인" value={accountStatus.socialLabel} />
                <InfoRow
                  label="마케팅 알림"
                  badge={<MoaBadge tone={marketingAgreed ? "success" : "neutral"}>{marketingAgreed ? "수신 동의" : "미동의"}</MoaBadge>}
                />
              </div>
            </div>
          </div>
        </MoaCard>

        <section>
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-[var(--theme-text)]">무엇을 관리할까요?</h2>
              <p className="mt-1 text-sm text-[var(--theme-text-muted)]">자주 쓰는 작업을 목적별로 묶었습니다.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ActionTile
              icon={UserPen}
              title="내 정보 수정"
              description="닉네임, 연락처, 마케팅 수신 설정을 변경합니다."
              onClick={() => setUpdateUserOpen(true)}
            />
            <ActionTile
              icon={CreditCard}
              title="구독/결제 관리"
              description="구독 상품과 결제 수단을 확인합니다."
              onClick={() => actions.navigate("/subscription")}
            />
            <ActionTile
              icon={Users}
              title="내 파티"
              description="참여 중인 파티와 만든 파티를 확인합니다."
              onClick={() => actions.navigate("/my-parties")}
            />
            <ActionTile
              icon={Wallet}
              title="내 지갑"
              description="정산 계좌, 카드, 보증금을 관리합니다."
              onClick={() => actions.navigate("/mypage/wallet")}
            />
            <ActionTile
              icon={KeyRound}
              title="비밀번호 변경"
              description="주기적으로 비밀번호를 바꿔 계정을 보호하세요."
              onClick={() => actions.navigate("/mypage/password")}
            />
            <ActionTile
              icon={Clock}
              title="로그인 기록"
              description="최근 로그인 내역과 접속 위치를 점검합니다."
              onClick={() => setActiveView("history")}
            />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <MoaCard className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <UserPen className="h-5 w-5 text-[var(--theme-primary)]" />
              <h2 className="text-lg font-black text-[var(--theme-text)]">기본 정보</h2>
            </div>
            <InfoRow label="이메일" value={user.userId || user.email} />
            <InfoRow label="닉네임" value={nickname} />
            <InfoRow label="가입일" value={actions.formatDate(user.regDate || user.joinDate || user.createdAt)} />
            <InfoRow
              label="알림 설정"
              badge={
                <MoaBadge tone={marketingAgreed ? "success" : "neutral"}>
                  {marketingAgreed ? "혜택 알림 수신" : "혜택 알림 미수신"}
                </MoaBadge>
              }
            />
          </MoaCard>

          <MoaCard className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-[var(--theme-primary)]" />
              <h2 className="text-lg font-black text-[var(--theme-text)]">보안 및 연결</h2>
            </div>

            <div className="space-y-3">
              <ConnectedAccount label="Google 계정" connected={googleConn} onClick={actions.handleGoogleClick} />
              <ConnectedAccount label="Kakao 계정" connected={kakaoConn} onClick={actions.handleKakaoClick} />
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--theme-bg)] p-4">
                <div className="min-w-0">
                  <p className="font-black text-[var(--theme-text)]">2단계 인증</p>
                  <p className="mt-1 text-sm text-[var(--theme-text-muted)]">
                    {otp.enabled ? "OTP로 한 번 더 보호 중입니다" : "OTP를 설정하면 계정 보안이 강화됩니다"}
                  </p>
                </div>
                <MoaButton variant="secondary" size="sm" onClick={openOtp}>
                  {otp.enabled ? "관리" : "설정"}
                </MoaButton>
              </div>
            </div>
          </MoaCard>
        </div>

        <MoaCard className="flex flex-col gap-4 border-red-100 bg-red-50/60 p-5 dark:border-red-500/20 dark:bg-red-500/10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/15">
              <UserMinus className="h-5 w-5" />
            </div>
            <div>
              <p className="font-black text-red-600">계정 탈퇴</p>
              <p className="mt-1 text-sm leading-6 text-red-500/80">
                탈퇴 전 구독, 정산, 보증금 상태를 먼저 확인해주세요.
              </p>
            </div>
          </div>
          <MoaButton variant="danger" onClick={() => setDeleteUserOpen(true)}>
            탈퇴 진행
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
