import { PHRASES } from "@/lib/generator-config";
import type { ProductContent } from "@/types/generator";
import styles from "./VideoGenerator.module.css";

type Props = { content: ProductContent; onChange: (content: ProductContent) => void };

export function ContentControls({ content, onChange }: Props) {
  const update = <K extends keyof ProductContent>(key: K, value: ProductContent[K]) => onChange({ ...content, [key]: value });
  return <section className={styles.section}>
    <div className={styles.sectionHeading}><div><span className={styles.step}>03</span><h2>Texto da oferta</h2></div></div>
    <label className={styles.label}>Escolha a frase</label>
    <div className={styles.phraseOptions}>{PHRASES.map((phrase) => <button type="button" key={phrase.id} className={content.phraseId === phrase.id ? styles.activePhrase : ""} onClick={() => update("phraseId", phrase.id)}><strong>{phrase.name}</strong><span>{phrase.template}</span></button>)}</div>
    <div className={styles.contentGrid}>
      <label><span>Nome do produto</span><input value={content.product} onChange={(e) => update("product", e.target.value)} placeholder="Ex.: Fone Bluetooth" maxLength={55} /></label>
      <label><span>Preço</span><input value={content.price} onChange={(e) => update("price", e.target.value)} placeholder="Ex.: R$ 49,90" maxLength={20} /></label>
      <label className={styles.wideField}><span>Benefício</span><input value={content.benefit} onChange={(e) => update("benefit", e.target.value)} placeholder="Ex.: ouvir música em qualquer lugar" maxLength={70} /></label>
      <label><span>Texto do botão (CTA)</span><input value={content.cta} onChange={(e) => update("cta", e.target.value)} placeholder="Ex.: Veja aqui" maxLength={24} /></label>
      <label><span>Link</span><input type="url" value={content.link} onChange={(e) => update("link", e.target.value)} placeholder="https://..." /></label>
    </div>
  </section>;
}
