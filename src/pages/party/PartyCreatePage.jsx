import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePartyStore } from "../../store/party/partyStore";
import { useAuthStore } from "../../store/authStore";
import { requestPayment } from "../../utils/paymentHandler";
import { calculateEndDate, getTodayString } from "../../utils/dateUtils";
import { updateOttAccount, fetchPartyDetail } from "../../hooks/party/partyService";
import {
  Check,
  Calendar,
  CreditCard,
  Lock,
  ArrowRight,
  Sparkles,
  Info,
  Users
} from "lucide-react";

export default function PartyCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuthStore();

  // Zustand Store
  const {
    products,
    loadProducts,
    createNewParty
  } = usePartyStore();

  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [maxMembers, setMaxMembers] = useState(4);
  const [createdPartyId, setCreatedPartyId] = useState(null);
  const [ottInfo, setOttInfo] = useState({ ottId: "", ottPassword: "" });
  const [localLoading, setLocalLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(!!searchParams.get("step"));

  useEffect(() => {
    if (!authLoading && !user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadProducts();
      checkRedirectReturn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const checkRedirectReturn = async () => {
    const stepParam = searchParams.get("step");
    const partyIdParam = searchParams.get("partyId");

    if (stepParam && partyIdParam) {
      try {
        const party = await fetchPartyDetail(partyIdParam);
        if (party) {
          setSelectedProduct({
            productId: party.productId,
            productName: party.productName || "Unknown Product",
            price: party.monthlyFee || 0,
            maxUserCount: party.maxMembers
          });
          setCreatedPartyId(Number(partyIdParam));
          setStep(Number(stepParam));
          setMaxMembers(party.maxMembers || 4);
        }
      } catch (error) {
        console.error("Failed to restore", error);
        alert("세션 복구에 실패했습니다.");
        setStep(1);
      } finally {
        setIsRestoring(false);
      }
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setMaxMembers(product.maxUserCount || 4);
    setStep(2);
  };

  const handleDateSubmit = (e) => {
    e.preventDefault();
    if (!dates.startDate || !dates.endDate) {
      alert("날짜를 선택해주세요.");
      return;
    }
    setStep(3);
  };

  const handlePayment = async () => {
    if (!selectedProduct) return;
    setLocalLoading(true);

    try {
      const partyData = {
        productId: selectedProduct.productId,
        maxMembers: maxMembers,
        startDate: dates.startDate,
        endDate: dates.endDate,
        ottId: "",
        ottPassword: "",
      };

      let partyId = createdPartyId;

      if (!partyId) {
        const result = await createNewParty(partyData);
        partyId = result.partyId;
        setCreatedPartyId(partyId);
      }

      const amount = selectedProduct.price;

      localStorage.setItem(
        "pendingPayment",
        JSON.stringify({
          type: "CREATE_PARTY",
          partyId: partyId,
          partyData: partyData,
        })
      );

      await requestPayment(
        `${selectedProduct.productName} 보증금`,
        amount,
        "파티장"
      );
    } catch (error) {
      console.error(error);
      alert(error.message || "결제 초기화에 실패했습니다.");
      setLocalLoading(false);
    }
  };

  const handleOttChange = (e) => {
    const { name, value } = e.target;
    setOttInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleOttSubmit = async (e) => {
    e.preventDefault();
    if (!ottInfo.ottId || !ottInfo.ottPassword) return alert("계정 정보를 입력해주세요.");

    try {
      await updateOttAccount(createdPartyId, ottInfo);
      alert("파티가 생성되었습니다!");
      navigate(`/party/${createdPartyId}`);
    } catch (error) {
      console.error(error);
      alert("계정 정보 저장에 실패했습니다.");
    }
  };

  const steps = [
    { number: 1, label: "서비스 선택", icon: Sparkles },
    { number: 2, label: "설정", icon: Calendar },
    { number: 3, label: "보증금", icon: CreditCard },
    { number: 4, label: "계정 정보", icon: Lock },
  ];

  if (isRestoring || authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Header */}
      <div className="bg-white border-b border-indigo-100 py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-center mb-3 text-slate-900 tracking-tight">
            파티 만들기
          </h1>
          <p className="text-center text-lg text-slate-500 font-medium">
            몇 분 만에 구독료 절약을 시작해보세요.
          </p>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white/80 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isCompleted = step > s.number;

              return (
                <div key={s.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${isCompleted
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                        : isActive
                          ? "bg-white border-indigo-500 text-indigo-600 shadow-lg scale-110"
                          : "bg-slate-50 border-slate-200 text-slate-400"
                        }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <p className={`mt-2 text-xs font-bold uppercase tracking-wider ${isActive ? "text-indigo-600" : "text-slate-400"}`}>
                      {s.label}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 transition-all duration-500 ${step > s.number ? "bg-indigo-600" : "bg-slate-200"}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">

          {/* Step 1: Product Selection */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-900 mb-2">서비스 선택</h2>
                <p className="text-slate-500">공유하고 싶은 구독 서비스를 선택해주세요.</p>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-500">사용 가능한 상품이 없습니다.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.productId}
                      onClick={() => handleProductSelect(product)}
                      className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg hover:shadow-indigo-100 flex items-center gap-4"
                    >
                      <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-slate-200 group-hover:border-indigo-100">
                        {product.image ? (
                          <img src={product.image} alt={product.productName} className="w-full h-full object-cover" />
                        ) : <Sparkles className="w-6 h-6 text-slate-400" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{product.productName}</h3>
                        <p className="text-slate-500 font-bold">{product.price.toLocaleString()} 원</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Date & Size */}
          {step === 2 && (
            <form onSubmit={handleDateSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">{selectedProduct.productName}</p>
                  <p className="text-indigo-600 font-bold">{selectedProduct.price.toLocaleString()} 원/월</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Max Members Slider */}
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-4 flex justify-between">
                    <span className="flex items-center gap-2"><Users className="w-4 h-4" /> 파티 인원</span>
                    <span className="text-white px-2 py-0.5 bg-indigo-500 rounded-md text-xs">{maxMembers} 명</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max={selectedProduct.maxUserCount || 4}
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                    <span>2</span>
                    <span>최대 {selectedProduct.maxUserCount || 4}명</span>
                  </div>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-3">
                    <Calendar className="w-4 h-4 inline mr-2" /> 시작일
                  </label>
                  <input
                    type="date"
                    min={getTodayString()}
                    value={dates.startDate || ""}
                    onChange={(e) => {
                      const start = e.target.value;
                      const end = dates.months ? calculateEndDate(start, dates.months) : "";
                      setDates({ ...dates, startDate: start, endDate: end });
                    }}
                    className="w-full bg-slate-50 border border-slate-300 p-4 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 transition-all text-center"
                  />
                </div>

                {/* Duration Slider */}
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2">
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> 기간 설정</span>
                  </label>

                  <div className="text-center mb-6 py-4">
                    <span className="text-5xl font-black text-indigo-600 tracking-tight">
                      {dates.months || 1}
                    </span>
                    <span className="text-xl font-bold text-slate-400 ml-2">개월</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={dates.months || 1}
                    onChange={(e) => {
                      const m = parseInt(e.target.value);
                      const end = dates.startDate ? calculateEndDate(dates.startDate, m) : "";
                      setDates({ ...dates, months: m, endDate: end });
                    }}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                    <span>1개월</span>
                    <span>1년</span>
                  </div>
                </div>

                {/* Result */}
                {dates.startDate && dates.endDate && (
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex justify-between items-center px-8">
                    <div className="text-center">
                      <span className="block text-xs text-slate-500 uppercase">시작</span>
                      <span className="block font-bold text-slate-900">{dates.startDate}</span>
                    </div>
                    <div className="h-0.5 w-10 bg-slate-300"></div>
                    <div className="text-center">
                      <span className="block text-xs text-slate-500 uppercase">종료</span>
                      <span className="block font-bold text-slate-900">{dates.endDate}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <button type="button" onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-600 font-bold px-4 py-2 transition-colors">이전</button>
                <button type="submit" disabled={!dates.startDate} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed">다음</button>
              </div>
            </form>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900 mb-2">보증금 결제</h2>
                <p className="text-slate-500">파티 생성을 위해 보증금을 결제해주세요.</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center text-slate-500 text-sm">
                  <span>서비스</span>
                  <span className="text-slate-900 font-bold">{selectedProduct.productName}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 text-sm border-b border-slate-200 pb-4">
                  <span>기간</span>
                  <span className="text-slate-900 font-bold">{dates.startDate} ~ {dates.endDate}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-900 font-bold text-lg">총 보증금</span>
                  <span className="text-2xl font-black text-indigo-600">{selectedProduct.price.toLocaleString()} 원</span>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700 text-sm flex gap-3">
                <Info className="w-5 h-5 flex-shrink-0 text-amber-500" />
                <p>보증금은 파티가 성공적으로 종료되면 전액 환불됩니다.</p>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setStep(2)} className="text-slate-400 hover:text-slate-600 font-bold px-4 py-2 transition-colors">이전</button>
                <button onClick={handlePayment} disabled={localLoading} className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-black shadow-lg shadow-indigo-200 flex items-center gap-2">
                  {localLoading ? "처리중..." : <><CreditCard className="w-5 h-5" /> 결제 및 완료</>}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: OTT */}
          {step === 4 && (
            <form onSubmit={handleOttSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 border border-emerald-100">
                  <Check className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">결제 완료!</h2>
                <p className="text-slate-500">공유할 계정 정보를 입력해주세요.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2">아이디 (이메일)</label>
                  <input
                    type="text"
                    name="ottId"
                    value={ottInfo.ottId}
                    onChange={handleOttChange}
                    placeholder="user@example.com"
                    className="w-full bg-slate-50 border border-slate-300 p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2">비밀번호</label>
                  <input
                    type="text"
                    name="ottPassword"
                    value={ottInfo.ottPassword}
                    onChange={handleOttChange}
                    placeholder="비밀번호 입력"
                    className="w-full bg-slate-50 border border-slate-300 p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black shadow-lg shadow-emerald-200">
                저장 및 완료
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
}
