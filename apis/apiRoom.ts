import { LoginUser, UserRequest } from "@/interface/user";
import { axiosInstance } from "@/utils/axiosInstance";
import axios from "axios";
import { RoomResponse } from "@/interface/room";

// Hàm lấy danh sách phòng (có thể sort + lọc giá)
export const getListRoom = async (
  hotelId: number,
  sortType?: string,
  minPrice?: number,
  maxPrice?: number
): Promise<RoomResponse[]> => {
  const response = await axiosInstance.get(`/${hotelId}/rooms`, {
    params: {
      sort: sortType,
      minPrice,
      maxPrice,
    },
  });
  return response.data;
};
// detail room
export const getDetailRoom = async (idRoom: number) => {
    const response = await axiosInstance.get(`/rooms/${idRoom}`);
    return response.data;
  };
//  Search room theo keyword
export const searchRoom = async (keyword: string): Promise<RoomResponse[]> => {
  const response = await axiosInstance.get(`/rooms/search`, {
      params: { keyword },
  });
  return response.data;
};

// api anh chi tiet 
export const getDetailImage = async( idImage: number, idRoom: number) => {
  const response = await axiosInstance.get(`/rooms/${idRoom}/images/${idImage}`)
  return response.data;
}
// api review room

// get review room
export const getReviewRoom = async (idRoom: number) => {
  const response = await axiosInstance.get(`/reviews/room/${idRoom}`);
  return response.data;
};

// api add new review
export const createReviewRoom = async (data: any) => {
  const response = await axiosInstance.post(`/reviews`, data);
  return response.data;
};
