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
  { to: "/", label: "Статистика", Icon: HomeIcon },
  { to: "/products", label: "Товары", Icon: BoxIcon },
  { to: "/clients", label: "Клиенты", Icon: UsersIcon },
  { to: "/storage", label: "Склад", Icon: StorageIcon },
  { to: "/operations", label: "Операции", Icon: SwapIcon },
];

const SURFACE = "#FFFFFF";
const BORDER = "#E7EAF0";
const PRIMARY = "#2FA8FF";
const MUTED = "#5B6878";

const visibleOn = new Set(tabs.map((t) => t.to));

export function BottomNav() {
  const location = useLocation();
  if (!visibleOn.has(location.pathname)) return null;

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-20"
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)",
        paddingTop: 8,
        paddingLeft: 8,
        paddingRight: 8,
        background: SURFACE + "ee",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      <ul className="flex justify-around">
        {tabs.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1 min-w-0 flex">
            <NavLink
              to={to}
              end={to === "/"}
              className="flex-1 flex flex-col items-center gap-[3px] py-1.5 px-1 bg-transparent border-0"
            >
              {({ isActive }) => {
                const color = isActive ? PRIMARY : MUTED;
                return (
                  <>
                    <Icon
                      size={22}
                      strokeWidth={isActive ? 2 : 1.7}
                      style={{ color }}
                    />
                    <span
                      className="whitespace-nowrap"
                      style={{
                        color,
                        fontSize: 10.5,
                        fontWeight: isActive ? 600 : 500,
                        letterSpacing: 0.1,
                      }}
                    >
                      {label}
                    </span>
                  </>
                );
              }}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
