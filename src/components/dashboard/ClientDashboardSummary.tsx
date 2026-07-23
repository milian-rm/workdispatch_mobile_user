import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WD } from '../../constants/theme';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { DashboardStats, type StatItem } from './DashboardStats';

export function ClientDashboardSummary() {
  const [openModal, setOpenModal] = useState(false);

  const stats: StatItem[] = [
    { label: 'Solicitudes Activas', value: 0, icon: 'time-outline', bg: '#FEF9C3', border: '#FDE68A', color: '#CA8A04' },
    { label: 'En Progreso', value: 0, icon: 'checkmark-circle-outline', bg: '#F3F4F6', border: '#D1D5DB', color: '#374151' },
    { label: 'Completados', value: 0, icon: 'checkmark-circle-outline', bg: '#E5E7EB', border: '#9CA3AF', color: '#111827' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Panel de Cliente</Text>
          <Text style={styles.subtitle}>Gestiona tus solicitudes de trabajo</Text>
        </View>

        <Button
          variant="primary"
          onPress={() => setOpenModal(true)}
          icon={<Ionicons name="add-outline" size={16} color={WD.darkerGray} />}
        >
          Nueva Solicitud
        </Button>
      </View>

      <DashboardStats stats={stats} />

      <Card>
        <CardContent>
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={40} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Aun no has creado ninguna solicitud</Text>
            <Text style={styles.emptyDesc}>
              Esta seccion la completa cada feature de solicitudes del cliente.
            </Text>
          </View>
        </CardContent>
      </Card>

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
          Aqui va el formulario real de creacion de solicitud.
        </Text>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WD.lightGray,
  },
  contentContainer: {
    padding: 16,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
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
