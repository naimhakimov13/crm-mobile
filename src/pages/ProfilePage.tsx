import {
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useTheme, type ThemeTokens } from "../theme/ThemeContext";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  EditIcon,
  LogoutIcon,
} from "../components/Icon";

const MAX_BIO = 160;

function MailIcon({ color }: { color: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
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

function PhoneIcon({ color }: { color: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.66 2.62a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.46-1.23a2 2 0 0 1 2.11-.45c.84.32 1.72.54 2.62.66A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function GearIcon({ color }: { color: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
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

function MoonIcon({ color }: { color: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

function initials(seed: string) {
  return seed
    .replace(/["«»()]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const t = useTheme();

  const [name, setName] = useState(user?.name ?? "");
  const [position, setPosition] = useState(user?.position ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [twoFactor, setTwoFactor] = useState(user?.twoFactor ?? true);
  const [saved, setSaved] = useState(false);

  const displayName = name || user?.email || "Гость";
  const avatarLabel =
    initials(displayName) || displayName[0]?.toUpperCase() || "?";

  function handleSave() {
    updateUser({
      name: name.trim() || undefined,
      position: position.trim() || undefined,
      phone: phone.trim() || undefined,
      city: city.trim() || undefined,
      bio: bio.trim() || undefined,
      twoFactor,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div
      className="min-h-full flex flex-col relative"
      style={{ background: t.bg }}
    >
      <div className="flex items-center justify-between px-5 pt-6 pb-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full grid place-items-center active:scale-95 transition-transform"
          style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            color: t.text,
          }}
          aria-label="Назад"
        >
          <ChevronLeftIcon size={20} />
        </button>
        <div
          className="text-[16px] font-semibold tracking-[-0.2px]"
          style={{ color: t.text }}
        >
          Профиль
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="h-[34px] px-[14px] rounded-[10px] text-[14px] font-semibold bg-transparent border-0"
          style={{ color: t.primary }}
        >
          Готово
        </button>
      </div>

      <div className="px-5 pt-4 pb-2 text-center">
        <div className="inline-block relative mb-3.5">
          <div
            className="w-[96px] h-[96px] rounded-full flex items-center justify-center text-white text-[32px] font-bold"
            style={{
              background:
                "linear-gradient(135deg, hsl(220, 70%, 60%), hsl(220, 70%, 45%))",
              boxShadow: "0 16px 32px -10px rgba(31,80,200,0.45)",
            }}
          >
            {avatarLabel}
          </div>
          <button
            type="button"
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: t.primary,
              border: `3px solid ${t.bg}`,
              boxShadow: "0 4px 10px rgba(47,168,255,0.4)",
            }}
            aria-label="Изменить фотографию"
          >
            <EditIcon size={14} strokeWidth={2.2} style={{ color: "#fff" }} />
          </button>
        </div>
        <button
          type="button"
          className="block mx-auto text-[13px] font-medium bg-transparent border-0"
          style={{ color: t.primary }}
        >
          Изменить фотографию
        </button>
      </div>

      <Section t={t} title="Основное">
        <div className="flex flex-col gap-2">
          <FormField t={t} label="ФИО" value={name} onChange={setName} />
          <FormField
            t={t}
            label="Должность"
            value={position}
            onChange={setPosition}
          />
        </div>
      </Section>

      <Section t={t} title="Контакты">
        <div className="flex flex-col gap-2">
          <FormField
            t={t}
            label="E‑mail"
            type="email"
            value={email}
            onChange={setEmail}
            trailing={<MailIcon color={t.muted} />}
          />
          <FormField
            t={t}
            label="Телефон"
            type="tel"
            value={phone}
            onChange={setPhone}
            trailing={<PhoneIcon color={t.muted} />}
          />
          <FormField t={t} label="Город" value={city} onChange={setCity} />
        </div>
      </Section>

      <Section
        t={t}
        title="О себе"
        rightLabel={`${bio.length}/${MAX_BIO}`}
      >
        <FormField
          t={t}
          label="Заметка"
          value={bio}
          onChange={setBio}
          multiline
          maxLength={MAX_BIO}
        />
      </Section>

      <Section t={t} title="Внешний вид">
        <div
          className="rounded-[14px] overflow-hidden"
          style={{ background: t.surface, border: `1px solid ${t.border}` }}
        >
          <div className="px-4 py-3.5 flex items-center gap-3">
            <div
              className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center shrink-0"
              style={{ background: t.primaryFade }}
            >
              <MoonIcon color={t.primary} />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-[14.5px] font-semibold"
                style={{ color: t.text }}
              >
                Тёмная тема
              </div>
              <div
                className="text-[12px] mt-px"
                style={{ color: t.muted }}
              >
                {t.dark ? "Включена" : "Следует за системой по умолчанию"}
              </div>
            </div>
            <Toggle
              value={t.dark}
              onChange={t.setDark}
              activeColor={t.primary}
              trackColor={t.border}
              ariaLabel="Переключить тёмную тему"
            />
          </div>
        </div>
      </Section>

      <Section t={t} title="Безопасность">
        <div
          className="rounded-[14px] overflow-hidden"
          style={{ background: t.surface, border: `1px solid ${t.border}` }}
        >
          <button
            type="button"
            onClick={() => navigate("/change-password")}
            className="w-full bg-transparent border-0 px-4 py-3.5 flex items-center gap-3 text-left"
          >
            <div
              className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center shrink-0"
              style={{ background: t.primaryFade }}
            >
              <GearIcon color={t.primary} />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-[14.5px] font-semibold"
                style={{ color: t.text }}
              >
                Сменить пароль
              </div>
              <div className="text-[12px] mt-px" style={{ color: t.muted }}>
                Последнее изменение: 2 мес. назад
              </div>
            </div>
            <ChevronRightIcon
              size={16}
              strokeWidth={2}
              style={{ color: t.muted }}
            />
          </button>
          <div style={{ height: 1, background: t.border }} />
          <div className="px-4 py-3.5 flex items-center gap-3">
            <div
              className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center shrink-0"
              style={{ background: t.success + "1f" }}
            >
              <CheckIcon
                size={16}
                strokeWidth={2.4}
                style={{ color: t.success }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-[14.5px] font-semibold"
                style={{ color: t.text }}
              >
                Двухфакторная защита
              </div>
              <div
                className="text-[12px] mt-px truncate"
                style={{ color: t.muted }}
              >
                {twoFactor
                  ? `Включена · SMS на ${phone || "+7 … …22"}`
                  : "Отключена"}
              </div>
            </div>
            <Toggle
              value={twoFactor}
              onChange={setTwoFactor}
              activeColor={t.success}
              trackColor={t.border}
              ariaLabel="Двухфакторная защита"
            />
          </div>
        </div>
      </Section>

      <Section t={t} title="Аккаунт">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-[14px] px-4 py-3.5 flex items-center gap-3 text-left border-0"
          style={{ background: t.surface, border: `1px solid ${t.border}` }}
        >
          <div
            className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center shrink-0"
            style={{ background: t.danger + "1f" }}
          >
            <LogoutIcon size={16} strokeWidth={2} style={{ color: t.danger }} />
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="text-[14.5px] font-semibold"
              style={{ color: t.danger }}
            >
              Выйти из аккаунта
            </div>
            <div className="text-[12px] mt-px truncate" style={{ color: t.muted }}>
              {user?.email ?? "—"}
            </div>
          </div>
        </button>
      </Section>

      <div style={{ height: 28 }} />

      {saved && (
        <div
          className="absolute left-1/2 -translate-x-1/2 px-[18px] py-2.5 rounded-[12px] flex items-center gap-2 text-[13.5px] font-semibold"
          style={{
            top: 70,
            background: t.success,
            color: "#fff",
            boxShadow: `0 8px 24px ${t.success}40`,
            zIndex: 200,
          }}
        >
          <CheckIcon size={16} strokeWidth={2.6} style={{ color: "#fff" }} />
          Изменения сохранены
        </div>
      )}
    </div>
  );
}

function Toggle({
  value,
  onChange,
  activeColor,
  trackColor,
  ariaLabel,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  activeColor: string;
  trackColor: string;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="relative w-11 h-[26px] rounded-full transition-colors shrink-0"
      style={{ background: value ? activeColor : trackColor }}
      aria-pressed={value}
      aria-label={ariaLabel}
    >
      <span
        className="absolute top-0.5 w-[22px] h-[22px] rounded-full bg-white transition-all"
        style={{
          right: value ? 2 : "calc(100% - 24px)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}

function Section({
  t,
  title,
  rightLabel,
  children,
}: {
  t: ThemeTokens;
  title: string;
  rightLabel?: string;
  children: ReactNode;
}) {
  return (
    <div className="px-5 pt-5">
      <div
        className="flex justify-between items-baseline px-1 pb-2 text-[11.5px] font-semibold uppercase tracking-[0.6px]"
        style={{ color: t.muted }}
      >
        <span>{title}</span>
        {rightLabel && (
          <span
            className="font-medium normal-case"
            style={{ letterSpacing: 0 }}
          >
            {rightLabel}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function FormField({
  t,
  label,
  value,
  onChange,
  type = "text",
  trailing,
  multiline,
  maxLength,
}: {
  t: ThemeTokens;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "email" | "tel";
  trailing?: ReactNode;
  multiline?: boolean;
  maxLength?: number;
}) {
  const handle = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => onChange(e.target.value);

  return (
    <div
      className="rounded-[14px] px-[14px] py-2.5 flex flex-col gap-0.5"
      style={{ background: t.surface, border: `1px solid ${t.border}` }}
    >
      <div
        className="text-[11.5px] font-semibold uppercase tracking-[0.6px]"
        style={{ color: t.muted }}
      >
        {label}
      </div>
      <div className="flex items-center gap-2">
        {multiline ? (
          <textarea
            value={value}
            onChange={handle}
            maxLength={maxLength}
            rows={2}
            className="flex-1 bg-transparent border-0 outline-none p-0 min-w-0 text-[16px] resize-none"
            style={{ color: t.text }}
          />
        ) : (
          <input
            value={value}
            onChange={handle}
            type={type}
            className="flex-1 bg-transparent border-0 outline-none p-0 min-w-0 text-[16px]"
            style={{ color: t.text }}
          />
        )}
        {trailing && <span className="shrink-0">{trailing}</span>}
      </div>
    </div>
  );
}
