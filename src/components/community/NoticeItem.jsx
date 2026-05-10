import { Eye } from "lucide-react";

export default function NoticeItem({ notice, index, formatDate, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid w-full grid-cols-[56px_1fr_auto] items-center gap-4 border-b border-[var(--theme-border-light)] px-2 py-5 text-left transition hover:bg-[var(--theme-surface-muted)] sm:px-4"
    >
      <span className="text-sm font-bold text-[var(--theme-text-muted)]">
        {index}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-base font-bold text-[var(--theme-text)]">
          {notice.title}
        </span>
        <span className="mt-1 block text-sm font-medium text-[var(--theme-text-muted)]">
          {formatDate(notice.createdAt)}
        </span>
      </span>
      <span className="hidden items-center gap-1.5 rounded-full bg-[var(--theme-surface-muted)] px-3 py-1.5 text-xs font-bold text-[var(--theme-text-muted)] sm:inline-flex">
        <Eye className="h-3.5 w-3.5" />
        {notice.viewCount || 0}
      </span>
    </button>
  );
}
