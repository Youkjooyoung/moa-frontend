import { createElement } from "react";
import { ArrowLeft, Inbox } from "lucide-react";
import { cn } from "@/utils/themeUtils";

export function MoaPage({ children, className = "" }) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function MoaPageHeader({
  eyebrow,
  title,
  description,
  action,
  onBack,
  backLabel = "뒤로가기",
}) {
  return (
    <div className="mb-8">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--theme-text-muted)] transition hover:text-[var(--theme-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{backLabel}</span>
        </button>
      )}
      {eyebrow && (
        <p className="mb-2 text-sm font-bold text-[var(--theme-primary)]">{eyebrow}</p>
      )}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-text)] sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--theme-text-muted)]">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}

export function MoaCard({ children, className = "", as: Component = "div", ...props }) {
  return createElement(
    Component,
    {
      className: cn(
        "rounded-2xl border border-[var(--theme-border-light)] bg-[var(--theme-surface)] shadow-[var(--theme-shadow-soft)]",
        className
      ),
      ...props,
    },
    children
  );
}

export function MoaButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-[var(--theme-primary)] text-white hover:bg-[var(--theme-primary-hover)]",
    secondary:
      "border border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text)] hover:bg-[var(--theme-surface-muted)]",
    ghost:
      "text-[var(--theme-text-muted)] hover:bg-[var(--theme-surface-muted)] hover:text-[var(--theme-text)]",
    danger: "bg-[#f04452] text-white hover:bg-[#d92d3b]",
  };
  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition focus:outline-none focus:ring-2 focus:ring-[var(--theme-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function MoaInput({ className = "", ...props }) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 text-sm font-semibold text-[var(--theme-text)] outline-none transition placeholder:text-[var(--theme-text-muted)] focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-focus-ring)]",
        className
      )}
      {...props}
    />
  );
}

export function MoaTextarea({ className = "", ...props }) {
  return (
    <textarea
      className={cn(
        "w-full resize-none rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-3 text-sm font-semibold leading-6 text-[var(--theme-text)] outline-none transition placeholder:text-[var(--theme-text-muted)] focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-focus-ring)]",
        className
      )}
      {...props}
    />
  );
}

export function MoaSelect({ className = "", ...props }) {
  return (
    <select
      className={cn(
        "h-12 w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 text-sm font-semibold text-[var(--theme-text)] outline-none transition focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-focus-ring)]",
        className
      )}
      {...props}
    />
  );
}

export function MoaField({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[var(--theme-text)]">{label}</span>
      {children}
      {hint && <span className="mt-2 block text-xs font-medium text-[var(--theme-text-muted)]">{hint}</span>}
    </label>
  );
}

export function MoaBadge({ children, tone = "neutral", className = "" }) {
  const tones = {
    primary: "bg-[var(--theme-primary-light)] text-[var(--theme-primary)]",
    info: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    danger: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
    neutral: "bg-[var(--theme-surface-muted)] text-[var(--theme-text-muted)]",
  };

  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-bold", tones[tone], className)}>
      {children}
    </span>
  );
}

export function MoaEmptyState({ title, description, action, icon: Icon = Inbox, className = "" }) {
  return (
    <div className={cn("flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--theme-border)] px-6 py-10 text-center", className)}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--theme-primary-light)] text-[var(--theme-primary)]">
        {createElement(Icon, { className: "h-5 w-5" })}
      </div>
      <p className="text-base font-bold text-[var(--theme-text)]">{title}</p>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--theme-text-muted)]">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
