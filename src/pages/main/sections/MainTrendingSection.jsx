import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Users, Calendar } from "lucide-react";
import { useMainStore } from "@/store/main/mainStore";
import { useThemeStore } from "@/store/themeStore";

export default function MainTrendingSection() {
  const navigate = useNavigate();
  const parties = useMainStore((s) => s.parties);
  const partiesLoading = useMainStore((s) => s.partiesLoading);
  const partiesError = useMainStore((s) => s.partiesError);
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === "dark";

  // 마감 임박 파티 3개 선택 (모집률 높은 순)
  const visible = useMemo(() => {
    const list = Array.isArray(parties) ? [...parties] : [];
    console.log("MainTrendingSection parties:", list); // 디버깅용
    const sorted = list
      .map((party) => {
        const members = party.currentMembers || 0;
        const maxMembers = party.maxMembers || 4;
        const fillRatio = members / maxMembers;
        return { party, fillRatio };
      })
      .sort((a, b) => b.fillRatio - a.fillRatio)
      .map((item) => item.party);
    return sorted.slice(0, 3);
  }, [parties]);

  const goParty = (party) => {
    if (!party.partyId) return;
    navigate(`/party/${party.partyId}`);
  };

  const formatDate = (dateData) => {
    if (!dateData) return "-";
    if (Array.isArray(dateData)) {
      const [year, month, day] = dateData;
      return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
    }
    const date = new Date(dateData);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  const getStatusBadge = (party) => {
    const { partyStatus, maxMembers, currentMembers } = party;
    const remainingSlots = (maxMembers || 0) - (currentMembers || 0);
    if (partyStatus === "RECRUITING" && remainingSlots === 1) {
      return { bg: "bg-gradient-to-r from-orange-500 to-red-500", text: "마감임박", pulse: true };
    }
    const badges = {
      RECRUITING: { bg: "bg-[#635bff]", text: "모집중" },
      ACTIVE: { bg: "bg-emerald-500", text: "파티중" },
      PENDING_PAYMENT: { bg: "bg-amber-500", text: "결제대기" },
      CLOSED: { bg: "bg-gray-400", text: "파티종료" },
    };
    return badges[partyStatus] || badges.RECRUITING;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0.0, 0.2, 1] } },
  };

  return (
    <section className={`relative px-6 md:px-12 py-20 ${isDark ? "bg-slate-800" : "bg-slate-50"} border-b ${isDark ? "border-gray-600" : "border-gray-200"}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
        >
          <div>
            <div className="inline-block px-4 py-2 rounded-xl mb-4 bg-pink-500">
              <span className="font-black text-white">마감 임박 ⏰</span>
            </div>
            <h2 className={`text-4xl md:text-5xl font-black ${isDark ? "text-white" : "text-black"}`}>서두르세요!</h2>
            <p className={`font-medium mt-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>곧 마감되는 파티에 지금 바로 참여하세요.</p>
          </div>
          <Link to="/party">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="px-5 py-3 rounded-xl cursor-pointer bg-black">
              <span className="flex items-center gap-2 text-white font-black">전체 보기 <ArrowUpRight className="w-5 h-5" /></span>
            </motion.div>
          </Link>
        </motion.div>

        {partiesError?.status === 401 && (
          <div className="mb-10">
            <div className={`${isDark ? "bg-[#1E293B]" : "bg-white"} border ${isDark ? "border-gray-600" : "border-gray-200"} rounded-2xl p-6 font-bold`}>
              파티 목록은 로그인 후 확인할 수 있어요.
            </div>
          </div>
        )}

        {partiesLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`${isDark ? "bg-[#1E293B] border-gray-700" : "bg-white border-gray-100"} border rounded-2xl overflow-hidden animate-pulse`}>
                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-50" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded-lg w-1/3" />
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                  <div className="h-6 bg-gray-200 rounded-lg w-2/5 mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}


        {!partiesLoading && (
          <>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((party) => {
                const badge = getStatusBadge(party);
                const remainingSlots = (party.maxMembers || 4) - (party.currentMembers || 0);

                return (
                  <motion.div
                    key={party.partyId}
                    variants={itemVariants}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    onClick={() => goParty(party)}
                    className={`group relative overflow-hidden cursor-pointer transition-all duration-300 ${
                      isDark
                        ? "bg-[#1E293B] border border-gray-700 rounded-2xl hover:shadow-2xl hover:border-gray-600"
                        : "bg-white border border-gray-100 rounded-2xl hover:shadow-2xl hover:border-gray-200"
                    }`}
                  >
                    {/* Service Banner */}
                    <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      {party.productImage ? (
                        <img src={party.productImage} alt={party.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg bg-[#635bff]">
                          {party.productName?.[0]}
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`${badge.bg} ${badge.pulse ? "animate-pulse" : ""} text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg`}>
                          {badge.text}
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#635bff]/5" />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {/* Service Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isDark ? "text-[#635bff] bg-[#635bff]/20" : "text-[#635bff] bg-[#635bff]/10"}`}>
                          {party.productName}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className={`font-bold mb-3 line-clamp-1 transition-colors ${isDark ? "text-white group-hover:text-[#635bff]" : "text-gray-900 group-hover:text-[#635bff]"}`}>
                        {party.title || `${party.productName} 파티`}
                      </h3>

                      {/* Info Row */}
                      <div className={`flex items-center justify-between text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(party.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          <span>{party.currentMembers || 0}/{party.maxMembers || 4}</span>
                          {remainingSlots <= 2 && remainingSlots > 0 && (
                            <span className="text-xs text-orange-500 font-semibold">({remainingSlots}자리)</span>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className={`flex items-center justify-between pt-4 border-t ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                        <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>월 구독료</span>
                        <div className="text-right">
                          <span className={`text-xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>
                            {party.monthlyFee?.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">원</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {visible.length === 0 && (
              <div className="py-16 text-center">
                <div className={`inline-block ${isDark ? "bg-[#1E293B]" : "bg-white"} border ${isDark ? "border-gray-600" : "border-gray-200"} rounded-2xl px-8 py-6 font-black ${isDark ? "text-white" : "text-black"}`}>
                  표시할 파티가 없습니다.
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
