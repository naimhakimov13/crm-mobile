import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  BellIcon,
  SearchIcon,
  ChevronRightIcon,
} from "../components/Icon";

type Kpi = {
  label: string;
  value: string;
  delta: string;
  up: boolean;
};

type Op = {
  id: string;
  type: "order" | "refund" | "stock";
  title: string;
  who: string;
  when: string;
  amt: string;
  status: "success" | "warn" | "neutral";
};

type Product = {
  name: string;
  sold: number;
  share: number;
};

const kpis: Kpi[] = [
  { label: "Выручка сегодня", value: "342 800 ₽", delta: "+12.4%", up: true },
  { label: "Средний чек", value: "2 940 ₽", delta: "+4.1%", up: true },
  { label: "Заказы", value: "116", delta: "+8 шт.", up: true },
  { label: "Возвраты", value: "3 200 ₽", delta: "−1.2%", up: false },
];

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const spark = [0.42, 0.58, 0.51, 0.74, 0.66, 0.81, 0.95];

const recentOps: Op[] = [
  {
    id: "1",
    type: "order",
    title: "Заказ №3421",
    who: "А. Соколова",
    when: "12:42",
    amt: "+18 400 ₽",
    status: "success",
  },
  {
    id: "2",
    type: "stock",
    title: "Поступление товара",
    who: "Склад №2",
    when: "11:18",
    amt: "+ 24 шт.",
    status: "neutral",
  },
  {
    id: "3",
    type: "refund",
    title: "Возврат №812",
    who: "Р. Каримов",
    when: "10:05",
    amt: "−3 200 ₽",
    status: "warn",
  },
];

const topProducts: Product[] = [
  { name: "Молоко Простоквашино 1л", sold: 184, share: 0.92 },
  { name: "Хлеб «Бородинский»", sold: 152, share: 0.76 },
  { name: "Сыр «Российский» 200г", sold: 121, share: 0.6 },
  { name: "Кофе зерновой 1кг", sold: 98, share: 0.48 },
];

const SURFACE = "#FFFFFF";
const BORDER = "#E7EAF0";
const BG = "#F4F6FA";
const TEXT = "#0E1726";
const MUTED = "#5B6878";
const PRIMARY = "#2FA8FF";
const PRIMARY_SOFT = "rgba(47,168,255,0.18)";
const SUCCESS = "#22C55E";
const WARN = "#F59E0B";
const DANGER = "#EF4444";

function todayLabel() {
  const d = new Date();
  const day = d.getDate();
  const month = d.toLocaleDateString("ru-RU", { month: "long" });
  return `Сегодня · ${day} ${month}`;
}

function Avatar({ initial }: { initial: string }) {
  return (
    <div
      className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-white font-semibold text-[15px]"
      style={{
        background:
          "linear-gradient(135deg, #2FA8FF 0%, rgba(47,168,255,0.667) 100%)",
        boxShadow: "0 6px 16px rgba(47,168,255,0.25)",
      }}
    >
      {initial}
    </div>
  );
}

