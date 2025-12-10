import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, Calendar, DollarSign, CheckCircle, AlertCircle } from "lucide-react";

export default function SettlementDetailModal({ isOpen, onClose, settlement }) {
  if (!settlement) return null;

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">정산 상세</h2>
                  <p className="text-sm text-slate-500 mt-1">정산 내역의 상세 정보입니다</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Amount */}
                <div className="text-center py-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="text-sm text-slate-600 mb-2">정산 금액</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    +{(settlement.netAmount || settlement.amount || 0).toLocaleString()}
                    <span className="text-lg text-slate-500 ml-1">원</span>
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">상품명</p>
                      <p className="font-semibold text-slate-900">
                        {settlement.productName ||
                          settlement.partyTitle ||
                          `파티 #${settlement.partyId}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">정산 기간</p>
                      <p className="font-semibold text-slate-900">
                        {settlement.settlementMonth || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">정산일자</p>
                      <p className="font-semibold text-slate-900">
                        {settlement.settlementDate || settlement.transferDate || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="text-slate-600 font-medium">상태</span>
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-sm ${getStatusStyle(
                        settlement.settlementStatus || settlement.status
                      )}`}
                    >
                      {(settlement.settlementStatus || settlement.status) === "COMPLETED" && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {getStatusLabel(settlement.settlementStatus || settlement.status)}
                    </span>
                  </div>

                  {settlement.totalAmount && (
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <span className="text-slate-600 font-medium flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        총 결제금액
                      </span>
                      <span className="font-bold text-blue-600">
                        {settlement.totalAmount.toLocaleString()}원
                      </span>
                    </div>
                  )}

                  {settlement.commissionAmount && (
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                      <span className="text-slate-600 font-medium">수수료</span>
                      <span className="font-bold text-red-600">
                        -{settlement.commissionAmount.toLocaleString()}원
                      </span>
                    </div>
                  )}
                </div>

                {/* Info Message */}
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-purple-700">
                    파티에서 발생한 정산 금액입니다. 등록된 정산 계좌로 입금됩니다.
                  </p>
                </div>

                {(settlement.settlementStatus === "FAILED" || settlement.status === "FAILED") && (
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-700 mb-1">정산 실패</p>
                      <p className="text-xs text-red-600">
                        계좌 정보를 확인하거나 고객센터에 문의해주세요.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
