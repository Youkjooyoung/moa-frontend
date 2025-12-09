import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePartyStore } from "../../store/party/partyStore";
import { useAuthStore } from "../../store/authStore";
import {
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock
} from "lucide-react";

export default function PartyListPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Zustand Store
  const {
    parties: list,
    myParties,
    loading,
    loadParties,
    loadMyParties
  } = usePartyStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const myPartyIds = Array.isArray(myParties) ? myParties.map(p => p.partyId) : [];

  useEffect(() => {
    loadParties();
    if (user) {
      loadMyParties();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const filteredParties = (list || []).filter((party) => {
    const matchesSearch = party.productName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus
      ? party.partyStatus === filterStatus
      : true;
    return matchesSearch && matchesStatus;
  });

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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading && list.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      {/* Header Section */}
      <div className="relative overflow-hidden border-b border-indigo-100 bg-white/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
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
                나에게 맞는 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">파티</span>를 찾아보세요
              </h1>
              <p className="mt-4 text-lg text-slate-500 font-medium max-w-xl leading-relaxed">
                검증된 파티에 참여하여 프리미엄 구독 서비스를 이용하세요.<br className="hidden md:block" />
                월 구독료를 최대 75%까지 절약할 수 있습니다.
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col items-end gap-3">
              <button
                onClick={() => navigate("/party/create")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 px-6 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-2 hover:-translate-y-1 hover:shadow-indigo-500/30"
              >
                <Sparkles className="w-4 h-4 text-white" />
                파티 만들기
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Background Elements (Light Style) */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-50/50 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none mix-blend-multiply"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Search & Filter Bar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-3 shadow-xl shadow-slate-200/50 border border-white/50 flex flex-col md:flex-row gap-4 items-center mb-12 ring-1 ring-slate-900/5">
          <div className="relative w-full flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
              placeholder="서비스 검색 (예: 넷플릭스, 디즈니+)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 px-2 md:px-0 scrollbar-hide">
            {[
              { value: "", label: "전체" },
              { value: "RECRUITING", label: "모집중" },
              { value: "ACTIVE", label: "진행중" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${filterStatus === filter.value
                  ? "bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Parties Grid */}
        {filteredParties.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[2.5rem] border border-dashed border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-slate-900/5">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-xl text-slate-900 font-bold mb-2">
              파티를 찾을 수 없습니다
            </p>
            <p className="text-slate-500">
              다른 검색어로 시도하거나 직접 파티를 만들어보세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredParties.map((party) => {
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
                          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                            No Img
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
                            {isLeader ? "👑 방장" : "✅ 참여중"}
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
                      <p className="text-sm text-slate-500 mb-4 font-medium">월 정기 구독</p>

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
      </div>
    </div>
  );
}
