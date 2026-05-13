import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type LocationState = { from?: { pathname?: string } } | null;

function BoltIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {!open && <path d="M4 4l16 16" />}
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 12l5 5L20 6" />
    </svg>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("a.sokolova@retail.ru");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
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
    <div className="min-h-screen w-full bg-[#f4f6fa] text-ink-900 flex flex-col px-6 pt-[70px] pb-10">
      <div className="mt-10">
        <div
          className="w-16 h-16 rounded-[18px] flex items-center justify-center text-white mb-[26px]"
          style={{
            background:
              "linear-gradient(135deg, #2FA8FF 0%, rgba(47,168,255,0.667) 100%)",
            boxShadow: "0 12px 28px rgba(47,168,255,0.25)",
          }}
        >
          <BoltIcon />
        </div>
        <h1 className="m-0 text-[32px] font-bold tracking-[-0.6px] leading-[1.1]">
          С возвращением
        </h1>
        <p className="mt-2 mb-0 text-[15px] leading-[1.45] text-ink-500">
          Войдите в аккаунт, чтобы продолжить работу с CRM
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col gap-2.5 mt-8"
      >
        <div className="bg-white border border-[#E7EAF0] rounded-[14px] px-[14px] py-2.5 flex flex-col gap-0.5">
          <div className="text-[11.5px] font-semibold tracking-[0.6px] uppercase text-ink-500">
            E‑mail
          </div>
          <input
            className="bg-transparent border-0 outline-none text-ink-900 text-[16px] p-0 min-w-0 w-full"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="bg-white border border-[#E7EAF0] rounded-[14px] px-[14px] py-2.5 flex flex-col gap-0.5">
          <div className="text-[11.5px] font-semibold tracking-[0.6px] uppercase text-ink-500">
            Пароль
          </div>
          <div className="flex items-center gap-2">
            <input
              className="flex-1 bg-transparent border-0 outline-none text-ink-900 text-[16px] p-0 min-w-0"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ letterSpacing: showPassword ? 0 : 2 }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="-m-1 p-1 bg-transparent border-0 text-ink-500 flex items-center"
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        {error && (
          <div className="text-sm text-danger bg-red-50 border border-red-100 rounded-[12px] px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mt-1 px-1">
          <button
            type="button"
            onClick={() => setRemember((v) => !v)}
            className="flex items-center gap-2 text-[13.5px] text-ink-500 bg-transparent border-0 p-0"
          >
            <span
              className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center"
              style={{
                background: remember ? "#2FA8FF" : "#E7EAF0",
                color: "#fff",
              }}
            >
              {remember && <CheckIcon />}
            </span>
            Запомнить меня
          </button>
          <Link
            to="/forgot-password"
            className="text-[13.5px] font-medium text-[#2FA8FF] no-underline"
          >
            Забыли пароль?
          </Link>
        </div>
      </form>

      <div className="flex flex-col gap-3.5 mt-4">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="h-[54px] rounded-[14px] border-0 text-white text-[16px] font-semibold flex items-center justify-center gap-2 transition-opacity"
          style={{
            background: "#2FA8FF",
            boxShadow: "0 8px 20px rgba(47,168,255,0.25)",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <span
              className="w-[18px] h-[18px] rounded-full inline-block"
              style={{
                border: "2.5px solid rgba(255,255,255,0.4)",
                borderTopColor: "#fff",
                animation: "crm-spin 0.7s linear infinite",
              }}
            />
          ) : (
            "Войти в аккаунт"
          )}
        </button>
        <div className="text-center text-[13.5px] text-ink-500">
          Нет аккаунта?{" "}
          <a
            href="#"
            className="text-[#2FA8FF] font-medium no-underline"
            onClick={(e) => e.preventDefault()}
          >
            Связаться с менеджером
          </a>
        </div>
      </div>

      <style>{`@keyframes crm-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
