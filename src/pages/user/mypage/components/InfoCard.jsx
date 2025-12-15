import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const baseCardClass =
  "bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] h-full rounded-3xl";

export function InfoCard({ title, icon, children }) {
  return (
    <Card className={baseCardClass}>
      <CardHeader className="pb-4 px-6 pt-6 border-b border-black">
        <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">{children}</CardContent>
    </Card>
  );
}

export function InfoRow({ label, value, valueClass = "text-slate-900" }) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <span className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap w-20">
        {label}
      </span>
      <span
        className={`text-sm font-semibold ${valueClass} min-w-0 truncate`}
      >
        {value}
      </span>
    </div>
  );
}
