import { useEffect } from "react";
import { useMainStore } from "@/store/main/mainStore";
import MainHeroSection from "./sections/MainHeroSection";
import MainFeaturesSection from "./sections/MainFeaturesSection";
import MainProductsSection from "./sections/MainProductsSection";
import MainTrendingSection from "./sections/MainTrendingSection";
import MainHowItWorksSection from "./sections/MainHowItWorksSection";
import MainMarqueeSection from "./sections/MainMarqueeSection";
import MainStatementSection from "./sections/MainStatementSection";
import MainComparisonSection from "./sections/MainComparisonSection";
import MainStatsMarquee from "./sections/MainStatsMarquee";
import MainSearchSection from "./sections/MainSearchSection";

export default function MainPage() {
  const loadMain = useMainStore((s) => s.loadMain);
  const products = useMainStore((s) => s.products);
  const parties = useMainStore((s) => s.parties);
  const stats = useMainStore((s) => s.stats);
  const error = useMainStore((s) => s.error);

  useEffect(() => {
    loadMain();
  }, [loadMain]);

  return (
    <div className="min-h-screen bg-slate-50 text-black -mt-35 pt-5">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      {error ? (
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10">
          <div className="bg-white border border-gray-200 rounded-3xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] p-6 font-black">
            {error}
          </div>
        </div>
      ) : null}

      <div className="relative z-10">
        <MainHeroSection products={products} parties={parties} stats={stats} />
        <MainMarqueeSection />
        <MainStatementSection />
        <MainComparisonSection />
        <MainStatsMarquee />
        <MainFeaturesSection stats={stats} />
        <MainProductsSection />
        <MainTrendingSection parties={parties} />
        <MainHowItWorksSection />
      </div>
    </div>
  );
}
