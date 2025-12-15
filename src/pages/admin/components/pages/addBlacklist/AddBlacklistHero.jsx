import { CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function AddBlacklistHero() {
  return (
    <section className="relative px-6 md:px-12 pt-10 pb-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center mb-6 px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] font-black text-sm">
            <span className="flex h-2 w-2 rounded-full bg-red-500 mr-2" />
            MoA 관리자 · 블랙리스트 관리
          </div>

          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6">
            블랙리스트 등록
          </h1>
        </div>
      </div>
    </section>
  );
}
