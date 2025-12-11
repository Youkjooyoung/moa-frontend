import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  CreditCard,
  Building2,
  Wallet,
  Plus,
  ShieldCheck,
  Zap,
  TrendingDown,
  ArrowLeft
} from "lucide-react";
import { useWalletStore } from "../../store/wallet/walletStore";
import { useAuthStore } from "../../store/authStore";
import { requestBillingAuth } from "../../utils/paymentHandler";
import { handleApiError } from "../../utils/errorHandler";
import { toast } from "../../utils/toast";
import {
  getBankLogo,
  getCardLogo,
  getBankTheme,
  getCardTheme,
} from "../../utils/logoHelper";

export default function MyWalletPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthStore();

  // Zustand Store - Selector 패턴 사용
  const deposits = useWalletStore((state) => state.deposits);
  const account = useWalletStore((state) => state.account);
  const card = useWalletStore((state) => state.card);
  const loadingWallet = useWalletStore((state) => state.loading.wallet);
  const loadWalletData = useWalletStore((state) => state.loadWalletData);
  const getTotalDeposit = useWalletStore((state) => state.getTotalDeposit);

  useEffect(() => {
    if (!authLoading && !user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadWalletData();
    }
  }, [user, loadWalletData]);

  // 헬퍼 함수 사용
  const totalDeposit = getTotalDeposit();
  const loading = loadingWallet;

  const goHistory = (tab) => {
    navigate(`/user/financial-history?tab=${tab}`);
  };

  const handleRegisterCard = async () => {
    try {
      if (!user) {
        toast.warning("로그인이 필요합니다");
        navigate("/login");
        return;
      }
      await requestBillingAuth(user.userId);
    } catch (error) {
      const errorMessage = error?.message || "";
      if (errorMessage.includes("취소") || errorMessage.includes("cancel")) return;
      console.error("Card registration failed:", error);
      toast.error(handleApiError(error).message);
    }
  };

  if (authLoading || (loading && !account && !card)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Header - Matching PartyListPage style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight flex items-center gap-3">
              <Wallet className="w-8 h-8 text-blue-600" />
              내 지갑
            </h1>
            <p className="text-slate-600">나의 금융 정보를 관리하세요</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Total Deposit Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => goHistory("deposit")}
          className="group relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl cursor-pointer overflow-hidden hover:scale-[1.02] transition-all duration-300"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-blue-100 text-sm font-semibold mb-3">
              <ShieldCheck className="w-4 h-4" />
              총 보증금
            </div>
            <div className="text-4xl font-bold mb-4 tracking-tight">
              {totalDeposit.toLocaleString()}
              <span className="text-xl font-semibold opacity-90 ml-1">원</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>안전하게 보관중</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                내역 보기
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
          {/* Background Decoration */}
          <div className="absolute -right-8 -bottom-12 w-40 h-40 bg-pink-400 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"></div>
        </motion.div>

        {/* Settlement Account */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              정산 계좌
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goHistory("settlement");
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold uppercase tracking-wider transition-colors"
            >
              내역 →
            </button>
          </div>

          <div
            onClick={() => navigate("/user/account-register")}
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-300 cursor-pointer transition-all hover:shadow-lg"
          >
            {account ? (
              <div className="flex items-center gap-4">
                {(() => {
                  const logoPath = getBankLogo(account.bankName);
                  const theme = getBankTheme(account.bankName);
                  return (
                    <div
                      className={`w-14 h-14 rounded-xl ${theme.bg} flex items-center justify-center overflow-hidden shadow-sm border border-slate-100`}
                    >
                      {logoPath ? (
                        <img
                          src={logoPath}
                          alt={account.bankName}
                          className="w-full h-full object-contain p-1.5"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                      ) : null}
                      <Building2
                        className={`w-6 h-6 ${theme.text} ${logoPath ? "hidden" : ""}`}
                      />
                    </div>
                  );
                })()}
                <div className="flex-1">
                  <div className="font-bold text-slate-900 text-lg">
                    {account.bankName}
                  </div>
                  <div className="text-sm text-slate-500 font-mono tracking-wide">
                    {account.accountNumber?.replace(/(\d{4})(\d{2})(.*)/, "$1-$2-******")}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-all">
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-slate-400 group-hover:text-slate-600 transition-colors">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-slate-200">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold">등록된 계좌 없음</span>
                <span className="text-xs text-slate-400 mt-1">클릭하여 등록하기</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
              결제 수단
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goHistory("payment");
              }}
              className="text-xs text-purple-600 hover:text-purple-700 font-semibold uppercase tracking-wider transition-colors"
            >
              내역 →
            </button>
          </div>

          <div
            onClick={handleRegisterCard}
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-purple-300 cursor-pointer transition-all hover:shadow-lg"
          >
            {card ? (
              <div className="flex items-center gap-4">
                {(() => {
                  const logoPath = getCardLogo(card.cardCompany);
                  const theme = getCardTheme(card.cardCompany);
                  return (
                    <div
                      className={`w-14 h-14 rounded-xl ${theme.bg} flex items-center justify-center overflow-hidden shadow-sm border border-slate-100`}
                    >
                      {logoPath ? (
                        <img
                          src={logoPath}
                          alt={card.cardCompany}
                          className="w-full h-full object-contain p-1.5"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                      ) : null}
                      <CreditCard
                        className={`w-6 h-6 ${theme.text} ${logoPath ? "hidden" : ""}`}
                      />
                    </div>
                  );
                })()}
                <div className="flex-1">
                  <div className="font-bold text-slate-900 text-lg">
                    {card.cardCompany}
                  </div>
                  <div className="text-sm text-slate-500 font-mono tracking-wide">
                    **** **** **** {card.cardNumber?.slice(-4) || "****"}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-purple-50 transition-all">
                    <Zap className="w-4 h-4 text-slate-400 group-hover:text-purple-600 fill-current" />
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-purple-600 font-semibold">
                    변경
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-slate-400 group-hover:text-slate-600 transition-colors">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-slate-200">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold">등록된 카드 없음</span>
                <span className="text-xs text-slate-400 mt-1">클릭하여 등록하기</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-3 pt-4"
        >
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
            <ShieldCheck className="w-5 h-5 text-blue-600 mb-2" />
            <p className="text-xs text-slate-600 mb-1">안전 보증금</p>
            <p className="text-sm font-bold text-slate-900">100% 보호</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <Zap className="w-5 h-5 text-purple-600 mb-2" />
            <p className="text-xs text-slate-600 mb-1">자동 결제</p>
            <p className="text-sm font-bold text-slate-900">편리하게</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
