import React, { useCallback, useEffect, useState } from "react";
import RoomDetailStep from "./detailRoom";
import ConfirmAndPayStep from "./payment";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import Loading from "@/components/Loading";
import { getUserInfo, UserInfo } from "@/utils/userUtils";

export default function BookingFlowScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { idRoom, idHotel, room, averageRating, totalReviews } =
    useLocalSearchParams();
  const parsedRoom = room ? JSON.parse(room as string) : null;
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

  useEffect(() => {
    if (userInfo?.id) {
      setBookingData((prev) => ({
        ...prev,
        userId: userInfo.id,
      }));
    }
  }, [userInfo]);

  const [bookingData, setBookingData] = useState({
    userId: userInfo?.id,
    hotelId: Number(idHotel),
    roomId: Number(idRoom),
    startDate: new Date(),
    endDate: new Date(),
    adults: 1,
    children: 0,
    infants: 0,
    paymentMethod: "CARD",
    paymentOption: "FullPayment",
    totalPrice: 0,
  });

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <View style={{ flex: 1 }}>
      {currentStep === 1 && (
        <RoomDetailStep
          bookingData={bookingData}
          setBookingData={setBookingData}
          nextStep={nextStep}
        />
      )}

      {currentStep === 2 && (
        <ConfirmAndPayStep
          bookingData={bookingData}
          setBookingData={setBookingData}
          prevStep={prevStep}
          room={parsedRoom}
          setLoading={setLoading}
          averageRating={averageRating}
          totalReviews={totalReviews}
        />
      )}

      <Loading loading={loading} />
    </View>
  );
}
