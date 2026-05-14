import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  moneyOperations,
  purchases,
  sales,
  transfers,
} from "../../data/mock";
import { formatMoney } from "../../utils/format";
import { PlusIcon } from "../../components/Icon";

type OpType = "order" | "refund" | "stock" | "transfer";

type UnifiedOp = {
  id: string;
  type: OpType;
  title: string;
  sub: string;
  amt: string;
  status: string;
  date: Date;
  route: string;
};

const SURFACE = "var(--c-surface)";
const BORDER = "var(--c-border)";
const BG = "var(--c-bg)";
const TEXT = "var(--c-text)";
const MUTED = "var(--c-muted)";
const PRIMARY = "var(--c-primary)";
const WARN = "var(--c-warn)";
const SUCCESS = "var(--c-success)";

const PRIMARY_FADE = "var(--c-primary-fade)";
const WARN_FADE = "var(--c-warn-fade)";
const SUCCESS_FADE = "var(--c-success-fade)";
const MUTED_FADE = "rgba(91,104,120,0.18)";

const TABS = ["Все", "Заказы", "Возвраты", "Склад"] as const;
type Tab = (typeof TABS)[number];

function colorFor(type: OpType) {
  return type === "order"
    ? PRIMARY
    : type === "refund"
      ? WARN
      : type === "transfer"
        ? SUCCESS
        : MUTED;
}

function fadeFor(type: OpType) {
  return type === "order"
    ? PRIMARY_FADE
    : type === "refund"
      ? WARN_FADE
      : type === "transfer"
        ? SUCCESS_FADE
        : MUTED_FADE;
}

function CartIcon({ color }: { color: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M3 4h2l2.5 11h11l2-8H6.5" />
    </svg>
  );
}

function RefreshIcon({ color }: { color: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12a9 9 0 1 1-3.4-7" />
      <path d="M21 4v6h-6" />
    </svg>
  );
}

function PkgIcon({ color }: { color: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5v-9z" />
      <path d="M3.5 7.5L12 12l8.5-4.5" />
      <path d="M12 12v9" />
    </svg>
  );
}

function TruckIcon({ color }: { color: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="7" width="12" height="9" rx="1" />
      <path d="M14 10h5l3 3v3h-8z" />
      <circle cx="7" cy="18" r="1.7" />
      <circle cx="18" cy="18" r="1.7" />
    </svg>
  );
}

function OpIcon({ type, color }: { type: OpType; color: string }) {
  if (type === "order") return <CartIcon color={color} />;
  if (type === "refund") return <RefreshIcon color={color} />;
  if (type === "transfer") return <TruckIcon color={color} />;
  return <PkgIcon color={color} />;
}

