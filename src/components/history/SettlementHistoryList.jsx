import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Calendar } from "lucide-react";
import { getMySettlements } from "../../api/settlementApi";
import SettlementDetailModal from "./SettlementDetailModal";

export default function SettlementHistoryList() {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSettlement, setSelectedSettlement] = useState(null);

  useEffect(() => {
    loadSettlements();
  }, []);

  const loadSettlements = async () => {
    try {
      const data = await getMySettlements();
      setSettlements(data);
    } catch (error) {
      console.error("Failed to load settlements", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-500 text-white";
      case "PENDING":
        return "bg-amber-500 text-white";
      case "IN_PROGRESS":
        return "bg-blue-500 text-white";
      case "FAILED":
        return "bg-red-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "COMPLETED":
        return "정산완료";
      case "PENDING":
        return "대기중";
      case "IN_PROGRESS":
        return "처리중";
      case "FAILED":
        return "실패";
      default:
        return "알수없음";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (settlements.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">정산 내역이 없습니다</h3>
        <p className="text-slate-500 text-sm">파티장으로 활동하면 정산 내역이 생성됩니다</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <AnimatePresence>
          {settlements.map((settlement, index) => (
            <motion.div
              key={settlement.settlementId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedSettlement(settlement)}
              className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                      {settlement.productName || `파티 #${settlement.partyId}`}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{settlement.settlementMonth} 정산분</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`${getStatusStyle(
                    settlement.settlementStatus
                  )} px-2.5 py-1 rounded-md text-xs font-bold shadow-sm`}
                >
                  {getStatusLabel(settlement.settlementStatus)}
                </span>
              </div>

              <div className="flex justify-between items-end pt-3 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  수수료: -{settlement.commissionAmount?.toLocaleString() || 0}원
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-emerald-600">
                    +{settlement.netAmount?.toLocaleString() || 0}
                    <span className="text-sm text-slate-500 ml-1">원</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <SettlementDetailModal
        isOpen={!!selectedSettlement}
        onClose={() => setSelectedSettlement(null)}
        settlement={selectedSettlement}
      />
    </>
  );
}
