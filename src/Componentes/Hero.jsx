import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80&auto=format&fit=crop';

function Hero({ onExplorar, onVerServicios }) {
  const { t } = useTranslation();

  const handleExplorar = () => {
    if (typeof onExplorar === 'function') {
      onExplorar();
    }
  };

  const handleVerServicios = () => {
    if (typeof onVerServicios === 'function') {
      onVerServicios();
    }
  };

  return (
    <View style={styles.hero}>
      <Image source={{ uri: HERO_IMAGE }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      <View style={styles.overlay} />

      <View style={styles.content}>
        <Text style={styles.tag}>{t('hero_tag')}</Text>

        <Text style={styles.title}>
          {t('hero_title_1')} {'\n'}
          <Text style={styles.titleEmphasis}>{t('hero_title_italic')}</Text>{' '}
          {t('hero_title_for')} {'\n'}
          {t('hero_title_2')} <Text style={styles.titleEmphasis}>{t('hero_title_3')}</Text>
        </Text>

        <Text style={styles.description}>{t('hero_desc')}</Text>

        <View style={styles.actionsRow}>
          <Pressable onPress={handleExplorar} style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
            <Text style={styles.primaryButtonText}>{t('btn_explorar')}</Text>
          </Pressable>
          <Pressable onPress={handleVerServicios} style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}>
            <Text style={styles.secondaryButtonText}>{t('btn_ver_servicios')}</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{t('hc1_num')}</Text>
            <Text style={styles.statLabel}>{t('hc1_label')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{t('hc2_num')}</Text>
            <Text style={styles.statLabel}>{t('hc2_label')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{t('hc3_num')}</Text>
            <Text style={styles.statLabel}>{t('hc3_label')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    minHeight: 620,
    justifyContent: 'flex-end',
    backgroundColor: '#0A0A0A',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,10,0.62)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 28,
  },
  tag: {
    color: '#A07840',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  title: {
    color: '#F5F5F0',
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '300',
    letterSpacing: -0.3,
  },
  titleEmphasis: {
    color: '#C39B5F',
    fontStyle: 'italic',
  },
  description: {
    marginTop: 14,
    color: '#B2B2AA',
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 620,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 22,
  },
  primaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#A07840',
    marginRight: 10,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#0A0A0A',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(245,245,240,0.18)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: '#F5F5F0',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  buttonPressed: {
    opacity: 0.86,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 26,
    paddingTop: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(245,245,240,0.12)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  statValue: {
    color: '#F5F5F0',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  statLabel: {
    marginTop: 6,
    color: '#B2B2AA',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 34,
    backgroundColor: 'rgba(245,245,240,0.14)',
  },
});

export default Hero;
