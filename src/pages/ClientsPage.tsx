import { useMemo, useState } from "react";
import { clients } from "../data/mock";
import { formatMoney } from "../utils/format";
import { PlusIcon, SearchIcon } from "../components/Icon";
import type { Client } from "../data/types";

const SURFACE = "#FFFFFF";
const BORDER = "#E7EAF0";
const BG = "#F4F6FA";
const TEXT = "#0E1726";
const MUTED = "#5B6878";
const PRIMARY = "#2FA8FF";
const SUCCESS = "#22C55E";
const DANGER = "#EF4444";
const WARN = "#F59E0B";

const FILTERS: Array<"Все" | Client["type"]> = [
  "Все",
  "Розница",
  "Опт",
  "Партнёр",
];

const tagStyle: Record<Client["type"], { bg: string; fg: string }> = {
  Партнёр: { bg: WARN + "22", fg: WARN },
  Опт: { bg: "rgba(47,168,255,0.18)", fg: PRIMARY },
  Розница: { bg: BORDER, fg: MUTED },
};

function initials(name: string) {
  return name
    .replace(/["«»()]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

function hueFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h % 360;
}

export default function ClientsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Все");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients.filter((c) => {
      if (filter !== "Все" && c.type !== filter) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.replace(/\s+/g, "").includes(q.replace(/\s+/g, ""))
      );
    });
  }, [query, filter]);

  return (
    <div className="min-h-full" style={{ background: BG }}>
      <div className="flex items-end justify-between px-5 pt-6 pb-4">
        <div>
          <h1
            className="m-0 text-[26px] font-bold tracking-[-0.5px]"
            style={{ color: TEXT }}
          >
            Клиенты
          </h1>
          <div className="text-[13px] mt-1" style={{ color: MUTED }}>
            {clients.length} активных
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
            placeholder="Поиск по имени или телефону"
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
        {visible.map((c) => {
          const debt = c.balance < 0;
          const positive = c.balance > 0;
          const hue = hueFor(c.name);
          const ts = tagStyle[c.type];
          return (
            <div
              key={c.id}
              className="flex items-center gap-3.5 rounded-[14px] py-3 px-3.5 cursor-pointer"
              style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
            >
              <div
                className="w-[46px] h-[46px] rounded-full shrink-0 flex items-center justify-center text-[14px] font-semibold"
                style={{
                  background: `hsl(${hue}, 70%, 94%)`,
                  color: `hsl(${hue}, 55%, 38%)`,
                }}
              >
                {initials(c.name) || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-[3px]">
                  <div
                    className="text-[15px] font-semibold truncate"
                    style={{ color: TEXT }}
                  >
                    {c.name}
                  </div>
                  <span
                    className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.2px]"
                    style={{
                      background: ts.bg,
                      color: ts.fg,
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                  >
                    {c.type}
                  </span>
                </div>
                <div
                  className="text-[12.5px] tabular-nums"
                  style={{ color: MUTED }}
                >
                  {c.phone}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div
                  className="text-[14px] font-bold tabular-nums"
                  style={{
                    color: debt ? DANGER : positive ? SUCCESS : TEXT,
                  }}
                >
                  {formatMoney(c.balance, c.currency)}
                </div>
                <div
                  className="text-[11.5px] mt-px"
                  style={{ color: MUTED }}
                >
                  Баланс
                </div>
              </div>
            </div>
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
            <div className="text-[14px]">Клиентов не найдено</div>
          </div>
        )}
      </div>
    </div>
  );
}
