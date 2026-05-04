import { useMemo, useState } from "react";
import { PageHeader } from "../layout/PageHeader";
import { SearchBar } from "../components/SearchBar";
import { storages } from "../data/mock";
import { formatMoney } from "../utils/format";
import { ChevronRightIcon, PlusIcon, StorageIcon } from "../components/Icon";
import { EmptyState } from "../components/EmptyState";

export default function StoragePage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return storages;
    return storages.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div>
      <PageHeader
        title="Склады"
        subtitle={`${storages.length} точек`}
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
          placeholder="Поиск по названию или адресу"
        />

        {filtered.length === 0 ? (
          <EmptyState title="Ничего не найдено" />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((s) => (
              <button
                key={s.id}
                className="card flex items-center gap-3 text-left active:bg-surface-muted"
              >
                <span className="w-11 h-11 rounded-card grid place-items-center bg-brand-50 text-brand-500 shrink-0">
                  <StorageIcon size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-ink-900 truncate">
                    {s.name}
                  </div>
                  <div className="text-xs text-ink-500 mt-0.5 truncate">
                    {s.address}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-ink-500">
                    <span>{s.itemsCount} позиций</span>
                    <span className="w-1 h-1 rounded-full bg-ink-300" />
                    <span className="text-ink-700 font-medium">
                      {formatMoney(s.totalValue)}
                    </span>
                  </div>
                </div>
                <ChevronRightIcon size={18} className="text-ink-400" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
