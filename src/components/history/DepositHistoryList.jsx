import { useEffect, useState } from "react";
import { Calendar, Receipt, ShieldCheck } from "lucide-react";
import { getMyDeposits } from "../../api/depositApi";
import DepositDetailModal from "./DepositDetailModal";
import { useThemeStore } from "@/store/themeStore";

function useHistoryTheme() {
  const { theme } = useThemeStore();

  if (theme === "dark") {
    return {
      accent: "text-emerald-400",
      accentHover: "group-hover:text-emerald-400",
      borderHover: "hover:border-emerald-400/30",
      iconBg: "bg-slate-800",
      spinnerBorder: "border-emerald-400",
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
    accent: "text-emerald-600",
    accentHover: "group-hover:text-emerald-600",
    borderHover: "hover:border-emerald-500/30",
    iconBg: "bg-emerald-50",
    spinnerBorder: "border-emerald-600",
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
  if (status === "PAID") return "bg-[#3182f6] text-white";
  if (status === "REFUNDED") return "bg-emerald-500 text-white";
  if (status === "FORFEITED") return "bg-red-500 text-white";
  return "bg-amber-500 text-white";
}

function getStatusLabel(status) {
  if (status === "PAID") return "보관 중";
  if (status === "REFUNDED") return "환불완료";
  if (status === "FORFEITED") return "몰수";
  return "진행중";
}

function formatDate(value) {
  if (!value) return "-";
  return String(value).replace("T", " ").split(".")[0];
}

export default function DepositHistoryList() {
  const themeColors = useHistoryTheme();
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeposit, setSelectedDeposit] = useState(null);

  useEffect(() => {
    const loadDeposits = async () => {
      try {
        const data = await getMyDeposits();
        setDeposits(data || []);
      } catch (error) {
        console.error("Failed to load deposits", error);
      } finally {
        setLoading(false);
      }
    };

    loadDeposits();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className={`h-8 w-8 animate-spin rounded-full border-2 ${themeColors.spinnerBorder} border-t-transparent`} />
      </div>
    );
  }

  if (deposits.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${themeColors.emptyBg}`}>
          <Receipt className={`h-8 w-8 ${themeColors.emptyIcon}`} />
        </div>
        <h3 className={`mb-2 text-lg font-semibold ${themeColors.textPrimary}`}>보증금 내역이 없습니다</h3>
        <p className={`${themeColors.textMuted} text-sm`}>파티 보증금이 발생하면 이곳에 표시됩니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {deposits.map((deposit) => {
          const status = deposit.depositStatus || deposit.status;
          const amount = deposit.depositAmount || deposit.amount || 0;

          return (
            <button
              type="button"
              key={deposit.depositId || deposit.id}
              onClick={() => setSelectedDeposit(deposit)}
              className={`group w-full cursor-pointer rounded-xl border p-4 text-left transition-all hover:shadow-lg ${themeColors.cardBg} ${themeColors.cardBorder} ${themeColors.borderHover}`}
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${themeColors.iconBg}`}>
                    <ShieldCheck className={`h-5 w-5 ${themeColors.accent}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className={`truncate text-base font-bold transition-colors ${themeColors.textPrimary} ${themeColors.accentHover}`}>
                      {deposit.productName || deposit.partyTitle || "파티 보증금"}
                    </h3>
                    <div className={`mt-0.5 flex items-center gap-1.5 text-xs ${themeColors.textMuted}`}>
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(deposit.paymentDate || deposit.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <span className={`${getStatusStyle(status)} shrink-0 rounded-md px-2.5 py-1 text-xs font-bold shadow-sm`}>
                  {getStatusLabel(status)}
                </span>
              </div>

              <div className={`flex items-end justify-between border-t pt-3 ${themeColors.borderColor}`}>
                <div className={`text-sm ${themeColors.textSecondary}`}>파티 종료까지 안전하게 보관됩니다</div>
                <div className={`text-xl font-bold ${themeColors.textPrimary}`}>
                  {Number(amount).toLocaleString()}
                  <span className={`ml-1 text-sm ${themeColors.textMuted}`}>원</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <DepositDetailModal
        isOpen={!!selectedDeposit}
        onClose={() => setSelectedDeposit(null)}
        deposit={selectedDeposit}
      />
    </>
  );
}
