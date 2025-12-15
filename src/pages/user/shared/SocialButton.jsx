import { Button } from "@/components/ui/button";

export function SocialButton({ provider, isConnected, onClick }) {
  const isGoogle = provider === "google";

  const baseNeo =
    "h-9 px-4 text-xs font-black border border-gray-200 rounded-xl " +
    "shadow-[4px_4px_12px_rgba(0,0,0,0.08)] " +
    "hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)] " +
    "hover:translate-x-[1px] hover:translate-y-[1px] " +
    "transition-all";

  const googleStyle = "bg-white text-black hover:bg-slate-50";

  const kakaoStyle = "bg-[#FEE500] text-black hover:bg-[#FDE68A]";

  const disconnectStyle = "bg-white text-red-600 hover:bg-red-50";

  return (
    <Button
      type="button"
      onClick={onClick}
      variant="outline"
      className={`${baseNeo} ${
        isConnected ? disconnectStyle : isGoogle ? googleStyle : kakaoStyle
      }`}
    >
      {isConnected
        ? `${provider.toUpperCase()} 해제`
        : `${provider.toUpperCase()} 연동`}
    </Button>
  );
}
