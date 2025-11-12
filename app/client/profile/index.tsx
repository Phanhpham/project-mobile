import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { getUserInfo, UserInfo } from "@/utils/userUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- Component con ---
const MenuRow = ({ iconLib, iconName, text, onPress }: any) => {
  const IconComponent = iconLib;
  return (
    <TouchableOpacity onPress={onPress} style={styles.menuRow}>
      <View style={styles.menuLeft}>
        <IconComponent name={iconName} size={24} color="#4B5563" />
        <Text style={styles.menuText}>{text}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

const MenuToggle = ({ iconLib, iconName, text, value, onValueChange }: any) => {
  const IconComponent = iconLib;
  return (
    <View style={styles.menuRow}>
      <View style={styles.menuLeft}>
        <IconComponent name={iconName} size={24} color="#4B5563" />
        <Text style={styles.menuText}>{text}</Text>
      </View>
      <Switch
        trackColor={{ false: "#767577", true: "#34C759" }}
        thumbColor="#f4f3f4"
        ios_backgroundColor="#3e3e3e"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
};

// --- Màn hình chính ---
const ProfileScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const router = useRouter();
  const navigation = useNavigation();
  const handleProfile = () => {};

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

  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất không?", [
      {
        text: "Huỷ",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            router.replace("/(tabs)/authentication/login"); // Chuyển sang màn Login
          } catch (error) {
            console.error("Lỗi khi logout:", error);
            Alert.alert("Lỗi", "Không thể đăng xuất, vui lòng thử lại.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.headerInner}>
          <Text style={styles.headerTitle}>My Profile</Text>

          <View style={styles.headerContent}>
            {/* --- Cột trái: Avatar --- */}
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri:
                    userInfo?.avatar ||
                    "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
                }}
                style={styles.avatar}
              />
            </View>

            {/* --- Cột phải: Tên + Email + Nút Edit --- */}
            <View style={styles.infoContainer}>
              <View>
                <Text style={styles.userName}>
                  {userInfo?.username || "Guest"}
                </Text>
                <Text style={styles.userEmail}>
                  {userInfo?.email || "No email"}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  router.push("/client/profile/editProfile");
                }}
                style={styles.editButton}
              >
                <Feather name="edit-3" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Nội dung chính */}
      <View style={styles.body}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <MenuRow
            iconLib={Feather}
            iconName="edit-3"
            text="Chỉnh sửa hồ sơ"
            onPress={handleProfile}
          />
          <MenuRow
            iconLib={Ionicons}
            iconName="lock-closed-outline"
            text="Thay đổi mật khẩu"
            onPress={() => console.log("Change Password")}
          />
          <MenuRow
            iconLib={Ionicons}
            iconName="card-outline"
            text="Phương thức thanh toán"
            onPress={() => console.log("Payment Method")}
          />
          <MenuRow
            iconLib={Ionicons}
            iconName="clipboard-outline"
            text="Các phòng đã đặt của tôi"
          />
          <MenuToggle
            iconLib={Ionicons}
            iconName="eye-outline"
            text="Chế độ sáng/tối"
            value={isDarkMode}
            onValueChange={setIsDarkMode}
          />
          <MenuRow
            iconLib={Ionicons}
            iconName="shield-checkmark-outline"
            text="Chính sách riêng tư"
            onPress={() => router.push('/client/profile/privacyPolicyScreen')}
          />
          <MenuRow
            iconLib={Ionicons}
            iconName="document-text-outline"
            text="Điều khoản và dịch vụ"
            onPress={() => router.push('/client/profile/termsConditionsScreen')}
          />
        </ScrollView>

        {/* Nút Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- StyleSheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2563EB", // blue-600
  },
  headerContainer: {
    backgroundColor: "#2563EB",
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerInner: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    color: "#BFDBFE", // blue-200
    fontSize: 14,
  },
  editButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 50,
  },
  body: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    color: "#1F2937", // gray-800
    marginLeft: 16,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 14,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginRight: 12,
  },
});

export default ProfileScreen;
