import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

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
// Marquee Band - OTT 서비스 롤링 텍스트
// ============================================
export default function MainMarqueeSection() {
  return (
    <div className="bg-black text-white py-4 border-y border-gray-800">
      <Marquee speed={25}>
        <div className="flex items-center gap-8 px-4">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="flex items-center gap-4 text-xl font-black uppercase tracking-wider">
              <Star className="w-6 h-6 text-pink-400 fill-pink-400" />
              Netflix
              <Star className="w-6 h-6 text-cyan-400 fill-cyan-400" />
              Disney+
              <Star className="w-6 h-6 text-lime-400 fill-lime-400" />
              YouTube
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              Spotify
            </span>
          ))}
        </div>
      </Marquee>
    </div>
  );
}
