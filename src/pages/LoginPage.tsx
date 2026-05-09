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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4 py-8 sm:px-6 sm:py-12 bg-gradient-to-b from-[#eaf4ff] via-[#f4f6fa] to-[#f4f6fa]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 w-[420px] h-[420px] rounded-full opacity-60 blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, #3fbdff 0%, rgba(63,189,255,0) 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-24 w-[380px] h-[380px] rounded-full opacity-55 blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, #a78bfa 0%, rgba(167,139,250,0) 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full opacity-40 blur-[100px] hidden sm:block"
        style={{
          background:
            "radial-gradient(circle, #88d6ef 0%, rgba(136,214,239,0) 70%)",
        }}
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[420px] sm:max-w-md flex flex-col gap-6 p-0 sm:p-8 sm:rounded-[28px] sm:border sm:border-white/55 sm:bg-gradient-to-b sm:from-white/60 sm:to-white/40 sm:backdrop-blur-[28px] sm:backdrop-saturate-[180%] sm:overflow-hidden sm:shadow-[inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-1px_0_rgba(255,255,255,0.25),0_18px_40px_-12px_rgba(14,23,38,0.22),0_6px_16px_-8px_rgba(14,23,38,0.18)]"
      >
        <div className="flex flex-col items-center text-center gap-3">
          <div
            className="w-16 h-16 rounded-2xl bg-brand-grad flex items-center justify-center text-white"
            style={{
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.55) inset, 0 -1px 0 rgba(0,0,0,0.08) inset, 0 12px 28px -8px rgba(31,144,224,0.6), 0 4px 10px rgba(31,144,224,0.25)",
            }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5v-9z" />
              <path d="M3 7.5L12 12l9-4.5" />
              <path d="M12 12v9" />
            </svg>
          </div>
          <div>
            <div className="text-2xl sm:text-[26px] font-semibold text-ink-900 tracking-tight">
              С возвращением
            </div>
            <div className="text-sm text-ink-500 mt-1">
              Войдите, чтобы продолжить работу
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink-500 uppercase tracking-wider">
              Email
            </span>
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
            <span className="text-xs font-medium text-ink-500 uppercase tracking-wider">
              Пароль
            </span>
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
        </div>

        {error && (
          <div className="text-sm text-danger bg-red-50/80 border border-red-100 rounded-btn px-3 py-2 backdrop-blur-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn-primary disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Вход..." : "Войти"}
        </button>

        <div className="text-center text-xs text-ink-400">
          Демо-режим — любой email и пароль от 4 символов
        </div>
      </form>
    </div>
  );
}
