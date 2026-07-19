import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView, StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { axiosUser } from '../api/api';
import { Button } from '../components/ui/Button';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { WD } from '../constants/theme';
import { useAuthStore } from '../store/authStore';

const STATUS_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  PENDING:  { label: 'Pendiente de revisión', icon: 'time-outline',          color: WD.yellow },
  APPROVED: { label: 'Verificación aprobada', icon: 'checkmark-circle-outline', color: WD.green },
  REJECTED: { label: 'Verificación rechazada', icon: 'close-circle-outline',  color: WD.red },
};

export default function VerificationScreen() {
  const { user } = useAuthStore();
  const userId = (user as any)?._id || (user as any)?.id;
  const [verification, setVerification] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [docType, setDocType] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [frontImg, setFrontImg] = useState<any>(null);
  const [backImg, setBackImg] = useState<any>(null);

  useEffect(() => {
    if (!userId) return;
    axiosUser.get(`/verifications/${userId}`)
      .then(res => setVerification(res.data?.data || res.data))
      .catch(() => setVerification(null))
      .finally(() => setLoading(false));
  }, [userId]);

  const pickImage = async (setter: (img: any) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setter(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!docType || !docNumber || !frontImg || !backImg) {
      Toast.show({ type: 'error', text1: 'Completa todos los campos y sube ambas fotos' });
      return;
    }
    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append('userId', userId);
      fd.append('documentType', docType);
      fd.append('documentNumber', docNumber);
      fd.append('documentImageFront', { uri: frontImg.uri, name: 'front.jpg', type: 'image/jpeg' } as any);
      fd.append('documentImageBack', { uri: backImg.uri, name: 'back.jpg', type: 'image/jpeg' } as any);
      const res = await axiosUser.post('/verifications', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setVerification(res.data?.data || res.data);
      Toast.show({ type: 'success', text1: 'Solicitud enviada exitosamente' });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err.response?.data?.message || 'Error al enviar' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={WD.yellow} />
    </View>
  );

  const status = verification ? STATUS_CONFIG[verification.status] : null;
  const canSubmit = !verification || verification.status === 'REJECTED';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Verificación de Identidad</Text>
      <Text style={styles.subtitle}>Obtén la insignia de cuenta verificada</Text>

      {/* Estado */}
      {verification && status && (
        <Card style={styles.statusCard}>
          <CardContent style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name={status.icon as any} size={32} color={status.color} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
              <Text style={styles.statusInfo}>
                {verification.documentType} · {verification.documentNumber}
              </Text>
              {verification.rejectionReason && (
                <Text style={styles.rejectionReason}>Motivo: {verification.rejectionReason}</Text>
              )}
            </View>
            <Badge variant={verification.status === 'APPROVED' ? 'default' : verification.status === 'REJECTED' ? 'destructive' : 'secondary'}>
              {verification.status}
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Formulario */}
      {canSubmit && (
        <Card style={styles.formCard}>
          <CardHeader>
            <CardTitle>
              {verification?.status === 'REJECTED' ? 'Volver a solicitar' : 'Solicitar verificación'}
            </CardTitle>
          </CardHeader>
          <CardContent style={{ gap: 16 }}>
            {/* Tipo */}
            <View>
              <Text style={styles.label}>Tipo de documento</Text>
              {['DPI', 'Pasaporte', 'Licencia de conducir'].map(t => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setDocType(t)}
                  style={[styles.optionRow, docType === t && styles.optionRowActive]}
                >
                  <Ionicons
                    name={docType === t ? 'radio-button-on' : 'radio-button-off'}
                    size={18}
                    color={docType === t ? WD.yellow : WD.textGray}
                  />
                  <Text style={[styles.optionText, docType === t && { color: WD.yellow }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Número */}
            <View>
              <Text style={styles.label}>Número de documento</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 2345 67890 1234"
                placeholderTextColor={WD.textGray}
                value={docNumber}
                onChangeText={setDocNumber}
              />
            </View>

            {/* Fotos */}
            {[
              { label: 'Frente del documento', img: frontImg, setter: setFrontImg },
              { label: 'Reverso del documento', img: backImg, setter: setBackImg },
            ].map(({ label, img, setter }) => (
              <View key={label}>
                <Text style={styles.label}>{label}</Text>
                <TouchableOpacity
                  onPress={() => pickImage(setter)}
                  style={[styles.imagePicker, img && styles.imagePickerFilled]}
                >
                  <Ionicons
                    name={img ? 'checkmark-circle' : 'cloud-upload-outline'}
                    size={28}
                    color={img ? WD.green : WD.textGray}
                  />
                  <Text style={[styles.imagePickerText, img && { color: WD.green }]}>
                    {img ? 'Imagen seleccionada ✓' : 'Toca para seleccionar imagen'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            <Button fullWidth onPress={handleSubmit} loading={submitting}>
              {submitting ? 'Enviando...' : 'Enviar solicitud'}
            </Button>
          </CardContent>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: WD.lightGray, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: WD.lightGray },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 13, color: WD.textGray, marginBottom: 20 },
  statusCard: { marginBottom: 16 },
  statusLabel: { fontSize: 15, fontWeight: '700' },
  statusInfo: { fontSize: 13, color: WD.textGray, marginTop: 2 },
  rejectionReason: { fontSize: 12, color: WD.red, marginTop: 4 },
  formCard: { marginBottom: 40 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: WD.borderGray, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 14, color: '#111827', backgroundColor: WD.white,
  },
  optionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, paddingHorizontal: 4,
  },
  optionRowActive: { opacity: 1 },
  optionText: { fontSize: 14, color: '#374151' },
  imagePicker: {
    borderWidth: 2, borderStyle: 'dashed', borderColor: WD.borderGray,
    borderRadius: 10, padding: 20, alignItems: 'center', gap: 8,
    backgroundColor: WD.white,
  },
  imagePickerFilled: { borderColor: WD.green, backgroundColor: '#F0FDF4' },
  imagePickerText: { fontSize: 13, color: WD.textGray, textAlign: 'center' },
});