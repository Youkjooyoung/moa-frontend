import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  PartyPopper,
  Film,
  ShieldCheck,
  Flame,
  ArrowUpRight,
} from "lucide-react";
import { PartyStatus } from "@/constants/types";

const badgeColors = {
  recruiting: "bg-emerald-500/15 text-emerald-200 border border-emerald-400/30",
  full: "bg-slate-500/20 text-slate-200 border border-slate-400/30",
};

export default function HeroSection({ topParties = [] }) {
  const heroStats = [
    {
      label: "신뢰도 검증",
      value: "100% 실명 인증",
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
      label: "실시간 인기",
      value: "TOP 파티 3",
      icon: <Flame className="w-5 h-5" />,
    },
    {
      label: "즉시 합류",
      value: "평균 3분 내 매칭",
      icon: <ArrowUpRight className="w-5 h-5" />,
    },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.25),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.25),transparent_30%),radial-gradient(circle_at_60%_80%,rgba(236,72,153,0.18),transparent_35%)]" />
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16 md:pb-24 relative flex flex-col gap-12">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur">
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span className="text-sm font-semibold text-emerald-100">
            주토피아2 에디션
          </span>
          <span className="text-xs text-slate-300">네온 무드 인터페이스</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-200/80 font-semibold">
              OTT 공동구독의 새로운 세계
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white drop-shadow-[0_10px_35px_rgba(16,185,129,0.35)]">
              부담은 나누고,
              <br /> 즐거움은 곱하는
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-300 block">
                주토피아2 스타일 파티
              </span>
            </h1>
            <p className="text-lg text-slate-200/80 leading-relaxed">
              컬러풀한 네온 감성과 입체적인 카드 레이아웃으로, 신뢰도 높은
              파티만 모아 보여드려요. 지금 바로 합류해서 더 적은 금액으로 더
              많은 콘텐츠를 즐겨보세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/party"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 text-slate-950 font-bold shadow-xl shadow-emerald-500/30 hover:scale-[1.01] transition-transform"
              >
                <PartyPopper className="w-5 h-5" />
                지금 뜨는 파티 보기
              </Link>
              <Link
                to="/party/create"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-emerald-300/40 text-emerald-100 font-semibold bg-white/5 backdrop-blur hover:border-cyan-300/60 hover:text-white"
              >
                <Sparkles className="w-5 h-5" />
                내가 파티 열기
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-slate-200/90 flex items-center gap-2"
                >
                  <span className="text-emerald-200">{stat.icon}</span>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400">{stat.label}</span>
                    <span className="font-semibold text-white">
                      {stat.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -left-6 w-48 h-48 bg-emerald-400/20 blur-3xl rounded-full" />
            <div className="absolute bottom-0 -right-10 w-56 h-56 bg-indigo-400/25 blur-3xl rounded-full" />
            <div className="relative bg-white/5 border border-white/15 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-emerald-100/80">실시간 인기</p>
                  <h3 className="text-2xl font-bold text-white">
                    파티 대시보드
                  </h3>
                </div>
                <Film className="w-8 h-8 text-emerald-200" />
              </div>

              <div className="space-y-4">
                {topParties.map((party) => {
                  const remain = party.maxMembers - party.currentMembers;
                  const isRecruiting = party.status === PartyStatus.RECRUITING;
                  const percentage = Math.round(
                    (party.currentMembers / party.maxMembers) * 100
                  );

                  return (
                    <div
                      key={party.id}
                      className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-emerald-300/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400/40 to-cyan-400/20 flex items-center justify-center text-white font-bold">
                            {party.serviceName}
                          </div>
                          <div>
                            <p className="text-sm text-slate-300">
                              {party.hostName} 님
                            </p>
                            <p className="text-base font-semibold text-white">
                              {party.title}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`${
                            isRecruiting
                              ? badgeColors.recruiting
                              : badgeColors.full
                          } text-xs px-3 py-1 rounded-full`}
                        >
                          {isRecruiting ? "모집중" : "마감"}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-slate-300 flex items-center justify-between">
                        <span>
                          남은 자리 {remain} / {party.maxMembers}
                        </span>
                        <span className="font-semibold text-emerald-100">
                          월 {party.pricePerMonth.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
