import { useState } from "react";
import { X, RefreshCw, Phone, AlertCircle, CreditCard, Calendar, CheckCircle } from "lucide-react";
import { retryPayment } from "../../api/paymentApi";
import { useThemeStore } from "@/store/themeStore";

function formatDate(value) {
  if (!value) return "-";
  return String(value).replace("T", " ").split(".")[0];
}

function getStatusLabel(status) {
  if (status === "COMPLETED") return "결제완료";
  if (status === "FAILED") return "결제실패";
  return "진행중";
}

function getStatusStyle(status) {
  if (status === "COMPLETED") return "bg-emerald-500 text-white";
  if (status === "FAILED") return "bg-red-500 text-white";
  return "bg-amber-500 text-white";
}

export default function PaymentDetailModal({ isOpen, onClose, payment, onRetrySuccess }) {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [isRetrying, setIsRetrying] = useState(false);

  if (!isOpen || !payment) return null;

  const canRetry =
    payment.paymentStatus === "FAILED" &&
    (payment.canRetry === true || payment.attemptNumber === undefined || payment.attemptNumber < 4);
  const maxRetryExceeded = payment.paymentStatus === "FAILED" && payment.attemptNumber >= 4;

  const handleRetry = async () => {
    if (!payment.paymentId) return;

    setIsRetrying(true);
    try {
      await retryPayment(payment.paymentId);
      alert("결제 재시도가 요청되었습니다.");
      await onRetrySuccess?.();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "결제 재시도에 실패했습니다.");
    } finally {
      setIsRetrying(false);
    }
  };

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
              <h2 className="text-xl font-bold">결제 상세</h2>
              <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>결제 금액과 상태를 확인하세요.</p>
            </div>
            <button type="button" onClick={onClose} className={`rounded-lg p-2 transition ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="space-y-5 p-6">
            <div className={`rounded-2xl p-6 text-center ${isDark ? "bg-slate-800" : "bg-blue-50"}`}>
              <p className={`mb-2 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>결제 금액</p>
              <p className="text-3xl font-bold">
                {Number(payment.paymentAmount || 0).toLocaleString()}
                <span className={`ml-1 text-lg ${isDark ? "text-slate-400" : "text-slate-500"}`}>원</span>
              </p>
            </div>

            <div className="space-y-3">
              <InfoRow icon={<CreditCard />} label="상품명" value={payment.productName || "-"} isDark={isDark} />
              <InfoRow icon={<Calendar />} label="결제일" value={formatDate(payment.paymentDate)} isDark={isDark} />

              <div className="grid grid-cols-2 gap-3">
                <InfoBox label="결제 수단" value={payment.paymentMethod || "-"} isDark={isDark} />
                <InfoBox label="카드 정보" value={`${payment.cardCompany || ""} ${payment.cardNumber || ""}`.trim() || "-"} isDark={isDark} />
              </div>

              <div className={`flex items-center justify-between rounded-xl p-4 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}>
                <span className={isDark ? "text-slate-300" : "text-slate-600"}>상태</span>
                <span className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-bold ${getStatusStyle(payment.paymentStatus)}`}>
                  {payment.paymentStatus === "COMPLETED" && <CheckCircle className="h-4 w-4" />}
                  {getStatusLabel(payment.paymentStatus)}
                </span>
              </div>
            </div>

            {payment.retryStatus && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                <div className="mb-3 flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                  <h4 className="text-sm font-bold text-red-700">재시도 정보</h4>
                </div>
                <div className="space-y-2 text-sm text-red-700">
                  <div className="flex justify-between">
                    <span>시도 횟수</span>
                    <span className="font-semibold">{payment.attemptNumber || 0} / 4회</span>
                  </div>
                  <div className="flex justify-between">
                    <span>다음 시도</span>
                    <span className="font-semibold">{payment.nextRetryDate || "-"}</span>
                  </div>
                  {(payment.retryReason || payment.errorMessage) && (
                    <p className="border-t border-red-200 pt-2 text-xs">{payment.retryReason || payment.errorMessage}</p>
                  )}
                </div>
              </div>
            )}

            {canRetry && (
              <button
                type="button"
                onClick={handleRetry}
                disabled={isRetrying}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3182f6] py-3 font-bold text-white transition hover:bg-[#1b64da] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 ${isRetrying ? "animate-spin" : ""}`} />
                {isRetrying ? "결제 재시도 중" : "결제 재시도"}
              </button>
            )}

            {maxRetryExceeded && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <div>
                    <p className="mb-1 text-sm font-bold text-amber-800">재시도 가능 횟수를 초과했습니다</p>
                    <p className="mb-3 text-xs text-amber-700">카드 정보 또는 결제 상태를 확인한 뒤 고객센터로 문의해주세요.</p>
                    <a href="tel:1588-0000" className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700">
                      <Phone className="h-4 w-4" />
                      고객센터 연결
                    </a>
                  </div>
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
      <span className="mt-0.5 text-[#3182f6] [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className={`mb-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
        <p className="truncate font-semibold">{value}</p>
      </div>
    </div>
  );
}

function InfoBox({ label, value, isDark }) {
  return (
    <div className={`rounded-xl p-4 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}>
      <p className={`mb-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
      <p className="truncate text-sm font-semibold">{value}</p>
    </div>
  );
}
