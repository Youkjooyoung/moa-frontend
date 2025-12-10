import React from "react";

export default function FeaturesSection({ featureCards = [] }) {
  return (
    <section className="max-w-6xl mx-auto px-4 pb-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featureCards.map((feature) => (
          <div
            key={feature.title}
            className="relative p-6 rounded-3xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur group"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-60 group-hover:opacity-80 transition-opacity`}
            />
            <div className="relative flex flex-col gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/20 flex items-center justify-center text-white">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              <p className="text-slate-100/80 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
