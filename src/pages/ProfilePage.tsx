import { useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  ChevronLeftIcon,
  EditIcon,
  CheckIcon,
  LogoutIcon,
} from "../components/Icon";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [position, setPosition] = useState(user?.position ?? "");

  const initial = (user?.name || user?.email || "Г")[0].toUpperCase();
  const displayName = user?.name || user?.email || "Гость";

  function startEdit() {
    setName(user?.name ?? "");
    setPhone(user?.phone ?? "");
    setPosition(user?.position ?? "");
    setEditing(true);
  }

  function handleSave(e: FormEvent) {
    e.preventDefault();
    updateUser({
      name: name.trim() || undefined,
      phone: phone.trim() || undefined,
      position: position.trim() || undefined,
    });
    setEditing(false);
  }

  function handleCancel() {
    setEditing(false);
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div>
      <div className="px-4 pt-6">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 grid place-items-center rounded-full bg-white/70 backdrop-blur-xl border border-white/60 text-ink-700 active:scale-95 transition shadow-[0_4px_12px_-4px_rgba(14,23,38,0.15)]"
            aria-label="Назад"
          >
            <ChevronLeftIcon size={20} />
          </button>
          <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-[0.18em]">
            Профиль
          </div>
          {editing ? (
            <button
              type="submit"
              form="profile-form"
              className="w-10 h-10 grid place-items-center rounded-full bg-brand-grad text-white active:scale-95 transition shadow-[0_8px_18px_-6px_rgba(31,144,224,0.55)]"
              aria-label="Сохранить"
            >
              <CheckIcon size={20} />
            </button>
          ) : (
            <button
              type="button"
              onClick={startEdit}
              className="w-10 h-10 grid place-items-center rounded-full bg-white/70 backdrop-blur-xl border border-white/60 text-ink-700 active:scale-95 transition shadow-[0_4px_12px_-4px_rgba(14,23,38,0.15)]"
              aria-label="Редактировать"
            >
              <EditIcon size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 mt-8 flex flex-col items-center text-center">
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-0 -m-3 rounded-full blur-2xl opacity-50"
            style={{
              background:
                "radial-gradient(circle, rgba(63,189,255,0.55) 0%, rgba(63,189,255,0) 70%)",
            }}
          />
          <div
            className="relative w-24 h-24 rounded-full bg-brand-grad text-white grid place-items-center text-3xl font-bold"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.6), 0 14px 32px -10px rgba(31,144,224,0.6), 0 4px 12px rgba(14,23,38,0.12)",
            }}
          >
            {initial}
          </div>
        </div>
        <div className="mt-4 text-[22px] font-semibold text-ink-900 tracking-tight truncate max-w-full">
          {displayName}
        </div>
        {user?.position && !editing && (
          <div className="text-sm text-ink-500 mt-1">{user.position}</div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 md:px-3">
        <section>
          <div className="card">
            {editing ? (
              <form
                id="profile-form"
                onSubmit={handleSave}
                className="flex flex-col gap-3"
              >
                <Field label="Имя">
                  <input
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя"
                  />
                </Field>
                <Field label="Должность">
                  <input
                    className="input"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Менеджер"
                  />
                </Field>
                <Field label="Телефон">
                  <input
                    className="input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+992 ..."
                  />
                </Field>
                <Field label="Email">
                  <input
                    className="input opacity-70"
                    value={user?.email ?? ""}
                    disabled
                  />
                </Field>
                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-glass flex-1"
                  >
                    Отмена
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Сохранить
                  </button>
                </div>
              </form>
            ) : (
              <ul className="flex flex-col">
                <InfoRow label="Имя" value={user?.name} placeholder="Не указано" />
                <InfoRow
                  label="Должность"
                  value={user?.position}
                  placeholder="Не указана"
                />
                <InfoRow
                  label="Телефон"
                  value={user?.phone}
                  placeholder="Не указан"
                />
                <InfoRow label="Email" value={user?.email} last />
              </ul>
            )}
          </div>
        </section>

        {!editing && (
          <section>
            <div className="card">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-between py-1 text-danger"
              >
                <span className="flex items-center gap-2.5">
                  <LogoutIcon size={18} />
                  <span className="font-medium">Выйти из аккаунта</span>
                </span>
                <span className="text-ink-400 text-xs">
                  {user?.email ?? ""}
                </span>
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium text-ink-500 uppercase tracking-wider">
        {label}
      </span>
      {children}
    </label>
  );
}

function InfoRow({
  label,
  value,
  placeholder,
  last,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  last?: boolean;
}) {
  return (
    <li
      className={`flex items-center justify-between gap-3 py-3 ${
        last ? "" : "border-b border-ink-300/30"
      }`}
    >
      <span className="text-sm text-ink-500">{label}</span>
      <span
        className={`text-sm font-medium truncate text-right ${
          value ? "text-ink-900" : "text-ink-400"
        }`}
      >
        {value || placeholder || "—"}
      </span>
    </li>
  );
}
