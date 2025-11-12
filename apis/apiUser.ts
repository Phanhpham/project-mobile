import { LoginUser, UserRequest } from "@/interface/user"
import { axiosInstance } from "@/utils/axiosInstance"
import axios from "axios"

// Ham lay danh sach User
export const getAllUser = async () => {
    const response = await axiosInstance.get("/users")
    return response.data
}

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

//log out User


//hien thi thong tin ben profile
export const getUserProfile = async (userId: number) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error(" Lỗi khi gọi API user:", error.response?.data || error.message);
      throw error;
    }
};

//update profile user
export const updateUserProfile = async (userId?: number, payload?: any) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}/profile`, payload);
    return response.data;
  } catch (error: any) {
    console.error(" Lỗi khi gọi API user:", error.response?.data || error.message);
    throw error;
  }
};

// forgot password
export const forgotPassword = async(email: string)=> {
  const response = await axiosInstance.post(`/auth/forgot-password?email=${email}`)
  return response.data
}

export const verifyOtp = async(body: any)=> {
  const response = await axiosInstance.post(`/auth/verify-otp`,body)
  return response.data
}

export const resetPassword = async(body: any)=> {
  const response = await axiosInstance.post(`/auth/reset-password`,body)
  return response.data
}