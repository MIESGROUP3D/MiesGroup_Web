"use client";

import { useEffect } from "react";
import { useLang } from "@/lib/useLang";

/**
 * Mantiene <html lang> al día según la página (es / en). El HTML estático
 * sale con lang="es"; cada vista además marca su contenido con lang={lang},
 * así buscadores y lectores de pantalla ya ven el idioma correcto sin JS.
 */
export function HtmlLang() {
  const lang = useLang();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
