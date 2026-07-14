import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { resendVerification } from '../../api';
import { Button } from '../ui/Button';

interface ResendVerificationFormProps {
  onSwitch: () => void;
}

export function ResendVerificationForm({ onSwitch }: ResendVerificationFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      const Toast = (await import('react-native-toast-message')).default;
      Toast.show({ type: 'error', text1: 'Ingresa tu correo electrónico' });
      return;
    }

    setLoading(true);
    try {
      await resendVerification(email);
      const Toast = (await import('react-native-toast-message')).default;
      Toast.show({ type: 'success', text1: 'Correo de verificación reenviado. Revisa tu bandeja.' });
      setEmail('');
    } catch (error: any) {
      const Toast = (await import('react-native-toast-message')).default;
      const msg = error.response?.data?.message || 'Error al reenviar el correo';
      Toast.show({ type: 'error', text1: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@ejemplo.com"
          placeholderTextColor="#6B7280"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
      </View>

      <Button
        variant="primary"
        fullWidth
        onPress={handleSubmit}
        loading={loading}
      >
        {loading ? 'Reenviando...' : 'Reenviar correo de verificación'}
      </Button>

      <View style={styles.links}>
        <Text style={styles.hint}>¿Ya verificaste tu cuenta?</Text>
        <Button variant="ghost" onPress={onSwitch}>
          Iniciar sesión
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#D1D5DB',
  },
  input: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4B5563',
    color: '#FFFFFF',
    borderRadius: 8,
  },
  links: {
    alignItems: 'center',
    gap: 4,
  },
  hint: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
