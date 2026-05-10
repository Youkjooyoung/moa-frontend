import { useEffect } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { useUpdatePwdStore } from "@/store/user/updatePwdStore";
import { useUpdatePwdLogic } from "@/hooks/user/useUpdatePassword";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoaButton, MoaCard, MoaPage, MoaPageHeader } from "@/shared/ui";

export default function UpdatePwdPage() {
  const {
    currentPassword,
    newPassword,
    newPasswordConfirm,
    modalOpen,
    stepVerified,
    error,
    setModal,
    resetAll,
    openModal,
  } = useUpdatePwdStore();
  const { verify, update, handleChange, loading } = useUpdatePwdLogic();

  const isVerifyDisabled = loading || !currentPassword.trim();
  const isUpdateDisabled =
    loading || !newPassword.trim() || !newPasswordConfirm.trim();

  const closeAndExit = () => {
    resetAll();
    window.history.back();
  };

  useEffect(() => {
    openModal();
    return () => resetAll();
  }, [openModal, resetAll]);

  useEffect(() => {
    const handleEnter = (event) => {
      if (event.key !== "Enter") return;
      if (!stepVerified) {
        verify();
      } else {
        update();
      }
    };

    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, [stepVerified, update, verify]);

  const handleDialogChange = (open) => {
    if (open) {
      openModal();
      return;
    }

    if (stepVerified) {
      setModal(false);
      return;
    }

    closeAndExit();
  };

  return (
    <MoaPage className="max-w-5xl">
      <MoaPageHeader
        eyebrow="Security"
        title="비밀번호 변경"
        description="현재 비밀번호를 확인한 뒤 새 비밀번호를 설정합니다."
        backLabel="마이페이지로"
        onBack={() => closeAndExit()}
      />

      <div className="grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <MoaCard className="p-6">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--theme-primary-light)] text-[var(--theme-primary)]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-black text-[var(--theme-text)]">안전한 계정 보호</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--theme-text-muted)]">
            먼저 현재 비밀번호를 확인합니다. 확인이 완료되면 새 비밀번호를 입력할 수 있습니다.
          </p>
        </MoaCard>

        <MoaCard className="p-6">
          <div className="mb-5 flex items-center justify-between rounded-2xl bg-[var(--theme-bg)] px-4 py-3">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-[var(--theme-text)]">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--theme-primary)] text-xs text-white">
                1
              </span>
              현재 비밀번호 확인
            </span>
            <span className={`text-xs font-bold ${stepVerified ? "text-emerald-600" : "text-[var(--theme-text-muted)]"}`}>
              {stepVerified ? "완료" : "진행 중"}
            </span>
          </div>

          {!stepVerified ? (
            <div className="rounded-2xl border border-[var(--theme-border-light)] bg-[var(--theme-bg)] p-5 text-sm leading-6 text-[var(--theme-text-muted)]">
              먼저 입력란에 현재 비밀번호를 입력해 본인 인증을 해주세요. 인증이 끝나면 새 비밀번호를 변경할 수 있습니다.
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                update();
              }}
            >
              <div className="space-y-2">
                <Label className="text-sm font-bold text-[var(--theme-text)]">새 비밀번호</Label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => handleChange("newPassword", event.target.value)}
                  className="h-12 rounded-xl border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text)]"
                  placeholder="영문, 숫자, 특수문자 조합 8~20자"
                />
                {error.rule && <p className="text-xs text-red-500">{error.rule}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-[var(--theme-text)]">새 비밀번호 확인</Label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={newPasswordConfirm}
                  onChange={(event) => handleChange("newPasswordConfirm", event.target.value)}
                  className="h-12 rounded-xl border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text)]"
                  placeholder="새 비밀번호를 한 번 더 입력"
                />
                {error.confirm && <p className="text-xs text-red-500">{error.confirm}</p>}
              </div>

              <MoaButton className="w-full" type="submit" disabled={isUpdateDisabled}>
                비밀번호 변경
              </MoaButton>
            </form>
          )}
        </MoaCard>
      </div>

      <Dialog open={modalOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-sm rounded-2xl border border-[var(--theme-border-light)] bg-[var(--theme-surface)]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[var(--theme-text)]">
              <KeyRound className="h-5 w-5 text-[var(--theme-primary)]" />
              현재 비밀번호 확인
            </DialogTitle>
            <DialogDescription className="text-sm text-[var(--theme-text-muted)]">
              본인 인증을 위해 현재 비밀번호를 입력해 주세요.
            </DialogDescription>
          </DialogHeader>

          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              verify();
            }}
          >
            <Label className="text-xs font-bold text-[var(--theme-text-muted)]">현재 비밀번호</Label>
            <Input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => handleChange("currentPassword", event.target.value)}
              className="h-12 rounded-xl border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text)]"
            />
            {error.current && <p className="text-xs text-red-500">{error.current}</p>}

            <MoaButton className="w-full" type="submit" disabled={isVerifyDisabled}>
              확인
            </MoaButton>
          </form>
        </DialogContent>
      </Dialog>
    </MoaPage>
  );
}
