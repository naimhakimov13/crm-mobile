import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../data/ProductsContext";
import { formatMoney } from "../utils/format";
import {
  BoxIcon,
  ChevronLeftIcon,
  EditIcon,
} from "../components/Icon";
import { EmptyState } from "../components/EmptyState";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div>
        <div className="px-4 pt-6">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-10 h-10 grid place-items-center rounded-full bg-white/70 backdrop-blur-xl border border-white/60 text-ink-700 active:scale-95 transition shadow-[0_4px_12px_-4px_rgba(14,23,38,0.15)]"
              aria-label="Назад"
            >
              <ChevronLeftIcon size={20} />
            </button>
            <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-[0.18em]">
              Товар
            </div>
            <span className="w-10 h-10" />
          </div>
        </div>
        <div className="px-4 mt-8">
          <EmptyState
            title="Товар не найден"
            subtitle="Возможно, он был удалён"
          />
        </div>
      </div>
    );
  }

  const p = product;
  const out = p.stock === 0;
  const low = !out && p.stock <= 12;
  const stockPct = Math.max(0, Math.min(100, (p.stock / 240) * 100));
  const stockTone = out
    ? "text-danger"
    : low
      ? "text-warning"
      : "text-success";
  const stockLabel = out ? "Нет в наличии" : low ? "Мало" : "В наличии";
  const stockBar = out ? "#EF4444" : low ? "#F59E0B" : "#22C55E";

  return (
    <div>
      <div className="px-4 pt-6">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 grid place-items-center rounded-full bg-white/70 backdrop-blur-xl border border-white/60 text-ink-700 active:scale-95 transition shadow-[0_4px_12px_-4px_rgba(14,23,38,0.15)]"
            aria-label="Назад"
          >
            <ChevronLeftIcon size={20} />
          </button>
          <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-[0.18em]">
            Товар
          </div>
          <button
            type="button"
            onClick={() => navigate(`/products/${p.id}/edit`)}
            className="w-10 h-10 grid place-items-center rounded-full bg-white/70 backdrop-blur-xl border border-white/60 text-ink-700 active:scale-95 transition shadow-[0_4px_12px_-4px_rgba(14,23,38,0.15)]"
            aria-label="Изменить"
          >
            <EditIcon size={18} />
          </button>
        </div>
      </div>

      <div className="px-4 mt-8 flex flex-col items-center text-center">
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-0 -m-3 rounded-3xl blur-2xl opacity-50"
            style={{
              background:
                "radial-gradient(circle, rgba(63,189,255,0.55) 0%, rgba(63,189,255,0) 70%)",
            }}
          />
          <div
            className="relative w-20 h-20 rounded-3xl bg-brand-grad text-white grid place-items-center"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.6), 0 14px 32px -10px rgba(31,144,224,0.6), 0 4px 12px rgba(14,23,38,0.12)",
            }}
          >
            <BoxIcon size={36} />
          </div>
        </div>
        <div className="mt-4 text-[11px] uppercase tracking-[0.16em] text-ink-500">
          {p.category}
        </div>
        <div className="mt-1.5 text-xl font-semibold text-ink-900 leading-tight tracking-tight">
          {p.name}
        </div>
        <div className="text-xs text-ink-500 mt-1.5">SKU · {p.sku}</div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 md:px-3">
        <section>
          <div className="card">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-card p-3 bg-white/60 border border-white/60">
                <div className="text-[11px] uppercase tracking-wider text-ink-500">
                  Цена
                </div>
                <div className="text-xl font-bold text-ink-900 mt-1 tabular-nums">
                  {formatMoney(p.price, p.currency)}
                </div>
              </div>
              <div className="rounded-card p-3 bg-white/60 border border-white/60">
                <div className="text-[11px] uppercase tracking-wider text-ink-500">
                  Остаток
                </div>
                <div className="text-xl font-bold text-ink-900 mt-1 tabular-nums">
                  {p.stock}
                  <span className="text-sm text-ink-500 font-medium ml-1">
                    {p.unit}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-500">Уровень запаса</span>
                <span className={`font-medium ${stockTone}`}>
                  {stockLabel}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-ink-300/30 overflow-hidden">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${stockPct}%`, background: stockBar }}
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="card">
            <div className="font-semibold text-ink-900 mb-1">Информация</div>
            <ul className="flex flex-col">
              <DetailRow label="Категория" value={p.category} />
              <DetailRow label="Артикул" value={p.sku} />
              <DetailRow label="Единица" value={p.unit} />
              <DetailRow label="Валюта" value={p.currency} last />
            </ul>
          </div>
        </section>

        <section className="md:col-span-2">
          <div className="card">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-glass flex-1"
              >
                Назад
              </button>
              <button
                type="button"
                onClick={() => navigate(`/products/${p.id}/edit`)}
                className="btn-primary flex-1"
              >
                <EditIcon size={16} />
                <span className="ml-1.5">Изменить</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <li
      className={`flex items-center justify-between gap-3 py-2.5 ${
        last ? "" : "border-b border-ink-300/30"
      }`}
    >
      <span className="text-sm text-ink-500">{label}</span>
      <span className="text-sm font-medium text-ink-900 truncate text-right">
        {value}
      </span>
    </li>
  );
}
