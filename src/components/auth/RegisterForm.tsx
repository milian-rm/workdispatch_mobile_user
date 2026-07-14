import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { WD } from '../../constants/theme';
import { Button } from '../ui/Button';

interface RegisterFormProps {
  onRegister: () => void;
}

export function RegisterForm({ onRegister }: RegisterFormProps) {
  const { register, loading } = useAuthStore();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'CLIENT' as 'CLIENT' | 'WORKER',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password) {
      const Toast = (await import('react-native-toast-message')).default;
      Toast.show({ type: 'error', text1: 'Todos los campos marcados con * son obligatorios' });
      return;
    }

    if (form.password.length < 8) {
      const Toast = (await import('react-native-toast-message')).default;
      Toast.show({ type: 'error', text1: 'La contraseña debe tener al menos 8 caracteres' });
      return;
    }

    if (form.password !== form.confirmPassword) {
      const Toast = (await import('react-native-toast-message')).default;
      Toast.show({ type: 'error', text1: 'Las contraseñas no coinciden' });
      return;
    }

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      role: form.role,
      password: form.password,
    };

    const result = await register(payload);

    if (result.success) {
      const Toast = (await import('react-native-toast-message')).default;
      Toast.show({ type: 'success', text1: 'Cuenta creada. Ahora puedes iniciar sesión.' });
      onRegister();
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* Name row */}
      <View style={styles.row}>
        <View style={[styles.field, { flex: 1 }]}>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Juan"
            placeholderTextColor="#6B7280"
            value={form.firstName}
            onChangeText={(text) => setForm({ ...form, firstName: text })}
          />
        </View>
        <View style={[styles.field, { flex: 1 }]}>
          <Text style={styles.label}>Apellido *</Text>
          <TextInput
            style={styles.input}
            placeholder="Pérez"
            placeholderTextColor="#6B7280"
            value={form.lastName}
            onChangeText={(text) => setForm({ ...form, lastName: text })}
          />
        </View>
      </View>

      {/* Email */}
      <View style={styles.field}>
        <Text style={styles.label}>Correo electrónico *</Text>
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

      {/* Phone */}
      <View style={styles.field}>
        <Text style={styles.label}>Teléfono *</Text>
        <TextInput
          style={styles.input}
          placeholder="+502 7845 1234"
          placeholderTextColor="#6B7280"
          value={form.phone}
          onChangeText={(text) => setForm({ ...form, phone: text })}
          keyboardType="phone-pad"
        />
      </View>

      {/* Role selector */}
      <View style={styles.field}>
        <Text style={styles.label}>Tipo de cuenta *</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, form.role === 'CLIENT' && styles.roleActive]}
            onPress={() => setForm({ ...form, role: 'CLIENT' })}
          >
            <Text style={[styles.roleText, form.role === 'CLIENT' && styles.roleTextActive]}>
              Cliente
            </Text>
            <Text style={[styles.roleDesc, form.role === 'CLIENT' && styles.roleDescActive]}>
              Publicar solicitudes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, form.role === 'WORKER' && styles.roleActive]}
            onPress={() => setForm({ ...form, role: 'WORKER' })}
          >
            <Text style={[styles.roleText, form.role === 'WORKER' && styles.roleTextActive]}>
              Profesional
            </Text>
            <Text style={[styles.roleDesc, form.role === 'WORKER' && styles.roleDescActive]}>
              Ofrecer servicios
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Password */}
      <View style={styles.field}>
        <Text style={styles.label}>Contraseña *</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 8 caracteres"
          placeholderTextColor="#6B7280"
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
          secureTextEntry
        />
      </View>

      {/* Confirm Password */}
      <View style={styles.field}>
        <Text style={styles.label}>Confirmar contraseña *</Text>
        <TextInput
          style={styles.input}
          placeholder="Repite tu contraseña"
          placeholderTextColor="#6B7280"
          value={form.confirmPassword}
          onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
          secureTextEntry
        />
      </View>

      {/* Submit */}
      <Button
        variant="primary"
        fullWidth
        onPress={handleSubmit}
        loading={loading}
        style={{ marginTop: 8 }}
      >
        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </Button>

      {/* Disclaimer */}
      <Text style={styles.disclaimer}>
        Al registrarte serás redirigido a la verificación de identidad. Solo usuarios verificados
        pueden interactuar en la plataforma.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  field: {
    gap: 6,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#D1D5DB',
  },
  input: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    borderWidth: 1,
    borderColor: '#4B5563',
    color: '#FFFFFF',
    borderRadius: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4B5563',
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    alignItems: 'center',
  },
  roleActive: {
    borderColor: '#EAB308',
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  roleTextActive: {
    color: '#EAB308',
  },
  roleDesc: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  roleDescActive: {
    color: '#D1D5DB',
  },
  disclaimer: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 14,
    marginTop: 12,
    marginBottom: 16,
  },
});
