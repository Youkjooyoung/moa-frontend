import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePartyStore } from "../../store/party/partyStore";
import { useAuthStore } from "../../store/authStore";
import ServiceTypeFilter from "../../components/party/ServiceTypeFilter";
import {
  Sparkles,
  Search,
  Calendar,
  Clock,
  X,
  ChevronDown
} from "lucide-react";

// Custom hook for scroll direction detection
function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection("up");
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return scrollDirection;
}

export default function PartyListPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const observerTarget = useRef(null);
  const scrollDirection = useScrollDirection();

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
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("latest"); // latest, price_low, price_high, deadline

  const myPartyIds = Array.isArray(myParties) ? myParties.map(p => p.partyId) : [];
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
    loadParties(params, true);
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
      loadParties(params, false);
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

  const getStatusBadge = (party) => {
    const { partyStatus, maxMembers, currentMembers } = party;

    // 🔥 1자리 남음 = 마감임박
    const remainingSlots = (maxMembers || 0) - (currentMembers || 0);

    if (partyStatus === 'RECRUITING' && remainingSlots === 1) {
      return {
        bg: "bg-orange-500 animate-pulse",
        text: "🔥 마감임박",
      };
    }

    const badges = {
      RECRUITING: {
        bg: "bg-blue-500",
        text: "모집중",
      },
      ACTIVE: {
        bg: "bg-emerald-500",
        text: "진행중",
      },
      PENDING_PAYMENT: {
        bg: "bg-amber-500",
        text: "결제대기",
      },
      CLOSED: {
        bg: "bg-slate-400",
        text: "마감",
      },
    };
    return badges[partyStatus] || badges.RECRUITING;
  };

  const formatDate = (dateData) => {
    if (!dateData) return "-";

    // 배열 형태 처리 [yyyy, MM, dd]
    if (Array.isArray(dateData)) {
      const [year, month, day] = dateData;
      return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
    }

    // 문자열 형태 처리
    const date = new Date(dateData);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // Sort parties based on selected option
  const getSortedParties = (parties) => {
    const sorted = [...parties];

    switch (sortBy) {
      case 'price_low':
        return sorted.sort((a, b) => (a.monthlyFee || 0) - (b.monthlyFee || 0));

      case 'price_high':
        return sorted.sort((a, b) => (b.monthlyFee || 0) - (a.monthlyFee || 0));

      case 'deadline':
        // 마감임박 우선 (remainingSlots 적은 순)
        return sorted.sort((a, b) => {
          const remainingA = (a.maxMembers || 0) - (a.currentMembers || 0);
          const remainingB = (b.maxMembers || 0) - (b.currentMembers || 0);
          return remainingA - remainingB;
        });

      case 'latest':
      default:
        // 최신순 (partyId 내림차순, 또는 createdAt이 있으면 그걸로)
        return sorted.sort((a, b) => (b.partyId || 0) - (a.partyId || 0));
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Section - Softer, Cleaner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              함께 나누면
              <br className="sm:hidden" />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}더 저렴하게
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 mb-8">
              Netflix, Disney+, Wavve 등 프리미엄 OTT 서비스를 최대 75%까지 절약하세요
            </p>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/party/create")}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              파티 만들기
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Filter Bar - Hide on scroll down, show on scroll up */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: scrollDirection === "down" ? -120 : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
          className="sticky top-4 z-30 my-6"
        >
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            {/* Search Input */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-10 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                placeholder="파티 이름, 방장 닉네임 검색"
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

            {/* Filters Row */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Status Filters */}
              {[
                { value: "", label: "전체" },
                { value: "RECRUITING", label: "모집중" },
                { value: "ACTIVE", label: "진행중" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedStatus(filter.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedStatus === filter.value
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}

              {/* More Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="ml-auto px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center gap-1"
              >
                OTT 필터
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* OTT Service Filter - Collapsible */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-slate-200 mt-4 pt-4">
                    <ServiceTypeFilter
                      selectedProductId={selectedProductId}
                      onSelect={setSelectedProductId}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Sort Dropdown - Below Filter Bar */}
        <div className="flex justify-end mb-6">
          <div className="relative inline-block">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all"
            >
              <option value="latest">최신순</option>
              <option value="price_low">가격 낮은순</option>
              <option value="price_high">가격 높은순</option>
              <option value="deadline">마감 임박순</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Parties Grid - 3 columns max, vertical card layout */}
        {isInitialLoading ? (
          // Shimmer Loading
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-xl overflow-hidden animate-pulse">
                <div className="w-full h-80 bg-slate-200" />
                <div className="p-2.5 space-y-1">
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-2 bg-slate-200 rounded w-full" />
                  <div className="h-3.5 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          // Empty State
          <div className="text-center py-16 bg-white rounded-xl">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              조건에 맞는 파티가 없습니다
            </h3>
            <p className="text-slate-500 mb-4">
              다른 검색어나 필터를 시도해보세요
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedStatus("");
                setSelectedProductId(null);
              }}
              className="text-blue-600 font-semibold hover:underline"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {getSortedParties(list).map((party) => {
              const badge = getStatusBadge(party);
              const isMyParty = myPartyIds.includes(party.partyId);
              const isLeader = user?.userId === party.partyLeaderId;

              return (
                <motion.div
                  key={party.partyId}
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.3 } }}
                  onClick={() => navigate(`/party/${party.partyId}`)}
                  className="group relative bg-white border border-slate-100 rounded-xl overflow-hidden cursor-pointer hover:border-slate-200 hover:shadow-lg transition-all duration-300"
                >
                  {/* Large OTT Image - Top (80% of card) */}
                  <div className="relative w-full h-80 bg-gradient-to-br from-slate-50 to-slate-100">
                    {party.productImage ? (
                      <img
                        src={party.productImage}
                        alt={party.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl font-bold text-slate-300">
                          {party.productName?.[0]}
                        </span>
                      </div>
                    )}

                    {/* Status Badge Overlay - Top Right */}
                    <div className="absolute top-3 right-3">
                      <span className={`${badge.bg} text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-lg`}>
                        {badge.text}
                      </span>
                    </div>

                    {/* My Party Badge Overlay - Top Left */}
                    {(isLeader || isMyParty) && (
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold shadow-lg ${
                          isLeader
                            ? "bg-amber-400 text-amber-900"
                            : "bg-white text-blue-600"
                        }`}>
                          {isLeader ? "👑 파티장" : "✓ 참여중"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Below Image (20% of card) - Ultra Compact */}
                  <div className="p-2.5">
                    {/* Service Name */}
                    <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                      {party.productName}
                    </h3>

                    {/* Dates - Ultra Minimal */}
                    <div className="flex items-center gap-0.5 text-[10px] text-slate-400 mb-1.5">
                      <Calendar className="w-2.5 h-2.5" />
                      <span>{formatDate(party.startDate)}</span>
                      <span className="text-slate-300">~</span>
                      <span>{formatDate(party.endDate)}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-[11px] text-slate-500">월</span>
                      <span className="text-base font-bold text-slate-900">
                        {party.monthlyFee?.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-500">원</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Infinite Scroll Loader */}
        <div ref={observerTarget} className="h-20 flex items-center justify-center mt-8">
          {loadingParties && !isInitialLoading && (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-300 border-t-blue-600" />
              로딩 중...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
