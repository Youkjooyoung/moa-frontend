import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  email,
  password,
  remember,
  errors,
  onEmailChange,
  onPasswordChange,
  onRememberChange,
  onSubmit,
  onUnlock,
  isLoginDisabled,
  loginLoading,
}) {
  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="loginEmail" className="text-sm font-bold text-[var(--theme-text)]">
          이메일
        </Label>
        <Input
          id="loginEmail"
          autoComplete="email"
          placeholder="이메일 주소 입력"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          className="h-[52px] rounded-2xl border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 text-base font-semibold text-[var(--theme-text)] shadow-sm focus-visible:ring-[var(--theme-focus-ring)]"
        />
        {errors.email && <p className="text-xs font-semibold text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="loginPassword" className="text-sm font-bold text-[var(--theme-text)]">
          비밀번호
        </Label>
        <Input
          id="loginPassword"
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          className="h-[52px] rounded-2xl border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 text-base font-semibold text-[var(--theme-text)] shadow-sm focus-visible:ring-[var(--theme-focus-ring)]"
        />
        {errors.password && <p className="text-xs font-semibold text-red-500">{errors.password}</p>}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-[var(--theme-text-muted)]">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => onRememberChange(event.target.checked)}
            className="h-4 w-4 rounded border-[var(--theme-border)] text-[var(--theme-primary)] focus:ring-[var(--theme-focus-ring)]"
          />
          로그인 정보 저장
        </label>

        <div className="flex gap-3">
          <Link to="/signup" className="font-bold text-[var(--theme-text)] hover:text-[var(--theme-primary)]">
            회원가입
          </Link>
          <Link to="/find-email" className="font-bold text-[var(--theme-text)] hover:text-[var(--theme-primary)]">
            이메일 찾기
          </Link>
        </div>
      </div>

      <Button
        id="btnLogin"
        type="submit"
        className="h-[52px] w-full rounded-2xl bg-[var(--theme-primary)] text-base font-black text-white shadow-lg shadow-blue-500/20 hover:bg-[var(--theme-primary-hover)]"
        disabled={isLoginDisabled}
      >
        {loginLoading ? "로그인 중..." : "로그인"}
      </Button>

      <button
        type="button"
        onClick={onUnlock}
        className="w-full text-right text-sm font-bold text-[var(--theme-text-muted)] transition hover:text-[var(--theme-primary)]"
      >
        잠금 계정 풀기
      </button>
    </form>
  );
}
