import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type LocationState = { from?: { pathname?: string } } | null;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("demo@crm.tj");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      const to =
        (location.state as LocationState)?.from?.pathname ?? "/";
      navigate(to, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-frame flex flex-col">
      <div className="px-6 pt-16 pb-8 bg-brand-grad text-white rounded-b-[28px]">
        <div className="text-2xl font-semibold">С возвращением</div>
        <div className="text-white/80 mt-1 text-sm">
          Войдите, чтобы продолжить работу
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="px-6 -mt-6 flex-1 flex flex-col gap-4"
      >
        <div className="card flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-ink-500">Email</span>
            <input
              className="input"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-ink-500">Пароль</span>
            <input
              className="input"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && (
            <div className="text-sm text-danger bg-red-50 border border-red-100 rounded-btn px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary mt-1 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </div>

        <div className="text-center text-xs text-ink-400 mt-auto pb-8">
          Демо-режим — любой email и пароль от 4 символов
        </div>
      </form>
    </div>
  );
}
