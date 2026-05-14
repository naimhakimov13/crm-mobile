import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import { ChevronLeftIcon } from "../components/Icon";
import {
  DEFAULT_FILTERS,
  type ProductFilters,
  useProducts,
} from "../data/ProductsContext";

const SURFACE = "var(--c-surface)";
const BORDER = "var(--c-border)";
const BG = "var(--c-bg)";
const TEXT = "var(--c-text)";
const MUTED = "var(--c-muted)";
const PRIMARY = "var(--c-primary)";

const STOCK_OPTIONS: Array<{
  value: ProductFilters["stockStatus"];
  label: string;
}> = [
  { value: "all", label: "Все" },
  { value: "in", label: "В наличии" },
  { value: "low", label: "Заканчиваются" },
  { value: "out", label: "Нет" },
];

const CURRENCY_OPTIONS: Array<{
  value: ProductFilters["currency"];
  label: string;
}> = [
  { value: "all", label: "Все" },
  { value: "UZS", label: "UZS" },
  { value: "USD", label: "USD" },
  { value: "RUB", label: "RUB" },
];

const UNIT_OPTIONS: Array<{
  value: ProductFilters["unit"];
  label: string;
}> = [
  { value: "all", label: "Все" },
  { value: "шт", label: "шт" },
  { value: "кг", label: "кг" },
  { value: "л", label: "л" },
];

function activeCount(f: ProductFilters): number {
  let n = 0;
  if (f.minPrice !== null) n++;
  if (f.maxPrice !== null) n++;
  if (f.stockStatus !== "all") n++;
  if (f.currency !== "all") n++;
  if (f.unit !== "all") n++;
  return n;
}

export default function ProductFiltersPage() {
  const navigate = useNavigate();
  const { filters, setFilters, resetFilters } = useProducts();
  const { bg } = useTheme();
  const [draft, setDraft] = useState<ProductFilters>(filters);

  const patch = <K extends keyof ProductFilters>(
    key: K,
    v: ProductFilters[K],
  ) => setDraft((d) => ({ ...d, [key]: v }));

  const parsePrice = (raw: string): number | null => {
    if (raw === "") return null;
    const n = Number(raw.replace(/[^\d]/g, ""));
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  const onApply = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(draft);
    navigate(-1);
  };

  const onReset = () => {
    setDraft(DEFAULT_FILTERS);
    resetFilters();
  };

  const count = activeCount(draft);

  return (
    <form
      onSubmit={onApply}
      className="min-h-full flex flex-col"
      style={{ background: BG }}
    >
      <div
        className="sticky top-0 z-30 flex items-center justify-between px-4 pt-4 pb-2"
        style={{ background: BG }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-[12px] grid place-items-center active:scale-95 transition-transform"
          style={{
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            color: TEXT,
          }}
          aria-label="Назад"
        >
          <ChevronLeftIcon size={20} />
        </button>
        <div
          className="text-[16px] font-semibold tracking-[-0.2px]"
          style={{ color: TEXT }}
        >
          Фильтры
        </div>
        <button
          type="button"
          onClick={onReset}
          className="h-[34px] px-[14px] rounded-[10px] text-[14px] font-semibold bg-transparent border-0 disabled:opacity-40"
          style={{ color: PRIMARY }}
          disabled={count === 0}
        >
          Сбросить
        </button>
      </div>

      <div className="px-5 pt-3 pb-1">
        <div
          className="text-[26px] font-bold tracking-[-0.5px]"
          style={{ color: TEXT }}
        >
          Уточните выборку
        </div>
        <div className="text-[13px] mt-1" style={{ color: MUTED }}>
          {count === 0
            ? "Все товары"
            : `${count} ${count === 1 ? "фильтр" : "фильтра"} активно`}
        </div>
      </div>

      <Section title="Цена">
        <div className="grid grid-cols-2 gap-2">
          <Field
            label="От"
            value={draft.minPrice !== null ? String(draft.minPrice) : ""}
            onChange={(v) => patch("minPrice", parsePrice(v))}
            placeholder="0"
          />
          <Field
            label="До"
            value={draft.maxPrice !== null ? String(draft.maxPrice) : ""}
            onChange={(v) => patch("maxPrice", parsePrice(v))}
            placeholder="—"
          />
        </div>
      </Section>

      <Section title="Наличие">
        <Segmented
          value={draft.stockStatus}
          options={STOCK_OPTIONS}
          onChange={(v) => patch("stockStatus", v)}
        />
      </Section>

      <Section title="Валюта">
        <Segmented
          value={draft.currency}
          options={CURRENCY_OPTIONS}
          onChange={(v) => patch("currency", v)}
        />
      </Section>

      <Section title="Единица измерения">
        <Segmented
          value={draft.unit}
          options={UNIT_OPTIONS}
          onChange={(v) => patch("unit", v)}
        />
      </Section>

      <div className="flex-1" />

      <div
        className="px-5 pt-5 pb-1 flex gap-2.5 sticky bottom-0"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${bg} 30%)`,
        }}
      >
        <button
          type="button"
          onClick={onReset}
          className="flex-1 h-12 rounded-[14px] text-[15px] font-semibold"
          style={{
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            color: TEXT,
          }}
        >
          Сбросить
        </button>
        <button
          type="submit"
          className="flex-1 h-12 rounded-[14px] text-[15px] font-semibold border-0 inline-flex items-center justify-center gap-2"
          style={{
            background: PRIMARY,
            color: "#fff",
            boxShadow: "0 8px 20px rgba(47,168,255,0.25)",
          }}
        >
          Применить
          {count > 0 && (
            <span
              className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-full text-[11px] font-semibold"
              style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
            >
              {count}
            </span>
          )}
        </button>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="px-5 pt-5">
      <div
        className="text-[11.5px] font-semibold uppercase tracking-[0.6px] px-1 pb-2"
        style={{ color: MUTED }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div
      className="rounded-[14px] px-[14px] py-2.5 flex flex-col gap-0.5"
      style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
    >
      <div
        className="text-[11.5px] font-semibold uppercase tracking-[0.6px]"
        style={{ color: MUTED }}
      >
        {label}
      </div>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-0 outline-none p-0 min-w-0 text-[16px] tabular-nums"
        style={{ color: TEXT }}
      />
    </div>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (v: T) => void;
}) {
  return (
    <div
      className="rounded-[14px] p-1 flex gap-1"
      style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="flex-1 h-9 rounded-[10px] text-[13px] font-medium px-2 truncate"
            style={
              active
                ? {
                    background: PRIMARY,
                    color: "#fff",
                    boxShadow: "0 2px 6px rgba(47,168,255,0.3)",
                  }
                : {
                    background: "transparent",
                    color: MUTED,
                  }
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
