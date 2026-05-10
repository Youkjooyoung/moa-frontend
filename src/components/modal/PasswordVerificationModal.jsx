export default function PasswordVerificationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-sm rounded-2xl border border-[var(--theme-border-light)] bg-[var(--theme-surface)] p-6 shadow-[var(--theme-shadow-hover)]">
        <h3 className="mb-4 text-xl font-bold text-[var(--theme-text)]">현재 비밀번호 확인</h3>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-2xl text-[var(--theme-text-muted)] transition hover:bg-[var(--theme-primary-light)] hover:text-[var(--theme-text)]"
          aria-label="닫기"
        >
          &times;
        </button>

        <div id="passwordUpdateStep1">
          <p className="mb-4 text-sm text-[var(--theme-text-muted)]">
            비밀번호를 변경하려면 현재 로그인된 계정의 비밀번호를 입력해 주세요.
          </p>

          <div className="space-y-4">
            <input
              id="currentPassword"
              type="password"
              placeholder="현재 비밀번호"
              className="w-full rounded-xl border border-[var(--theme-border-light)] bg-[var(--theme-surface)] p-3 text-sm text-[var(--theme-text)] outline-none transition focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-focus-ring)]"
            />

            <p id="currentPasswordError" className="hidden text-xs text-red-500">
              비밀번호가 일치하지 않습니다.
            </p>

            <button
              id="btnVerifyCurrentPassword"
              className="w-full rounded-xl bg-[var(--theme-primary)] py-3 text-sm font-semibold text-white transition hover:bg-[var(--theme-primary-hover)]"
              type="button"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
