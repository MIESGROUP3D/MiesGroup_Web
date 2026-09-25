/**
 * Política de privacidad — contenido.
 *
 * ⚠ BORRADOR para el mockup: lo debe revisar y completar el asesor legal del
 * cliente (Ley 1581 de 2012 y Decreto 1377 de 2013, Colombia). Lo marcado
 * con ⚠ en la página está por confirmar con el cliente.
 *
 * REGLA: cada vez que el sitio empiece a usar un servicio externo que reciba
 * datos de los visitantes (hosting, correo, analítica, IA, pagos…), agregarlo
 * a `thirdParties` en el MISMO cambio.
 */

export const privacyUpdated = "2026-09-25";

/** Datos que el sitio recoge */
export const collectedData = [
  {
    what: "Formulario de contacto",
    detail: "Nombre, correo, teléfono o WhatsApp, tipo de proyecto y el mensaje que escribas.",
  },
  {
    what: "Datos técnicos de acceso",
    detail: "Dirección IP, navegador y páginas visitadas quedan en los registros del proveedor de hosting, como en cualquier sitio web.",
  },
  {
    what: "Almacenamiento en tu navegador",
    detail:
      "Una sola marca en sessionStorage para no repetir la animación de entrada. No te identifica y se borra al cerrar la pestaña. No usamos cookies ni herramientas de analítica o publicidad.",
  },
];

/** Para qué se usan */
export const purposes = [
  "Responder tu solicitud y enviarte una cotización.",
  "Dar seguimiento comercial a tu proyecto, solo si nos escribiste.",
  "Nunca vendemos ni cedemos tus datos a terceros para publicidad.",
];

/**
 * Servicios externos que reciben datos de los visitantes.
 * `when`: en qué momento reciben datos (varios solo si el visitante lo decide).
 */
export const thirdParties = [
  {
    name: "GitHub Pages (GitHub, Inc.)",
    use: "Aloja el sitio.",
    when: "Al visitar cualquier página: recibe datos técnicos de acceso (IP, navegador).",
    policy: "https://docs.github.com/es/site-policy/privacy-policies/github-general-privacy-statement",
  },
  {
    name: "Vimeo",
    use: "Reproduce los videos del estudio.",
    when: "Solo cuando pulsas reproducir en un video de Vimeo (se carga con la opción “no rastrear”).",
    policy: "https://vimeo.com/privacy",
  },
  {
    name: "YouTube (Google)",
    use: "Reproduce videos del canal.",
    when: "Solo cuando pulsas reproducir; se usa el modo de privacidad mejorada (youtube-nocookie.com).",
    policy: "https://policies.google.com/privacy",
  },
  {
    name: "WhatsApp (Meta)",
    use: "Chat directo con el estudio.",
    when: "Solo si eliges escribirnos por WhatsApp.",
    policy: "https://www.whatsapp.com/legal/privacy-policy",
  },
  {
    name: "Instagram (Meta) y LinkedIn",
    use: "Perfiles del estudio en redes sociales.",
    when: "Solo si abres esos enlaces; el sitio no carga sus botones ni rastreadores.",
    policy: "https://privacycenter.instagram.com/policy",
  },
];

/** Derechos del titular (Ley 1581 de 2012, art. 8) */
export const rights = [
  "Conocer, actualizar y rectificar tus datos.",
  "Pedir prueba de la autorización que nos diste.",
  "Saber qué uso le hemos dado a tus datos.",
  "Revocar la autorización y pedir que borremos tus datos.",
  "Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).",
];
