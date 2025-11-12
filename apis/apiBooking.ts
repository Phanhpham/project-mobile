import { axiosInstance } from "@/utils/axiosInstance";

// api createBookingRoom
export const createBookingRoom = async (data: any) => {
  const response = await axiosInstance.post(`/booking`, data);
  return response.data;
};
// api getBooking
export const getBooking = async (userId?: number, bookingStatus?: string) => {
  // const params: any = {};

  // if (userId) params.userId = userId;
  // if (bookingStatus) params.bookingStatus = bookingStatus;

  const response = await axiosInstance.get(`/bookingStatus?userId=${userId}&bookingStatus=${bookingStatus}`);
  return response.data;
};

// API lấy các khoảng ngày theo phòng
export const getBookingsByRoomId = async (roomId: number) => {
  const response = await axiosInstance.get(`/booking/room/${roomId}/booked-dates`);
  return response.data;
}

// API hủy đặt phòng
export const cancelBooking = async (bookingId: number) => {
  const response = await axiosInstance.patch(`/booking/${bookingId}`);
  return response.data;
}