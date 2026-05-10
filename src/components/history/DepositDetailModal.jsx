import { X, ShieldCheck, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

function formatDate(value) {
  if (!value) return "-";
  return String(value).replace("T", " ").split(".")[0];
}

function getStatusLabel(status) {
  if (status === "PAID") return "보관 중";
  if (status === "REFUNDED") return "환불완료";
  if (status === "FORFEITED") return "몰수";
  return "진행중";
}

function getStatusStyle(status) {
  if (status === "PAID") return "bg-[#3182f6] text-white";
  if (status === "REFUNDED") return "bg-emerald-500 text-white";
  if (status === "FORFEITED") return "bg-red-500 text-white";
  return "bg-amber-500 text-white";
}

export default function DepositDetailModal({ isOpen, onClose, deposit }) {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  if (!isOpen || !deposit) return null;

  const status = deposit.depositStatus || deposit.status;
  const amount = deposit.depositAmount || deposit.amount || 0;

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
              <h2 className="text-xl font-bold">보증금 상세</h2>
              <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>보증금 보관 상태와 환불 정보를 확인하세요.</p>
            </div>
            <button type="button" onClick={onClose} className={`rounded-lg p-2 transition ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="space-y-5 p-6">
            <div className={`rounded-2xl p-6 text-center ${isDark ? "bg-slate-800" : "bg-emerald-50"}`}>
              <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${isDark ? "bg-slate-700" : "bg-emerald-100"}`}>
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <p className={`mb-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>보증금</p>
              <p className="text-3xl font-bold">
                {Number(amount).toLocaleString()}
                <span className={`ml-1 text-lg ${isDark ? "text-slate-400" : "text-slate-500"}`}>원</span>
              </p>
            </div>

            <div className="space-y-3">
              <InfoRow icon={<ShieldCheck />} label="상품명" value={deposit.productName || deposit.partyTitle || "-"} isDark={isDark} />
              <InfoRow icon={<Calendar />} label="보관 시작일" value={formatDate(deposit.paymentDate || deposit.createdAt)} isDark={isDark} />

              <div className={`flex items-center justify-between rounded-xl p-4 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}>
                <span className={isDark ? "text-slate-300" : "text-slate-600"}>상태</span>
                <span className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-bold ${getStatusStyle(status)}`}>
                  {status === "REFUNDED" && <CheckCircle className="h-4 w-4" />}
                  {getStatusLabel(status)}
                </span>
              </div>

              {deposit.refundDate && <InfoRow icon={<Calendar />} label="환불일" value={formatDate(deposit.refundDate)} isDark={isDark} />}

              {deposit.refundAmount && (
                <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                  <span className="font-medium text-slate-600">환불 금액</span>
                  <span className="font-bold text-emerald-600">{Number(deposit.refundAmount).toLocaleString()}원</span>
                </div>
              )}
            </div>

            {status === "REFUNDED" && (
              <Notice tone="success" icon={<CheckCircle />}>
                보증금 환불이 완료되었습니다. 실제 입금 시점은 결제 수단 또는 은행 사정에 따라 달라질 수 있습니다.
              </Notice>
            )}

            {status === "FORFEITED" && (
              <Notice tone="danger" icon={<AlertCircle />}>
                파티 규칙 위반으로 보증금이 몰수되었습니다. 상세 사유는 고객센터에 문의해주세요.
              </Notice>
            )}

            {status === "PAID" && (
              <Notice tone="info" icon={<ShieldCheck />}>
                파티가 정상 종료될 때까지 보증금을 안전하게 보관합니다.
              </Notice>
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
      <span className="mt-0.5 text-emerald-600 [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className={`mb-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
        <p className="truncate font-semibold">{value}</p>
      </div>
    </div>
  );
}

function Notice({ tone, icon, children }) {
  const styles = {
    success: "border-emerald-100 bg-emerald-50 text-emerald-700",
    danger: "border-red-100 bg-red-50 text-red-700",
    info: "border-blue-100 bg-blue-50 text-blue-700",
  };

  return (
    <div className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${styles[tone]}`}>
      <span className="[&>svg]:mt-0.5 [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      <p>{children}</p>
    </div>
  );
}
