import { Link } from "react-router-dom";
import { PageHeader } from "../../layout/PageHeader";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronRightIcon,
  SwapIcon,
  WalletIcon,
} from "../../components/Icon";
import type { ComponentType, SVGProps } from "react";

type Item = {
  to: string;
  title: string;
  subtitle: string;
  Icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  tone: "brand" | "green" | "red" | "amber";
};

const items: Item[] = [
  {
    to: "/operations/money",
    title: "Деньги",
    subtitle: "Доход, расход и операции склада",
    Icon: WalletIcon,
    tone: "brand",
  },
  {
    to: "/operations/sales",
    title: "Продажи",
    subtitle: "Чеки и счета клиентов",
    Icon: ArrowUpIcon,
    tone: "green",
  },
  {
    to: "/operations/purchases",
    title: "Закупки",
    subtitle: "Поставки и приходы",
    Icon: ArrowDownIcon,
    tone: "amber",
  },
  {
    to: "/operations/transfers",
    title: "Переводы",
    subtitle: "Между складами и точками",
    Icon: SwapIcon,
    tone: "red",
  },
];

const toneClass: Record<Item["tone"], string> = {
  brand: "bg-brand-50 text-brand-500",
  green: "bg-emerald-50 text-emerald-600",
  red: "bg-red-50 text-red-500",
  amber: "bg-amber-50 text-amber-600",
};

export default function OperationsHubPage() {
  return (
    <div>
      <PageHeader title="Операции" subtitle="Выберите раздел" />
      <div className="px-5 flex flex-col gap-3">
        {items.map(({ to, title, subtitle, Icon, tone }) => (
          <Link
            key={to}
            to={to}
            className="card flex items-center gap-3 active:bg-surface-muted"
          >
            <span
              className={`w-11 h-11 rounded-card grid place-items-center shrink-0 ${toneClass[tone]}`}
            >
              <Icon size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-ink-900">{title}</div>
              <div className="text-xs text-ink-500 mt-0.5 truncate">
                {subtitle}
              </div>
            </div>
            <ChevronRightIcon size={18} className="text-ink-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}
