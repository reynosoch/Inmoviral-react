import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      // NAV
      "nav_inicio": "Inicio",
      "nav_nosotros": "Nosotros",
      "nav_catalogo": "Catálogo",
      "nav_servicios": "Servicios Virales",
      "nav_btn": "Agendar Cita",
      // HERO
      "hero_tag": "Premium Service · Proven Trust",
      "hero_title_1": "PROPIEDADES",
      "hero_title_italic": "EXCLUSIVAS",
      "hero_title_2": "PARA CLIENTES EXIGENTES",
      "hero_desc": "Una selección curada de propiedades residenciales y de inversión para quienes valoran la exclusividad, la privacidad y una atención personalizada inigualable.",
      "btn_explorar": "EXPLORAR PORTAFOLIO →",
      "btn_ver_servicios": "VER SERVICIOS →",
      "hc1_num": "5", "hc1_label": "Especialistas",
      "hc2_num": "100%", "hc2_label": "InmoViral",
      "hc3_num": "Garantía", "hc3_label": "De Satisfacción",
      // TICKER
      "ticker_1": "Trato Directo Sin Intermediarios",
      "ticker_2": "Limpieza Profunda Incluida",
      "ticker_3": "Fotografía Profesional de Alto Impacto",
      "ticker_4": "Logística de Mudanza Completa",
      "ticker_5": "Exposición Masiva en Redes",
      "ticker_6": "Soporte Técnico 24/7",
      "ticker_7": "Campañas de Marketing Viral",
      "ticker_8": "Atención Personalizada",
      "ticker_9": "Sin Proveedores Externos",
      "ticker_10": "Garantía de Satisfacción Total",
      "ticker_11": "Asesoría Legal Integral",
      "ticker_12": "Tranquilidad Garantizada",
      // FEATURES
      "f1_title_1": "Limpieza", "f1_title_2": "Profunda",
      "f1_desc": "Dejamos el inmueble impecable y reluciente antes de cada visita o entrega final para garantizar el mejor impacto visual.",
      "f2_title_1": "Fotografía", "f2_title_2": "Profesional",
      "f2_desc": "Sesiones multimedia de alta calidad y contenido optimizado para redes sociales que hacen destacar tu propiedad.",
      "f3_title_1": "Logística de", "f3_title_2": "Mudanza",
      "f3_desc": "Coordinamos todo el traslado de tus pertenencias con cuidado y precisión para que no pases por nada de estrés.",
      "f4_title_1": "Exposición", "f4_title_2": "Constante",
      "f4_desc": "Estrategias de marketing masivo para conectar de manera rápida y efectiva a compradores con vendedores.",
      // GALLERY
      "gal_label": "Nuestro Catálogo",
      "gal_title_1": "Propiedades que", "gal_title_2": "se convierten en el centro", "gal_title_3": "de tu vida",
      "gal_view_all": "EXPLORAR PORTAFOLIO →",
      "g_t1": "San Felipe", "g_t2": "Cordilleras", "g_t3": "Zona Centro", "g_t4": "Las Águilas",
      "g_t5": "Residencial", "g_t6": "Contemporánea", "g_t7": "Minimalista", "g_t8": "Vista Panorámica",
      // ABOUT
      "about_label": "Sobre InmoViral",
      "about_title_1": "Conectamos", "about_title_2": "hogares con", "about_title_3": "estrategias virales",
      "about_desc_1": "En InmoViral no solo listamos inmuebles; transformamos la experiencia de compra y venta. Combinamos la gestión inmobiliaria con servicios integrales ejecutados por nuestro propio equipo de profesionales de principio a fin.",
      "about_desc_2": "Cada propiedad recibe un treatment de primera clase que abarca limpieza profunda, producción audiovisual y apoyo logístico en el traslado para garantizar un proceso perfecto.",
      "about_btn_more": "Saber más del equipo →",
      "as1_num": "5", "as1_unit": "int", "as1_label": "Profesionales encargados de dar soporte a cada etapa del servicio",
      "as2_num": "100%", "as2_unit": "+", "as2_label": "Sin intermediarios, nosotros hacemos la fotografía, limpieza y mudanza",
      "as3_num": "Garantía", "as3_unit": "tot", "as3_label": "Seguridad y excelencia para la tranquilidad de compradores y vendedores",
      // PILARS
      "pilars_label": "Nuestros Pilares", "pilars_title": "Soluciones a tu medida",
      "p1_tag": "Venta · Inversión", "p1_title_1": "Encuentra tu", "p1_title_2": "próximo hogar",
      "p1_desc": "Explora casas listas para habitar que ya cuentan con los beneficios de limpieza profunda e inspección de calidad antes de tu visita de cortesía.", "p1_btn": "Agendar asesoría →",
      "p2_tag": "Promoción · Rapidez", "p2_title_1": "Vende con", "p2_title_2": "Servicios Virales",
      "p2_desc": "Hacemos que tu propiedad destaque en el mercado con sesiones de foto profesionales y campaigns digitales masivas diseñadas para atraer compradores rápido.", "p2_btn": "Registrar propiedad →",
      // PROCESS
      "process_label": "Cómo trabajamos", "process_title": "El Proceso InmoViral",
      "step1_title": "Contacto", "step1_desc": "Evaluamos tus metas inmobiliarias y te asignamos un plan especializado.",
      "step2_title": "Preparación Viral", "step2_desc": "Nuestro equipo realiza la limpieza profunda y sesión fotográfica pro.",
      "step3_title": "Promoción", "step3_desc": "Lanzamos campañas de exposición masiva para conectar clientes de inmediato.",
      "step4_title": "Visita y Cierre", "step4_desc": "Coordinamos la visita y gestionamos todos los trámites legales de manera segura.",
      "step5_title": "Mudanza", "step5_desc": "Te apoyamos con la logística del traslado hacia tu nuevo espacio residencial.",
      // TESTIMONIALS
      "testi-label": "Opiniones de Clientes", "testi-title": "Confían en nosotros",
      "t1_text": "El servicio de fotografía y la limpieza profunda hicieron que mi casa se vendiera en tiempo récord. Todo el proceso fue impecable y profesional.", "t1_author": "Alejandro Mendoza", "t1_role": "Propietario, Chihuahua",
      "t2_text": "Comprar mi departamento con ellos fue lo mejor. Cuando fui a la visita la propiedad estaba limpia y reluciente, y la ayuda con la mudanza final fue un gran alivio.", "t2_author": "Mariana Rodríguez", "t2_role": "Compradora Residencial",
      "t3_text": "Es genial tratar con una agencia que resuelve todo internamente. Cero estrés con las vueltas o proveedores externos. Excelente trabajo de los muchachos.", "t3_author": "Carlos González", "t3_role": "Inversionista Inmobiliario",
      // CTA
      "cta_label": "Comienza hoy tu proceso", "cta_title_1": "Encontremos la propiedad", "cta_title_italic": "de tus sueños", "cta_btn": "Enviar Mensaje →",
      // FOOTER
      "footer_tagline": "Conectamos propiedades exclusivas con servicios integrales de fotografía, limpieza profunda y mudanza coordinados en su totalidad por nuestro equipo.",
      "footer_col1_title": "Organización", "footer_link1": "Nosotros", "footer_link2": "Catálogo", "footer_link3": "Servicios", "footer_link4": "Equipo", "footer_link5": "Carreras",
      "footer_col2_title": "Zonas Destacadas",
      "footer_col3_title": "Contacto de Agencia", "footer_hours": "Horario: Lunes a Viernes",
      "footer_rights": "© 2026 InmoViral. Todos los derechos reservados.", "footer_privacy": "Política de Privacidad", "footer_terms": "Términos de Uso"
    }
  },
  en: {
    translation: {
      // NAV
      "nav_inicio": "Properties for sale",
      "nav_nosotros": "Properties for lease",
      "nav_catalogo": "Professional Services",
      "nav_servicios": "Configuration",
      "nav_btn": "Sign In",
      // HERO
      "hero_tag": "Premium Service · Proven Trust",
      "btn_explorar": "Explore our portfolio →",
      "btn_ver_servicios": "Real Client Experiences →",
      "hero_desc": "A curated selection of residential and investment properties for those who value exclusivity, privacy, and unparalleled personal attention.",
      "hc1_num": "12", "hc1_label": "Years of Excellence",
      "hc2_num": "150+", "hc2_label": "Properties Sold",
      "hc3_num": "5", "hc3_label": "Satisfed Clients",
      // TICKER
      "ticker_1": "LUXURY RESIDENCES",
      "ticker_2": "PREMIUM REAL ESTATE INVESTMENTS",
      "ticker_3": "STRATEGIC PROPERTY ACQUISITIONS",
      "ticker_4": "OFF-MARKET OPPORTUNITIES",
      "ticker_5": "LONG-TERM VALUE CREATION",
      "ticker_6": "TRUSTED REAL ESTATE ADVISORS",
      "ticker_7": "EXCLUSIVE LISTINGS",
      "ticker_8": "SEAMLESS TRANSACTIONS",
      "ticker_9": "UNPARALLELED SERVICE STANDARDS",
      "ticker_10": "EXCLUSIVE MARKET ACCESS",
      "ticker_11": "CONFIDENTIAL NEGOTIATIONS",
      "ticker_12": "BESPOKE REPRESENTATION",
      // FEATURES
      "f1_title_1": "Residential", "f1_title_2": "Properties",
      "f1_desc": "Exclusive residences selected for comfort, privacy, and long-term value.",
      "f2_title_1": "Premium", "f2_title_2": "Apartaments",
      "f2_desc": "Modern living spaces in prime locations with exceptional potential.",
      "f3_title_1": "Investment", "f3_title_2": "Land",
      "f3_desc": "Strategic opportunities for development and future growth.",
      "f4_title_1": "Private", "f4_title_2": "Advisory",
      "f4_desc": "Personalized guidance for buyers, sellers, and investors.",
      // GALLERY
      "gal_label": "Premium Real State",
      "gal_title_1": "DISTINGUISHED PROPERTIES", "gal_title_2": "WITH ENDURING", "gal_title_3": "VALUE",
      "gal_view_all": "EXPLORE THE COLLECTION →",
      "g_t1": "Luxury Homes", "g_t2": "Premium Apartments", "g_t3": "Waterfront Estates", "g_t4": "Investment Properties",
      "g_t5": "Development Land", "g_t6": "Commercial Assets", "g_t7": "Prime Land Parcels", "g_t8": "Penthouse Collection",
      // ABOUT
      "about_label": "About Us",
      "about_title_1": "INMOVIRAL —", "about_title_2": "Engineering", "about_title_3": "Excellence",
      "about_desc_1": "INMOVIRAL combines market expertise, modern strategy, and flawless service. We connect clients with properties that elevate their lifestyle and reflect their vision.",
      "about_desc_2": "Every project is a tailored solution, crafted around the client's needs, goals, and the unique character of each property.",
      "about_btn_more": "Learn More About Us →",
      "as1_num": "12", "as1_unit": "yrs", "as1_label": "Of experience in premium real estate advisory and transactions",
      "as2_num": "150", "as2_unit": "+", "as2_label": "Properties successfully sold across domestic and international markets",
      "as3_num": "5", "as3_unit": "yrs", "as3_label": "Guaranteed support and follow-up for every client after closing",
      // PILARS
      "pilars_label": "Collections", "pilars_title": "Our Solutions",
      "p1_tag": "Single-Family · Prestige", "p1_title_1": "Luxury", "p1_title_2": "Homes",
      "p1_desc": "Exclusive single-family residences combining architectural beauty with maximum privacy and long-term value. The ideal solution for discerning buyers.", "p1_btn": "Schedule a Visit →",
      "p2_tag": "Elegance · Design", "p2_title_1": "Premium", "p2_title_2": "Apartments",
      "p2_desc": "Modern living spaces in prime locations with clean lines and exceptional amenities. Creates a sense of openness and refined comfort.", "p2_btn": "Schedule a Visit →",
      // PROCESS
      "process_label": "How We Work", "process_title": "Our Process",
      "step1_title": "Consultation", "step1_desc": "We discuss your goals, assess your budget, and understand your vision",
      "step2_title": "Property Search", "step2_desc": "We curate a tailored selection of properties matching your criteria",
      "step3_title": "Due Diligence", "step3_desc": "We conduct thorough analysis and verification of every property",
      "step4_title": "Negotiation", "step4_desc": "Professional negotiation and seamless closing by our expert team",
      "step5_title": "After-Sale Support", "step5_desc": "5 years of continued support and guidance after every transaction",
      // TESTIMONIALS
      "testi-label": "Client Reviews", "testi-title": "Trusted By Our Clients",
      "t1_text": "We purchased our dream home through INMOVIRAL. The result exceeded every expectation — a truly exceptional and personal experience from start to finish.", "t1_author": "Alexander Morrison", "t1_role": "Private Client, New York",
      "t2_text": "The INMOVIRAL team handled every step with professionalism — from the initial search to closing. Timelines were respected and quality of service was outstanding.", "t2_author": "Katherine Wolfe", "t2_role": "Interior Designer",
      "t3_text": "Our penthouse became the centerpiece of our investment portfolio. Every guest is captivated. Thank you for the flawless service and attention to detail!", "t3_author": "Dmitry Kozlov", "t3_role": "Private Client, Miami",
      // CTA
      "cta_label": "Start Your Journey", "cta_title_1": "Find the Property", "cta_title_italic": "of Your Dreams", "cta_btn": "Request a Consultation →",
      // FOOTER
      "footer_tagline": "Premium real estate for modern lifestyles. Sales, leasing, and advisory services across domestic and international markets.",
      "footer_col1_title": "Company", "footer_link1": "About Us", "footer_link2": "Properties", "footer_link3": "Our Team", "footer_link4": "Testimonials", "footer_link5": "Careers",
      "footer_col2_title": "Catalog",
      "footer_col3_title": "Contact", "footer_hours": "Mon–Fri: 9:00 AM – 7:00 PM",
      "footer_rights": "© 2024 INMOVIRAL. All rights reserved.", "footer_privacy": "Privacy Policy", "footer_terms": "Terms of Use"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "es", 
    fallbackLng: "es",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;