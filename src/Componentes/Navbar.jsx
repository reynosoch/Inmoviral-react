import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '../AuthContext';

export default function Navbar({ vista, setVista }) {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  const cambiarIdioma = (idioma) => {
    i18n.changeLanguage(idioma);
  };

  const cambiarVista = (vistaName) => {
    setVista(vistaName);
    setMenuVisible(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setMenuVisible(false);
    setVista('inicio');
  };

  const MENU_ITEMS = [
    { label: t('nav_catalog', { defaultValue: 'Catálogo' }), vista: 'catalog' },
    { label: t('nav_venta', { defaultValue: 'Propiedades en Venta' }), vista: 'venta' },
    { label: t('nav_renta', { defaultValue: 'Propiedades en Renta' }), vista: 'renta' },
    { label: t('nav_servicios', { defaultValue: 'Servicios' }), vista: 'servicios' },
    { label: t('nav_sobre', { defaultValue: 'Sobre Nosotros' }), vista: 'about' },
  ];

  return (
    <>
      {/* HEADER */}
      <SafeAreaView style={styles.headerSafeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
        <View style={styles.header}>
          {/* LOGO */}
          <Pressable
            onPress={() => cambiarVista('inicio')}
            style={({ pressed }) => [styles.logoButton, pressed && styles.logoButtonPressed]}
          >
            <Text style={styles.logo}>INMOVIRAL</Text>
          </Pressable>

          {/* ACCIONES DERECHA */}
          <View style={styles.actionsRow}>
            {/* IDIOMAS */}
            <View style={styles.langGroup}>
              <Pressable
                onPress={() => cambiarIdioma('es')}
                style={({ pressed }) => [
                  styles.langBtn,
                  i18n.language.startsWith('es') && styles.langBtnActive,
                  pressed && styles.langBtnPressed,
                ]}
              >
                <Text
                  style={[
                    styles.langText,
                    i18n.language.startsWith('es') && styles.langTextActive,
                  ]}
                >
                  ES
                </Text>
              </Pressable>
              <Pressable
                onPress={() => cambiarIdioma('en')}
                style={({ pressed }) => [
                  styles.langBtn,
                  i18n.language.startsWith('en') && styles.langBtnActive,
                  pressed && styles.langBtnPressed,
                ]}
              >
                <Text
                  style={[
                    styles.langText,
                    i18n.language.startsWith('en') && styles.langTextActive,
                  ]}
                >
                  EN
                </Text>
              </Pressable>
            </View>

            {/* BOTÓN PUBLICAR */}
            <Pressable
              onPress={() => cambiarVista('publicar')}
              style={({ pressed }) => [styles.publishBtn, pressed && styles.publishBtnPressed]}
            >
              <Text style={styles.publishBtnText}>+ {t('nav_publicar', { defaultValue: 'Publicar' })}</Text>
            </Pressable>

            {/* BOTÓN MENU */}
            <Pressable
              onPress={() => setMenuVisible(!menuVisible)}
              style={({ pressed }) => [styles.menuBtn, pressed && styles.menuBtnPressed]}
            >
              <Text style={styles.menuIcon}>☰</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      {/* MODAL MENU */}
      <Modal
        visible={menuVisible}
        animationType="fade"
        transparent={true}
        statusBarTranslucent
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* OVERLAY CLICKEABLE */}
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setMenuVisible(false)}
          />

          {/* MENU CONTENT */}
          <View style={styles.modalContent}>
            {/* CLOSE BUTTON */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('nav_menu', { defaultValue: 'Menú' })}</Text>
              <Pressable
                onPress={() => setMenuVisible(false)}
                style={({ pressed }) => [styles.modalCloseBtn, pressed && styles.modalCloseBtnPressed]}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* MENU ITEMS */}
              {MENU_ITEMS.map(item => (
                <Pressable
                  key={item.vista}
                  onPress={() => cambiarVista(item.vista)}
                  style={({ pressed }) => [
                    styles.menuItem,
                    vista === item.vista && styles.menuItemActive,
                    pressed && styles.menuItemPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.menuItemText,
                      vista === item.vista && styles.menuItemTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}

              <View style={styles.menuDivider} />

              {/* AUTH ITEMS */}
              {user ? (
                <>
                  <View style={styles.userSection}>
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>
                  <Pressable
                    onPress={handleSignOut}
                    style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                  >
                    <Text style={styles.menuItemDanger}>
                      {t('nav_logout', { defaultValue: 'Cerrar Sesión' })}
                    </Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable
                    onPress={() => cambiarVista('login')}
                    style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                  >
                    <Text style={styles.menuItemText}>
                      {t('nav_login', { defaultValue: 'Iniciar Sesión' })}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => cambiarVista('registro')}
                    style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                  >
                    <Text style={styles.menuItemText}>
                      {t('nav_register', { defaultValue: 'Registrarse' })}
                    </Text>
                  </Pressable>
                </>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  headerSafeArea: {
    backgroundColor: '#0A0A0A',
  },
  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  logoButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  logoButtonPressed: {
    opacity: 0.8,
  },
  logo: {
    color: '#F5F5F0',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.5,
    fontFamily: 'serif',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  langGroup: {
    flexDirection: 'row',
    gap: 4,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    paddingRight: 12,
  },
  langBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(160, 120, 64, 0.3)',
    backgroundColor: 'transparent',
  },
  langBtnActive: {
    borderColor: '#A07840',
    backgroundColor: 'rgba(160, 120, 64, 0.15)',
  },
  langBtnPressed: {
    opacity: 0.7,
  },
  langText: {
    color: '#B2B2AA',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  langTextActive: {
    color: '#A07840',
  },
  publishBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  publishBtnPressed: {
    opacity: 0.8,
  },
  publishBtnText: {
    color: '#3B82F6',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(160, 120, 64, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBtnPressed: {
    opacity: 0.7,
  },
  menuIcon: {
    color: '#A07840',
    fontSize: 20,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0A0A0A',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '85%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  modalTitle: {
    color: '#F5F5F0',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseBtnPressed: {
    opacity: 0.7,
  },
  modalCloseText: {
    color: '#F5F5F0',
    fontSize: 18,
    fontWeight: '600',
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: 'rgba(160, 120, 64, 0.15)',
    borderLeftWidth: 3,
    borderLeftColor: '#A07840',
    paddingLeft: 9,
  },
  menuItemPressed: {
    opacity: 0.8,
  },
  menuItemText: {
    color: '#B2B2AA',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  menuItemTextActive: {
    color: '#C39B5F',
    fontWeight: '700',
  },
  menuItemDanger: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 12,
  },
  userSection: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(160, 120, 64, 0.08)',
    borderRadius: 8,
    marginBottom: 8,
  },
  userEmail: {
    color: '#A07840',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});