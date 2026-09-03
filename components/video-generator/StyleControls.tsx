import { ANIMATION_STYLES, COLOR_PRESETS, SPEEDS } from "@/lib/generator-config";
import type { AnimationStyle, ColorConfig, Speed } from "@/types/generator";
import styles from "./VideoGenerator.module.css";

type Props = { colors: ColorConfig; speed: Speed; animation: AnimationStyle; onColors: (colors: ColorConfig) => void; onSpeed: (speed: Speed) => void; onAnimation: (animation: AnimationStyle) => void };

export function StyleControls({ colors, speed, animation, onColors, onSpeed, onAnimation }: Props) {
  const colorFields: Array<{ key: keyof ColorConfig; label: string }> = [{ key: "background", label: "Fundo" }, { key: "accent", label: "Destaque" }, { key: "text", label: "Texto" }];
  return <section className={styles.section}>
    <div className={styles.sectionHeading}><div><span className={styles.step}>02</span><h2>Estilo do vídeo</h2></div></div>
    <label className={styles.label}>30 paletas prontas · claras e escuras</label>
    <div className={styles.presets}>{COLOR_PRESETS.map((preset) => <button type="button" key={preset.name} className={`${styles.preset} ${colors.background === preset.background && colors.accent === preset.accent ? styles.activePreset : ""}`} onClick={() => onColors(preset)} aria-label={`Usar paleta ${preset.name}`} title={preset.name}><i style={{ background: preset.background }} /><i style={{ background: preset.accent }} /><i style={{ background: preset.text }} /></button>)}</div>
    <div className={styles.colorGrid}>{colorFields.map(({ key, label }) => <label className={styles.colorField} key={key}><span>{label}</span><span className={styles.colorInput}><input type="color" value={colors[key]} onChange={(e) => onColors({ ...colors, [key]: e.target.value })} /><code>{colors[key].toUpperCase()}</code></span></label>)}</div>
    <label className={styles.label}>Velocidade</label>
    <div className={styles.segmented}>{SPEEDS.map((item) => <button type="button" key={item.value} className={speed === item.value ? styles.activeSegment : ""} onClick={() => onSpeed(item.value)}>{item.label}</button>)}</div>
    <label className={styles.label}>Animação cinematográfica</label>
    <div className={styles.animationGrid}>{ANIMATION_STYLES.map((item) => <button type="button" key={item.value} className={animation === item.value ? styles.activeAnimation : ""} onClick={() => onAnimation(item.value)} aria-pressed={animation === item.value}><i>{item.icon}</i><span>{item.description}</span></button>)}</div>
  </section>;
}
