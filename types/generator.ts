export type Speed = "slow" | "normal" | "fast";
export type AnimationStyle = "fluidShowcase" | "aurora" | "goldenCinema" | "neonPulse" | "spotlight" | "magicParticles" | "goldRain" | "lightStreaks" | "bokeh" | "starfield";
export type ColorConfig = { background: string; accent: string; text: string };
export type UploadedImage = { id: string; file: File; url: string; name: string };
export type ColorPreset = ColorConfig & { name: string };
export type PhraseId = "daily-find" | "quick-offer";
export type ProductContent = {
  phraseId: PhraseId;
  product: string;
  price: string;
  benefit: string;
  link: string;
  cta: string;
};
