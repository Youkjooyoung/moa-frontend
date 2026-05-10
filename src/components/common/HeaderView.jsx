import { createElement } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Globe2,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Package,
  SlidersHorizontal,
  Sun,
  User,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/hooks/useI18n";
import { useThemeStore } from "@/store/themeStore";

function HeaderLink({ to, icon: Icon, active, children }) {
  return (
    <Link
      to={to}
      className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold transition ${
        active
          ? "bg-[var(--theme-primary-light)] text-[var(--theme-primary)]"
          : "text-[var(--theme-text-muted)] hover:bg-[var(--theme-surface-muted)] hover:text-[var(--theme-text)]"
      }`}
    >
      {createElement(Icon, { className: "h-4 w-4" })}
      {children}
    </Link>
  );
}

export default function HeaderView({
  user,
  isAdmin,
  profileImageUrl,
  userInitial,
  displayNickname,
  displayEmail,
  logout,
}) {
  const location = useLocation();
  const { locale, toggleLocale, t } = useI18n();
  const { resolvedTheme, toggleTheme } = useThemeStore();

  const isActive = (to) => {
    const pathname = location.pathname || "/";
    if (to === "/") return pathname === "/";
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  const navItems = isAdmin
    ? [
        { to: "/admin/dashboard", icon: LayoutDashboard, label: t("nav.dashboard") },
        { to: "/admin/users", icon: Users, label: t("nav.users") },
        { to: "/admin/landing", icon: SlidersHorizontal, label: t("nav.landingAdmin") },
        { to: "/product", icon: Package, label: t("nav.products") },
      ]
    : [
        { to: "/product", icon: Package, label: t("nav.products") },
        { to: "/party", icon: Users, label: t("nav.parties") },
      ];

  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-[var(--theme-border-light)] bg-[var(--theme-bg-card)]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-7">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--theme-primary)] text-lg font-black text-white">
              M
            </span>
            <span className="text-xl font-black tracking-tight text-[var(--theme-text)]">
              {t("app.name")}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <HeaderLink
                key={item.to}
                to={item.to}
                icon={item.icon}
                active={isActive(item.to)}
              >
                {item.label}
              </HeaderLink>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-[var(--theme-text-muted)] hover:bg-[var(--theme-surface-muted)] hover:text-[var(--theme-text)]"
            aria-label={t("control.theme")}
            onClick={toggleTheme}
          >
            {resolvedTheme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="hidden h-10 gap-2 rounded-full px-3 text-sm font-bold text-[var(--theme-text-muted)] hover:bg-[var(--theme-surface-muted)] hover:text-[var(--theme-text)] sm:inline-flex"
            aria-label={t("control.language")}
            onClick={toggleLocale}
          >
            <Globe2 className="h-4 w-4" />
            {locale.toUpperCase()}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="h-10 rounded-full px-2 text-[var(--theme-text)] hover:bg-[var(--theme-surface-muted)]"
              >
                {user ? (
                  <>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profileImageUrl} alt={displayNickname} />
                      <AvatarFallback className="bg-[var(--theme-primary)] text-sm font-bold text-white">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden max-w-28 truncate text-sm font-bold sm:inline">
                      {displayNickname}
                    </span>
                  </>
                ) : (
                  <Menu className="h-5 w-5" />
                )}
                <ChevronDown className="hidden h-4 w-4 text-[var(--theme-text-muted)] sm:block" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={10}
              className="w-64 rounded-2xl border border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] p-2 shadow-[var(--theme-shadow)]"
            >
              <div className="md:hidden">
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.to} asChild className="rounded-xl p-0">
                    <Link to={item.to} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-[var(--theme-text)]">
                      {createElement(item.icon, { className: "h-4 w-4" })}
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="my-2 bg-[var(--theme-border-light)]" />
              </div>

              <DropdownMenuItem
                onClick={toggleLocale}
                className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-bold text-[var(--theme-text)]"
              >
                <Globe2 className="mr-3 h-4 w-4" />
                {t("control.language")} · {locale.toUpperCase()}
              </DropdownMenuItem>

              {user ? (
                <>
                  <DropdownMenuSeparator className="my-2 bg-[var(--theme-border-light)]" />
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-bold text-[var(--theme-text)]">{displayNickname}</p>
                    <p className="truncate text-xs font-medium text-[var(--theme-text-muted)]">{displayEmail}</p>
                  </div>
                  {!isAdmin && (
                    <DropdownMenuItem asChild className="rounded-xl p-0">
                      <Link to="/mypage" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-[var(--theme-text)]">
                        <User className="h-4 w-4" />
                        {t("nav.myPage")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-bold text-red-500"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuSeparator className="my-2 bg-[var(--theme-border-light)]" />
                  <DropdownMenuItem asChild className="rounded-xl p-0">
                    <Link to="/login" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-[var(--theme-text)]">
                      <LogIn className="h-4 w-4" />
                      {t("nav.login")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl p-0">
                    <Link to="/signup" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-[var(--theme-primary)]">
                      <User className="h-4 w-4" />
                      {t("nav.signup")}
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
