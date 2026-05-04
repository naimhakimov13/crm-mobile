import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  BoxIcon,
  SwapIcon,
  StorageIcon,
  UsersIcon,
} from "../components/Icon";
import type { ComponentType, SVGProps } from "react";

type Tab = {
  to: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
};

const tabs: Tab[] = [
  { to: "/", label: "Главная", Icon: HomeIcon },
  { to: "/products", label: "Товары", Icon: BoxIcon },
  { to: "/operations", label: "Операции", Icon: SwapIcon },
  { to: "/storage", label: "Склад", Icon: StorageIcon },
  { to: "/clients", label: "Клиенты", Icon: UsersIcon },
];

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white shadow-nav border-t border-ink-300/30 z-20"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5 h-16">
        {tabs.map(({ to, label, Icon }) => (
          <li key={to} className="flex">
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-0.5 text-[11px] ${
                  isActive ? "text-brand-500" : "text-ink-400"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={isActive ? 2 : 1.7} />
                  <span className={isActive ? "font-medium" : ""}>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
