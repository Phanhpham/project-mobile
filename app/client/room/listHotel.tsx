import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllProvinces, getListHotel } from "@/apis/apiHotel";
import Loading from "@/components/Loading";

const FilterButton = ({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon?: any;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.filterButton} onPress={onPress}>
    <Text style={styles.filterText}>{label}</Text>
    {icon && (
      <Feather name={icon} size={16} color="#555" style={{ marginLeft: 6 }} />
    )}
  </TouchableOpacity>
);

const HotelCard = ({ hotel }: { hotel: any }) => {
  const fallback = {
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?fit=crop&w=600&q=80",
    rating: 4.8,
    reviews: 128,
    name: "Khách sạn Mẫu - Hà Nội",
    location: "123 Phố Cổ, Quận Hoàn Kiếm, Hà Nội",
  };

  const safeHotel = { ...fallback, ...hotel };
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/client/room/listRoom",
          params: { idHotel: hotel.id },
        })
      }
    >
      <View>
        <Image source={{ uri: safeHotel.image }} style={styles.cardImage} />
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.ratingRow}>
          {Array.from({ length: 5 }).map((_, i) => (
            <FontAwesome key={i} name="star" size={16} color="#F59E0B" />
          ))}
          <Text style={styles.ratingText}>
            {safeHotel.rating?.toFixed
              ? safeHotel.rating.toFixed(1)
              : safeHotel.rating}
          </Text>
          <Text style={styles.reviewText}>({safeHotel.reviews} Reviews)</Text>
        </View>

        <Text style={styles.hotelName}>{safeHotel.name}</Text>

        <View style={styles.locationRow}>
          <MaterialIcons name="location-pin" size={16} color="#888" />
          <Text style={styles.locationText}>{safeHotel.location}</Text>
        </View>


      </View>
    </TouchableOpacity>
  );
};

export default function ListingScreen() {
  const router = useRouter();
  const { id, nameHotel } = useLocalSearchParams();
  const [listHotel, setListHotel] = useState<any[]>([]);
  const [sortType, setSortType] = useState("ASC");
  const [loading, setLoading] = useState(false);

  const [provinces, setProvinces] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isLocalityModalVisible, setIsLocalityModalVisible] = useState(false);

  const toggleSelect = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handleClear = () => setSelected([]);

  const handleApply = async () => {
    try {
      setLoading(true);
      const response = await getListHotel(Number(id), sortType, selected);
      setListHotel(response);
      setIsLocalityModalVisible(false);
    } catch (error) {
      console.error("❌ Lỗi khi lọc theo vị trí:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortSelect = async (type: string) => {
    setSortType(type);
    setIsSortModalVisible(false);
    try {
      setLoading(true);
      const response = await getListHotel(Number(id), type, selected);
      setListHotel(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getAllHotel = async () => {
    try {
      setLoading(true);
      const response = await getListHotel(Number(id), sortType, selected);
      setListHotel(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getProvinces = async () => {
    try {
      const response = await getAllProvinces();
      const names = response.map(
        (p: any) => p.name || p.provinceName || "Không xác định"
      );
      setProvinces(names);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách tỉnh:", error);
    }
  };

  useEffect(() => {
    getAllHotel();
    getProvinces();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/client/room/home")}>
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{nameHotel}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          <FilterButton
            label="Sort"
            icon="chevron-down"
            onPress={() => setIsSortModalVisible(true)}
          />
          <FilterButton
            label="Locality"
            icon="chevron-down"
            onPress={() => setIsLocalityModalVisible(true)}
          />
        </ScrollView>
      </View>

      <ScrollView
        style={{ flex: 1, marginTop: 16 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      >
        {listHotel.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </ScrollView>

      <Loading loading={loading} />

      {/* Modal Sort */}
      <Modal
        animationType="slide"
        transparent
        visible={isSortModalVisible}
        onRequestClose={() => setIsSortModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsSortModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Sort by</Text>
            {["POPULARITY", "LOCATION", "RATING", "ASC", "DESC"].map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.modalItem}
                onPress={() => handleSortSelect(type)}
              >
                <Text style={styles.modalItemText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Modal Locality */}
      <Modal visible={isLocalityModalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>Locality</Text>

            <ScrollView
              style={{ maxHeight: 300 }}
              showsVerticalScrollIndicator={false}
            >
              {provinces.length > 0 ? (
                provinces.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.row}
                    onPress={() => toggleSelect(item)}
                  >
                    <Ionicons
                      name={
                        selected.includes(item) ? "checkbox" : "square-outline"
                      }
                      size={22}
                      color={selected.includes(item) ? "#5E17EB" : "#999"}
                    />
                    <Text style={styles.label}>{item}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text
                  style={{ textAlign: "center", color: "#888", marginTop: 20 }}
                >
                  No provinces available
                </Text>
              )}
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --- Style ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  filterBar: { paddingVertical: 12, backgroundColor: "#fff" },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
  },
  filterText: { fontSize: 14, color: "#374151", fontWeight: "500" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 24,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 220 },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
    borderRadius: 9999,
  },
  cardContent: { padding: 16 },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  ratingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
    marginLeft: 8,
  },
  reviewText: { fontSize: 13, color: "#6b7280", marginLeft: 6 },
  hotelName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 4,
  },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  locationText: { fontSize: 14, color: "#6b7280", marginLeft: 4 },
  priceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 8,
  },
  perNightText: { fontSize: 16, color: "#6b7280", fontWeight: "normal" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 20,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  modalItemText: { fontSize: 16, color: "#333", marginLeft: 12 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#111", marginBottom: 16 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  label: { fontSize: 16, color: "#333", marginLeft: 10 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  clearBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  clearText: { color: "#333", fontWeight: "500" },
  applyBtn: {
    backgroundColor: "#5E17EB",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  applyText: { color: "#fff", fontWeight: "600" },
});
