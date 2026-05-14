import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";

const NAV_ROUTES = new Set([
  "/",
  "/products",
  "/clients",
  "/storage",
  "/operations",
]);

export function AppShell() {
  const location = useLocation();
  const hasNav = NAV_ROUTES.has(location.pathname);

  return (
    <div className="app-frame">
      <main className={hasNav ? "pb-24" : ""}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
