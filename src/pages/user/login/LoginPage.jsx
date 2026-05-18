import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useLoginPageLogic } from "@/hooks/auth/useLogin";
import { useAuthStore } from "@/store/authStore";
import { LoginForm } from "./components/LoginForm";
import { LoginOtpDialog } from "./components/LoginOtpDialog";
import { SocialLoginButtons } from "./components/SocialLoginButtons";

export default function LoginPage() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const {
    email,
    password,
    remember,
    otpModalOpen,
    otpCode,
    otpMode,
    setField,
    handleEmailLogin,
    handleKakaoLogin,
    handleGoogleLogin,
    handleOtpChange,
    handleOtpConfirm,
    closeOtpModal,
    handleUnlockByCertification,
    switchToOtpMode,
    switchToBackupMode,
    loginLoading,
    otpLoading,
    errors,
    handleEmailChange,
    handlePasswordChange,
  } = useLoginPageLogic();

  const isBackupMode = otpMode === "backup";
  const isLoginDisabled = loginLoading || !email.trim() || !password.trim();
  const redirectTo = location.state?.from || "/mypage";

  useEffect(() => {
    setField("password", "");
  }, [setField]);

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <main className="min-h-screen bg-[var(--theme-bg)] px-4 py-10 text-[var(--theme-text)] sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[480px] items-center">
        <div className="w-full rounded-[32px] border border-[var(--theme-border-light)] bg-[var(--theme-surface)] p-6 shadow-2xl shadow-slate-900/5 sm:p-8">
          <div className="mb-7 text-center">
            <h1 className="text-3xl font-black tracking-tight text-[var(--theme-text)]">{"\uB85C\uADF8\uC778"}</h1>
          </div>

          <LoginForm
            email={email}
            password={password}
            remember={remember}
            errors={errors}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onRememberChange={(value) => setField("remember", value)}
            onSubmit={handleEmailLogin}
            onUnlock={handleUnlockByCertification}
            isLoginDisabled={isLoginDisabled}
            loginLoading={loginLoading}
          />

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-[var(--theme-border-light)]" />
            <span className="text-xs font-bold text-[var(--theme-text-muted)]">{"\uB610\uB294"}</span>
            <span className="h-px flex-1 bg-[var(--theme-border-light)]" />
          </div>

          <SocialLoginButtons
            onKakao={handleKakaoLogin}
            onGoogle={handleGoogleLogin}
            loginLoading={loginLoading}
          />
        </div>
      </section>

      <LoginOtpDialog
        open={otpModalOpen}
        isBackupMode={isBackupMode}
        otpCode={otpCode}
        errors={errors}
        onOpenChange={closeOtpModal}
        onSwitchOtp={switchToOtpMode}
        onSwitchBackup={switchToBackupMode}
        onChangeCode={handleOtpChange}
        onConfirm={handleOtpConfirm}
        loading={otpLoading}
      />
    </main>
  );
}