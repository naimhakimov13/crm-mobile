import { useMemo, useState } from "react";
import { PageHeader } from "../layout/PageHeader";
import { SearchBar } from "../components/SearchBar";
import { clients } from "../data/mock";
import { formatMoney } from "../utils/format";
import { PlusIcon } from "../components/Icon";
import { EmptyState } from "../components/EmptyState";

const typeStyles: Record<string, string> = {
  Розница: "bg-brand-50 text-brand-600",
  Опт: "bg-amber-50 text-amber-700",
  Партнёр: "bg-emerald-50 text-emerald-700",
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

export default function ClientsPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.replace(/\s+/g, "").includes(q.replace(/\s+/g, ""))
    );
  }, [query]);

  return (
    <div>
      <PageHeader
        title="Клиенты"
        subtitle={`${clients.length} контактов`}
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
          placeholder="Имя или телефон"
        />

        {filtered.length === 0 ? (
          <EmptyState title="Клиент не найден" />
        ) : (
          <div className="card p-0 divide-y divide-ink-300/30">
            {filtered.map((c) => {
              const debt = c.balance < 0;
              return (
                <div key={c.id} className="px-4 py-3 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full grid place-items-center bg-surface-muted text-ink-700 font-medium shrink-0">
                    {initials(c.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-ink-900 truncate">
                      {c.name}
                    </div>
                    <div className="text-xs text-ink-500 mt-0.5">
                      {c.phone}
                    </div>
                    <span
                      className={`chip mt-1.5 ${
                        typeStyles[c.type] ?? "bg-surface-muted text-ink-700"
                      }`}
                    >
                      {c.type}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[11px] text-ink-400">Баланс</div>
                    <div
                      className={`font-semibold ${
                        debt
                          ? "text-danger"
                          : c.balance > 0
                            ? "text-success"
                            : "text-ink-700"
                      }`}
                    >
                      {formatMoney(c.balance, c.currency)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
