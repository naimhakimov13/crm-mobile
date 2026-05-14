import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { CheckIcon, ChevronLeftIcon } from "../components/Icon";

const SURFACE = "var(--c-surface)";
const BORDER = "var(--c-border)";
const BG = "var(--c-bg)";
const TEXT = "var(--c-text)";
const MUTED = "var(--c-muted)";
const PRIMARY = "var(--c-primary)";
const SUCCESS = "var(--c-success)";
const DANGER = "var(--c-danger)";
const SURFACE_INFO = "var(--c-primary-fade)";

function GearIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
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

type Requirement = {
  label: string;
  test: (v: string) => boolean;
};

const requirements: Requirement[] = [
  { label: "Минимум 8 символов", test: (v) => v.length >= 8 },
  {
    label: "Заглавные и строчные буквы",
    test: (v) => /[a-zа-яё]/.test(v) && /[A-ZА-ЯЁ]/.test(v),
  },
  { label: "Хотя бы одна цифра", test: (v) => /\d/.test(v) },
  { label: "Хотя бы один символ", test: (v) => /[^A-Za-zА-Яа-яЁё0-9]/.test(v) },
];

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checks = useMemo(
    () => requirements.map((r) => ({ ...r, ok: r.test(next) })),
    [next],
  );
  const allMet = checks.every((c) => c.ok);
  const matches = next.length > 0 && next === confirm;
  const canSubmit =
    current.length >= 4 && allMet && matches && !loading;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-full flex flex-col"
      style={{ background: BG }}
    >
      <div
        className="sticky top-0 z-30 flex items-center justify-between px-5 pt-4 pb-3"
        style={{ background: BG }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full grid place-items-center active:scale-95 transition-transform"
          style={{
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            color: TEXT,
          }}
          aria-label="Назад"
        >
          <ChevronLeftIcon size={20} />
        </button>
        <div
          className="text-[16px] font-semibold tracking-[-0.2px]"
          style={{ color: TEXT }}
        >
          Сменить пароль
        </div>
        <div className="w-10" aria-hidden />
      </div>

      <div className="px-5 pt-3">
        <div
          className="flex items-start gap-3.5 rounded-[18px] p-3.5"
          style={{ background: SURFACE_INFO }}
        >
          <div
            className="shrink-0 w-[44px] h-[44px] rounded-[12px] flex items-center justify-center text-white"
            style={{
              background:
                "linear-gradient(135deg, #2FA8FF 0%, rgba(47,168,255,0.667) 100%)",
              boxShadow: "0 8px 18px rgba(47,168,255,0.3)",
            }}
          >
            <GearIcon />
          </div>
          <div
            className="text-[14px] leading-snug pt-0.5"
            style={{ color: TEXT }}
          >
            Рекомендуем менять пароль каждые 3 месяца. После сохранения вы
            выйдете со всех устройств.
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 flex flex-col gap-2.5">
        <PasswordField
          label="Текущий пароль"
          value={current}
          onChange={setCurrent}
          show={showCurrent}
          onToggle={() => setShowCurrent((v) => !v)}
        />
        <PasswordField
          label="Новый пароль"
          value={next}
          onChange={setNext}
          show={showNext}
          onToggle={() => setShowNext((v) => !v)}
        />
        <PasswordField
          label="Подтвердите новый пароль"
          value={confirm}
          onChange={setConfirm}
          show={showConfirm}
          onToggle={() => setShowConfirm((v) => !v)}
          error={
            confirm.length > 0 && !matches ? "Пароли не совпадают" : undefined
          }
        />
      </div>

      <div className="px-5 pt-5">
        <div
          className="text-[12px] font-semibold uppercase tracking-[0.6px] px-1 pb-2"
          style={{ color: MUTED }}
        >
          Требования
        </div>
        <div
          className="rounded-[14px] px-4"
          style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
        >
          {checks.map((c, i) => (
            <div
              key={c.label}
              className="flex items-center gap-3 py-3"
              style={{
                borderTop: i === 0 ? "none" : `1px solid ${BORDER}`,
              }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: c.ok ? SUCCESS : BORDER,
                  color: "#fff",
                }}
              >
                {c.ok ? (
                  <CheckIcon size={12} strokeWidth={3} />
                ) : (
                  <span className="inline-block w-1 h-1 rounded-full bg-white/70" />
                )}
              </span>
              <span
                className="text-[14.5px]"
                style={{ color: c.ok ? TEXT : MUTED }}
              >
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="px-5 pt-4">
          <div
            className="rounded-[14px] px-3 py-2 text-[13px]"
            style={{
              background: "var(--c-danger-fade)",
              color: DANGER,
              border: `1px solid rgba(239,68,68,0.3)`,
            }}
          >
            {error}
          </div>
        </div>
      )}

      <div className="flex-1" />

      <div className="px-5 pt-6 pb-8">
        <div
          className="text-center text-[13px] mb-3"
          style={{ color: MUTED }}
        >
          После смены пароля сессии на других устройствах будут закрыты
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full h-[54px] rounded-[16px] border-0 text-[16px] font-semibold transition-opacity"
          style={
            canSubmit
              ? {
                  background: PRIMARY,
                  color: "#fff",
                  boxShadow: "0 8px 20px rgba(47,168,255,0.25)",
                  opacity: loading ? 0.7 : 1,
                }
              : {
                  background: BORDER,
                  color: "var(--c-muted-soft)",
                }
          }
        >
          {loading ? (
            <span
              className="inline-block w-[18px] h-[18px] rounded-full align-middle"
              style={{
                border: "2.5px solid rgba(255,255,255,0.4)",
                borderTopColor: "#fff",
                animation: "crm-spin 0.7s linear infinite",
              }}
            />
          ) : (
            "Обновить пароль"
          )}
        </button>
      </div>

      <style>{`@keyframes crm-spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  error?: string;
}) {
  return (
    <div>
      <div
        className="rounded-[18px] px-[18px] pt-3 pb-3"
        style={{
          background: SURFACE,
          border: `1px solid ${error ? "rgba(239,68,68,0.4)" : BORDER}`,
        }}
      >
        <div
          className="text-[11.5px] font-semibold uppercase tracking-[0.6px]"
          style={{ color: MUTED }}
        >
          {label}
        </div>
        <div className="mt-1 flex items-center gap-3">
          <input
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-transparent border-0 outline-none p-0 min-w-0 text-[17px]"
            style={{
              color: TEXT,
              letterSpacing: show || !value ? 0 : 2,
            }}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={onToggle}
            className="bg-transparent border-0 p-0 flex items-center shrink-0"
            style={{ color: MUTED }}
            aria-label={show ? "Скрыть пароль" : "Показать пароль"}
          >
            <EyeIcon open={show} />
          </button>
        </div>
      </div>
      {error && (
        <div
          className="text-[12px] mt-1 ml-1"
          style={{ color: DANGER }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
