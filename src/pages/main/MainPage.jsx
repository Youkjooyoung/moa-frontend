import React from "react";
import { Palette, ShieldCheck, Clock4 } from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import TrendingPartiesSection from "./components/TrendingPartiesSection";

const featureCards = [
  {
    icon: Palette,
    title: "주토피아2 감성",
    description:
      "오로라처럼 변하는 그라디언트와 입체 카드로 완전히 새로워진 메인",
    accent: "from-emerald-400/30 via-cyan-400/20 to-indigo-500/20",
  },
  {
    icon: ShieldCheck,
    title: "신뢰도 보증",
    description: "100% 실명 인증과 재검증 프로세스로 안심하고 파티를 모집",
    accent: "from-teal-400/30 via-blue-400/20 to-purple-500/20",
  },
  {
    icon: Clock4,
    title: "실시간 매칭",
    description: "모집 현황을 즉시 반영하고, 빠르게 합류할 수 있는 파티만 노출",
    accent: "from-amber-400/30 via-orange-400/20 to-pink-500/20",
  },
];

export default function MainPage() {
  const topParties = MOCK_PARTIES.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <HeroSection topParties={topParties} />
      <FeaturesSection featureCards={featureCards} />
      <TrendingPartiesSection parties={MOCK_PARTIES} />
    </div>
  );
}
