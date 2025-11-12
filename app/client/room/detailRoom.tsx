import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  FlatList,
  Modal,
  Platform,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Loading from "@/components/Loading";
import { getDetailRoom, getReviewRoom } from "@/apis/apiRoom";
import { formatMoney } from "@/utils/formatPrice";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import GuestCounterRow from "@/components/GuestCounterRow";
import { createBookingRoom, getBookingsByRoomId } from "@/apis/apiBooking";
import { useQuery } from "@tanstack/react-query";
import { useBookedDates } from "@/hooks/useBookings";

const { width } = Dimensions.get("window");
const IMAGE_HEIGHT = width * 1.35;
const YELLOW_COLOR = "#f2b705"; // Màu đỏ cho sao
const PRIMARY_COLOR = "#7752FF"; // Màu tím cho nút

// --- Component phụ: Đánh giá sao ---
const StarRating = ({
  roomId,
  idHotel,
  averageRating,
  totalReviews,
}: {
  roomId: number;
  idHotel: any;
  averageRating: number;
  totalReviews: number;
}) => {
  // Làm tròn 1 chữ số thập phân
  const displayedRating = averageRating.toFixed(1);

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/(tabs)/review/roomReviewScreen",
          params: { idRoom: roomId, idHotel },
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.starRatingContainer}>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <FontAwesome
              key={i}
              name="star"
              size={14}
              color={i < Math.round(averageRating) ? "#f2b705" : "#ddd"}
              style={{ marginRight: 2 }}
            />
          ))}
        <Text style={styles.reviewText}>
          {" "}
          {displayedRating} ({totalReviews} Reviews)
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// --- Component phụ: Mục Tính năng nổi bật ---
const FeatureItem = ({
  iconName,
  title,
  description,
  isMaterial,
}: {
  iconName: any;
  title: any;
  description: any;
  isMaterial: any;
}) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIcon}>
      {isMaterial ? (
        <MaterialIcons name={iconName} size={20} color="#222" />
      ) : (
        <MaterialCommunityIcons name={iconName} size={20} color="#222" />
      )}
    </View>
    <View style={styles.featureText}>
      <Text style={styles.featureTitle}>{title}</Text>
      {description ? (
        <Text style={styles.featureDescription}>{description}</Text>
      ) : null}
    </View>
  </View>
);

// --- Props khai báo ---
interface RoomDetailScreenProps {
  bookingData: any;
  setBookingData: React.Dispatch<React.SetStateAction<any>>;
  nextStep: () => void;
}

