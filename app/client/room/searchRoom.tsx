import { axiosInstance } from '@/utils/axiosInstance';
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Component con ---
const HotelCard = ({ hotel }: { hotel: any }) => (
  <TouchableOpacity style={styles.card}>
    <View>
      <Image source={{ uri: hotel.imageUrl }} style={styles.cardImage} />
      <TouchableOpacity style={styles.heartButton}>
        <Ionicons name="heart-outline" size={16} color="#333" />
      </TouchableOpacity>
    </View>

    <View style={styles.cardContent}>
      <Text style={styles.hotelName}>{hotel.name}</Text>
      <View style={styles.ratingRow}>
        <FontAwesome name="star" size={14} color="#F59E0B" />
        <Text style={styles.ratingValue}>4.5</Text>
        <Text style={styles.reviewText}>(120 Reviews)</Text>
      </View>

      <View style={styles.locationRow}>
        <MaterialIcons name="location-pin" size={14} color="#888" />
        <Text style={styles.locationText}>Hanoi, Vietnam</Text>
      </View>

      <Text style={styles.priceText}>
        ${hotel.pricePerNight}
        <Text style={styles.perNightText}>/night</Text>
      </Text>
    </View>
  </TouchableOpacity>
);

export default function SearchScreen() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Hàm fetch API khi user nhập text
  const searchRooms = async (kw: string) => {
    if (!kw || kw.trim() === '') {
      setRooms([]);
      return;
    }
  
    setLoading(true);
    try {
      //  Gọi API search bằng axiosInstance
      const response = await axiosInstance.get(`/rooms/search`, {
        params: { keyword: kw },
      });
  
      console.log('🔍 Search result:', response.data);
      setRooms(response.data);
    } catch (error) {
      console.error(' Lỗi khi fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API sau khi user ngừng gõ 0.5s
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (keyword.trim().length > 0) {
        searchRooms(keyword);
      } else {
        setRooms([]);
      }
    }, 500);
  
    return () => clearTimeout(delayDebounce);
  }, [keyword]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Search */}
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => router.push('/client/room/home')}>
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>

        <TextInput
          placeholder="Search"
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={keyword}
          onChangeText={setKeyword}
        />

        <TouchableOpacity onPress={() => setKeyword('')}>
          <Feather name="x" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.locationButton}>
        <Ionicons name="locate-outline" size={24} color="#504DE4" />
        <Text style={styles.locationButtonText}>
          or use my current location
        </Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Text style={styles.sectionTitle}>Search Results</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#504DE4" />
        ) : rooms.length > 0 ? (
          rooms.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)
        ) : keyword ? (
          <Text style={{ marginLeft: 16, color: '#888' }}>
            No rooms found for "{keyword}"
          </Text>
        ) : (
          <Text style={{ marginLeft: 16, color: '#888' }}>
            Type something to search...
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 16,
    color: '#111827',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
  },
  locationButtonText: {
    color: '#504DE4',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  scrollView: { flex: 1, marginTop: 8 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  cardImage: { width: 96, height: 96, borderRadius: 12 },
  heartButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 4,
    borderRadius: 9999,
  },
  cardContent: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  hotelName: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingValue: { fontSize: 13, fontWeight: 'bold', color: '#374151', marginLeft: 4 },
  reviewText: { fontSize: 12, color: '#6b7280', marginLeft: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { fontSize: 12, color: '#6b7280', marginLeft: 4 },
  priceText: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginTop: 8 },
  perNightText: { fontSize: 14, color: '#6b7280', fontWeight: 'normal' },
});
