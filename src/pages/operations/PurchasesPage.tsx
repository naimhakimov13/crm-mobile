import { useMemo, useState } from "react";
import { PageHeader } from "../../layout/PageHeader";
import { SearchBar } from "../../components/SearchBar";
import { purchases } from "../../data/mock";
import { formatDate, formatMoney, formatTime } from "../../utils/format";
import { PlusIcon } from "../../components/Icon";
import { EmptyState } from "../../components/EmptyState";
import type { Purchase } from "../../data/types";

const statusStyles: Record<Purchase["status"], string> = {
  Принят: "bg-emerald-50 text-emerald-700",
  Ожидается: "bg-amber-50 text-amber-700",
  Отменён: "bg-red-50 text-red-700",
};

export default function PurchasesPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return purchases;
    return purchases.filter(
      (p) =>
        p.supplier.toLowerCase().includes(q) ||
        p.number.toLowerCase().includes(q)
    );
  }, [query]);

  const total = purchases.reduce((s, x) => s + x.amount, 0);

  return (
    <div>
      <PageHeader
        title="Закупки"
        subtitle={`${purchases.length} поставок · ${formatMoney(total)}`}
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
          placeholder="Номер или поставщик"
        />

        {filtered.length === 0 ? (
          <EmptyState title="Закупок не найдено" />
        ) : (
          <div className="card p-0 divide-y divide-ink-300/30">
            {filtered.map((p) => (
              <div key={p.id} className="px-4 py-3 row gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-ink-900 truncate">
                    {p.number} · {p.supplier}
                  </div>
                  <div className="text-xs text-ink-500 mt-0.5">
                    {formatDate(p.date)} · {formatTime(p.date)}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-ink-900">
                    {formatMoney(p.amount, p.currency)}
                  </div>
                  <span className={`chip mt-1.5 ${statusStyles[p.status]}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
