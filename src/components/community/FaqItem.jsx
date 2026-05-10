import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/useI18n";

const categories = [
  { id: "member", source: "회원", labelKey: "category.member" },
  { id: "payment", source: "결제", labelKey: "category.payment" },
  { id: "subscription", source: "구독", labelKey: "category.subscription" },
  { id: "party", source: "파티", labelKey: "category.party" },
  { id: "settlement", source: "정산", labelKey: "category.settlement" },
  { id: "etc", source: "기타", labelKey: "category.etc" },
];

export default function FaqItem({
  faq,
  isAdmin,
  onUpdate,
  getCategoryFromTitle,
  isOpen,
  onToggle,
}) {
  const { t } = useI18n();
  const category = getCategoryFromTitle ? getCategoryFromTitle(faq.title) : "기타";
  const categoryMeta = categories.find((item) => item.id === category) || categories.at(-1);
  const displayTitle = faq.title.replace(/\[.*?\]\s*/, "");
  const [isEditing, setIsEditing] = useState(false);
  const [editCategory, setEditCategory] = useState(category);
  const [editFormData, setEditFormData] = useState({
    title: displayTitle,
    content: faq.content,
  });

  const handleSave = async () => {
    if (!editFormData.title.trim() || !editFormData.content.trim()) {
      alert(t("community.faq.validation"));
      return;
    }

    const selectedCategory = categories.find((item) => item.id === editCategory) || categories.at(-1);
    const success = await onUpdate(faq.communityId, {
      title: `[${selectedCategory.source}] ${editFormData.title}`,
      content: editFormData.content,
    });

    if (success) setIsEditing(false);
  };

  return (
    <div className="overflow-hidden border-b border-[var(--theme-border-light)]">
      <button
        type="button"
        onClick={() => !isEditing && onToggle(faq.communityId)}
        className="flex w-full items-center gap-4 px-2 py-5 text-left transition hover:bg-[var(--theme-surface-muted)] sm:px-4"
      >
        <span className="shrink-0 rounded-full bg-[var(--theme-primary-light)] px-3 py-1 text-xs font-bold text-[var(--theme-primary)]">
          {t(categoryMeta.labelKey)}
        </span>
        <span className="min-w-0 flex-1 truncate text-base font-bold text-[var(--theme-text)]">
          {displayTitle}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-[var(--theme-text-muted)] transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="bg-[var(--theme-surface-muted)] px-4 py-5">
          {isEditing ? (
            <div className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={editCategory}
                  onChange={(event) => setEditCategory(event.target.value)}
                  className="h-11 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)] px-4 text-sm font-bold text-[var(--theme-text)] outline-none focus:ring-2 focus:ring-[var(--theme-focus-ring)]"
                >
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {t(item.labelKey)}
                    </option>
                  ))}
                </select>
                <input
                  value={editFormData.title}
                  onChange={(event) =>
                    setEditFormData((prev) => ({ ...prev, title: event.target.value }))
                  }
                  className="h-11 flex-1 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)] px-4 text-sm font-bold text-[var(--theme-text)] outline-none focus:ring-2 focus:ring-[var(--theme-focus-ring)]"
                />
              </div>
              <textarea
                value={editFormData.content}
                onChange={(event) =>
                  setEditFormData((prev) => ({ ...prev, content: event.target.value }))
                }
                rows={6}
                className="w-full resize-none rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-card)] px-4 py-3 text-sm font-medium text-[var(--theme-text)] outline-none focus:ring-2 focus:ring-[var(--theme-focus-ring)]"
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  {t("community.faq.cancel")}
                </Button>
                <Button type="button" onClick={handleSave}>
                  {t("community.faq.save")}
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="whitespace-pre-wrap text-sm font-medium leading-7 text-[var(--theme-text-muted)]">
                {faq.content}
              </p>
              {isAdmin && (
                <div className="mt-4 flex justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
                    {t("community.faq.edit")}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
