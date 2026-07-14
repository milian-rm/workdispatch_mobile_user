import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { WD } from '../../constants/theme';
import { Button } from '../ui/Button';

interface LoginFormProps {
  onForgot: () => void;
  onResendVerification: () => void;
  onSuccess: () => void;
}

export function LoginForm({ onForgot, onResendVerification, onSuccess }: LoginFormProps) {
  const { login, loading } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      const Toast = (await import('react-native-toast-message')).default;
      Toast.show({ type: 'error', text1: 'Ingresa tu correo y contraseña' });
      return;
    }

    const result = await login({ email: form.email, password: form.password });

    if (result.success) {
      const Toast = (await import('react-native-toast-message')).default;
      Toast.show({ type: 'success', text1: '¡Bienvenido!' });
      onSuccess();
    }
  };

  return (
    <View style={styles.container}>
      {/* Email */}
      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@ejemplo.com"
          placeholderTextColor="#6B7280"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
      </View>

      {/* Password */}
      <View style={styles.field}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#6B7280"
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
          secureTextEntry
        />
      </View>

      {/* Submit */}
      <Button
        variant="primary"
        fullWidth
        onPress={handleSubmit}
        loading={loading}
        style={{ marginTop: 16 }}
      >
        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
      </Button>

      {/* Links */}
      <View style={styles.links}>
        <TouchableOpacity onPress={onForgot}>
          <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onResendVerification}>
          <Text style={styles.link}>Reenviar correo de verificación</Text>
        </TouchableOpacity>
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
    gap: 8,
    marginTop: 8,
  },
  link: {
    fontSize: 14,
    color: '#EAB308',
  },
});
