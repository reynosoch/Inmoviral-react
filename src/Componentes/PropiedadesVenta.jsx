import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../supabaseClient';

const FALLBACK = [
  { id: 1, titulo: 'Residencia Belvedere', ubicacion: 'Bosques de las Lomas, CDMX', precio: 18500000, habitaciones: 4, banos: 5, m2: 520, imagenes: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80&auto=format&fit=crop'] },
  { id: 2, titulo: 'Casa Almendro', ubicacion: 'San Ángel, CDMX', precio: 12900000, habitaciones: 3, banos: 4, m2: 380, imagenes: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop'] },
  { id: 3, titulo: 'Departamento Aurora', ubicacion: 'Polanco, CDMX', precio: 9800000, habitaciones: 3, banos: 3, m2: 240, imagenes: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&auto=format&fit=crop'] },
  { id: 4, titulo: 'Villa Cordoba', ubicacion: 'Valle de Bravo, EdoMex', precio: 22500000, habitaciones: 5, banos: 5, m2: 610, imagenes: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80&auto=format&fit=crop'] },
  { id: 5, titulo: 'Loft Obsidiana', ubicacion: 'Roma Norte, CDMX', precio: 7600000, habitaciones: 2, banos: 2, m2: 145, imagenes: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80&auto=format&fit=crop'] },
  { id: 6, titulo: 'Casa Mirador', ubicacion: 'Las Águilas, CDMX', precio: 15200000, habitaciones: 4, banos: 4, m2: 450, imagenes: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80&auto=format&fit=crop'] },
];

const HERO_IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=80&auto=format&fit=crop';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=70';

// Formatea números a "85,000" sin decimales
const formatPrecio = (num) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('es-MX', { maximumFractionDigits: 0 });
};

export default function PropiedadesVenta({ onVerPropiedad }) {
  const { t } = useTranslation();
  const [propiedades, setPropiedades] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [orden, setOrden] = useState('reciente');

  useEffect(() => {
    const cargar = async () => {
      const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('tipo_transaccion', 'Venta')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) setPropiedades(data);
      else setPropiedades(FALLBACK);
    };
    cargar();
  }, []);

  const lista = propiedades
    .filter(p =>
      filtro === '' ||
      p.titulo?.toLowerCase().includes(filtro.toLowerCase()) ||
      p.ubicacion?.toLowerCase().includes(filtro.toLowerCase())
    )
    .sort((a, b) => {
      if (orden === 'precio-asc') return (a.precio || 0) - (b.precio || 0);
      if (orden === 'precio-desc') return (b.precio || 0) - (a.precio || 0);
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

  const handleVerPropiedad = (propiedadId) => {
    if (typeof onVerPropiedad === 'function') {
      onVerPropiedad(propiedadId);
    }
  };

  const renderPropiedad = ({ item: p }) => (
    <Pressable
      onPress={() => handleVerPropiedad(p.id)}
      style={({ pressed }) => [styles.propCard, pressed && styles.propCardPressed]}
    >
      <View style={styles.propImageWrap}>
        <Image source={{ uri: p.imagenes?.[0] || FALLBACK_IMAGE }} style={styles.propImage} resizeMode="cover" />
        <View style={styles.propBadge}>
          <Text style={styles.propBadgeText}>{t('props_badge_venta')}</Text>
        </View>
      </View>

      <View style={styles.propBody}>
        <Text style={styles.propPrice}>${formatPrecio(p.precio)}</Text>
        <Text style={styles.propName} numberOfLines={2}>{p.titulo}</Text>
        <View style={styles.propLocation}>
          <Text style={styles.propLocationIcon}>📍</Text>
          <Text style={styles.propLocationText} numberOfLines={2}>{p.ubicacion}</Text>
        </View>
        <View style={styles.propSpecs}>
          <Text style={styles.propSpec}>🛏 {p.habitaciones} {t('props_rec')}</Text>
          <Text style={styles.propSpec}>🚿 {p.banos} {t('props_banos')}</Text>
          <Text style={styles.propSpec}>📐 {p.m2} m²</Text>
        </View>
        <Pressable onPress={() => handleVerPropiedad(p.id)} style={({ pressed }) => [styles.propButton, pressed && styles.propButtonPressed]}>
          <Text style={styles.propButtonText}>{t('props_ver_propiedad')}</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* HERO */}
        <View style={styles.hero}>
          <Image source={{ uri: HERO_IMAGE }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>{t('props_venta_eyebrow')}</Text>
            <Text style={styles.heroTitle}>
              {t('props_venta_title_1')} {'\n'}
              <Text style={styles.heroTitleEmphasis}>{t('props_venta_title_em')}</Text>
            </Text>
            <Text style={styles.heroSub}>{t('props_venta_sub')}</Text>
          </View>
        </View>

        {/* FILTROS */}
        <View style={styles.filtersSection}>
          <View style={styles.filtersInner}>
            <TextInput
              style={styles.searchInput}
              placeholder={t('props_search_ph')}
              placeholderTextColor="#A0AEC0"
              value={filtro}
              onChangeText={setFiltro}
            />
            <View style={styles.sortPickerWrap}>
              <Picker
                selectedValue={orden}
                onValueChange={setOrden}
                style={styles.sortPicker}
              >
                <Picker.Item label={t('props_sort_reciente')} value="reciente" />
                <Picker.Item label={t('props_sort_precio_asc')} value="precio-asc" />
                <Picker.Item label={t('props_sort_precio_desc')} value="precio-desc" />
              </Picker>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {lista.length} {lista.length !== 1 ? t('props_count_plural') : t('props_count_singular')}
              </Text>
            </View>
          </View>
        </View>

        {/* GRID */}
        <View style={styles.gridSection}>
          <FlatList
            data={lista}
            renderItem={renderPropiedad}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            numColumns={1}
          />
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
    paddingBottom: 20,
  },
  hero: {
    minHeight: 360,
    justifyContent: 'flex-end',
    backgroundColor: '#0A0A0A',
    overflow: 'hidden',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,10,0.60)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  heroEyebrow: {
    color: '#A07840',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  heroTitle: {
    color: '#F5F5F0',
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '300',
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  heroTitleEmphasis: {
    color: '#C39B5F',
    fontStyle: 'italic',
  },
  heroSub: {
    color: '#B2B2AA',
    fontSize: 14,
    lineHeight: 21,
    maxWidth: 520,
  },
  filtersSection: {
    backgroundColor: '#FAFAF8',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filtersInner: {
    paddingHorizontal: 16,
  },
  searchInput: {
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 12,
  },
  sortPickerWrap: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 44,
    marginBottom: 12,
    justifyContent: 'center',
  },
  sortPicker: {
    height: 44,
  },
  countBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
  },
  countText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '600',
  },
  gridSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  propCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 16,
  },
  propCardPressed: {
    opacity: 0.92,
  },
  propImageWrap: {
    position: 'relative',
    width: '100%',
    height: 200,
    backgroundColor: '#E2E8F0',
  },
  propImage: {
    width: '100%',
    height: '100%',
  },
  propBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  propBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  propBody: {
    padding: 16,
  },
  propPrice: {
    color: '#2563EB',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  propName: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 8,
  },
  propLocation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  propLocationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  propLocationText: {
    flex: 1,
    color: '#64748B',
    fontSize: 13,
    lineHeight: 18,
  },
  propSpecs: {
    flexDirection: 'column',
    gap: 6,
    marginBottom: 14,
  },
  propSpec: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
  },
  propButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  propButtonPressed: {
    opacity: 0.88,
  },
  propButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
