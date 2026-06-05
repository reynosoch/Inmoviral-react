import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      "nav_1": "Propiedades en Venta", "nav_2": "Propiedades en Renta", "nav_3": "Servicios Profesionales", "nav_4": "Configuración", "nav_btn": "Iniciar Sesión",

      // HERO
      "hero_tag": "SERVICIO PREMIUM · CONFIANZA COMPROBADA",
      "hero_title_1": "EXCEPCIONALES",
      "hero_title_italic": "PROPIEDADES",
      "hero_title_for": "PARA",
      "hero_title_2": "CLIENTES",
      "hero_title_3": "EXIGENTES",
      "hero_desc": "Una selección curada de propiedades residenciales y de inversión para quienes valoran la exclusividad, la privacidad y una atención personalizada inigualable.",
      "btn_explorar": "EXPLORAR NUESTRO PORTAFOLIO →",
      "btn_ver_servicios": "EXPERIENCIAS REALES DE CLIENTES →",

      "hc1_num": "12", "hc1_label": "Años de Excelencia",
      "hc2_num": "150+", "hc2_label": "Propiedades Vendidas",
      "hc3_num": "5", "hc3_label": "Clientes Satisfechos",

      "ticker_1": "RESIDENCIAS DE LUJO", "ticker_2": "INVERSIONES INMOBILIARIAS PREMIUM", "ticker_3": "ADQUISICIONES ESTRATÉGICAS DE PROPIEDADES",
      "ticker_4": "OPORTUNIDADES FUERA DEL MERCADO", "ticker_5": "CREACIÓN DE VALOR A LARGO PLAZO", "ticker_6": "ASESORES INMOBILIARIOS DE CONFIANZA",
      "ticker_7": "LISTADOS EXCLUSIVOS", "ticker_8": "TRANSACCIONES SIN COMPLICACIONES", "ticker_9": "ESTÁNDARES DE SERVICIO INIGUALABLES",
      "ticker_10": "ACCESO EXCLUSIVO AL MERCADO", "ticker_11": "NEGOCIACIONES CONFIDENCIALES", "ticker_12": "REPRESENTACIÓN A MEDIDA",

      "f1_title_1": "Propiedades", "f1_title_2": "Residenciales", "f1_desc": "Residencias exclusivas seleccionadas por su comodidad, privacidad y valor a largo plazo.",
      "f2_title_1": "Apartamentos", "f2_title_2": "Premium", "f2_desc": "Espacios de vida modernos en ubicaciones privilegiadas con un potencial excepcional.",
      "f3_title_1": "Terrenos de", "f3_title_2": "Inversión", "f3_desc": "Oportunidades estratégicas para el desarrollo y el crecimiento futuro.",
      "f4_title_1": "Asesoría", "f4_title_2": "Privada", "f4_desc": "Orientación personalizada para compradores, vendedores e inversionistas.",

      "gal_label": "Bienes Raíces Premium", "gal_title_1": "PROPIEDADES DISTINGUIDAS", "gal_title_2": "CON VALOR", "gal_title_3": "DURADERO", "gal_view_all": "EXPLORAR LA COLECCIÓN →",
      "g_t1": "Casas de Lujo", "g_t2": "Apartamentos Premium", "g_t3": "Propiedades Frente al Mar", "g_t4": "Propiedades de Inversión", "g_t5": "Terrenos en Desarrollo", "g_t6": "Activos Comerciales", "g_t7": "Lotes Privilegiados", "g_t8": "Colección Penthouse",

      "about_label": "Sobre Nosotros", "about_title_1": "INMOVIRAL —", "about_title_2": "Ingeniería de", "about_title_3": "Excelencia",
      "about_desc_1": "INMOVIRAL combina experiencia en el mercado, estrategia moderna y un servicio impecable. Conectamos a nuestros clientes con propiedades que elevan su estilo de vida y reflejan su visión.",
      "about_desc_2": "Cada proyecto es una solución a medida, diseñada en torno a las necesidades, objetivos y el carácter único de cada propiedad.",
      "about_btn_more": "Conoce Más Sobre Nosotros →",
      "as1_num": "12", "as1_unit": "años", "as1_label": "De experiencia en asesoría y transacciones de bienes raíces premium",
      "as2_num": "150", "as2_unit": "+", "as2_label": "Propiedades vendidas exitosamente en mercados nacionales e internacionales",
      "as3_num": "5", "as3_unit": "años", "as3_label": "De soporte garantizado y seguimiento para cada cliente después del cierre",

      "pilars_label": "Colecciones", "pilars_title": "Nuestras Soluciones",
      "p1_tag": "Unifamiliar · Prestigio", "p1_title_1": "Casas de", "p1_title_2": "Lujo", "p1_desc": "Residencias unifamiliares exclusivas que combinan belleza arquitectónica con máxima privacidad y valor a largo plazo. La solución ideal para compradores exigentes.", "p1_btn": "Agendar una Visita →",
      "p2_tag": "Elegancia · Diseño", "p2_title_1": "Apartamentos", "p2_title_2": "Premium", "p2_desc": "Espacios de vida modernos en ubicaciones privilegiadas con líneas limpias y amenidades excepcionales. Generan una sensación de amplitud y confort refinado.", "p2_btn": "Agendar una Visita →",

      "process_label": "Cómo Trabajamos", "process_title": "Nuestro Proceso",
      "step1_title": "Consulta", "step1_desc": "Analizamos tus objetivos, evaluamos tu presupuesto y comprendemos tu visión.",
      "step2_title": "Búsqueda de Propiedad", "step2_desc": "Curaduramos una selección personalizada de propiedades que coinciden con tus criterios.",
      "step3_title": "Due Diligence", "step3_desc": "Realizamos un análisis exhaustivo y verificación de cada propiedad.",
      "step4_title": "Negociación", "step4_desc": "Negociación profesional y cierre sin contratiempos por parte de nuestro equipo experto.",
      "step5_title": "Soporte Post-Venta", "step5_desc": "5 años de soporte continuo y orientación después de cada transacción.",

      "testi-label": "Reseñas de Clientes", "testi-title": "La Confianza de Nuestros Clientes",
      "t1_text": "Compramos la casa de nuestros sueños a través de INMOVIRAL. El resultado superó todas las expectativas — una experiencia verdaderamente excepcional y personalizada de principio a fin.", "t1_author": "Alejandro Mendoza", "t1_role": "Cliente Privado, Chihuahua",
      "t2_text": "El equipo de INMOVIRAL gestionó cada paso con profesionalismo — desde la búsqueda inicial hasta el cierre. Los tiempos fueron respetados y la calidad del servicio fue sobresaliente.", "t2_author": "Mariana Rodríguez", "t2_role": "Diseñadora de Interiores",
      "t3_text": "Nuestro penthouse se convirtió en la pieza central de nuestro portafolio de inversión. Cada visita queda cautivada. ¡Gracias por el servicio impecable y la atención al detalle!", "t3_author": "Carlos González", "t3_role": "Cliente Privado, Miami",

      "cta_label": "Comienza Tu Camino", "cta_title_1": "Encuentra la Propiedad", "cta_title_italic": "de Tus Sueños", "cta_btn": "Solicitar una Consulta →",

      "footer_tagline": "Bienes raíces premium para estilos de vida modernos. Servicios de venta, renta y asesoría en mercados nacionales e internacionales.",
      "footer_col1_title": "Empresa", "footer_link1": "Sobre Nosotros", "footer_link2": "Propiedades", "footer_link3": "Nuestro Equipo", "footer_link4": "Testimonios", "footer_link5": "Carreras",
      "footer_col2_title": "Catálogo",
      "footer_col3_title": "Contacto", "footer_hours": "Lun–Vie: 9:00 AM – 7:00 PM",
      "footer_rights": "© 2026 INMOVIRAL. Todos los derechos reservados.", "footer_privacy": "Política de Privacidad", "footer_terms": "Términos de Uso"
    }
  },
  en: {
    translation: {
      "nav_1": "Properties for sale", "nav_2": "Properties for lease", "nav_3": "Professional Services", "nav_4": "Configuration", "nav_btn": "Sign In",

      // HERO
      "hero_tag": "PREMIUM SERVICE · PROVEN TRUST",
      "hero_title_1": "EXCEPTIONAL",
      "hero_title_italic": "PROPERTIES",
      "hero_title_for": "FOR",
      "hero_title_2": "DISCERNING",
      "hero_title_3": "CLIENTS",
      "hero_desc": "A curated selection of residential and investment properties for those who value exclusivity, privacy, and unparalleled personal attention.",
      "btn_explorar": "EXPLORE OUR PORTFOLIO →",
      "btn_ver_servicios": "REAL CLIENT EXPERIENCES →",

      "hc1_num": "12", "hc1_label": "Years of Excellence",
      "hc2_num": "150+", "hc2_label": "Properties Sold",
      "hc3_num": "5", "hc3_label": "Satisfied Clients",

      "ticker_1": "LUXURY RESIDENCES", "ticker_2": "PREMIUM REAL ESTATE INVESTMENTS", "ticker_3": "STRATEGIC PROPERTY ACQUISITIONS",
      "ticker_4": "OFF-MARKET OPPORTUNITIES", "ticker_5": "LONG-TERM VALUE CREATION", "ticker_6": "TRUSTED REAL ESTATE ADVISORS",
      "ticker_7": "EXCLUSIVE LISTINGS", "ticker_8": "SEAMLESS TRANSACTIONS", "ticker_9": "UNPARALLELED SERVICE STANDARDS",
      "ticker_10": "EXCLUSIVE MARKET ACCESS", "ticker_11": "CONFIDENTIAL NEGOTIATIONS", "ticker_12": "BESPOKE REPRESENTATION",

      "f1_title_1": "Residential", "f1_title_2": "Properties", "f1_desc": "Exclusive residences selected for comfort, privacy, and long-term value.",
      "f2_title_1": "Premium", "f2_title_2": "Apartaments", "f2_desc": "Modern living spaces in prime locations with exceptional potential.",
      "f3_title_1": "Investment", "f3_title_2": "Land", "f3_desc": "Strategic opportunities for development and future growth.",
      "f4_title_1": "Private", "f4_title_2": "Advisory", "f4_desc": "Personalized guidance for buyers, sellers, and investors.",

      "gal_label": "Premium Real State", "gal_title_1": "DISTINGUISHED PROPERTIES", "gal_title_2": "WITH ENDURING", "gal_title_3": "VALUE", "gal_view_all": "EXPLORE THE COLLECTION →",
      "g_t1": "Luxury Homes", "g_t2": "Premium Apartments", "g_t3": "Waterfront Estates", "g_t4": "Investment Properties", "g_t5": "Development Land", "g_t6": "Commercial Assets", "g_t7": "Prime Land Parcels", "g_t8": "Penthouse Collection",

      "about_label": "About Us", "about_title_1": "INMOVIRAL —", "about_title_2": "Engineering", "about_title_3": "Excellence",
      "about_desc_1": "INMOVIRAL combines market expertise, modern strategy, and flawless service. We connect clients with properties that elevate their lifestyle and reflect their vision.",
      "about_desc_2": "Every project is a tailored solution, crafted around the client's needs, goals, and the unique character of each property.",
      "about_btn_more": "Learn More About Us →",
      "as1_num": "12", "as1_unit": "yrs", "as1_label": "Of experience in premium real estate advisory and transactions",
      "as2_num": "150", "as2_unit": "+", "as2_label": "Properties successfully sold across domestic and international markets",
      "as3_num": "5", "as3_unit": "yrs", "as3_label": "Guaranteed support and follow-up for every client after closing",

      "pilars_label": "Collections", "pilars_title": "Our Solutions",
      "p1_tag": "Single-Family · Prestige", "p1_title_1": "Luxury", "p1_title_2": "Homes", "p1_desc": "Exclusive single-family residences combining architectural beauty with maximum privacy and long-term value. The ideal solution for discerning buyers.", "p1_btn": "Schedule a Visit →",
      "p2_tag": "Elegance · Design", "p2_title_1": "Premium", "p2_title_2": "Apartments", "p2_desc": "Modern living spaces in prime locations with clean lines and exceptional amenities. Creates a sense of openness and refined comfort.", "p2_btn": "Schedule a Visit →",

      "process_label": "How We Work", "process_title": "Our Process",
      "step1_title": "Consultation", "step1_desc": "We discuss your goals, assess your budget, and understand your vision",
      "step2_title": "Property Search", "step2_desc": "We curate a tailored selection of properties matching your criteria",
      "step3_title": "Due Diligence", "step3_desc": "We conduct thorough analysis and verification of every property",
      "step4_title": "Negotiation", "step4_desc": "Professional negotiation and seamless closing by our expert team",
      "step5_title": "After-Sale Support", "step5_desc": "5 years of continued support and guidance after every transaction",

      "testi-label": "Client Reviews", "testi-title": "Trusted By Our Clients",
      "t1_text": "We purchased our dream home through INMOVIRAL. The result exceeded every expectation — a truly exceptional and personal experience from start to finish.", "t1_author": "Alexander Morrison", "t1_role": "Private Client, New York",
      "t2_text": "The INMOVIRAL team handled every step with professionalism — from the initial search to closing. Timelines were respected and quality of service was outstanding.", "t2_author": "Katherine Wolfe", "t2_role": "Interior Designer",
      "t3_text": "Our penthouse became the centerpiece of our investment portfolio. Every guest is captivated. Thank you for the flawless service and attention to detail!", "t3_author": "Dmitry Kozlov", "t3_role": "Private Client, Miami",

      "cta_label": "Start Your Journey", "cta_title_1": "Find the Property", "cta_title_italic": "of Your Dreams", "cta_btn": "Request a Consultation →",

      "footer_tagline": "Premium real estate for modern lifestyles. Sales, leasing, and advisory services across domestic and international markets.",
      "footer_col1_title": "Company", "footer_link1": "About Us", "footer_link2": "Properties", "footer_link3": "Our Team", "footer_link4": "Testimonials", "footer_link5": "Careers",
      "footer_col2_title": "Catalog",
      "footer_col3_title": "Contact", "footer_hours": "Mon–Fri: 9:00 AM – 7:00 PM",
      "footer_rights": "© 2026 INMOVIRAL. All rights reserved.", "footer_privacy": "Privacy Policy", "footer_terms": "Terms of Use"
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