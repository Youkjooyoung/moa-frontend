import { useEffect, useState } from "react";
import { Calendar, TrendingUp } from "lucide-react";
import { getMySettlements } from "../../api/settlementApi";
import SettlementDetailModal from "./SettlementDetailModal";
import { useThemeStore } from "@/store/themeStore";

function useHistoryTheme() {
  const { theme } = useThemeStore();

  if (theme === "dark") {
    return {
      accent: "text-[#635bff]",
      accentHover: "group-hover:text-[#635bff]",
      borderHover: "hover:border-[#635bff]/30",
      iconBg: "bg-gradient-to-br from-slate-700 to-slate-800",
      spinnerBorder: "border-[#635bff]",
      statusAccent: "bg-[#635bff]",
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
    accent: "text-[#635bff]",
    accentHover: "group-hover:text-[#635bff]",
    borderHover: "hover:border-[#635bff]/30",
    iconBg: "bg-gradient-to-br from-indigo-50 to-purple-50",
    spinnerBorder: "border-[#635bff]",
    statusAccent: "bg-[#635bff]",
    cardBg: "bg-white",
    cardBorder: "border-slate-200",
    textPrimary: "text-slate-900",
    textSecondary: "text-slate-600",
    textMuted: "text-slate-500",
    borderColor: "border-slate-100",
    emptyBg: "bg-slate-100",
    emptyIcon: "text-slate-400",
  };
}

function getStatusStyle(status, themeColors) {
  if (status === "COMPLETED") return "bg-emerald-500 text-white";
  if (status === "PENDING") return "bg-amber-500 text-white";
  if (status === "IN_PROGRESS") return `${themeColors.statusAccent} text-white`;
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
          <TrendingUp className={`h-8 w-8 ${themeColors.emptyIcon}`} />
        </div>
        <h3 className={`mb-2 text-lg font-semibold ${themeColors.textPrimary}`}>정산 내역이 없습니다</h3>
        <p className={`${themeColors.textMuted} text-sm`}>파티장으로 활동하면 정산 내역이 생성됩니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {settlements.map((settlement) => (
            <div
              key={settlement.settlementId}
              onClick={() => setSelectedSettlement(settlement)}
              className={`group cursor-pointer rounded-xl border p-4 transition-all hover:shadow-lg ${themeColors.cardBg} ${themeColors.cardBorder} ${themeColors.borderHover}`}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${themeColors.iconBg}`}>
                    <TrendingUp className={`h-5 w-5 ${themeColors.accent}`} />
                  </div>
                  <div>
                    <h3 className={`text-base font-bold transition-colors ${themeColors.textPrimary} ${themeColors.accentHover}`}>
                      {settlement.productName || `파티 #${settlement.partyId}`}
                    </h3>
                    <div className={`mt-0.5 flex items-center gap-1.5 text-xs ${themeColors.textMuted}`}>
                      <Calendar className="h-3 w-3" />
                      <span>{settlement.settlementMonth} 정산분</span>
                    </div>
                  </div>
                </div>
                <span className={`${getStatusStyle(settlement.settlementStatus, themeColors)} rounded-md px-2.5 py-1 text-xs font-bold shadow-sm`}>
                  {getStatusLabel(settlement.settlementStatus)}
                </span>
              </div>

              <div className={`flex items-end justify-between border-t pt-3 ${themeColors.borderColor}`}>
                <div className={`text-xs ${themeColors.textMuted}`}>
                  수수료 -{Number(settlement.commissionAmount || 0).toLocaleString()}원
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-emerald-600">
                    +{Number(settlement.netAmount || 0).toLocaleString()}
                    <span className={`ml-1 text-sm ${themeColors.textMuted}`}>원</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <SettlementDetailModal
        isOpen={!!selectedSettlement}
        onClose={() => setSelectedSettlement(null)}
        settlement={selectedSettlement}
      />
    </>
  );
}
