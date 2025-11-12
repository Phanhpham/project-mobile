import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  StyleSheet,
  Alert,
  Modal,
  Button,
  Platform,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatMoney } from "@/utils/formatPrice";
import { createBookingRoom } from "@/apis/apiBooking";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";

type BookingData = {
  startDate: Date;
  endDate: Date;
  adults: number;
  children: number;
  infants: number;
  totalPrice: number;
  paymentMethod: string;
  paymentOption: string;
};

type Props = {
  bookingData: BookingData;
  setBookingData: React.Dispatch<React.SetStateAction<any>>;
  prevStep: () => void;
  room: any;
  averageRating: any;
  totalReviews: any;
  setLoading: any;
};

// --- Component con: PriceLine ---
const PriceLine = ({
  label,
  amount,
  isTotal = false,
}: {
  label: string;
  amount: string;
  isTotal?: boolean;
}) => (
  <View style={[styles.priceLineContainer, isTotal && styles.priceLineTotal]}>
    <Text
      style={[styles.priceLineLabel, isTotal && styles.priceLineLabelTotal]}
    >
      {label}
    </Text>
    <Text
      style={[styles.priceLineAmount, isTotal && styles.priceLineAmountTotal]}
    >
      {amount}
    </Text>
  </View>
);

// --- Component con: RadioOption ---
const RadioOption = ({
  title,
  subtitle,
  selected,
  onPress,
}: {
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.radioRow} onPress={onPress}>
    <View style={styles.radioTextContainer}>
      <Text style={styles.radioTitle}>{title}</Text>
      <Text style={styles.radioSubtitle}>{subtitle}</Text>
    </View>
    <View
      style={[
        styles.radioCircle,
        selected ? styles.radioCircleSelected : styles.radioCircleUnselected,
      ]}
    >
      {selected && <View style={styles.radioDot} />}
    </View>
  </TouchableOpacity>
);

