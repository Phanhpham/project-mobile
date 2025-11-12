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
import { getListRoom, getReviewRoom } from "@/apis/apiRoom";
import Loading from "@/components/Loading";
import { formatMoney } from "@/utils/formatPrice";

// --- Nút Lọc ---
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

// --- Thẻ Khách Sạn ---
const HotelCard = ({ room, idHotel }: { room: any; idHotel: any }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const router = useRouter();

  // 🧮 Lấy review thật từ API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviewRoom(room.id);
        if (response && response.length > 0) {
          const total = response.length;
          const sum = response.reduce(
            (acc: number, item: any) => acc + item.rating,
            0
          );
          const avg = sum / total;
          setAverageRating(avg);
          setTotalReviews(total);
        } else {
          setAverageRating(0);
          setTotalReviews(0);
        }
      } catch (error) {
        console.log("Error loading reviews:", error);
      }
    };

    fetchReviews();
  }, [room.id]);

  const safeHotel = {
    image:
      room?.imageUrl ||
      "https://i.pinimg.com/1200x/47/f7/77/47f7772ed6ceff3f3692573e4ed96ed8.jpg",
    name: room?.name || "Khách sạn Mẫu - Hà Nội",
    location: room?.location || "123 Phố Cổ, Quận Hoàn Kiếm, Hà Nội",
    price: room?.pricePerNight || 120,
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/client/room/BookingFlowScreen",
          params: {
            idRoom: room.id,
            idHotel,
            room: JSON.stringify(room),
            averageRating,
            totalReviews,
          },
        })
      }
    >
      {/* Ảnh khách sạn */}
      <View>
        <Image source={{ uri: safeHotel.image }} style={styles.cardImage} />
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Nội dung */}
      <View style={styles.cardContent}>
        <View style={styles.ratingRow}>
          {/* ⭐ Hiển thị sao trung bình */}
          {Array.from({ length: 5 }).map((_, i) => (
            <FontAwesome
              key={i}
              name="star"
              size={16}
              color={i < Math.round(averageRating) ? "#F59E0B" : "#E5E7EB"}
            />
          ))}

          {/* Điểm trung bình */}
          <Text style={styles.ratingText}>
            {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
          </Text>

          {/* Tổng số review */}
          <Text style={styles.reviewText}>({totalReviews} Reviews)</Text>
        </View>

        {/* Tên khách sạn */}
        <Text style={styles.hotelName}>{safeHotel.name}</Text>

        {/* Địa chỉ */}
        <View style={styles.locationRow}>
          <MaterialIcons name="location-pin" size={16} color="#888" />
          <Text style={styles.locationText}>{safeHotel.location}</Text>
        </View>

        {/* Giá tiền */}
        <Text style={styles.priceText}>
          ${formatMoney(safeHotel.price)}
          <Text style={styles.perNightText}>/night</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// --- Màn hình chính ---
export default function ListingScreen() {
  const router = useRouter();
  const { idHotel } = useLocalSearchParams();

  const [allRooms, setAllRooms] = useState<any[]>([]);
  const [displayRooms, setDisplayRooms] = useState<any[]>([]);
  const [sortType, setSortType] = useState("PRICE_ASC");
  const [loading, setLoading] = useState(false);

  // --- Sort Modal ---
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const openSortModal = () => setIsSortModalVisible(true);
  const closeSortModal = () => setIsSortModalVisible(false);

  // --- Price Modal ---
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState<[number, number]>([
    100, 1200,
  ]);
  const [selectedPriceOption, setSelectedPriceOption] = useState<string>("");

  const openPriceModal = () => setIsPriceModalVisible(true);
  const closePriceModal = () => setIsPriceModalVisible(false);

  const handlePriceSelect = (option: string, min: number, max: number) => {
    setSelectedPriceOption(option);
    setSelectedRange([min, max]);
  };

  const handleApplyPrice = () => {
    const [min, max] = selectedRange;
    const filtered = allRooms.filter(
      (room) => room.pricePerNight >= min && room.pricePerNight <= max
    );
    setDisplayRooms(filtered);
    closePriceModal();
  };

  const handleClearPrice = () => {
    setSelectedPriceOption("");
    setSelectedRange([0, 0]);
    setDisplayRooms(allRooms);
  };

  // --- Sort ---
  const handleSortSelect = async (type: string) => {
    setSortType(type);
    closeSortModal();
    try {
      setLoading(true);
      const response = await getListRoom(Number(idHotel), type);
      setAllRooms(response);
      setDisplayRooms(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch rooms ---
  const getAllRoom = async () => {
    try {
      setLoading(true);
      const response = await getListRoom(Number(idHotel), sortType);
      setAllRooms(response);
      setDisplayRooms(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllRoom();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/client/room/home")}>
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hotels</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Thanh lọc */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          <FilterButton
            label="Sort"
            icon="chevron-down"
            onPress={openSortModal}
          />
          <FilterButton label="Locality" icon="chevron-down" />
          <FilterButton
            label="Price"
            icon="chevron-down"
            onPress={openPriceModal}
          />
          <FilterButton label="Categories" icon="chevron-down" />
        </ScrollView>
      </View>

      {/* Danh sách khách sạn */}
      <ScrollView
        style={{ flex: 1, marginTop: 16 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      >
        {displayRooms.map((room) => (
          <HotelCard key={room.id} room={room} idHotel={idHotel} />
        ))}
      </ScrollView>

      <Loading loading={loading} />

      {/* --- Modal Sort --- */}
      <Modal
        animationType="slide"
        transparent
        visible={isSortModalVisible}
        onRequestClose={closeSortModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeSortModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Sort by</Text>
            {[
              "POPULARITY",
              "NAME_DESC",
              "NAME_ASC",
              "PRICE_ASC",
              "PRICE_DESC",
            ].map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.modalItem}
                onPress={() => handleSortSelect(type)}
              >
                <Text style={styles.modalItemText}>
                  {type.replace("_", " ")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* --- Modal Price --- */}
      <Modal
        animationType="slide"
        transparent
        visible={isPriceModalVisible}
        onRequestClose={closePriceModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closePriceModal}>
          <View style={styles.priceModalContainer}>
            <Text style={styles.modalTitle}>Price</Text>

            {[
              { label: "$1000000-$2000000", min: 1000000, max: 2000000 },
              { label: "$2000000-$3000000", min: 2000000, max: 3000000 },
              { label: "$500-$2500", min: 500, max: 2500 },
            ].map(({ label, min, max }) => (
              <TouchableOpacity
                key={label}
                style={styles.radioRow}
                onPress={() => handlePriceSelect(label, min, max)}
              >
                <Ionicons
                  name={
                    selectedPriceOption === label
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={22}
                  color={selectedPriceOption === label ? "#4F46E5" : "#9CA3AF"}
                />
                <Text style={styles.radioText}>{label}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.rangeTitle}>Price Range</Text>
            <View style={styles.sliderMock}>
              <View style={styles.sliderBar} />
              <View style={styles.sliderKnobLeft} />
              <View style={styles.sliderKnobRight} />
            </View>

            <View style={styles.rangeValueRow}>
              <Text style={styles.rangeValue}>${selectedRange[0]}</Text>
              <Text style={styles.rangeValue}>${selectedRange[1]}</Text>
            </View>

            <View style={styles.footerButtons}>
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={handleClearPrice}
              >
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={handleApplyPrice}
              >
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// --- Styles giữ nguyên ---
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
  priceModalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  radioRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  radioText: { fontSize: 16, color: "#111827", marginLeft: 10 },
  rangeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  sliderMock: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  sliderBar: {
    width: "90%",
    height: 8,
    backgroundColor: "#C7D2FE",
    borderRadius: 8,
    position: "absolute",
  },
  sliderKnobLeft: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#4F46E5",
    position: "absolute",
    left: "15%",
  },
  sliderKnobRight: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#4F46E5",
    position: "absolute",
    right: "20%",
  },
  rangeValueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 4,
  },
  rangeValue: { fontSize: 16, color: "#111827", fontWeight: "600" },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
  },
  clearBtn: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginRight: 10,
  },
  clearText: { fontSize: 16, color: "#111827", fontWeight: "600" },
  applyBtn: {
    flex: 1,
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginLeft: 10,
  },
  applyText: { fontSize: 16, color: "#fff", fontWeight: "600" },
});
