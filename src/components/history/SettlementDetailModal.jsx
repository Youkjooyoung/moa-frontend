import { X, TrendingUp, Calendar, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

function formatDate(value) {
  if (!value) return "-";
  return String(value).replace("T", " ").split(".")[0];
}

function getStatusLabel(status) {
  if (status === "COMPLETED") return "정산완료";
  if (status === "PENDING") return "정산대기";
  if (status === "IN_PROGRESS") return "진행중";
  if (status === "FAILED") return "실패";
  return "알 수 없음";
}

function getStatusStyle(status) {
  if (status === "COMPLETED") return "bg-emerald-500 text-white";
  if (status === "PENDING") return "bg-amber-500 text-white";
  if (status === "IN_PROGRESS") return "bg-[#3182f6] text-white";
  if (status === "FAILED") return "bg-red-500 text-white";
  return "bg-slate-500 text-white";
}

export default function SettlementDetailModal({ isOpen, onClose, settlement }) {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  if (!isOpen || !settlement) return null;

  const status = settlement.settlementStatus || settlement.status;
  const amount = settlement.netAmount || settlement.amount || 0;

  return (
    <>
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm"
      />

      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <section className={`max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl shadow-2xl ${isDark ? "bg-slate-900 text-white" : "bg-white text-slate-950"}`}>
          <header className={`flex items-start justify-between border-b p-6 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
            <div>
              <h2 className="text-xl font-bold">정산 상세</h2>
              <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>정산 금액과 입금 상태를 확인하세요.</p>
            </div>
            <button type="button" onClick={onClose} className={`rounded-lg p-2 transition ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="space-y-5 p-6">
            <div className={`rounded-2xl p-6 text-center ${isDark ? "bg-slate-800" : "bg-violet-50"}`}>
              <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${isDark ? "bg-slate-700" : "bg-violet-100"}`}>
                <TrendingUp className="h-6 w-6 text-violet-600" />
              </div>
              <p className={`mb-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>정산 금액</p>
              <p className="text-3xl font-bold text-violet-600">
                +{Number(amount).toLocaleString()}
                <span className={`ml-1 text-lg ${isDark ? "text-slate-400" : "text-slate-500"}`}>원</span>
              </p>
            </div>

            <div className="space-y-3">
              <InfoRow icon={<TrendingUp />} label="상품명" value={settlement.productName || settlement.partyTitle || `파티 #${settlement.partyId || "-"}`} isDark={isDark} />
              <InfoRow icon={<Calendar />} label="정산 월" value={settlement.settlementMonth || "-"} isDark={isDark} />
              <InfoRow icon={<Calendar />} label="정산일" value={formatDate(settlement.settlementDate || settlement.transferDate)} isDark={isDark} />

              <div className={`flex items-center justify-between rounded-xl p-4 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}>
                <span className={isDark ? "text-slate-300" : "text-slate-600"}>상태</span>
                <span className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-bold ${getStatusStyle(status)}`}>
                  {status === "COMPLETED" && <CheckCircle className="h-4 w-4" />}
                  {getStatusLabel(status)}
                </span>
              </div>

              {settlement.totalAmount && (
                <AmountRow label="총 결제 금액" amount={settlement.totalAmount} tone="blue" icon={<DollarSign />} />
              )}

              {settlement.commissionAmount && (
                <AmountRow label="수수료" amount={-Number(settlement.commissionAmount)} tone="red" />
              )}
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50 p-4 text-sm text-violet-700">
              <TrendingUp className="mt-0.5 h-5 w-5 shrink-0" />
              <p>정산 금액은 파티 매출과 수수료를 반영해 계산됩니다. 입금 완료 후 지갑 내역에서 다시 확인할 수 있습니다.</p>
            </div>

            {status === "FAILED" && (
              <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="mb-1 font-semibold">정산 실패</p>
                  <p className="text-xs">계좌 정보 또는 입금 상태를 확인한 뒤 고객센터로 문의해주세요.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

function InfoRow({ icon, label, value, isDark }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl p-4 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}>
      <span className="mt-0.5 text-violet-600 [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className={`mb-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
        <p className="truncate font-semibold">{value}</p>
      </div>
    </div>
  );
}

function AmountRow({ label, amount, tone, icon }) {
  const styles = tone === "red"
    ? "border-red-100 bg-red-50 text-red-600"
    : "border-blue-100 bg-blue-50 text-blue-600";

  return (
    <div className={`flex items-center justify-between rounded-xl border p-4 ${styles}`}>
      <span className="flex items-center gap-2 font-medium text-slate-600">
        {icon && <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
        {label}
      </span>
      <span className="font-bold">{Number(amount).toLocaleString()}원</span>
    </div>
  );
}
