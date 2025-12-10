import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePartyStore } from "../../store/party/partyStore";
import { useAuthStore } from "../../store/authStore";
import ServiceTypeFilter from "../../components/party/ServiceTypeFilter";
import {
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  Filter,
  X
} from "lucide-react";

export default function PartyListPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const observerTarget = useRef(null);

  // Zustand Store
  const {
    parties: list,
    myParties,
    loading: { parties: loadingParties, myParties: loadingMyParties },
    hasMore,
    loadParties,
    loadMyParties
  } = usePartyStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); // "" | "RECRUITING" | "ACTIVE"
  const [selectedProductId, setSelectedProductId] = useState(null);

  const myPartyIds = Array.isArray(myParties) ? myParties.map(p => p.partyId) : [];
  // 최초 로딩만 스피너 표시 (추가 로딩은 하단 스피너)
  const isInitialLoading = loadingParties && list.length === 0;

  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 필터 변경 시 리스트 초기화 및 재검색
  useEffect(() => {
    const params = {
      keyword: debouncedQuery,
      partyStatus: selectedStatus || null,
      productId: selectedProductId || null
    };
    loadParties(params, true); // true = 초기화

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, selectedStatus, selectedProductId]);

  // 내 파티 로드
  useEffect(() => {
    if (user) {
      loadMyParties();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // 무한 스크롤 Observer
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loadingParties) {
      const params = {
        keyword: debouncedQuery,
        partyStatus: selectedStatus || null,
        productId: selectedProductId || null
      };
      loadParties(params, false); // false = 추가 로드
    }
  }, [hasMore, loadingParties, debouncedQuery, selectedStatus, selectedProductId, loadParties]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (observerTarget.current) observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [handleObserver]);


  const getStatusBadge = (status) => {
    const badges = {
      RECRUITING: {
        bg: "bg-indigo-50 text-indigo-700 border-indigo-100",
        text: "모집중",
        dot: "bg-indigo-500",
      },
      ACTIVE: {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
        text: "진행중",
        dot: "bg-emerald-500",
      },
      PENDING_PAYMENT: {
        bg: "bg-amber-50 text-amber-700 border-amber-100",
        text: "결제대기",
        dot: "bg-amber-500",
      },
      CLOSED: {
        bg: "bg-slate-100 text-slate-500 border-slate-200",
        text: "마감",
        dot: "bg-slate-400",
      },
    };
    return badges[status] || badges.RECRUITING;
  };

  const formatDate = (dateData) => {
    if (!dateData) return "-";

    // 배열 형태 처리 [yyyy, MM, dd]
    if (Array.isArray(dateData)) {
      const [year, month, day] = dateData;
      return `${year}년 ${month}월 ${day}일`;
    }

    // 문자열 형태 처리
    return new Date(dateData).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      {/* Header Section */}
      <div className="relative overflow-hidden border-b border-indigo-100 bg-white/60 backdrop-blur-xl transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm">
                  파티 찾기
                </span>
                <span className="flex items-center gap-1 text-slate-500 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                  안전한 매칭
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                나에게 맞는 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 animate-gradient-x">파티</span>를 찾아보세요
              </h1>
              <p className="mt-4 text-lg text-slate-500 font-medium max-w-xl leading-relaxed">
                검증된 파티에 참여하여 프리미엄 구독 서비스를 이용하세요.<br className="hidden md:block" />
                월 구독료를 최대 75%까지 절약할 수 있습니다.
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col items-end gap-3">
              <button
                onClick={() => navigate("/party/create")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 px-6 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-2 hover:-translate-y-1 hover:shadow-indigo-500/30 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-white" />
                파티 만들기
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none mix-blend-multiply opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-50/50 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none mix-blend-multiply opacity-70"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Search & Filter Bar */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-4 shadow-xl shadow-slate-200/50 border border-white/50 flex flex-col gap-6 mb-12 ring-1 ring-slate-900/5">

          {/* Top Row: Search & Status Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center w-full">
            {/* Search Input */}
            <div className="relative w-full flex-[2]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-10 py-3.5 border border-slate-200 rounded-2xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium hover:bg-slate-50"
                placeholder="파티 이름, 방장 닉네임 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex p-1.5 bg-slate-100/80 rounded-2xl w-full md:w-auto flex-shrink-0">
              {[
                { value: "", label: "전체" },
                { value: "RECRUITING", label: "모집중" },
                { value: "ACTIVE", label: "진행중" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedStatus(filter.value)}
                  className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${selectedStatus === filter.value
                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-900/5"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Row: Service Type Filter */}
          <div className="w-full border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 mb-3 px-1">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">서비스 필터</span>
            </div>
            <ServiceTypeFilter
              selectedProductId={selectedProductId}
              onSelect={setSelectedProductId}
            />
          </div>
        </div>

        {/* Parties Grid */}
        {isInitialLoading ? (
          // Skeleton Loading
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-6 h-[300px] animate-pulse border border-slate-100 shadow-sm">
                <div className="flex gap-4 mb-6">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-6 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                </div>
                <div className="h-10 bg-slate-100 rounded-xl mt-auto"></div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          // Empty State
          <div className="text-center py-32 bg-white rounded-[2.5rem] border border-dashed border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-slate-900/5 shadow-inner">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-xl text-slate-900 font-bold mb-2">
              조건에 맞는 파티가 없습니다
            </p>
            <p className="text-slate-500">
              다른 검색어로 시도하거나 필터를 변경해보세요.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedStatus(""); setSelectedProductId(null); }}
              className="mt-6 text-indigo-600 font-bold hover:underline"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {list.map((party) => {
              const badge = getStatusBadge(party.partyStatus);
              const isMyParty = myPartyIds.includes(party.partyId);
              const isLeader = user?.userId === party.partyLeaderId;

              return (
                <div
                  key={party.partyId}
                  onClick={() => navigate(`/party/${party.partyId}`)}
                  className="group relative bg-white rounded-[2rem] p-6 border border-slate-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="flex flex-col h-full">
                    {/* Top: Image & Status */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 shadow-sm border border-slate-100 flex-shrink-0">
                        {party.productImage ? (
                          <img
                            src={party.productImage}
                            alt={party.productName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 text-xs font-bold">
                            {party.productName?.[0]}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* My Status Badge */}
                        {(isLeader || isMyParty) && (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full border ${isLeader
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-indigo-50 text-indigo-700 border-indigo-200"
                            }`}>
                            {isLeader ? "👑 파티장" : "✅ 참여중"}
                          </span>
                        )}

                        <div className={`px-3 py-1 rounded-full border flex items-center gap-1.5 ${badge.bg}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></div>
                          <span className="text-[10px] font-bold uppercase tracking-wider">{badge.text}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Info */}
                    <div className="flex-1 mb-6">
                      <h3 className="text-xl font-bold mb-1 truncate text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {party.productName}
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">월 정기 구독</span>
                        <span className="text-xs font-medium text-slate-400">방장: {party.leaderNickname}</span>
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-sm group/date">
                          <span className="text-slate-500 flex items-center gap-2 transition-colors group-hover/date:text-slate-600">
                            <Calendar className="w-4 h-4 text-slate-400 group-hover/date:text-indigo-500" /> 시작
                          </span>
                          <span className="font-medium text-slate-700">{formatDate(party.startDate)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm group/date">
                          <span className="text-slate-500 flex items-center gap-2 transition-colors group-hover/date:text-slate-600">
                            <Clock className="w-4 h-4 text-slate-400 group-hover/date:text-indigo-500" /> 종료
                          </span>
                          <span className="font-medium text-slate-700">{formatDate(party.endDate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Price & Action */}
                    <div className="pt-5 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-0.5">월 분담금</p>
                          <p className="text-lg font-black text-slate-900 tracking-tight">
                            {party.monthlyFee?.toLocaleString()}원
                          </p>
                        </div>

                        <button className="bg-slate-100 text-slate-600 rounded-xl p-3 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-indigo-500/20">
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Infinite Scroll Loader */}
        <div ref={observerTarget} className="h-20 flex items-center justify-center mt-8">
          {loadingParties && !isInitialLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-300 border-t-indigo-500"></div>
              Loading more...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
