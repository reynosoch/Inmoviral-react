import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext.js';

// ── Counter component ────────────────────────────────────────────────────
function Counter({ label, value, onChange, min = 0, max = 10 }) {
  return (
    <View style={styles.counterField}>
      <Text style={styles.counterLabel}>{label}</Text>
      <View style={styles.counterRow}>
        <Pressable
          onPress={() => onChange(Math.max(min, value - 1))}
          style={({ pressed }) => [styles.counterBtn, pressed && styles.counterBtnPressed]}
        >
          <Text style={styles.counterBtnText}>−</Text>
        </Pressable>
        <Text style={styles.counterValue}>{value}</Text>
        <Pressable
          onPress={() => onChange(Math.min(max, value + 1))}
          style={({ pressed }) => [styles.counterBtn, pressed && styles.counterBtnPressed]}
        >
          <Text style={styles.counterBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ── Quick selector for tipo/operación ────────────────────────────────────
function OptionSelector({ label, options, value, onChange }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.optionGrid}>
        {options.map(opt => (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={[
              styles.optionButton,
              value === opt && styles.optionButtonActive
            ]}
          >
            <Text style={[styles.optionText, value === opt && styles.optionTextActive]}>
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function Vendedor({ onVolver }) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    tipo: '',
    operacion: '',
    calle: '',
    colonia: '',
    ciudad: '',
    estado: '',
    cp: '',
    pais: 'México',
    lat: '',
    lng: '',
    recamaras: 1,
    banos: 1,
    estacionamientos: 0,
    antiguedad: '',
    titulo: '',
    precio: '',
    superficie: '',
    descripcion: '',
    amenidades: [],
    servicios: [],
    nombre: '',
    telefono: '',
  });

  const [fotos, setFotos] = useState([]);
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');
  const [progresoSubida, setProgresoSubida] = useState('');

  // Pre-fill nombre/teléfono si el usuario está autenticado
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        nombre: prev.nombre || user.user_metadata?.full_name || '',
        telefono: prev.telefono || user.user_metadata?.phone || '',
      }));
    }
  }, [user]);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  // ── Funciones de fotos con Expo ImagePicker ──
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const espacio = 15 - fotos.length;
      const nuevas = result.assets.slice(0, espacio).map((asset, i) => ({
        id: `${asset.uri}-${i}`,
        uri: asset.uri,
        filename: asset.filename || `photo_${i}.jpg`,
      }));
      setFotos(prev => [...prev, ...nuevas]);
    }
  };

  const removeFoto = (id) => {
    setFotos(prev => prev.filter(f => f.id !== id));
  };

  // ── Toggle amenidades/servicios ──
  const toggleAmenidad = (k) =>
    setForm(prev => ({
      ...prev,
      amenidades: prev.amenidades.includes(k)
        ? prev.amenidades.filter(a => a !== k)
        : [...prev.amenidades, k],
    }));

  const toggleServicio = (k) =>
    setForm(prev => ({
      ...prev,
      servicios: prev.servicios.includes(k)
        ? prev.servicios.filter(s => s !== k)
        : [...prev.servicios, k],
    }));

  // ── Validación por paso ──
  const canNext = () => {
    if (step === 1) {
      return form.tipo && form.operacion && form.antiguedad && form.city;
    }
    if (step === 2) {
      return (
        form.titulo.trim() &&
        form.precio.trim() &&
        form.descripcion.trim() &&
        fotos.length >= 3
      );
    }
    return true;
  };

  // ── Submit handler ──
  const handleSubmit = async () => {
    if (step < 4) {
      if (canNext()) setStep(s => s + 1);
      return;
    }

    setErrorEnvio('');
    setEnviando(true);

    try {
      // Construir ubicación legible
      const ubicacion = [form.colonia, form.ciudad, form.estado]
        .filter(Boolean)
        .join(', ');

      // Mapear operación -> tipo_transaccion
      let tipoTransaccion = 'Venta';
      if (form.operacion === 'Renta') tipoTransaccion = 'Renta';
      else if (form.operacion === 'Ambas') tipoTransaccion = 'Venta';

      // Limpiar precio
      const precioNumerico =
        parseFloat(String(form.precio).replace(/[^\d.]/g, '')) || 0;

      // Subir fotos
      const urlsImagenes = [];
      for (let i = 0; i < fotos.length; i++) {
        setProgresoSubida(
          t('vw_subiendo_foto', {
            current: i + 1,
            total: fotos.length,
            defaultValue: `Subiendo foto ${i + 1} de ${fotos.length}...`,
          })
        );

        const foto = fotos[i];
        const ext = foto.filename.split('.').pop();
        const path = `${user?.id || 'anonimo'}/${Date.now()}_${i}.${ext}`;

        // Leer la imagen como blob
        const response = await fetch(foto.uri);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from('propiedades')
          .upload(path, blob, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('propiedades')
          .getPublicUrl(path);

        urlsImagenes.push(publicUrlData.publicUrl);
      }
      setProgresoSubida('');

      // Insertar propiedad
      const nuevaPropiedad = {
        user_id: user?.id || null,
        propietario_id: user?.id || null,
        titulo: form.titulo,
        tipo_transaccion: tipoTransaccion,
        operacion: form.operacion,
        tipo_inmueble: form.tipo,
        precio: precioNumerico,
        ubicacion,
        calle: form.calle,
        colonia: form.colonia,
        ciudad: form.ciudad,
        estado: form.estado,
        cp: form.cp,
        pais: form.pais,
        lat: form.lat ? parseFloat(form.lat) : null,
        lng: form.lng ? parseFloat(form.lng) : null,
        habitaciones: form.recamaras,
        banos: form.banos,
        estacionamientos: form.estacionamientos,
        antiguedad: form.antiguedad,
        m2: form.superficie
          ? parseFloat(String(form.superficie).replace(/[^\d.]/g, ''))
          : null,
        descripcion: form.descripcion,
        amenidades: form.amenidades,
        servicios_solicitados: form.servicios,
        imagenes: urlsImagenes,
        nombre_contacto: form.nombre,
        telefono_contacto: form.telefono,
        estatus: 'pendiente',
      };

      const { error: insertError } = await supabase
        .from('propiedades')
        .insert([nuevaPropiedad]);

      if (insertError) throw insertError;

      setEnviado(true);
    } catch (err) {
      console.error('Error al publicar propiedad:', err);
      setErrorEnvio(
        err.message ||
        t('vw_error_publicar', {
          defaultValue: 'Ocurrió un error al publicar tu propiedad. Intenta de nuevo.',
        })
      );
    } finally {
      setEnviando(false);
      setProgresoSubida('');
    }
  };

  const AMENIDADES_KEYS = Array.from({ length: 12 }, (_, i) => `vw_am_${i + 1}`);
  const SERVICIOS = [
    { key: 'mudanza', label: t('vw_srv1_title', { defaultValue: 'Mudanza' }) },
    { key: 'redes', label: t('vw_srv2_title', { defaultValue: 'Redes' }) },
    { key: 'fotografia', label: t('vw_srv3_title', { defaultValue: 'Fotografía' }) },
    { key: 'asesor', label: t('vw_srv4_title', { defaultValue: 'Asesor' }) },
  ];

  if (enviado) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>{t('vw_publicado_msg', { defaultValue: '¡Propiedad publicada!' })}</Text>
          <Text style={styles.successText}>
            {t('vw_publicado_anonimo', {
              defaultValue: 'Tu propiedad ha sido publicada correctamente.',
            })}
          </Text>
          <Pressable
            onPress={onVolver}
            style={({ pressed }) => [styles.successButton, pressed && styles.successButtonPressed]}
          >
            <Text style={styles.successButtonText}>{t('vw_volver', { defaultValue: 'Volver' })}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#0A0A0A" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HERO SECTION */}
          <View style={styles.hero}>
            <Text style={styles.heroOverline}>{t('vd_eyebrow', { defaultValue: 'Publicar Propiedad' })}</Text>
            <Text style={styles.heroTitle}>
              {t('vd_h1_1', { defaultValue: 'Publica tu' })} {'\n'}
              {t('vd_h1_2', { defaultValue: 'propiedad' })} <Text style={styles.heroTitleEmphasis}>{t('vd_h1_em', { defaultValue: 'premium' })}</Text>
            </Text>
            <Text style={styles.heroSubtitle}>
              {t('vd_hero_sub', { defaultValue: 'Llega a miles de compradores e inversionistas.' })}
            </Text>
          </View>

          {/* PROGRESS INDICATOR */}
          <View style={styles.progressContainer}>
            {[1, 2, 3, 4].map(num => (
              <View key={num} style={styles.progressStep}>
                <View
                  style={[
                    styles.progressCircle,
                    step >= num && styles.progressCircleActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.progressNum,
                      step >= num && styles.progressNumActive,
                    ]}
                  >
                    {num}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* PASO 1 */}
          {step === 1 && (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>{t('vw_step1_label', { defaultValue: 'Tipo de Propiedad' })}</Text>

              <OptionSelector
                label={t('vd_f_tipo', { defaultValue: 'Tipo' })}
                options={['Casa', 'Departamento', 'Terreno', 'Local Comercial']}
                value={form.tipo}
                onChange={v => set('tipo', v)}
              />

              <OptionSelector
                label={t('vd_f_operacion', { defaultValue: 'Operación' })}
                options={['Venta', 'Renta', 'Ambas']}
                value={form.operacion}
                onChange={v => set('operacion', v)}
              />

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{t('vd_f_ciudad', { defaultValue: 'Ciudad' })}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Ciudad de México"
                  placeholderTextColor="#8A8A84"
                  value={form.ciudad}
                  onChangeText={v => set('city', v) || set('ciudad', v)}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{t('vd_f_estado', { defaultValue: 'Estado' })}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. CDMX"
                  placeholderTextColor="#8A8A84"
                  value={form.estado}
                  onChangeText={v => set('estado', v)}
                />
              </View>

              <Counter
                label={t('vw_recamaras', { defaultValue: 'Recámaras' })}
                value={form.recamaras}
                onChange={v => set('recamaras', v)}
              />
              <Counter
                label={t('vw_banos', { defaultValue: 'Baños' })}
                value={form.banos}
                onChange={v => set('banos', v)}
              />
              <Counter
                label={t('vw_estacionamientos', { defaultValue: 'Estacionamientos' })}
                value={form.estacionamientos}
                onChange={v => set('estacionamientos', v)}
                min={0}
              />

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{t('vw_antiguedad', { defaultValue: 'Antigüedad' })}</Text>
                <View style={styles.optionGrid}>
                  {['Nueva', 'Menos de 5 años', '5-10 años', '10-20 años', 'Más de 20 años'].map(
                    opt => (
                      <Pressable
                        key={opt}
                        onPress={() => set('antiguedad', opt)}
                        style={[
                          styles.optionButton,
                          form.antiguedad === opt && styles.optionButtonActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            form.antiguedad === opt && styles.optionTextActive,
                          ]}
                        >
                          {opt}
                        </Text>
                      </Pressable>
                    )
                  )}
                </View>
              </View>
            </View>
          )}

          {/* PASO 2 */}
          {step === 2 && (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>{t('vw_step2_label', { defaultValue: 'Detalles' })}</Text>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{t('vw_titulo', { defaultValue: 'Título' })}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('vw_titulo_ph', { defaultValue: 'Ej. Casa moderna con jardín' })}
                  placeholderTextColor="#8A8A84"
                  value={form.titulo}
                  onChangeText={v => set('titulo', v)}
                  maxLength={80}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{t('vd_f_precio', { defaultValue: 'Precio' })}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="$0,000,000"
                  placeholderTextColor="#8A8A84"
                  keyboardType="decimal-pad"
                  value={form.precio}
                  onChangeText={v => set('precio', v)}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{t('vd_f_superficie', { defaultValue: 'Superficie (m²)' })}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="000"
                  placeholderTextColor="#8A8A84"
                  keyboardType="decimal-pad"
                  value={form.superficie}
                  onChangeText={v => set('superficie', v)}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{t('vd_f_descripcion', { defaultValue: 'Descripción' })}</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  placeholder={t('vd_f_descripcion_ph', { defaultValue: 'Describe tu propiedad...' })}
                  placeholderTextColor="#8A8A84"
                  value={form.descripcion}
                  onChangeText={v => set('descripcion', v)}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>

              {/* FOTOS */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{t('vw_fotos_label', { defaultValue: 'Fotos' })}</Text>
                <Text style={styles.fieldSubtext}>
                  {fotos.length}/15 {t('vw_fotos_sub', { defaultValue: 'fotos (mínimo 3)' })}
                </Text>

                <View style={styles.fotosGrid}>
                  {fotos.map((f, i) => (
                    <View key={f.id} style={styles.fotoItem}>
                      <Image source={{ uri: f.uri }} style={styles.fotoImage} />
                      {i === 0 && <Text style={styles.fotoCover}>{t('vw_fotos_portada', { defaultValue: 'Portada' })}</Text>}
                      <Pressable
                        onPress={() => removeFoto(f.id)}
                        style={styles.fotoRemove}
                      >
                        <Text style={styles.fotoRemoveText}>✕</Text>
                      </Pressable>
                    </View>
                  ))}

                  {fotos.length < 15 && (
                    <Pressable
                      onPress={pickImages}
                      style={styles.fotoAdd}
                    >
                      <Text style={styles.fotoAddText}>+</Text>
                    </Pressable>
                  )}
                </View>

                {fotos.length < 3 && (
                  <Text style={styles.fotoWarning}>
                    ⚠ {t('vw_fotos_min_warning', { defaultValue: 'Se requieren al menos 3 fotos' })}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* PASO 3 */}
          {step === 3 && (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>{t('vw_amenidades_label', { defaultValue: 'Amenidades' })}</Text>

              <View style={styles.chipsGrid}>
                {AMENIDADES_KEYS.map(k => {
                  const active = form.amenidades.includes(k);
                  return (
                    <Pressable
                      key={k}
                      onPress={() => toggleAmenidad(k)}
                      style={[styles.chip, active && styles.chipActive]}
                    >
                      {active && <Text style={styles.chipCheck}>✓</Text>}
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>
                        {t(k, { defaultValue: k })}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* PASO 4 */}
          {step === 4 && (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>{t('vw_servicios_label', { defaultValue: 'Servicios' })}</Text>

              <View style={styles.servicesGrid}>
                {SERVICIOS.map(s => {
                  const active = form.servicios.includes(s.key);
                  return (
                    <Pressable
                      key={s.key}
                      onPress={() => toggleServicio(s.key)}
                      style={[styles.serviceCard, active && styles.serviceCardActive]}
                    >
                      <Text style={styles.serviceTitle}>{s.label}</Text>
                      <Text style={styles.serviceTag}>
                        {active ? `✓ ${t('vw_srv_incluido', { defaultValue: 'Incluido' })}` : `+ ${t('vw_srv_agregar', { defaultValue: 'Agregar' })}`}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{t('vd_f_nombre', { defaultValue: 'Nombre' })}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('vd_f_nombre_ph', { defaultValue: 'Tu nombre completo' })}
                  placeholderTextColor="#8A8A84"
                  value={form.nombre}
                  onChangeText={v => set('nombre', v)}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{t('vd_f_telefono', { defaultValue: 'Teléfono' })}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+52 000 000 0000"
                  placeholderTextColor="#8A8A84"
                  keyboardType="phone-pad"
                  value={form.telefono}
                  onChangeText={v => set('telefono', v)}
                />
              </View>

              {errorEnvio && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{errorEnvio}</Text>
                </View>
              )}
            </View>
          )}

          {/* NAVIGATION BUTTONS */}
          <View style={styles.navRow}>
            {step > 1 && !enviando && (
              <Pressable
                onPress={() => setStep(s => s - 1)}
                style={({ pressed }) => [styles.btnSecondary, pressed && styles.btnSecondaryPressed]}
              >
                <Text style={styles.btnSecondaryText}>{t('vw_anterior', { defaultValue: 'Atrás' })}</Text>
              </Pressable>
            )}
            <Pressable
              onPress={handleSubmit}
              disabled={!canNext() || enviando}
              style={({ pressed }) => [
                styles.btnPrimary,
                (!canNext() || enviando) && styles.btnPrimaryDisabled,
                pressed && styles.btnPrimaryPressed,
              ]}
            >
              {enviando ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.btnPrimaryText}>
                  {progresoSubida
                    ? progresoSubida
                    : step < 4
                      ? t('vw_siguiente', { defaultValue: 'Siguiente' })
                      : t('vw_publicar_btn', { defaultValue: 'Publicar' })}
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  hero: {
    marginBottom: 24,
  },
  heroOverline: {
    color: '#A07840',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroTitle: {
    color: '#F5F5F0',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 36,
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  heroTitleEmphasis: {
    color: '#C39B5F',
    fontStyle: 'italic',
  },
  heroSubtitle: {
    color: '#B2B2AA',
    fontSize: 13,
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  progressStep: {
    flex: 1,
    alignItems: 'center',
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleActive: {
    borderColor: '#A07840',
    backgroundColor: 'rgba(160, 120, 64, 0.2)',
  },
  progressNum: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
  },
  progressNumActive: {
    color: '#A07840',
  },
  formContainer: {
    marginBottom: 32,
  },
  formTitle: {
    color: '#F5F5F0',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: -0.2,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    color: '#F5F5F0',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  fieldSubtext: {
    color: '#64748B',
    fontSize: 11,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#F5F5F0',
    fontSize: 14,
    fontWeight: '400',
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  counterField: {
    marginBottom: 18,
  },
  counterLabel: {
    color: '#F5F5F0',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(160, 120, 64, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtnPressed: {
    opacity: 0.7,
  },
  counterBtnText: {
    color: '#A07840',
    fontSize: 18,
    fontWeight: '700',
  },
  counterValue: {
    color: '#F5F5F0',
    fontSize: 16,
    fontWeight: '700',
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    minWidth: '48%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  optionButtonActive: {
    borderColor: '#A07840',
    backgroundColor: 'rgba(160, 120, 64, 0.2)',
  },
  optionText: {
    color: '#B2B2AA',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  optionTextActive: {
    color: '#A07840',
  },
  fotosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fotoItem: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
    position: 'relative',
  },
  fotoImage: {
    width: '100%',
    height: '100%',
  },
  fotoCover: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(160, 120, 64, 0.9)',
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  fotoRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fotoRemoveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  fotoAdd: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(160, 120, 64, 0.4)',
    backgroundColor: 'rgba(160, 120, 64, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fotoAddText: {
    color: '#A07840',
    fontSize: 28,
    fontWeight: '700',
  },
  fotoWarning: {
    color: '#DC2626',
    fontSize: 11,
    marginTop: 8,
    fontWeight: '500',
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipActive: {
    borderColor: '#A07840',
    backgroundColor: 'rgba(160, 120, 64, 0.15)',
  },
  chipCheck: {
    color: '#A07840',
    fontSize: 12,
    fontWeight: '700',
  },
  chipText: {
    color: '#B2B2AA',
    fontSize: 11,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#A07840',
  },
  servicesGrid: {
    gap: 10,
  },
  serviceCard: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceCardActive: {
    borderColor: '#A07840',
    backgroundColor: 'rgba(160, 120, 64, 0.1)',
  },
  serviceTitle: {
    color: '#F5F5F0',
    fontSize: 13,
    fontWeight: '700',
  },
  serviceTag: {
    color: '#A07840',
    fontSize: 10,
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  errorText: {
    color: '#F5F5F0',
    fontSize: 12,
    lineHeight: 18,
  },
  navRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  btnSecondary: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  btnSecondaryPressed: {
    opacity: 0.8,
  },
  btnSecondaryText: {
    color: '#F5F5F0',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  btnPrimary: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  btnPrimaryPressed: {
    opacity: 0.88,
  },
  btnPrimaryDisabled: {
    opacity: 0.5,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  successTitle: {
    color: '#F5F5F0',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  successText: {
    color: '#B2B2AA',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  successButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
  },
  successButtonPressed: {
    opacity: 0.88,
  },
  successButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

// ── Nominatim autocomplete hook ───────────────────────────────────────────────
function useNominatim() {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [open, setOpen]         = useState(false);
  const timer = useRef(null);

  const search = useCallback((q) => {
    setQuery(q);
    setOpen(true);
    clearTimeout(timer.current);
    if (q.length < 3) { setResults([]); return; }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(q)}`,
          { headers: { 'Accept-Language': 'es', 'User-Agent': 'InmoViral/1.0' } }
        );
        const data = await res.json();
        setResults(data);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 420);
  }, []);

  const clear = () => { setQuery(''); setResults([]); setOpen(false); };

  return { query, results, loading, open, search, setOpen, clear };
}

// ── MapaPicker: mapa interactivo con marcador arrastrable ─────────────────────
function MapaPicker({ lat, lng, onChange, onConfirm, confirmed }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const wrapperRef = useRef(null);
  const containerId = useRef(`map-${Math.random().toString(36).slice(2)}`);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const internalChange = useRef(false);

  // Reverse geocoding: dada una lat/lng obtiene los campos de dirección
  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lng}`,
        { headers: { 'Accept-Language': 'es', 'User-Agent': 'InmoViral/1.0' } }
      );
      const data = await res.json();
      if (data && data.address) {
        const a = data.address;
        return {
          calle:   [a.road, a.house_number].filter(Boolean).join(' ') || '',
          colonia: a.suburb || a.neighbourhood || a.quarter || '',
          ciudad:  a.city || a.town || a.village || a.municipality || '',
          estado:  a.state || '',
          cp:      a.postcode || '',
          pais:    a.country || '',
          busqueda: data.display_name || '',
        };
      }
    } catch { /* silencioso */ }
    return null;
  }, []);

  useEffect(() => {
    // Cargar Leaflet dinámicamente si no está ya cargado
    const loadLeaflet = async () => {
      if (!window.L) {
        // Inyectar CSS de Leaflet
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }
        // Inyectar JS de Leaflet
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const L = window.L;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const initLat = lat || 28.6353;
      const initLng = lng || -106.0889;
      const initZoom = lat ? 16 : 12;

      const map = L.map(containerId.current).setView([initLat, initLng], initZoom);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Icono personalizado
      const makeIcon = (active) => L.divIcon({
        className: '',
        html: `<div style="
          width:32px;height:32px;
          background:${active ? '#b8966a' : '#888'};
          border:3px solid #fff;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 2px 8px rgba(0,0,0,0.35);
          transition: background 0.3s;
        "></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([initLat, initLng], { draggable: true, icon: makeIcon(false) }).addTo(map);
      markerRef.current = marker;

      const handlePosChange = async (newLat, newLng) => {
        marker.setIcon(makeIcon(true));
        internalChange.current = true;
        onChange(newLat, newLng);
        const addr = await reverseGeocode(newLat, newLng);
        onConfirm(newLat, newLng, addr);
      };

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        handlePosChange(pos.lat, pos.lng);
      });

      map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        handlePosChange(e.latlng.lat, e.latlng.lng);
      });
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Solo montar una vez

  // Actualizar posición si lat/lng cambia externamente (nueva búsqueda Nominatim)
  useEffect(() => {
    if (internalChange.current) {
      internalChange.current = false;
      return;
    }
    if (mapInstanceRef.current && markerRef.current && lat && lng) {
      markerRef.current.setLatLng([lat, lng]);
      mapInstanceRef.current.setView([lat, lng], 16);
    }
  }, [lat, lng]);

  // Ajustar tamaño del mapa al cambiar a/desde pantalla completa
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => mapInstanceRef.current.invalidateSize(), 100);
    }
  }, [isFullscreen]);

  // Cerrar pantalla completa con tecla ESC
  useEffect(() => {
    if (!isFullscreen) return;
    const onKeyDown = (e) => { if (e.key === 'Escape') setIsFullscreen(false); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFullscreen]);

  return (
    <div
      ref={wrapperRef}
      style={
        isFullscreen
          ? {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 9999,
              background: '#0d0d0b',
            }
          : { position: 'relative' }
      }
    >
      <div
        id={containerId.current}
        ref={mapRef}
        style={{
          width: '100%',
          height: isFullscreen ? '100%' : '280px',
          borderRadius: isFullscreen ? 0 : '10px',
          border: confirmed
            ? '1.5px solid var(--vd-gold, #b8966a)'
            : '1.5px solid rgba(220,80,80,0.45)',
          overflow: 'hidden',
          zIndex: 0,
          transition: 'border-color 0.3s',
        }}
      />

      {/* Botón de pantalla completa */}
      <button
        type="button"
        onClick={() => setIsFullscreen(f => !f)}
        aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1001,
          width: '34px',
          height: '34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(13,13,11,0.85)',
          border: '1px solid rgba(184,150,106,0.4)',
          borderRadius: '8px',
          color: 'var(--vd-gold, #b8966a)',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        {isFullscreen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M9 9 4 4M9 9H4m0-5v5m11 0 5-5m-5 5h5m0 5v-5M15 15l5 5m-5-5h5m0 5v-5M9 15l-5 5m5-5H4m0 5v-5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m11-5v3a2 2 0 0 0-2 2h-3" />
          </svg>
        )}
      </button>

      {/* Overlay de instrucción cuando aún no se ha confirmado */}
      {!confirmed && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(13,13,11,0.88)',
          border: '1px solid rgba(220,80,80,0.4)',
          color: '#e08a8a',
          fontSize: '0.62rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '0.5rem 1rem',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 1000,
        }}>
          📍 Toca el mapa o arrastra el pin para confirmar tu ubicación
        </div>
      )}
      {confirmed && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(13,13,11,0.88)',
          border: '1px solid rgba(184,150,106,0.4)',
          color: 'var(--vd-gold, #b8966a)',
          fontSize: '0.62rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '0.5rem 1rem',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 1000,
        }}>
          ✓ Ubicación confirmada
        </div>
      )}
    </div>
  );
}

// ── Counter (Recámaras / Baños / Estacionamientos) ────────────────────────────
function Counter({ label, value, onChange, min = 0, max = 10 }) {
  return (
    <div className="vd-field">
      <label>{label}</label>
      <div className="vw-counter">
        <button type="button" className="vw-counter-btn" onClick={() => onChange(Math.max(min, value - 1))}>−</button>
        <span className="vw-counter-val">{value}</span>
        <button type="button" className="vw-counter-btn" onClick={() => onChange(Math.min(max, value + 1))}>+</button>
      </div>
    </div>
  );
}

// ── Iconos de servicios virales ───────────────────────────────────────────────
const IconMudanza = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="7" width="14" height="10" rx="1"/><path d="M15 10h3l3 3v4h-6z"/><circle cx="6" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>
  </svg>
);
const IconRedes = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/>
    <line x1="8.6" y1="10.6" x2="15.4" y2="7.4"/><line x1="8.6" y1="13.4" x2="15.4" y2="16.6"/>
  </svg>
);
const IconFoto = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
  </svg>
);
const IconAsesor = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/>
  </svg>
);

const AMENIDADES_KEYS = Array.from({ length: 20 }, (_, i) => `vw_am_${i + 1}`);

const SERVICIOS_VIRALES = [
  { key: 'mudanza',    titleKey: 'vw_srv1_title', descKey: 'vw_srv1_desc', icon: IconMudanza },
  { key: 'redes',      titleKey: 'vw_srv2_title', descKey: 'vw_srv2_desc', icon: IconRedes },
  { key: 'fotografia', titleKey: 'vw_srv3_title', descKey: 'vw_srv3_desc', icon: IconFoto },
  { key: 'asesor',     titleKey: 'vw_srv4_title', descKey: 'vw_srv4_desc', icon: IconAsesor },
];

export default function Vendedor({ onVolver }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const nom = useNominatim();
  const wrapRef = useRef(null);
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    tipo: '', operacion: '',
    busqueda: '',
    calle: '', colonia: '', ciudad: '', estado: '', cp: '', pais: '',
    lat: '', lng: '',
    recamaras: 1, banos: 1, estacionamientos: 0, antiguedad: '',
    titulo: '', precio: '', superficie: '', descripcion: '',
    amenidades: [], servicios: [],
    nombre: '', telefono: '',
  });
  const [fotos, setFotos] = useState([]);
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');
  const [progresoSubida, setProgresoSubida] = useState('');
  // El usuario debe mover/hacer click en el mapa para confirmar la ubicación
  const [mapaPinConfirmado, setMapaPinConfirmado] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);
  useEffect(() => { document.getElementById('publicar')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [step]);

  // Pre-rellena nombre/teléfono si el usuario ya inició sesión
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        nombre: prev.nombre || user.user_metadata?.full_name || '',
        telefono: prev.telefono || user.user_metadata?.phone || '',
      }));
    }
  }, [user]);

  // Cierra el dropdown si se hace click fuera
  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) nom.setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [nom]);

  // Limpia las URLs de las fotos al desmontar
  useEffect(() => () => fotos.forEach(f => URL.revokeObjectURL(f.url)), [fotos]);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  // Selecciona una sugerencia y rellena los campos
  const pickPlace = (place) => {
    const a = place.address || {};
    const calle    = [a.road, a.house_number].filter(Boolean).join(' ') || '';
    const colonia  = a.suburb || a.neighbourhood || a.quarter || '';
    const ciudad   = a.city || a.town || a.village || a.municipality || '';
    const estado   = a.state || '';
    const cp       = a.postcode || '';
    const pais     = a.country || '';
    const busqueda = place.display_name || '';

    setForm(prev => ({
      ...prev,
      busqueda, calle, colonia, ciudad, estado, cp, pais,
      lat: place.lat || '', lng: place.lon || '',
    }));
    // El pin se posiciona automáticamente, contar como confirmado
    if (place.lat && place.lon) setMapaPinConfirmado(true);
    nom.clear();
  };

  // ── Fotos ──
  const handleFotos = (e) => {
    const files = Array.from(e.target.files || []);
    const espacio = 15 - fotos.length;
    const nuevas = files.slice(0, espacio).map(f => ({
      id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2)}`,
      url: URL.createObjectURL(f),
      file: f,
    }));
    setFotos(prev => [...prev, ...nuevas]);
    e.target.value = '';
  };
  const removeFoto = (id) => {
    setFotos(prev => {
      const target = prev.find(f => f.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter(f => f.id !== id);
    });
  };

  // ── Amenidades y servicios (toggle) ──
  const toggleAmenidad = (k) => setForm(prev => ({
    ...prev,
    amenidades: prev.amenidades.includes(k) ? prev.amenidades.filter(a => a !== k) : [...prev.amenidades, k],
  }));
  const toggleServicio = (k) => setForm(prev => ({
    ...prev,
    servicios: prev.servicios.includes(k) ? prev.servicios.filter(s => s !== k) : [...prev.servicios, k],
  }));

  // ── Validación por paso ──
  const canNext = () => {
    if (step === 1) {
      return form.tipo && form.operacion && form.antiguedad && mapaPinConfirmado;
    }
    if (step === 2) {
      return form.titulo.trim() && form.precio.trim() && form.descripcion.trim() && fotos.length >= 3;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 4) {
      if (canNext()) setStep(s => s + 1);
      return;
    }

    setErrorEnvio('');
    setEnviando(true);

    try {
      // 1) Construir ubicación legible
      const ubicacion = [form.colonia, form.ciudad, form.estado]
        .filter(Boolean)
        .join(', ') || form.busqueda || form.calle;

      // 2) Mapear "operación" -> tipo_transaccion esperado por el CHECK constraint ('Venta' | 'Renta')
      let tipoTransaccion = 'Venta';
      if (form.operacion === 'Renta') tipoTransaccion = 'Renta';
      else if (form.operacion === 'Ambas') tipoTransaccion = 'Venta'; // se publica primero como venta

      // 3) Limpiar precio a numeric (quita $, comas, espacios, "/mes", etc.)
      const precioNumerico = parseFloat(String(form.precio).replace(/[^\d.]/g, '')) || 0;

      // 4) Subir fotos al bucket "propiedades" de Storage
      const urlsImagenes = [];
      for (let i = 0; i < fotos.length; i++) {
        setProgresoSubida(t('vw_subiendo_foto', { current: i + 1, total: fotos.length, defaultValue: `Subiendo foto ${i + 1} de ${fotos.length}...` }));
        const foto = fotos[i];
        const ext = foto.file.name.split('.').pop();
        const path = `${user?.id || 'anonimo'}/${Date.now()}_${i}.${ext}`;

        const { error: uploadError } = await supabase
          .storage
          .from('propiedades')
          .upload(path, foto.file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase
          .storage
          .from('propiedades')
          .getPublicUrl(path);

        urlsImagenes.push(publicUrlData.publicUrl);
      }
      setProgresoSubida('');

      // 5) Insertar la propiedad en la tabla "propiedades"
      const nuevaPropiedad = {
        user_id: user?.id || null,
        propietario_id: user?.id || null,
        titulo: form.titulo,
        tipo_transaccion: tipoTransaccion,
        operacion: form.operacion,
        tipo_inmueble: form.tipo,
        precio: precioNumerico,
        ubicacion,
        calle: form.calle,
        colonia: form.colonia,
        ciudad: form.ciudad,
        estado: form.estado,
        cp: form.cp,
        pais: form.pais,
        lat: form.lat ? parseFloat(form.lat) : null,
        lng: form.lng ? parseFloat(form.lng) : null,
        habitaciones: form.recamaras,
        banos: form.banos,
        estacionamientos: form.estacionamientos,
        antiguedad: form.antiguedad,
        m2: form.superficie ? parseFloat(String(form.superficie).replace(/[^\d.]/g, '')) : null,
        descripcion: form.descripcion,
        amenidades: form.amenidades,
        servicios_solicitados: form.servicios,
        imagenes: urlsImagenes,
        nombre_contacto: form.nombre,
        telefono_contacto: form.telefono,
        estatus: 'pendiente',
      };

      const { error: insertError } = await supabase
        .from('propiedades')
        .insert([nuevaPropiedad]);

      if (insertError) throw insertError;

      setEnviado(true);
    } catch (err) {
      console.error('Error al publicar propiedad:', err);
      setErrorEnvio(
        err.message || t('vw_error_publicar', { defaultValue: 'Ocurrió un error al publicar tu propiedad. Intenta de nuevo.' })
      );
    } finally {
      setEnviando(false);
      setProgresoSubida('');
    }
  };

  const BENEFICIOS = [
    {
      titulo: t('vd_b1_titulo'),
      desc: t('vd_b1_desc'),
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
    },
    {
      titulo: t('vd_b2_titulo'),
      desc: t('vd_b2_desc'),
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    },
    {
      titulo: t('vd_b3_titulo'),
      desc: t('vd_b3_desc'),
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    },
    {
      titulo: t('vd_b4_titulo'),
      desc: t('vd_b4_desc'),
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    },
  ];

  const PASOS = [
    { num: '01', titulo: t('vd_paso1_titulo'), desc: t('vd_paso1_desc'), activo: true  },
    { num: '02', titulo: t('vd_paso2_titulo'), desc: t('vd_paso2_desc'), activo: false },
    { num: '03', titulo: t('vd_paso3_titulo'), desc: t('vd_paso3_desc'), activo: false },
    { num: '04', titulo: t('vd_paso4_titulo'), desc: t('vd_paso4_desc'), activo: false },
  ];

  const WIZARD_STEPS = [
    { n: 1, label: t('vw_step1_label') },
    { n: 2, label: t('vw_step2_label') },
    { n: 3, label: t('vw_step3_label') },
    { n: 4, label: t('vw_step4_label') },
  ];

  const STEP_SUB = { 1: t('vw_step1_sub'), 2: t('vw_step2_sub'), 3: t('vw_step3_sub'), 4: t('vw_step4_sub') };

  return (
    <div className="vd-page">

      {/* ══ HERO ══ */}
      <div className="vd-hero">

        {/* IZQUIERDA */}
        <div className="vd-hero-left">
          <div className="vd-eyebrow">{t('vd_eyebrow')}</div>
          <h1 className="vd-h1">
            {t('vd_h1_1')}<br />{t('vd_h1_2')} <em>{t('vd_h1_em')}</em><br />{t('vd_h1_3')}
          </h1>
          <p className="vd-hero-sub">{t('vd_hero_sub')}</p>
          <a href="#publicar" className="vd-btn-primary">{t('vd_hero_btn')}</a>
        </div>

        {/* DERECHA — FORMULARIO / WIZARD */}
        <div className="vd-hero-right" id="publicar">
          <div className="vd-form-card">

            {!enviado && (
              <>
                <div className="vd-form-title">{t('vd_form_titulo')}</div>
                <div className="vd-form-subtitle">{STEP_SUB[step]}</div>

                {/* ── PROGRESS BAR ── */}
                <div className="vw-progress">
                  {WIZARD_STEPS.map((s, i) => (
                    <React.Fragment key={s.n}>
                      <div className={`vw-progress-step${step === s.n ? ' active' : ''}${step > s.n ? ' done' : ''}`}>
                        <div className="vw-progress-circle">
                          {step > s.n ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
                          ) : s.n}
                        </div>
                        <span className="vw-progress-label">{s.label}</span>
                      </div>
                      {i < WIZARD_STEPS.length - 1 && <div className={`vw-progress-line${step > s.n ? ' done' : ''}`} />}
                    </React.Fragment>
                  ))}
                </div>
              </>
            )}

            {enviado ? (
              <div className="vd-success">
                <svg viewBox="0 0 24 24" fill="none" stroke="#A07840" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="40" height="40">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <p>{t('vw_publicado_msg')}</p>
                {!user && (
                  <p className="vw-success-note">
                    {t('vw_publicado_anonimo', { defaultValue: 'Inicia sesión para administrar y editar tu propiedad desde tu cuenta.' })}
                  </p>
                )}
              </div>
            ) : (
              <form className="vd-form-grid" onSubmit={handleSubmit}>

                {/* ═══════ PASO 1 — PRINCIPALES ═══════ */}
                {step === 1 && (
                  <>
                    <div className="vd-field">
                      <label>{t('vd_f_tipo')}</label>
                      <select value={form.tipo} onChange={e => set('tipo', e.target.value)} required>
                        <option value="" disabled>{t('vd_f_seleccionar')}</option>
                        <option value="Casa">{t('vd_f_tipo_1')}</option>
                        <option value="Departamento">{t('vd_f_tipo_2')}</option>
                        <option value="Terreno">{t('vd_f_tipo_3')}</option>
                        <option value="Local Comercial">{t('vd_f_tipo_4')}</option>
                      </select>
                    </div>
                    <div className="vd-field">
                      <label>{t('vd_f_operacion')}</label>
                      <select value={form.operacion} onChange={e => set('operacion', e.target.value)} required>
                        <option value="" disabled>{t('vd_f_seleccionar')}</option>
                        <option value="Venta">{t('vd_f_op_1')}</option>
                        <option value="Renta">{t('vd_f_op_2')}</option>
                        <option value="Ambas">{t('vd_f_op_3')}</option>
                      </select>
                    </div>

                    <div className="vd-field vd-full">
                      <label>{t('vd_f_direccion')}</label>
                      <div className="vd-address-wrap" ref={wrapRef}>
                        <div className="vd-address-search-row">
                          <svg className="vd-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                          <input
                            className="vd-address-input"
                            type="text"
                            placeholder={t('vd_f_buscar_dir', { defaultValue: 'Busca una dirección, colonia o ciudad...' })}
                            value={nom.query || form.busqueda}
                            onChange={e => { set('busqueda', ''); nom.search(e.target.value); }}
                            onFocus={() => nom.query.length >= 3 && nom.setOpen(true)}
                            autoComplete="off"
                          />
                          {nom.loading && <span className="vd-search-spin" />}
                          {(nom.query || form.busqueda) && (
                            <button type="button" className="vd-search-clear" onClick={() => {
                              nom.clear();
                              setForm(prev => ({ ...prev, busqueda:'', calle:'', colonia:'', ciudad:'', estado:'', cp:'', pais:'', lat:'', lng:'' }));
                              setMapaPinConfirmado(false);
                            }}>✕</button>
                          )}
                        </div>

                        {nom.open && nom.results.length > 0 && (
                          <ul className="vd-suggestions">
                            {nom.results.map((r) => (
                              <li key={r.place_id} className="vd-suggestion-item" onMouseDown={() => pickPlace(r)}>
                                <svg className="vd-sug-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                <div>
                                  <div className="vd-sug-main">{r.name || r.display_name.split(',')[0]}</div>
                                  <div className="vd-sug-sub">{r.display_name}</div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                        {nom.open && !nom.loading && nom.query.length >= 3 && nom.results.length === 0 && (
                          <div className="vd-suggestions vd-no-results">
                            {t('vd_f_no_results', { defaultValue: 'Sin resultados. Intenta con otra búsqueda.' })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="vd-field vd-full">
                      <label>{t('vd_f_calle', { defaultValue: 'Calle y Número' })}</label>
                      <input type="text" value={form.calle} onChange={e => set('calle', e.target.value)} placeholder="Ej. Av. Insurgentes Sur 1234" />
                    </div>
                    <div className="vd-autofill-row">
                      <div className="vd-field">
                        <label>{t('vd_f_colonia', { defaultValue: 'Colonia / Barrio' })}</label>
                        <input type="text" value={form.colonia} onChange={e => set('colonia', e.target.value)} placeholder="Ej. Del Valle" />
                      </div>
                      <div className="vd-field">
                        <label>{t('vd_f_ciudad', { defaultValue: 'Ciudad' })}</label>
                        <input type="text" value={form.ciudad} onChange={e => set('ciudad', e.target.value)} placeholder="Ej. Ciudad de México" />
                      </div>
                      <div className="vd-field">
                        <label>{t('vd_f_estado', { defaultValue: 'Estado' })}</label>
                        <input type="text" value={form.estado} onChange={e => set('estado', e.target.value)} placeholder="Ej. CDMX" />
                      </div>
                      <div className="vd-field">
                        <label>CP</label>
                        <input type="text" value={form.cp} onChange={e => set('cp', e.target.value)} placeholder="00000" />
                      </div>
                    </div>

                    {/* ── MAPA DE UBICACIÓN — siempre visible ── */}
                    <div className="vd-field vd-full">
                      <label>{t('vd_f_mapa', { defaultValue: 'Confirma la ubicación en el mapa' })}</label>
                      <p className="vw-sub-text" style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--color-text-muted, #888)' }}>
                        {t('vd_f_mapa_sub', { defaultValue: 'Toca el mapa o arrastra el pin para marcar la ubicación exacta de tu propiedad. Este paso es obligatorio.' })}
                      </p>
                      <MapaPicker
                        lat={form.lat ? parseFloat(form.lat) : null}
                        lng={form.lng ? parseFloat(form.lng) : null}
                        confirmed={mapaPinConfirmado}
                        onChange={(lat, lng) => setForm(prev => ({ ...prev, lat: String(lat), lng: String(lng) }))}
                        onConfirm={(lat, lng, addr) => {
                          setMapaPinConfirmado(true);
                          setForm(prev => ({
                            ...prev,
                            lat: String(lat),
                            lng: String(lng),
                            // Actualiza los campos de dirección con la nueva ubicación
                            calle:   addr?.calle   ?? prev.calle,
                            colonia: addr?.colonia ?? prev.colonia,
                            ciudad:  addr?.ciudad  ?? prev.ciudad,
                            estado:  addr?.estado  ?? prev.estado,
                            cp:      addr?.cp      ?? prev.cp,
                            pais:    addr?.pais    ?? prev.pais,
                            busqueda: addr?.busqueda ?? prev.busqueda,
                          }));
                        }}
                      />
                      {!mapaPinConfirmado && (
                        <div style={{
                          marginTop: '6px',
                          fontSize: '0.62rem',
                          color: '#e08a8a',
                          letterSpacing: '0.08em',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                        }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          Debes seleccionar la ubicación en el mapa para continuar
                        </div>
                      )}
                    </div>

                    {/* Recámaras / Baños / Estacionamientos */}
                    <div className="vw-counters-row vd-full">
                      <Counter label={t('vw_recamaras')} value={form.recamaras} onChange={v => set('recamaras', v)} />
                      <Counter label={t('vw_banos')} value={form.banos} onChange={v => set('banos', v)} />
                      <Counter label={t('vw_estacionamientos')} value={form.estacionamientos} onChange={v => set('estacionamientos', v)} min={0} />
                    </div>

                    <div className="vd-field vd-full">
                      <label>{t('vw_antiguedad')}</label>
                      <select value={form.antiguedad} onChange={e => set('antiguedad', e.target.value)} required>
                        <option value="" disabled>{t('vw_antiguedad_ph')}</option>
                        <option value="nueva">{t('vw_antiguedad_opt0')}</option>
                        <option value="lt5">{t('vw_antiguedad_opt1')}</option>
                        <option value="5-10">{t('vw_antiguedad_opt2')}</option>
                        <option value="10-20">{t('vw_antiguedad_opt3')}</option>
                        <option value="gt20">{t('vw_antiguedad_opt4')}</option>
                      </select>
                    </div>
                  </>
                )}

                {/* ═══════ PASO 2 — CREAR PUBLICACIÓN ═══════ */}
                {step === 2 && (
                  <>
                    <div className="vd-field vd-full">
                      <label>{t('vw_titulo')}</label>
                      <input type="text" placeholder={t('vw_titulo_ph')} value={form.titulo} onChange={e => set('titulo', e.target.value)} required />
                    </div>
                    <div className="vd-field">
                      <label>{t('vd_f_precio')}</label>
                      <input type="text" placeholder="$0,000,000" value={form.precio} onChange={e => set('precio', e.target.value)} required />
                    </div>
                    <div className="vd-field">
                      <label>{t('vd_f_superficie')}</label>
                      <input type="text" placeholder="000 m²" value={form.superficie} onChange={e => set('superficie', e.target.value)} />
                    </div>
                    <div className="vd-field vd-full">
                      <label>{t('vd_f_descripcion')}</label>
                      <textarea placeholder={t('vd_f_descripcion_ph')} value={form.descripcion} onChange={e => set('descripcion', e.target.value)} required />
                    </div>

                    {/* FOTOS */}
                    <div className="vd-field vd-full">
                      <label>{t('vw_fotos_label')}</label>
                      <p className="vw-sub-text">{t('vw_fotos_sub')}</p>
                      <div className="vw-fotos-grid">
                        {fotos.map((f, i) => (
                          <div key={f.id} className="vw-foto-item">
                            <img src={f.url} alt="" />
                            {i === 0 && <span className="vw-foto-cover">{t('vw_fotos_portada')}</span>}
                            <button type="button" className="vw-foto-remove" onClick={() => removeFoto(f.id)}>✕</button>
                          </div>
                        ))}
                        {fotos.length < 15 && (
                          <button type="button" className="vw-foto-add" onClick={() => fileInputRef.current?.click()}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            <span>{t('vw_fotos_add')}</span>
                          </button>
                        )}
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFotos} />
                      <div className={`vw-fotos-counter${fotos.length < 3 ? ' warn' : ''}`}>
                        {t('vw_fotos_counter', { count: fotos.length })}
                        {fotos.length < 3 && <span> — {t('vw_fotos_min_warning')}</span>}
                      </div>
                    </div>
                  </>
                )}

                {/* ═══════ PASO 3 — EXTRAS ═══════ */}
                {step === 3 && (
                  <div className="vd-field vd-full">
                    <label>{t('vw_amenidades_label')}</label>
                    <p className="vw-sub-text">{t('vw_amenidades_sub')}</p>
                    <div className="vw-chips-grid">
                      {AMENIDADES_KEYS.map(k => {
                        const active = form.amenidades.includes(k);
                        return (
                          <button key={k} type="button" className={`vw-chip${active ? ' active' : ''}`} onClick={() => toggleAmenidad(k)}>
                            {active && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><polyline points="20 6 9 17 4 12"/></svg>}
                            {t(k)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ═══════ PASO 4 — PUBLICAR ═══════ */}
                {step === 4 && (
                  <>
                    <div className="vd-field vd-full">
                      <label>{t('vw_servicios_label')}</label>
                      <p className="vw-sub-text">{t('vw_servicios_sub')}</p>
                      <div className="vw-services-grid">
                        {SERVICIOS_VIRALES.map(s => {
                          const active = form.servicios.includes(s.key);
                          return (
                            <button key={s.key} type="button" className={`vw-service-card${active ? ' active' : ''}`} onClick={() => toggleServicio(s.key)}>
                              <div className="vw-service-icon">{s.icon}</div>
                              <div className="vw-service-title">{t(s.titleKey)}</div>
                              <p className="vw-service-desc">{t(s.descKey)}</p>
                              <span className="vw-service-tag">{active ? `✓ ${t('vw_srv_incluido')}` : `+ ${t('vw_srv_agregar')}`}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="vd-field">
                      <label>{t('vd_f_nombre')}</label>
                      <input type="text" placeholder={t('vd_f_nombre_ph')} value={form.nombre} onChange={e => set('nombre', e.target.value)} required />
                    </div>
                    <div className="vd-field">
                      <label>{t('vd_f_telefono')}</label>
                      <input type="tel" placeholder="+52 000 000 0000" value={form.telefono} onChange={e => set('telefono', e.target.value)} required />
                    </div>
                  </>
                )}

                {/* ── MENSAJE DE ERROR ── */}
                {errorEnvio && step === 4 && (
                  <div className="vd-field vd-full">
                    <div className="vw-error-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {errorEnvio}
                    </div>
                  </div>
                )}

                {/* ── NAVEGACIÓN ── */}
                <div className="vw-nav-row vd-full">
                  {step > 1 && !enviando && (
                    <button type="button" className="vw-btn-prev" onClick={() => setStep(s => s - 1)}>
                      {t('vw_anterior')}
                    </button>
                  )}
                  <button type="submit" className="vd-submit-btn vw-btn-next" disabled={!canNext() || enviando}>
                    {enviando
                      ? (progresoSubida || t('vw_publicando', { defaultValue: 'Publicando...' }))
                      : (step < 4 ? t('vw_siguiente') : t('vw_publicar_btn'))}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ══ PROCESO ══ */}
      <section className="vd-process">
        <div className="vd-section-label">{t('vd_proceso_label')}</div>
        <h2 className="vd-section-title">
          {t('vd_proceso_titulo_1')}<br />{t('vd_proceso_titulo_2')}
        </h2>
        <div className="vd-process-grid">
          <div className="vd-process-line" />
          {PASOS.map(p => (
            <div key={p.num} className="vd-step">
              <div className={`vd-step-num${p.activo ? ' active' : ''}`}>{p.num}</div>
              <div className="vd-step-title">{p.titulo}</div>
              <p className="vd-step-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ STATS ══ */}
      <div className="vd-stats">
        {[
          [t('vd_stat1_num'), t('vd_stat1_unit'), t('vd_stat1_lbl'), t('vd_stat1_sub')],
          [t('vd_stat2_num'), t('vd_stat2_unit'), t('vd_stat2_lbl'), t('vd_stat2_sub')],
          [t('vd_stat3_num'), t('vd_stat3_unit'), t('vd_stat3_lbl'), t('vd_stat3_sub')],
          [t('vd_stat4_num'), t('vd_stat4_unit'), t('vd_stat4_lbl'), t('vd_stat4_sub')],
        ].map(([num, unit, lbl, sub]) => (
          <div key={lbl} className="vd-stat">
            <div className="vd-stat-num">{num}<span>{unit}</span></div>
            <div className="vd-stat-label">{lbl}</div>
            <div className="vd-stat-sub">{sub}</div>
          </div>
        ))}
      </div>

      {/* ══ BENEFICIOS ══ */}
      <section className="vd-benefits">
        <div className="vd-section-label">{t('vd_ben_label')}</div>
        <h2 className="vd-section-title vd-cream">
          {t('vd_ben_titulo_1')}<br /><em>{t('vd_ben_titulo_2')}</em>
        </h2>
        <div className="vd-benefits-grid">
          {BENEFICIOS.map(b => (
            <div key={b.titulo} className="vd-benefit-card">
              <div className="vd-benefit-icon">{b.svg}</div>
              <div>
                <div className="vd-benefit-title">{b.titulo}</div>
                <p className="vd-benefit-desc">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section className="vd-cta">
        <h2>{t('vd_cta_titulo_1')}<br />{t('vd_cta_titulo_2')}</h2>
        <p>{t('vd_cta_sub')}</p>
        <a href="#publicar" className="vd-btn-dark">{t('vd_cta_btn')}</a>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="vd-footer">
        <div className="vd-footer-logo">I N M O V I R A L</div>
        <div className="vd-footer-copy">{t('footer_rights')}</div>
        <button className="vd-back-link" onClick={onVolver}>← {t('vd_back')}</button>
      </footer>

    </div>
  );
}
