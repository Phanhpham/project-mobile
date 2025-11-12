import AsyncStorage from "@react-native-async-storage/async-storage";

// Kiểu dữ liệu user, nên đồng bộ với response từ API
export interface UserInfo {
  id?: number;
  username: string;
  avatar: string;
  email: string;
  gender: boolean;
  phone: string;
}

/**
 * Lấy thông tin user từ AsyncStorage
 */
export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem("user");
    if (!jsonValue) return null;
    return JSON.parse(jsonValue) as UserInfo;
  } catch (error) {
    console.error("Lấy user info lỗi:", error);
    return null;
  }
};

/**
 * Lưu thông tin user vào AsyncStorage
 */
export const saveUserInfo = async (user: UserInfo) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Lưu user info lỗi:", error);
  }
};

/**
 * Xoá user khỏi AsyncStorage (logout)
 */
export const removeUserInfo = async () => {
  try {
    await AsyncStorage.removeItem("user");
  } catch (error) {
    console.error("Xoá user info lỗi:", error);
  }
};
