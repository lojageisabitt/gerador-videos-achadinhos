"use client";

import { useRef, useState } from "react";
import { useImageUpload } from "@/hooks/use-image-upload";
import { DEFAULT_COLORS, DEFAULT_CONTENT } from "@/lib/generator-config";
import type { ColorConfig, ProductContent, Speed } from "@/types/generator";
import { ContentControls } from "./ContentControls";
import { ImageUploader } from "./ImageUploader";
import { StyleControls } from "./StyleControls";
import { VideoPreview } from "./VideoPreview";
import styles from "./VideoGenerator.module.css";

export function VideoGenerator() {
  const { images, error, addImages, removeImage, moveImage, clearImages } = useImageUpload();
  const [colors, setColors] = useState<ColorConfig>(DEFAULT_COLORS);
  const [speed, setSpeed] = useState<Speed>("normal");
  const [content, setContent] = useState<ProductContent>(DEFAULT_CONTENT);
  const [playKey, setPlayKey] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);
  const visualize = () => { setPlayKey((key) => key + 1); previewRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); };
  const reset = () => { clearImages(); setColors(DEFAULT_COLORS); setContent(DEFAULT_CONTENT); setSpeed("normal"); setPlayKey((key) => key + 1); };

  return <main className={styles.shell}>
    <header className={styles.header}><a className={styles.logo} href="#top" aria-label="Achadinhos Studio — início"><span>✦</span><div>achadinhos <b>studio</b></div></a><div className={styles.templateLabel}><span>Template 01</span><strong>Vitrine Automática</strong></div></header>
    <div className={styles.intro}><div><span className={styles.eyebrow}>GERADOR DE VÍDEOS</span><h1>Transforme seus achadinhos<br />em vídeos que <em>vendem.</em></h1></div><p>Monte uma vitrine vertical profissional em poucos cliques. Suas imagens nunca saem do seu dispositivo.</p></div>
    <div className={styles.workspace}>
      <div className={styles.panel}><ImageUploader images={images} error={error} onAdd={addImages} onRemove={removeImage} onMove={moveImage} /><StyleControls colors={colors} speed={speed} onColors={setColors} onSpeed={setSpeed} /><ContentControls content={content} onChange={setContent} />
        <div className={styles.actions}><button type="button" className={styles.primaryAction} onClick={visualize} disabled={!images.length}>▶ Visualizar</button><button type="button" className={styles.secondaryAction} onClick={reset}>↻ Reiniciar</button></div>
      </div>
      <div ref={previewRef}><VideoPreview key={playKey} images={images} colors={colors} speed={speed} content={content} /></div>
    </div>
    <footer className={styles.footer}><span>✦</span> Feito para quem encontra, indica e vende.</footer>
  </main>;
}
