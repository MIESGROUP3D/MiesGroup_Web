import type { Locale } from "@/lib/i18n";

/**
 * Política de privacidad — contenido en español e inglés.
 *
 * ⚠ BORRADOR para el mockup: lo debe revisar y completar el asesor legal del
 * cliente (Ley 1581 de 2012 y Decreto 1377 de 2013, Colombia). Lo marcado
 * con ⚠ en la página está por confirmar con el cliente. La versión en inglés
 * es una traducción de trabajo.
 *
 * REGLA: cada vez que el sitio empiece a usar un servicio externo que reciba
 * datos de los visitantes (hosting, correo, analítica, IA, pagos…), agregarlo
 * a `thirdParties` en los DOS idiomas en el MISMO cambio.
 */

export const privacyUpdated = "2026-09-25";

type ThirdParty = { name: string; use: string; when: string; policy: string };

const policies = {
  github: "https://docs.github.com/es/site-policy/privacy-policies/github-general-privacy-statement",
  vimeo: "https://vimeo.com/privacy",
  google: "https://policies.google.com/privacy",
  whatsapp: "https://www.whatsapp.com/legal/privacy-policy",
  instagram: "https://privacycenter.instagram.com/policy",
};

const es = {
  title: "Privacidad y datos",
  metaTitle: "Política de privacidad y datos",
  description: "Qué datos recoge el sitio de MIES Group, para qué, con qué servicios externos y cómo pedir que los borremos.",
  intro: "Qué datos recoge este sitio, para qué los usamos, quién más los recibe y cómo pedir que los borremos.",
  draft: (company: string, date: string) =>
    `⚠ Borrador provisional: debe revisarlo el asesor legal de ${company} (Ley 1581 de 2012 y Decreto 1377 de 2013). Última actualización: ${date}.`,
  s1: "1. Responsable",
  hq: (company: string, city: string, country: string): [string, string] => [company, `, con sede principal en ${city}, ${country}. Contacto para temas de datos: `],
  s2: "2. Qué datos recogemos",
  collected: [
    { what: "Formulario de contacto", detail: "Nombre, correo, teléfono o WhatsApp, tipo de proyecto y el mensaje que escribas." },
    { what: "Datos técnicos de acceso", detail: "Dirección IP, navegador y páginas visitadas quedan en los registros del proveedor de hosting, como en cualquier sitio web." },
    {
      what: "Almacenamiento en tu navegador",
      detail:
        "Una sola marca en sessionStorage para no repetir la animación de entrada. No te identifica y se borra al cerrar la pestaña. No usamos cookies ni herramientas de analítica o publicidad.",
    },
  ],
  onlyNeeded: "Solo pedimos lo necesario para responderte. Los datos del formulario los recogemos únicamente con tu autorización (la casilla que marcas antes de enviar).",
  s3: "3. Para qué los usamos",
  purposes: [
    "Responder tu solicitud y enviarte una cotización.",
    "Dar seguimiento comercial a tu proyecto, solo si nos escribiste.",
    "Nunca vendemos ni cedemos tus datos a terceros para publicidad.",
  ],
  retention: "Los conservamos mientras dure la conversación o la relación comercial y luego los borramos.",
  retentionPending: "⚠ Plazo exacto por confirmar con el cliente.",
  s4: "4. Inteligencia artificial",
  aiBefore: (name: string) => `${name} ofrece servicios de inteligencia artificial a sus clientes, pero `,
  aiStrong: "este sitio no usa IA para procesar tus datos personales",
  aiAfter: ": lo que envías no se entrega a ningún modelo ni servicio de IA. Si eso cambia, lo indicaremos aquí y junto al formulario, con el nombre del proveedor.",
  s5: "5. Servicios externos que reciben datos",
  thirdIntro: "Estos terceros intervienen en el funcionamiento del sitio. Varios solo reciben datos si tú decides usarlos.",
  theirPolicy: "Su política de privacidad",
  thirdParties: [
    { name: "GitHub Pages (GitHub, Inc.)", use: "Aloja el sitio.", when: "Al visitar cualquier página: recibe datos técnicos de acceso (IP, navegador).", policy: policies.github },
    { name: "Vimeo", use: "Reproduce los videos del estudio.", when: "Solo cuando pulsas reproducir en un video de Vimeo (se carga con la opción “no rastrear”).", policy: policies.vimeo },
    { name: "YouTube (Google)", use: "Reproduce videos del canal.", when: "Solo cuando pulsas reproducir; se usa el modo de privacidad mejorada (youtube-nocookie.com).", policy: policies.google },
    { name: "WhatsApp (Meta)", use: "Chat directo con el estudio.", when: "Solo si eliges escribirnos por WhatsApp.", policy: policies.whatsapp },
    { name: "Instagram (Meta) y LinkedIn", use: "Perfiles del estudio en redes sociales.", when: "Solo si abres esos enlaces; el sitio no carga sus botones ni rastreadores.", policy: policies.instagram },
  ] as ThirdParty[],
  s6: "6. Tus derechos",
  rights: [
    "Conocer, actualizar y rectificar tus datos.",
    "Pedir prueba de la autorización que nos diste.",
    "Saber qué uso le hemos dado a tus datos.",
    "Revocar la autorización y pedir que borremos tus datos.",
    "Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).",
  ],
  writeUs: "Escríbenos a",
  deadlines: ". Respondemos consultas en máximo 10 días hábiles y reclamos en máximo 15 días hábiles.",
  s7: "7. Borrar tus datos",
  deleteBefore: "Este sitio no tiene cuentas de usuario: tus datos solo existen si nos escribiste. Puedes pedir que borremos ",
  deleteStrong: "todos",
  deleteAfter: " tus datos cuando quieras, incluidos los que estén en los servicios anteriores cuando dependan de nosotros.",
  deleteCta: "Pedir el borrado de mis datos →",
  deleteSubject: "Solicitud de eliminación de datos personales",
  deleteBody: "Hola MIES Group, solicito eliminar todos mis datos personales.\n\nNombre:\nCorreo o teléfono con el que los envié:\n",
  dateLocale: "es-CO",
};

