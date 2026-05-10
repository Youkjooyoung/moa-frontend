export function ResetPwdForm() {
  return (
    <div
      id="resetFormArea"
      className="hidden space-y-4 rounded-3xl border border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] p-5 pt-4 shadow-[var(--theme-shadow)]"
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="space-y-1">
          <label className="text-sm font-black text-[var(--theme-text)]">새 비밀번호</label>
          <input
            id="resetNewPassword"
            type="password"
            autoComplete="new-password"
            className="w-full rounded-2xl border border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] p-3 text-[var(--theme-text)] shadow-[var(--theme-shadow)] outline-none placeholder:text-[var(--theme-text-muted)] focus:border-[var(--theme-primary)] focus-visible:ring-0"
            placeholder="8~20자, 영문/숫자/특수문자 포함"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-black text-[var(--theme-text)]">
            새 비밀번호 확인
          </label>
          <input
            id="resetNewPasswordCheck"
            type="password"
            autoComplete="new-password"
            className="w-full rounded-2xl border border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] p-3 text-[var(--theme-text)] shadow-[var(--theme-shadow)] outline-none placeholder:text-[var(--theme-text-muted)] focus:border-[var(--theme-primary)] focus-visible:ring-0"
            placeholder="같은 비밀번호를 입력해 주세요"
          />
        </div>

        <button
          id="btnResetPwd"
          type="submit"
          className="w-full rounded-2xl border border-[var(--theme-primary)] bg-[var(--theme-primary)] py-3 text-lg font-black text-white shadow-[var(--theme-shadow)] transition hover:bg-[var(--theme-primary-hover)] active:translate-x-[2px] active:translate-y-[2px]"
        >
          비밀번호 변경
        </button>
      </form>
    </div>
  );
}
