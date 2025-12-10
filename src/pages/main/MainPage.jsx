import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart2,
  BadgeCheck,
  CalendarDays,
  Compass,
  Flame,
  PlayCircle,
  Sparkle,
  Users,
  Wallet2,
} from "lucide-react";

import { MOCK_PARTIES } from "@/constants/constants";
import { PartyStatus } from "@/constants/types";

const numberFormatter = new Intl.NumberFormat("ko-KR");

const SERVICE_COLORS = {
  Netflix: "from-rose-500 via-orange-400 to-yellow-300",
  "Disney+": "from-sky-500 via-blue-500 to-indigo-500",
  "Youtube Premium": "from-red-500 via-pink-500 to-orange-400",
  Spotify: "from-emerald-400 via-green-500 to-teal-500",
  Wavve: "from-indigo-400 via-blue-500 to-cyan-400",
  Watcha: "from-fuchsia-500 via-pink-500 to-rose-400",
};

const CATEGORY_ICONS = {
  Video: PlayCircle,
  Music: Sparkle,
  Productivity: Compass,
};

const STAT_TONES = {
  emerald: {
    container: "bg-emerald-50 border-emerald-100",
    icon: "bg-emerald-100 text-emerald-700",
  },
  cyan: {
    container: "bg-cyan-50 border-cyan-100",
    icon: "bg-cyan-100 text-cyan-700",
  },
  amber: {
    container: "bg-amber-50 border-amber-100",
    icon: "bg-amber-100 text-amber-700",
  },
};

const STATUS_LABEL = {
  [PartyStatus.RECRUITING]: "모집중",
  [PartyStatus.FULL]: "인원 마감",
  [PartyStatus.ACTIVE]: "진행중",
  [PartyStatus.ENDED]: "종료",
};

