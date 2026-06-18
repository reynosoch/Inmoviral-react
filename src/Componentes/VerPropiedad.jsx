import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../supabaseClient';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&q=80&auto=format&fit=crop';

// Formatea números a "85,000" sin decimales
const formatPrecio = (num) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('es-MX', { maximumFractionDigits: 0 });
};

export default function VerPropiedad({ propiedadId, onVolver, tipoOrigen }) {
  const { t } = useTranslation();

  const [propiedad, setPropiedad] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [favorito, setFavorito] = useState(false);
  const [imagenActiva, setImagenActiva] = useState(0);

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('id', propiedadId)
        .single();

      if (!error && data) {
        setPropiedad(data);
      } else {
        setPropiedad(null);
      }
      setCargando(false);
    };
    if (propiedadId !== undefined && propiedadId !== null) {
      cargar();
    } else {
      setCargando(false);
    }
  }, [propiedadId]);

  if (cargando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A07840" />
        </View>
      </SafeAreaView>
    );
  }

  if (!propiedad) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundTitle}>{t('vp_not_found_title')}</Text>
          <Text style={styles.notFoundText}>{t('vp_not_found_text')}</Text>
          <Pressable
            onPress={() => onVolver && onVolver('venta')}
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          >
            <Text style={styles.backButtonText}>{t('vp_back')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const imagenes = propiedad.imagenes?.length
    ? propiedad.imagenes
    : [FALLBACK_IMAGE];

  const esRenta = propiedad.tipo_transaccion === 'Renta';
  const amenidades = propiedad.amenidades || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* IMAGEN PRINCIPAL */}
        <View style={styles.galleryMain}>
          <Image
            source={{ uri: imagenes[imagenActiva] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          
          {/* BADGE TIPO */}
          <View style={[styles.badge, esRenta ? styles.badgeRenta : styles.badgeVenta]}>
            <Text style={styles.badgeText}>
              {esRenta ? t('props_badge_renta') : t('props_badge_venta')}
            </Text>
          </View>

          {/* BOTÓN FAVORITO */}
          <Pressable
            onPress={() => setFavorito(!favorito)}
            style={({ pressed }) => [styles.favButton, pressed && styles.favButtonPressed]}
          >
            <Text style={styles.favButtonText}>{favorito ? '❤️' : '🤍'}</Text>
          </Pressable>

          {/* BOTÓN VOLVER */}
          <Pressable
            onPress={() => onVolver && onVolver(esRenta ? 'renta' : 'venta')}
            style={({ pressed }) => [styles.backButtonTop, pressed && styles.backButtonTopPressed]}
          >
            <Text style={styles.backButtonTopText}>{'←'}</Text>
          </Pressable>
        </View>

        {/* THUMBNAILS */}
        {imagenes.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbsContainer}>
            {imagenes.map((img, idx) => (
              <Pressable
                key={idx}
                onPress={() => setImagenActiva(idx)}
                style={[styles.thumb, imagenActiva === idx && styles.thumbActive]}
              >
                <Image source={{ uri: img }} style={styles.thumbImage} resizeMode="cover" />
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* HEADER - TÍTULO Y PRECIO */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.eyebrow}>{t('vp_eyebrow')}</Text>
            <Text style={styles.title}>{propiedad.titulo}</Text>
            <View style={styles.location}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText} numberOfLines={2}>{propiedad.ubicacion}</Text>
            </View>
          </View>
          <View style={styles.priceBlock}>
            <Text style={styles.price}>${formatPrecio(propiedad.precio)}</Text>
            <Text style={styles.priceNote}>{esRenta ? t('props_per_month') : t('vp_precio_total')}</Text>
          </View>
        </View>

        {/* SPECS GRID */}
        <View style={styles.specsGrid}>
          <View style={styles.specItem}>
            <Text style={styles.specIcon}>🛏</Text>
            <Text style={styles.specValue}>{propiedad.habitaciones}</Text>
            <Text style={styles.specLabel}>{t('props_rec')}</Text>
          </View>

          <View style={styles.specItem}>
            <Text style={styles.specIcon}>🚿</Text>
            <Text style={styles.specValue}>{propiedad.banos}</Text>
            <Text style={styles.specLabel}>{t('props_banos')}</Text>
          </View>

          <View style={styles.specItem}>
            <Text style={styles.specIcon}>📐</Text>
            <Text style={styles.specValue}>{propiedad.m2}</Text>
            <Text style={styles.specLabel}>m²</Text>
          </View>

          {propiedad.estacionamientos !== undefined && propiedad.estacionamientos !== null && (
            <View style={styles.specItem}>
              <Text style={styles.specIcon}>🚗</Text>
              <Text style={styles.specValue}>{propiedad.estacionamientos}</Text>
              <Text style={styles.specLabel}>{t('vp_estacionamiento')}</Text>
            </View>
          )}
        </View>

        {/* DESCRIPCIÓN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('vp_descripcion_title')}</Text>
          <Text style={styles.description}>
            {propiedad.descripcion || t('vp_descripcion_default')}
          </Text>
        </View>

        {/* AMENIDADES */}
        {amenidades.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('vp_amenidades_title')}</Text>
            <View style={styles.amenitiesGrid}>
              {amenidades.map((am, idx) => (
                <View key={idx} style={styles.amenityItem}>
                  <Text style={styles.amenityCheck}>✓</Text>
                  <Text style={styles.amenityText}>{am}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* CONTACTO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('vp_contact_title')}</Text>
          <Text style={styles.contactSub}>{t('vp_contact_sub')}</Text>

          {propiedad.agente_nombre && (
            <View style={styles.agentCard}>
              <View style={styles.agentAvatar}>
                <Text style={styles.agentAvatarText}>
                  {(propiedad.agente_nombre || 'A')[0].toUpperCase()}
                </Text>
              </View>
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>{propiedad.agente_nombre}</Text>
                <Text style={styles.agentRole}>{t('vp_agente_role')}</Text>
              </View>
            </View>
          )}

          <View style={styles.contactButtons}>
            {propiedad.agente_telefono && (
              <Pressable
                onPress={() => {}} // En RN real, usar Linking.openURL(`tel:...`)
                style={({ pressed }) => [styles.contactBtn, pressed && styles.contactBtnPressed]}
              >
                <Text style={styles.contactBtnIcon}>☎️</Text>
                <Text style={styles.contactBtnText}>{t('vp_llamar')}</Text>
              </Pressable>
            )}

            {propiedad.agente_whatsapp && (
              <Pressable
                onPress={() => {}} // En RN real, usar Linking.openURL(`https://wa.me/...`)
                style={({ pressed }) => [styles.contactBtn, pressed && styles.contactBtnPressed]}
              >
                <Text style={styles.contactBtnIcon}>💬</Text>
                <Text style={styles.contactBtnText}>WhatsApp</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  notFoundTitle: {
    color: '#0F172A',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  notFoundText: {
    color: '#64748B',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  backButtonPressed: {
    opacity: 0.88,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  galleryMain: {
    position: 'relative',
    width: '100%',
    height: 300,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  badgeVenta: {
    backgroundColor: '#DC2626',
  },
  badgeRenta: {
    backgroundColor: '#16A34A',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  favButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  favButtonPressed: {
    opacity: 0.85,
  },
  favButtonText: {
    fontSize: 24,
  },
  backButtonTop: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  backButtonTopPressed: {
    opacity: 0.85,
  },
  backButtonTopText: {
    fontSize: 20,
    color: '#0F172A',
    fontWeight: '600',
  },
  thumbsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAF8',
  },
  thumb: {
    width: 70,
    height: 70,
    marginHorizontal: 4,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  thumbActive: {
    borderColor: '#A07840',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  eyebrow: {
    color: '#A07840',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    color: '#0F172A',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 12,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  locationText: {
    flex: 1,
    color: '#64748B',
    fontSize: 13,
    lineHeight: 18,
  },
  priceBlock: {
    alignItems: 'flex-end',
  },
  price: {
    color: '#2563EB',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  priceNote: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
    gap: 12,
  },
  specItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  specIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  specValue: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  specLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  description: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 22,
  },
  amenitiesGrid: {
    flexDirection: 'column',
    gap: 10,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  amenityCheck: {
    fontSize: 18,
    color: '#16A34A',
    marginRight: 12,
    fontWeight: '700',
  },
  amenityText: {
    flex: 1,
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
  },
  contactSub: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
  },
  agentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#A07840',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  agentAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  agentRole: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    gap: 6,
  },
  contactBtnPressed: {
    opacity: 0.88,
  },
  contactBtnIcon: {
    fontSize: 16,
  },
  contactBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