// Đảm bảo các hàm này được định nghĩa ở cấp độ component cha
const formatDate = (date: Date) => {
  return date.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
// --- Component chính: RoomDetailScreen ---
export default function RoomDetailScreen({
  bookingData,
  setBookingData,
  nextStep,
}: RoomDetailScreenProps) {
  const { idRoom, idHotel } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);
  const [detailRoom, setDetailRoom] = useState<any>({});
  const [allReview, setAllReview] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isGuestModalVisible, setGuestModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"start" | "end">("start");

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // --- API ---
  const getDetail = async () => {
    try {
      setLoading(true);
      const response = await getDetailRoom(Number(idRoom));
      setDetailRoom(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getAllReviewRoom = async () => {
    try {
      const response = await getReviewRoom(Number(idRoom));
      setAllReview(response);
      if (response.length > 0) {
        const total = response.length;
        const sum = response.reduce(
          (acc: number, item: any) => acc + item.rating,
          0
        );
        setAverageRating(sum / total);
        setTotalReviews(total);
      } else {
        setAverageRating(0);
        setTotalReviews(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDetail();
    getAllReviewRoom();
  }, []);

  const { data: bookedDates } = useBookedDates(+idRoom);

  const onClose = () => setModalVisible(false);

  const normalize = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const isRangeAvailable = (start: Date, end: Date) => {
    const nStart = normalize(start);
    const nEnd = normalize(end);

    return !(bookedDates ?? [])?.some(({ startDate, endDate }: any) => {
      const bookedStart = normalize(new Date(startDate));
      const bookedEnd = normalize(new Date(endDate));
      return nStart < bookedEnd && nEnd > bookedStart;
    });
  };

  const handleConfirmDate = () => {
    if (!isRangeAvailable(bookingData?.startDate, bookingData?.endDate)) {
      Alert.alert(
        "Thất bại",
        "Khoảng ngày này đã có người đặt. Vui lòng chọn khoảng khác."
      );
      return;
    }

    setModalVisible(false);
    setGuestModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Phần 1: Ảnh và Header Icons */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: detailRoom?.images?.[0]?.imageURL,
            }}
            style={styles.mainImage}
          />
          <SafeAreaView style={styles.headerAbsolute}>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() =>
                  router.push({
                    pathname: "/client/room/listRoom",
                    params: { idRoom, idHotel },
                  })
                }
              >
                <Feather
                  name="chevron-left"
                  size={24}
                  color="white"
                  style={styles.iconShadow}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons
                  name="favorite-border"
                  size={24}
                  color="white"
                  style={styles.iconShadow}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Phần 2: Nội dung chính */}
        <View style={styles.content}>
          {/* Tên & Địa điểm */}
          <StarRating
            roomId={detailRoom?.id || 0}
            idHotel={idHotel}
            averageRating={averageRating}
            totalReviews={totalReviews}
          />

          <Text style={styles.title}>{detailRoom?.name}</Text>
          <View style={styles.locationRow}>
            <MaterialIcons name="location-on" size={16} color="#717171" />
            <Text style={styles.locationText}>{detailRoom?.hotelName}</Text>
          </View>

          {/* Overview */}
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overviewText}>{detailRoom?.description}</Text>

          <View style={styles.miniDivider} />

          {/* Photos */}
          <View style={styles.photosHeader}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/client/room/photoScreen",
                  params: {
                    id: idRoom,
                  },
                })
              }
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={detailRoom.images}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }: { item: any }) => (
              <View style={styles.thumbnail}>
                <Image
                  source={{
                    uri: item.imageURL,
                  }}
                  style={styles.thumbnailImage}
                />
              </View>
            )}
            style={styles.thumbnailsScroll}
          />

          <View style={styles.divider} />

          {/* Host & Chi tiết phòng */}
          <View style={styles.hostRow}>
            <View style={styles.hostTextContainer}>
              <Text style={styles.hostTitle}>
                Room in boutique hotel hosted by Marine
              </Text>
              <Text style={styles.roomStats}>
                {detailRoom.guestCount} guests • {detailRoom.bedroomCount}{" "}
                bedroom • {detailRoom.bedCount} bed • {detailRoom.bathRoomCount}{" "}
                bathroom
              </Text>
            </View>
            <Image
              source={{
                uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu2whjzwoBz71waeE07wh1L_sfjpdm6IIf7g&s",
              }}
              style={styles.hostAvatar}
            />
          </View>

          <View style={styles.thinDivider} />

          {/* Danh sách Features (Dùng component đơn giản) */}
          <FeatureItem
            iconName="magic-staff"
            title="Enhanced Clean"
            description="This host committed to Airbnb's clone 5-step enhanced cleaning process."
            isMaterial={false}
          />
          <FeatureItem
            iconName="location-on"
            title="Great Location"
            description="95% of recent guests give the location a 5-star rating."
            isMaterial={true}
          />
          <FeatureItem
            iconName="key-variant"
            title="Great check-in-experience"
            description="90% of recent guests gave the check-in process a 5-star rating."
            isMaterial={false}
          />
          <FeatureItem
            description={null}
            iconName="calendar-remove-outline"
            title="Free cancellation until 2:00 PM on 8 May"
            isMaterial={false}
          />
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Loading */}
      <Loading loading={loading} />
      {/* Phần 3: Footer Cố Định */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.priceText}>
            ${formatMoney(detailRoom?.pricePerNight)}
            <Text style={styles.priceSuffix}>/night</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={styles.selectDateButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Select Date</Text>
        </TouchableOpacity>
      </View>

      {/* modal date  */}
      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        onRequestClose={onClose}
      >
        <Pressable style={styles.overlay} onPress={onClose}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <SafeAreaView style={styles.safeAreaContainer} edges={["bottom"]}>
              <View style={styles.grabber} />
              <View style={styles.contentPadding}>
                <Text style={styles.modalTitle}>Chọn ngày</Text>

                {/* Ngày nhận */}
                <TouchableOpacity
                  style={[styles.dateInputContainer, styles.dateInputMargin]}
                  onPress={() => {
                    setPickerMode("start");
                    setShowPicker(true);
                  }}
                >
                  <Text style={styles.dateInputLabel}>NHẬN PHÒNG</Text>
                  <Text style={styles.dateInputValue}>
                    {bookingData?.startDate
                      ? formatDate(bookingData?.startDate)
                      : "Chọn ngày"}
                  </Text>
                </TouchableOpacity>

                {/* Ngày trả */}
                <TouchableOpacity
                  style={styles.dateInputContainer}
                  onPress={() => {
                    setPickerMode("end");
                    setShowPicker(true);
                  }}
                >
                  <Text style={styles.dateInputLabel}>TRẢ PHÒNG</Text>
                  <Text style={styles.dateInputValue}>
                    {bookingData?.endDate
                      ? formatDate(bookingData?.endDate)
                      : "Chọn ngày"}
                  </Text>
                </TouchableOpacity>

                {/* DatePicker */}
                {showPicker && (
                  <DateTimePicker
                    value={
                      pickerMode === "start"
                        ? bookingData?.startDate
                          ? new Date(bookingData?.startDate)
                          : new Date()
                        : bookingData?.endDate
                          ? new Date(bookingData?.endDate)
                          : new Date()
                    }
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "calendar"}
                    minimumDate={
                      pickerMode === "start"
                        ? new Date()
                        : new Date(
                            bookingData?.startDate
                              ? new Date(bookingData?.startDate).getTime() +
                                86400000
                              : new Date().getTime() + 86400000
                          )
                    }
                    onChange={(e, selectedDate) => {
                      const currentDate = selectedDate || new Date();
                      setShowPicker(Platform.OS === "ios");
                      setBookingData((prev: any) => {
                        if (pickerMode === "start") {
                          let newEnd = prev.endDate
                            ? new Date(prev.endDate)
                            : new Date(currentDate.getTime() + 86400000);
                          if (newEnd <= currentDate)
                            newEnd = new Date(currentDate.getTime() + 86400000);
                          return {
                            ...prev,
                            startDate: currentDate,
                            endDate: newEnd,
                          };
                        }
                        return { ...prev, endDate: currentDate };
                      });
                    }}
                  />
                )}

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirmDate}
                >
                  <Text style={styles.confirmButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal guest */}
      <Modal
        animationType="slide"
        transparent
        visible={isGuestModalVisible}
        onRequestClose={() => setGuestModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setGuestModalVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
                  <View style={styles.grabber} />
                  <View style={styles.contentPadding}>
                    <Text style={styles.modalTitle}>Select Guest</Text>

                    <GuestCounterRow
                      title="Adults"
                      subtitle="Ages 14+"
                      count={bookingData?.adults}
                      onDecrement={() =>
                        setBookingData((prev: any) => ({
                          ...prev,
                          adults: Math.max(1, prev.adults - 1),
                        }))
                      }
                      onIncrement={() =>
                        setBookingData((prev: any) => ({
                          ...prev,
                          adults: prev.adults + 1,
                        }))
                      }
                      decrementDisabled={bookingData?.adults === 1}
                    />

                    <GuestCounterRow
                      title="Children"
                      subtitle="Ages 2-13"
                      count={bookingData?.children}
                      onDecrement={() =>
                        setBookingData((prev: any) => ({
                          ...prev,
                          children: Math.max(0, prev.children - 1),
                        }))
                      }
                      onIncrement={() =>
                        setBookingData((prev: any) => ({
                          ...prev,
                          children: prev.children + 1,
                        }))
                      }
                      decrementDisabled={bookingData?.children === 0}
                    />

                    <GuestCounterRow
                      title="Infants"
                      subtitle="Under 2"
                      count={bookingData?.infants}
                      onDecrement={() =>
                        setBookingData((prev: any) => ({
                          ...prev,
                          infants: Math.max(0, prev.infants - 1),
                        }))
                      }
                      onIncrement={() =>
                        setBookingData((prev: any) => ({
                          ...prev,
                          infants: prev.infants + 1,
                        }))
                      }
                      decrementDisabled={bookingData?.infants === 0}
                    />

                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={nextStep}
                    >
                      <Text style={styles.confirmButtonText}>Next</Text>
                    </TouchableOpacity>
                  </View>
                </SafeAreaView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

// --- Stylesheets ---
const styles = StyleSheet.create({
  // Global & Layout
  container: { flex: 1, backgroundColor: "#fff" },
  scrollViewContent: { paddingBottom: 0 },
  spacer: { height: 90 },

  // Lớp nền mờ: flex-1 justify-end bg-black/50
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  safeArea: {
    paddingTop: 16, // pt-4
  },

  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8, // shadow cho Android
  },
  // 1. Image Header
  imageContainer: {
    width: width,
    height: IMAGE_HEIGHT,
    position: "relative",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  mainImage: { width: "100%", height: "100%", resizeMode: "cover" },
  headerAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 45,
  },
  headerIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  iconButton: { padding: 5 },
  iconShadow: {
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontSize: 24,
  },

  // 2. Content Sections
  content: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 22, fontWeight: "600", marginBottom: 10 },

  // Rating & Title
  starRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  reviewText: { fontSize: 14, color: "#222", marginLeft: 8, fontWeight: "400" },
  title: { fontSize: 35, fontWeight: "700", marginVertical: 5 },
  locationRow: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
  locationText: { fontSize: 14, color: "#717171", marginLeft: 5 },

  // Overview
  overviewText: { fontSize: 16, lineHeight: 24, color: "#717171" },
  miniDivider: { height: 1, backgroundColor: "#eee", marginVertical: 25 },

  // Photos
  photosHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  seeAllText: {
    color: "#222",
    fontWeight: "600",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  thumbnailsScroll: { marginBottom: 20 },
  thumbnail: {
    width: 120,
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
    backgroundColor: "#eee",
  },
  thumbnailImage: { width: "100%", height: "100%", resizeMode: "cover" },
  divider: { height: 1, backgroundColor: "#ebebeb", marginVertical: 25 },
  thinDivider: { height: 1, backgroundColor: "#ebebeb", marginVertical: 20 },

  // Host
  hostRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hostTextContainer: { flex: 1, marginRight: 10 },
  hostTitle: { fontSize: 18, fontWeight: "600", marginBottom: 5 },
  roomStats: { fontSize: 14, color: "#717171" },
  hostAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ebebeb",
    flexShrink: 0,
  },

  // Features
  featureItem: {
    flexDirection: "row",
    marginBottom: 25,
    alignItems: "flex-start",
  },
  featureIcon: { width: 30, marginRight: 15, alignItems: "center" },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: "600", marginBottom: 3 },
  featureDescription: { fontSize: 14, color: "#717171", lineHeight: 20 },

  // 3. Footer
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ebebeb",
  },
  priceText: { fontSize: 18, fontWeight: "600" },
  priceSuffix: { fontSize: 16, fontWeight: "400", color: "#717171" },
  selectDateButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
  // Nội dung Modal: bg-white rounded-t-3xl shadow-lg
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24, // Tương đương rounded-t-3xl (khoảng 24px)
    borderTopRightRadius: 24,
    // Thêm shadow thủ công vì shadow-lg cần cấu hình phức tạp hơn
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8, // Android shadow
  },

  // SafeAreaView
  safeAreaContainer: {
    paddingTop: 16, // pt-4 (4*4=16)
  },

  // Grabber: w-12 h-1.5 bg-gray-300 rounded-full self-center mb-4
  grabber: {
    width: 48, // w-12 (4*12=48)
    height: 6, // h-1.5 (4*1.5=6)
    backgroundColor: "#d1d5db", // gray-300
    borderRadius: 9999, // rounded-full
    alignSelf: "center", // self-center
    marginBottom: 16, // mb-4
  },

  // Padding nội dung: px-6
  contentPadding: {
    paddingHorizontal: 24, // px-6
  },

  // Tiêu đề: text-xl font-bold text-gray-900 mb-5
  modalTitle: {
    fontSize: 20, // text-xl
    fontWeight: "bold", // font-bold
    color: "#111827", // gray-900
    marginBottom: 20, // mb-5
  },

  // Khung nhập ngày: border border-gray-300 rounded-lg p-3
  dateInputContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db", // gray-300
    borderRadius: 8, // rounded-lg
    padding: 12, // p-3
  },
  // Khoảng cách dưới cho ô nhận phòng: mb-4
  dateInputMargin: {
    marginBottom: 16, // mb-4
  },

  // Label: text-xs font-medium text-gray-500
  dateInputLabel: {
    fontSize: 10, // text-xs
    fontWeight: "500", // font-medium
    color: "#6b7280", // gray-500
  },

  // Giá trị: text-base font-bold text-gray-900 mt-1
  dateInputValue: {
    fontSize: 16, // text-base
    fontWeight: "bold", // font-bold
    color: "#111827", // gray-900
    marginTop: 4, // mt-1
  },

  // Nút xác nhận: bg-blue-600 py-4 rounded-lg mt-6 mb-4
  confirmButton: {
    backgroundColor: "#2563eb", // blue-600
    paddingVertical: 16, // py-4
    borderRadius: 8, // rounded-lg
    marginTop: 24, // mt-6
    marginBottom: 16, // mb-4
  },

  // Text nút xác nhận: text-white text-base font-bold text-center
  confirmButtonText: {
    color: "white", // text-white
    fontSize: 16, // text-base
    fontWeight: "bold", // font-bold
    textAlign: "center", // text-center
  },

  // Nút Xong iOS: bg-gray-200 py-3 rounded-lg mx-6 mb-4
  iosDoneButton: {
    backgroundColor: "#e5e7eb", // gray-200
    paddingVertical: 12, // py-3
    borderRadius: 8, // rounded-lg
    marginHorizontal: 24, // mx-6
    marginBottom: 16, // mb-4
  },

  // Text nút Xong iOS: text-blue-600 text-base font-bold text-center
  iosDoneButtonText: {
    color: "#2563eb", // blue-600
    fontSize: 16, // text-base
    fontWeight: "bold", // font-bold
    textAlign: "center", // text-center
  },
});
