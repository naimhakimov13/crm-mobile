import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { transfers } from "../../data/mock";
import { formatTime } from "../../utils/format";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  SearchIcon,
} from "../../components/Icon";
import type { Transfer } from "../../data/types";

const SURFACE = "var(--c-surface)";
const BORDER = "var(--c-border)";
const BG = "var(--c-bg)";
const TEXT = "var(--c-text)";
const MUTED = "var(--c-muted)";
const PRIMARY = "var(--c-primary)";
const SUCCESS = "var(--c-success)";
const WARN = "var(--c-warn)";

const statusStyle: Record<
  Transfer["status"],
  { color: string; fade: string }
> = {
  Получен: { color: SUCCESS, fade: "var(--c-success-fade)" },
  "В пути": { color: WARN, fade: "var(--c-warn-fade)" },
  Создан: { color: PRIMARY, fade: "var(--c-primary-fade)" },
};

const FILTERS: Array<"Все" | Transfer["status"]> = [
  "Все",
  "Создан",
  "В пути",
  "Получен",
];

function TruckIcon() {
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
      <rect x="2" y="7" width="12" height="9" rx="1" />
      <path d="M14 10h5l3 3v3h-8z" />
      <circle cx="7" cy="18" r="1.7" />
      <circle cx="18" cy="18" r="1.7" />
    </svg>
  );
}

function PackageIcon() {
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
      <path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5v-9z" />
      <path d="M3.5 7.5L12 12l8.5-4.5" />
      <path d="M12 12v9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12l5 5L20 6" />
    </svg>
  );
}

function statusIcon(s: Transfer["status"]) {
  if (s === "Получен") return <CheckIcon />;
  if (s === "В пути") return <TruckIcon />;
  return <PackageIcon />;
}

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

export default function TransfersPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Все");

  const totals = useMemo(() => {
    const inTransit = transfers
      .filter((t) => t.status === "В пути")
      .reduce((s, t) => s + t.itemsCount, 0);
    const received = transfers
      .filter((t) => t.status === "Получен")
      .reduce((s, t) => s + t.itemsCount, 0);
    const draft = transfers
      .filter((t) => t.status === "Создан")
      .reduce((s, t) => s + t.itemsCount, 0);
    return { inTransit, received, draft, total: transfers.length };
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...transfers]
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
      .filter((t) => {
        if (filter !== "Все" && t.status !== filter) return false;
        if (!q) return true;
        return (
          t.from.toLowerCase().includes(q) ||
          t.to.toLowerCase().includes(q) ||
          t.number.toLowerCase().includes(q)
        );
      });
  }, [query, filter]);

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
          Переводы
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
            Всего переводов
          </div>
          <div
            className="text-[28px] font-bold tracking-[-0.5px] tabular-nums mt-1"
            style={{ color: TEXT }}
          >
            {totals.total}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3.5">
            <Mini label="Создано" value={totals.draft} color={PRIMARY} />
            <Mini label="В пути" value={totals.inTransit} color={WARN} />
            <Mini label="Получено" value={totals.received} color={SUCCESS} />
          </div>
        </div>
      </div>

      <div className="px-5 pt-4">
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
            placeholder="Номер или склад"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div
        className="flex gap-2 px-5 pt-3 pb-3.5 overflow-x-auto"
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
              {ops.map((t, i) => {
                const st = statusStyle[t.status];
                return (
                  <div
                    key={t.id}
                    className="px-4 py-3 flex items-start gap-3"
                    style={{
                      borderTop: i === 0 ? "none" : `1px solid ${BORDER}`,
                    }}
                  >
                    <div
                      className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: st.fade, color: st.color }}
                    >
                      {statusIcon(t.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <div
                          className="text-[14.5px] font-semibold truncate"
                          style={{ color: TEXT }}
                        >
                          {t.number}
                        </div>
                        <span
                          className="shrink-0 text-[10.5px] font-semibold"
                          style={{
                            background: st.fade,
                            color: st.color,
                            padding: "2px 7px",
                            borderRadius: 4,
                            letterSpacing: 0.1,
                          }}
                        >
                          {t.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-[13px]">
                        <span
                          className="flex-1 truncate"
                          style={{ color: TEXT }}
                        >
                          {t.from}
                        </span>
                        <ChevronRightIcon
                          size={14}
                          strokeWidth={2}
                          style={{ color: MUTED }}
                        />
                        <span
                          className="flex-1 truncate text-right"
                          style={{ color: TEXT }}
                        >
                          {t.to}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1.5 text-[12px]">
                        <span style={{ color: MUTED }}>
                          {t.itemsCount} позиций
                        </span>
                        <span
                          className="tabular-nums"
                          style={{ color: MUTED }}
                        >
                          {formatTime(t.date)}
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
            <div className="text-[14px]">Переводов не найдено</div>
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
      style={{ background: BG }}
    >
      <div className="text-[11.5px]" style={{ color: MUTED }}>
        {label}
      </div>
      <div
        className="text-[15px] font-semibold tabular-nums mt-0.5 truncate"
        style={{ color }}
      >
        {value}
      </div>
    </div>
  );
}
