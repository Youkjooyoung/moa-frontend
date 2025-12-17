import { useThemeStore } from "@/store/themeStore";

const authThemeStyles = {
  default: {
    titleColor: 'text-gray-900',
    subtitleColor: 'text-gray-500',
  },
  christmas: {
    titleColor: 'text-[#c41e3a]',
    subtitleColor: 'text-gray-600',
  },
};

export function PageTitle({ title, subtitle }) {
  const { theme } = useThemeStore();
  const themeStyle = authThemeStyles[theme] || authThemeStyles.pop;

  return (
    <>
      <h2 className={`text-3xl font-bold mb-4 ${themeStyle.titleColor}`}>{title}</h2>
      {subtitle && <p className={`${themeStyle.subtitleColor} mb-6 text-sm text-center`}>{subtitle}</p>}
    </>
  );
}
