import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Calendar, CreditCard, Receipt } from "lucide-react";
import { getMyPayments } from "../../api/paymentApi";
import PaymentDetailModal from "./PaymentDetailModal";
import { useThemeStore } from "@/store/themeStore";

function useHistoryTheme() {
  const { theme } = useThemeStore();

  if (theme === "dark") {
    return {
      accent: "text-[#635bff]",
      accentHover: "group-hover:text-[#635bff]",
      borderHover: "hover:border-[#635bff]/30",
      iconBg: "bg-slate-800",
      spinnerBorder: "border-[#635bff]",
      cardBg: "bg-[#1E293B]",
      cardBorder: "border-gray-700",
      textPrimary: "text-white",
      textSecondary: "text-gray-300",
      textMuted: "text-gray-400",
      borderColor: "border-gray-700",
      emptyBg: "bg-gray-800",
      emptyIcon: "text-gray-500",
    };
  }

  return {
    accent: "text-[#3182f6]",
    accentHover: "group-hover:text-[#3182f6]",
    borderHover: "hover:border-[#3182f6]/30",
    iconBg: "bg-blue-50",
    spinnerBorder: "border-[#3182f6]",
    cardBg: "bg-white",
    cardBorder: "border-slate-200",
    textPrimary: "text-slate-950",
    textSecondary: "text-slate-600",
    textMuted: "text-slate-500",
    borderColor: "border-slate-100",
    emptyBg: "bg-slate-100",
    emptyIcon: "text-slate-400",
  };
}

function getStatusStyle(status) {
  if (status === "COMPLETED") return "bg-emerald-500 text-white";
  if (status === "FAILED") return "bg-red-500 text-white";
  return "bg-amber-500 text-white";
}

function getStatusLabel(status) {
  if (status === "COMPLETED") return "결제완료";
  if (status === "FAILED") return "결제실패";
  return "진행중";
}

function formatDate(value) {
  if (!value) return "-";
  return String(value).replace("T", " ").split(".")[0];
}

export default function PaymentHistoryList() {
  const themeColors = useHistoryTheme();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const loadPayments = useCallback(async () => {
    try {
      const data = await getMyPayments();
      setPayments(data || []);
    } catch (error) {
      console.error("Failed to load payments", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className={`h-8 w-8 animate-spin rounded-full border-2 ${themeColors.spinnerBorder} border-t-transparent`} />
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${themeColors.emptyBg}`}>
          <Receipt className={`h-8 w-8 ${themeColors.emptyIcon}`} />
        </div>
        <h3 className={`mb-2 text-lg font-semibold ${themeColors.textPrimary}`}>결제 내역이 없습니다</h3>
        <p className={`${themeColors.textMuted} text-sm`}>참여한 파티의 결제가 완료되면 이곳에 표시됩니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {payments.map((payment) => (
          <button
            type="button"
            key={payment.paymentId}
            onClick={() => setSelectedPayment(payment)}
            className={`group w-full cursor-pointer rounded-xl border p-4 text-left transition-all hover:shadow-lg ${themeColors.cardBg} ${themeColors.cardBorder} ${themeColors.borderHover}`}
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${themeColors.iconBg}`}>
                  <CreditCard className={`h-5 w-5 ${themeColors.accent}`} />
                </div>
                <div className="min-w-0">
                  <h3 className={`truncate text-base font-bold transition-colors ${themeColors.textPrimary} ${themeColors.accentHover}`}>
                    {payment.productName || "상품 결제"}
                  </h3>
                  <div className={`mt-0.5 flex items-center gap-1.5 text-xs ${themeColors.textMuted}`}>
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(payment.paymentDate)}</span>
                  </div>
                </div>
              </div>
              <span className={`${getStatusStyle(payment.paymentStatus)} shrink-0 rounded-md px-2.5 py-1 text-xs font-bold shadow-sm`}>
                {getStatusLabel(payment.paymentStatus)}
              </span>
            </div>

            <div className={`flex items-end justify-between border-t pt-3 ${themeColors.borderColor}`}>
              <div className={`text-sm ${themeColors.textSecondary}`}>
                {payment.partyLeaderNickname ? `${payment.partyLeaderNickname} 파티` : "파티 결제"}
              </div>
              <div className={`text-xl font-bold ${themeColors.textPrimary}`}>
                {Number(payment.paymentAmount || 0).toLocaleString()}
                <span className={`ml-1 text-sm ${themeColors.textMuted}`}>원</span>
              </div>
            </div>

            {payment.retryStatus && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <div className="text-xs text-red-700">
                  <p className="mb-1 font-semibold">재시도 대기 중{payment.attemptNumber ? ` (${payment.attemptNumber}회)` : ""}</p>
                  <p>다음 시도: {payment.nextRetryDate || "-"}</p>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <PaymentDetailModal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        payment={selectedPayment}
        onRetrySuccess={loadPayments}
      />
    </>
  );
}
