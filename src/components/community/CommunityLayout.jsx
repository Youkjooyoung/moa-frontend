import { useLocation, useNavigate } from "react-router-dom";
import { MessageSquareText, Megaphone, Search, UserRoundCheck } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useI18n } from "@/hooks/useI18n";

const tabs = [
  { labelKey: "community.faq", path: "/community/faq", icon: Search },
  { labelKey: "community.notice", path: "/community/notice", icon: Megaphone },
  { labelKey: "community.inquiry", path: "/community/inquiry", icon: MessageSquareText },
];

export default function CommunityLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { t } = useI18n();

  const isActiveTab = (path) => {
    if (path === "/community/inquiry") return location.pathname.includes("/community/inquiry");
    return location.pathname.includes(path);
  };

  const handleTabClick = (tab) => {
    if (tab.path !== "/community/inquiry") {
      navigate(tab.path);
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    navigate(user.role === "ADMIN" ? "/community/inquiry/admin" : "/community/inquiry");
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg)]">
      <section className="border-b border-[var(--theme-border-light)] bg-[var(--theme-bg-card)]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--theme-primary-light)] px-3 py-1.5 text-sm font-bold text-[var(--theme-primary)]">
                <UserRoundCheck className="h-4 w-4" />
                {t("community.badge")}
              </div>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-[var(--theme-text)] md:text-5xl">
                {t("community.title")}
              </h1>
              <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-[var(--theme-text-muted)]">
                {t("community.description")}
              </p>
            </div>

            <nav className="flex flex-wrap gap-2 rounded-2xl bg-[var(--theme-surface-muted)] p-1">
              {tabs.map((tab) => {
                const active = isActiveTab(tab.path);
                return (
                  <button
                    key={tab.name}
                    type="button"
                    onClick={() => handleTabClick(tab)}
                    className={`inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold transition ${
                      active
                        ? "bg-[var(--theme-bg-card)] text-[var(--theme-primary)] shadow-[var(--theme-shadow-soft)]"
                        : "text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
                    }`}
                    >
                      <tab.icon className="h-4 w-4" />
                    {t(tab.labelKey)}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
