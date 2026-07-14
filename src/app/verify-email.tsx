import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { verifyEmail } from '../api';
import { WD } from '../constants/theme';
import { Button } from '../components/ui/Button';

export default function VerifyEmailScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de verificación no encontrado.');
      return;
    }

    verifyEmail(token)
      .then(() => {
        setStatus('success');
        setMessage('Correo verificado exitosamente. Ya puedes iniciar sesión.');
      })
      .catch((error: any) => {
        setStatus('error');
        const msg = error.response?.data?.message || 'Error al verificar el correo. El enlace puede haber expirado.';
        setMessage(msg);
      });
  }, [token]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require('../../assets/images/logo_Workdispatch.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Verificación de Correo</Text>

        {status === 'loading' && (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color={WD.yellow} />
            <Text style={styles.statusText}>Verificando tu correo...</Text>
          </View>
        )}

        {status === 'success' && (
          <View style={styles.statusContainer}>
            <Ionicons name="checkmark-circle-outline" size={56} color="#22C55E" />
            <Text style={styles.statusText}>{message}</Text>
            <Button
              variant="primary"
              onPress={() => router.replace('/login')}
              style={{ marginTop: 16 }}
            >
              Iniciar Sesión
            </Button>
          </View>
        )}

        {status === 'error' && (
          <View style={styles.statusContainer}>
            <Ionicons name="close-circle-outline" size={56} color="#EF4444" />
            <Text style={styles.statusText}>{message}</Text>
            <Button
              variant="primary"
              onPress={() => router.replace('/login')}
              style={{ marginTop: 16 }}
            >
              Volver al Inicio
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WD.darkerGray,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 16,
  } as any,
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: WD.white,
    marginBottom: 24,
  },
  statusContainer: {
    alignItems: 'center',
    gap: 12,
  },
  statusText: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 20,
  },
});
