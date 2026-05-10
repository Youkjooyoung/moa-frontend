import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import CommunityLayout from "@/components/community/CommunityLayout";
import NoticeItem from "@/components/community/NoticeItem";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/useI18n";
import { useAuthStore } from "@/store/authStore";
import { formatLocalizedDate } from "@/utils/localeFormat";

const pageSize = 10;

export default function ListNotice() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { locale, t } = useI18n();
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const loadNoticeList = async () => {
      try {
        const response = await fetch("/api/community/notice?page=1&size=100");
        if (!response.ok) {
          setNotices([]);
          return;
        }

        const data = await response.json();
        const sortedNotices = (data.content || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotices(sortedNotices);
      } catch {
        setNotices([]);
      }
    };

    loadNoticeList();
  }, []);

  const filteredNotices = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return notices;

    return notices.filter((notice) =>
      `${notice.title || ""} ${notice.content || ""}`.toLowerCase().includes(keyword)
    );
  }, [notices, searchKeyword]);

  const totalPages = Math.ceil(filteredNotices.length / pageSize);
  const pageData = filteredNotices.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatDate = (dateString) => {
    return formatLocalizedDate(dateString, locale);
  };

  const handleSearchChange = (value) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  };

  return (
    <CommunityLayout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--theme-text)]">{t("community.notice.title")}</h2>
            <p className="mt-1 text-sm font-medium text-[var(--theme-text-muted)]">
              {t("community.notice.description")}
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder={t("community.searchPlaceholder")}
                value={searchKeyword}
                onChange={(event) => handleSearchChange(event.target.value)}
                className="h-11 w-full rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)] pl-4 pr-11 text-sm font-semibold text-[var(--theme-text)] outline-none transition placeholder:text-[var(--theme-text-muted)] focus:ring-2 focus:ring-[var(--theme-focus-ring)] sm:w-64"
              />
              <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-text-muted)]" />
            </div>
            {isAdmin && (
              <Button
                type="button"
                onClick={() => navigate("/community/notice/add")}
                className="h-11 rounded-2xl bg-[var(--theme-primary)] px-4 font-bold text-white hover:bg-[var(--theme-primary-hover)]"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("community.write")}
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-[var(--theme-radius)] border border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] shadow-[var(--theme-shadow-soft)]">
          {pageData.length === 0 ? (
            <div className="py-24 text-center text-sm font-semibold text-[var(--theme-text-muted)]">
              {t("community.notice.empty")}
            </div>
          ) : (
            pageData.map((notice, index) => (
              <NoticeItem
                key={notice.communityId || notice.id}
                notice={notice}
                index={filteredNotices.length - ((currentPage - 1) * pageSize + index)}
                formatDate={formatDate}
                onClick={() => navigate(`/community/notice/${notice.communityId || notice.id}`)}
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
                onClick={() => setCurrentPage(page)}
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