function dayLabel(d: Date) {
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

function todayHeader() {
  const d = new Date();
  return `Сегодня · ${d.getDate()} ${d.toLocaleDateString("ru-RU", { month: "long" })}`;
}

function buildOps(): UnifiedOp[] {
  const ops: UnifiedOp[] = [];

  for (const s of sales) {
    const isRefund = s.status === "Возврат";
    ops.push({
      id: `sa-${s.id}`,
      type: isRefund ? "refund" : "order",
      title: `Заказ ${s.number}`,
      sub: s.client,
      amt: `${isRefund ? "−" : "+"}${formatMoney(s.amount, s.currency)}`,
      status: s.status,
      date: new Date(s.date),
      route: "/operations/sales",
    });
  }

  for (const p of purchases) {
    ops.push({
      id: `pu-${p.id}`,
      type: "stock",
      title: `Закупка ${p.number}`,
      sub: p.supplier,
      amt: `−${formatMoney(p.amount, p.currency)}`,
      status: p.status,
      date: new Date(p.date),
      route: "/operations/purchases",
    });
  }

  for (const t of transfers) {
    ops.push({
      id: `tr-${t.id}`,
      type: "transfer",
      title: `Перемещение ${t.number}`,
      sub: `${t.from} → ${t.to}`,
      amt: `${t.itemsCount} поз.`,
      status: t.status,
      date: new Date(t.date),
      route: "/operations/transfers",
    });
  }

  for (const m of moneyOperations) {
    if (m.type === "income") {
      ops.push({
        id: `mi-${m.id}`,
        type: "order",
        title: m.title,
        sub: m.category,
        amt: `+${formatMoney(m.amount, m.currency)}`,
        status: "Принят",
        date: new Date(m.date),
        route: "/operations/money",
      });
    } else if (m.type === "expense") {
      ops.push({
        id: `me-${m.id}`,
        type: "refund",
        title: m.title,
        sub: m.category,
        amt: `−${formatMoney(m.amount, m.currency)}`,
        status: m.category,
        date: new Date(m.date),
        route: "/operations/money",
      });
    } else {
      ops.push({
        id: `ms-${m.id}`,
        type: "stock",
        title: m.title,
        sub: m.storage ?? m.category,
        amt: formatMoney(m.amount, m.currency),
        status: m.category,
        date: new Date(m.date),
        route: "/operations/money",
      });
    }
  }

  return ops.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export default function OperationsHubPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Все");

  const allOps = useMemo(buildOps, []);

  const visible = useMemo(() => {
    return allOps.filter((op) => {
      if (tab === "Заказы") return op.type === "order";
      if (tab === "Возвраты") return op.type === "refund";
      if (tab === "Склад")
        return op.type === "stock" || op.type === "transfer";
      return true;
    });
  }, [allOps, tab]);

  const opsToday = useMemo(() => {
    const todayKey = new Date().toDateString();
    const today = allOps.filter((o) => o.date.toDateString() === todayKey);
    const orders = today.filter((o) => o.type === "order").length;
    const refunds = today.filter((o) => o.type === "refund").length;
    const stock = today.filter(
      (o) => o.type === "stock" || o.type === "transfer",
    ).length;
    return [
      { label: "Заказов", value: orders, accent: PRIMARY },
      { label: "Возвратов", value: refunds, accent: WARN },
      { label: "По складу", value: stock, accent: SUCCESS },
    ];
  }, [allOps]);

  const groups = useMemo(() => {
    const map = new Map<string, UnifiedOp[]>();
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
        className="sticky top-0 z-30 flex items-end justify-between px-5 pt-4 pb-4"
        style={{ background: BG }}
      >
        <div>
          <h1
            className="m-0 text-[26px] font-bold tracking-[-0.5px]"
            style={{ color: TEXT }}
          >
            Операции
          </h1>
          <div className="text-[13px] mt-1" style={{ color: MUTED }}>
            {todayHeader()}
          </div>
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

      <div className="px-5 flex gap-2.5">
        {opsToday.map((s) => (
          <div
            key={s.label}
            className="flex-1 rounded-[14px] px-3.5 py-3.5"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <div
              className="text-[12px] font-medium"
              style={{ color: MUTED, marginBottom: 4 }}
            >
              {s.label}
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: s.accent }}
              />
              <div
                className="text-[22px] font-bold tracking-[-0.4px] tabular-nums"
                style={{ color: TEXT }}
              >
                {s.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="flex gap-2 px-5 pt-4 pb-3.5 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {TABS.map((tt) => {
          const active = tt === tab;
          return (
            <button
              key={tt}
              type="button"
              onClick={() => setTab(tt)}
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
              {tt}
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
              {ops.map((op, i) => {
                const c = colorFor(op.type);
                const cFade = fadeFor(op.type);
                return (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => navigate(op.route)}
                    className="w-full text-left bg-transparent border-0 px-4 py-3 flex items-center gap-3"
                    style={{
                      borderTop: i === 0 ? "none" : `1px solid ${BORDER}`,
                    }}
                  >
                    <div
                      className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center shrink-0"
                      style={{ background: cFade }}
                    >
                      <OpIcon type={op.type} color={c} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <div
                          className="text-[14.5px] font-semibold truncate"
                          style={{ color: TEXT }}
                        >
                          {op.title}
                        </div>
                        <div
                          className="text-[14px] font-semibold tabular-nums shrink-0"
                          style={{ color: TEXT }}
                        >
                          {op.amt}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-[3px]">
                        <div
                          className="text-[12.5px] truncate flex-1"
                          style={{ color: MUTED }}
                        >
                          {op.sub}
                        </div>
                        <span
                          className="shrink-0 text-[10.5px] font-semibold"
                          style={{
                            background: cFade,
                            color: c,
                            padding: "2px 7px",
                            borderRadius: 4,
                            letterSpacing: 0.1,
                          }}
                        >
                          {op.status}
                        </span>
                      </div>
                    </div>
                  </button>
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
            <div className="text-[14px]">Операций не найдено</div>
          </div>
        )}
      </div>
    </div>
  );
}
