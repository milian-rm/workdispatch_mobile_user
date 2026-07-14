import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { WD } from '../constants/theme';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';
import { ResendVerificationForm } from '../components/auth/ResendVerificationForm';
import { LinearGradient } from 'expo-linear-gradient';

type AuthView = 'login' | 'register' | 'forgot' | 'resend';

export default function AuthScreen() {
  const { isAuthenticated } = useAuthStore();
  const [view, setView] = useState<AuthView>('login');

  const title =
    view === 'forgot' ? 'Recuperar Contraseña'
    : view === 'resend' ? 'Reenviar Verificación'
    : view === 'login' ? 'Bienvenido de Nuevo'
    : 'Crear Cuenta';

  const subtitle =
    view === 'forgot' ? 'Ingresa la información necesaria para recuperar tu acceso.'
    : view === 'resend' ? 'Ingresa tu correo para reenviar el enlace de verificación.'
    : 'Ingresa tus credenciales para acceder a la plataforma.';

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={[WD.darkerGray, WD.darkGray, WD.darkerGray]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.flex}
      >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Decorative blurs */}
        <View style={styles.blurTop} />
        <View style={styles.blurBottom} />

        <View style={styles.container}>
          {/* Logo + title */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/logo_Workdispatch.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.brand}>
              Work<Text style={styles.brandHighlight}>Dispatch</Text>
            </Text>
            <Text style={styles.tagline}>Conectando talento</Text>

            {/* View switcher tabs */}
            <View style={styles.tabsContainer}>
              <View style={styles.tabs}>
                {view === 'login' && <View style={[styles.tabIndicator, styles.tabIndicatorLeft]} />}
                {view === 'register' && <View style={[styles.tabIndicator, styles.tabIndicatorRight]} />}

                <TouchableOpacity
                  style={[styles.tab, view === 'login' && styles.tabActive]}
                  onPress={() => setView('login')}
                >
                  <Text style={[styles.tabText, view === 'login' && styles.tabTextActive]}>
                    Ingresar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tab, view === 'register' && styles.tabActive]}
                  onPress={() => setView('register')}
                >
                  <Text style={[styles.tabText, view === 'register' && styles.tabTextActive]}>
                    Registrarse
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardSubtitle}>{subtitle}</Text>
            </View>

            <View style={styles.cardContent}>
              {view === 'login' && (
                <LoginForm
                  onForgot={() => setView('forgot')}
                  onResendVerification={() => setView('resend')}
                  onSuccess={() => {}}
                />
              )}
              {view === 'register' && (
                <RegisterForm onRegister={() => setView('login')} />
              )}
              {view === 'forgot' && (
                <ForgotPasswordForm onSwitch={() => setView('login')} />
              )}
              {view === 'resend' && (
                <ResendVerificationForm onSwitch={() => setView('login')} />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 40,
  },
  blurTop: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(234, 179, 8, 0.08)',
  },
  blurBottom: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(250, 204, 21, 0.08)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  } as any,
  brand: {
    fontSize: 32,
    fontWeight: '900',
    color: WD.white,
  },
  brandHighlight: {
    color: WD.yellow,
  },
  tagline: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 24,
  },
  tabsContainer: {
    width: '100%',
    maxWidth: 300,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#374151',
    padding: 4,
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    width: '48%',
    backgroundColor: WD.yellow,
    borderRadius: 999,
    zIndex: 1,
  },
  tabIndicatorLeft: {
    left: 4,
  },
  tabIndicatorRight: {
    right: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    zIndex: 2,
  },
  tabActive: {},
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: WD.yellow,
  },
  tabTextActive: {
    color: WD.darkerGray,
  },
  card: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 16,
    padding: 24,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: WD.white,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  cardContent: {},
});
