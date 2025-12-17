import { useThemeStore } from "@/store/themeStore";

const authThemeStyles = {
  default: {
    activeBg: 'bg-indigo-600',
    activeText: 'text-indigo-600',
    inactiveBg: 'bg-gray-200',
    inactiveText: 'text-gray-500',
  },
  christmas: {
    activeBg: 'bg-[#c41e3a]',
    activeText: 'text-[#c41e3a]',
    inactiveBg: 'bg-gray-200',
    inactiveText: 'text-gray-500',
  },
};

export function PageSteps({ steps }) {
  const { theme } = useThemeStore();
  const themeStyle = authThemeStyles[theme] || authThemeStyles.pop;

  if (!steps || steps.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-6 text-sm font-medium">
      {steps.map((step, idx) => {
        const isActive = step.active;
        const isLast = idx === steps.length - 1;
        return (
          <div key={step.label} className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isActive ? `${themeStyle.activeBg} text-white` : `${themeStyle.inactiveBg} ${themeStyle.inactiveText}`
                }`}
            >
              {step.number}
            </span>
            <span className={isActive ? themeStyle.activeText : "text-gray-400"}>
              {step.label}
            </span>
            {!isLast && <div className="w-8 h-px bg-gray-300 ml-4" />}
          </div>
        );
      })}
    </div>
  );
}
