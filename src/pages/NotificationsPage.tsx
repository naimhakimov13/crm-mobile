import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BellIcon,
  BoxIcon,
  CheckIcon,
  ChevronLeftIcon,
  SwapIcon,
  UsersIcon,
  WalletIcon,
} from "../components/Icon";
import type { ComponentType, SVGProps } from "react";

type NotifType = "info" | "success" | "warning" | "danger";

type Notification = {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  date: string;
  read: boolean;
  Icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
};

const SURFACE = "var(--c-surface)";
const BORDER = "var(--c-border)";
const BG = "var(--c-bg)";
const TEXT = "var(--c-text)";
const MUTED = "var(--c-muted)";
const MUTED_SOFT = "var(--c-muted-soft)";
const PRIMARY = "var(--c-primary)";
const SUCCESS = "var(--c-success)";
const WARN = "var(--c-warn)";
const DANGER = "var(--c-danger)";

const toneColor: Record<NotifType, string> = {
  info: PRIMARY,
  success: SUCCESS,
  warning: WARN,
  danger: DANGER,
};

const toneFade: Record<NotifType, string> = {
  info: "var(--c-primary-fade)",
  success: "var(--c-success-fade)",
  warning: "var(--c-warn-fade)",
  danger: "var(--c-danger-fade)",
};

const initialNotifications: Notification[] = [
  {
    id: "n1",
    type: "warning",
    title: "Низкий остаток",
    body: "Картофель фри — осталось 12 кг",
    date: new Date().toISOString(),
    read: false,
    Icon: BoxIcon,
  },
  {
    id: "n2",
    type: "success",
    title: "Оплата получена",
    body: "Клиент «ООО Восток» оплатил счёт №1042 на 240 000",
    date: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    read: false,
    Icon: WalletIcon,
  },
  {
    id: "n3",
    type: "info",
    title: "Новая продажа",
    body: "Реализация №18 на сумму 20.30",
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    read: false,
    Icon: SwapIcon,
  },
  {
    id: "n4",
    type: "danger",
    title: "Закончился товар",
    body: "Сок апельсиновый 1л — нет в наличии",
    date: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    read: true,
    Icon: BoxIcon,
  },
  {
    id: "n5",
    type: "info",
    title: "Новый клиент",
    body: 'Добавлен контрагент «Кафе "Ромашка"»',
    date: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    read: true,
    Icon: UsersIcon,
  },
  {
    id: "n6",
    type: "info",
    title: "Обновление системы",
    body: "Доступна новая версия отчётов по складу",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    read: true,
    Icon: BellIcon,
  },
];

const FILTERS = ["Все", "Непрочитанные", "Склад", "Финансы"] as const;
type Filter = (typeof FILTERS)[number];

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "только что";
  if (m < 60) return `${m} мин`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} ч`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d} дн`;
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

function bucketOf(iso: string): "today" | "yesterday" | "earlier" {
  const d = new Date(iso);
  const now = new Date();
  const start = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = (start(now) - start(d)) / (1000 * 60 * 60 * 24);
  if (diff < 1) return "today";
  if (diff < 2) return "yesterday";
  return "earlier";
}

const bucketLabel: Record<"today" | "yesterday" | "earlier", string> = {
  today: "Сегодня",
  yesterday: "Вчера",
  earlier: "Ранее",
};

