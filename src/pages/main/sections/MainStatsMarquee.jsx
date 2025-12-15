import React from "react";
import { motion } from "framer-motion";

// ============================================
// Marquee Component - 롤링 텍스트
// ============================================
function Marquee({ children, direction = "left", speed = 20 }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="inline-flex"
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

// ============================================
// Stats Marquee - 핑크 롤링 텍스트
// ============================================
export default function MainStatsMarquee() {
  return (
    <div className="bg-pink-500 text-white py-4 border-y border-pink-400">
      <Marquee direction="right" speed={30}>
        <div className="flex items-center gap-12 px-4">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center gap-12 text-xl font-black uppercase">
              <span>10K+ 사용자</span>
              <span>•</span>
              <span>75% 절약</span>
              <span>•</span>
              <span>4.9 만족도</span>
              <span>•</span>
            </span>
          ))}
        </div>
      </Marquee>
    </div>
  );
}
