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
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-20 pointer-events-none"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
    >
      <nav className="liquid-glass mx-4 pointer-events-auto">
        <ul className="relative grid grid-cols-5 h-[64px] px-1.5">
          {tabs.map(({ to, label, Icon }) => (
            <li key={to} className="flex">
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `flex-1 mx-0.5 my-1.5 rounded-2xl flex flex-col items-center justify-center gap-0.5 text-[11px] transition-all duration-200 ${
                    isActive
                      ? "text-brand-600 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_4px_12px_rgba(31,144,224,0.18)]"
                      : "text-ink-500 active:bg-white/30"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={22} strokeWidth={isActive ? 2 : 1.7} />
                    <span className={isActive ? "font-semibold" : "font-medium"}>
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