function matchFilter(n: Notification, f: Filter) {
  if (f === "Все") return true;
  if (f === "Непрочитанные") return !n.read;
  if (f === "Склад") return n.Icon === BoxIcon;
  if (f === "Финансы") return n.Icon === WalletIcon || n.Icon === SwapIcon;
  return true;
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<Filter>("Все");

  const unreadCount = items.filter((n) => !n.read).length;

  const visible = useMemo(
    () => items.filter((n) => matchFilter(n, filter)),
    [items, filter],
  );

  const grouped = useMemo(() => {
    const buckets: Record<"today" | "yesterday" | "earlier", Notification[]> =
      { today: [], yesterday: [], earlier: [] };
    for (const n of visible) buckets[bucketOf(n.date)].push(n);
    return buckets;
  }, [visible]);

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function toggleRead(id: string) {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  }

  return (
    <div className="min-h-full" style={{ background: BG }}>
      <div
        className="sticky top-0 z-30 flex items-center justify-between px-5 pt-4 pb-3"
        style={{ background: BG }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full grid place-items-center active:scale-95 transition-transform"
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
          Уведомления
        </div>
        {unreadCount > 0 ? (
          <button
            type="button"
            onClick={markAllRead}
            className="h-[34px] px-[14px] rounded-[10px] text-[14px] font-semibold bg-transparent border-0"
            style={{ color: PRIMARY }}
          >
            Прочитать
          </button>
        ) : (
          <span className="w-10" aria-hidden />
        )}
      </div>

      <div className="px-5 pt-2 pb-4">
        <h1
          className="m-0 text-[26px] font-bold tracking-[-0.5px]"
          style={{ color: TEXT }}
        >
          {unreadCount > 0
            ? `${unreadCount} новых`
            : "Всё прочитано"}
        </h1>
        <div className="text-[13px] mt-1" style={{ color: MUTED }}>
          {items.length} {items.length === 1 ? "запись" : "записей"} всего
        </div>
      </div>

      <div
        className="flex gap-2 px-5 pb-3.5 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className="shrink-0 h-8 px-3.5 rounded-full text-[13px] font-medium inline-flex items-center gap-1.5"
              style={
                active
                  ? {
                      background: PRIMARY,
                      color: "#fff",
                      boxShadow: "0 4px 10px rgba(47,168,255,0.25)",
                    }
                  : {
                      background: SURFACE,
                      border: `1px solid ${BORDER}`,
                      color: TEXT,
                    }
              }
            >
              {f}
              {f === "Непрочитанные" && unreadCount > 0 && (
                <span
                  className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10.5px] font-semibold"
                  style={{
                    background: active ? "rgba(255,255,255,0.25)" : PRIMARY,
                    color: "#fff",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="px-5 pb-6">
          <div
            className="text-center rounded-[14px] py-12 px-5"
            style={{
              background: SURFACE,
              border: `1px dashed ${BORDER}`,
              color: MUTED,
            }}
          >
            <div
              className="w-12 h-12 rounded-[14px] mx-auto mb-3 flex items-center justify-center"
              style={{ background: BORDER, color: MUTED }}
            >
              <BellIcon size={22} />
            </div>
            <div className="text-[14px]">Нет уведомлений</div>
          </div>
        </div>
      ) : (
        <div className="px-5 pb-6 flex flex-col gap-[18px]">
          {(["today", "yesterday", "earlier"] as const).map((bucket) =>
            grouped[bucket].length === 0 ? null : (
              <div key={bucket}>
                <div
                  className="text-[12px] font-semibold uppercase tracking-[0.6px] px-1 pb-2"
                  style={{ color: MUTED }}
                >
                  {bucketLabel[bucket]}
                </div>
                <div
                  className="rounded-[14px] overflow-hidden"
                  style={{
                    background: SURFACE,
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  {grouped[bucket].map((n, i) => {
                    const c = toneColor[n.type];
                    const cFade = toneFade[n.type];
                    const Icon = n.Icon;
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => toggleRead(n.id)}
                        className="w-full text-left bg-transparent border-0 px-4 py-3 flex items-start gap-3 relative"
                        style={{
                          borderTop: i === 0 ? "none" : `1px solid ${BORDER}`,
                          background: n.read
                            ? "transparent"
                            : "rgba(47,168,255,0.04)",
                        }}
                      >
                        <div
                          className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center shrink-0"
                          style={{ background: cFade, color: c }}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <div
                              className="text-[14.5px] truncate"
                              style={{
                                color: TEXT,
                                fontWeight: n.read ? 500 : 600,
                              }}
                            >
                              {n.title}
                            </div>
                            <div
                              className="text-[11.5px] shrink-0 tabular-nums"
                              style={{ color: MUTED_SOFT }}
                            >
                              {relativeTime(n.date)}
                            </div>
                          </div>
                          <div
                            className="text-[12.5px] mt-[3px] line-clamp-2"
                            style={{ color: MUTED }}
                          >
                            {n.body}
                          </div>
                        </div>
                        {!n.read && (
                          <span
                            className="absolute top-3 right-3 w-2 h-2 rounded-full"
                            style={{ background: c }}
                            aria-hidden
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {unreadCount === 0 && items.length > 0 && (
        <div
          className="mx-5 mb-6 rounded-[14px] p-4 flex items-center gap-3"
          style={{ background: "var(--c-success-fade)", color: TEXT }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: SUCCESS, color: "#fff" }}
          >
            <CheckIcon size={18} strokeWidth={2.4} />
          </div>
          <div className="text-[13.5px]" style={{ color: MUTED }}>
            Вы прочитали все уведомления
          </div>
        </div>
      )}
    </div>
  );
}
