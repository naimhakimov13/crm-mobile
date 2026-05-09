import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../layout/PageHeader";
import { useProducts } from "../data/ProductsContext";
import type { Currency, Product } from "../data/types";

type FormState = Omit<Product, "id"> & { id?: string };

const emptyDraft = (): FormState => ({
  sku: "",
  name: "",
  category: "",
  price: 0,
  currency: "UZS",
  stock: 0,
  unit: "шт",
});

export default function ManageProductPage() {
  const { productId } = useParams<{ productId?: string }>();
  const navigate = useNavigate();
  const { saveProduct, products } = useProducts();
  const isNew = !productId;

  const [form, setForm] = useState<FormState>(emptyDraft);

  useEffect(() => {
    if (!productId) {
      setForm(emptyDraft());
    }
  }, [productId]);

  useEffect(() => {
    if (!productId) return;
    const p = products.find((x) => x.id === productId);
    setForm(p ? { ...p } : emptyDraft());
  }, [productId, products]);

  const patch = <K extends keyof Product>(key: K, v: Product[K]) =>
    setForm((f) => ({ ...f, [key]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const sku = form.sku.trim().toUpperCase();
    const category = form.category.trim();
    if (!name || !sku || !category) return;

    const id =
      form.id ??
      `p-${globalThis.crypto?.randomUUID?.() ?? String(Date.now())}`;

    saveProduct({
      id,
      sku,
      name,
      category,
      price: Math.max(0, Math.round(Number(form.price) || 0)),
      currency: form.currency,
      stock: Math.max(0, Math.floor(Number(form.stock) || 0)),
      unit: form.unit,
    });
    navigate(`/products/${id}`, { replace: true });
  };

  const currencies: Currency[] = ["UZS", "USD", "RUB"];

  return (
    <div>
      <PageHeader
        title={isNew ? "Новый товар" : "Редактирование"}
        subtitle={isNew ? "Заполните карточку" : "Сохраните изменения"}
        back
      />

      <form
        onSubmit={onSubmit}
        className="px-5 pb-8 flex flex-col gap-4 max-w-md mx-auto"
      >
        <div className="card flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-ink-500">Название</span>
            <input
              className="input"
              value={form.name}
              onChange={(e) => patch("name", e.target.value)}
              placeholder="Например, Бургер классический"
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-ink-500">SKU</span>
            <input
              className="input"
              value={form.sku}
              onChange={(e) => patch("sku", e.target.value)}
              placeholder="BRG-001"
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-ink-500">Категория</span>
            <input
              className="input"
              value={form.category}
              onChange={(e) => patch("category", e.target.value)}
              placeholder="Бургеры"
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-ink-500">Цена</span>
              <input
                className="input tabular-nums"
                type="number"
                min={0}
                step={1}
                value={form.price}
                onChange={(e) => patch("price", Number(e.target.value))}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-ink-500">Валюта</span>
              <select
                className="input"
                value={form.currency}
                onChange={(e) =>
                  patch("currency", e.target.value as Currency)
                }
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-ink-500">Остаток</span>
              <input
                className="input tabular-nums"
                type="number"
                min={0}
                step={1}
                value={form.stock}
                onChange={(e) => patch("stock", Number(e.target.value))}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-ink-500">Единица</span>
              <select
                className="input"
                value={form.unit}
                onChange={(e) =>
                  patch("unit", e.target.value as Product["unit"])
                }
              >
                <option value="шт">шт</option>
                <option value="кг">кг</option>
                <option value="л">л</option>
              </select>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="btn-glass flex-1"
            onClick={() => navigate(-1)}
          >
            Отмена
          </button>
          <button type="submit" className="btn-primary flex-1">
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
}
