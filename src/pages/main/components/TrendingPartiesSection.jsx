import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Users, Wallet } from "lucide-react";
import { PartyStatus } from "@/constants/types";

const badgeColors = {
  recruiting: "bg-emerald-500/15 text-emerald-200 border border-emerald-400/30",
  full: "bg-slate-500/20 text-slate-200 border border-slate-400/30",
};

export default function TrendingPartiesSection({ parties = [] }) {
  return (
    <section className="max-w-6xl mx-auto px-4 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-emerald-200/80">지금 가장 핫한 파티</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            실시간 인기 TOP 4
          </h2>
        </div>
        <Link
          to="/party"
          className="text-sm inline-flex items-center gap-1 text-emerald-200 hover:text-white"
        >
          전체 파티 보러가기 <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {parties.length === 0 ? (
        <p className="text-slate-200/70">로딩 중...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {parties.slice(0, 4).map((party) => {
            const isRecruiting = party.status === PartyStatus.RECRUITING;
            const remain = party.maxMembers - party.currentMembers;
            const percentage = Math.round(
              (party.currentMembers / party.maxMembers) * 100
            );

            return (
              <div
                key={party.id}
                className="group relative p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-slate-900/80 shadow-2xl hover:border-emerald-300/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400/40 to-cyan-400/30 flex items-center justify-center text-white font-bold">
                      {party.serviceName}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-white">
                        {party.title}
                      </h3>
                      <p className="text-sm text-slate-300">
                        파티장 {party.hostName}
                      </p>
                      <p className="text-sm text-slate-200/80 line-clamp-2">
                        {party.description}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`${
                      isRecruiting ? badgeColors.recruiting : badgeColors.full
                    } text-xs px-3 py-1 rounded-full whitespace-nowrap`}
                  >
                    {isRecruiting ? "모집중" : "마감"}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3 text-sm text-slate-200/80">
                  <Users className="w-4 h-4 text-emerald-200" />
                  <span>
                    {party.currentMembers} / {party.maxMembers} 명 참여중
                  </span>
                  <span className="text-emerald-100">
                    남은 {Math.max(remain, 0)}자리
                  </span>
                </div>
                <div className="mt-2 w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-slate-200/80">
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                    <Wallet className="w-4 h-4 text-emerald-200" />
                    <span className="font-semibold text-white">
                      월 {party.pricePerMonth.toLocaleString()}원
                    </span>
                  </div>
                  <Link
                    to={`/party/${party.id}`}
                    className="inline-flex items-center gap-1 text-emerald-200 font-semibold hover:text-white"
                  >
                    상세 보기
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
