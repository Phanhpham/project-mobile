import { LoginUser, UserRequest } from "@/interface/user"
import { axiosInstance } from "@/utils/axiosInstance"
import axios from "axios"

// Ham lay danh sach User
export const getListHotel = async (
    idProvince: number,
    sortType?: string,
    localities?: string[]
  ) => {
    const params: any = {};
    if (sortType) params.sortBy = sortType;
    if (localities && localities.length > 0) params.locality = localities.join(",");
    const response = await axiosInstance.get(`/${idProvince}/hotels`, { params });
    return response.data;
  };

// API lấy danh sách tỉnh/thành
export const getAllProvinces = async () => {
  try {
    const response = await axiosInstance.get("/provinces");
    return response.data; 
  } catch (error) {
    console.error(" Lỗi khi lấy danh sách tỉnh/thành:", error);
    return [];
  }
};

//api register  
export const registerUser = async (data:UserRequest) => {
    
    const response = await axiosInstance.post("/users/register", data)
    console.log("response-----", response);
    return response.data
}

export const loginUsers = async(data:LoginUser)=> {
    console.log("data----", data);
    
    const response = await axiosInstance.post("/users/login",data)

    
    return response.data
}

// api lay tinh thanh 
