export function ResetPwdGuide() {
  return (
    <div className="space-y-4 rounded-3xl border border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] p-5 shadow-[var(--theme-shadow)]">
      <p id="resetGuide" className="text-center leading-relaxed text-[var(--theme-text-muted)]">
        PASS 인증으로 본인 확인을 진행해 주세요.
        <br />
        인증이 완료되면 새 비밀번호를 입력할 수 있습니다.
      </p>

      <div className="flex justify-center">
        <button
          id="btnResetPassAuth"
          type="button"
          className="rounded-2xl border border-[var(--theme-primary)] bg-[var(--theme-primary)] px-12 py-3 text-lg font-black text-white shadow-[var(--theme-shadow)] transition hover:bg-[var(--theme-primary-hover)] active:translate-x-[2px] active:translate-y-[2px]"
        >
          PASS 본인인증
        </button>
      </div>
    </div>
  );
}
