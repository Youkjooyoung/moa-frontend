import { useState } from "react";
import { AlertCircle, Building2, Loader2, ShieldCheck } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestVerification } from "@/api/bankAccountApi";
import useBankVerificationStore from "@/store/bankVerificationStore";

import BankSelector from "./BankSelector";

const TEXT = {
  title: "\uc815\uc0b0 \uacc4\uc88c\ub97c \ub4f1\ub85d\ud574\uc8fc\uc138\uc694",
  description: "\uacc4\uc88c\ubc88\ud638\uc640 \uc608\uae08\uc8fc\uba85\uc744 \uc785\ub825\ud558\uba74 \uc815\uc0b0 \uacc4\uc88c \ub4f1\ub85d\uc744 \uc9c4\ud589\ud569\ub2c8\ub2e4.",
  bank: "\uc740\ud589 \uc120\ud0dd",
  account: "\uacc4\uc88c\ubc88\ud638",
  accountPlaceholder: "\uc22b\uc790\ub9cc \uc785\ub825",
  accountHelp: "\ud558\uc774\ud508 \uc5c6\uc774 \uc22b\uc790\ub9cc \uc785\ub825\ud558\uc138\uc694.",
  holder: "\uc608\uae08\uc8fc\uba85",
  holderPlaceholder: "\uc608\uae08\uc8fc\uba85 \uc785\ub825",
  security: "\uc785\ub825\ud55c \uc815\ubcf4\ub294 \uc815\uc0b0 \uacc4\uc88c \ub4f1\ub85d\uacfc \uc815\uc0b0 \ucc98\ub9ac\uc5d0\ub9cc \uc0ac\uc6a9\ub429\ub2c8\ub2e4.",
  submit: "\uacc4\uc88c \ub4f1\ub85d \uc694\uccad",
  submitting: "\ud655\uc778 \uc911",
  error: "\uacc4\uc88c \ud655\uc778 \uc694\uccad\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.",
};

const MOCK_PROCESSING_DELAY_MS = 5200;
const IMMEDIATE_PROCESSING_DELAY_MS = 2400;

export default function BankSelectionStep({ theme = "classic" }) {
  const {
    formData,
    setFormData,
    setStep,
    setVerificationSuccess,
    setError,
    error,
    clearError,
  } = useBankVerificationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBankChange = ({ bankCode, bankName }) => {
    setFormData({ bankCode, bankName });
    clearError();
  };

  const handleAccountNumChange = (event) => {
    setFormData({ accountNum: event.target.value.replace(/[^0-9]/g, "") });
    clearError();
  };

  const handleAccountHolderChange = (event) => {
    setFormData({ accountHolder: event.target.value });
    clearError();
  };

  const isValid = () =>
    formData.bankCode && formData.accountNum.length >= 8 && formData.accountHolder.trim().length >= 2;

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber || accountNumber.length < 6) return accountNumber;
    return `${accountNumber.slice(0, 3)}-***-***${accountNumber.slice(-3)}`;
  };

  const normalizeExpiresAt = (expiresAt) => {
    if (!expiresAt) {
      return new Date(Date.now() + 10 * 60 * 1000).toISOString();
    }

    const value = String(expiresAt);
    const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);
    const normalized = hasTimezone ? value : `${value}Z`;
    const parsed = new Date(normalized);

    if (Number.isNaN(parsed.getTime()) || parsed.getTime() <= Date.now() + 5000) {
      return new Date(Date.now() + 10 * 60 * 1000).toISOString();
    }

    return parsed.toISOString();
  };

  const getErrorMessage = (errorObject) =>
    errorObject.response?.data?.error?.message ||
    errorObject.response?.data?.message ||
    errorObject.message ||
    TEXT.error;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValid()) return;

    setIsSubmitting(true);
    clearError();

    try {
      const response = await requestVerification(
        formData.bankCode,
        formData.accountNum,
        formData.accountHolder.trim(),
      );

      setStep("processing");
      const targetStep = response.verified ? "complete" : "verify";
      const processingDelay = response.verified ? IMMEDIATE_PROCESSING_DELAY_MS : MOCK_PROCESSING_DELAY_MS;

      setTimeout(() => {
        setVerificationSuccess(
          {
            bankTranId: response.bankTranId,
            maskedAccount: response.maskedAccount || maskAccountNumber(formData.accountNum),
            expiresAt: normalizeExpiresAt(response.expiresAt),
            verifyCode: response.printContent || response.verifyCode || "",
            verificationType: response.verificationType || (response.verified ? "IMMEDIATE" : "ONE_WON"),
          },
          targetStep,
        );
      }, processingDelay);
    } catch (err) {
      console.error("Bank account verification request failed:", err);
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <CardHeader className="pb-4 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">
          <Building2 className="h-8 w-8" />
        </div>
        <CardTitle className="text-xl font-bold text-slate-950 dark:text-white">{TEXT.title}</CardTitle>
        <CardDescription className="text-slate-500">{TEXT.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>{TEXT.bank}</Label>
            <BankSelector value={formData.bankCode} onChange={handleBankChange} disabled={isSubmitting} theme={theme} />
          </div>

          <div className="space-y-2">
            <Label>{TEXT.account}</Label>
            <Input
              type="text"
              inputMode="numeric"
              value={formData.accountNum}
              onChange={handleAccountNumChange}
              placeholder={TEXT.accountPlaceholder}
              maxLength={20}
              disabled={isSubmitting}
              className="h-12 rounded-2xl"
            />
            <p className="text-xs text-slate-500">{TEXT.accountHelp}</p>
          </div>

          <div className="space-y-2">
            <Label>{TEXT.holder}</Label>
            <Input
              type="text"
              value={formData.accountHolder}
              onChange={handleAccountHolderChange}
              placeholder={TEXT.holderPlaceholder}
              maxLength={30}
              disabled={isSubmitting}
              className="h-12 rounded-2xl"
            />
          </div>

          <div className="flex gap-3 rounded-2xl bg-blue-50 p-4 text-sm text-blue-900">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <p>{TEXT.security}</p>
          </div>

          <Button
            type="submit"
            disabled={!isValid() || isSubmitting}
            className="h-14 w-full rounded-2xl bg-blue-500 text-base font-bold hover:bg-blue-600"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {TEXT.submitting}
              </>
            ) : (
              TEXT.submit
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