type Privacy = typeof es;

const en: Privacy = {
  title: "Privacy and data",
  metaTitle: "Privacy and data policy",
  description: "What data the MIES Group website collects, why, which third-party services receive it and how to ask us to delete it.",
  intro: "What data this website collects, what we use it for, who else receives it and how to ask us to delete it.",
  draft: (company, date) =>
    `⚠ Provisional draft: to be reviewed by ${company}'s legal advisor (Colombian Law 1581 of 2012 and Decree 1377 of 2013). Last updated: ${date}.`,
  s1: "1. Data controller",
  hq: (company, city, country) => [company, `, headquartered in ${city}, ${country}. Contact for data matters: `],
  s2: "2. What data we collect",
  collected: [
    { what: "Contact form", detail: "Name, email, phone or WhatsApp, project type and the message you write." },
    { what: "Technical access data", detail: "IP address, browser and pages visited are kept in the hosting provider's logs, as on any website." },
    {
      what: "Storage in your browser",
      detail:
        "A single flag in sessionStorage so the intro animation doesn't repeat. It doesn't identify you and is deleted when you close the tab. We don't use cookies or analytics or advertising tools.",
    },
  ],
  onlyNeeded: "We only ask for what we need to answer you. Form data is collected only with your authorization (the box you check before sending).",
  s3: "3. What we use it for",
  purposes: [
    "Answering your request and sending you a quote.",
    "Following up commercially on your project, only if you wrote to us.",
    "We never sell or hand over your data to third parties for advertising.",
  ],
  retention: "We keep it for as long as the conversation or business relationship lasts and then delete it.",
  retentionPending: "⚠ Exact period to be confirmed with the client.",
  s4: "4. Artificial intelligence",
  aiBefore: (name) => `${name} offers artificial intelligence services to its clients, but `,
  aiStrong: "this website does not use AI to process your personal data",
  aiAfter: ": what you send is not handed to any AI model or service. If that changes, we will say so here and next to the form, naming the provider.",
  s5: "5. Third-party services that receive data",
  thirdIntro: "These third parties are involved in running the website. Several only receive data if you choose to use them.",
  theirPolicy: "Their privacy policy",
  thirdParties: [
    { name: "GitHub Pages (GitHub, Inc.)", use: "Hosts the website.", when: "When you visit any page: receives technical access data (IP, browser).", policy: policies.github },
    { name: "Vimeo", use: "Plays the studio's videos.", when: "Only when you press play on a Vimeo video (loaded with the “do not track” option).", policy: policies.vimeo },
    { name: "YouTube (Google)", use: "Plays channel videos.", when: "Only when you press play; privacy-enhanced mode is used (youtube-nocookie.com).", policy: policies.google },
    { name: "WhatsApp (Meta)", use: "Direct chat with the studio.", when: "Only if you choose to message us on WhatsApp.", policy: policies.whatsapp },
    { name: "Instagram (Meta) and LinkedIn", use: "The studio's social media profiles.", when: "Only if you open those links; the website doesn't load their buttons or trackers.", policy: policies.instagram },
  ],
  s6: "6. Your rights",
  rights: [
    "Access, update and correct your data.",
    "Request proof of the authorization you gave us.",
    "Know how we have used your data.",
    "Revoke your authorization and ask us to delete your data.",
    "File complaints with Colombia's Superintendence of Industry and Commerce (SIC).",
  ],
  writeUs: "Write to us at",
  deadlines: ". We answer inquiries within 10 business days and claims within 15 business days.",
  s7: "7. Delete your data",
  deleteBefore: "This website has no user accounts: your data only exists if you wrote to us. You can ask us to delete ",
  deleteStrong: "all",
  deleteAfter: " of your data at any time, including what is held by the services above when it depends on us.",
  deleteCta: "Request deletion of my data →",
  deleteSubject: "Personal data deletion request",
  deleteBody: "Hello MIES Group, I request the deletion of all my personal data.\n\nName:\nEmail or phone I sent it from:\n",
  dateLocale: "en-US",
};

export const privacy: Record<Locale, Privacy> = { es, en };
