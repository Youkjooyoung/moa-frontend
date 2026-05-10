import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, RefreshCw } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyAndRegister } from "@/api/bankAccountApi";
import useBankVerificationStore from "@/store/bankVerificationStore";

import CodeInput from "./CodeInput";
import CountdownTimer from "./CountdownTimer";
import { BANKS } from "./BankSelector";

const TEXT = {
  title: "\uc778\uc99d\ubc88\ud638\ub97c \uc785\ub825\ud574\uc8fc\uc138\uc694",
  description: "\ud14c\uc2a4\ud2b8 \ud658\uacbd\uc5d0\uc11c\ub294 \ubc1c\uae09\ub41c 4\uc790\ub9ac \uc778\uc99d\ubc88\ud638\ub85c \uacc4\uc88c \ub4f1\ub85d\uc744 \uc644\ub8cc\ud569\ub2c8\ub2e4.",
  code: "\uc778\uc99d\ubc88\ud638 4\uc790\ub9ac",
  mockCode: "\ud14c\uc2a4\ud2b8 \uc778\uc99d\ubc88\ud638",
  remain: "\ub0a8\uc740 \uc2dc\ub3c4",
  verify: "\uc778\uc99d \uc644\ub8cc",
  verifying: "\ud655\uc778 \uc911",
  retry: "\ub2e4\uc2dc \uc694\uccad\ud558\uae30",
  expired: "\uc778\uc99d \uc2dc\uac04\uc774 \ub9cc\ub8cc\ub418\uc5c8\uc2b5\ub2c8\ub2e4. \ub2e4\uc2dc \uc694\uccad\ud574\uc8fc\uc138\uc694.",
  mismatch: "\uc778\uc99d\ubc88\ud638\uac00 \uc77c\uce58\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.",
  fail: "\uc778\uc99d\ubc88\ud638 \ud655\uc778\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.",
};

export default function VerificationStep() {
  const {
    formData,
    verification,
    setStep,
    setError,
    error,
    clearError,
    decrementAttempts,
  } = useBankVerificationStore();

  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const bank = BANKS.find((item) => item.code === formData.bankCode);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setCodeError(false);
    clearError();
  };

  const getErrorMessage = (errorObject) =>
    errorObject.response?.data?.error?.message ||
    errorObject.response?.data?.message ||
    TEXT.fail;

  const handleSubmit = async (submittedCode = code) => {
    if (submittedCode.length !== 4) return;

    setIsSubmitting(true);
    clearError();
    setCodeError(false);

    try {
      const response = await verifyAndRegister(verification.bankTranId, submittedCode);
      if (response.success !== false && !response.error) {
        setStep("complete");
      } else {
        setCodeError(true);
        decrementAttempts();
        setError(response.message || response.error?.message || TEXT.mismatch);
        setCode("");
      }
    } catch (err) {
      console.error("Bank verification failed:", err);
      setCodeError(true);
      decrementAttempts();
      setError(getErrorMessage(err));
      setCode("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExpire = () => {
    setError(TEXT.expired);
  };

  return (
    <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <CardHeader className="pb-4 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-green-500 text-white">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <CardTitle className="text-xl font-bold text-slate-950 dark:text-white">{TEXT.title}</CardTitle>
        <CardDescription className="text-slate-500">{TEXT.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-center gap-3 rounded-2xl bg-blue-50 p-4">
          {bank && (
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold text-white"
              style={{ backgroundColor: bank.color, color: bank.textColor || "#ffffff" }}
            >
              {bank.logo}
            </span>
          )}
          <div className="text-left">
            <p className="font-semibold text-slate-950">{formData.bankName}</p>
            <p className="text-sm text-slate-500">{verification.maskedAccount || formData.accountNum}</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              {verification.remainingAttempts > 0 && (
                <span className="mt-1 block text-xs">
                  {TEXT.remain}: {verification.remainingAttempts}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <p className="text-center text-sm font-semibold text-slate-500">{TEXT.code}</p>
          {verification.verifyCode && (
            <div className="mx-auto max-w-xs rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-center">
              <p className="text-xs font-semibold text-blue-500">{TEXT.mockCode}</p>
              <p className="mt-1 font-mono text-2xl font-bold tracking-[0.4em] text-blue-700">
                {verification.verifyCode}
              </p>
            </div>
          )}
          <CodeInput
            value={code}
            onChange={handleCodeChange}
            onComplete={handleSubmit}
            disabled={isSubmitting}
            error={codeError}
          />
        </div>

        <div className="text-center">
          <CountdownTimer expiresAt={verification.expiresAt} onExpire={handleExpire} />
        </div>

        <Button
          onClick={() => handleSubmit()}
          disabled={code.length !== 4 || isSubmitting}
          className="h-14 w-full rounded-2xl bg-blue-500 text-base font-bold hover:bg-blue-600"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {TEXT.verifying}
            </>
          ) : (
            TEXT.verify
          )}
        </Button>

        <button
          type="button"
          onClick={() => setStep("input")}
          disabled={isSubmitting}
          className="mx-auto flex items-center gap-1 text-sm text-slate-500 transition hover:text-blue-600"
        >
          <RefreshCw className="h-4 w-4" />
          {TEXT.retry}
        </button>
      </CardContent>
    </Card>
  );
}
