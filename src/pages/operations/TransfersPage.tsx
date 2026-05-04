import { useMemo, useState } from "react";
import { PageHeader } from "../../layout/PageHeader";
import { SearchBar } from "../../components/SearchBar";
import { transfers } from "../../data/mock";
import { formatDate, formatTime } from "../../utils/format";
import { ChevronRightIcon, PlusIcon } from "../../components/Icon";
import { EmptyState } from "../../components/EmptyState";
import type { Transfer } from "../../data/types";

const statusStyles: Record<Transfer["status"], string> = {
  Получен: "bg-emerald-50 text-emerald-700",
  "В пути": "bg-amber-50 text-amber-700",
  Создан: "bg-brand-50 text-brand-600",
};

export default function TransfersPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return transfers;
    return transfers.filter(
      (t) =>
        t.from.toLowerCase().includes(q) ||
        t.to.toLowerCase().includes(q) ||
        t.number.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div>
      <PageHeader
        title="Переводы"
        subtitle={`${transfers.length} операций`}
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
          placeholder="Номер или склад"
        />

        {filtered.length === 0 ? (
          <EmptyState title="Переводов не найдено" />
        ) : (
          <div className="card p-0 divide-y divide-ink-300/30">
            {filtered.map((t) => (
              <div key={t.id} className="px-4 py-3">
                <div className="row gap-3">
                  <div className="font-medium text-ink-900">{t.number}</div>
                  <span className={`chip ${statusStyles[t.status]}`}>
                    {t.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="text-ink-700 truncate flex-1">
                    {t.from}
                  </span>
                  <ChevronRightIcon size={16} className="text-ink-400" />
                  <span className="text-ink-700 truncate flex-1 text-right">
                    {t.to}
                  </span>
                </div>
                <div className="mt-1.5 row text-xs text-ink-500">
                  <span>{t.itemsCount} позиций</span>
                  <span>
                    {formatDate(t.date)} · {formatTime(t.date)}
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
