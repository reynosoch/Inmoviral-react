import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '../supabaseClient';

export default function LoginPage({ onVolver }) {
  const { t, i18n } = useTranslation();
  
  // Estados comunes
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modo, setModo] = useState('login'); // 'login' | 'register'

  // Estados nuevos para el Registro
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [clientType, setClientType] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const cambiarIdioma = (idioma) => {
    i18n.changeLanguage(idioma);
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      if (modo === 'login') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        setSuccess(t('login_success_msg', { defaultValue: '¡Sesión iniciada correctamente!' }));
        setTimeout(() => onVolver(), 1200);
      } else {
        // Validación del Checkbox de Términos antes de registrar
        if (!acceptTerms) {
          throw new Error(i18n.language.startsWith('es') ? 'Debes aceptar los términos y condiciones.' : 'You must accept the terms and conditions.');
        }

        // Registro en Supabase pasando los metadatos exactos
        const { data: signUpData, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              client_type: clientType
            }
          }
        });
        
        if (err) throw err;

        setSuccess(t('register_success_msg', { defaultValue: '¡Cuenta creada exitosamente! Revisa tu lista de usuarios.' }));
        
        // Limpiamos los campos tras el éxito
        setFullName('');
        setPhone('');
        setEmail('');
        setPassword('');
        setClientType('');
        setAcceptTerms(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const backgroundImage = modo === 'login'
    ? 'https://images.pexels.com/photos/773842/pexels-photo-773842.jpeg'
    : 'https://images.unsplash.com/photo-1613621792067-8e28d16b735c?crop=entropy&cs=srgb&fm=jpg&q=85';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* IMAGEN DE FONDO */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: backgroundImage }}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay} />
            
            <Pressable onPress={onVolver} style={styles.brandButton}>
              <Text style={styles.brandText}>INMOVIRAL</Text>
            </Pressable>

            <View style={styles.imageCaption}>
              <Text style={styles.captionLabel}>
                {modo === 'login'
                  ? t('login_caption_lbl', { defaultValue: 'Premium Real Estate' })
                  : t('register_caption_lbl', { defaultValue: 'Únete a la colección' })
                }
              </Text>
              <Text style={styles.captionQuote}>
                {modo === 'login'
                  ? t('login_caption', { defaultValue: '"Una colección curada de propiedades excepcionales para quienes valoran la exclusividad."' })
                  : t('register_caption', { defaultValue: '"Cada propiedad es una solución a medida, diseñada en torno a la visión del cliente."' })
                }
              </Text>
            </View>
          </View>

          {/* FORMULARIO */}
          <View style={styles.formContainer}>
            {/* LENGUAJE SWITCHER */}
            <View style={styles.langSwitcher}>
              <Pressable
                onPress={() => cambiarIdioma('es')}
                style={({ pressed }) => [
                  styles.langBtn,
                  i18n.language.startsWith('es') && styles.langBtnActive,
                  pressed && styles.langBtnPressed
                ]}
              >
                <Text style={[styles.langBtnText, i18n.language.startsWith('es') && styles.langBtnTextActive]}>ES</Text>
              </Pressable>
              <Pressable
                onPress={() => cambiarIdioma('en')}
                style={({ pressed }) => [
                  styles.langBtn,
                  i18n.language.startsWith('en') && styles.langBtnActive,
                  pressed && styles.langBtnPressed
                ]}
              >
                <Text style={[styles.langBtnText, i18n.language.startsWith('en') && styles.langBtnTextActive]}>EN</Text>
              </Pressable>
            </View>

            {/* TÍTULO Y SUBTÍTULO */}
            <Text style={styles.overline}>
              {modo === 'login'
                ? t('login_welcome', { defaultValue: 'Bienvenido de nuevo' })
                : t('register_overline', { defaultValue: 'Acceso Privado' })
              }
            </Text>
            <Text style={styles.title}>
              {modo === 'login'
                ? t('login_title', { defaultValue: 'Inicia sesión' })
                : t('login_title_reg', { defaultValue: 'Crear cuenta' })
              }
            </Text>
            <Text style={styles.subtitle}>
              {modo === 'login'
                ? t('login_subtitle', { defaultValue: 'Propiedades excepcionales para clientes exigentes.' })
                : t('register_subtitle', { defaultValue: 'Accede a las propiedades más exclusivas del mercado.' })
              }
            </Text>

            {/* MENSAJES DE ERROR Y ÉXITO */}
            {error && <View style={styles.alertError}><Text style={styles.alertText}>{error}</Text></View>}
            {success && <View style={styles.alertSuccess}><Text style={styles.alertText}>{success}</Text></View>}

            {/* CAMPOS DEL REGISTRO */}
            {modo === 'register' && (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>{t('register_name_lbl', { defaultValue: 'Nombre Completo' })}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ej. Juan Pérez"
                    placeholderTextColor="#8A8A84"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>{t('register_phone_lbl', { defaultValue: 'Teléfono' })}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="+34 600 000 000"
                    placeholderTextColor="#8A8A84"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </>
            )}

            {/* CAMPOS COMUNES */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t('login_email_lbl', { defaultValue: 'Correo Electrónico' })}</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor="#8A8A84"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.fieldHeaderRow}>
                <Text style={styles.fieldLabel}>{t('login_pwd_lbl', { defaultValue: 'Contraseña' })}</Text>
                {modo === 'login' && (
                  <Pressable onPress={() => {}}>
                    <Text style={styles.fieldForgot}>{t('login_forgot', { defaultValue: '¿Olvidaste?' })}</Text>
                  </Pressable>
                )}
              </View>
              <View style={styles.passwordWrap}>
                <TextInput
                  style={styles.inputPassword}
                  placeholder={modo === 'login' ? '••••••••' : 'Mínimo 6 caracteres'}
                  placeholderTextColor="#8A8A84"
                  secureTextEntry={!showPwd}
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable onPress={() => setShowPwd(!showPwd)} style={styles.togglePwd}>
                  <Text style={styles.togglePwdText}>{showPwd ? '👁' : '👁‍🗨'}</Text>
                </Pressable>
              </View>
            </View>

            {/* TIPO DE CLIENTE Y TÉRMINOS (SOLO REGISTRO) */}
            {modo === 'register' && (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>{t('register_type_lbl', { defaultValue: 'Tipo de Cliente' })}</Text>
                  <View style={styles.selectOptions}>
                    {['Comprador', 'Vendedor', 'Inversionista'].map((option) => (
                      <Pressable
                        key={option}
                        onPress={() => setClientType(option)}
                        style={[styles.selectOption, clientType === option && styles.selectOptionActive]}
                      >
                        <Text style={[styles.selectOptionText, clientType === option && styles.selectOptionTextActive]}>
                          {option}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={styles.termsCheck}>
                  <Pressable
                    onPress={() => setAcceptTerms(!acceptTerms)}
                    style={[styles.checkbox, acceptTerms && styles.checkboxActive]}
                  >
                    {acceptTerms && <Text style={styles.checkboxMark}>✓</Text>}
                  </Pressable>
                  <Text style={styles.termsText}>
                    {t('register_terms_1', { defaultValue: 'Acepto los ' })}
                    <Text style={styles.termsEmphasis}>{t('register_terms_em', { defaultValue: 'términos y condiciones' })}</Text>
                    {t('register_terms_2', { defaultValue: ' y la política de privacidad de INMOVIRAL.' })}
                  </Text>
                </View>
              </>
            )}

            {/* BOTÓN PRINCIPAL */}
            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              style={({ pressed }) => [
                styles.btnPrimary,
                pressed && styles.btnPrimaryPressed,
                loading && styles.btnPrimaryLoading
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.btnPrimaryText}>
                  {modo === 'login'
                    ? t('login_btn', { defaultValue: 'Iniciar Sesión' })
                    : t('login_btn_reg', { defaultValue: 'Registrarse' })
                  }
                </Text>
              )}
            </Pressable>

            {/* DIVISOR */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* BOTÓN GOOGLE */}
            <Pressable
              onPress={handleGoogle}
              style={({ pressed }) => [styles.btnGoogle, pressed && styles.btnGooglePressed]}
            >
              <Text style={styles.btnGoogleIcon}>G</Text>
              <Text style={styles.btnGoogleText}>
                {modo === 'login'
                  ? t('login_google', { defaultValue: 'Continuar con Google' })
                  : t('register_google', { defaultValue: 'Registrarse con Google' })
                }
              </Text>
            </Pressable>

            {/* ENLACES DE NAVEGACIÓN */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {modo === 'login'
                  ? t('login_no_account', { defaultValue: '¿No tienes una cuenta?' })
                  : t('login_has_account', { defaultValue: '¿Ya tienes una cuenta?' })
                }{' '}
              </Text>
              <Pressable
                onPress={() => {
                  setModo(modo === 'login' ? 'register' : 'login');
                  setError('');
                  setSuccess('');
                }}
              >
                <Text style={styles.footerLink}>
                  {modo === 'login'
                    ? t('login_register_link', { defaultValue: 'Regístrate' })
                    : t('login_signin_link', { defaultValue: 'Inicia sesión' })
                  }
                </Text>
              </Pressable>
            </View>

            <Text style={styles.footerDivider}>— o —</Text>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {t('login_guest_lbl', { defaultValue: '¿Prefieres continuar sin registrarte?' })} 
              </Text>
              <Pressable onPress={onVolver}>
                <Text style={styles.footerLink}>{t('login_guest_link', { defaultValue: 'Continuar como invitado' })}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ══ FUNCIÓN AUXILIAR DE PORTAFOLIO ══
export async function obtenerPropiedades() {
  const { data, error } = await supabase
    .from('propiedades')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener propiedades:', error);
    return [];
  }
  return data;
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
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 280,
    backgroundColor: '#1a1a1a',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,10,0.58)',
  },
  brandButton: {
    position: 'absolute',
    top: 16,
    left: 20,
    zIndex: 10,
  },
  brandText: {
    color: '#F5F5F0',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
  },
  imageCaption: {
    position: 'relative',
    zIndex: 5,
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
  },
  captionLabel: {
    color: '#A07840',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  captionQuote: {
    color: '#F5F5F0',
    fontSize: 15,
    fontWeight: '300',
    lineHeight: 24,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 20,
    paddingVertical: 32,
    flex: 1,
  },
  langSwitcher: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginBottom: 24,
    gap: 8,
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: 'transparent',
  },
  langBtnActive: {
    borderColor: '#A07840',
    backgroundColor: 'rgba(160, 120, 64, 0.1)',
  },
  langBtnPressed: {
    opacity: 0.8,
  },
  langBtnText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  langBtnTextActive: {
    color: '#A07840',
  },
  overline: {
    color: '#A07840',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  title: {
    color: '#F5F5F0',
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    color: '#B2B2AA',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 24,
  },
  alertError: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
  },
  alertSuccess: {
    backgroundColor: 'rgba(22, 163, 74, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#16A34A',
  },
  alertText: {
    color: '#F5F5F0',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    color: '#F5F5F0',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  fieldForgot: {
    color: '#A07840',
    fontSize: 11,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#F5F5F0',
    fontSize: 14,
    fontWeight: '400',
  },
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    paddingRight: 10,
  },
  inputPassword: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#F5F5F0',
    fontSize: 14,
    fontWeight: '400',
  },
  togglePwd: {
    padding: 8,
  },
  togglePwdText: {
    fontSize: 16,
  },
  selectOptions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  selectOption: {
    flex: 1,
    minWidth: '48%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  selectOptionActive: {
    borderColor: '#A07840',
    backgroundColor: 'rgba(160, 120, 64, 0.1)',
  },
  selectOptionText: {
    color: '#B2B2AA',
    fontSize: 12,
    fontWeight: '600',
  },
  selectOptionTextActive: {
    color: '#A07840',
  },
  termsCheck: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 4,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    borderColor: '#A07840',
    backgroundColor: 'rgba(160, 120, 64, 0.2)',
  },
  checkboxMark: {
    color: '#A07840',
    fontSize: 14,
    fontWeight: '700',
  },
  termsText: {
    flex: 1,
    color: '#B2B2AA',
    fontSize: 12,
    lineHeight: 18,
  },
  termsEmphasis: {
    color: '#C39B5F',
    fontWeight: '700',
  },
  btnPrimary: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginBottom: 20,
  },
  btnPrimaryPressed: {
    opacity: 0.88,
  },
  btnPrimaryLoading: {
    opacity: 0.7,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333333',
  },
  dividerText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
  },
  btnGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 10,
    marginBottom: 24,
  },
  btnGooglePressed: {
    opacity: 0.85,
  },
  btnGoogleIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EA4335',
  },
  btnGoogleText: {
    color: '#F5F5F0',
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  footerText: {
    color: '#B2B2AA',
    fontSize: 12,
  },
  footerLink: {
    color: '#A07840',
    fontSize: 12,
    fontWeight: '700',
  },
  footerDivider: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center',
    marginVertical: 12,
  },
});