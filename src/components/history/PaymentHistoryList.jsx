import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Calendar, AlertCircle, Receipt } from "lucide-react";
import { getMyPayments } from "../../api/paymentApi";
import PaymentDetailModal from "./PaymentDetailModal";

export default function PaymentHistoryList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await getMyPayments();
      setPayments(data);
    } catch (error) {
      console.error("Failed to load payments", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-500 text-white";
      case "FAILED":
        return "bg-red-500 text-white";
      default:
        return "bg-amber-500 text-white";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "COMPLETED":
        return "결제완료";
      case "FAILED":
        return "결제실패";
      default:
        return "처리중";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Receipt className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">결제 내역이 없습니다</h3>
        <p className="text-slate-500 text-sm">첫 파티에 가입하고 결제를 시작해보세요</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <AnimatePresence>
          {payments.map((payment, index) => (
            <motion.div
              key={payment.paymentId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedPayment(payment)}
              className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {payment.productName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{payment.paymentDate?.split("T")[0] || payment.paymentDate}</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`${getStatusStyle(
                    payment.paymentStatus
                  )} px-2.5 py-1 rounded-md text-xs font-bold shadow-sm`}
                >
                  {getStatusLabel(payment.paymentStatus)}
                </span>
              </div>

              <div className="flex justify-between items-end pt-3 border-t border-slate-100">
                <div className="text-sm text-slate-600">
                  {payment.partyLeaderNickname} 파티장
                </div>
                <div className="text-xl font-bold text-slate-900">
                  {payment.paymentAmount.toLocaleString()}
                  <span className="text-sm text-slate-500 ml-1">원</span>
                </div>
              </div>

              {/* 재시도 로직이 있다면 여기에 표시 */}
              {payment.retryStatus && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 bg-red-50 p-3 rounded-lg border border-red-100 flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-red-700">
                    <p className="font-semibold mb-1">재시도 중 ({payment.attemptNumber}회차)</p>
                    <p>다음 시도: {payment.nextRetryDate}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <PaymentDetailModal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        payment={selectedPayment}
      />
    </>
  );
}
