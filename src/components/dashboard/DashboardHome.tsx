import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIsClient } from '../../store/authStore';
import { WD } from '../../constants/theme';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

type StatItem = {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  bg: string;
  border: string;
  color: string;
};

export function DashboardHome() {
  const isClient = useIsClient();
  const [openModal, setOpenModal] = useState(false);

  const stats: StatItem[] = isClient
    ? [
        { label: 'Solicitudes Activas', value: 0, icon: 'time-outline', bg: '#FEF9C3', border: '#FDE68A', color: '#CA8A04' },
        { label: 'En Progreso', value: 0, icon: 'checkmark-circle-outline', bg: '#F3F4F6', border: '#D1D5DB', color: '#374151' },
        { label: 'Completados', value: 0, icon: 'checkmark-circle-outline', bg: '#E5E7EB', border: '#9CA3AF', color: '#111827' },
      ]
    : [
        { label: 'Trabajos Disponibles', value: 0, icon: 'time-outline', bg: '#FEF9C3', border: '#FDE68A', color: '#CA8A04' },
        { label: 'Mis Ofertas', value: 0, icon: 'checkmark-circle-outline', bg: '#F3F4F6', border: '#D1D5DB', color: '#374151' },
        { label: 'Completados', value: 0, icon: 'checkmark-circle-outline', bg: '#E5E7EB', border: '#9CA3AF', color: '#111827' },
      ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>
            {isClient ? 'Panel de Cliente' : 'Trabajos Disponibles'}
          </Text>
          <Text style={styles.subtitle}>
            {isClient
              ? 'Gestiona tus solicitudes de trabajo'
              : 'Encuentra trabajos que se ajusten a tus habilidades'}
          </Text>
        </View>

        {isClient && (
          <Button
            variant="primary"
            onPress={() => setOpenModal(true)}
            icon={<Ionicons name="add-outline" size={16} color={WD.darkerGray} />}
          >
            Nueva Solicitud
          </Button>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        {stats.map((stat) => (
          <Card key={stat.label} style={[styles.statCard, { backgroundColor: stat.bg, borderColor: stat.border }]}>
            <CardContent>
              <View style={styles.statContent}>
                <View>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                </View>
                <Ionicons name={stat.icon} size={40} color={stat.color} />
              </View>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* Empty state */}
      <Card>
        <CardContent>
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={40} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>
              {isClient
                ? 'Aún no has creado ninguna solicitud'
                : 'Aún no hay trabajos disponibles'}
            </Text>
            <Text style={styles.emptyDesc}>
              Esta sección la completa cada feature (mis-solicitudes / trabajos-disponibles).
            </Text>
          </View>
        </CardContent>
      </Card>

      {/* Example modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Nueva Solicitud"
        footer={
          <View style={styles.modalFooter}>
            <Button variant="ghost" onPress={() => setOpenModal(false)}>
              Cancelar
            </Button>
            <Button onPress={() => setOpenModal(false)}>
              Guardar
            </Button>
          </View>
        }
      >
        <Text style={styles.modalContent}>
          Aquí va el formulario real de creación de solicitud.
        </Text>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WD.lightGray,
    padding: 16,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    borderWidth: 2,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '900',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 8,
  },
  modalContent: {
    fontSize: 14,
    color: '#6B7280',
  },
});
