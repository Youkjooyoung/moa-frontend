import { Link } from "react-router-dom";
import { useThemeStore } from "@/store/themeStore";

// Footer theme configurations
const footerThemes = {
  default: {
    bg: "bg-slate-100",
    border: "border-slate-200",
    title: "text-slate-800",
    heading: "text-slate-700",
    text: "text-slate-500",
    linkHover: "hover:text-slate-900",
  },
  classic: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    title: "text-gray-800",
    heading: "text-gray-700",
    text: "text-gray-500",
    linkHover: "hover:text-[#635bff]",
  },
  dark: {
    bg: "bg-[#020617]",
    border: "border-gray-700",
    title: "text-white",
    heading: "text-gray-300",
    text: "text-gray-400",
    linkHover: "hover:text-[#635bff]",
  },
  pop: {
    bg: "bg-pink-100",
    border: "border-black border-t-2",
    title: "text-black font-black",
    heading: "text-black font-bold",
    text: "text-gray-700",
    linkHover: "hover:text-pink-500",
  },
  christmas: {
    bg: "bg-gradient-to-r from-[#1a5f2a] via-[#166534] to-[#1a5f2a]",
    border: "border-[#c41e3a]",
    title: "text-white",
    heading: "text-green-100",
    text: "text-green-200",
    linkHover: "hover:text-[#fbbf24]",
  },
};

export default function Footer() {
  const { theme } = useThemeStore();
  const currentFooter = footerThemes[theme] || footerThemes.classic;

  return (
    <footer className={`${currentFooter.bg} border-t ${currentFooter.border} mt-20 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h2 className={`text-xl font-semibold ${currentFooter.title}`}>MoA</h2>
          <p className={`mt-3 text-sm ${currentFooter.text} leading-6`}>
            현명한 구독 생활의 시작. 넷플릭스, 디즈니+, <br />
            유튜브 등 좋아하는 OTT 서비스와 함께하세요.
          </p>
        </div>

        <div>
          <h3 className={`text-sm font-semibold ${currentFooter.heading} mb-3`}>서비스</h3>
          <ul className={`space-y-2 text-sm ${currentFooter.text}`}>
            <li>넷플릭스 파티</li>
            <li>디즈니+ 파티</li>
            <li>유튜브 프리미엄</li>
          </ul>
        </div>

        <div>
          <h3 className={`text-sm font-semibold ${currentFooter.heading} mb-3`}>고객지원</h3>
          <ul className={`space-y-2 text-sm ${currentFooter.text}`}>
            <li>
              <Link to="/community/notice" className={`transition-colors ${currentFooter.linkHover}`}>
                고객센터
              </Link>
            </li>
            <li>
              <Link to="/landing-test" className={`transition-colors ${currentFooter.linkHover}`}>
                Landing Page Test
              </Link>
            </li>
            <li>이용약관</li>
            <li>개인정보처리방침</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
