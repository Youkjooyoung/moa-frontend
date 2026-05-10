import { useEffect, useState } from "react";
import { Calendar, Receipt, TrendingUp } from "lucide-react";
import { getMySettlements } from "../../api/settlementApi";
import SettlementDetailModal from "./SettlementDetailModal";
import { useThemeStore } from "@/store/themeStore";

function useHistoryTheme() {
  const { theme } = useThemeStore();

  if (theme === "dark") {
    return {
      accent: "text-violet-400",
      accentHover: "group-hover:text-violet-400",
      borderHover: "hover:border-violet-400/30",
      iconBg: "bg-slate-800",
      spinnerBorder: "border-violet-400",
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
    accent: "text-violet-600",
    accentHover: "group-hover:text-violet-600",
    borderHover: "hover:border-violet-500/30",
    iconBg: "bg-violet-50",
    spinnerBorder: "border-violet-600",
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
  if (status === "PENDING") return "bg-amber-500 text-white";
  if (status === "IN_PROGRESS") return "bg-[#3182f6] text-white";
  if (status === "FAILED") return "bg-red-500 text-white";
  return "bg-slate-500 text-white";
}

function getStatusLabel(status) {
  if (status === "COMPLETED") return "정산완료";
  if (status === "PENDING") return "정산대기";
  if (status === "IN_PROGRESS") return "진행중";
  if (status === "FAILED") return "실패";
  return "알 수 없음";
}

function formatDate(value) {
  if (!value) return "-";
  return String(value).replace("T", " ").split(".")[0];
}

export default function SettlementHistoryList() {
  const themeColors = useHistoryTheme();
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSettlement, setSelectedSettlement] = useState(null);

  useEffect(() => {
    const loadSettlements = async () => {
      try {
        const data = await getMySettlements();
        setSettlements(data || []);
      } catch (error) {
        console.error("Failed to load settlements", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettlements();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className={`h-8 w-8 animate-spin rounded-full border-2 ${themeColors.spinnerBorder} border-t-transparent`} />
      </div>
    );
  }

  if (settlements.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${themeColors.emptyBg}`}>
          <Receipt className={`h-8 w-8 ${themeColors.emptyIcon}`} />
        </div>
        <h3 className={`mb-2 text-lg font-semibold ${themeColors.textPrimary}`}>정산 내역이 없습니다</h3>
        <p className={`${themeColors.textMuted} text-sm`}>파티 정산이 완료되면 이곳에 표시됩니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {settlements.map((settlement) => {
          const status = settlement.settlementStatus || settlement.status;
          const amount = settlement.netAmount || settlement.amount || 0;

          return (
            <button
              type="button"
              key={settlement.settlementId || settlement.id}
              onClick={() => setSelectedSettlement(settlement)}
              className={`group w-full cursor-pointer rounded-xl border p-4 text-left transition-all hover:shadow-lg ${themeColors.cardBg} ${themeColors.cardBorder} ${themeColors.borderHover}`}
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${themeColors.iconBg}`}>
                    <TrendingUp className={`h-5 w-5 ${themeColors.accent}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className={`truncate text-base font-bold transition-colors ${themeColors.textPrimary} ${themeColors.accentHover}`}>
                      {settlement.productName || settlement.partyTitle || `파티 #${settlement.partyId || "-"}`}
                    </h3>
                    <div className={`mt-0.5 flex items-center gap-1.5 text-xs ${themeColors.textMuted}`}>
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(settlement.settlementDate || settlement.transferDate)}</span>
                    </div>
                  </div>
                </div>
                <span className={`${getStatusStyle(status)} shrink-0 rounded-md px-2.5 py-1 text-xs font-bold shadow-sm`}>
                  {getStatusLabel(status)}
                </span>
              </div>

              <div className={`flex items-end justify-between border-t pt-3 ${themeColors.borderColor}`}>
                <div className={`text-sm ${themeColors.textSecondary}`}>{settlement.settlementMonth || "정산 예정"}</div>
                <div className={`text-xl font-bold ${themeColors.textPrimary}`}>
                  {Number(amount).toLocaleString()}
                  <span className={`ml-1 text-sm ${themeColors.textMuted}`}>원</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <SettlementDetailModal
        isOpen={!!selectedSettlement}
        onClose={() => setSelectedSettlement(null)}
        settlement={selectedSettlement}
      />
    </>
  );
}
