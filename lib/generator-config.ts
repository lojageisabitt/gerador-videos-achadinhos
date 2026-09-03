import type { ColorConfig, ColorPreset, PhraseId, ProductContent, Speed } from "@/types/generator";

export const MAX_IMAGES = 10;
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const DEFAULT_COLORS: ColorConfig = { background: "#fff4e8", accent: "#ff5c35", text: "#272421" };
const LIGHT_COLOR_PRESETS: ColorPreset[] = [
  { name: "Pêssego", background: "#fff4e8", accent: "#ff5c35", text: "#272421" },
  { name: "Rosa blush", background: "#fff0f5", accent: "#e83e75", text: "#3a2330" },
  { name: "Lavanda", background: "#f3efff", accent: "#7957e8", text: "#28233a" },
  { name: "Menta", background: "#eafaf2", accent: "#0b9f6e", text: "#16382d" },
  { name: "Azul céu", background: "#ebf6ff", accent: "#2583e8", text: "#17304a" },
  { name: "Amarelo solar", background: "#fff8df", accent: "#e89b18", text: "#3d3018" },
  { name: "Coral", background: "#fff0ec", accent: "#f04f45", text: "#3c2422" },
  { name: "Sálvia", background: "#f1f7ec", accent: "#5c8a45", text: "#253421" },
  { name: "Baunilha", background: "#fff9e9", accent: "#d58a16", text: "#382e1e" },
  { name: "Lilás", background: "#f8eeff", accent: "#a34ed4", text: "#34223d" },
  { name: "Turquesa", background: "#eafbfa", accent: "#098c8c", text: "#153636" },
  { name: "Azul bebê", background: "#eff4ff", accent: "#5271d9", text: "#202c4b" },
  { name: "Rosé", background: "#fff2f0", accent: "#c85a67", text: "#40282d" },
  { name: "Terracota", background: "#fff3ea", accent: "#c86635", text: "#402a21" },
  { name: "Neutro", background: "#f7f4ef", accent: "#8a6a50", text: "#2e2925" },
];

const DARK_COLOR_PRESETS: ColorPreset[] = LIGHT_COLOR_PRESETS.map((preset) => ({
  name: `${preset.name} escuro`,
  background: preset.text,
  accent: preset.accent,
  text: preset.background,
}));

export const COLOR_PRESETS: ColorPreset[] = [...LIGHT_COLOR_PRESETS, ...DARK_COLOR_PRESETS];
export const SPEEDS: Array<{ value: Speed; label: string; seconds: number }> = [
  { value: "slow", label: "Lenta", seconds: 5.2 },
  { value: "normal", label: "Normal", seconds: 3.8 },
  { value: "fast", label: "Rápida", seconds: 2.5 },
];
export const getSlideDuration = (speed: Speed) => SPEEDS.find((item) => item.value === speed)?.seconds ?? 3.8;

export const DEFAULT_CONTENT: ProductContent = {
  phraseId: "daily-find",
  product: "Kit de divulgação de achadinhos",
  price: "R$ 29,90",
  benefit: "divulgar ofertas com rapidez",
  link: "",
  cta: "Veja aqui",
};

export const PHRASES: Array<{ id: PhraseId; name: string; badge: string; template: string }> = [
  { id: "daily-find", name: "Achado do dia", badge: "ACHADO DO DIA", template: "Achei [PRODUTO] por [PREÇO] e pode ser uma boa opção para quem busca [BENEFÍCIO]. Veja aqui: [LINK]" },
  { id: "quick-offer", name: "Oferta rápida", badge: "OFERTA RÁPIDA", template: "Olha esse achadinho: [PRODUTO] por [PREÇO]. Ideal para [BENEFÍCIO]. Link: [LINK]" },
];

export const getPhrase = (id: PhraseId) => PHRASES.find((phrase) => phrase.id === id) ?? PHRASES[0];