// --- Màn hình chính ---
const ConfirmAndPayScreen = ({
  bookingData,
  setBookingData,
  prevStep,
  room,
  averageRating,
  totalReviews,
  setLoading,
}: Props) => {
  const router = useRouter();
  const [paymentOption, setPaymentOption] = useState("full");
  const [nights, setNights] = useState(1);
  const [totalRoomPrice, setTotalRoomPrice] = useState(room?.pricePerNight);

  // Modal state
  const [isDateModalVisible, setDateModalVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<"start" | "end">("start");
  const [showPicker, setShowPicker] = useState(false);

  const [isGuestModalVisible, setGuestModalVisible] = useState(false);

  useEffect(() => {
    const diff =
      Math.ceil(
        (bookingData.endDate.getTime() - bookingData.startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      ) || 1;
    setNights(diff);
    const total = diff * room?.pricePerNight;
    setTotalRoomPrice(total);
    setBookingData((prev: any) => ({ ...prev, totalPrice: total }));
  }, [bookingData.startDate, bookingData.endDate]);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setBookingData((prev: any) => {
        if (pickerMode === "start") {
          let newEnd =
            prev.endDate > selectedDate
              ? prev.endDate
              : new Date(selectedDate.getTime() + 86400000);
          return { ...prev, startDate: selectedDate, endDate: newEnd };
        }
        return { ...prev, endDate: selectedDate };
      });
    }
    if (Platform.OS !== "ios") setShowPicker(false);
  };

  const handleGuestChange = (
    field: "adults" | "children" | "infants",
    value: number
  ) => {
    setBookingData((prev: any) => ({ ...prev, [field]: value }));
  };

  const formatDateToYMD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handlePay = async () => {
    try {
      setLoading(true);
      const payload = {
        ...bookingData,
        totalPrice: totalRoomPrice,
        startDate: formatDateToYMD(new Date(bookingData.startDate)),
        endDate: formatDateToYMD(new Date(bookingData.endDate)),
      };

      console.log(payload);

      const res = await createBookingRoom(payload);
      console.log("res", res);

      Alert.alert("Booking Success", "Booking room success");
      router.replace("/client/booking");
    } catch (error: any) {
      console.log(error.response.data.message);

      // Alert.alert("Booking failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log("Quay lại")}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm & Pay</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Room Summary */}
        <View style={styles.roomSummary}>
          <Image
            source={{
              uri:
                room?.image ||
                "https://i.pinimg.com/1200x/47/f7/77/47f7772ed6ceff3f3692573e4ed96ed8.jpg",
            }}
            style={styles.roomImage}
          />
          <View style={styles.roomInfo}>
            <View style={styles.roomRating}>
              <FontAwesome name="star" size={16} color="#F59E0B" />
              <FontAwesome name="star" size={16} color="#F59E0B" />
              <FontAwesome name="star" size={16} color="#F59E0B" />
              <FontAwesome name="star" size={16} color="#F59E0B" />
              <FontAwesome name="star-o" size={16} color="#D1D5DB" />
              <Text style={styles.reviewText}>
                {averageRating} ({totalReviews} Reviews)
              </Text>
            </View>
            <Text style={styles.roomName}>{room?.name}</Text>
            <Text style={styles.roomLocation}>
              <Ionicons name="location-sharp" size={14} />{" "}
              {room?.location || "123 Phố Cổ, Quận Hoàn Kiếm, Hà Nội"}
            </Text>
            <Text style={styles.roomGuests}>
              {bookingData.adults} adults | {bookingData.children} children |{" "}
              {bookingData.infants} infants
            </Text>
          </View>
        </View>

        {/* Booking Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Booking Details</Text>

          <View style={styles.detailRow}>
            <View>
              <Text style={styles.detailLabel}>Dates</Text>
              <Text style={styles.detailValue}>
                {formatDate(bookingData.startDate)} -{" "}
                {formatDate(bookingData.endDate)}
              </Text>
            </View>

            {/* edit date */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setDateModalVisible(true)}
            >
              <MaterialCommunityIcons
                name="pencil-outline"
                size={20}
                color="#4B5563"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <View>
              <Text style={styles.detailLabel}>Guests</Text>
              <Text style={styles.detailValue}>
                {bookingData.adults} adults | {bookingData.children} children |{" "}
                {bookingData.infants} infants
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setGuestModalVisible(true)}
            >
              <MaterialCommunityIcons
                name="pencil-outline"
                size={20}
                color="#4B5563"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Option */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose how to pay</Text>
          <RadioOption
            title="Pay in full"
            subtitle="Pay the total now and you're all set."
            selected={paymentOption === "full"}
            onPress={() => setPaymentOption("full")}
          />
          <RadioOption
            title="Pay part now, part later"
            subtitle="Pay part now and you're all set."
            selected={paymentOption === "partial"}
            onPress={() => setPaymentOption("partial")}
          />
        </View>

        {/* Pay With */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pay with</Text>
          <View style={styles.paymentMethods}>
            <View style={styles.paymentIcons}>
              <FontAwesome name="cc-visa" size={24} color="#1A1F71" />
              <FontAwesome name="cc-mastercard" size={24} color="#EB001B" />
              <FontAwesome name="cc-paypal" size={24} color="#003087" />
              <AntDesign name="google" size={24} color="#4285F4" />
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Price Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          <PriceLine
            label={`$${formatMoney(room?.pricePerNight)} x ${nights} nights`}
            amount={`$${formatMoney(totalRoomPrice)}`}
          />
          <PriceLine label="Discount" amount="$0.00" />
          <PriceLine label="Taxes & fees" amount="$0.00" />
          <PriceLine
            label="Grand Total"
            amount={`$${formatMoney(totalRoomPrice)}`}
            isTotal
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={isDateModalVisible}
        onRequestClose={() => setDateModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "#00000099",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              margin: 20,
              padding: 20,
              borderRadius: 12,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}
            >
              Chọn ngày
            </Text>

            <TouchableOpacity
              style={{ marginBottom: 12 }}
              onPress={() => {
                setPickerMode("start");
                setShowPicker(true);
              }}
            >
              <Text>NHẬN PHÒNG: {formatDate(bookingData.startDate)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginBottom: 12 }}
              onPress={() => {
                setPickerMode("end");
                setShowPicker(true);
              }}
            >
              <Text>TRẢ PHÒNG: {formatDate(bookingData.endDate)}</Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={
                  pickerMode === "start"
                    ? bookingData.startDate
                    : bookingData.endDate
                }
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "calendar"}
                minimumDate={
                  pickerMode === "start"
                    ? new Date()
                    : new Date(bookingData.startDate.getTime() + 86400000)
                }
                onChange={handleDateChange}
              />
            )}

            <Button title="Done" onPress={() => setDateModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Modal Guest */}
      <Modal
        animationType="slide"
        transparent
        visible={isGuestModalVisible}
        onRequestClose={() => setGuestModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "#00000099",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              margin: 20,
              padding: 20,
              borderRadius: 12,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}
            >
              Select Guest
            </Text>

            {(["adults", "children", "infants"] as const).map((field) => (
              <View
                key={field}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 12,
                }}
              >
                <Text>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Button
                    title="-"
                    onPress={() =>
                      handleGuestChange(
                        field,
                        Math.max(
                          field === "adults" ? 1 : 0,
                          bookingData[field] - 1
                        )
                      )
                    }
                  />
                  <Text>{bookingData[field]}</Text>
                  <Button
                    title="+"
                    onPress={() =>
                      handleGuestChange(field, bookingData[field] + 1)
                    }
                  />
                </View>
              </View>
            ))}

            <Button title="Done" onPress={() => setGuestModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ConfirmAndPayScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },

  // Room Summary
  roomSummary: { flexDirection: "row", alignItems: "center", marginTop: 24 },
  roomImage: { width: 96, height: 96, borderRadius: 12 },
  roomInfo: { marginLeft: 16, flex: 1 },
  roomRating: { flexDirection: "row", alignItems: "center" },
  reviewText: { marginLeft: 8, fontSize: 12, color: "#4B5563" },
  roomName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 4,
  },
  roomLocation: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  roomGuests: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginTop: 4,
  },

  // Sections
  section: { marginTop: 32 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },

  // Booking Details Row
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  detailLabel: { fontSize: 14, fontWeight: "500", color: "#6B7280" },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 4,
  },
  editButton: {
    padding: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  // Radio
  radioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  radioTextContainer: { flex: 1, marginRight: 16 },
  radioTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  radioSubtitle: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 9999,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: { borderColor: "#2563EB" },
  radioCircleUnselected: { borderColor: "#D1D5DB" },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 9999,
    backgroundColor: "#2563EB",
  },

  // Payment Methods
  paymentMethods: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  paymentIcons: { flexDirection: "row", alignItems: "center", gap: 12 },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2563EB",
  },
  addButtonText: { color: "#2563EB", fontSize: 16, fontWeight: "bold" },

  // Price Details
  priceLineContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  priceLineLabel: { fontSize: 16, fontWeight: "500", color: "#6B7280" },
  priceLineAmount: { fontSize: 16, fontWeight: "600", color: "#111827" },
  priceLineTotal: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  priceLineLabelTotal: { fontWeight: "bold", color: "#111827" },
  priceLineAmountTotal: { fontWeight: "bold", color: "#111827" },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#fff",
    bottom: -40,
  },
  payButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
