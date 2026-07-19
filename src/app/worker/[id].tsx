import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { axiosUser } from '../../api/api';
import { Button } from '../../components/ui/Button';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { WD } from '../../constants/theme';

const StarRow = ({ rating = 0, size = 14 }: { rating: number; size?: number }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
    {[1, 2, 3, 4, 5].map(s => (
      <Ionicons
        key={s}
        name={s <= Math.round(rating) ? 'star' : 'star-outline'}
        size={size}
        color={s <= Math.round(rating) ? WD.yellow : '#D1D5DB'}
      />
    ))}
    <Text style={{ fontSize: size - 2, color: WD.textGray, marginLeft: 4 }}>
      {Number(rating).toFixed(1)}
    </Text>
  </View>
);

export default function WorkerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [worker, setWorker] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      axiosUser.get(`/users/${id}`),
      axiosUser.get(`/PortFolio/${id}`).catch(() => ({ data: { data: [] } })),
      axiosUser.get(`/reviews/worker/${id}`).catch(() => ({ data: { data: [] } })),
      axiosUser.get(`/userSkill/worker/${id}`).catch(() => ({ data: { data: [] } })),
    ]).then(([wRes, pRes, rRes, sRes]) => {
      setWorker(wRes.data?.data || wRes.data);
      setPortfolio(pRes.data?.data || []);
      setReviews(rRes.data?.data || []);
      setSkills(sRes.data?.data || []);
    }).catch(() => setWorker(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={WD.yellow} />
    </View>
  );

  if (!worker) return (
    <View style={styles.center}>
      <Text style={{ color: WD.textGray }}>Trabajador no encontrado</Text>
      <Button variant="outline" onPress={() => router.back()} style={{ marginTop: 16 }}>
        Volver
      </Button>
    </View>
  );

  const initials = `${worker.firstName?.[0] ?? ''}${worker.lastName?.[0] ?? ''}`.toUpperCase();
  const activePortfolio = portfolio.filter(p => p.status === 'ACTIVE');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Back */}
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Ionicons name="arrow-back" size={20} color="#374151" />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      {/* Hero */}
      <Card style={styles.heroCard}>
        <CardContent>
          <View style={styles.heroTop}>
            {worker.profilePhoto && !worker.profilePhoto.includes('default') ? (
              <Image source={{ uri: worker.profilePhoto }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>{initials || '?'}</Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.workerName}>{worker.firstName} {worker.lastName}</Text>
              <StarRow rating={worker.ratingAverage} size={16} />
              {worker.verificationStatus && (
                <Badge variant="default" style={{ marginTop: 6, alignSelf: 'flex-start' }}>
                  ✓ Verificado
                </Badge>
              )}
            </View>
          </View>

          {worker.description && (
            <Text style={styles.bio}>{worker.description}</Text>
          )}

          <View style={styles.infoRow}>
            {worker.phone && (
              <View style={styles.infoItem}>
                <Ionicons name="call-outline" size={14} color={WD.textGray} />
                <Text style={styles.infoText}>{worker.phone}</Text>
              </View>
            )}
            {worker.address && (
              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={14} color={WD.textGray} />
                <Text style={styles.infoText}>{worker.address}</Text>
              </View>
            )}
          </View>

          <Button
            variant="outline"
            onPress={() => router.push('/messages' as any)}
            style={{ marginTop: 12 }}
            icon={<Ionicons name="chatbubble-outline" size={16} color="#374151" />}
          >
            Enviar mensaje
          </Button>
        </CardContent>
      </Card>

      {/* Habilidades */}
      {skills.length > 0 && (
        <Card style={styles.section}>
          <CardHeader>
            <CardTitle>Habilidades</CardTitle>
          </CardHeader>
          <CardContent style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {skills.map(s => (
              <Badge key={s._id} variant="secondary">
                {s.skillId?.name || 'Habilidad'}
                {s.experienceYears > 0 ? ` · ${s.experienceYears}a` : ''}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Portafolio */}
      <Card style={styles.section}>
        <CardHeader>
          <CardTitle>Portafolio ({activePortfolio.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {activePortfolio.length === 0 ? (
            <Text style={styles.empty}>Sin trabajos en el portafolio</Text>
          ) : (
            <View style={{ gap: 12 }}>
              {activePortfolio.map(item => (
                <View key={item._id} style={styles.portfolioItem}>
                  {item.imageUrl && !item.imageUrl.includes('no disponible') && (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.portfolioImg}
                      resizeMode="cover"
                    />
                  )}
                  <Text style={styles.portfolioDesc}>{item.description}</Text>
                </View>
              ))}
            </View>
          )}
        </CardContent>
      </Card>

      {/* Reseñas */}
      <Card style={[styles.section, { marginBottom: 40 }]}>
        <CardHeader>
          <CardTitle>Reseñas ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <Text style={styles.empty}>Sin reseñas aún</Text>
          ) : (
            <View style={{ gap: 12 }}>
              {reviews.map(r => (
                <View key={r._id} style={styles.reviewItem}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={styles.reviewAuthor}>
                      {r.clientId?.firstName || 'Cliente'}
                    </Text>
                    <StarRow rating={r.rating} size={12} />
                  </View>
                  {r.comment && <Text style={styles.reviewComment}>{r.comment}</Text>}
                </View>
              ))}
            </View>
          )}
        </CardContent>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: WD.lightGray, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: WD.lightGray },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  backText: { fontSize: 14, color: '#374151', fontWeight: '500' },
  heroCard: { marginBottom: 16 },
  heroTop: { flexDirection: 'row', gap: 16, alignItems: 'flex-start', marginBottom: 12 },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  avatarFallback: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: WD.yellow, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: WD.darkerGray },
  workerName: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 4 },
  bio: { fontSize: 14, color: '#374151', lineHeight: 20, marginBottom: 12 },
  infoRow: { gap: 8 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: 13, color: WD.textGray },
  section: { marginBottom: 16 },
  empty: { fontSize: 14, color: WD.textGray, fontStyle: 'italic' },
  portfolioItem: { borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: WD.borderGray },
  portfolioImg: { width: '100%', height: 140 },
  portfolioDesc: { fontSize: 13, color: '#374151', padding: 10, lineHeight: 18 },
  reviewItem: { padding: 12, backgroundColor: '#F9FAFB', borderRadius: 10, borderWidth: 1, borderColor: WD.borderGray },
  reviewAuthor: { fontSize: 13, fontWeight: '700', color: '#111827' },
  reviewComment: { fontSize: 13, color: '#374151', marginTop: 4, lineHeight: 18 },
});