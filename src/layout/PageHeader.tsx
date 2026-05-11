import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { ChevronRightIcon } from "../components/Icon";

type Props = {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
  variant?: "plain" | "brand";
};

export function PageHeader({
  title,
  subtitle,
  back,
  right,
  variant = "plain",
}: Props) {
  const navigate = useNavigate();
  const isBrand = variant === "brand";
  return (
    <header
      className={
        isBrand
          ? "sticky top-0 z-30 px-5 pt-12 pb-8 bg-brand-grad text-white rounded-b-[24px]"
          : "sticky top-0 z-30 px-5 pt-12 pb-4 page-header-glass"
      }
    >
      <div className="flex items-center gap-3 min-h-[28px]">
        {back && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`shrink-0 -ml-1 w-8 h-8 grid place-items-center rounded-full ${
              isBrand
                ? "bg-white/15 text-white active:bg-white/25"
                : "bg-white text-ink-700 shadow-card active:bg-surface-muted"
            }`}
            aria-label="Назад"
          >
            <ChevronRightIcon
              size={18}
              style={{ transform: "rotate(180deg)" }}
            />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <div
            className={`text-[22px] font-semibold leading-tight truncate ${
              isBrand ? "text-white" : "text-ink-900"
            }`}
          >
            {title}
          </div>
          {subtitle && (
            <div
              className={`text-sm mt-0.5 truncate ${
                isBrand ? "text-white/80" : "text-ink-500"
              }`}
            >
              {subtitle}
            </div>
          )}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </header>
  );
}
