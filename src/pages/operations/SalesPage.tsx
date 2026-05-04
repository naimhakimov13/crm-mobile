import { useMemo, useState } from "react";
import { PageHeader } from "../../layout/PageHeader";
import { SearchBar } from "../../components/SearchBar";
import { sales } from "../../data/mock";
import { formatDate, formatMoney, formatTime } from "../../utils/format";
import { PlusIcon } from "../../components/Icon";
import { EmptyState } from "../../components/EmptyState";
import type { Sale } from "../../data/types";

const statusStyles: Record<Sale["status"], string> = {
  Оплачен: "bg-emerald-50 text-emerald-700",
  "В долг": "bg-amber-50 text-amber-700",
  Возврат: "bg-red-50 text-red-700",
};

export default function SalesPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sales;
    return sales.filter(
      (s) =>
        s.client.toLowerCase().includes(q) ||
        s.number.toLowerCase().includes(q)
    );
  }, [query]);

  const total = sales.reduce((s, x) => s + x.amount, 0);

  return (
    <div>
      <PageHeader
        title="Продажи"
        subtitle={`${sales.length} операций · ${formatMoney(total)}`}
        back
        right={
          <button
            className="w-9 h-9 grid place-items-center rounded-full bg-brand-500 text-white shadow-card active:bg-brand-600"
            aria-label="Добавить"
          >
            <PlusIcon size={18} />
          </button>
        }
      />

      <div className="px-5 flex flex-col gap-3">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Номер или клиент"
        />

        {filtered.length === 0 ? (
          <EmptyState title="Продаж не найдено" />
        ) : (
          <div className="card p-0 divide-y divide-ink-300/30">
            {filtered.map((s) => (
              <div key={s.id} className="px-4 py-3">
                <div className="row gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-ink-900 truncate">
                      {s.number} · {s.client}
                    </div>
                    <div className="text-xs text-ink-500 mt-0.5">
                      {formatDate(s.date)} · {formatTime(s.date)}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold text-ink-900">
                      {formatMoney(s.amount, s.currency)}
                    </div>
                    <span
                      className={`chip mt-1.5 ${statusStyles[s.status]}`}
                    >
                      {s.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
