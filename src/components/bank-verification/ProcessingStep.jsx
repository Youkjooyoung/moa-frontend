import { useEffect, useState } from "react";
import { Check, Circle, Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import useBankVerificationStore from "@/store/bankVerificationStore";

const TEXT = {
  title: "\uacc4\uc88c \uc815\ubcf4\ub97c \ud655\uc778\ud558\uace0 \uc788\uc2b5\ub2c8\ub2e4",
};

const PROCESSING_STEPS = [
  { id: 1, label: "\uacc4\uc88c\ubc88\ud638 \ud615\uc2dd \ud655\uc778", duration: 900 },
  { id: 2, label: "\uc608\uae08\uc8fc\uba85 \ud655\uc778", duration: 1500 },
  { id: 3, label: "\ud14c\uc2a4\ud2b8 \uc778\uc99d\ubc88\ud638 \ubc1c\uae09", duration: 1500 },
  { id: 4, label: "\uc815\uc0b0 \uacc4\uc88c \ub4f1\ub85d \uc900\ube44", duration: 900 },
];

export default function ProcessingStep() {
  const { formData } = useBankVerificationStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let totalElapsed = 0;
    const timeouts = PROCESSING_STEPS.map((step, index) => {
      const timeout = setTimeout(() => setCurrentStep(index + 1), totalElapsed);
      totalElapsed += step.duration;
      return timeout;
    });
    return () => timeouts.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 3;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const getStepStatus = (index) => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "processing";
    return "pending";
  };

  return (
    <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <CardContent className="px-6 py-12">
        <div className="text-center">
          <div className="relative mx-auto mb-8 h-24 w-24">
            <div className="absolute inset-0 rounded-full bg-blue-100" />
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-blue-500 shadow-lg shadow-blue-500/20">
              <Loader2 className="h-10 w-10 animate-spin text-white" />
            </div>
          </div>

          <h2 className="mb-2 text-xl font-bold text-slate-950 dark:text-white">{TEXT.title}</h2>
          <p className="mb-8 text-slate-500">
            {formData.bankName} {formData.accountHolder}
          </p>

          <div className="mx-auto mb-8 max-w-xs">
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-400">{Math.round(progress)}%</p>
          </div>

          <div className="mx-auto max-w-xs space-y-3">
            {PROCESSING_STEPS.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div key={step.id} className="flex items-center gap-3 text-left">
                  <div className="h-6 w-6 shrink-0">
                    {status === "completed" ? (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                        <Check className="h-4 w-4 text-white" />
                      </span>
                    ) : status === "processing" ? (
                      <span className="block h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                    ) : (
                      <Circle className="h-6 w-6 text-slate-300" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      status === "completed"
                        ? "font-semibold text-green-600"
                        : status === "processing"
                          ? "font-semibold text-blue-600"
                          : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
