import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronRightIcon,
  LogoutIcon,
  WalletIcon,
} from "../components/Icon";
import {
  moneyOperations,
  products,
  sales,
  storages,
} from "../data/mock";
import { formatMoney, formatTime } from "../utils/format";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const todayIncome = moneyOperations
    .filter((o) => o.type === "income")
    .reduce((s, o) => s + o.amount, 0);
  const todayExpense = moneyOperations
    .filter((o) => o.type === "expense")
    .reduce((s, o) => s + o.amount, 0);
  const lowStock = products.filter((p) => p.stock <= 12).length;
  const totalStorageValue = storages.reduce(
    (s, st) => s + st.totalValue,
    0
  );
  const recentSales = sales.slice(0, 3);

  return (
    <div>
      <div className="px-5 pt-12 pb-10 bg-brand-grad text-white rounded-b-[28px]">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-white/80 text-sm">Добрый день</div>
            <div className="text-xl font-semibold mt-0.5 truncate">
              {user?.email ?? "Гость"}
            </div>
          </div>
          <button
            onClick={logout}
            className="w-9 h-9 grid place-items-center rounded-full bg-white/15 active:bg-white/25"
            aria-label="Выйти"
          >
            <LogoutIcon size={18} />
          </button>
        </div>

        <div className="mt-6 bg-white/10 backdrop-blur rounded-card p-4 border border-white/15">
          <div className="text-white/80 text-xs uppercase tracking-wide">
            Касса сегодня
          </div>
          <div className="text-2xl font-semibold mt-1">
            {formatMoney(todayIncome - todayExpense)}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 grid place-items-center rounded-full bg-white/20">
                <ArrowUpIcon size={14} />
              </span>
              <div>
                <div className="text-white/80 text-[11px]">Доход</div>
                <div className="font-medium">{formatMoney(todayIncome)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 grid place-items-center rounded-full bg-white/20">
                <ArrowDownIcon size={14} />
              </span>
              <div>
                <div className="text-white/80 text-[11px]">Расход</div>
                <div className="font-medium">{formatMoney(todayExpense)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-6 grid grid-cols-2 gap-3">
        <StatCard
          title="Склад"
          value={formatMoney(totalStorageValue)}
          subtitle={`${storages.length} точек`}
        />
        <StatCard
          title="Низкий остаток"
          value={`${lowStock} SKU`}
          subtitle="требует внимания"
          tone={lowStock > 0 ? "warn" : "ok"}
        />
      </div>

      <section className="px-5 mt-6">
        <SectionHeader title="Быстрые действия" />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <QuickAction to="/operations/money" label="Деньги" icon="wallet" />
          <QuickAction to="/operations/sales" label="Продажи" icon="up" />
          <QuickAction
            to="/operations/purchases"
            label="Закупки"
            icon="down"
          />
          <QuickAction
            to="/operations/transfers"
            label="Переводы"
            icon="swap"
          />
        </div>
      </section>

      <section className="px-5 mt-6">
        <SectionHeader
          title="Последние продажи"
          action={{ to: "/operations/sales", label: "Все" }}
        />
        <div className="card mt-3 divide-y divide-ink-300/30 p-0">
          {recentSales.map((s) => (
            <div key={s.id} className="px-4 py-3 row">
              <div className="min-w-0">
                <div className="font-medium text-ink-900 truncate">
                  {s.number} · {s.client}
                </div>
                <div className="text-xs text-ink-500 mt-0.5">
                  {formatTime(s.date)} · {s.status}
                </div>
              </div>
              <div className="font-semibold text-ink-900">
                {formatMoney(s.amount, s.currency)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  tone = "default",
}: {
  title: string;
  value: string;
  subtitle?: string;
  tone?: "default" | "warn" | "ok";
}) {
  const dot =
    tone === "warn"
      ? "bg-warning"
      : tone === "ok"
        ? "bg-success"
        : "bg-brand-400";
  return (
    <div className="card">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <div className="text-xs text-ink-500">{title}</div>
      </div>
      <div className="text-lg font-semibold mt-1 text-ink-900 truncate">
        {value}
      </div>
      {subtitle && (
        <div className="text-xs text-ink-400 mt-0.5">{subtitle}</div>
      )}
    </div>
  );
}

function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: { to: string; label: string };
}) {
  return (
    <div className="row">
      <div className="font-semibold text-ink-900">{title}</div>
      {action && (
        <Link
          to={action.to}
          className="text-sm text-brand-500 inline-flex items-center gap-0.5"
        >
          {action.label}
          <ChevronRightIcon size={14} />
        </Link>
      )}
    </div>
  );
}

function QuickAction({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: "wallet" | "up" | "down" | "swap";
}) {
  const Icon =
    icon === "wallet"
      ? WalletIcon
      : icon === "up"
        ? ArrowUpIcon
        : icon === "down"
          ? ArrowDownIcon
          : ChevronRightIcon;
  return (
    <Link
      to={to}
      className="card flex items-center gap-3 active:bg-surface-muted"
    >
      <span className="w-10 h-10 rounded-full grid place-items-center bg-brand-50 text-brand-500">
        <Icon size={20} />
      </span>
      <div className="font-medium text-ink-900">{label}</div>
    </Link>
  );
}
