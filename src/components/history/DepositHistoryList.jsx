import { useEffect, useState } from "react";
import { Calendar, ShieldCheck } from "lucide-react";
import { getMyDeposits } from "../../api/depositApi";
import DepositDetailModal from "./DepositDetailModal";
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
  if (status === "PAID") return `${themeColors.statusAccent} text-white`;
  if (status === "REFUNDED") return "bg-slate-500 text-white";
  if (status === "FORFEITED") return "bg-red-500 text-white";
  return "bg-amber-500 text-white";
}

function getStatusLabel(status) {
  if (status === "PAID") return "보관 중";
  if (status === "REFUNDED") return "환불완료";
  if (status === "FORFEITED") return "몰수";
  return "진행중";
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
          <ShieldCheck className={`h-8 w-8 ${themeColors.emptyIcon}`} />
        </div>
        <h3 className={`mb-2 text-lg font-semibold ${themeColors.textPrimary}`}>보증금 내역이 없습니다</h3>
        <p className={`${themeColors.textMuted} text-sm`}>파티에 참여하면 보증금 내역이 생성됩니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {deposits.map((deposit) => (
            <div
              key={deposit.depositId}
              onClick={() => setSelectedDeposit(deposit)}
              className={`group cursor-pointer rounded-xl border p-4 transition-all hover:shadow-lg ${themeColors.cardBg} ${themeColors.cardBorder} ${themeColors.borderHover}`}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${themeColors.iconBg}`}>
                    <ShieldCheck className={`h-5 w-5 ${themeColors.accent}`} />
                  </div>
                  <div>
                    <h3 className={`text-base font-bold transition-colors ${themeColors.textPrimary} ${themeColors.accentHover}`}>
                      {deposit.productName || "파티"}
                    </h3>
                    <div className={`mt-0.5 flex items-center gap-1.5 text-xs ${themeColors.textMuted}`}>
                      <Calendar className="h-3 w-3" />
                      <span>
                        {deposit.paymentDate
                          ? new Date(deposit.paymentDate).toLocaleDateString("ko-KR")
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`${getStatusStyle(deposit.depositStatus, themeColors)} rounded-md px-2.5 py-1 text-xs font-bold shadow-sm`}>
                  {getStatusLabel(deposit.depositStatus)}
                </span>
              </div>

              <div className={`flex items-end justify-between border-t pt-3 ${themeColors.borderColor}`}>
                <div className={`text-sm ${themeColors.textSecondary}`}>
                  {deposit.depositStatus === "PAID" && "안전하게 보관 중"}
                  {deposit.depositStatus === "REFUNDED" && "환불 완료"}
                  {deposit.depositStatus === "FORFEITED" && "몰수 처리"}
                </div>
                <div className={`text-xl font-bold ${themeColors.textPrimary}`}>
                  {Number(deposit.depositAmount || 0).toLocaleString()}
                  <span className={`ml-1 text-sm ${themeColors.textMuted}`}>원</span>
                </div>
              </div>
            </div>
          ))}
      </div>

      <DepositDetailModal
        isOpen={!!selectedDeposit}
        onClose={() => setSelectedDeposit(null)}
        deposit={selectedDeposit}
      />
    </>
  );
}
