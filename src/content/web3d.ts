import type { Locale } from "@/lib/i18n";

/**
 * Web3D (categoría "Web3D" de Proyectos), con el contenido de la página anterior
 * (miesgroup3d.com/que-es-web3d): textos, video explicativo y un clip por ventaja.
 * Videos: copias de los de Bunny Stream alojadas en public/media/web3d/.
 *
 * ⚠ En la página anterior, "Todo en un link" y "Sin descargas extras" repetían por error
 *   el texto de "Experiencia exterior realista": esos dos textos son un borrador nuevo,
 *   por confirmar con el cliente. La traducción al inglés también es un borrador.
 */
type T = Record<Locale, string>;
export type Web3dFeature = { title: T; text: T; video?: string; poster?: string };

const m = (name: string) => ({ video: `/media/web3d/${name}.mp4`, poster: `/media/web3d/${name}.jpg` });

export const web3d = {
  intro: [
    {
      es: "Web3D ofrece una forma ágil, rápida e interactiva para recorrer y presentar proyectos inmobiliarios de manera muy visual. En pocos segundos, permite situar al cliente en su futura inversión inmobiliaria, explorando cada detalle del proyecto.",
      en: "Web3D offers an agile, fast and interactive way to explore and present real estate projects in a highly visual way. In a few seconds it places the client in their future investment, exploring every detail of the project.",
    },
    {
      es: "La plataforma se adapta a múltiples tipologías de proyectos, desde edificios de una torre, urbanizaciones de múltiples torres o barrios de casas, hasta hoteles, centros comerciales y oficinas. Su flexibilidad permite integrar cualquier arquitectura o diseño, desde proyectos de pocas unidades hasta desarrollos de miles de propiedades.",
      en: "The platform adapts to many project types, from single towers, multi-tower complexes and housing developments to hotels, shopping centers and offices. Its flexibility lets it integrate any architecture or design, from projects with a few units to developments with thousands of properties.",
    },
  ] as T[],
  highlights: [
    { es: "Presenta tu proyecto en cualquier momento, sin necesidad de instalaciones físicas.", en: "Present your project anytime, with no physical installations." },
    { es: "Accede desde cualquier navegador sin descargas, optimizado para todas las plataformas.", en: "Access it from any browser with no downloads, optimized for every platform." },
    { es: "Recorre los proyectos como si estuvieras ahí, con vistas 360 y animaciones realistas.", en: "Walk through projects as if you were there, with 360 views and realistic animations." },
    { es: "Herramientas avanzadas de marketing digital para mejorar la conversión y la captación de leads.", en: "Advanced digital marketing tools to improve conversion and lead generation." },
  ] as T[],
  video: { src: "/media/web3d/web3d-video.mp4", poster: "/media/web3d/web3d-video.jpg" },
  typologies: m("tipologias"),
  featuresTitle: { es: "Ventajas de Web3D", en: "Web3D advantages" } as T,
  features: [
    {
      title: { es: "Experiencia exterior realista", en: "Realistic exterior experience" },
      text: {
        es: "Una visualización aérea del exterior del proyecto con su entorno realista. El Spin 360 es una herramienta fantástica para conocer al máximo la ubicación y las vistas del proyecto desde distintos ángulos. Se cargan videos con animaciones 3D o filmaciones con dron si el proyecto ya está construido.",
        en: "An aerial view of the project's exterior in its realistic surroundings. Spin 360 is a great tool to fully understand the location and views from different angles. 3D animations or drone footage (for built projects) can be loaded.",
      },
      ...m("exterior"),
    },
    {
      title: { es: "Navega de manera intuitiva", en: "Intuitive navigation" },
      text: {
        es: "Una navegación estilo videojuego permite entender el proyecto de una forma muy simple y visual. No es un sitio web tradicional: es un Web3D que hace que tu potencial cliente realmente entienda el proyecto y lo conozca hasta el último detalle. Tu showroom online 24/7.",
        en: "Videogame-style navigation makes the project simple and visual to understand. It's not a traditional website: it's a Web3D that helps your prospects truly understand the project down to the last detail. Your 24/7 online showroom.",
      },
      ...m("navega"),
    },
    {
      title: { es: "Muévete como en casa en 360°", en: "Move around in 360°" },
      text: {
        es: "Con los recorridos virtuales 360° puedes explorar cada rincón de cada apartamento, amenities y áreas interiores y exteriores. Nos integramos con Layama, 3DVista, Pano2VR, Matterport y otras tecnologías, para proyectos por construir y ya construidos.",
        en: "With 360° virtual tours you can explore every corner of each apartment, the amenities and the interior and exterior areas. We integrate with Layama, 3DVista, Pano2VR, Matterport and more, for projects to be built and already built.",
      },
      video: "/media/tours/banner-360-720.mp4",
      poster: "/media/tours/banner-360.jpg",
    },
    {
      title: { es: "Todo en un link, todo en un clic", en: "Everything in one link, one click" },
      text: {
        es: "El proyecto completo en un solo enlace: tus clientes lo abren desde WhatsApp, correo o redes sociales y lo comparten cuando quieran.",
        en: "The whole project in a single link: clients open it from WhatsApp, email or social media and share it whenever they want.",
      },
      ...m("link"),
    },
    {
      title: { es: "Sin descargas extras", en: "No extra downloads" },
      text: {
        es: "Funciona directamente en el navegador, sin instalar aplicaciones, y está optimizado para todas las plataformas.",
        en: "It runs right in the browser, with no apps to install, and is optimized for every platform.",
      },
      ...m("descargas"),
    },
    {
      title: { es: "Módulo comercial para unidades", en: "Sales module for units" },
      text: {
        es: "Permite cargar varias listas de precios según distintas formas de pago y crear cotizaciones automáticas con diferentes porcentajes de cuota inicial y financiación. Agiliza la venta y da claridad a los inversionistas y al equipo comercial.",
        en: "Load several price lists by payment plan and create automatic quotes with different down-payment and financing percentages. It speeds up sales and gives clarity to investors and the sales team.",
      },
      ...m("comercial"),
    },
  ] as Web3dFeature[],
  extras: [
    {
      title: { es: "Adaptable a todos los dispositivos", en: "Works on every device" },
      text: {
        es: "Diseño responsive para cualquier pantalla: pantallas táctiles, tablets, computadores y celulares, en showrooms, ferias o desde la casa del cliente.",
        en: "Responsive design for any screen: touchscreens, tablets, computers and phones, in showrooms, fairs or from the client's home.",
      },
    },
    {
      title: { es: "Panel para vendedores", en: "Sales team panel" },
      text: {
        es: "Los vendedores gestionan el estado de cada unidad, con permisos para modificar estados, precios y más.",
        en: "Salespeople manage each unit's status, with permissions to change statuses, prices and more.",
      },
    },
    {
      title: { es: "Integración con Analytics", en: "Analytics integration" },
      text: {
        es: "Para que tus campañas tengan datos certeros, Web3D se integra con Google Analytics y el Pixel de Meta.",
        en: "So your campaigns have accurate data, Web3D integrates with Google Analytics and the Meta Pixel.",
      },
    },
  ] as Web3dFeature[],
};
