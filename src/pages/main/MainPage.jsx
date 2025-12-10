import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeaturesSection";
import TrendingParties from "./components/TrendingPartiesSection";

export default function MainPage() {
  return (
    <div className="w-full pb-20">
      <HeroSection />
      <FeatureSection />
      <TrendingParties />
    </div>
  );
}
