import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../layout/PageHeader";
import {
  DEFAULT_FILTERS,
  type ProductFilters,
  useProducts,
} from "../data/ProductsContext";
import type { Currency, Product } from "../data/types";

const STOCK_OPTIONS: Array<{
  value: ProductFilters["stockStatus"];
  label: string;
}> = [
  { value: "all", label: "Все" },
  { value: "in", label: "В наличии" },
  { value: "low", label: "Заканчивается" },
  { value: "out", label: "Нет в наличии" },
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

export default function ProductFiltersPage() {
  const navigate = useNavigate();
  const { filters, setFilters, resetFilters } = useProducts();
  const [draft, setDraft] = useState<ProductFilters>(filters);

  const patch = <K extends keyof ProductFilters>(
    key: K,
    v: ProductFilters[K]
  ) => setDraft((d) => ({ ...d, [key]: v }));

  const parsePrice = (raw: string): number | null => {
    if (raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? Math.max(0, n) : null;
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

  return (
    <div>
      <PageHeader title="Фильтры" subtitle="Уточните выборку" back />

      <form
        onSubmit={onApply}
        className="px-5 pb-8 flex flex-col gap-4 max-w-md mx-auto"
      >
        <div className="card flex flex-col gap-3">
          <div className="text-xs font-medium text-ink-500">Цена</div>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-ink-500">От</span>
              <input
                className="input tabular-nums"
                type="number"
                min={0}
                step={1}
                value={draft.minPrice ?? ""}
                onChange={(e) => patch("minPrice", parsePrice(e.target.value))}
                placeholder="0"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-ink-500">До</span>
              <input
                className="input tabular-nums"
                type="number"
                min={0}
                step={1}
                value={draft.maxPrice ?? ""}
                onChange={(e) => patch("maxPrice", parsePrice(e.target.value))}
                placeholder="—"
              />
            </label>
          </div>
        </div>

        <div className="card flex flex-col gap-3">
          <div className="text-xs font-medium text-ink-500">Наличие</div>
          <div className="flex flex-wrap gap-2">
            {STOCK_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => patch("stockStatus", opt.value)}
                className={`chip ${
                  draft.stockStatus === opt.value
                    ? "bg-brand-500 text-white shadow-[0_4px_10px_-2px_rgba(31,144,224,0.45)]"
                    : "chip-glass text-ink-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card flex flex-col gap-3">
          <div className="text-xs font-medium text-ink-500">Валюта</div>
          <div className="flex flex-wrap gap-2">
            {CURRENCY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  patch("currency", opt.value as Currency | "all")
                }
                className={`chip ${
                  draft.currency === opt.value
                    ? "bg-brand-500 text-white shadow-[0_4px_10px_-2px_rgba(31,144,224,0.45)]"
                    : "chip-glass text-ink-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card flex flex-col gap-3">
          <div className="text-xs font-medium text-ink-500">
            Единица измерения
          </div>
          <div className="flex flex-wrap gap-2">
            {UNIT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  patch("unit", opt.value as Product["unit"] | "all")
                }
                className={`chip ${
                  draft.unit === opt.value
                    ? "bg-brand-500 text-white shadow-[0_4px_10px_-2px_rgba(31,144,224,0.45)]"
                    : "chip-glass text-ink-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" className="btn-glass flex-1" onClick={onReset}>
            Сбросить
          </button>
          <button type="submit" className="btn-primary flex-1">
            Применить
          </button>
        </div>
      </form>
    </div>
  );
}
