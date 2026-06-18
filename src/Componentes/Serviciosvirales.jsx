import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=srgb&fm=jpg&q=85';
const GUARANTEE_IMAGE = 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?crop=entropy&cs=srgb&fm=jpg&q=85';
const CONTACT_PHONE = '+526141234567';
const CONTACT_WA = 'https://wa.me/526141234567';

const TAB_SECTIONS = [
  { id: 'compra', label: 'Para Compradores' },
  { id: 'venta', label: 'Para Vendedores' },
  { id: 'inversion', label: 'Para Inversionistas' },
  { id: 'adicionales', label: 'Servicios Adicionales' },
];

const SERVICIOS = [
  {
    id: 1,
    num: '01',
    tag: 'Logística',
    titulo: 'Ayuda con la',
    tituloEm: 'Mudanza',
    desc: 'Coordinamos cada detalle de tu traslado con empresas certificadas. Desde el embalaje profesional hasta la instalación en tu nuevo hogar — sin estrés, sin imprevistos.',
    features: ['Embalaje profesional', 'Transporte asegurado', 'Coordinación total del traslado', 'Seguro de bienes incluido', 'Instalación en destino'],
    cta: 'Solicitar Servicio',
  },
  {
    id: 2,
    num: '02',
    tag: 'Marketing Digital',
    titulo: 'Exposición en',
    tituloEm: 'Redes Sociales',
    desc: 'Posicionamos tu propiedad frente a miles de compradores e inversionistas activos. Campañas segmentadas en Instagram, Facebook y TikTok con resultados medibles.',
    features: ['Campañas pagadas segmentadas', 'Contenido editorial profesional', 'Audiencias de alto valor', 'Reportes semanales de rendimiento', 'Difusión en portales premium'],
    cta: 'Solicitar Servicio',
  },
  {
    id: 3,
    num: '03',
    tag: 'Visual Premium',
    titulo: 'Fotografía',
    tituloEm: 'Profesional',
    desc: 'Capturamos la esencia y el valor de cada propiedad con equipo de alto rendimiento. Imágenes editoriales, video cinematic y tour virtual 360° que elevan tu listado.',
    features: ['Fotografía editorial de interiores', 'Video cinematic 4K con drone', 'Tour virtual 360°', 'Edición y postproducción premium', 'Entrega en 48 horas'],
    cta: 'Solicitar Servicio',
  },
  {
    id: 4,
    num: '04',
    tag: 'Consultoría',
    titulo: 'Asesoramiento',
    tituloEm: 'Agente INMOVIRAL',
    desc: 'Un experto dedicado a tu operación de principio a fin. Negociación estratégica, análisis de mercado y acompañamiento legal para que tomes decisiones con certeza.',
    features: ['Agente senior dedicado exclusivamente', 'Análisis comparativo de mercado', 'Negociación experta de precio y condiciones', 'Due diligence legal y notarial completo', 'Soporte 5 años post-cierre'],
    cta: 'Agendar Consulta',
  },
];

const PLANES = [
  {
    label: 'Esencial',
    titulo: 'Consulta & Cierre',
    precio: 'Comisión estándar de mercado',
    features: ['Asesoría en búsqueda o venta', '1 asesor asignado', 'Gestión notarial básica', 'Soporte por 6 meses post-cierre', 'Acceso a portafolio activo'],
    featured: false,
    cta: 'Comenzar',
  },
  {
    label: 'Premium',
    titulo: 'Servicio Integral',
    precio: 'Comisión preferencial + acceso exclusivo',
    features: ['Todo lo del plan Esencial', 'Asesor senior dedicado', 'Acceso a propiedades off-market', 'Estrategia de negociación avanzada', 'Due diligence legal completo', 'Soporte 5 años post-cierre', 'Reportes de mercado mensuales'],
    featured: true,
    cta: 'Solicitar acceso',
  },
  {
    label: 'Corporativo',
    titulo: 'Portafolio & Inversión',
    precio: 'Estructura a medida — cotizar',
    features: ['Todo lo del plan Premium', 'Análisis de portafolio inmobiliario', 'Vehículos de inversión estructurados', 'Gestión de activos en renta', 'Reportes trimestrales de rendimiento', 'Acceso a red de inversionistas'],
    featured: false,
    cta: 'Contactar equipo',
  },
];

