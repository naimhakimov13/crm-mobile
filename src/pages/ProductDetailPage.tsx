import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../data/ProductsContext";
import { useTheme } from "../theme/ThemeContext";
import { storages } from "../data/mock";
import { formatMoney } from "../utils/format";
import {
  BoxIcon,
  ChevronLeftIcon,
  EditIcon,
  StorageIcon,
} from "../components/Icon";

const SURFACE = "var(--c-surface)";
const BORDER = "var(--c-border)";
const BG = "var(--c-bg)";
const TEXT = "var(--c-text)";
const MUTED = "var(--c-muted)";
const SUCCESS = "var(--c-success)";
const WARN = "var(--c-warn)";
const DANGER = "var(--c-danger)";

const SUCCESS_FADE = "var(--c-success-fade)";
const WARN_FADE = "var(--c-warn-fade)";
const DANGER_FADE = "var(--c-danger-fade)";

const MONO =
  "ui-monospace, SFMono-Regular, Menlo, monospace";

function hueFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h % 360;
}

function GearIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  );
}

function IconButton({
  onClick,
  children,
  ariaLabel,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-10 h-10 rounded-[12px] grid place-items-center active:scale-95 transition-transform"
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        color: TEXT,
      }}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

function initials(name: string) {
  return name
    .replace(/["«»()]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

type Sale = { who: string; when: string; qty: number; amount: number };

function buildSales(price: number): Sale[] {
  const seeds: Array<{ who: string; when: string; qty: number }> = [
    { who: "Алишер Каримов", when: "Сегодня · 14:22", qty: 4 },
    { who: "ООО Город-Маркет", when: "Сегодня · 11:08", qty: 12 },
    { who: "Дилнура Рахимова", when: "Вчера · 18:42", qty: 2 },
    { who: "Бек Турсунов", when: "Вчера · 09:15", qty: 6 },
  ];
  return seeds.map((s) => ({ ...s, amount: price * s.qty }));
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { dark } = useTheme();
  const product = products.find((p) => p.id === id);

  const sales = useMemo(
    () => (product ? buildSales(product.price) : []),
    [product],
  );

  if (!product) {
    return (
      <div className="min-h-full" style={{ background: BG }}>
        <div className="flex items-center justify-between px-4 pt-6 pb-2">
          <IconButton onClick={() => navigate(-1)} ariaLabel="Назад">
            <ChevronLeftIcon size={20} />
          </IconButton>
          <div className="w-10 h-10" aria-hidden />
        </div>
        <div className="px-5 pt-4">
          <div
            className="text-center rounded-[14px] py-12 px-5"
            style={{
              background: SURFACE,
              border: `1px dashed ${BORDER}`,
              color: MUTED,
            }}
          >
            <div
              className="w-12 h-12 rounded-[14px] mx-auto mb-3 flex items-center justify-center"
              style={{ background: BORDER, color: MUTED }}
            >
              <BoxIcon size={22} />
            </div>
            <div
              className="text-[15px] font-semibold mb-1"
              style={{ color: TEXT }}
            >
              Товар не найден
            </div>
            <div className="text-[13px]">Возможно, он был удалён</div>
          </div>
        </div>
      </div>
    );
  }

  const p = product;
  const out = p.stock === 0;
  const low = !out && p.stock <= 12;
  const statusColor = out ? DANGER : low ? WARN : SUCCESS;
  const statusFade = out ? DANGER_FADE : low ? WARN_FADE : SUCCESS_FADE;
  const statusLabel = out
    ? "Нет в наличии"
    : low
      ? "Заканчивается"
      : "В наличии";
  const hue = hueFor(p.category || p.id);

  const sold = sales.reduce((sum, s) => sum + s.qty, 0);
  const revenue = sales.reduce((sum, s) => sum + s.amount, 0);
  const revenueK = `${Math.round(revenue / 1000)}k`;

  const stores = storages.slice(0, 3);
  const distribution = stores.map((s, i, arr) => {
    if (i === arr.length - 1) return { name: s.name, qty: 0 };
    const share = i === 0 ? 0.6 : 0.3;
    return { name: s.name, qty: Math.round(p.stock * share) };
  });
  distribution[distribution.length - 1].qty = Math.max(
    0,
    p.stock - distribution.slice(0, -1).reduce((s, x) => s + x.qty, 0),
  );

  return (
    <div className="min-h-full" style={{ background: BG }}>
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        <IconButton onClick={() => navigate(-1)} ariaLabel="Назад">
          <ChevronLeftIcon size={20} />
        </IconButton>
        <div className="flex gap-2">
          <IconButton
            onClick={() => navigate(`/products/${p.id}/edit`)}
            ariaLabel="Изменить"
          >
            <EditIcon size={18} />
          </IconButton>
          <IconButton ariaLabel="Настройки">
            <GearIcon />
          </IconButton>
        </div>
      </div>

      <div className="px-5">
        <div
          className="w-full relative overflow-hidden rounded-[14px] flex items-center justify-center"
          style={{
            aspectRatio: "4 / 3",
            background: dark
              ? `hsl(${hue}, 30%, 22%)`
              : `hsl(${hue}, 35%, 93%)`,
            color: dark
              ? `hsl(${hue}, 55%, 75%)`
              : `hsl(${hue}, 45%, 42%)`,
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, transparent 0 16px, rgba(0,0,0,0.025) 16px 17px)",
            }}
          />
          <BoxIcon size={72} strokeWidth={1.3} style={{ position: "relative" }} />
        </div>
      </div>

      <div className="px-5 pt-[18px]">
        <div
          className="text-[12px] mb-1"
          style={{ color: MUTED, fontFamily: MONO }}
        >
          {p.sku} · {p.category}
        </div>
        <h2
          className="m-0 text-[22px] font-bold tracking-[-0.4px] leading-[1.2]"
          style={{ color: TEXT }}
        >
          {p.name}
        </h2>
        <div className="flex items-baseline gap-3 mt-2 flex-wrap">
          <div
            className="text-[26px] font-bold tracking-[-0.6px] tabular-nums"
            style={{ color: TEXT }}
          >
            {formatMoney(p.price, p.currency)}
          </div>
          <div
            className="inline-flex items-center gap-1.5 rounded-full text-[12px] font-semibold"
            style={{
              background: statusFade,
              color: statusColor,
              padding: "4px 10px",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: statusColor }}
            />
            {statusLabel}
          </div>
        </div>
      </div>

      <div className="px-5 pt-[18px] grid grid-cols-3 gap-2.5">
        {[
          { label: "На складе", value: `${p.stock} ${p.unit}` },
          { label: "Продано", value: `${sold} ${p.unit}` },
          { label: "Выручка", value: `${revenueK} ${p.currency === "USD" ? "$" : p.currency === "RUB" ? "₽" : "сум"}` },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-[14px] py-3 px-2.5 text-center"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <div
              className="text-[16px] font-bold tracking-[-0.3px] tabular-nums"
              style={{ color: TEXT }}
            >
              {k.value}
            </div>
            <div
              className="text-[11.5px] font-medium mt-0.5"
              style={{ color: MUTED }}
            >
              {k.label}
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 pt-5">
        <h3
          className="m-0 mb-2.5 text-[16px] font-semibold"
          style={{ color: TEXT }}
        >
          Распределение по складам
        </h3>
        <div
          className="rounded-[14px] py-1 px-4"
          style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
        >
          {distribution.map((w, i) => (
            <div
              key={w.name}
              className="py-3 flex items-center gap-2.5"
              style={{
                borderTop: i === 0 ? "none" : `1px solid ${BORDER}`,
              }}
            >
              <StorageIcon size={16} style={{ color: MUTED }} />
              <div className="flex-1 text-[14px] truncate" style={{ color: TEXT }}>
                {w.name}
              </div>
              <div
                className="text-[14px] font-semibold tabular-nums"
                style={{ color: TEXT }}
              >
                {w.qty} {p.unit}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5 pb-6">
        <h3
          className="m-0 mb-2.5 text-[16px] font-semibold"
          style={{ color: TEXT }}
        >
          Последние продажи
        </h3>
        <div
          className="rounded-[14px] overflow-hidden"
          style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
        >
          {sales.map((s, i) => {
            const sHue = hueFor(s.who);
            return (
              <div
                key={i}
                className="px-4 py-3 flex items-center gap-3"
                style={{
                  borderTop: i === 0 ? "none" : `1px solid ${BORDER}`,
                }}
              >
                <div
                  className="w-[34px] h-[34px] rounded-full shrink-0 flex items-center justify-center text-[12px] font-semibold"
                  style={{
                    background: dark
                      ? `hsl(${sHue}, 30%, 22%)`
                      : `hsl(${sHue}, 70%, 94%)`,
                    color: dark
                      ? `hsl(${sHue}, 55%, 75%)`
                      : `hsl(${sHue}, 55%, 38%)`,
                  }}
                >
                  {initials(s.who) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[14px] font-semibold truncate"
                    style={{ color: TEXT }}
                  >
                    {s.who}
                  </div>
                  <div
                    className="text-[12px] mt-px"
                    style={{ color: MUTED }}
                  >
                    {s.when} · {s.qty} {p.unit}
                  </div>
                </div>
                <div
                  className="text-[14px] font-semibold tabular-nums shrink-0"
                  style={{ color: TEXT }}
                >
                  {formatMoney(s.amount, p.currency)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
