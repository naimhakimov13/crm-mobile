# Fast Food — мобильный UI

Vite + React 18 + TypeScript + Tailwind CSS, ориентированный на мобильную ширину (`max-w-md`). Палитра и токены вдохновлены экспортом из `data.json` (Figma-дерево).

## Запуск

```bash
npm install
npm run dev
```

Сборка:

```bash
npm run build
```

Проверка типов:

```bash
npm run lint
```

## Структура

- `src/auth/` — `AuthContext` и `RequireAuth`-обёртка для защиты маршрутов.
- `src/layout/` — `AppShell` с `BottomNav`, `PageHeader`.
- `src/pages/` — экраны: `LoginPage`, `DashboardPage`, `ProductsPage`, `StoragePage`, `ClientsPage`.
- `src/pages/operations/` — `OperationsHubPage`, `MoneyOperationsPage`, `SalesPage`, `PurchasesPage`, `TransfersPage`.
- `src/data/` — типы доменных сущностей и mock-данные.
- `src/theme/tokens.ts` — дизайн-токены (цвета, радиусы, размеры).

## Авторизация

Демо-режим: любой email и пароль от 4 символов. Сессия хранится в `sessionStorage`.

## Маршруты

```
/login                       Login
/                            Dashboard
/products                    Список товаров
/storage                     Список складов
/clients                     Список клиентов
/operations                  Hub
/operations/money            Доход / расход / складские операции
/operations/sales            Продажи
/operations/purchases        Закупки
/operations/transfers        Переводы
```
