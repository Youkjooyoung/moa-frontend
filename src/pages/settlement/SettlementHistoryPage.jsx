import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Calendar, ChevronRight, Loader2, ReceiptText, TrendingUp } from "lucide-react";
import { getSettlementDetails, getSettlements } from "@/api/settlementApi";
import {
  MoaBadge,
  MoaButton,
  MoaCard,
  MoaEmptyState,
  MoaInput,
  MoaPage,
  MoaPageHeader,
} from "@/shared/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const statusMeta = {
  PENDING: { label: "대기", tone: "warning" },
  IN_PROGRESS: { label: "처리 중", tone: "info" },
  COMPLETED: { label: "완료", tone: "success" },
  FAILED: { label: "실패", tone: "danger" },
};

function StatusBadge({ status }) {
  const meta = statusMeta[status] || statusMeta.PENDING;
  return <MoaBadge tone={meta.tone}>{meta.label}</MoaBadge>;
}

function formatAmount(amount = 0) {
  return `${Number(amount || 0).toLocaleString("ko-KR")}원`;
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("ko-KR");
}

export default function SettlementHistoryPage() {
  const navigate = useNavigate();
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [details, setDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchSettlements = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getSettlements(startDate, endDate);
      setSettlements(data || []);
    } catch (err) {
      console.error(err);
      setError("정산 내역을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  const handleViewDetails = async (settlement) => {
    setSelectedSettlement(settlement);
    setDetails([]);
    setDetailsLoading(true);

    try {
      const data = await getSettlementDetails(settlement.settlementId);
      setDetails(data || []);
    } catch (err) {
      console.error("정산 상세 조회 실패:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <MoaPage>
      <MoaPageHeader
        eyebrow="Settlement"
        title="정산 내역"
        description="파티별 정산 금액과 처리 상태를 한눈에 확인하세요."
        icon={TrendingUp}
        backLabel="뒤로가기"
        onBack={() => navigate(-1)}
      />

      <MoaCard className="space-y-6">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--theme-text-muted)]">시작일</span>
            <MoaInput type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--theme-text-muted)]">종료일</span>
            <MoaInput type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </label>
          <MoaButton onClick={fetchSettlements}>조회</MoaButton>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-[var(--theme-primary)]" />
          </div>
        ) : settlements.length === 0 ? (
          <MoaEmptyState
            icon={ReceiptText}
            title="정산 내역이 없습니다"
            description="정산이 완료되면 이곳에서 상세 내역을 확인할 수 있습니다."
          />
        ) : (
          <div className="divide-y divide-[var(--theme-border-light)]">
            {settlements.map((settlement) => (
              <button
                key={settlement.settlementId}
                type="button"
                onClick={() => handleViewDetails(settlement)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left transition hover:bg-[var(--theme-primary-light)]/40"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-base font-bold text-[var(--theme-text)]">
                      {settlement.partyName || `파티 #${settlement.partyId}`}
                    </p>
                    <StatusBadge status={settlement.settlementStatus} />
                  </div>
                  <p className="flex items-center gap-1 text-sm text-[var(--theme-text-muted)]">
                    <Calendar className="h-3.5 w-3.5" />
                    {settlement.settlementMonth || formatDate(settlement.settlementDate || settlement.regDate)}
                  </p>
                  {settlement.settlementStatus === "FAILED" && settlement.failReason && (
                    <p className="text-sm font-semibold text-red-500">실패 사유: {settlement.failReason}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <p className="text-right text-lg font-black text-[var(--theme-text)]">
                    {formatAmount(settlement.netAmount)}
                  </p>
                  <ChevronRight className="h-5 w-5 text-[var(--theme-text-muted)]" />
                </div>
              </button>
            ))}
          </div>
        )}
      </MoaCard>

      <Dialog open={!!selectedSettlement} onOpenChange={() => setSelectedSettlement(null)}>
        <DialogContent className="border-[var(--theme-border-light)] bg-[var(--theme-surface)] text-[var(--theme-text)]">
          <DialogHeader>
            <DialogTitle>정산 상세</DialogTitle>
          </DialogHeader>

          {selectedSettlement && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <MoaCard className="p-4">
                  <p className="text-xs font-semibold text-[var(--theme-text-muted)]">정산월</p>
                  <p className="mt-1 font-bold">{selectedSettlement.settlementMonth || "-"}</p>
                </MoaCard>
                <MoaCard className="p-4">
                  <p className="text-xs font-semibold text-[var(--theme-text-muted)]">상태</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedSettlement.settlementStatus} />
                  </div>
                </MoaCard>
                <MoaCard className="p-4">
                  <p className="text-xs font-semibold text-[var(--theme-text-muted)]">총 금액</p>
                  <p className="mt-1 font-bold">{formatAmount(selectedSettlement.totalAmount)}</p>
                </MoaCard>
                <MoaCard className="p-4">
                  <p className="text-xs font-semibold text-[var(--theme-text-muted)]">정산 금액</p>
                  <p className="mt-1 text-lg font-black">{formatAmount(selectedSettlement.netAmount)}</p>
                </MoaCard>
              </div>

              <div>
                <p className="mb-3 font-bold">포함된 결제 내역</p>
                {detailsLoading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-[var(--theme-primary)]" />
                  </div>
                ) : details.length === 0 ? (
                  <p className="rounded-lg bg-[var(--theme-bg)] px-4 py-6 text-center text-sm text-[var(--theme-text-muted)]">
                    결제 내역이 없습니다.
                  </p>
                ) : (
                  <div className="max-h-64 space-y-2 overflow-y-auto">
                    {details.map((payment) => (
                      <div
                        key={payment.paymentId}
                        className="flex items-center justify-between rounded-lg bg-[var(--theme-bg)] px-4 py-3 text-sm"
                      >
                        <span className="font-semibold">{payment.userName || payment.userId}</span>
                        <span className="font-bold">{formatAmount(payment.paymentAmount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MoaPage>
  );
}
