import { getDetailImage } from "@/apis/apiRoom";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Modal,
  StatusBar,
} from "react-native";

// Lấy kích thước màn hình để đảm bảo Modal full screen
const { width, height } = Dimensions.get("window");

// Bạn cần một URI/đường dẫn ảnh ở đây.
const ZOOMED_IMAGE_URI =
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?fit=crop&w=1080&h=1920&q=80";

const ImageZoomView = () => {
  const { roomId, imageId } = useLocalSearchParams();
  const router = useRouter();
  const [detailPhoto, setDetailPhoto] = useState<any>({});

  const getDetail = async () => {
    try {
      const response = await getDetailImage(Number(imageId),Number(roomId));
      setDetailPhoto(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  console.log(roomId, imageId);

  // Biến trạng thái để kiểm soát việc hiển thị Modal (màn hình zoom)
  const [isZoomVisible, setIsZoomVisible] = useState(true);

  // Hàm để đóng màn hình zoom (Modal)
  const handleClose = () => {
    setIsZoomVisible(false);
    router.back();
  };

  return (
    // Component Modal để hiển thị giao diện full-screen
    <Modal
      animationType="slide"
      transparent={false}
      visible={isZoomVisible}
      onRequestClose={handleClose}
    >
      {/* Đảm bảo thanh trạng thái màu sáng, giống ảnh */}
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>
        {/* ImageBackground để đặt ảnh và phủ toàn bộ màn hình */}
        <ImageBackground
          source={{ uri: detailPhoto?.imageURL }}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          {/* Vùng ảnh trung tâm (không cần nội dung) */}
        </ImageBackground>

        {/* --- Thanh Công Cụ Dưới Cùng (Bottom Bar) --- */}
        <View style={styles.bottomBar}>
          <View style={styles.iconContainer}>
            {/* Icon 1: Mũi tên trái */}
            <TouchableOpacity
              onPress={() => router.back}
              style={styles.iconButton}
            >
              <Text style={styles.iconText}>{"<"}</Text>
            </TouchableOpacity>

            {/* Icon 2: Mũi tên phải */}
            <TouchableOpacity
              onPress={() => console.log("Next")}
              style={styles.iconButton}
            >
              <Text style={styles.iconText}>{">"}</Text>
            </TouchableOpacity>

            {/* Icon 3: Share (Ví dụ) */}
            <TouchableOpacity
              onPress={() => console.log("Share")}
              style={styles.iconButton}
            >
              <Text style={styles.iconText}>...</Text>
            </TouchableOpacity>
          </View>

          {/* Nút "Ask to edit" */}
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Ask to edit</Text>
          </TouchableOpacity>
        </View>

        {/* Nút đóng (tùy chọn, để thoát khỏi Modal) */}
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

// --- StyleSheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Nền đen cho màn hình zoom
  },
  imageBackground: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },

  // Thanh công cụ dưới cùng (Bottom Bar)
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Nền trong suốt màu đen
  },
  iconContainer: {
    flexDirection: "row",
    // Tạo khoảng cách giữa các icon
    gap: 15,
  },
  iconButton: {
    padding: 8,
  },
  iconText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },

  // Nút "Ask to edit"
  editButton: {
    backgroundColor: "#007AFF", // Màu xanh dương Apple
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 20, // Bo tròn
  },
  editButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },

  // Nút đóng (ở góc trên/dưới)
  closeButton: {
    position: "absolute",
    top: 50, // Điều chỉnh vị trí tùy theo thanh trạng thái
    left: 15,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default ImageZoomView;
