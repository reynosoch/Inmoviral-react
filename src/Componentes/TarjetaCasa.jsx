import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop';

function TarjetaCasa({ casa, titulo, precio, ubicacion, servicio, onVerPropiedad, onPress }) {
  const propiedad = casa ?? {};
  const imagen = propiedad.imagenes?.[0] || FALLBACK_IMAGE;
  const tituloVisible = propiedad.titulo || titulo || 'Propiedad';
  const precioVisible = propiedad.precio ?? precio ?? 0;
  const ubicacionVisible = propiedad.ubicacion || ubicacion || 'Ubicación no disponible';
  const servicioVisible = propiedad.servicio || servicio || 'Servicio personalizado';
  const accion = typeof onPress === 'function' ? onPress : typeof onVerPropiedad === 'function' ? () => onVerPropiedad(propiedad.id ?? propiedad.propiedadId) : undefined;
  const Container = accion ? Pressable : View;

  return (
    <Container
      onPress={accion}
      style={({ pressed } = {}) => [styles.card, pressed && styles.cardPressed]}
    >
      <Image source={{ uri: imagen }} style={styles.image} resizeMode="cover" />

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{tituloVisible}</Text>
        <Text style={styles.price}>${Number(precioVisible || 0).toLocaleString('es-MX', { maximumFractionDigits: 0 })}</Text>

        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText} numberOfLines={2}>{ubicacionVisible}</Text>
        </View>

        <View style={styles.tag}>
          <Text style={styles.tagText}>✨ Incluye: {servicioVisible}</Text>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#CBD5E1',
  },
  body: {
    padding: 16,
  },
  title: {
    color: '#0F172A',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  price: {
    color: '#2563EB',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    color: '#15803D',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
});

export default TarjetaCasa;