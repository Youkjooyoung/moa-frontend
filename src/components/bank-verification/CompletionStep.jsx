import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, PartyPopper, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useBankVerificationStore from "@/store/bankVerificationStore";

import { BANKS } from "./BankSelector";

const TEXT = {
  title: "\uacc4\uc88c \ub4f1\ub85d \uc644\ub8cc",
  immediate: "\uacc4\uc88c \uc815\ubcf4 \ud655\uc778\uc774 \uc644\ub8cc\ub418\uc5b4 \uc815\uc0b0 \uacc4\uc88c\ub85c \ub4f1\ub85d\ud588\uc2b5\ub2c8\ub2e4.",
  oneWon: "\uc778\uc99d\ubc88\ud638 \ud655\uc778 \ud6c4 \uc815\uc0b0 \uacc4\uc88c\ub85c \ub4f1\ub85d\ud588\uc2b5\ub2c8\ub2e4.",
  checkAccount: "\uacc4\uc88c \uc815\ubcf4 \ud655\uc778",
  active: "\uc815\uc0b0 \uacc4\uc88c \ud65c\uc131\ud654 \uc644\ub8cc",
  wallet: "\uc9c0\uac11\uc73c\ub85c \uc774\ub3d9",
  home: "\ud648\uc73c\ub85c \uc774\ub3d9",
};

export default function CompletionStep() {
  const navigate = useNavigate();
  const { formData, verification, reset } = useBankVerificationStore();
  const bank = BANKS.find((item) => item.code === formData.bankCode);
  const isImmediateVerification = verification.verificationType === "IMMEDIATE";

  const handleGoToWallet = () => {
    reset();
    navigate("/user/wallet");
  };

  const handleGoHome = () => {
    reset();
    navigate("/");
  };

  return (
    <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <CardContent className="px-6 py-12">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/20">
            <PartyPopper className="h-10 w-10" />
          </div>

          <h2 className="mb-2 text-2xl font-bold text-slate-950 dark:text-white">{TEXT.title}</h2>
          <p className="mb-8 text-slate-500">{isImmediateVerification ? TEXT.immediate : TEXT.oneWon}</p>

          <div className="mb-8 rounded-3xl bg-blue-50 p-6">
            <div className="mb-4 flex items-center justify-center gap-3">
              {bank && (
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-xs font-bold text-white"
                  style={{ backgroundColor: bank.color, color: bank.textColor || "#ffffff" }}
                >
                  {bank.logo}
                </span>
              )}
              <div className="text-left">
                <p className="text-lg font-bold text-slate-950">{formData.bankName}</p>
                <p className="text-sm text-slate-500">{verification.maskedAccount || formData.accountNum}</p>
              </div>
            </div>

            {[TEXT.checkAccount, TEXT.active].map((text) => (
              <div key={text} className="flex items-center gap-2 py-1 text-sm text-slate-600">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                  <Check className="h-3 w-3 text-white" />
                </span>
                {text}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Button onClick={handleGoToWallet} className="h-14 w-full rounded-2xl bg-blue-500 text-base font-bold hover:bg-blue-600">
              <Wallet className="mr-2 h-5 w-5" />
              {TEXT.wallet}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="ghost" onClick={handleGoHome} className="h-12 w-full rounded-2xl text-slate-500">
              {TEXT.home}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
