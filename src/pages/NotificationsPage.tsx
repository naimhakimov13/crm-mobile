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
import { EmptyState } from "../components/EmptyState";
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

const tonePresets: Record<
  NotifType,
  { tile: string; ring: string; dot: string }
> = {
  info: {
    tile: "linear-gradient(135deg, #3FBDFF 0%, #1FA8FF 100%)",
    ring: "rgba(63,189,255,0.35)",
    dot: "#1FA8FF",
  },
  success: {
    tile: "linear-gradient(135deg, #34D399 0%, #16A34A 100%)",
    ring: "rgba(34,197,94,0.35)",
    dot: "#22C55E",
  },
  warning: {
    tile: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
    ring: "rgba(245,158,11,0.35)",
    dot: "#F59E0B",
  },
  danger: {
    tile: "linear-gradient(135deg, #FB7185 0%, #EF4444 100%)",
    ring: "rgba(239,68,68,0.35)",
    dot: "#EF4444",
  },
};

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "только что";
  if (m < 60) return `${m} мин назад`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} ч назад`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d} дн назад`;
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

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Notification[]>(initialNotifications);

  const unreadCount = items.filter((n) => !n.read).length;

  const grouped = useMemo(() => {
    const buckets: Record<"today" | "yesterday" | "earlier", Notification[]> =
      { today: [], yesterday: [], earlier: [] };
    for (const n of items) buckets[bucketOf(n.date)].push(n);
    return buckets;
  }, [items]);

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function toggleRead(id: string) {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  }

  return (
    <div>
      <div className="px-4 pt-6">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 grid place-items-center rounded-full bg-white/70 backdrop-blur-xl border border-white/60 text-ink-700 active:scale-95 transition shadow-[0_4px_12px_-4px_rgba(14,23,38,0.15)]"
            aria-label="Назад"
          >
            <ChevronLeftIcon size={20} />
          </button>
          <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-[0.18em]">
            Уведомления
          </div>
          {unreadCount > 0 ? (
            <button
              type="button"
              onClick={markAllRead}
              className="w-10 h-10 grid place-items-center rounded-full bg-brand-grad text-white active:scale-95 transition shadow-[0_8px_18px_-6px_rgba(31,144,224,0.55)]"
              aria-label="Отметить всё как прочитанное"
            >
              <CheckIcon size={20} />
            </button>
          ) : (
            <span className="w-10 h-10" />
          )}
        </div>
      </div>

      <div className="px-4 mt-6 flex flex-col items-center text-center">
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-0 -m-3 rounded-3xl blur-2xl opacity-50"
            style={{
              background:
                "radial-gradient(circle, rgba(63,189,255,0.55) 0%, rgba(63,189,255,0) 70%)",
            }}
          />
          <div
            className="relative w-16 h-16 rounded-3xl bg-brand-grad text-white grid place-items-center"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.6), 0 14px 32px -10px rgba(31,144,224,0.6), 0 4px 12px rgba(14,23,38,0.12)",
            }}
          >
            <BellIcon size={28} />
          </div>
        </div>
        <div className="mt-3 text-xl font-semibold text-ink-900 tracking-tight">
          {unreadCount > 0
            ? `${unreadCount} новых ${unreadCount === 1 ? "уведомление" : "уведомлений"}`
            : "Всё прочитано"}
        </div>
        <div className="text-xs text-ink-500 mt-1">
          {items.length} {items.length === 1 ? "запись" : "записей"} всего
        </div>
      </div>

      {items.length === 0 ? (
        <div className="px-4 mt-6">
          <EmptyState
            title="Нет уведомлений"
            subtitle="Здесь появятся события вашего бизнеса"
          />
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-5 md:px-3">
          {(["today", "yesterday", "earlier"] as const).map((bucket) =>
            grouped[bucket].length === 0 ? null : (
              <section key={bucket}>
                <div className="px-4 md:px-0 text-[11px] uppercase tracking-[0.16em] text-ink-500 mb-2">
                  {bucketLabel[bucket]}
                </div>
                <div className="card p-0 overflow-hidden">
                  <ul className="divide-y divide-ink-300/30">
                    {grouped[bucket].map((n) => {
                      const tone = tonePresets[n.type];
                      const Icon = n.Icon;
                      return (
                        <li key={n.id}>
                          <button
                            type="button"
                            onClick={() => toggleRead(n.id)}
                            className="w-full text-left px-4 py-3 flex items-start gap-3 active:bg-white/40 transition-colors"
                          >
                            <div className="relative flex-none">
                              <div
                                className="w-10 h-10 rounded-2xl text-white grid place-items-center"
                                style={{
                                  background: tone.tile,
                                  boxShadow: `0 8px 18px -8px ${tone.ring}, inset 0 1px 0 rgba(255,255,255,0.45)`,
                                }}
                              >
                                <Icon size={18} />
                              </div>
                              {!n.read && (
                                <span
                                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white"
                                  style={{ background: tone.dot }}
                                />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <div
                                  className={`truncate ${
                                    n.read
                                      ? "font-medium text-ink-700"
                                      : "font-semibold text-ink-900"
                                  }`}
                                >
                                  {n.title}
                                </div>
                                <div className="text-[11px] text-ink-400 shrink-0 tabular-nums">
                                  {relativeTime(n.date)}
                                </div>
                              </div>
                              <div className="text-sm text-ink-500 mt-0.5 line-clamp-2">
                                {n.body}
                              </div>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>
            )
          )}
        </div>
      )}
    </div>
  );
}
