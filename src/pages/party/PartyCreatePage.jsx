import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RadioGroup } from "@headlessui/react";
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
  Users,
  ChevronRight,
  AlertCircle
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
  const [dates, setDates] = useState({ startDate: "", endDate: "", months: 3 });
  const [maxMembers, setMaxMembers] = useState(4);
  const [createdPartyId, setCreatedPartyId] = useState(null);
  const [ottInfo, setOttInfo] = useState({ ottId: "", ottPassword: "" });
  const [localLoading, setLocalLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(!!searchParams.get("step"));
  const [errors, setErrors] = useState({});

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

  const validateStep2 = () => {
    const newErrors = {};

    if (!maxMembers || maxMembers < 2) {
      newErrors.maxMembers = "파티 인원을 선택해주세요";
    }

    if (!dates.startDate) {
      newErrors.startDate = "시작일을 선택해주세요";
    }

    if (!dates.months || dates.months < 1) {
      newErrors.months = "이용 기간을 선택해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateSubmit = (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      // 스크롤을 첫 번째 에러로 이동
      const firstError = Object.keys(errors)[0];
      const element = document.getElementById(firstError);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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

  const durationOptions = [
    { months: 1, label: "1개월", popular: false },
    { months: 3, label: "3개월", popular: true },
    { months: 6, label: "6개월", popular: false },
    { months: 12, label: "12개월", popular: false },
  ];

  if (isRestoring || authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Header - Matching PartyListPage style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              새 파티 만들기
            </h1>
            <p className="text-lg text-slate-600">
              몇 분 만에 구독료 절약을 시작해보세요
            </p>
          </motion.div>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isCompleted = step > s.number;

              return (
                <div key={s.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <motion.div
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isCompleted ? "#3b82f6" : isActive ? "#ffffff" : "#f1f5f9"
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 ${
                        isCompleted
                          ? "border-blue-600 text-white shadow-lg"
                          : isActive
                          ? "border-blue-600 text-blue-600"
                          : "border-slate-200 text-slate-400"
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </motion.div>
                    <p
                      className={`mt-2 text-xs font-semibold ${
                        isActive ? "text-blue-600" : "text-slate-400"
                      }`}
                    >
                      {s.label}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 transition-all duration-500 ${
                        step > s.number ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Product Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">서비스 선택</h2>
                <p className="text-slate-600">공유하고 싶은 구독 서비스를 선택해주세요</p>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-slate-500">사용 가능한 상품이 없습니다</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <motion.div
                      key={product.productId}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleProductSelect(product)}
                      className="group bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Sparkles className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                            {product.productName}
                          </h3>
                          <p className="text-sm text-slate-500 font-semibold">
                            월 {product.price.toLocaleString()}원
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Date & Size - IMPROVED VERSION */}
          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleDateSubmit}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">파티 설정</h2>
                <p className="text-slate-600">인원과 기간을 설정해주세요</p>
              </div>

              {/* Selected Product Display */}
              <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-lg">{selectedProduct.productName}</p>
                  <p className="text-blue-600 font-semibold">
                    월 {selectedProduct.price.toLocaleString()}원
                  </p>
                </div>
              </div>

              <div className="space-y-8 bg-white rounded-xl p-6 border border-slate-200">
                {/* Max Members - Button Group */}
                <div id="maxMembers">
                  <label className="block text-sm font-bold text-slate-900 mb-4">
                    <span className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      파티 인원
                    </span>
                  </label>

                  <RadioGroup value={maxMembers} onChange={setMaxMembers}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[2, 3, 4, selectedProduct.maxUserCount].filter((n, i, arr) => arr.indexOf(n) === i && n <= selectedProduct.maxUserCount).map((count) => (
                        <RadioGroup.Option
                          key={count}
                          value={count}
                          className={({ checked }) =>
                            `cursor-pointer rounded-xl p-4 border-2 transition-all ${
                              checked
                                ? "border-blue-600 bg-blue-50 shadow-md"
                                : "border-slate-200 hover:border-blue-300 bg-white"
                            }`
                          }
                        >
                          {({ checked }) => (
                            <div className="text-center">
                              <div className={`text-2xl font-bold mb-1 ${checked ? "text-blue-600" : "text-slate-900"}`}>
                                {count}
                              </div>
                              <div className={`text-xs font-semibold ${checked ? "text-blue-600" : "text-slate-500"}`}>
                                {count}명
                              </div>
                              {checked && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="mt-2 flex justify-center"
                                >
                                  <Check className="w-5 h-5 text-blue-600" />
                                </motion.div>
                              )}
                            </div>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>

                  {errors.maxMembers && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center gap-2 text-red-600 text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.maxMembers}</span>
                    </motion.div>
                  )}

                  <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
                    <Info className="w-4 h-4 inline mr-1" />
                    1인당 월 {Math.floor(selectedProduct.price / maxMembers).toLocaleString()}원
                  </div>
                </div>

                {/* Start Date - Improved */}
                <div id="startDate">
                  <label className="block text-sm font-bold text-slate-900 mb-3">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      시작일
                    </span>
                  </label>

                  <div className="relative">
                    <input
                      type="date"
                      min={getTodayString()}
                      value={dates.startDate || ""}
                      onChange={(e) => {
                        const start = e.target.value;
                        const end = dates.months ? calculateEndDate(start, dates.months) : "";
                        setDates({ ...dates, startDate: start, endDate: end });
                        setErrors({ ...errors, startDate: "" });
                      }}
                      className={`w-full bg-slate-50 border-2 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 transition-all font-semibold ${
                        errors.startDate ? "border-red-300" : "border-slate-200 focus:border-blue-500"
                      }`}
                    />
                    {!dates.startDate && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-slate-400 text-sm font-medium">날짜를 선택하세요</span>
                      </div>
                    )}
                  </div>

                  {errors.startDate && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center gap-2 text-red-600 text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.startDate}</span>
                    </motion.div>
                  )}
                </div>

                {/* Duration - Button Group */}
                <div id="months">
                  <label className="block text-sm font-bold text-slate-900 mb-4">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-pink-600" />
                      이용 기간
                    </span>
                  </label>

                  <RadioGroup value={dates.months} onChange={(value) => {
                    const end = dates.startDate ? calculateEndDate(dates.startDate, value) : "";
                    setDates({ ...dates, months: value, endDate: end });
                    setErrors({ ...errors, months: "" });
                  }}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {durationOptions.map((option) => (
                        <RadioGroup.Option
                          key={option.months}
                          value={option.months}
                          className={({ checked }) =>
                            `cursor-pointer rounded-xl p-4 border-2 transition-all relative ${
                              checked
                                ? "border-pink-600 bg-pink-50 shadow-md"
                                : "border-slate-200 hover:border-pink-300 bg-white"
                            }`
                          }
                        >
                          {({ checked }) => (
                            <>
                              {option.popular && (
                                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  인기
                                </div>
                              )}
                              <div className="text-center">
                                <div className={`text-2xl font-bold mb-1 ${checked ? "text-pink-600" : "text-slate-900"}`}>
                                  {option.months}
                                </div>
                                <div className={`text-xs font-semibold ${checked ? "text-pink-600" : "text-slate-500"}`}>
                                  개월
                                </div>
                                {checked && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="mt-2 flex justify-center"
                                  >
                                    <Check className="w-5 h-5 text-pink-600" />
                                  </motion.div>
                                )}
                              </div>
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>

                  {errors.months && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center gap-2 text-red-600 text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.months}</span>
                    </motion.div>
                  )}

                  <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
                    <Info className="w-4 h-4 inline mr-1" />
                    총 {(selectedProduct.price * dates.months).toLocaleString()}원 (월 {selectedProduct.price.toLocaleString()}원 × {dates.months}개월)
                  </div>
                </div>

                {/* Result Preview */}
                {dates.startDate && dates.endDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase">계약 기간</span>
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-center flex-1">
                        <span className="block text-xs text-slate-500 mb-1">시작</span>
                        <span className="block font-bold text-slate-900">{dates.startDate}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                      <div className="text-center flex-1">
                        <span className="block text-xs text-slate-500 mb-1">종료</span>
                        <span className="block font-bold text-slate-900">{dates.endDate}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-500 hover:text-slate-700 font-semibold px-6 py-3 transition-colors"
                >
                  이전
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold shadow-lg transition-all flex items-center gap-2"
                >
                  다음
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.form>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">보증금 결제</h2>
                <p className="text-slate-600">파티 생성을 위해 보증금을 결제해주세요</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">서비스</span>
                  <span className="text-slate-900 font-bold">{selectedProduct.productName}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-4">
                  <span className="text-slate-600">이용 기간</span>
                  <span className="text-slate-900 font-bold">
                    {dates.startDate} ~ {dates.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-slate-900 font-bold text-lg">총 보증금</span>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {selectedProduct.price.toLocaleString()}
                      <span className="text-lg text-slate-500 ml-1">원</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex gap-3">
                <Info className="w-5 h-5 flex-shrink-0" />
                <p>보증금은 파티가 성공적으로 종료되면 전액 환불됩니다</p>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="text-slate-500 hover:text-slate-700 font-semibold px-6 py-3 transition-colors"
                >
                  이전
                </button>
                <button
                  onClick={handlePayment}
                  disabled={localLoading}
                  className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold shadow-lg flex items-center gap-2 disabled:opacity-50 transition-all"
                >
                  {localLoading ? (
                    "처리중..."
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      결제하기
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: OTT Info */}
          {step === 4 && (
            <motion.form
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleOttSubmit}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">결제 완료!</h2>
                <p className="text-slate-600">공유할 계정 정보를 입력해주세요</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-3">
                    아이디 (이메일)
                  </label>
                  <input
                    type="text"
                    name="ottId"
                    value={ottInfo.ottId}
                    onChange={handleOttChange}
                    placeholder="user@example.com"
                    className="w-full bg-slate-50 border border-slate-300 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-3">비밀번호</label>
                  <input
                    type="text"
                    name="ottPassword"
                    value={ottInfo.ottPassword}
                    onChange={handleOttChange}
                    placeholder="비밀번호 입력"
                    className="w-full bg-slate-50 border border-slate-300 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg transition-all"
              >
                <Sparkles className="w-5 h-5 inline mr-2" />
                파티 생성 완료
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
