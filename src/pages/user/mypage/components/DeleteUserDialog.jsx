import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, UserX } from "lucide-react";
import { withdrawUser } from "@/api/userApi";
import { MoaButton } from "@/shared/ui";

const REASONS = [
  { value: "NOT_USED", title: "서비스를 더 이상 사용하지 않음" },
  { value: "PRICE", title: "가격이 부담됨" },
  { value: "FUNCTION", title: "원하는 기능이 부족함" },
  { value: "OTHER", title: "기타 (상세내용 입력)" },
];

export function DeleteUserDialog({ open, onOpenChange }) {
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteDetail, setDeleteDetail] = useState("");
  const [loading, setLoading] = useState(false);

  const showDetail = deleteReason === "OTHER";

  const onSubmitDelete = async () => {
    if (!deleteReason) {
      alert("탈퇴 사유를 선택해 주세요.");
      return;
    }

    const ok = window.confirm("정말 탈퇴하시겠습니까? 탈퇴 후 계정 복구가 어려울 수 있습니다.");
    if (!ok) return;

    setLoading(true);
    try {
      const res = await withdrawUser({ deleteReason, deleteDetail });
      if (res?.success) {
        alert("회원 탈퇴가 완료되었습니다.");
        window.location.href = "/";
      } else {
        const res2 = await withdrawUser({ reason: deleteReason, detail: deleteDetail });
        if (res2?.success) {
          alert("회원 탈퇴가 완료되었습니다.");
          window.location.href = "/";
        } else {
          alert(res2?.error?.message || "탈퇴 처리에 실패했습니다.");
        }
      }
    } catch (err) {
      alert(err?.response?.data?.error?.message || "탈퇴 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setDeleteReason("");
      setDeleteDetail("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border border-[var(--theme-border-light)] bg-[var(--theme-surface)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[var(--theme-text)]">
            <UserX className="h-5 w-5 text-red-500" />
            회원 탈퇴
          </DialogTitle>
          <DialogDescription className="text-[var(--theme-text-muted)]">
            탈퇴 전 아래 내용을 확인해 주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <div className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
                <p>탈퇴 시 계정 정보와 서비스 이용 이력은 관련 법령에 따라 일정 기간 보관 후 안전하게 파기됩니다.</p>
                <p className="mt-1">탈퇴 후에는 동일 이메일로 재가입이 제한될 수 있습니다.</p>
              </div>
            </div>
          </div>

          <Separator className="bg-[var(--theme-border-light)]" />

          <div className="space-y-2">
            <p className="text-sm font-bold text-[var(--theme-text)]">탈퇴 사유</p>
            <div className="space-y-2">
              {REASONS.map((reason) => (
                <label
                  key={reason.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                    deleteReason === reason.value
                      ? "border-[var(--theme-primary)] bg-[var(--theme-primary-light)]"
                      : "border-[var(--theme-border-light)] bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-muted)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="deleteReason"
                    value={reason.value}
                    checked={deleteReason === reason.value}
                    onChange={() => {
                      setDeleteReason(reason.value);
                      if (reason.value !== "OTHER") setDeleteDetail("");
                    }}
                    className="h-4 w-4 accent-[var(--theme-primary)]"
                  />
                  <span className="text-sm font-semibold text-[var(--theme-text)]">{reason.title}</span>
                </label>
              ))}
            </div>
          </div>

          {showDetail && (
            <div className="space-y-2">
              <p className="text-sm font-bold text-[var(--theme-text)]">기타 사유 (선택)</p>
              <textarea
                value={deleteDetail}
                onChange={(event) => setDeleteDetail(event.target.value)}
                className="h-24 w-full resize-none rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 text-sm text-[var(--theme-text)] outline-none focus:ring-2 focus:ring-[var(--theme-focus-ring)]"
                placeholder="불편했던 점을 입력해 주세요."
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <MoaButton
              type="button"
              variant="secondary"
              onClick={() => handleOpenChange(false)}
              className="flex-1"
            >
              취소
            </MoaButton>
            <MoaButton
              type="button"
              variant="danger"
              onClick={onSubmitDelete}
              disabled={loading || !deleteReason}
              className="flex-1"
            >
              {loading ? "처리 중..." : "탈퇴하기"}
            </MoaButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
