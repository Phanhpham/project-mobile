import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
// Thay đổi import: Sử dụng component Feather từ @expo/vector-icons
import { Feather } from "@expo/vector-icons";
import { getUserInfo, saveUserInfo, UserInfo } from "@/utils/userUtils";
import { useRouter } from "expo-router";
import { updateUserProfile } from "@/apis/apiUser";
import { SafeAreaView } from "react-native-safe-area-context";
import { uploadImageToCloudinary } from "@/utils/cloudinary";

// --- CÁC HẰNG SỐ VỀ MÀU SẮC VÀ KÍCH THƯỚC ---
const PRIMARY_COLOR = "#673ab7"; // Màu xanh tím đậm
const BORDER_COLOR = "#e0e0e0";
const PLACEHOLDER_COLOR = "#757575";

// --- KHAI BÁO PROPS (TypeScript style for clarity, though used in JS) ---

const CustomInputField = ({
  label,
  value,
  onChangeText,
  editable = true,
  keyboardType = "default",
  isDate = false,
}: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputRow}>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        keyboardType={keyboardType}
        placeholderTextColor={PLACEHOLDER_COLOR}
      />
      {isDate && (
        <TouchableOpacity style={styles.dateIcon}>
          <Feather name="calendar" size={24} color={PLACEHOLDER_COLOR} />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const RadioButton = ({ label, selected, onSelect }: any) => (
  <TouchableOpacity style={styles.radioContainer} onPress={onSelect}>
    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
      {selected && <View style={styles.radioInner} />}
    </View>
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

// --- COMPONENT CHÍNH ---
const EditProfileScreen = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const user = await getUserInfo();
      if (user) setUserInfo(user);
    };
    loadUser();
  }, []);

  const pickMediaFromCamera = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      Alert.alert(
        "Thông báo",
        "Bạn cần cấp quyền truy cập vào thư viện để thực hiện chức năng này."
      );
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "livePhotos"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setLoading(true);
      const localUri = result.assets[0].uri;
      
      const uploadUri = await uploadImageToCloudinary(localUri);
      
      setUserInfo((prev) => (prev ? { ...prev, avatar: uploadUri } : prev));
      setLoading(false);
    }
  };

  const handleChange = (key: keyof UserInfo, value: any) => {
    if (!userInfo) return;
    setUserInfo({ ...userInfo, [key]: value });
  };

  const validateAndSave = async () => {
    if (!userInfo) return;

    if (!userInfo.username?.trim()) {
      return Alert.alert("Validation Error", "Name không được để trống!");
    }
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(userInfo.phone || "")) {
      return Alert.alert("Validation Error", "Số điện thoại không hợp lệ!");
    }

    try {
      // Gọi API cập nhật
      await updateUserProfile(userInfo.id, userInfo);

      // Lưu lại vào AsyncStorage
      await saveUserInfo(userInfo);

      Alert.alert("Thành công", "Cập nhật thông tin thành công!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin. Vui lòng thử lại!");
    }
  };

  if (!userInfo) return null; // loading state hoặc spinner cũng được

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* Sửa icon: Dùng Feather cho nút Quay lại */}
        <Feather name="chevron-left" size={28} color="#000" />
        <Text style={styles.title}>Edit Profile</Text>
        <View style={{ width: 28 }} />
      </View>
      <ScrollView style={styles.container}>
        {/* Khu vực Ảnh Đại diện */}
        <View style={styles.profileImageContainer}>
          {loading && <ActivityIndicator size="large" color="red" />}

          {userInfo.avatar && (
            <Image
              source={{
                uri: userInfo.avatar,
              }}
              style={styles.profileImage}
            />
          )}
          <TouchableOpacity style={styles.editIcon} onPress={pickMediaFromCamera}>
            {/* Sửa icon: Dùng Feather cho biểu tượng Bút chì */}
            <Feather name="edit-2" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Các Trường Nhập Liệu */}
        <CustomInputField
          label="Name"
          value={userInfo.username}
          onChangeText={(text: any) => handleChange("username", text)}
        />
        <CustomInputField
          label="Email Address"
          value={userInfo.email}
          editable={false}
          keyboardType="email-address"
          onChangeText={() => {}}
        />
        <CustomInputField
          label="Mobile Number"
          value={userInfo.phone || ""}
          onChangeText={(text: any) => handleChange("phone", text)}
          keyboardType="phone-pad"
        />

        {/* Khu vực Giới tính */}
        <Text style={styles.genderTitle}>Gender</Text>
        <View style={styles.genderOptions}>
          <RadioButton
            label="Male"
            selected={userInfo.gender}
            onSelect={() => handleChange("gender", true)}
          />
          <RadioButton
            label="Female"
            selected={!userInfo.gender}
            onSelect={() => handleChange("gender", false)}
          />
        </View>

        {/* Nút Cập nhật */}
        <TouchableOpacity style={styles.updateButton} onPress={validateAndSave}>
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- STYLING THUẦN NATIVE ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  // --- Profile Image ---
  profileImageContainer: {
    alignSelf: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 15,
    padding: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },
  // --- Input Field ---
  inputContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputLabel: {
    fontSize: 12,
    color: PRIMARY_COLOR,
    position: "absolute",
    top: -8,
    left: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 4,
    zIndex: 1,
  },
  textInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#000",
    padding: 0,
  },
  dateIcon: {
    marginLeft: 10,
  },
  // --- Gender Radio Buttons ---
  genderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginTop: 10,
    marginBottom: 5,
  },
  genderOptions: {
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  radioOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: PLACEHOLDER_COLOR,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioOuterSelected: {
    borderColor: PRIMARY_COLOR,
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: PRIMARY_COLOR,
  },
  radioLabel: {
    fontSize: 16,
    color: "#000",
  },
  // --- Update Button ---
  updateButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
