import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  CreditCard,
  Building2,
  Wallet,
  Plus,
  ShieldCheck,
  Zap
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
      // ... existing error handling logic ...
      const errorMessage = error?.message || "";
      if (errorMessage.includes("취소") || errorMessage.includes("cancel")) return;
      console.error("Card registration failed:", error);
      toast.error(handleApiError(error).message);
    }
  };

  if (authLoading || (loading && !account && !card)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      {/* Header */}
      <div className="border-b border-indigo-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-md mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-orange-500" />
            내 지갑
          </h1>
          <div className="px-2 py-1 bg-indigo-50 rounded-lg border border-indigo-100">
            <span className="text-xs font-bold text-indigo-600">보안 연결됨</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8 space-y-8 relative">
        {/* Glow Effects */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200/40 rounded-full blur-[80px] pointer-events-none mix-blend-multiply"></div>
        <div className="absolute bottom-40 right-10 w-56 h-56 bg-indigo-200/40 rounded-full blur-[80px] pointer-events-none mix-blend-multiply"></div>

        {/* Total Deposit Card */}
        <div
          onClick={() => goHistory("deposit")}
          className="group relative bg-gradient-to-br from-[#ea580c] to-red-600 rounded-[2rem] p-7 text-white shadow-xl shadow-orange-500/30 cursor-pointer overflow-hidden ring-1 ring-orange-500/20 hover:scale-[1.02] transition-all duration-300"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-orange-100/90 text-sm font-bold mb-2 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4" />
              총 보증금
            </div>
            <div className="text-4xl font-black mb-6 tracking-tight">
              {totalDeposit.toLocaleString()} <span className="text-2xl font-bold opacity-80">원</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-orange-100 bg-black/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm group-hover:bg-black/20 transition-colors">
              내역 보기 <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          {/* Background Decoration */}
          <div className="absolute -right-8 -bottom-12 w-40 h-40 bg-orange-400 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
        </div>

        {/* Settlement Account */}
        <div className="space-y-3 relative z-10">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              정산 계좌
            </h3>
            <button
              onClick={(e) => { e.stopPropagation(); goHistory("settlement"); }}
              className="text-xs text-orange-500 hover:text-orange-600 font-bold uppercase tracking-wider transition-colors"
            >
              내역
            </button>
          </div>
          <div
            onClick={() => navigate("/user/account-register")}
            className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-orange-300 cursor-pointer transition-all hover:shadow-lg hover:shadow-orange-500/10"
          >
            {account ? (
              <div className="flex items-center gap-4">
                {(() => {
                  const logoPath = getBankLogo(account.bankName);
                  const theme = getBankTheme(account.bankName);
                  return (
                    <div
                      className={`w-14 h-14 rounded-2xl ${theme.bg} flex items-center justify-center overflow-hidden shadow-sm border border-slate-100`}
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
                      <Building2 className={`w-6 h-6 ${theme.text} ${logoPath ? "hidden" : ""}`} />
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
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-orange-600 transition-all">
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-orange-500" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-slate-400 group-hover:text-slate-600 transition-colors">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-slate-200">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">등록된 계좌 없음</span>
                <span className="text-xs text-slate-400 mt-1">클릭하여 등록하기</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-3 relative z-10">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              결제 수단
            </h3>
            <button
              onClick={(e) => { e.stopPropagation(); goHistory("payment"); }}
              className="text-xs text-orange-500 hover:text-orange-600 font-bold uppercase tracking-wider transition-colors"
            >
              내역
            </button>
          </div>
          <div
            onClick={handleRegisterCard}
            className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-orange-300 cursor-pointer transition-all hover:shadow-lg hover:shadow-orange-500/10"
          >
            {card ? (
              <div className="flex items-center gap-4">
                {(() => {
                  const logoPath = getCardLogo(card.cardCompany);
                  const theme = getCardTheme(card.cardCompany);
                  return (
                    <div
                      className={`w-14 h-14 rounded-2xl ${theme.bg} flex items-center justify-center overflow-hidden shadow-sm border border-slate-100`}
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
                      <CreditCard className={`w-6 h-6 ${theme.text} ${logoPath ? "hidden" : ""}`} />
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
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-orange-600 transition-all">
                    <Zap className="w-4 h-4 text-slate-400 group-hover:text-orange-500 fill-current" />
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-orange-600 font-medium">변경</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-slate-400 group-hover:text-slate-600 transition-colors">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-slate-200">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">등록된 카드 없음</span>
                <span className="text-xs text-slate-400 mt-1">클릭하여 등록하기</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
