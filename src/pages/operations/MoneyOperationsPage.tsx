import { useMemo, useState } from "react";
import { PageHeader } from "../../layout/PageHeader";
import { moneyOperations } from "../../data/mock";
import type { MoneyOpType } from "../../data/types";
import { formatDate, formatMoney, formatTime } from "../../utils/format";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PlusIcon,
  StorageIcon,
} from "../../components/Icon";
import { EmptyState } from "../../components/EmptyState";

type Filter = "all" | MoneyOpType;

const tabs: { id: Filter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "income", label: "Доход" },
  { id: "expense", label: "Расход" },
  { id: "stock", label: "Склад" },
];

const meta: Record<
  MoneyOpType,
  { label: string; sign: "+" | "-"; color: string; bg: string; Icon: typeof ArrowUpIcon }
> = {
  income: {
    label: "Доход",
    sign: "+",
    color: "text-success",
    bg: "bg-emerald-50 text-emerald-600",
    Icon: ArrowUpIcon,
  },
  expense: {
    label: "Расход",
    sign: "-",
    color: "text-danger",
    bg: "bg-red-50 text-red-500",
    Icon: ArrowDownIcon,
  },
  stock: {
    label: "Склад",
    sign: "-",
    color: "text-ink-700",
    bg: "bg-brand-50 text-brand-500",
    Icon: StorageIcon,
  },
};

export default function MoneyOperationsPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? moneyOperations
        : moneyOperations.filter((o) => o.type === filter),
    [filter]
  );

  const totals = useMemo(() => {
    const income = moneyOperations
      .filter((o) => o.type === "income")
      .reduce((s, o) => s + o.amount, 0);
    const expense = moneyOperations
      .filter((o) => o.type === "expense")
      .reduce((s, o) => s + o.amount, 0);
    const stock = moneyOperations
      .filter((o) => o.type === "stock")
      .reduce((s, o) => s + o.amount, 0);
    return { income, expense, stock, balance: income - expense - stock };
  }, []);

  return (
    <div>
      <PageHeader
        title="Деньги"
        back
        variant="brand"
        right={
          <button
            className="w-9 h-9 grid place-items-center rounded-full bg-white/15 text-white active:bg-white/25"
            aria-label="Добавить"
          >
            <PlusIcon size={18} />
          </button>
        }
      />

      <div className="px-5 -mt-6">
        <div className="card">
          <div className="text-xs text-ink-500">Баланс операций</div>
          <div className="text-2xl font-semibold text-ink-900 mt-1">
            {formatMoney(totals.balance)}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
            <Mini label="Доход" value={totals.income} tone="success" />
            <Mini label="Расход" value={totals.expense} tone="danger" />
            <Mini label="Склад" value={totals.stock} tone="brand" />
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 flex gap-2 overflow-x-auto -mx-5 pl-5 pr-5 pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`shrink-0 chip ${
              filter === t.id
                ? "bg-brand-500 text-white"
                : "bg-white text-ink-700 border border-ink-300/40"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-5 mt-3">
        {filtered.length === 0 ? (
          <EmptyState title="Операций нет" />
        ) : (
          <div className="card p-0 divide-y divide-ink-300/30">
            {filtered.map((o) => {
              const m = meta[o.type];
              const Icon = m.Icon;
              return (
                <div key={o.id} className="px-4 py-3 flex items-center gap-3">
                  <span
                    className={`w-10 h-10 rounded-full grid place-items-center shrink-0 ${m.bg}`}
                  >
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-ink-900 truncate">
                      {o.title}
                    </div>
                    <div className="text-xs text-ink-500 mt-0.5 truncate">
                      {o.category}
                      {o.storage ? ` · ${o.storage}` : ""}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`font-semibold ${m.color}`}>
                      {m.sign}
                      {formatMoney(o.amount, o.currency)}
                    </div>
                    <div className="text-[11px] text-ink-400 mt-0.5">
                      {formatDate(o.date)} · {formatTime(o.date)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Mini({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "danger" | "brand";
}) {
  const color =
    tone === "success"
      ? "text-success"
      : tone === "danger"
        ? "text-danger"
        : "text-brand-500";
  return (
    <div className="bg-surface-muted rounded-btn px-2.5 py-2">
      <div className="text-ink-400">{label}</div>
      <div className={`font-semibold mt-0.5 ${color}`}>
        {formatMoney(value)}
      </div>
    </div>
  );
}
