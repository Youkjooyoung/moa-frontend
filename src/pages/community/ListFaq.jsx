import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import CommunityLayout from "@/components/community/CommunityLayout";
import FaqItem from "@/components/community/FaqItem";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/useI18n";
import { useAuthStore } from "@/store/authStore";

const pageSize = 10;
const categories = [
  { id: "all", source: "전체", labelKey: "category.all" },
  { id: "member", source: "회원", labelKey: "category.member" },
  { id: "payment", source: "결제", labelKey: "category.payment" },
  { id: "subscription", source: "구독", labelKey: "category.subscription" },
  { id: "party", source: "파티", labelKey: "category.party" },
  { id: "settlement", source: "정산", labelKey: "category.settlement" },
  { id: "etc", source: "기타", labelKey: "category.etc" },
];

export default function ListFaq() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useI18n();
  const [faqs, setFaqs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openFaqId, setOpenFaqId] = useState(null);

  const isAdmin = user?.role === "ADMIN";

  const loadFaqList = useCallback(async () => {
    try {
      const response = await fetch("/api/community/faq?page=1&size=100");
      if (!response.ok) {
        setFaqs([]);
        return;
      }

      const data = await response.json();
      setFaqs(data.content || []);
    } catch {
      setFaqs([]);
    }
  }, []);

  useEffect(() => {
    loadFaqList();
  }, [loadFaqList]);

  const getCategoryFromTitle = (title = "") => {
    if (title.includes("[회원]")) return "member";
    if (title.includes("[결제]")) return "payment";
    if (title.includes("[구독]")) return "subscription";
    if (title.includes("[파티]")) return "party";
    if (title.includes("[정산]")) return "settlement";
    return "etc";
  };

  const filteredFaqs = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return faqs.filter((faq) => {
      const matchedCategory =
        activeCategory === "all" || getCategoryFromTitle(faq.title) === activeCategory;
      const matchedKeyword =
        !keyword || `${faq.title || ""} ${faq.content || ""}`.toLowerCase().includes(keyword);

      return matchedCategory && matchedKeyword;
    });
  }, [activeCategory, faqs, searchKeyword]);

  const totalPages = Math.ceil(filteredFaqs.length / pageSize);
  const pageData = filteredFaqs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
    setOpenFaqId(null);
  };

  const handleUpdateFaq = async (faqId, formData) => {
    try {
      const response = await fetch(`/api/community/faq/${faqId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.userId || "admin@moa.com",
          title: formData.title,
          content: formData.content,
        }),
      });

      if (response.ok) {
        await loadFaqList();
        return true;
      }

      alert("FAQ 수정에 실패했습니다.");
      return false;
    } catch {
      alert("FAQ 수정 중 오류가 발생했습니다.");
      return false;
    }
  };

  return (
    <CommunityLayout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--theme-text)]">{t("community.faq.title")}</h2>
            <p className="mt-1 text-sm font-medium text-[var(--theme-text-muted)]">
              {t("community.faq.description")}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <input
                type="text"
                placeholder={t("community.searchPlaceholder")}
                value={searchKeyword}
                onChange={(event) => {
                  setSearchKeyword(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 w-full rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)] pl-4 pr-11 text-sm font-semibold text-[var(--theme-text)] outline-none transition placeholder:text-[var(--theme-text-muted)] focus:ring-2 focus:ring-[var(--theme-focus-ring)] sm:w-64"
              />
              <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-text-muted)]" />
            </div>
            {isAdmin && (
              <Button
                type="button"
                onClick={() => navigate("/community/faq/add")}
                className="h-11 rounded-2xl bg-[var(--theme-primary)] px-4 font-bold text-white hover:bg-[var(--theme-primary-hover)]"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("community.write")}
              </Button>
            )}
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category.id)}
              className={`h-10 rounded-full px-4 text-sm font-bold transition ${
                activeCategory === category.id
                  ? "bg-[var(--theme-primary)] text-white"
                  : "border border-[var(--theme-border)] bg-[var(--theme-bg-card)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
              }`}
            >
              {t(category.labelKey)}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-[var(--theme-radius)] border border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] shadow-[var(--theme-shadow-soft)]">
          {pageData.length === 0 ? (
            <div className="py-24 text-center text-sm font-semibold text-[var(--theme-text-muted)]">
              {t("community.faq.empty")}
            </div>
          ) : (
            pageData.map((faq) => (
              <FaqItem
                key={faq.communityId}
                faq={faq}
                isAdmin={isAdmin}
                onUpdate={handleUpdateFaq}
                getCategoryFromTitle={getCategoryFromTitle}
                isOpen={openFaqId === faq.communityId}
                onToggle={(faqId) => setOpenFaqId(openFaqId === faqId ? null : faqId)}
              />
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => {
                  setCurrentPage(page);
                  setOpenFaqId(null);
                }}
                className={`h-10 min-w-10 rounded-xl px-3 text-sm font-bold transition ${
                  page === currentPage
                    ? "bg-[var(--theme-primary)] text-white"
                    : "bg-[var(--theme-bg-card)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </CommunityLayout>
  );
}
