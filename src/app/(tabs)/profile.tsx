import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { WD } from '../../constants/theme';
import { useAuthStore, useIsClient } from '../../store/authStore';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const isClient = useIsClient();
  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase();

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { label: 'Mis Reseñas', icon: 'star-outline' as const, onPress: () => router.push('../reviews') },
    { label: 'Mis Reportes', icon: 'flag-outline' as const, onPress: () => router.push('../reports') },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarTextLarge}>{initials || '?'}</Text>
        </View>
        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Ionicons name={isClient ? 'person-outline' : 'briefcase-outline'} size={14} color={WD.yellow} />
          <Text style={styles.roleText}>{isClient ? 'Cliente' : 'Trabajador'}</Text>
        </View>
      </View>

      <Card style={styles.card}>
        <CardContent>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color="#6B7280" />
            <Text style={styles.infoText}>{user?.phone || 'Sin teléfono'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color="#6B7280" />
            <Text style={styles.infoText}>{user?.email}</Text>
          </View>
        </CardContent>
      </Card>

      <Card style={styles.card}>
        <CardContent style={{ padding: 0 }}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.onPress}
              style={[styles.menuRow, idx === menuItems.length - 1 && styles.menuRowLast]}
            >
              <Ionicons name={item.icon} size={18} color="#6B7280" />
              <Text style={styles.menuText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </CardContent>
      </Card>

      <Button variant="destructive" fullWidth onPress={handleLogout} style={{ marginTop: 16 }}>
        Cerrar Sesión
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: WD.lightGray, padding: 16 },
  header: { alignItems: 'center', paddingVertical: 24 },
  avatarLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: WD.yellow, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarTextLarge: { fontSize: 32, fontWeight: '700', color: WD.darkerGray },
  name: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 4 },
  email: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(234, 179, 8, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(234, 179, 8, 0.3)' },
  roleText: { fontSize: 12, fontWeight: '600', color: WD.yellow },
  card: { marginTop: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  infoText: { fontSize: 14, color: '#374151' },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  menuRowLast: { borderBottomWidth: 0 },
  menuText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#374151' },
});