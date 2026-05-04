import { NavLink, useLocation } from "react-router-dom";
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

const spring = "cubic-bezier(0.34, 1.56, 0.64, 1)";

export function BottomNav() {
  const location = useLocation();

  const activeIndex = tabs.findIndex((t) =>
    t.to === "/"
      ? location.pathname === "/"
      : location.pathname === t.to ||
        location.pathname.startsWith(t.to + "/")
  );

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-20 pointer-events-none"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
    >
      <nav className="liquid-glass mx-4 pointer-events-auto">
        <ul className="relative grid grid-cols-5 h-[64px]">
          <span
            aria-hidden
            className="absolute top-1.5 bottom-1.5 rounded-2xl bg-white/60 will-change-transform"
            style={{
              width: "calc(20% - 8px)",
              left: "4px",
              transform: `translateX(calc(${
                activeIndex < 0 ? 0 : activeIndex
              } * (100% + 8px)))`,
              transition: `transform 520ms ${spring}, opacity 200ms ease`,
              opacity: activeIndex >= 0 ? 1 : 0,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.85), 0 4px 12px rgba(31,144,224,0.22)",
            }}
          />

          {tabs.map(({ to, label, Icon }) => (
            <li key={to} className="flex">
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `flex-1 flex flex-col items-center justify-center gap-0.5 text-[11px] relative transition-colors duration-300 ${
                    isActive ? "text-brand-600" : "text-ink-500"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="grid place-items-center"
                      style={{
                        transition: `transform 520ms ${spring}`,
                        transform: isActive
                          ? "translateY(-2px) scale(1.12)"
                          : "translateY(0) scale(1)",
                      }}
                    >
                      <Icon
                        size={22}
                        strokeWidth={isActive ? 2 : 1.7}
                        style={{
                          transition: "stroke-width 300ms ease",
                          filter: isActive
                            ? "drop-shadow(0 4px 6px rgba(31,144,224,0.35))"
                            : "none",
                        }}
                      />
                    </span>
                    <span
                      style={{
                        transition: `opacity 300ms ease, transform 520ms ${spring}, font-weight 300ms ease`,
                        opacity: isActive ? 1 : 0.8,
                        transform: isActive
                          ? "translateY(0) scale(1)"
                          : "translateY(2px) scale(0.95)",
                        fontWeight: isActive ? 600 : 500,
                      }}
                    >
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
