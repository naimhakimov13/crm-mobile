import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

const SURFACE = "var(--c-surface)";
const BORDER = "var(--c-border)";
const BG = "var(--c-bg)";
const TEXT = "var(--c-text)";
const MUTED = "var(--c-muted)";
const PRIMARY = "var(--c-primary)";
const DANGER = "var(--c-danger)";

function ChevronLeft() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function KeyIcon() {
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
      <circle cx="9" cy="14" r="4" />
      <path d="M12.5 11.5L21 3" />
      <path d="M17 7l2 2" />
      <path d="M19 5l2 2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("a.sokolova@retail.ru");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.includes("@")) {
      setError("Введите корректный e‑mail");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSent(true);
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col px-6 pt-[70px] pb-10"
      style={{ background: BG, color: TEXT }}
    >
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full grid place-items-center"
          style={{
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            color: TEXT,
            boxShadow: "0 1px 2px rgba(14,23,38,0.06)",
          }}
          aria-label="Назад"
        >
          <ChevronLeft />
        </button>
      </div>

      {!sent ? (
        <>
          <div className="mt-8">
            <div
              className="w-16 h-16 rounded-[18px] flex items-center justify-center text-white mb-[26px]"
              style={{
                background:
                  "linear-gradient(135deg, #2FA8FF 0%, rgba(47,168,255,0.667) 100%)",
                boxShadow: "0 12px 28px rgba(47,168,255,0.25)",
              }}
            >
              <KeyIcon />
            </div>
            <h1
              className="m-0 text-[32px] font-bold tracking-[-0.6px] leading-[1.1]"
              style={{ color: TEXT }}
            >
              Забыли пароль?
            </h1>
            <p
              className="mt-2 mb-0 text-[15px] leading-[1.45]"
              style={{ color: MUTED }}
            >
              Укажите e‑mail аккаунта — мы пришлём ссылку для сброса пароля.
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
                autoFocus
              />
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
          </form>

          <div className="flex flex-col gap-3.5 mt-4">
            <button
              type="button"
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
                "Отправить ссылку"
              )}
            </button>
            <div
              className="text-center text-[13.5px]"
              style={{ color: MUTED }}
            >
              Вспомнили пароль?{" "}
              <Link
                to="/login"
                className="font-medium no-underline"
                style={{ color: PRIMARY }}
              >
                Войти в аккаунт
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div
              className="w-20 h-20 rounded-[22px] flex items-center justify-center text-white mb-6"
              style={{
                background:
                  "linear-gradient(135deg, #2FA8FF 0%, rgba(47,168,255,0.667) 100%)",
                boxShadow: "0 12px 28px rgba(47,168,255,0.25)",
              }}
            >
              <MailIcon />
            </div>
            <h1
              className="m-0 text-[28px] font-bold tracking-[-0.5px] leading-[1.15]"
              style={{ color: TEXT }}
            >
              Письмо отправлено
            </h1>
            <p
              className="mt-3 mb-0 text-[15px] leading-[1.5] max-w-[300px]"
              style={{ color: MUTED }}
            >
              Мы отправили ссылку для сброса пароля на{" "}
              <span className="font-medium" style={{ color: TEXT }}>
                {email}
              </span>
              . Проверьте входящие и папку «Спам».
            </p>

            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-6 text-[13.5px] font-medium bg-transparent border-0 p-2"
              style={{ color: PRIMARY }}
            >
              Указать другой e‑mail
            </button>
          </div>

          <div className="flex flex-col gap-3.5">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="h-[54px] rounded-[14px] border-0 text-white text-[16px] font-semibold flex items-center justify-center gap-2"
              style={{
                background: PRIMARY,
                boxShadow: "0 8px 20px rgba(47,168,255,0.25)",
              }}
            >
              Вернуться ко входу
            </button>
          </div>
        </>
      )}

      <style>{`@keyframes crm-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
