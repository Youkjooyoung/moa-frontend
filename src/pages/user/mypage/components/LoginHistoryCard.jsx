import { Clock } from "lucide-react";
import { MoaButton, MoaEmptyState } from "@/shared/ui";

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function LoginHistoryCard({ loginHistory, onBack }) {
  const items =
    loginHistory?.items ||
    loginHistory?.data?.items ||
    loginHistory?.list ||
    loginHistory?.data ||
    [];

  const total =
    loginHistory?.total ||
    loginHistory?.data?.total ||
    loginHistory?.pagination?.total ||
    items.length;

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-black text-[var(--theme-text)]">로그인 기록</p>
          <p className="mt-1 text-sm text-[var(--theme-text-muted)]">
            최근 로그인 이력 {total ?? 0}건
          </p>
        </div>
        {onBack && (
          <MoaButton variant="secondary" size="sm" onClick={onBack}>
            계정 정보로
          </MoaButton>
        )}
      </div>

      {Array.isArray(items) && items.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-[var(--theme-border-light)]">
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-sm">
              <thead className="bg-[var(--theme-bg)]">
                <tr className="border-b border-[var(--theme-border-light)]">
                  <th className="p-3 text-left font-black text-[var(--theme-text)]">일시</th>
                  <th className="p-3 text-left font-black text-[var(--theme-text)]">결과</th>
                  <th className="p-3 text-left font-black text-[var(--theme-text)]">IP</th>
                  <th className="p-3 text-left font-black text-[var(--theme-text)]">유형</th>
                  <th className="p-3 text-left font-black text-[var(--theme-text)]">User-Agent</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row, idx) => (
                  <tr key={idx} className="border-b border-[var(--theme-border-light)] last:border-b-0">
                    <td className="whitespace-nowrap p-3 font-semibold text-[var(--theme-text)]">
                      {formatDateTime(row?.createdAt || row?.dateTime || row?.loginAt)}
                    </td>
                    <td className="p-3 font-bold text-[var(--theme-text)]">
                      {row?.success === false || row?.result === "FAIL" ? "실패" : "성공"}
                    </td>
                    <td className="whitespace-nowrap p-3 font-semibold text-[var(--theme-text-muted)]">
                      {row?.loginIp ?? row?.ip ?? "-"}
                    </td>
                    <td className="p-3 font-semibold text-[var(--theme-text-muted)]">
                      {row?.provider || row?.type || "-"}
                    </td>
                    <td className="max-w-[280px] truncate p-3 font-semibold text-[var(--theme-text-muted)]">
                      {row?.userAgent || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <MoaEmptyState
          icon={Clock}
          title="로그인 기록이 없습니다"
          description="새로운 로그인 기록이 생기면 이곳에 표시됩니다."
        />
      )}
    </div>
  );
}