const GARANTIAS = [
  {
    titulo: '5 años de soporte post-venta',
    desc: 'Una vez cerrada la operación, seguimos siendo tu punto de contacto para cualquier consulta legal, técnica o de mantenimiento relacionada con la propiedad.',
  },
  {
    titulo: 'Asesor dedicado exclusivo',
    desc: 'Cada cliente cuenta con un asesor principal que gestiona toda la operación, más un equipo de respaldo. Nunca serás redirigido a un desconocido.',
  },
  {
    titulo: 'Comisión alineada a resultados',
    desc: 'Nuestros honorarios están estructurados para que nuestros intereses sean exactamente los mismos que los tuyos: el mejor precio, en el menor tiempo.',
  },
  {
    titulo: 'Respuesta en menos de 2 horas',
    desc: 'Nos comprometemos a responder cualquier consulta en un plazo máximo de 2 horas durante días hábiles, y a coordinar urgencias fuera de horario.',
  },
];

const TESTIMONIOS = [
  { texto: '"En tres meses encontramos la propiedad que llevábamos dos años buscando. La atención fue impecable de principio a fin."', nombre: 'Miguel & Laura Fernández', rol: 'Compradores — Residencia Diamante' },
  { texto: '"Vendieron mi penthouse en 47 días al precio que yo pedía. La estrategia de marketing fue completamente diferente a lo que había visto antes."', nombre: 'Rodrigo Salinas', rol: 'Vendedor — Penthouse Sierra Alta' },
  { texto: '"Mi portafolio creció un 34% en valor en 18 meses. Lo que más valoro es que siempre actúan con mis intereses primero."', nombre: 'Grupo Varela Capital', rol: 'Inversionista Institucional' },
];

