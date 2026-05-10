import { useEffect } from "react";
import { initResetPwdPage } from "@/hooks/auth/useResetPassword";
import { ResetPwdGuide } from "./components/ResetPwdGuide";
import { ResetPwdForm } from "./components/ResetPwdForm";
import { PageTitle } from "../shared/PageTitle";
import { PageSteps } from "../shared/PageSteps";
import { useThemeStore } from "@/store/themeStore";
import { ThemeSwitcher } from "@/config/themeConfig";
import { themeClasses } from "@/utils/themeUtils";

export default function ResetPwdPage() {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    initResetPwdPage();
  }, []);

  const steps = [
    { number: 1, label: "본인 인증", active: true },
    { number: 2, label: "새 비밀번호 설정", active: false },
  ];

  return (
    <div className={`min-h-screen ${themeClasses.bg.base} ${themeClasses.text.primary} transition-colors duration-300`}>
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      <div className="mx-auto max-w-5xl space-y-8 px-4 pb-20 pt-20 sm:px-6 lg:px-10">
        <div className="text-center">
          <PageTitle
            title={theme === "christmas" ? "비밀번호 재설정" : "비밀번호 재설정"}
            subtitle="PASS 본인 인증 후 새 비밀번호를 설정해 주세요."
          />
        </div>

        <div className={`space-y-8 rounded-3xl p-10 ${themeClasses.card.elevated}`}>
          <PageSteps steps={steps} />

          <div className="grid gap-6 md:grid-cols-2">
            <ResetPwdGuide />
            <ResetPwdForm />
          </div>

          <p className={`text-center text-xs ${themeClasses.text.muted}`}>
            본인 확인이 완료된 경우 비밀번호 재설정이 가능합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
