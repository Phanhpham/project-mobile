import { cancelBooking, getBooking } from "@/apis/apiBooking";
import { getUserInfo, UserInfo } from "@/utils/userUtils";
import { useMutation } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";

// --- CONSTANTS ---
const PRIMARY_COLOR = "#5568FE"; // Màu xanh tím
const LIGHT_GREY = "#F0F0F0";
const GREY_TEXT = "#8A8A8A";
const DARK_TEXT = "#333333";
const BORDER_COLOR = "#E5E5E5";

// --- BOOKING CARD COMPONENT ---
const BookingCard = ({ key, booking, activeTab, onPress }: any) => {
  return (
    <View style={styles.card} key={key}>
      <View style={styles.header}>
        <Text style={styles.bookingId}>Booking ID: {booking?.bookingId}</Text>
        {/* Giảm độ đậm của Booking Date */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={styles.bookingDate}>{booking?.startDate}</Text>
          <Text style={styles.bookingDate}>-</Text>
          <Text style={styles.bookingDate}>{booking?.endDate}</Text>
        </View>
      </View>

      <View style={styles.details}>
        {/* Giả lập hình ảnh */}
        <View>
          <Image
            source={{
              uri:
                booking?.image ||
                "https://i.pinimg.com/1200x/47/f7/77/47f7772ed6ceff3f3692573e4ed96ed8.jpg",
            }}
            style={styles.roomImage}
          />
        </View>

        <View style={styles.hotelInfo}>
          <View style={styles.rating}>
            {/* Icon Ngôi sao */}
            <Text style={styles.star}>⭐️</Text>
            <Text style={styles.score}>{booking?.score || 0}</Text>
            <Text style={styles.reviews}>
              ({booking?.reviews || 0} Reviews)
            </Text>
          </View>
          <Text style={styles.hotelName}>{booking?.nameRoom}</Text>
          <Text style={styles.location}>{booking?.location}</Text>
          {/* Giả lập dòng "Congratulations!" nhỏ ở card thứ hai */}
          {/* {bookingId === "90667891" && ( */}
          <Text style={styles.congratulationsText}>Congratulations!</Text>
          {/* )} */}
        </View>
      </View>

      {/* Nút hành động chỉ hiển thị trong INCOMING */}
      {activeTab === "INCOMING" && (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={onPress}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.viewDetailsButton]}
          >
            {/* Dùng Text cho iOS/Android */}
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Giả lập nút "Write a Review" cho màn hình PASS (tương tự như screenshot) */}
      {activeTab === "PASS" && (
        <View>
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              borderWidth: 1,
              borderRadius: 10,
              padding: 8,
            }}
          >
            <Text style={{ color: "gray", textAlign: "center" }}>
              Write a Review
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reviewButton}>
            <Text style={styles.reviewButtonText}>Book Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// --- MAIN SCREEN COMPONENT ---
const BookingListScreen = () => {

  // Giả lập trạng thái Tab: 'Upcoming' hoặc 'Past'
  const [activeTab, setActiveTab] = useState("INCOMING");
  const [listBookingRoom, setListBookingRoom] = useState([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const loadProfile = async () => {
    const user = await getUserInfo();
    if (user) {
      setUserInfo(user);
    } else {
      console.log("Chưa có user nào đăng nhập");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const fetchBookings = async () => {
    try {
      const data = await getBooking(userInfo?.id, activeTab);

      setListBookingRoom(data);
    } catch (error) {
      console.error("Lỗi khi lấy booking:", error);
    }
  };

  useEffect(() => {
    if (userInfo?.id) {
      fetchBookings();
    }
  }, [activeTab, userInfo]);

  const {
    mutate: cancelBookingMutate
  } = useMutation({
    mutationFn: async (id: number) => {
      return await cancelBooking(id)
    },
    mutationKey: ["cancelBooking"],
    onSuccess: () => {
      Alert.alert("Thành công", "Hủy đặt phòng thành công!");
      fetchBookings()
    },
    onError: () => {
      Alert.alert("Thất bại!", "Hủy đặt phòng thất bại!")
    }
  })

  const handleCancel = (id: number) => {
    Alert.alert("Xác nhận hủy", "Bạn có muốn xác nhận hủy đặt phòng này?", [
      {
        text: "Hủy",
        style: "cancel"
      },
      {
        text: "Xác nhận",
        onPress: () => {
          cancelBookingMutate(id)
        }
      }
    ])
  }

  return (
    <View style={styles.container}>
      {/* Header (Phần trên cùng: 9:41, sóng điện thoại) */}
      <View style={styles.systemHeader} />

      <View style={styles.screenTitleContainer}>
        <Text style={styles.screenTitle}>Bookings</Text>
      </View>

      {/* Selector Tab (Upcoming/Past) */}
      <View style={styles.tabSelector}>
        {/* INCOMING */}
        <TouchableOpacity
          style={[
            styles.selectorButton,
            activeTab === "INCOMING" && styles.activeSelectorButton,
          ]}
          onPress={() => setActiveTab("INCOMING")}
        >
          <Text
            style={[
              styles.selectorText,
              activeTab === "INCOMING" && styles.activeSelectorText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>

        {/* PASS */}
        <TouchableOpacity
          style={[
            styles.selectorButton,
            activeTab === "PASS" && styles.activeSelectorButton,
          ]}
          onPress={() => setActiveTab("PASS")}
        >
          <Text
            style={[
              styles.selectorText,
              activeTab === "PASS" && styles.activeSelectorText,
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>

        {/* CANCELLED */}
        <TouchableOpacity
          style={[
            styles.selectorButton,
            activeTab === "CANCELLED" && styles.activeSelectorButton,
          ]}
          onPress={() => setActiveTab("CANCELLED")}
        >
          <Text
            style={[
              styles.selectorText,
              activeTab === "CANCELLED" && styles.activeSelectorText,
            ]}
          >
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nội dung danh sách Booking */}
      <ScrollView contentContainerStyle={styles.bookingList}>
        {listBookingRoom.map((booking: any) => (
          <BookingCard
            key={booking.bookingId}
            booking={booking}
            activeTab={activeTab}
            onPress={() => handleCancel(booking.bookingId)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_GREY,
  },
  systemHeader: {
    // Giả lập khu vực đồng hồ, sóng điện thoại
    height: 44, // Chiều cao chuẩn cho iPhone notch
    backgroundColor: "white",
  },
  screenTitleContainer: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: DARK_TEXT,
  },

  // Tab Selector (Upcoming/Past)
  tabSelector: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 20,
    padding: 3, // Khoảng cách giữa nền trắng và nút
    // Nền selector
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 17,
    alignItems: "center",
    backgroundColor: LIGHT_GREY, // Nền mặc định
  },
  activeSelectorButton: {
    backgroundColor: "white", // Nền khi được chọn
    shadowColor: "#000", // Đổ bóng nhẹ khi active
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectorText: {
    fontSize: 14,
    color: GREY_TEXT,
    fontWeight: "600",
  },
  activeSelectorText: {
    color: DARK_TEXT,
  },

  // Booking List
  bookingList: {
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 20,
  },

  // Card Styles
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 5,
  },
  header: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    marginBottom: 10,
  },
  bookingId: {
    fontWeight: "bold",
    color: DARK_TEXT,
    fontSize: 14,
  },
  bookingDate: {
    fontSize: 11, // Giảm cỡ chữ
    color: GREY_TEXT,
    marginTop: 2,
  },
  details: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 8,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  hotelInfo: {
    flex: 1,
    justifyContent: "center",
  },
  roomImage: { width: 80, height: 80, borderRadius: 12 },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  star: {
    marginRight: 2,
    fontSize: 10, // Cỡ chữ nhỏ hơn cho icon
  },
  score: {
    color: DARK_TEXT,
    fontSize: 13,
    fontWeight: "bold",
    marginRight: 5,
  },
  reviews: {
    color: GREY_TEXT,
    fontSize: 13,
  },
  hotelName: {
    fontWeight: "bold",
    color: DARK_TEXT,
    fontSize: 16,
  },
  location: {
    fontSize: 12,
    color: GREY_TEXT,
  },
  congratulationsText: {
    fontSize: 11,
    color: "green",
    marginTop: 5,
    fontStyle: "italic", // Không có fontStyle: 'italic' trong RN tiêu chuẩn, cần thư viện
  },

  // Actions
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 10,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderTopColor: BORDER_COLOR,
    gap: 10,
  },
  actionButton: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 20,
    minWidth: 90, // Đảm bảo độ rộng nút
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "white",
    borderColor: GREY_TEXT,
    borderWidth: 1,
  },
  cancelText: {
    color: GREY_TEXT,
    fontSize: 13,
    fontWeight: "500",
  },
  viewDetailsButton: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
    borderWidth: 1,
  },
  viewDetailsText: {
    color: "white",
    fontSize: 13,
    fontWeight: "500",
  },

  // Past Booking Review Button
  reviewButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  reviewButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  // Tab Bar
  tabBarContainer: {
    flexDirection: "row",
    height: 80, // Chiều cao bao gồm khu vực an toàn
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    paddingBottom: 20, // Khu vực an toàn dưới cùng
    paddingTop: 10,
    justifyContent: "space-around",
  },
  tabBarItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },
  tabIcon: {
    fontSize: 22,
    color: GREY_TEXT,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    color: GREY_TEXT,
  },
});

export default BookingListScreen;
