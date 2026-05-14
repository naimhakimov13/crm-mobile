import { useMemo, useState } from "react";
import { storages } from "../data/mock";
import { formatMoney } from "../utils/format";
import {
  ChevronRightIcon,
  PlusIcon,
  SearchIcon,
  StorageIcon,
} from "../components/Icon";

const SURFACE = "var(--c-surface)";
const BORDER = "var(--c-border)";
const BG = "var(--c-bg)";
const TEXT = "var(--c-text)";
const MUTED = "var(--c-muted)";
const MUTED_SOFT = "var(--c-muted-soft)";
const PRIMARY = "var(--c-primary)";

export default function StoragePage() {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return storages;
    return storages.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
    );
  }, [query]);

  const totals = useMemo(() => {
    const items = storages.reduce((sum, s) => sum + s.itemsCount, 0);
    const value = storages.reduce((sum, s) => sum + s.totalValue, 0);
    return { items, value };
  }, []);

  return (
    <div className="min-h-full" style={{ background: BG }}>
      <div
        className="sticky top-0 z-30 flex items-end justify-between px-5 pt-4 pb-4"
        style={{ background: BG }}
      >
        <div>
          <h1
            className="m-0 text-[26px] font-bold tracking-[-0.5px]"
            style={{ color: TEXT }}
          >
            Склады
          </h1>
          <div className="text-[13px] mt-1" style={{ color: MUTED }}>
            {storages.length} точек
          </div>
        </div>
        <button
          type="button"
          className="w-10 h-10 rounded-[12px] grid place-items-center active:scale-95 transition-transform"
          style={{
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            color: PRIMARY,
          }}
          aria-label="Добавить"
        >
          <PlusIcon size={20} strokeWidth={2.2} />
        </button>
      </div>

      <div className="px-5 pb-3 grid grid-cols-2 gap-2.5">
        <SummaryCard label="Всего позиций" value={`${totals.items}`} />
        <SummaryCard label="Стоимость" value={formatMoney(totals.value)} />
      </div>

      <div className="px-5 pb-3">
        <div
          className="relative rounded-[12px]"
          style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
        >
          <SearchIcon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: MUTED }}
          />
          <input
            className="w-full h-11 pl-10 pr-3 bg-transparent border-0 outline-none text-[15px]"
            style={{ color: TEXT }}
            placeholder="Поиск по названию или адресу"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="px-5 pb-6 flex flex-col gap-2.5">
        {visible.map((s) => (
          <button
            key={s.id}
            type="button"
            className="w-full text-left flex items-center gap-3.5 rounded-[14px] p-3 active:scale-[0.99] transition-transform"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <div
              className="w-[48px] h-[48px] rounded-[12px] shrink-0 flex items-center justify-center"
              style={{
                background: "rgba(47,168,255,0.12)",
                color: PRIMARY,
              }}
            >
              <StorageIcon size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-[15px] font-semibold truncate"
                style={{ color: TEXT, marginBottom: 2 }}
              >
                {s.name}
              </div>
              <div
                className="text-[12.5px] truncate"
                style={{ color: MUTED, marginBottom: 6 }}
              >
                {s.address}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px]" style={{ color: MUTED }}>
                  {s.itemsCount} позиций
                </span>
                <span
                  className="inline-block w-1 h-1 rounded-full"
                  style={{ background: MUTED_SOFT }}
                />
                <span
                  className="text-[12px] font-semibold tabular-nums"
                  style={{ color: TEXT }}
                >
                  {formatMoney(s.totalValue)}
                </span>
              </div>
            </div>
            <ChevronRightIcon
              size={16}
              strokeWidth={2}
              style={{ color: MUTED_SOFT }}
            />
          </button>
        ))}

        {visible.length === 0 && (
          <div
            className="text-center rounded-[14px] py-10 px-5"
            style={{
              background: SURFACE,
              border: `1px dashed ${BORDER}`,
              color: MUTED,
            }}
          >
            <div className="text-[14px]">Ничего не найдено</div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-[14px] px-4 py-3.5 flex flex-col gap-1"
      style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
    >
      <div className="text-[12.5px] font-medium" style={{ color: MUTED }}>
        {label}
      </div>
      <div
        className="text-[18px] font-bold tracking-[-0.3px] tabular-nums"
        style={{ color: TEXT }}
      >
        {value}
      </div>
    </div>
  );
}