function IconButton({
  children,
  to,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  ariaLabel: string;
}) {
  const cls =
    "w-10 h-10 rounded-[12px] grid place-items-center text-ink-900 active:scale-95 transition-transform";
  const style = { background: SURFACE, border: `1px solid ${BORDER}` };
  if (to) {
    return (
      <Link to={to} className={cls} style={style} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={cls}
      style={style}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

function KPICard({ k }: { k: Kpi }) {
  const color = k.up ? SUCCESS : DANGER;
  return (
    <div
      className="rounded-[14px] px-4 py-3.5 flex flex-col gap-1.5"
      style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
    >
      <div className="text-[12.5px] font-medium" style={{ color: MUTED }}>
        {k.label}
      </div>
      <div
        className="text-[22px] font-bold tracking-[-0.4px]"
        style={{ color: TEXT }}
      >
        {k.value}
      </div>
      <div
        className="text-[12px] font-semibold flex items-center gap-0.5"
        style={{ color }}
      >
        {k.up ? (
          <ArrowUpIcon size={12} strokeWidth={2.5} />
        ) : (
          <ArrowDownIcon size={12} strokeWidth={2.5} />
        )}
        {k.delta}
      </div>
    </div>
  );
}

function OpIcon({ type, color }: { type: Op["type"]; color: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (type === "order") {
    return (
      <svg {...common}>
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M3 4h2l2.5 11h11l2-8H6.5" />
      </svg>
    );
  }
  if (type === "refund") {
    return (
      <svg {...common}>
        <path d="M21 12a9 9 0 1 1-3.4-7" />
        <path d="M21 4v6h-6" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5v-9z" />
      <path d="M3.5 7.5L12 12l8.5-4.5" />
      <path d="M12 12v9" />
    </svg>
  );
}

function ChevronDown({ color }: { color: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.name || user?.email || "Гость";
  const firstName = displayName.split(/[\s@.]/)[0];
  const initial = displayName[0].toUpperCase();

  return (
    <div className="min-h-full" style={{ background: BG }}>
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <Link
          to="/profile"
          className="flex items-center gap-3 min-w-0 active:opacity-80"
        >
          <Avatar initial={initial} />
          <div className="min-w-0">
            <div className="text-[12px] font-medium" style={{ color: MUTED }}>
              Доброе утро,
            </div>
            <div
              className="text-[15px] font-semibold truncate"
              style={{ color: TEXT }}
            >
              {firstName}
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <IconButton ariaLabel="Поиск">
            <SearchIcon size={18} />
          </IconButton>
          <IconButton to="/notifications" ariaLabel="Уведомления">
            <div className="relative">
              <BellIcon size={18} />
              <span
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                style={{ background: DANGER, border: `1.5px solid ${SURFACE}` }}
              />
            </div>
          </IconButton>
        </div>
      </div>

      <div className="flex items-end justify-between px-5 pb-4">
        <div>
          <h1
            className="m-0 text-[26px] font-bold tracking-[-0.5px]"
            style={{ color: TEXT }}
          >
            Статистика
          </h1>
          <div className="text-[13px] mt-1" style={{ color: MUTED }}>
            {todayLabel()}
          </div>
        </div>
        <button
          type="button"
          className="h-8 px-3 rounded-[10px] text-[13px] font-medium flex items-center gap-1.5"
          style={{
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            color: TEXT,
          }}
        >
          День <ChevronDown color={MUTED} />
        </button>
      </div>

      <div className="px-5 grid grid-cols-2 gap-2.5">
        {kpis.map((k) => (
          <KPICard key={k.label} k={k} />
        ))}
      </div>

      <div className="px-5 pt-4">
        <div
          className="rounded-[14px] px-[18px] pt-4 pb-3.5"
          style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
        >
          <div className="flex items-baseline justify-between mb-3.5">
            <div>
              <div
                className="text-[12.5px] font-medium"
                style={{ color: MUTED }}
              >
                Выручка за неделю
              </div>
              <div
                className="text-[20px] font-bold mt-0.5"
                style={{ color: TEXT }}
              >
                1 842 600 ₽
              </div>
            </div>
            <div
              className="text-[12px] font-semibold flex items-center gap-0.5"
              style={{ color: SUCCESS }}
            >
              <ArrowUpIcon size={12} strokeWidth={2.5} />
              +18.2%
            </div>
          </div>
          <div className="flex items-end gap-2 h-[72px]">
            {spark.map((v, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1.5"
              >
                <div className="w-full flex items-end" style={{ height: 56 }}>
                  <div
                    className="w-full rounded-md"
                    style={{
                      height: `${v * 100}%`,
                      background:
                        i === spark.length - 1 ? PRIMARY : PRIMARY_SOFT,
                    }}
                  />
                </div>
                <div
                  className="text-[10.5px] font-medium"
                  style={{ color: MUTED }}
                >
                  {weekDays[i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Section title="Последние операции" linkTo="/operations">
        <div
          className="rounded-[14px] overflow-hidden"
          style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
        >
          {recentOps.map((op, i) => {
            const color =
              op.status === "success"
                ? SUCCESS
                : op.status === "warn"
                  ? WARN
                  : MUTED;
            const amtColor =
              op.status === "success"
                ? SUCCESS
                : op.status === "warn"
                  ? DANGER
                  : TEXT;
            return (
              <div
                key={op.id}
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  borderTop: i === 0 ? "none" : `1px solid ${BORDER}`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                  style={{ background: color + "1f" }}
                >
                  <OpIcon type={op.type} color={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[14.5px] font-semibold truncate"
                    style={{ color: TEXT }}
                  >
                    {op.title}
                  </div>
                  <div
                    className="text-[12.5px] mt-0.5 truncate"
                    style={{ color: MUTED }}
                  >
                    {op.who} · {op.when}
                  </div>
                </div>
                <div
                  className="text-[14px] font-semibold tabular-nums"
                  style={{ color: amtColor }}
                >
                  {op.amt}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Топ товары" linkTo="/products">
        <div
          className="rounded-[14px] px-4"
          style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
        >
          {topProducts.map((p, i) => (
            <div
              key={p.name}
              className="py-3"
              style={{
                borderTop: i === 0 ? "none" : `1px solid ${BORDER}`,
              }}
            >
              <div className="flex items-baseline justify-between mb-2 gap-3">
                <div
                  className="text-[14px] font-medium truncate"
                  style={{ color: TEXT }}
                >
                  {p.name}
                </div>
                <div
                  className="text-[13px] tabular-nums shrink-0"
                  style={{ color: MUTED }}
                >
                  {p.sold} шт.
                </div>
              </div>
              <div
                className="h-1 rounded-full overflow-hidden"
                style={{ background: BORDER }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${p.share * 100}%`,
                    background: PRIMARY,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

    </div>
  );
}

function Section({
  title,
  linkTo,
  children,
}: {
  title: string;
  linkTo?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-5 pt-5 last:pb-6">
      <div className="flex items-baseline justify-between mb-2.5">
        <h3
          className="m-0 text-[16px] font-semibold"
          style={{ color: TEXT }}
        >
          {title}
        </h3>
        {linkTo && (
          <Link
            to={linkTo}
            className="text-[13px] font-medium flex items-center gap-0.5"
            style={{ color: PRIMARY }}
          >
            Все <ChevronRightIcon size={14} />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}
