import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

const TEXT = {
  selectBank: "\uc740\ud589\uc744 \uc120\ud0dd\ud558\uc138\uc694",
};

const BANKS = [
  { code: "088", name: "\uc2e0\ud55c\uc740\ud589", color: "#2F80ED", logo: "\uc2e0\ud55c" },
  { code: "004", name: "KB\uad6d\ubbfc\uc740\ud589", color: "#FFBC00", logo: "KB", textColor: "#111827" },
  { code: "020", name: "\uc6b0\ub9ac\uc740\ud589", color: "#0067B1", logo: "\uc6b0\ub9ac" },
  { code: "081", name: "\ud558\ub098\uc740\ud589", color: "#009591", logo: "\ud558\ub098" },
  { code: "011", name: "NH\ub18d\ud611\uc740\ud589", color: "#00A54F", logo: "NH" },
  { code: "003", name: "IBK\uae30\uc5c5\uc740\ud589", color: "#005BAC", logo: "IBK" },
  { code: "023", name: "SC\uc81c\uc77c\uc740\ud589", color: "#0072CE", logo: "SC" },
  { code: "089", name: "\ucf00\uc774\ubc45\ud06c", color: "#5A4AE3", logo: "K" },
  { code: "090", name: "\uce74\uce74\uc624\ubc45\ud06c", color: "#FFEB00", logo: "\uce74\uce74\uc624", textColor: "#3C1E1E" },
  { code: "092", name: "\ud1a0\uc2a4\ubc45\ud06c", color: "#0064FF", logo: "\ud1a0\uc2a4" },
  { code: "071", name: "\uc6b0\uccb4\uad6d", color: "#E60012", logo: "\uc6b0\uccb4\uad6d" },
  { code: "045", name: "\uc0c8\ub9c8\uc744\uae08\uace0", color: "#0B8F46", logo: "MG" },
  { code: "048", name: "\uc2e0\ud611", color: "#0E4DA4", logo: "\uc2e0\ud611" },
];

export default function BankSelector({ value, onChange, disabled = false, theme = "classic" }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedBank = BANKS.find((bank) => bank.code === value);
  const isDark = theme === "dark";

  const handleSelect = (bank) => {
    onChange({ bankCode: bank.code, bankName: bank.name });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((open) => !open)}
        disabled={disabled}
        className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
          isDark ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900"
        } ${isOpen ? "border-blue-500 ring-4 ring-blue-100" : ""} ${disabled ? "opacity-60" : "hover:border-blue-400"}`}
      >
        <span className="flex items-center justify-between gap-3">
          {selectedBank ? (
            <span className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold text-white"
                style={{ backgroundColor: selectedBank.color, color: selectedBank.textColor || "#ffffff" }}
              >
                {selectedBank.logo}
              </span>
              <span className="font-semibold">{selectedBank.name}</span>
            </span>
          ) : (
            <span className="text-slate-400">{TEXT.selectBank}</span>
          )}
          <ChevronDown className={`h-5 w-5 text-slate-400 transition ${isOpen ? "rotate-180" : ""}`} />
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className={`absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-2xl border shadow-xl ${
              isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"
            }`}
          >
            {BANKS.map((bank) => (
              <button
                key={bank.code}
                type="button"
                onClick={() => handleSelect(bank)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                  isDark ? "hover:bg-blue-500/15" : "hover:bg-blue-50"
                } ${value === bank.code ? (isDark ? "bg-blue-500/15" : "bg-blue-50") : ""}`}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
                  style={{ backgroundColor: bank.color, color: bank.textColor || "#ffffff" }}
                >
                  {bank.logo}
                </span>
                <span className="flex-1 font-semibold">{bank.name}</span>
                {value === bank.code && <Check className="h-5 w-5 text-blue-500" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export { BANKS };
