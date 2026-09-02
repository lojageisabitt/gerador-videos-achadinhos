import { useRef, useState } from "react";
import Image from "next/image";
import { MAX_IMAGES } from "@/lib/generator-config";
import type { UploadedImage } from "@/types/generator";
import styles from "./VideoGenerator.module.css";

type Props = { images: UploadedImage[]; error: string; onAdd: (files: File[]) => void; onRemove: (id: string) => void; onMove: (from: number, to: number) => void };

export function ImageUploader({ images, error, onAdd, onRemove, onMove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const receive = (list: FileList | null) => list && onAdd(Array.from(list));
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeading}><div><span className={styles.step}>01</span><h2>Seus achadinhos</h2></div><span>{images.length}/{MAX_IMAGES}</span></div>
      <button type="button" className={`${styles.dropzone} ${dragging ? styles.dragging : ""}`} onClick={() => inputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(e) => { e.preventDefault(); setDragging(false); receive(e.dataTransfer.files); }}>
        <span className={styles.uploadIcon}>＋</span><strong>Adicione suas imagens</strong><small>Arraste ou clique · PNG, JPG, JPEG ou WebP</small><small>As imagens ficam somente neste dispositivo</small>
      </button>
      <input ref={inputRef} className={styles.hiddenInput} type="file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" multiple onChange={(e) => { receive(e.target.files); e.target.value = ""; }} />
      {error && <p className={styles.error} role="alert">{error}</p>}
      {images.length > 0 && <div className={styles.thumbnails}>
        {images.map((image, index) => <article className={styles.thumbnail} key={image.id}>
          <Image src={image.url} alt={`Imagem ${index + 1}: ${image.name}`} width={120} height={120} unoptimized />
          <span className={styles.order}>{index + 1}</span>
          <button type="button" className={styles.remove} onClick={() => onRemove(image.id)} aria-label={`Remover ${image.name}`}>×</button>
          <div className={styles.moveButtons}><button type="button" onClick={() => onMove(index, index - 1)} disabled={index === 0} aria-label="Mover para trás">←</button><button type="button" onClick={() => onMove(index, index + 1)} disabled={index === images.length - 1} aria-label="Mover para frente">→</button></div>
        </article>)}
      </div>}
    </section>
  );
}
