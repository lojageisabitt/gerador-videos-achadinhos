"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { validateImages } from "@/lib/image-validation";
import type { UploadedImage } from "@/types/generator";

export function useImageUpload() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [error, setError] = useState("");
  const imagesRef = useRef(images);
  useEffect(() => { imagesRef.current = images; }, [images]);
  useEffect(() => () => imagesRef.current.forEach((image) => URL.revokeObjectURL(image.url)), []);
  const addImages = useCallback((files: File[]) => {
    setImages((current) => {
      const result = validateImages(files, current.length);
      setError(result.error);
      return [...current, ...result.valid.map((file) => ({ id: `${file.name}-${crypto.randomUUID()}`, file, url: URL.createObjectURL(file), name: file.name }))];
    });
  }, []);
  const removeImage = useCallback((id: string) => {
    setImages((current) => {
      const removed = current.find((image) => image.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return current.filter((image) => image.id !== id);
    });
    setError("");
  }, []);
  const moveImage = useCallback((from: number, to: number) => {
    setImages((current) => {
      if (to < 0 || to >= current.length || from === to) return current;
      const next = [...current]; const [item] = next.splice(from, 1); next.splice(to, 0, item); return next;
    });
  }, []);
  const clearImages = useCallback(() => {
    setImages((current) => { current.forEach((image) => URL.revokeObjectURL(image.url)); return []; }); setError("");
  }, []);
  return { images, error, addImages, removeImage, moveImage, clearImages };
}
