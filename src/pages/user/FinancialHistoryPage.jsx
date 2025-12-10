import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Receipt, ShieldCheck, TrendingUp } from "lucide-react";
import PaymentHistoryList from "../../components/history/PaymentHistoryList";
import DepositHistoryList from "../../components/history/DepositHistoryList";
import SettlementHistoryList from "../../components/history/SettlementHistoryList";

export default function FinancialHistoryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("payment");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["payment", "deposit", "settlement"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const tabs = [
    { id: "payment", label: "결제 내역", icon: Receipt },
    { id: "deposit", label: "보증금 내역", icon: ShieldCheck },
    { id: "settlement", label: "정산 내역", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Header - Matching PartyListPage style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">뒤로가기</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">
              금융 내역
            </h1>
            <p className="text-slate-600">나의 모든 거래 내역을 확인하세요</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="flex border-b border-slate-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`flex-1 py-4 px-4 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Content with animation */}
          <div className="p-6 min-h-[400px]">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "payment" && <PaymentHistoryList />}
              {activeTab === "deposit" && <DepositHistoryList />}
              {activeTab === "settlement" && <SettlementHistoryList />}
            </motion.div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
        >
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
            <Receipt className="w-5 h-5 text-blue-600 mb-2" />
            <p className="text-xs text-slate-600 mb-1">자동 결제</p>
            <p className="text-sm font-bold text-slate-900">매월 정기 결제</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <ShieldCheck className="w-5 h-5 text-purple-600 mb-2" />
            <p className="text-xs text-slate-600 mb-1">보증금 보호</p>
            <p className="text-sm font-bold text-slate-900">안전하게 보관</p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-xl p-4 border border-pink-100">
            <TrendingUp className="w-5 h-5 text-pink-600 mb-2" />
            <p className="text-xs text-slate-600 mb-1">정산 시스템</p>
            <p className="text-sm font-bold text-slate-900">투명한 관리</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
