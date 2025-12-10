import React from "react";
import { ShieldCheck, Wallet, Zap } from "lucide-react";

const FEATURES = [
  {
    title: "약속 걱정 NO",
    description: "파티원 제공 정보는 100% 검증 후 매칭됩니다.",
    icon: <ShieldCheck className="w-6 h-6" />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "즉시 매칭",
    description: "가입 즉시 매칭! 실시간 정보 반영.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "자동 정산",
    description: "매월 자동 정산되어 편리하게 이용.",
    icon: <Wallet className="w-6 h-6" />,
    color: "bg-orange-100 text-orange-600",
  },
];

export default function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="bg-white p-8 rounded-3xl shadow border border-gray-100"
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}
            >
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">
              {feature.title}
            </h3>
            <p className="text-gray-500">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
