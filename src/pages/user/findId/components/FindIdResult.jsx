import { useThemeStore } from "@/store/themeStore";

const authThemeStyles = {
  default: {
    buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
    textColor: 'text-gray-600',
    cardBorder: 'border',
    cardBg: 'bg-gray-50',
  },
  christmas: {
    buttonBg: 'bg-[#c41e3a] hover:bg-red-700',
    textColor: 'text-gray-600',
    cardBorder: 'border',
    cardBg: 'bg-gray-50',
  },
};

export function FindIdResult({ email }) {
  const { theme } = useThemeStore();
  const themeStyle = authThemeStyles[theme] || authThemeStyles.pop;

  return (
    <div className={`${themeStyle.cardBorder} rounded-xl p-8 ${themeStyle.cardBg}`}>
      <div className="space-y-3 pt-4 animate-in fade-in duration-300">
        <p className={`${themeStyle.textColor} text-sm text-center`}>회원가입된 이메일</p>

        <div className="w-full border p-3 rounded-lg text-center font-semibold bg-white text-lg">
          {email}
        </div>

        <a
          href="/login"
          className={`block mt-4 px-6 py-3 ${themeStyle.buttonBg} text-white rounded-lg w-full text-center text-sm font-semibold cursor-pointer transition`}
        >
          로그인하러 가기
        </a>
      </div>
    </div>
  );
}
