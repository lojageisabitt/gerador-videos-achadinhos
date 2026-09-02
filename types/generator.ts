export type Speed = "slow" | "normal" | "fast";
export type ColorConfig = { background: string; accent: string; text: string };
export type UploadedImage = { id: string; file: File; url: string; name: string };
export type ColorPreset = ColorConfig & { name: string };
