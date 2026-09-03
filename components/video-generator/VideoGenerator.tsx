"use client";

import { useRef, useState } from "react";
import { useImageUpload } from "@/hooks/use-image-upload";
import { DEFAULT_ANIMATION, DEFAULT_COLORS, DEFAULT_CONTENT } from "@/lib/generator-config";
import { exportMp4 } from "@/lib/export-mp4";
import type { AnimationStyle, ColorConfig, ProductContent, Speed } from "@/types/generator";
import { ContentControls } from "./ContentControls";
import { ImageUploader } from "./ImageUploader";
import { StyleControls } from "./StyleControls";
import { VideoPreview } from "./VideoPreview";
import styles from "./VideoGenerator.module.css";

export function VideoGenerator() {
  const { images, error, addImages, removeImage, moveImage, clearImages } = useImageUpload();
  const [colors, setColors] = useState<ColorConfig>(DEFAULT_COLORS);
  const [speed, setSpeed] = useState<Speed>("normal");
  const [animation, setAnimation] = useState<AnimationStyle>(DEFAULT_ANIMATION);
  const [content, setContent] = useState<ProductContent>(DEFAULT_CONTENT);
  const [playKey, setPlayKey] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState("");
  const [exported, setExported] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const visualize = () => { setPlayKey((key) => key + 1); previewRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); };
  const reset = () => { clearImages(); setColors(DEFAULT_COLORS); setContent(DEFAULT_CONTENT); setSpeed("normal"); setAnimation(DEFAULT_ANIMATION); setPlayKey((key) => key + 1); };
  const downloadMp4 = async () => {
    setExporting(true); setExportProgress(0); setExportError(""); setExported(false);
    try { await exportMp4({ images, colors, content, speed, animation, onProgress: setExportProgress }); setExported(true); }
    catch (error) { setExportError(error instanceof Error ? error.message : "Não foi possível gerar o MP4."); }
    finally { setExporting(false); }
  };

  return <main className={styles.shell}>
    <header className={styles.header}><a className={styles.logo} href="#top" aria-label="Achadinhos Studio — início"><span>✦</span><div>achadinhos <b>studio</b></div></a><div className={styles.templateLabel}><span>Template 01</span><strong>Vitrine Automática</strong></div></header>
    <div className={styles.intro}><div><span className={styles.eyebrow}>GERADOR DE VÍDEOS</span><h1>Transforme seus achadinhos<br />em vídeos que <em>vendem.</em></h1></div><p>Monte uma vitrine vertical profissional em poucos cliques. Suas imagens nunca saem do seu dispositivo.</p></div>
    <div className={styles.workspace}>
      <div className={styles.panel}><ImageUploader images={images} error={error} onAdd={addImages} onRemove={removeImage} onMove={moveImage} /><StyleControls colors={colors} speed={speed} animation={animation} onColors={setColors} onSpeed={setSpeed} onAnimation={setAnimation} /><ContentControls content={content} onChange={setContent} />
        {exportError && <p className={styles.exportError} role="alert">{exportError}</p>}
        <div className={styles.actions}><button type="button" className={styles.primaryAction} onClick={visualize} disabled={!images.length || exporting}>▶ Visualizar</button><button type="button" className={styles.exportAction} onClick={downloadMp4} disabled={!images.length || exporting}>{exporting ? `Gerando ${Math.round(exportProgress * 100)}%` : exported ? "✓ MP4 baixado" : "↓ Baixar MP4"}</button><button type="button" className={styles.secondaryAction} onClick={reset} disabled={exporting}>↻ Reiniciar</button></div>
      </div>
      <div ref={previewRef}><VideoPreview key={playKey} images={images} colors={colors} speed={speed} content={content} animation={animation} /></div>
    </div>
    <footer className={styles.footer}><span>✦</span> Feito para quem encontra, indica e vende.</footer>
  </main>;
}
