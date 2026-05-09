import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { RequireAuth } from "./auth/RequireAuth";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ManageProductPage from "./pages/ManageProductPage";
import StoragePage from "./pages/StoragePage";
import ClientsPage from "./pages/ClientsPage";
import OperationsHubPage from "./pages/operations/OperationsHubPage";
import MoneyOperationsPage from "./pages/operations/MoneyOperationsPage";
import SalesPage from "./pages/operations/SalesPage";
import PurchasesPage from "./pages/operations/PurchasesPage";
import TransfersPage from "./pages/operations/TransfersPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="products/new" element={<ManageProductPage />} />
        <Route path="products/:productId/edit" element={<ManageProductPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="storage" element={<StoragePage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="operations" element={<OperationsHubPage />} />
        <Route path="operations/money" element={<MoneyOperationsPage />} />
        <Route path="operations/sales" element={<SalesPage />} />
        <Route path="operations/purchases" element={<PurchasesPage />} />
        <Route path="operations/transfers" element={<TransfersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
