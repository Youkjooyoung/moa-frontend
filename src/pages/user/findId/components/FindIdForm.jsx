import { useThemeStore } from "@/store/themeStore";

const authThemeStyles = {
  default: {
    buttonBg: 'bg-red-500 hover:bg-red-600',
    textColor: 'text-gray-700',
    cardBorder: 'border',
    cardBg: 'bg-gray-50',
  },
  christmas: {
    buttonBg: 'bg-[#c41e3a] hover:bg-red-700',
    textColor: 'text-gray-700',
    cardBorder: 'border',
    cardBg: 'bg-gray-50',
  },
};

export function FindIdForm({ onPassAuth, isLoading }) {
  const { theme } = useThemeStore();
  const themeStyle = authThemeStyles[theme] || authThemeStyles.default;

  return (
    <div className={`${themeStyle.cardBorder} rounded-xl p-8 ${themeStyle.cardBg}`}>
      <p className={`${themeStyle.textColor} mb-8 text-center leading-relaxed`}>
        PASS 버튼을 눌러 본인 인증을 진행해 주세요.
        <br />
        인증이 완료되면 이메일이 자동으로 표시됩니다.
      </p>

      <div className="flex justify-center mb-6">
        <button
          onClick={onPassAuth}
          disabled={isLoading}
          className={`${themeStyle.buttonBg} text-white px-12 py-4 rounded-xl text-lg font-bold cursor-pointer shadow-md transition disabled:opacity-50`}
        >
          {isLoading ? "처리중..." : "PASS"}
        </button>
      </div>
    </div>
  );
}
