import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeTokens = {
  primary: string;
  primaryFade: string;
  primaryFadeStrong: string;
  bg: string;
  surface: string;
  surface2: string;
  border: string;
  borderStrong: string;
  text: string;
  muted: string;
  mutedSoft: string;
  success: string;
  danger: string;
  warn: string;
  dark: boolean;
};

type ThemeContextValue = ThemeTokens & {
  setDark: (v: boolean) => void;
  toggleDark: () => void;
};

const PRIMARY_LIGHT = "#2FA8FF";
const PRIMARY_DARK = "#00D2E0";

function makeTokens({ dark }: { dark: boolean }): ThemeTokens {
  const primary = dark ? PRIMARY_DARK : PRIMARY_LIGHT;
  return {
    primary,
    primaryFade: primary + "1f",
    primaryFadeStrong: primary + "33",
    bg: dark ? "#0a0e14" : "#f4f6fa",
    surface: dark ? "#141a23" : "#ffffff",
    surface2: dark ? "#1b222c" : "#f9fafc",
    border: dark ? "#1f2933" : "#e7eaf0",
    borderStrong: dark ? "#2a323e" : "#dde1ea",
    text: dark ? "#f4f7fb" : "#0b1220",
    muted: dark ? "#8b95a5" : "#6b7280",
    mutedSoft: dark ? "#5b6473" : "#9aa3b2",
    success: dark ? "#34d399" : "#10b981",
    danger: dark ? "#f87171" : "#ef4444",
    warn: dark ? "#fbbf24" : "#f59e0b",
    dark,
  };
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "ff.theme.dark";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDarkState] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, dark ? "1" : "0");
    } catch {
      /* ignore */
    }
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    root.style.colorScheme = dark ? "dark" : "light";

    const tokens = makeTokens({ dark });
    const vars: Record<string, string> = {
      "--c-bg": tokens.bg,
      "--c-surface": tokens.surface,
      "--c-surface-2": tokens.surface2,
      "--c-border": tokens.border,
      "--c-border-strong": tokens.borderStrong,
      "--c-text": tokens.text,
      "--c-muted": tokens.muted,
      "--c-muted-soft": tokens.mutedSoft,
      "--c-primary": tokens.primary,
      "--c-primary-fade": tokens.primaryFade,
      "--c-primary-fade-strong": tokens.primaryFadeStrong,
      "--c-success": tokens.success,
      "--c-success-fade": tokens.success + "1f",
      "--c-danger": tokens.danger,
      "--c-danger-fade": tokens.danger + "1f",
      "--c-warn": tokens.warn,
      "--c-warn-fade": tokens.warn + "1f",
    };
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
  }, [dark]);

  const setDark = useCallback((v: boolean) => setDarkState(v), []);
  const toggleDark = useCallback(() => setDarkState((d) => !d), []);

  const value = useMemo<ThemeContextValue>(
    () => ({ ...makeTokens({ dark }), setDark, toggleDark }),
    [dark, setDark, toggleDark],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
