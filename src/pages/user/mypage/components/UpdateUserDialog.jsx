import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { BellRing, Upload, User } from "lucide-react";
import { formatPhone } from "@/utils/phoneUtils";
import useUpdateUser from "@/hooks/user/useUpdateUser";
import { MoaButton } from "@/shared/ui";

export function UpdateUserDialog({ open, onOpenChange }) {
  const {
    fileRef,
    email,
    nickname,
    phone,
    agreeMarketing,
    displayImage,
    nickMsg,
    openFilePicker,
    onImageSelect,
    onNicknameChange,
    onNicknameBlur,
    onAgreeMarketingChange,
    onPassVerify,
    onSave,
  } = useUpdateUser();

  const handleSave = async () => {
    const result = await onSave?.();
    const ok =
      result === true ||
      result?.success === true ||
      result?.data?.success === true;

    if (ok) onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border border-[var(--theme-border-light)] bg-[var(--theme-surface)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[var(--theme-text)]">
            <User className="h-5 w-5 text-[var(--theme-primary)]" />
            회원정보 수정
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              className="group relative"
              onClick={openFilePicker}
              aria-label="프로필 이미지 변경"
            >
              <Avatar className="h-20 w-20 border border-[var(--theme-border-light)]">
                <AvatarImage src={displayImage} className="object-cover" />
                <AvatarFallback className="bg-[var(--theme-primary-light)] text-[var(--theme-primary)]">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Upload className="h-5 w-5 text-white" />
              </span>
            </button>

            <MoaButton type="button" variant="secondary" size="sm" onClick={openFilePicker}>
              이미지 변경
            </MoaButton>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onImageSelect}
              className="hidden"
            />
          </div>

          <Separator className="bg-[var(--theme-border-light)]" />

          <div className="space-y-2">
            <Label className="text-sm font-bold text-[var(--theme-text)]">이메일 (ID)</Label>
            <Input
              readOnly
              value={email || ""}
              className="h-12 cursor-not-allowed rounded-xl border-[var(--theme-border)] bg-[var(--theme-bg)] text-[var(--theme-text-muted)]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-[var(--theme-text)]">닉네임</Label>
            <Input
              value={nickname || ""}
              onChange={(event) => onNicknameChange?.(event.target.value)}
              onBlur={onNicknameBlur}
              placeholder="변경할 닉네임 입력"
              className="h-12 rounded-xl border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text)]"
            />
            {!!nickMsg?.text && (
              <p className={`text-xs ${nickMsg.isError ? "text-red-500" : "text-emerald-600"}`}>
                {nickMsg.text}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-[var(--theme-text)]">휴대폰 번호</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={formatPhone(phone) || "-"}
                className="h-12 flex-1 cursor-not-allowed rounded-xl border-[var(--theme-border)] bg-[var(--theme-bg)] text-[var(--theme-text-muted)]"
              />
              <MoaButton type="button" variant="secondary" onClick={onPassVerify}>
                본인인증
              </MoaButton>
            </div>
          </div>

          <Separator className="bg-[var(--theme-border-light)]" />

          <div className="rounded-2xl border border-[var(--theme-border-light)] bg-[var(--theme-bg)] p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <BellRing className="h-4 w-4 text-[var(--theme-primary)]" />
                <div>
                  <p className="text-sm font-bold text-[var(--theme-text)]">
                    마케팅 정보 수신 동의
                  </p>
                  <p className="text-xs text-[var(--theme-text-muted)]">
                    이벤트 및 혜택 정보를 받아보세요
                  </p>
                </div>
              </div>
              <Switch
                checked={!!agreeMarketing}
                onCheckedChange={onAgreeMarketingChange}
                className="data-[state=checked]:bg-[var(--theme-primary)]"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <MoaButton
              type="button"
              variant="secondary"
              onClick={() => onOpenChange?.(false)}
              className="flex-1"
            >
              취소
            </MoaButton>
            <MoaButton type="button" onClick={handleSave} className="flex-1">
              저장하기
            </MoaButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateUserDialog;
