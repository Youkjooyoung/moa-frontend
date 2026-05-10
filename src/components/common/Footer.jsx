import { Link } from "react-router-dom";
import { useI18n } from "@/hooks/useI18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="relative z-10 border-t border-[var(--theme-border-light)] bg-[var(--theme-bg-card)]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-xl font-black tracking-tight text-[var(--theme-text)]">
            {t("app.name")}
          </h2>
          <p className="mt-3 max-w-sm text-sm font-medium leading-6 text-[var(--theme-text-muted)]">
            {t("footer.description")}
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-[var(--theme-text)]">
            {t("footer.service")}
          </h3>
          <ul className="space-y-2 text-sm font-medium text-[var(--theme-text-muted)]">
            <li>
              <Link to="/product" className="transition hover:text-[var(--theme-primary)]">
                {t("nav.products")}
              </Link>
            </li>
            <li>
              <Link to="/party" className="transition hover:text-[var(--theme-primary)]">
                {t("nav.parties")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-[var(--theme-text)]">
            {t("footer.support")}
          </h3>
          <ul className="space-y-2 text-sm font-medium text-[var(--theme-text-muted)]">
            <li>
              <Link to="/community/notice" className="transition hover:text-[var(--theme-primary)]">
                {t("footer.notice")}
              </Link>
            </li>
            <li>
              <Link to="/community/faq" className="transition hover:text-[var(--theme-primary)]">
                {t("footer.faq")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
