import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { moneyOperations } from "../../data/mock";
import type { MoneyOpType } from "../../data/types";
import { formatMoney, formatTime } from "../../utils/format";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  PlusIcon,
  StorageIcon,
} from "../../components/Icon";

const SURFACE = "var(--c-surface)";
const BORDER = "var(--c-border)";
const BG = "var(--c-bg)";
const TEXT = "var(--c-text)";
const MUTED = "var(--c-muted)";
const PRIMARY = "var(--c-primary)";
const SUCCESS = "var(--c-success)";
const DANGER = "var(--c-danger)";
const PRIMARY_FADE = "var(--c-primary-fade)";
const SUCCESS_FADE = "var(--c-success-fade)";
const DANGER_FADE = "var(--c-danger-fade)";

type Filter = "all" | MoneyOpType;

const TABS: { id: Filter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "income", label: "Доход" },
  { id: "expense", label: "Расход" },
  { id: "stock", label: "Склад" },
];

const meta: Record<
  MoneyOpType,
  {
    sign: "+" | "−";
    color: string;
    fade: string;
    Icon: typeof ArrowUpIcon;
  }
> = {
  income: { sign: "+", color: SUCCESS, fade: SUCCESS_FADE, Icon: ArrowUpIcon },
  expense: { sign: "−", color: DANGER, fade: DANGER_FADE, Icon: ArrowDownIcon },
  stock: { sign: "−", color: PRIMARY, fade: PRIMARY_FADE, Icon: StorageIcon },
};

function dayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yest = new Date(today);
  yest.setDate(today.getDate() - 1);
  const dd = new Date(d);
  dd.setHours(0, 0, 0, 0);
  if (dd.getTime() === today.getTime()) return "Сегодня";
  if (dd.getTime() === yest.getTime()) return "Вчера";
  return dd.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

export default function MoneyOperationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");

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

  const visible = useMemo(
    () =>
      [...moneyOperations]
        .sort((a, b) => +new Date(b.date) - +new Date(a.date))
        .filter((o) => (filter === "all" ? true : o.type === filter)),
    [filter],
  );

  const groups = useMemo(() => {
    const map = new Map<string, typeof visible>();
    for (const op of visible) {
      const key = dayLabel(op.date);
      const arr = map.get(key);
      if (arr) arr.push(op);
      else map.set(key, [op]);
    }
    return Array.from(map.entries());
  }, [visible]);

  return (
    <div className="min-h-full" style={{ background: BG }}>
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
          Деньги
        </div>
        <button
          type="button"
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

      <div className="px-5 pt-3">
        <div
          className="rounded-[18px] p-4"
          style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
        >
          <div className="text-[12.5px] font-medium" style={{ color: MUTED }}>
            Баланс операций
          </div>
          <div
            className="text-[28px] font-bold tracking-[-0.5px] tabular-nums mt-1"
            style={{ color: totals.balance >= 0 ? TEXT : DANGER }}
          >
            {formatMoney(totals.balance)}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3.5">
            <Mini label="Доход" value={totals.income} color={SUCCESS} />
            <Mini label="Расход" value={totals.expense} color={DANGER} />
            <Mini label="Склад" value={totals.stock} color={PRIMARY} />
          </div>
        </div>
      </div>

      <div
        className="flex gap-2 px-5 pt-4 pb-3.5 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {TABS.map((tab) => {
          const active = tab.id === filter;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
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
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="px-5 pb-6 flex flex-col gap-[18px]">
        {groups.map(([day, ops]) => (
          <div key={day}>
            <div
              className="text-[12px] font-semibold uppercase tracking-[0.6px] px-1 pb-2"
              style={{ color: MUTED }}
            >
              {day}
            </div>
            <div
              className="rounded-[14px] overflow-hidden"
              style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
            >
              {ops.map((o, i) => {
                const m = meta[o.type];
                const Icon = m.Icon;
                return (
                  <div
                    key={o.id}
                    className="px-4 py-3 flex items-center gap-3"
                    style={{
                      borderTop: i === 0 ? "none" : `1px solid ${BORDER}`,
                    }}
                  >
                    <div
                      className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center shrink-0"
                      style={{ background: m.fade, color: m.color }}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <div
                          className="text-[14.5px] font-semibold truncate"
                          style={{ color: TEXT }}
                        >
                          {o.title}
                        </div>
                        <div
                          className="text-[14px] font-semibold tabular-nums shrink-0"
                          style={{ color: m.color }}
                        >
                          {m.sign}
                          {formatMoney(o.amount, o.currency)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-[3px]">
                        <div
                          className="text-[12.5px] truncate flex-1"
                          style={{ color: MUTED }}
                        >
                          {o.category}
                          {o.storage ? ` · ${o.storage}` : ""}
                        </div>
                        <span
                          className="text-[11.5px] tabular-nums shrink-0"
                          style={{ color: MUTED }}
                        >
                          {formatTime(o.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <div
            className="text-center rounded-[14px] py-10 px-5"
            style={{
              background: SURFACE,
              border: `1px dashed ${BORDER}`,
              color: MUTED,
            }}
          >
            <div className="text-[14px]">Операций нет</div>
          </div>
        )}
      </div>
    </div>
  );
}

function Mini({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className="rounded-[12px] px-2.5 py-2"
      style={{ background: "var(--c-bg)" }}
    >
      <div className="text-[11.5px]" style={{ color: MUTED }}>
        {label}
      </div>
      <div
        className="text-[13.5px] font-semibold tabular-nums mt-0.5 truncate"
        style={{ color }}
      >
        {formatMoney(value)}
      </div>
    </div>
  );
}
