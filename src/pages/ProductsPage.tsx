import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../data/ProductsContext";
import { formatMoney } from "../utils/format";
import {
  BoxIcon,
  ChevronRightIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
} from "../components/Icon";
import type { Product } from "../data/types";

type Status = "in" | "low" | "out";

const SURFACE = "#FFFFFF";
const BORDER = "#E7EAF0";
const BG = "#F4F6FA";
const TEXT = "#0E1726";
const MUTED = "#5B6878";
const MUTED_SOFT = "#B4BCC8";
const PRIMARY = "#2FA8FF";
const SUCCESS = "#22C55E";
const WARN = "#F59E0B";
const DANGER = "#EF4444";

function statusOf(p: Product): Status {
  if (p.stock === 0) return "out";
  if (p.stock <= 12) return "low";
  return "in";
}

function statusLabel(s: Status) {
  return s === "in" ? "В наличии" : s === "low" ? "Заканчивается" : "Нет";
}

function statusColor(s: Status) {
  return s === "in" ? SUCCESS : s === "low" ? WARN : DANGER;
}

function hueFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h % 360;
}

const FILTERS: Array<"Все" | "В наличии" | "Заканчивается" | "Нет в наличии"> = [
  "Все",
  "В наличии",
  "Заканчивается",
  "Нет в наличии",
];

export default function ProductsPage() {
  const { products } = useProducts();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Все");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const s = statusOf(p);
      if (filter === "В наличии" && s !== "in") return false;
      if (filter === "Заканчивается" && s !== "low") return false;
      if (filter === "Нет в наличии" && s !== "out") return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      );
    });
  }, [products, query, filter]);

  return (
    <div className="min-h-full" style={{ background: BG }}>
      <div className="flex items-end justify-between px-5 pt-6 pb-4">
        <div>
          <h1
            className="m-0 text-[26px] font-bold tracking-[-0.5px]"
            style={{ color: TEXT }}
          >
            Товары
          </h1>
          <div className="text-[13px] mt-1" style={{ color: MUTED }}>
            {products.length} позиций
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/products/filters")}
            className="w-10 h-10 rounded-[12px] grid place-items-center active:scale-95 transition-transform"
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              color: TEXT,
            }}
            aria-label="Фильтры"
          >
            <FilterIcon size={18} />
          </button>
          <button
            type="button"
            onClick={() => navigate("/products/new")}
            className="w-10 h-10 rounded-[12px] grid place-items-center active:scale-95 transition-transform"
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              color: PRIMARY,
            }}
            aria-label="Добавить"
          >
            <PlusIcon size={20} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <div className="px-5 pb-3">
        <div
          className="relative rounded-[12px]"
          style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
        >
          <SearchIcon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: MUTED }}
          />
          <input
            className="w-full h-11 pl-10 pr-3 bg-transparent border-0 outline-none text-[15px]"
            style={{ color: TEXT }}
            placeholder="Поиск по названию или артикулу"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div
        className="flex gap-2 px-5 pb-3.5 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className="shrink-0 h-8 px-3.5 rounded-full text-[13px] font-medium"
              style={
                active
                  ? {
                      background: PRIMARY,
                      color: "#fff",
                      boxShadow: "0 4px 10px rgba(47,168,255,0.25)",
                    }
                  : {
                      background: SURFACE,
                      border: `1px solid ${BORDER}`,
                      color: TEXT,
                    }
              }
            >
              {f}
            </button>
          );
        })}
      </div>

      <div className="px-5 pb-6 flex flex-col gap-2.5">
        {visible.map((p) => {
          const s = statusOf(p);
          const color = statusColor(s);
          const hue = hueFor(p.category || p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => navigate(`/products/${p.id}`)}
              className="w-full text-left flex items-center gap-3.5 rounded-[14px] p-3 active:scale-[0.99] transition-transform"
              style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
            >
              <div
                className="w-[60px] h-[60px] rounded-[12px] shrink-0 flex items-center justify-center"
                style={{
                  background: `hsl(${hue}, 70%, 94%)`,
                  color: `hsl(${hue}, 55%, 45%)`,
                }}
              >
                <BoxIcon size={26} />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="text-[15px] font-semibold truncate"
                  style={{ color: TEXT, marginBottom: 2 }}
                >
                  {p.name}
                </div>
                <div
                  className="text-[12px] truncate"
                  style={{
                    color: MUTED,
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, monospace",
                    marginBottom: 6,
                  }}
                >
                  {p.sku}
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ background: color }}
                  />
                  <span
                    className="text-[12px] font-medium"
                    style={{ color }}
                  >
                    {statusLabel(s)} · {p.stock} {p.unit}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0 flex flex-col items-end gap-1">
                <div
                  className="text-[15px] font-bold tabular-nums"
                  style={{ color: TEXT }}
                >
                  {formatMoney(p.price, p.currency)}
                </div>
                <ChevronRightIcon
                  size={16}
                  strokeWidth={2}
                  style={{ color: MUTED_SOFT }}
                />
              </div>
            </button>
          );
        })}

        {visible.length === 0 && (
          <div
            className="text-center rounded-[14px] py-10 px-5"
            style={{
              background: SURFACE,
              border: `1px dashed ${BORDER}`,
              color: MUTED,
            }}
          >
            <div className="text-[14px]">Ничего не найдено</div>
          </div>
        )}
      </div>
    </div>
  );
}
