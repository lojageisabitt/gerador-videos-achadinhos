import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getSlideDuration } from "@/lib/generator-config";
import type { ColorConfig, Speed, UploadedImage } from "@/types/generator";
import styles from "./VideoGenerator.module.css";

type Props = { images: UploadedImage[]; colors: ColorConfig; speed: Speed };

export function VideoPreview({ images, colors, speed }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const duration = getSlideDuration(speed);
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % images.length), duration * 1000);
    return () => window.clearInterval(timer);
  }, [images.length, duration]);
  const visibleIndex = images.length ? activeIndex % images.length : 0;

  const fullscreen = async () => { if (frameRef.current?.requestFullscreen) await frameRef.current.requestFullscreen(); };
  return <section className={styles.previewColumn}>
    <div className={styles.previewTop}><div><span className={styles.liveDot} /> PREVIEW AO VIVO</div><span>9:16 · 1080 × 1920</span></div>
    <div ref={frameRef} className={styles.phoneFrame} style={{ "--video-bg": colors.background, "--video-accent": colors.accent, "--video-text": colors.text, "--slide-duration": `${duration}s` } as React.CSSProperties}>
      <div className={styles.ambient}><span /><span /><span /></div>
      <div className={styles.videoBadge}>ACHADINHO DO DIA</div>
      {images.length === 0 ? <div className={styles.emptyPreview}><div className={styles.bagIcon}>♡</div><strong>Seu vídeo começa aqui</strong><span>Adicione de 1 a 10 imagens para visualizar</span></div> : images.map((image, index) => (
        <div key={image.id} className={`${styles.slide} ${index === visibleIndex ? styles.activeSlide : ""} ${styles[`entrance${index % 5}`]}`} aria-hidden={index !== visibleIndex}>
          <div className={styles.productCard}><Image src={image.url} alt={`Produto ${index + 1}`} width={520} height={720} unoptimized /></div>
          <div className={styles.caption}><small>VOCÊ VAI AMAR</small><strong>Achadinho imperdível!</strong><span>Olha só esse produto ✦</span></div>
        </div>
      ))}
      {images.length > 0 && <div className={styles.progress}>{images.map((image, index) => <i key={image.id} className={index === visibleIndex ? styles.currentProgress : ""} />)}</div>}
      <button type="button" className={styles.inFrameFullscreen} onClick={fullscreen} aria-label="Abrir preview em tela cheia">⛶</button>
    </div>
    <p className={styles.previewHint}>A prévia se repete automaticamente em loop</p>
  </section>;
}
