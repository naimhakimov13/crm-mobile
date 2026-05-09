import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../layout/PageHeader";
import { SearchBar } from "../components/SearchBar";
import { useProducts } from "../data/ProductsContext";
import { formatMoney } from "../utils/format";
import { PlusIcon } from "../components/Icon";
import { EmptyState } from "../components/EmptyState";

export default function ProductsPage() {
  const { products } = useProducts();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Все");

  const categories = useMemo(
    () => ["Все", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const inCat = category === "Все" || p.category === category;
      if (!inCat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  return (
    <div>
      <PageHeader
        title="Товары"
        subtitle={`${products.length} позиций`}
        right={
          <button
            type="button"
            onClick={() => navigate("/products/new")}
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
          placeholder="Поиск товара или SKU"
        />

        <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 chip ${
                c === category
                  ? "bg-brand-500 text-white shadow-[0_4px_10px_-2px_rgba(31,144,224,0.45)]"
                  : "chip-glass text-ink-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="Ничего не найдено" subtitle="Измените запрос" />
        ) : (
          <div className="card p-0 divide-y divide-ink-300/30">
            {filtered.map((p) => {
              const low = p.stock <= 12;
              const out = p.stock === 0;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => navigate(`/products/${p.id}`)}
                  className="w-full text-left px-4 py-3 row gap-3 active:bg-white/40 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-ink-900 truncate">
                      {p.name}
                    </div>
                    <div className="text-xs text-ink-500 mt-0.5 truncate">
                      {p.sku} · {p.category}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold text-ink-900">
                      {formatMoney(p.price, p.currency)}
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${
                        out
                          ? "text-danger"
                          : low
                            ? "text-warning"
                            : "text-ink-500"
                      }`}
                    >
                      {out
                        ? "Нет в наличии"
                        : `${p.stock} ${p.unit} в наличии`}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
