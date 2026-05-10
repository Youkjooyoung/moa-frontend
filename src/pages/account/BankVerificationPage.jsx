import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";

import BankSelectionStep from "@/components/bank-verification/BankSelectionStep";
import CompletionStep from "@/components/bank-verification/CompletionStep";
import ProcessingStep from "@/components/bank-verification/ProcessingStep";
import VerificationStep from "@/components/bank-verification/VerificationStep";
import VirtualBankModal from "@/components/bank-verification/VirtualBankModal";
import useBankVerificationStore from "@/store/bankVerificationStore";
import { ThemeSwitcher, useTheme } from "../../config/themeConfig";

const STEP_ORDER = ["input", "processing", "verify", "complete"];
const STEP_LABELS = {
  input: "\uacc4\uc88c \uc785\ub825",
  processing: "\ud655\uc778 \uc911",
  verify: "\ucd94\uac00 \uc778\uc99d",
  complete: "\uc644\ub8cc",
};

export default function BankVerificationPage() {
  const navigate = useNavigate();
  const { step, reset } = useBankVerificationStore();
  const { theme, setTheme, currentTheme } = useTheme("appTheme");
  const stepNumber = STEP_ORDER.indexOf(step) + 1;

  useEffect(() => {
    reset();
  }, [reset]);

  const renderStep = () => {
    switch (step) {
      case "input":
        return <BankSelectionStep key="input" theme={theme} currentTheme={currentTheme} />;
      case "processing":
        return <ProcessingStep key="processing" />;
      case "verify":
        return <VerificationStep key="verify" />;
      case "complete":
        return <CompletionStep key="complete" />;
      default:
        return <BankSelectionStep key="input" theme={theme} currentTheme={currentTheme} />;
    }
  };

  return (
    <div className={`min-h-[calc(100vh-160px)] px-4 py-8 ${theme === "dark" ? "bg-slate-950" : "bg-slate-50"}`}>
      <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

      <div className="mx-auto max-w-md">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-5 w-5" />
          {"\ub4a4\ub85c\uac00\uae30"}
        </button>

        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            {STEP_ORDER.map((item, index) => {
              const done = index + 1 < stepNumber;
              const active = index + 1 === stepNumber;
              return (
                <div key={item} className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition ${
                      done || active ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  <span className={`mt-1 text-xs ${done || active ? "font-semibold text-blue-600" : "text-slate-400"}`}>
                    {STEP_LABELS[item]}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{ width: `${((stepNumber - 1) / (STEP_ORDER.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {renderStep()}
      </div>

      <VirtualBankModal />
    </div>
  );
}