function ProgressBar({ value }) {
  return (
    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-[width] duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function StatPill({ icon: Icon, label, value, tone = "emerald" }) {
  const toneClass = STAT_TONES[tone] ?? STAT_TONES.emerald;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${toneClass.container}`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${toneClass.icon}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-xs text-slate-500">{label}</span>
        <span className="text-lg font-semibold text-slate-900">{value}</span>
      </div>
    </div>
  );
}

export default function MainPage() {
  const recruitingParties = useMemo(
    () =>
      MOCK_PARTIES.filter((party) => party.status === PartyStatus.RECRUITING),
    []
  );

  const [highlightIndex, setHighlightIndex] = useState(0);

  useEffect(() => {
    if (recruitingParties.length === 0) return undefined;

    const timer = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % recruitingParties.length);
    }, 4200);

    return () => clearInterval(timer);
  }, [recruitingParties.length]);

  const highlightedParty = recruitingParties[highlightIndex];

  const seats = useMemo(() => {
    const total = MOCK_PARTIES.reduce(
      (acc, party) => acc + party.maxMembers,
      0
    );
    const empty = MOCK_PARTIES.reduce(
      (acc, party) => acc + (party.maxMembers - party.currentMembers),
      0
    );

    return {
      total,
      empty,
    };
  }, []);

  const categorySummary = useMemo(() => {
    return MOCK_PARTIES.reduce((acc, party) => {
      acc[party.category] = (acc[party.category] || 0) + 1;
      return acc;
    }, {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.16)_0,_transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(14,165,233,0.12)_0,_transparent_30%)]" />
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur border border-white/20">
                <Sparkle className="w-4 h-4" />
                <span className="font-medium">
                  실시간 모집 파티 {recruitingParties.length}곳
                </span>
              </div>

              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-200 font-semibold">
                  NEW EXPERIENCE
                </p>
                <h1 className="text-4xl sm:text-5xl font-black leading-tight">
                  OTT / 뮤직 구독을{" "}
                  <span className="text-emerald-300">새로운 방식</span>으로
                  나눠쓰세요.
                </h1>
                <p className="text-lg text-slate-200 leading-relaxed">
                  파티 상태, 남은 슬롯, 다음 결제일까지 모두 한눈에. 빠르게
                  움직이는 실시간 대시보드에서 바로 참여할 수 있어요.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/parties"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-400 text-slate-900 font-semibold shadow-lg shadow-emerald-500/30 hover:translate-y-[-2px] transition-transform"
                >
                  지금 파티 보기
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/parties/create"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  파티 만들기
                </Link>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur">
                  <BadgeCheck className="w-5 h-5 text-emerald-300" />
                  <span className="text-sm text-slate-200">
                    실명 인증/자동 정산
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-slate-900">
                <StatPill
                  icon={Users}
                  label="총 좌석"
                  value={`${numberFormatter.format(seats.total)}석`}
                  tone="emerald"
                />
                <StatPill
                  icon={Flame}
                  label="모집중"
                  value={`${numberFormatter.format(seats.empty)}석 여유`}
                  tone="cyan"
                />
                <StatPill
                  icon={Wallet2}
                  label="월 평균 분담금"
                  value={`₩${numberFormatter.format(3500)}`}
                  tone="amber"
                />
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-10 -top-6 w-36 h-36 bg-emerald-400 blur-3xl opacity-50" />
              <div className="absolute -right-12 -bottom-10 w-40 h-40 bg-sky-400 blur-3xl opacity-40" />

              <div className="relative bg-white text-slate-900 rounded-3xl shadow-2xl border border-white/60 p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    실시간 하이라이트
                  </p>
                  <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    <Flame className="w-4 h-4" />
                    <span>자동 순환</span>
                  </div>
                </div>

                {highlightedParty ? (
                  <div className="space-y-4">
                    <div
                      className={`p-4 rounded-2xl text-white bg-gradient-to-r ${
                        SERVICE_COLORS[highlightedParty.serviceName] ??
                        "from-slate-700 via-slate-800 to-slate-900"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-lg font-bold">
                            {highlightedParty.serviceName.slice(0, 1)}
                          </div>
                          <div>
                            <p className="text-xs text-white/70">
                              {highlightedParty.hostName} 님의 파티
                            </p>
                            <p className="font-semibold text-lg">
                              {highlightedParty.serviceName}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm px-3 py-1 rounded-full bg-white/20 border border-white/30">
                          {STATUS_LABEL[highlightedParty.status]}
                        </span>
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed">
                        {highlightedParty.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>
                          남은 좌석{" "}
                          {highlightedParty.maxMembers -
                            highlightedParty.currentMembers}{" "}
                          / {highlightedParty.maxMembers}
                        </span>
                        <span className="font-semibold text-slate-800">
                          ₩
                          {numberFormatter.format(
                            highlightedParty.pricePerMonth
                          )}{" "}
                          /월
                        </span>
                      </div>
                      <ProgressBar
                        value={
                          (highlightedParty.currentMembers /
                            highlightedParty.maxMembers) *
                          100
                        }
                      />
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl">
                        <Users className="w-4 h-4" />
                        <span>{highlightedParty.currentMembers}명 참여중</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl">
                        <BarChart2 className="w-4 h-4" />
                        <span>
                          다음 결제 {highlightedParty.nextBillingDate}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/parties/${highlightedParty.id}`}
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                    >
                      <div>
                        <p className="text-xs text-slate-300">바로 확인하기</p>
                        <p className="font-semibold">파티 상세 이동</p>
                      </div>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 py-10">
                    모집중인 파티가 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 py-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex gap-3 items-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">실시간 업데이트</p>
              <p className="font-semibold text-lg">상태/결제일 자동 반영</p>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex gap-3 items-center">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">신뢰 보증</p>
              <p className="font-semibold text-lg">호스트 검증 & 안전 결제</p>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">즉시 매칭</h3>
            <p className="text-gray-500">가입 즉시 매칭! 실시간 정보 반영.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex gap-3 items-center">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Wallet2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">분담금 계산</p>
              <p className="font-semibold text-lg">좌석에 맞춰 자동 산정</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-emerald-600 font-semibold">
              LIVE PARTY BOARD
            </p>
            <h2 className="text-2xl font-bold">지금 가장 인기 있는 파티</h2>
            <p className="text-slate-500 text-sm">
              남은 좌석과 결제일을 확인하고 바로 들어가세요.
            </p>
          </div>
          <Link
            to="/parties"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            전체 보기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {MOCK_PARTIES.map((party) => {
            const remaining = party.maxMembers - party.currentMembers;
            const progress = (party.currentMembers / party.maxMembers) * 100;
            const CategoryIcon = CATEGORY_ICONS[party.category] ?? Sparkle;

            return (
              <div
                key={party.id}
                className="relative p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
                        SERVICE_COLORS[party.serviceName] ??
                        "from-slate-200 via-slate-100 to-white"
                      } text-slate-900 border border-white/70 shadow-inner flex items-center justify-center font-bold`}
                    >
                      {party.serviceName.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">
                        {party.hostName} 님
                      </p>
                      <p className="font-semibold">{party.serviceName}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    {STATUS_LABEL[party.status]}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {party.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                    {party.description}
                  </p>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>잔여 {remaining}석</span>
                    <span className="font-semibold text-slate-900">
                      ₩{numberFormatter.format(party.pricePerMonth)} / 월
                    </span>
                  </div>
                  <ProgressBar value={progress} />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-5">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {party.currentMembers} / {party.maxMembers} 명
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>다음 결제 {party.nextBillingDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CategoryIcon className="w-4 h-4" />
                    <span>{party.category}</span>
                  </div>
                  <Link
                    to={`/parties/${party.id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    참여하기
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-sm text-slate-500">카테고리 한눈에 보기</p>
              <h3 className="text-xl font-bold text-slate-900">
                서비스별 모집 현황
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {Object.entries(categorySummary).map(([category, count]) => {
                const Icon = CATEGORY_ICONS[category] ?? Sparkle;
                return (
                  <div
                    key={category}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category}</span>
                    <span className="font-semibold">{count}개</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
