import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Archive,
  Crown,
  LayoutGrid,
  Loader2,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { getMyClosedParties, getMyParties } from "@/api/partyApi";
import { fetchCurrentUser } from "@/api/authApi";
import {
  MoaBadge,
  MoaButton,
  MoaCard,
  MoaEmptyState,
  MoaPage,
  MoaPageHeader,
} from "@/shared/ui";

const STATUS_META = {
  RECRUITING: { label: "모집 중", tone: "success" },
  ACTIVE: { label: "진행 중", tone: "info" },
  PENDING_PAYMENT: { label: "결제 대기", tone: "warning" },
  CLOSED: { label: "종료", tone: "neutral" },
};

function SegmentButton({ active, icon: Icon, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition ${
        active
          ? "bg-[var(--theme-primary)] text-white"
          : "bg-[var(--theme-surface)] text-[var(--theme-text-muted)] hover:bg-[var(--theme-surface-muted)] hover:text-[var(--theme-text)]"
      }`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}

function PartyCard({ item, currentUserId }) {
  const status = STATUS_META[item.partyStatus] || STATUS_META.RECRUITING;
  const isLeader = item.partyLeaderId === currentUserId;
  const fee = item.monthlyFee ?? item.perPersonAmount ?? item.price ?? 0;

  return (
    <Link to={`/party/${item.partyId}`} state={{ from: "/my-parties" }} className="block">
      <MoaCard className="h-full p-5 transition hover:-translate-y-0.5 hover:border-[var(--theme-primary)] hover:shadow-[var(--theme-shadow)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <MoaBadge tone={status.tone}>{status.label}</MoaBadge>
              {isLeader && (
                <MoaBadge tone="warning">
                  <Crown className="mr-1 h-3 w-3" />
                  파티장
                </MoaBadge>
              )}
            </div>
            <h2 className="truncate text-lg font-black text-[var(--theme-text)]">
              {item.productName || item.partyName || "파티"}
            </h2>
            <p className="mt-1 text-sm font-semibold text-[var(--theme-text-muted)]">
              {isLeader ? "내가 만든 파티" : `${item.leaderNickname || "파티장"}님의 파티`}
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--theme-primary-light)] text-[var(--theme-primary)]">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[var(--theme-bg)] p-4">
            <p className="text-xs font-bold text-[var(--theme-text-muted)]">참여 인원</p>
            <p className="mt-1 text-lg font-black text-[var(--theme-text)]">
              {item.currentMembers ?? 0}/{item.maxMembers ?? "-"}
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--theme-bg)] p-4">
            <p className="text-xs font-bold text-[var(--theme-text-muted)]">월 부담금</p>
            <p className="mt-1 text-lg font-black text-[var(--theme-text)]">
              {Number(fee).toLocaleString("ko-KR")}원
            </p>
          </div>
        </div>
      </MoaCard>
    </Link>
  );
}

export default function MyPartyListPage() {
  const navigate = useNavigate();
  const [activeList, setActiveList] = useState([]);
  const [closedList, setClosedList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showClosed, setShowClosed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [userResponse, partyResponse] = await Promise.all([
          fetchCurrentUser().catch(() => null),
          getMyParties().catch(() => null),
        ]);

        if (userResponse?.success && userResponse.data) {
          setCurrentUserId(userResponse.data.userId);
        }

        const parties = partyResponse?.success ? partyResponse.data : partyResponse?.data;
        setActiveList(Array.isArray(parties) ? parties : []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const loadClosed = async () => {
      if (!showClosed || closedList.length > 0) return;
      const response = await getMyClosedParties().catch(() => null);
      const parties = response?.success ? response.data : response?.data;
      setClosedList(Array.isArray(parties) ? parties : []);
    };

    loadClosed();
  }, [closedList.length, showClosed]);

  const displayList = showClosed ? closedList : activeList;
  const stats = useMemo(
    () => ({
      total: activeList.length,
      leader: displayList.filter((item) => item.partyLeaderId === currentUserId).length,
      member: displayList.filter((item) => item.partyLeaderId !== currentUserId).length,
    }),
    [activeList.length, currentUserId, displayList]
  );

  if (loading) {
    return (
      <MoaPage className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--theme-primary)]" />
      </MoaPage>
    );
  }

  return (
    <MoaPage className="max-w-6xl">
      <MoaPageHeader
        eyebrow="My Party"
        title="내 파티"
        description="참여 중인 파티와 종료된 파티를 한곳에서 확인하세요."
        backLabel="돌아가기"
        onBack={() => navigate("/mypage")}
        action={
          <MoaButton onClick={() => navigate("/party/create")}>
            <Plus className="h-4 w-4" />
            새 파티 만들기
          </MoaButton>
        }
      />

      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <SegmentButton active={!showClosed} icon={LayoutGrid} onClick={() => setShowClosed(false)}>
            진행 중 ({activeList.length})
          </SegmentButton>
          <SegmentButton active={showClosed} icon={Archive} onClick={() => setShowClosed(true)}>
            종료된 파티 ({closedList.length})
          </SegmentButton>
        </div>

        {displayList.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-3">
            <MoaCard className="p-5">
              <p className="text-sm font-semibold text-[var(--theme-text-muted)]">전체</p>
              <p className="mt-2 text-2xl font-black text-[var(--theme-text)]">{showClosed ? closedList.length : stats.total}</p>
            </MoaCard>
            <MoaCard className="p-5">
              <p className="text-sm font-semibold text-[var(--theme-text-muted)]">파티장</p>
              <p className="mt-2 text-2xl font-black text-[var(--theme-text)]">{stats.leader}</p>
            </MoaCard>
            <MoaCard className="p-5">
              <p className="text-sm font-semibold text-[var(--theme-text-muted)]">참여자</p>
              <p className="mt-2 text-2xl font-black text-[var(--theme-text)]">{stats.member}</p>
            </MoaCard>
          </div>
        )}

        {displayList.length === 0 ? (
          <MoaCard className="p-8">
            <MoaEmptyState
              icon={Sparkles}
              title={showClosed ? "종료된 파티가 없습니다" : "가입한 파티가 없습니다"}
              description={showClosed ? "종료된 파티가 생기면 이곳에서 확인할 수 있습니다." : "새로운 파티를 만들거나 참여해보세요."}
              action={
                <div className="flex flex-wrap justify-center gap-3">
                  <MoaButton onClick={() => navigate("/party")}>파티 찾아보기</MoaButton>
                  <MoaButton variant="secondary" onClick={() => navigate("/party/create")}>
                    파티 만들기
                  </MoaButton>
                </div>
              }
            />
          </MoaCard>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {displayList.map((item) => (
              <PartyCard key={item.partyId} item={item} currentUserId={currentUserId} />
            ))}
          </div>
        )}
      </div>
    </MoaPage>
  );
}
