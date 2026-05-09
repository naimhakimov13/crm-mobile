import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { BellIcon, LogoutIcon } from "../components/Icon";
import { DonutChart } from "../components/charts/DonutChart";
import { LineChart } from "../components/charts/LineChart";

type Period = "week" | "month" | "year";

const periodTabs: { id: Period; label: string }[] = [
  { id: "week", label: "Неделя" },
  { id: "month", label: "Месяц" },
  { id: "year", label: "Год" },
];

const palette = {
  cash: "#3FBDFF",
  storage: "#22C55E",
  debt: "#F59E0B",
  liability: "#EF4444",
  total: "#8B5CF6",
  income: "#3FBDFF",
  sales: "#22C55E",
  expense: "#EF4444",
};

const cashRegisters = [
  { id: 1, name: "Касса №1", balance: 0, currency: "TJS" },
  { id: 2, name: "test", balance: 0, currency: "TJS" },
];

const seriesByPeriod: Record<
  Period,
  {
    weekdays: string[];
    turnover: { income: number[]; sales: number[]; expense: number[] };
    income: { current: number[]; previous: number[] };
    sales: { current: number[]; previous: number[] };
  }
> = {
  week: {
    weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    turnover: {
      income: [0, 0, 0, 0, 0, 0, 0],
      sales: [0, 0, 0, 0, 0, 20.3, 0],
      expense: [0, 0, 0, 0, 0, 0, 0],
    },
    income: {
      current: [0, 0, 0, 0, 0, 0, 0],
      previous: [0, 0, 0, 0, 0, 0, 0],
    },
    sales: {
      current: [0, 0, 0, 0, 0, 20.3, 0],
      previous: [0, 0, 0, 0, 0, 0, 0],
    },
  },
  month: {
    weekdays: ["Н1", "Н2", "Н3", "Н4"],
    turnover: {
      income: [0, 0, 0, 0],
      sales: [0, 12.5, 18.4, 20.3],
      expense: [0, 0, 0, 0],
    },
    income: {
      current: [0, 0, 0, 0],
      previous: [0, 0, 0, 0],
    },
    sales: {
      current: [0, 12.5, 18.4, 20.3],
      previous: [0, 0, 5.2, 8.4],
    },
  },
  year: {
    weekdays: ["Я", "Ф", "М", "А", "М", "И", "И", "А", "С", "О", "Н", "Д"],
    turnover: {
      income: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      sales: [0, 0, 0, 0, 20.3, 0, 0, 0, 0, 0, 0, 0],
      expense: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    income: {
      current: Array(12).fill(0),
      previous: Array(12).fill(0),
    },
    sales: {
      current: [0, 0, 0, 0, 20.3, 0, 0, 0, 0, 0, 0, 0],
      previous: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  },
};

const assets = [
  { label: "Общая сумма в кассах", value: 0, color: palette.cash },
  {
    label: "Общий объем на складах",
    value: 11990,
    color: palette.storage,
  },
  {
    label: "Задолженность контрагентов",
    value: 20.3,
    color: palette.debt,
  },
  {
    label: "Краткосрочные обязательства",
    value: 0,
    color: palette.liability,
  },
];

function formatNumber(v: number) {
  return v.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function todayLabel() {
  const d = new Date();
  const w = d.toLocaleDateString("ru-RU", { weekday: "long" });
  const day = d.getDate();
  const month = d.toLocaleDateString("ru-RU", { month: "long" });
  return `${w[0].toUpperCase()}${w.slice(1)}, ${day} ${month}`;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [period, setPeriod] = useState<Period>("week");

  const data = seriesByPeriod[period];

  const totalAssets = useMemo(
    () => assets.reduce((s, a) => s + a.value, 0),
    []
  );

  const initial = (user?.email ?? "Г")[0].toUpperCase();

  return (
    <div>
      <header className="px-4 pt-8 pb-5 bg-brand-grad text-white rounded-b-[20px]">
        <div className="row">
          <Link
            to="/profile"
            className="flex items-center gap-2.5 min-w-0 active:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full bg-white/20 border border-white/25 grid place-items-center text-sm font-semibold flex-none">
              {initial}
            </div>
            <div className="min-w-0">
              <div className="text-white/65 text-[10px] uppercase tracking-wider leading-none">
                Аккаунт
              </div>
              <div className="text-sm font-medium truncate leading-none mt-1">
                {user?.name || user?.email || "Гость"}
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-1.5 flex-none">
            <Link
              to="/notifications"
              className="relative w-9 h-9 grid place-items-center rounded-full bg-white/15 active:bg-white/25"
              aria-label="Уведомления"
            >
              <BellIcon size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-warning ring-2 ring-brand-500" />
            </Link>
            <button
              onClick={logout}
              className="w-9 h-9 grid place-items-center rounded-full bg-white/15 active:bg-white/25"
              aria-label="Выйти"
            >
              <LogoutIcon size={18} />
            </button>
          </div>
        </div>

        <div className="text-white/95 text-[15px] font-medium mt-3.5">
          {todayLabel()}
        </div>
      </header>

      <div className="px-3 -mt-4">
        <div className="glass-segmented grid grid-cols-3 gap-1">
          {periodTabs.map((t) => {
            const active = t.id === period;
            return (
              <button
                key={t.id}
                onClick={() => setPeriod(t.id)}
                className={`glass-segmented-item ${
                  active ? "glass-segmented-item--active" : ""
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 md:px-3">
      <section>
        <div className="card">
          <div className="flex items-center justify-center">
            <DonutChart
              segments={assets}
              size={180}
              thickness={22}
              centerLabel={formatNumber(totalAssets)}
              centerSubtitle="Всего активов"
            />
          </div>
          <ul className="mt-4 flex flex-col gap-2.5">
            {assets.map((a) => (
              <li key={a.label} className="flex items-center gap-2 text-sm">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: a.color }}
                />
                <span className="text-ink-700 flex-1 min-w-0 truncate">
                  {a.label}
                </span>
                <span className="font-semibold text-ink-900 tabular-nums">
                  {formatNumber(a.value)}
                </span>
              </li>
            ))}
            <li className="flex items-center gap-2 text-sm pt-2 border-t border-ink-300/30">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: palette.total }}
              />
              <span className="text-ink-700 flex-1 font-medium">
                Всего активов
              </span>
              <span className="font-semibold text-ink-900 tabular-nums">
                {formatNumber(totalAssets)}
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <div className="card">
          <div className="row mb-3">
            <div className="font-semibold text-ink-900">Кассы</div>
            <div className="text-xs text-ink-500">Средства</div>
          </div>
          <ul className="divide-y divide-ink-300/30">
            {cashRegisters.map((r) => (
              <li key={r.id} className="py-2.5 row">
                <span className="text-ink-700">{r.name}</span>
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-ink-900 tabular-nums">
                    {formatNumber(r.balance)}
                  </span>
                  <span className="chip bg-brand-50 text-brand-600">
                    {r.currency}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="md:col-span-2">
        <div className="card">
          <div className="font-semibold text-ink-900 text-center mb-2">
            Оборот
          </div>
          <LineChart
            categories={data.weekdays}
            series={[
              {
                name: "Приход",
                color: palette.income,
                points: data.turnover.income,
              },
              {
                name: "Реализация",
                color: palette.sales,
                points: data.turnover.sales,
              },
              {
                name: "Расход",
                color: palette.expense,
                points: data.turnover.expense,
              },
            ]}
          />
          <Legend
            items={[
              { label: "Приход", color: palette.income },
              { label: "Реализация", color: palette.sales },
              { label: "Расход", color: palette.expense },
            ]}
          />
        </div>
      </section>

      <section>
        <div className="card">
          <div className="font-semibold text-ink-900 text-center mb-2">
            Приход
          </div>
          <LineChart
            categories={data.weekdays}
            series={[
              {
                name: "Динамика",
                color: palette.income,
                points: data.income.current,
              },
              {
                name: "Прошлая неделя",
                color: palette.income,
                points: data.income.previous,
                dashed: true,
              },
            ]}
          />
          <Legend
            items={[
              { label: "Динамика за неделю", color: palette.income },
              {
                label: "Сравнение с прошлой неделей",
                color: palette.income,
                dashed: true,
              },
            ]}
          />
        </div>
      </section>

      <section>
        <div className="card">
          <div className="font-semibold text-ink-900 text-center mb-2">
            Реализация
          </div>
          <LineChart
            categories={data.weekdays}
            series={[
              {
                name: "Динамика",
                color: palette.sales,
                points: data.sales.current,
              },
              {
                name: "Прошлая неделя",
                color: palette.sales,
                points: data.sales.previous,
                dashed: true,
              },
            ]}
          />
          <Legend
            items={[
              { label: "Динамика за неделю", color: palette.sales },
              {
                label: "Сравнение с прошлой неделей",
                color: palette.sales,
                dashed: true,
              },
            ]}
          />
        </div>
      </section>
      </div>
    </div>
  );
}

type LegendItem = { label: string; color: string; dashed?: boolean };

function Legend({ items }: { items: LegendItem[] }) {
  return (
    <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
      {items.map((it) => (
        <li
          key={it.label}
          className="flex items-center gap-1.5 text-[11px] text-ink-500"
        >
          {it.dashed ? (
            <span
              className="inline-block w-4 h-0 border-t-2 border-dashed"
              style={{ borderColor: it.color }}
            />
          ) : (
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: it.color }}
            />
          )}
          {it.label}
        </li>
      ))}
    </ul>
  );
}
