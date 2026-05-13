import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const SURFACE = "var(--c-surface)";
const BORDER = "var(--c-border)";
const BG = "var(--c-bg)";
const TEXT = "var(--c-text)";
const MUTED = "var(--c-muted)";
const PRIMARY = "var(--c-primary)";
const DANGER = "var(--c-danger)";

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
    <div
      className="min-h-screen w-full flex flex-col px-6 pt-[70px] pb-10"
      style={{ background: BG, color: TEXT }}
    >
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
        <h1
          className="m-0 text-[32px] font-bold tracking-[-0.6px] leading-[1.1]"
          style={{ color: TEXT }}
        >
          С возвращением
        </h1>
        <p
          className="mt-2 mb-0 text-[15px] leading-[1.45]"
          style={{ color: MUTED }}
        >
          Войдите в аккаунт, чтобы продолжить работу с CRM
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col gap-2.5 mt-8"
      >
        <div
          className="rounded-[14px] px-[14px] py-2.5 flex flex-col gap-0.5"
          style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
        >
          <div
            className="text-[11.5px] font-semibold tracking-[0.6px] uppercase"
            style={{ color: MUTED }}
          >
            E‑mail
          </div>
          <input
            className="bg-transparent border-0 outline-none text-[16px] p-0 min-w-0 w-full"
            style={{ color: TEXT }}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div
          className="rounded-[14px] px-[14px] py-2.5 flex flex-col gap-0.5"
          style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
        >
          <div
            className="text-[11.5px] font-semibold tracking-[0.6px] uppercase"
            style={{ color: MUTED }}
          >
            Пароль
          </div>
          <div className="flex items-center gap-2">
            <input
              className="flex-1 bg-transparent border-0 outline-none text-[16px] p-0 min-w-0"
              style={{ color: TEXT, letterSpacing: showPassword ? 0 : 2 }}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="-m-1 p-1 bg-transparent border-0 flex items-center"
              style={{ color: MUTED }}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        {error && (
          <div
            className="text-sm rounded-[12px] px-3 py-2"
            style={{
              color: DANGER,
              background: "var(--c-danger-fade)",
              border: `1px solid rgba(239,68,68,0.3)`,
            }}
          >
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mt-1 px-1">
          <button
            type="button"
            onClick={() => setRemember((v) => !v)}
            className="flex items-center gap-2 text-[13.5px] bg-transparent border-0 p-0"
            style={{ color: MUTED }}
          >
            <span
              className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center"
              style={{
                background: remember ? PRIMARY : BORDER,
                color: "#fff",
              }}
            >
              {remember && <CheckIcon />}
            </span>
            Запомнить меня
          </button>
          <Link
            to="/forgot-password"
            className="text-[13.5px] font-medium no-underline"
            style={{ color: PRIMARY }}
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
            background: PRIMARY,
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
        <div
          className="text-center text-[13.5px]"
          style={{ color: MUTED }}
        >
          Нет аккаунта?{" "}
          <a
            href="#"
            className="font-medium no-underline"
            style={{ color: PRIMARY }}
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
