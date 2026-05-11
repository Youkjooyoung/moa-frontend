import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Receipt, ShieldCheck, TrendingUp } from "lucide-react";
import PaymentHistoryList from "@/components/history/PaymentHistoryList";
import DepositHistoryList from "@/components/history/DepositHistoryList";
import SettlementHistoryList from "@/components/history/SettlementHistoryList";
import { useTheme } from "@/config/themeConfig";
import { MoaCard, MoaPage, MoaPageHeader } from "@/shared/ui";

const tabs = [
  { id: "payment", label: "결제 내역", shortLabel: "결제", icon: Receipt },
  { id: "deposit", label: "보증금 내역", shortLabel: "보증금", icon: ShieldCheck },
  { id: "settlement", label: "정산 내역", shortLabel: "정산", icon: TrendingUp },
];

export default function FinancialHistoryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    tabs.some((item) => item.id === requestedTab) ? requestedTab : "payment"
  );
  const { theme, currentTheme } = useTheme("appTheme");

  return (
    <MoaPage className="max-w-5xl">
      <MoaPageHeader
        eyebrow="History"
        title="금융 내역"
        description=""
        backLabel="내 지갑으로"
        onBack={() => navigate("/mypage/wallet")}
      />

      <div className="space-y-6">
        <MoaCard className="overflow-hidden p-0">
          <div className="grid grid-cols-3 border-b border-[var(--theme-border-light)]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex h-14 items-center justify-center gap-2 text-sm font-bold transition ${
                    isActive
                      ? "bg-[var(--theme-primary-light)] text-[var(--theme-primary)]"
                      : "text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg)] hover:text-[var(--theme-text)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>

          <div className="min-h-[400px] p-5 sm:p-6">
            {activeTab === "payment" && <PaymentHistoryList theme={theme} currentTheme={currentTheme} />}
            {activeTab === "deposit" && <DepositHistoryList theme={theme} currentTheme={currentTheme} />}
            {activeTab === "settlement" && <SettlementHistoryList theme={theme} currentTheme={currentTheme} />}
          </div>
        </MoaCard>

        <div className="grid gap-4 md:grid-cols-3">
          <MoaCard className="p-5">
            <Receipt className="mb-3 h-5 w-5 text-[var(--theme-primary)]" />
            <p className="text-sm font-semibold text-[var(--theme-text-muted)]">자동 결제</p>
            <p className="mt-1 font-black text-[var(--theme-text)]">구독별 결제 흐름</p>
          </MoaCard>
          <MoaCard className="p-5">
            <ShieldCheck className="mb-3 h-5 w-5 text-[var(--theme-primary)]" />
            <p className="text-sm font-semibold text-[var(--theme-text-muted)]">보증금 보관</p>
            <p className="mt-1 font-black text-[var(--theme-text)]">안전하게 보관 중</p>
          </MoaCard>
          <MoaCard className="p-5">
            <TrendingUp className="mb-3 h-5 w-5 text-[var(--theme-primary)]" />
            <p className="text-sm font-semibold text-[var(--theme-text-muted)]">정산 처리</p>
            <p className="mt-1 font-black text-[var(--theme-text)]">계좌 기준 관리</p>
          </MoaCard>
        </div>
      </div>
    </MoaPage>
  );
}
