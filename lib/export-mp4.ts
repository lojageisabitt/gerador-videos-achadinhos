import type { ColorConfig, ProductContent, Speed, UploadedImage } from "@/types/generator";
import { getPhrase, getSlideDuration } from "./generator-config";

type ExportOptions = {
  images: UploadedImage[];
  colors: ColorConfig;
  content: ProductContent;
  speed: Speed;
  onProgress: (progress: number) => void;
};

const WIDTH = 720;
const HEIGHT = 1280;
const FPS = 24;

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

function drawCenteredText(ctx: CanvasRenderingContext2D, text: string, y: number, maxWidth: number, lineHeight: number, maxLines = 2) {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; }
    else line = test;
  }
  if (line) lines.push(line);
  lines.slice(0, maxLines).forEach((item, index) => ctx.fillText(item, WIDTH / 2, y + index * lineHeight));
  return Math.min(lines.length, maxLines) * lineHeight;
}

type ExportImage = { source: HTMLImageElement; width: number; height: number };

async function loadExportImage(file: File): Promise<ExportImage> {
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = "async";
  image.src = url;
  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error(`Não foi possível abrir a imagem ${file.name}.`));
      if (image.complete && image.naturalWidth > 0) resolve();
    });
    return { source: image, width: image.naturalWidth, height: image.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function drawFrame(ctx: CanvasRenderingContext2D, image: ExportImage, index: number, time: number, slideTime: number, colors: ColorConfig, content: ProductContent) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const wave = time * 1.25;
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = colors.accent;
  ctx.beginPath(); ctx.ellipse(590 + Math.sin(wave) * 65, 80 + Math.cos(wave) * 30, 265, 145, -.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(-15 + Math.sin(wave * .75) * 40, 900 + Math.cos(wave) * 60, 180, 0, Math.PI * 2); ctx.fill();
  ctx.translate(560 + Math.sin(wave * .55) * 95, 1110 + Math.cos(wave) * 30); ctx.rotate(-.45); ctx.fillRect(-90, -24, 260, 48);
  ctx.restore();

  const phrase = getPhrase(content.phraseId);
  ctx.save();
  ctx.font = "800 18px Arial";
  ctx.textAlign = "center";
  const badgeWidth = Math.max(190, ctx.measureText(phrase.badge).width + 54);
  roundedRect(ctx, (WIDTH - badgeWidth) / 2, 63, badgeWidth, 54, 27);
  ctx.fillStyle = colors.accent; ctx.fill();
  ctx.fillStyle = colors.background; ctx.textBaseline = "middle"; ctx.fillText(phrase.badge, WIDTH / 2, 90);
  ctx.restore();

  const box = { x: 45, y: 150, width: 630, height: 635 };
  const scale = Math.min(box.width / image.width, box.height / image.height);
  const baseWidth = image.width * scale;
  const baseHeight = image.height * scale;
  let imageScale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let opacity = 1;
  const entrance = Math.min(1, slideTime / .55);
  const eased = 1 - Math.pow(1 - entrance, 3);
  if (index % 5 === 0) { offsetY = (1 - eased) * 120; opacity = eased; }
  if (index % 5 === 1) { offsetX = (1 - eased) * 220; opacity = eased; }
  if (index % 5 === 2) { imageScale = .72 + eased * .28; opacity = eased; }
  if (index % 5 === 3) { offsetY = -(1 - eased) * 110; opacity = eased; }
  if (index % 5 === 4) { imageScale = .88 + eased * .12; opacity = eased; }
  const drawWidth = baseWidth * imageScale;
  const drawHeight = baseHeight * imageScale;
  const drawX = box.x + (box.width - drawWidth) / 2 + offsetX;
  const drawY = box.y + (box.height - drawHeight) / 2 + offsetY;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.shadowColor = "rgba(0,0,0,.16)"; ctx.shadowBlur = 28; ctx.shadowOffsetY = 16;
  roundedRect(ctx, drawX, drawY, drawWidth, drawHeight, 30); ctx.clip();
  ctx.drawImage(image.source, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = colors.text;
  ctx.font = "700 36px Georgia";
  const titleHeight = drawCenteredText(ctx, content.product || "Seu produto", 830, 620, 40, 2);
  let textY = 830 + titleHeight + 3;
  ctx.fillStyle = colors.accent; ctx.font = "800 31px Arial"; ctx.fillText(content.price || "Preço especial", WIDTH / 2, textY);
  textY += 48;
  const benefit = content.phraseId === "daily-find" ? `Pode ser uma boa opção para quem busca ${content.benefit || "praticidade"}.` : `Ideal para ${content.benefit || "facilitar seu dia"}.`;
  ctx.fillStyle = colors.text; ctx.globalAlpha = .82; ctx.font = "400 18px Arial";
  const benefitHeight = drawCenteredText(ctx, benefit, textY, 610, 25, 2);
  ctx.globalAlpha = 1;
  textY += benefitHeight + 18;
  roundedRect(ctx, 70, textY, 580, 66, 33); ctx.fillStyle = colors.accent; ctx.fill();
  ctx.fillStyle = colors.background; ctx.font = "800 19px Arial"; ctx.textBaseline = "middle"; ctx.fillText(`${content.cta || "Veja aqui"}  →`, WIDTH / 2, textY + 33);
}

export async function exportMp4({ images, colors, content, speed, onProgress }: ExportOptions) {
  if (!images.length) throw new Error("Adicione pelo menos uma imagem antes de exportar.");
  const { BufferTarget, CanvasSource, Mp4OutputFormat, Output, Quality, canEncodeVideo } = await import("mediabunny");
  if (!(await canEncodeVideo("avc", { width: WIDTH, height: HEIGHT }))) throw new Error("Este navegador não oferece codificação MP4/H.264. Use a versão atual do Chrome ou Edge.");
  const exportImages = await Promise.all(images.map((image) => loadExportImage(image.file)));
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH; canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Não foi possível preparar o vídeo neste navegador.");
  const target = new BufferTarget();
  const output = new Output({ format: new Mp4OutputFormat({ fastStart: "in-memory" }), target });
  const source = new CanvasSource(canvas, { codec: "avc", quality: new Quality("high") });
  output.addVideoTrack(source, { name: "Achadinhos Studio", languageCode: "por" });
  output.setMetadataTags({ title: content.product || "Vídeo de achadinho", artist: "Achadinhos Studio" });
  const secondsPerSlide = getSlideDuration(speed);
  const totalDuration = secondsPerSlide * images.length;
  const totalFrames = Math.ceil(totalDuration * FPS);
  try {
    await output.start();
    for (let frame = 0; frame < totalFrames; frame++) {
      const time = frame / FPS;
      const imageIndex = Math.min(images.length - 1, Math.floor(time / secondsPerSlide));
      drawFrame(ctx, exportImages[imageIndex], imageIndex, time, time % secondsPerSlide, colors, content);
      await source.add(time, 1 / FPS, { keyFrame: frame % (FPS * 2) === 0 });
      if (frame % 3 === 0) onProgress((frame + 1) / totalFrames);
    }
    await output.finalize();
    if (!target.buffer) throw new Error("O arquivo MP4 não pôde ser finalizado.");
    const url = URL.createObjectURL(new Blob([target.buffer], { type: "video/mp4" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `achadinho-${Date.now()}.mp4`;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
    onProgress(1);
  } finally {
    exportImages.forEach((image) => { image.source.src = ""; });
  }
}
