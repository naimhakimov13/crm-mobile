export const tokens = {
  colors: {
    brand: "#3FBDFF",
    brandSoft: "#88D6EF",
    brandTint: "#EAF7FF",
    ink: "#0E1726",
    inkMuted: "#5B6878",
    inkSoft: "#8893A4",
    surface: "#FFFFFF",
    surfaceMuted: "#F4F6FA",
    success: "#22C55E",
    danger: "#EF4444",
    warning: "#F59E0B",
  },
  radius: {
    card: 10,
    button: 10,
    pill: 999,
  },
  size: {
    btnHeight: 44,
    inputHeight: 44,
    iconBtn: 24,
    bottomNavHeight: 64,
  },
  gradient: {
    brand: "linear-gradient(135deg, #3FBDFF 0%, #1FA8FF 100%)",
  },
} as const;

export type Tokens = typeof tokens;