export default function ServiciosVirales({ onIrLogin }) {
  const [activo, setActivo] = useState(null);
  const [tabActiva, setTabActiva] = useState('compra');
  const scrollRef = useRef(null);
  const sectionOffsets = useRef({});

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  const scrollASeccion = (id) => {
    setTabActiva(id);
    const y = sectionOffsets.current[id];
    if (typeof y === 'number') {
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: true });
    }
  };

  const registrarSeccion = (id) => (event) => {
    sectionOffsets.current[id] = event.nativeEvent.layout.y;
  };

  const abrirUrl = (url) => {
    Linking.openURL(url).catch(() => {});
  };

  const irLogin = () => {
    if (typeof onIrLogin === 'function') {
      onIrLogin();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.eyebrow}>Lo que ofrecemos</Text>
            <Text style={styles.heroTitle}>
              Servicios diseñados{'\n'}para <Text style={styles.heroEmphasis}>resultados</Text>{'\n'}extraordinarios
            </Text>
            <Text style={styles.heroSub}>
              Cada servicio que ofrecemos ha sido concebido para acompañar a compradores, vendedores e inversionistas desde la primera consulta hasta mucho después del cierre.
            </Text>
          </View>
        </View>

        <View style={styles.tabsBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
            {TAB_SECTIONS.map((tab) => {
              const isActive = tabActiva === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  accessibilityRole="button"
                  onPress={() => scrollASeccion(tab.id)}
                  style={({ pressed }) => [styles.tabButton, isActive && styles.tabButtonActive, pressed && styles.tabButtonPressed]}
                >
                  <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>{tab.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.section} onLayout={registrarSeccion('compra')}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Portafolio de Servicios</Text>
            <Text style={styles.sectionTitle}>
              Todo lo que necesitas{'\n'}en un solo <Text style={styles.sectionEmphasis}>lugar</Text>
            </Text>
          </View>

          <View style={styles.cardsList}>
            {SERVICIOS.map((servicio) => {
              const isOpen = activo === servicio.id;
              const layoutHandler = servicio.id === 2 ? registrarSeccion('venta') : servicio.id === 3 ? registrarSeccion('inversion') : undefined;
              return (
                <View key={servicio.id} onLayout={layoutHandler} style={[styles.serviceCard, servicio.id === 4 && styles.serviceCardFeatured]}>
                  <Text style={styles.serviceNum}>{servicio.num}</Text>
                  <Text style={styles.serviceTag}>{servicio.tag}</Text>
                  <Text style={styles.serviceTitle}>
                    {servicio.titulo}{'\n'}<Text style={styles.serviceTitleEmphasis}>{servicio.tituloEm}</Text>
                  </Text>
                  <Text style={styles.serviceDesc}>{servicio.desc}</Text>

                  <View style={styles.featuresList}>
                    {servicio.features.map((feature) => (
                      <View key={feature} style={styles.featureRow}>
                        <View style={styles.featureBullet} />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  <Pressable onPress={() => setActivo((current) => (current === servicio.id ? null : servicio.id))} style={({ pressed }) => [styles.serviceLink, pressed && styles.serviceLinkPressed]}>
                    <Text style={styles.serviceLinkText}>{servicio.cta}</Text>
                  </Pressable>

                  {isOpen ? (
                    <View style={styles.contactPanel}>
                      <Text style={styles.contactLabel}>Un asesor se pondrá en contacto a la brevedad.</Text>
                      <View style={styles.contactRow}>
                        <Pressable onPress={() => abrirUrl(`tel:${CONTACT_PHONE}`)} style={({ pressed }) => [styles.contactButton, pressed && styles.contactButtonPressed]}>
                          <Text style={styles.contactButtonText}>Llamar Ahora</Text>
                        </Pressable>
                        <Pressable onPress={() => abrirUrl(CONTACT_WA)} style={({ pressed }) => [styles.contactButton, styles.contactButtonWa, pressed && styles.contactButtonPressed]}>
                          <Text style={[styles.contactButtonText, styles.contactButtonTextWa]}>WhatsApp</Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>

        <View style={[styles.section, styles.processSection]}>
          <View style={styles.sectionHeaderCenter}>
            <Text style={styles.sectionLabel}>Cómo Trabajamos</Text>
            <Text style={styles.sectionTitle}>
              Un proceso <Text style={styles.sectionEmphasis}>probado</Text>{'\n'}en más de 150 transacciones
            </Text>
          </View>

          <View style={styles.stepsList}>
            {[
              { num: 'I', titulo: 'Consulta Inicial', desc: 'Una reunión confidencial donde entendemos tu situación, objetivos y horizonte de tiempo. Sin compromisos, sin presiones.' },
              { num: 'II', titulo: 'Estrategia a Medida', desc: 'Diseñamos un plan de acción personalizado: propiedades a visitar, opciones de financiamiento o estrategia de posicionamiento.' },
              { num: 'III', titulo: 'Ejecución y Negociación', desc: 'Gestionamos cada detalle operativo y representamos tus intereses con la firmeza y discreción que el mercado premium exige.' },
              { num: 'IV', titulo: 'Cierre y Seguimiento', desc: 'Coordinamos la firma notarial, entrega de llaves y permanecemos disponibles durante los 5 años siguientes a la operación.' },
            ].map((paso) => (
              <View key={paso.num} style={styles.stepCard}>
                <Text style={styles.stepNum}>{paso.num}</Text>
                <Text style={styles.stepTitle}>{paso.titulo}</Text>
                <Text style={styles.stepDesc}>{paso.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section} onLayout={registrarSeccion('adicionales')}>
          <View style={styles.guaranteeGrid}>
            <View style={styles.guaranteeImageWrap}>
              <Image source={{ uri: GUARANTEE_IMAGE }} style={styles.guaranteeImage} resizeMode="cover" />
              <View style={styles.guaranteeImageLabel}>
                <Text style={styles.guaranteeImageLabelText}>"Cada operación cierra con nuestra firma de calidad."</Text>
              </View>
            </View>

            <View style={styles.guaranteeContent}>
              <Text style={styles.sectionLabel}>Nuestro Compromiso</Text>
              <Text style={styles.sectionTitle}>
                Garantías que{'\n'}nos <Text style={styles.sectionEmphasis}>distinguen</Text>
              </Text>

              <View style={styles.guaranteesList}>
                {GARANTIAS.map((garantia, index) => (
                  <View key={garantia.titulo} style={styles.guaranteeItem}>
                    <View style={styles.guaranteeIcon}>
                      <View style={styles.guaranteeIconDot} />
                      <View style={styles.guaranteeIconLine} />
                      <Text style={styles.guaranteeIconLabel}>{String(index + 1).padStart(2, '0')}</Text>
                    </View>
                    <View style={styles.guaranteeTextWrap}>
                      <Text style={styles.guaranteeTitle}>{garantia.titulo}</Text>
                      <Text style={styles.guaranteeDesc}>{garantia.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.section, styles.planesSection]}>
          <View style={styles.sectionHeaderCenter}>
            <Text style={styles.sectionLabel}>Planes de Servicio</Text>
            <Text style={styles.sectionTitle}>
              Elige el acompañamiento{'\n'}que <Text style={styles.sectionEmphasis}>necesitas</Text>
            </Text>
          </View>

          <View style={styles.planesList}>
            {PLANES.map((plan) => (
              <View key={plan.label} style={[styles.planCard, plan.featured && styles.planCardFeatured]}>
                <Text style={styles.planLabel}>{plan.label}</Text>
                <Text style={styles.planTitle}>{plan.titulo}</Text>
                <Text style={styles.planPrice}>{plan.precio}</Text>
                <View style={styles.planFeatures}>
                  {plan.features.map((feature) => (
                    <View key={feature} style={styles.featureRow}>
                      <View style={styles.featureBullet} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                <Pressable onPress={irLogin} style={({ pressed }) => [styles.planButton, pressed && styles.planButtonPressed]}>
                  <Text style={styles.planButtonText}>{plan.cta}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, styles.testimonialsSection]}>
          <View style={styles.sectionHeaderCenter}>
            <Text style={styles.sectionLabel}>Lo que dicen nuestros clientes</Text>
            <Text style={styles.sectionTitle}>
              La experiencia{'\n'}<Text style={styles.sectionEmphasis}>INMOVIRAL</Text>
            </Text>
          </View>

          <View style={styles.testimonialsList}>
            {TESTIMONIOS.map((testimonio) => (
              <View key={testimonio.nombre} style={styles.testimonialCard}>
                <Text style={styles.testimonialText}>{testimonio.texto}</Text>
                <View style={styles.testimonialDivider} />
                <Text style={styles.testimonialName}>{testimonio.nombre}</Text>
                <Text style={styles.testimonialRole}>{testimonio.rol}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.ctaSection}>
          <Text style={styles.ctaEyebrow}>Da el Primer Paso</Text>
          <Text style={styles.ctaTitle}>
            ¿Con cuál de nuestros{'\n'}servicios podemos <Text style={styles.sectionEmphasis}>ayudarte?</Text>
          </Text>
          <Text style={styles.ctaSub}>Una consulta inicial es gratuita, confidencial y sin compromisos. Cuéntanos tu situación y diseñamos la mejor estrategia para ti.</Text>
          <Pressable onPress={irLogin} style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}>
            <Text style={styles.ctaButtonText}>Iniciar Sesión</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const COLORS = {
  bg: '#0A0A0A',
  surface: '#111110',
  surfaceAlt: '#151513',
  text: '#F5F5F0',
  muted: '#8A8A84',
  accent: '#A07840',
  gold: '#C39B5F',
  border: 'rgba(255,255,255,0.08)',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  hero: {
    minHeight: 480,
    justifyContent: 'flex-end',
    backgroundColor: COLORS.bg,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,10,0.68)',
  },
  heroContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  eyebrow: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '300',
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  heroEmphasis: {
    color: COLORS.gold,
    fontStyle: 'italic',
  },
  heroSub: {
    color: '#B2B2AA',
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 560,
  },
  tabsBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: '#151514',
  },
  tabButtonActive: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(160,120,64,0.12)',
  },
  tabButtonPressed: {
    opacity: 0.86,
  },
  tabButtonText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  tabButtonTextActive: {
    color: COLORS.text,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  sectionHeader: {
    marginBottom: 18,
  },
  sectionHeaderCenter: {
    marginBottom: 18,
    alignItems: 'center',
  },
  sectionLabel: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 31,
    lineHeight: 35,
    fontWeight: '300',
    letterSpacing: -0.2,
  },
  sectionEmphasis: {
    color: COLORS.gold,
    fontStyle: 'italic',
  },
  cardsList: {
    gap: 14,
  },
  serviceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
  },
  serviceCardFeatured: {
    borderColor: 'rgba(160,120,64,0.35)',
    backgroundColor: COLORS.surfaceAlt,
  },
  serviceNum: {
    color: 'rgba(160,120,64,0.24)',
    fontSize: 54,
    lineHeight: 54,
    fontWeight: '300',
    marginBottom: 8,
  },
  serviceTag: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.8,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  serviceTitle: {
    color: COLORS.text,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '300',
    marginBottom: 12,
  },
  serviceTitleEmphasis: {
    color: COLORS.gold,
    fontStyle: 'italic',
  },
  serviceDesc: {
    color: '#9A9A92',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  featuresList: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginTop: 6,
    marginRight: 10,
  },
  featureText: {
    flex: 1,
    color: '#9A9A92',
    fontSize: 13,
    lineHeight: 19,
  },
  serviceLink: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  serviceLinkPressed: {
    opacity: 0.7,
  },
  serviceLinkText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  contactPanel: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  contactLabel: {
    color: '#B2B2AA',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contactButton: {
    borderWidth: 1,
    borderColor: 'rgba(160,120,64,0.3)',
    borderRadius: 999,
    marginRight: 10,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  contactButtonWa: {
    borderColor: 'rgba(37,211,102,0.35)',
  },
  contactButtonPressed: {
    opacity: 0.84,
  },
  contactButtonText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  contactButtonTextWa: {
    color: 'rgba(37,211,102,0.9)',
  },
  processSection: {
    backgroundColor: COLORS.surface,
    paddingBottom: 6,
  },
  stepsList: {
    gap: 12,
  },
  stepCard: {
    backgroundColor: '#10100F',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
  },
  stepNum: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.accent,
    color: COLORS.accent,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    fontWeight: '300',
    marginBottom: 14,
    overflow: 'hidden',
    paddingTop: 10,
    backgroundColor: COLORS.surface,
  },
  stepTitle: {
    color: COLORS.text,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '300',
    marginBottom: 8,
  },
  stepDesc: {
    color: '#9A9A92',
    fontSize: 13,
    lineHeight: 20,
  },
  guaranteeGrid: {
    gap: 20,
  },
  guaranteeImageWrap: {
    minHeight: 320,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  guaranteeImage: {
    width: '100%',
    height: 320,
  },
  guaranteeImageLabel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 32,
    paddingBottom: 18,
    backgroundColor: 'rgba(10,10,10,0.82)',
  },
  guaranteeImageLabelText: {
    color: COLORS.text,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '300',
    fontStyle: 'italic',
  },
  guaranteeContent: {
    gap: 10,
  },
  guaranteesList: {
    gap: 16,
  },
  guaranteeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    paddingBottom: 16,
  },
  guaranteeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(160,120,64,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    position: 'relative',
    backgroundColor: COLORS.surface,
  },
  guaranteeIconDot: {
    position: 'absolute',
    top: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  guaranteeIconLine: {
    position: 'absolute',
    bottom: 12,
    width: 18,
    height: 1,
    backgroundColor: COLORS.accent,
  },
  guaranteeIconLabel: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  guaranteeTextWrap: {
    flex: 1,
  },
  guaranteeTitle: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  guaranteeDesc: {
    color: '#9A9A92',
    fontSize: 13,
    lineHeight: 20,
  },
  planesSection: {
    backgroundColor: '#0F0F0F',
  },
  planesList: {
    gap: 14,
  },
  planCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
  },
  planCardFeatured: {
    backgroundColor: COLORS.surfaceAlt,
    borderColor: 'rgba(160,120,64,0.35)',
  },
  planLabel: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  planPrice: {
    color: '#B2B2AA',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  planFeatures: {
    marginBottom: 18,
  },
  planButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accent,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  planButtonPressed: {
    opacity: 0.88,
  },
  planButtonText: {
    color: '#0A0A0A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  testimonialsSection: {
    backgroundColor: COLORS.bg,
  },
  testimonialsList: {
    gap: 14,
  },
  testimonialCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
  },
  testimonialText: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
    fontWeight: '300',
  },
  testimonialDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  testimonialName: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  testimonialRole: {
    color: '#9A9A92',
    fontSize: 12,
    lineHeight: 18,
  },
  ctaSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 20,
  },
  ctaEyebrow: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  ctaTitle: {
    color: COLORS.text,
    fontSize: 30,
    lineHeight: 35,
    textAlign: 'center',
    fontWeight: '300',
    marginBottom: 12,
  },
  ctaSub: {
    color: '#9A9A92',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 560,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  ctaButtonPressed: {
    opacity: 0.9,
  },
  ctaButtonText: {
    color: '#0A0A0A',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
});
