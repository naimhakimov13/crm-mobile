import type { Currency } from "../data/types";

const symbols: Record<Currency, string> = {
  UZS: "сум",
  USD: "$",
  RUB: "₽",
};

export function formatMoney(value: number, currency: Currency = "UZS") {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  const grouped = abs.toLocaleString("ru-RU").replace(/,/g, " ");
  if (currency === "USD") return `${sign}$${grouped}`;
  if (currency === "RUB") return `${sign}${grouped} ₽`;
  return `${sign}${grouped} ${symbols[currency]}`;
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
  });
}

export function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
