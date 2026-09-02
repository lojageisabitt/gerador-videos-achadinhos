import type { ColorConfig, ColorPreset, Speed } from "@/types/generator";

export const MAX_IMAGES = 10;
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const DEFAULT_COLORS: ColorConfig = { background: "#fff4e8", accent: "#ff5c35", text: "#272421" };
export const COLOR_PRESETS: ColorPreset[] = [
  { name: "Pêssego", background: "#fff4e8", accent: "#ff5c35", text: "#272421" },
  { name: "Lavanda", background: "#f3efff", accent: "#7957e8", text: "#28233a" },
  { name: "Menta", background: "#eafaf2", accent: "#0b9f6e", text: "#16382d" },
  { name: "Noturno", background: "#19191d", accent: "#ffd058", text: "#ffffff" },
];
export const SPEEDS: Array<{ value: Speed; label: string; seconds: number }> = [
  { value: "slow", label: "Lenta", seconds: 5.2 },
  { value: "normal", label: "Normal", seconds: 3.8 },
  { value: "fast", label: "Rápida", seconds: 2.5 },
];
export const getSlideDuration = (speed: Speed) => SPEEDS.find((item) => item.value === speed)?.seconds ?? 3.8;
