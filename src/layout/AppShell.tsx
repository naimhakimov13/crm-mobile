import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";

export function AppShell() {
  return (
    <div className="app-frame">
      <main className="pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
