import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Palette, Star } from "lucide-react";

// ============================================
// Theme Configuration
// ============================================
export const themeConfig = {
    classic: {
        name: "Classic",
        icon: Sun,
        bg: "bg-white",
        heroBg: "bg-white",
        text: "text-gray-900",
        subtext: "text-gray-600",
        card: "bg-white border-gray-100 hover:border-gray-200",
        cardText: "text-gray-900",
        cardSubtext: "text-gray-500",
        accent: "#635bff",
        accentBg: "bg-[#635bff]",
        accentText: "text-[#635bff]",
        filterBg: "bg-white/80",
        filterBorder: "border-gray-100",
        inputBg: "bg-white",
        inputBorder: "border-gray-200",
        inputText: "text-gray-900",
        buttonActive: "bg-[#635bff] text-white",
        buttonInactive: "bg-gray-100 text-gray-600 hover:bg-gray-200",
        sectionBg: "bg-gray-50",
    },
    dark: {
        name: "Dark",
        icon: Moon,
        bg: "bg-[#0B1120]",
        heroBg: "bg-[#0B1120]",
        text: "text-white",
        subtext: "text-gray-400",
        card: "bg-[#1E293B] border-gray-700 hover:border-gray-600",
        cardText: "text-white",
        cardSubtext: "text-gray-400",
        accent: "#635bff",
        accentBg: "bg-[#635bff]",
        accentText: "text-[#635bff]",
        filterBg: "bg-[#1E293B]/80",
        filterBorder: "border-gray-700",
        inputBg: "bg-[#0F172A]",
        inputBorder: "border-gray-700",
        inputText: "text-white",
        buttonActive: "bg-[#635bff] text-white",
        buttonInactive: "bg-[#1E293B] text-gray-400 hover:bg-[#334155]",
        sectionBg: "bg-[#0F172A]",
    },
    pop: {
        name: "Pop",
        icon: Palette,
        bg: "bg-slate-50",
        heroBg: "bg-slate-50",
        text: "text-black",
        subtext: "text-gray-600",
        card: "bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
        cardText: "text-black",
        cardSubtext: "text-gray-600",
        accent: "#ec4899",
        accentBg: "bg-pink-500",
        accentText: "text-pink-500",
        filterBg: "bg-white",
        filterBorder: "border-4 border-black",
        inputBg: "bg-white",
        inputBorder: "border-2 border-black",
        inputText: "text-black",
        buttonActive: "bg-pink-500 text-white border-2 border-black",
        buttonInactive: "bg-white text-black border-2 border-black hover:bg-pink-100",
        sectionBg: "bg-white",
    },
};

// ============================================
// Theme Hook
// ============================================
export const useTheme = (storageKey = "appTheme") => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem(storageKey) || "classic";
        }
        return "classic";
    });

    const currentTheme = themeConfig[theme] || themeConfig.classic;

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem(storageKey, newTheme);
    };

    return { theme, setTheme: handleThemeChange, currentTheme };
};

// ============================================
// Background Components
// ============================================

// Classic Animated Gradient
export const AnimatedGradient = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
                background: "radial-gradient(circle, rgba(99, 91, 255, 0.06) 0%, transparent 70%)",
                top: "-200px",
                right: "-100px",
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute w-[400px] h-[400px] rounded-full"
            style={{
                background: "radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 70%)",
                bottom: "-100px",
                left: "-50px",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
    </div>
);

// Dark Theme Gradient
export const DarkGradient = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
            className="absolute w-[800px] h-[800px] rounded-full"
            style={{
                background: "radial-gradient(circle, rgba(99, 91, 255, 0.15) 0%, transparent 70%)",
                top: "-200px",
                right: "-200px",
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
                background: "radial-gradient(circle, rgba(79, 209, 197, 0.1) 0%, transparent 70%)",
                bottom: "100px",
                left: "-100px",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
    </div>
);

// Grid Pattern
export const GridPattern = ({ dark = false }) => (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${dark ? "opacity-[0.1]" : "opacity-[0.02]"}`}>
        <svg width="100%" height="100%">
            <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" className={dark ? "text-gray-500" : ""} />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
    </div>
);

// Pop Theme Dot Pattern
export const DotPattern = () => (
    <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
            backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)',
            backgroundSize: '20px 20px'
        }}
    />
);

// ============================================
// O3 Pop Theme Components
// ============================================

// Sticker Component
export const Sticker = ({ children, color = "bg-white", rotate = 0, className = "", onClick }) => (
    <motion.div
        whileHover={{ scale: 1.1, rotate: rotate + 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`${color} border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 ${className}`}
        style={{ transform: `rotate(${rotate}deg)` }}
    >
        {children}
    </motion.div>
);

// Pop Button
export const PopButton = ({ children, color = "bg-pink-500", className = "", ...props }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${color} px-8 py-4 font-black text-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 rounded-2xl ${className}`}
        {...props}
    >
        {children}
    </motion.button>
);

// Marquee Component
export const Marquee = ({ children, direction = "left", speed = 20 }) => (
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

// ============================================
// Theme Switcher Component
// ============================================
export const ThemeSwitcher = ({ theme, onThemeChange }) => (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-2">
        {Object.entries(themeConfig).map(([key, config]) => {
            const IconComponent = config.icon;
            return (
                <motion.button
                    key={key}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onThemeChange(key)}
                    className={`p-2.5 rounded-full shadow-lg transition-all duration-200 ${theme === key
                            ? key === "pop"
                                ? "bg-pink-500 text-white border-2 border-black"
                                : "bg-[#635bff] text-white"
                            : key === "dark"
                                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                    title={config.name}
                >
                    <IconComponent className="w-4 h-4" />
                </motion.button>
            );
        })}
    </div>
);

// ============================================
// Theme Background Renderer
// ============================================
export const ThemeBackground = ({ theme }) => {
    if (theme === "dark") {
        return (
            <>
                <DarkGradient />
                <GridPattern dark />
            </>
        );
    }
    if (theme === "pop") {
        return <DotPattern />;
    }
    return (
        <>
            <AnimatedGradient />
            <GridPattern />
        </>
    );
};

// ============================================
// Theme Marquee (Pop only)
// ============================================
export const ThemeMarquee = ({ theme, items = ["Netflix", "Disney+", "Wavve", "Tving"] }) => {
    if (theme !== "pop") return null;

    return (
        <div className="bg-black text-white py-3 border-y-4 border-black">
            <Marquee speed={25}>
                <div className="flex items-center gap-8 px-4">
                    {[...Array(6)].map((_, i) => (
                        <span key={i} className="flex items-center gap-4 text-lg font-black uppercase tracking-wider">
                            {items.map((item, j) => (
                                <span key={j} className="flex items-center gap-4">
                                    <Star className={`w-5 h-5 fill-current ${j % 3 === 0 ? "text-pink-400" : j % 3 === 1 ? "text-cyan-400" : "text-lime-400"}`} />
                                    {item}
                                </span>
                            ))}
                        </span>
                    ))}
                </div>
            </Marquee>
        </div>
    );
};
