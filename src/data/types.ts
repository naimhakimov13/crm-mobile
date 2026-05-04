export type Currency = "UZS" | "USD" | "RUB";

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  currency: Currency;
  stock: number;
  unit: "шт" | "кг" | "л";
};

export type Client = {
  id: string;
  name: string;
  phone: string;
  balance: number;
  currency: Currency;
  type: "Розница" | "Опт" | "Партнёр";
};

export type Storage = {
  id: string;
  name: string;
  address: string;
  itemsCount: number;
  totalValue: number;
};

export type MoneyOpType = "income" | "expense" | "stock";

export type MoneyOperation = {
  id: string;
  type: MoneyOpType;
  title: string;
  category: string;
  amount: number;
  currency: Currency;
  date: string;
  storage?: string;
};

export type Sale = {
  id: string;
  number: string;
  client: string;
  amount: number;
  currency: Currency;
  date: string;
  status: "Оплачен" | "В долг" | "Возврат";
};

export type Purchase = {
  id: string;
  number: string;
  supplier: string;
  amount: number;
  currency: Currency;
  date: string;
  status: "Принят" | "Ожидается" | "Отменён";
};

export type Transfer = {
  id: string;
  number: string;
  from: string;
  to: string;
  itemsCount: number;
  date: string;
  status: "В пути" | "Получен" | "Создан";
};
