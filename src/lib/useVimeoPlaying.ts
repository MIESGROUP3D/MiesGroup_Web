"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * true cuando el reproductor de Vimeo de ese iframe ya está reproduciendo
 * (API de postMessage del reproductor: evento "ready" → se suscribe a "play").
 * Sirve para dejar el iframe invisible hasta entonces: mientras carga, Vimeo
 * muestra un fondo negro con un indicador de carga que taparía la miniatura.
 */
export function useVimeoPlaying(ref: RefObject<HTMLIFrameElement | null>, active = true) {
  const [playing, setPlaying] = useState(false);
  // al desmontar/volver a montar el iframe se reinicia (patrón "ajustar durante el render")
  const [wasActive, setWasActive] = useState(active);
  if (wasActive !== active) {
    setWasActive(active);
    if (!active) setPlaying(false);
  }

  useEffect(() => {
    if (!active) return;
    const onMessage = (e: MessageEvent) => {
      const frame = ref.current;
      if (!frame || e.source !== frame.contentWindow || !e.origin.endsWith("vimeo.com")) return;
      let data: { event?: string } = {};
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (data.event === "ready") {
        for (const value of ["play", "playProgress"]) frame.contentWindow?.postMessage(JSON.stringify({ method: "addEventListener", value }), "https://player.vimeo.com");
      }
      if (data.event === "play" || data.event === "playProgress") setPlaying(true);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [ref, active]);

  return playing;
}
