import { ACCEPTED_IMAGE_TYPES, MAX_IMAGES } from "./generator-config";

export function validateImages(files: File[], currentCount: number) {
  const availableSlots = MAX_IMAGES - currentCount;
  const validFiles = files.filter((file) => ACCEPTED_IMAGE_TYPES.includes(file.type));
  const valid = validFiles.slice(0, availableSlots);
  const invalidCount = files.length - validFiles.length;
  const overflowCount = Math.max(0, validFiles.length - availableSlots);
  let error = "";
  if (invalidCount) error = `${invalidCount} arquivo(s) ignorado(s). Use PNG, JPG, JPEG ou WebP.`;
  else if (overflowCount) error = `Você pode adicionar no máximo ${MAX_IMAGES} imagens.`;
  return { valid, error };
}
