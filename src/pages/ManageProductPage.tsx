import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../data/ProductsContext";
import type { Currency, Product } from "../data/types";
import { BoxIcon, ChevronLeftIcon } from "../components/Icon";

type FormState = Omit<Product, "id"> & { id?: string };

const SURFACE = "#FFFFFF";
const BORDER = "#E7EAF0";
const BG = "#F4F6FA";
const TEXT = "#0E1726";
const MUTED = "#5B6878";
const PRIMARY = "#2FA8FF";
const DANGER = "#EF4444";

const emptyDraft = (): FormState => ({
  sku: "",
  name: "",
  category: "",
  price: 0,
  currency: "UZS",
  stock: 0,
  unit: "шт",
});

const CURRENCIES: Currency[] = ["UZS", "USD", "RUB"];
const UNITS: Product["unit"][] = ["шт", "кг", "л"];

function hueFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h % 360;
}

export default function ManageProductPage() {
  const { productId } = useParams<{ productId?: string }>();
  const navigate = useNavigate();
  const { saveProduct, products } = useProducts();
  const isNew = !productId;

  const [form, setForm] = useState<FormState>(emptyDraft);
  const [touched, setTouched] = useState(false);

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

  const errors = useMemo(() => {
    const e: Partial<Record<keyof Product, string>> = {};
    if (!form.name.trim()) e.name = "Введите название";
    if (!form.sku.trim()) e.sku = "Введите артикул";
    if (!form.category.trim()) e.category = "Укажите категорию";
    return e;
  }, [form]);

  const canSave = Object.keys(errors).length === 0;
  const hue = hueFor(form.category || form.name || form.id || "x");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!canSave) return;

    const id =
      form.id ??
      `p-${globalThis.crypto?.randomUUID?.() ?? String(Date.now())}`;

    saveProduct({
      id,
      sku: form.sku.trim().toUpperCase(),
      name: form.name.trim(),
      category: form.category.trim(),
      price: Math.max(0, Math.round(Number(form.price) || 0)),
      currency: form.currency,
      stock: Math.max(0, Math.floor(Number(form.stock) || 0)),
      unit: form.unit,
    });
    navigate(`/products/${id}`, { replace: true });
  };

  const showError = (key: keyof Product) =>
    touched ? errors[key] : undefined;

  return (
    <form
      onSubmit={onSubmit}
      className="min-h-full flex flex-col"
      style={{ background: BG }}
    >
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-[12px] grid place-items-center active:scale-95 transition-transform"
          style={{
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            color: TEXT,
          }}
          aria-label="Назад"
        >
          <ChevronLeftIcon size={20} />
        </button>
        <div
          className="text-[16px] font-semibold tracking-[-0.2px]"
          style={{ color: TEXT }}
        >
          {isNew ? "Новый товар" : "Редактирование"}
        </div>
        <button
          type="submit"
          className="h-[34px] px-[14px] rounded-[10px] text-[14px] font-semibold bg-transparent border-0 disabled:opacity-40"
          style={{ color: PRIMARY }}
          disabled={!canSave && touched}
        >
          Готово
        </button>
      </div>

      <div className="px-5 pt-2 pb-1 text-center">
        <div
          className="w-[88px] h-[88px] rounded-[20px] mx-auto flex items-center justify-center relative overflow-hidden"
          style={{
            background: `hsl(${hue}, 35%, 93%)`,
            color: `hsl(${hue}, 45%, 42%)`,
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, transparent 0 14px, rgba(0,0,0,0.025) 14px 15px)",
            }}
          />
          <BoxIcon size={38} strokeWidth={1.4} style={{ position: "relative" }} />
        </div>
        <div
          className="mt-2 text-[13px] font-medium"
          style={{ color: PRIMARY }}
        >
          Добавить фото
        </div>
      </div>

      <Section title="Основное">
        <div className="flex flex-col gap-2">
          <Field
            label="Название"
            value={form.name}
            onChange={(v) => patch("name", v)}
            placeholder="Например, Бургер классический"
            error={showError("name")}
          />
          <Field
            label="Артикул (SKU)"
            value={form.sku}
            onChange={(v) => patch("sku", v.toUpperCase())}
            placeholder="BRG-001"
            mono
            error={showError("sku")}
          />
          <Field
            label="Категория"
            value={form.category}
            onChange={(v) => patch("category", v)}
            placeholder="Бургеры"
            error={showError("category")}
          />
        </div>
      </Section>

      <Section title="Цена и валюта">
        <div className="grid grid-cols-[1fr_120px] gap-2">
          <Field
            label="Цена"
            value={String(form.price || "")}
            onChange={(v) => patch("price", Number(v.replace(/[^\d]/g, "")))}
            type="text"
            inputMode="numeric"
            placeholder="0"
            tabular
          />
          <SegmentedField
            label="Валюта"
            value={form.currency}
            options={CURRENCIES}
            onChange={(v) => patch("currency", v as Currency)}
          />
        </div>
      </Section>

      <Section title="Остаток">
        <div className="grid grid-cols-[1fr_140px] gap-2">
          <Field
            label="Количество"
            value={String(form.stock || "")}
            onChange={(v) => patch("stock", Number(v.replace(/[^\d]/g, "")))}
            type="text"
            inputMode="numeric"
            placeholder="0"
            tabular
          />
          <SegmentedField
            label="Единица"
            value={form.unit}
            options={UNITS}
            onChange={(v) => patch("unit", v as Product["unit"])}
          />
        </div>
      </Section>

      <div className="flex-1" />

      <div
        className="px-5 pt-5 pb-6 flex gap-2.5 sticky bottom-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(244,246,250,0) 0%, rgba(244,246,250,1) 30%)",
        }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex-1 h-12 rounded-[14px] text-[15px] font-semibold"
          style={{
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            color: TEXT,
          }}
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={!canSave && touched}
          className="flex-1 h-12 rounded-[14px] text-[15px] font-semibold border-0 disabled:opacity-60"
          style={{
            background: PRIMARY,
            color: "#fff",
            boxShadow: "0 8px 20px rgba(47,168,255,0.25)",
          }}
        >
          Сохранить
        </button>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="px-5 pt-5">
      <div
        className="text-[11.5px] font-semibold uppercase tracking-[0.6px] px-1 pb-2"
        style={{ color: MUTED }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  mono,
  tabular,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "decimal";
  mono?: boolean;
  tabular?: boolean;
  error?: string;
}) {
  return (
    <div>
      <div
        className="rounded-[14px] px-[14px] py-2.5 flex flex-col gap-0.5"
        style={{
          background: SURFACE,
          border: `1px solid ${error ? DANGER + "66" : BORDER}`,
        }}
      >
        <div
          className="text-[11.5px] font-semibold uppercase tracking-[0.6px]"
          style={{ color: MUTED }}
        >
          {label}
        </div>
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-transparent border-0 outline-none p-0 min-w-0 text-[16px] ${
            tabular ? "tabular-nums" : ""
          }`}
          style={{
            color: TEXT,
            fontFamily: mono
              ? "ui-monospace, SFMono-Regular, Menlo, monospace"
              : "inherit",
          }}
        />
      </div>
      {error && (
        <div
          className="text-[12px] mt-1 ml-1"
          style={{ color: DANGER }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

function SegmentedField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <div
      className="rounded-[14px] px-[14px] py-2.5 flex flex-col gap-1"
      style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
    >
      <div
        className="text-[11.5px] font-semibold uppercase tracking-[0.6px]"
        style={{ color: MUTED }}
      >
        {label}
      </div>
      <div className="flex gap-1">
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className="flex-1 h-8 rounded-[8px] text-[13px] font-medium"
              style={
                active
                  ? {
                      background: PRIMARY,
                      color: "#fff",
                      boxShadow: "0 2px 6px rgba(47,168,255,0.3)",
                    }
                  : {
                      background: "transparent",
                      color: MUTED,
                      border: `1px solid ${BORDER}`,
                    }
              }
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
