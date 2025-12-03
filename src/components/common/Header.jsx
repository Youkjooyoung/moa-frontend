import { useHeaderLogic } from "@/hooks/headerLogic";
import {
  Bell,
  Search,
  LogOut,
  Menu,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { user, oauthProvider, logout } = useHeaderLogic();
  const [menuOpen, setMenuOpen] = useState(false);

  const onMenuToggle = () => setMenuOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

        {/* Logo */}
        <button role="link" data-href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow">
            <span className="text-white font-extrabold text-lg">M</span>
          </div>
          <span className="text-xl font-extrabold text-slate-900">MoA</span>
        </button>

        {/* ───────── Navigation (홈 제거됨) ───────── */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">

          <button role="link" data-href="/product" className="hover:text-blue-600">
            구독상품
          </button>

          <button role="link" data-href="/subscription" className="hover:text-blue-600">
            구독목록
          </button>

          <button role="link" data-href="/party" className="hover:text-blue-600">
            파티 찾기
          </button>
        </nav>

        {/* Right UI */}
        <div className="flex items-center gap-4 relative">
          <div className="hidden lg:flex bg-slate-100 rounded-full px-4 py-1.5 w-64 items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="넷플릭스 파티 검색..."
              className="bg-transparent text-sm focus:outline-none w-full"
            />
          </div>

          {user ? (
            <>
              <div className="relative">
                <button className="p-2 hover:bg-slate-100 rounded-full">
                  <Bell className="w-5 h-5 text-slate-600" />
                </button>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </div>

              <div className="hidden md:flex items-center gap-2">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    className="w-8 h-8 rounded-full border object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full border flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-gray-600" />
                  </div>
                )}

                <span className="text-sm font-semibold text-slate-900">
                  {user.nickname}님
                </span>
              </div>

              <button
                onClick={onMenuToggle}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-slate-700" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-14 w-52 bg-white shadow-lg rounded-lg border py-2 z-50">
                  <button
                    role="link"
                    data-href="/mypage"
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 text-sm"
                  >
                    마이페이지
                  </button>

                  <button
                    role="link"
                    data-href="/mypage/subscriptions"
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 text-sm"
                  >
                    나의 구독목록
                  </button>

                  <button
                    role="link"
                    data-href="/mypage/delete"
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 text-sm"
                  >
                    회원 탈퇴
                  </button>

                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 text-sm flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                role="link"
                data-href="/signup"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-full text-sm font-semibold hover:bg-blue-50"
              >
                회원가입
              </button>
              <button
                role="link"
                data-href="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700"
              >
                로그인
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
