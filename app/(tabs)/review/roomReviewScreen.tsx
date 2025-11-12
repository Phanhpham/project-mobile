import { createReviewRoom, getReviewRoom } from "@/apis/apiRoom";
import Loading from "@/components/Loading";
import { getUserInfo, UserInfo } from "@/utils/userUtils";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RoomReviewScreen = () => {
  const router = useRouter();
  const { idRoom, idHotel } = useLocalSearchParams();

  const [userReview, setUserReview] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // State comment mới
  const [newComment, setNewComment] = useState({
    rating: 0,
    comment: "",
  });

  // ⭐ Render sao
  const renderStars = (count: number, interactive = false) => {
    return (
      <View style={{ flexDirection: "row" }}>
        {[...Array(5)].map((_, index) => {
          const starNumber = index + 1;
          return (
            <TouchableOpacity
              key={index}
              disabled={!interactive}
              onPress={() => {
                if (interactive)
                  setNewComment({ ...newComment, rating: starNumber });
              }}
            >
              <Text
                style={{
                  color: starNumber <= count ? "#FFD700" : "#ccc",
                  fontSize: interactive ? 28 : 14,
                  marginHorizontal: interactive ? 2 : 0,
                }}
              >
                ★
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

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

  // 🧩 Lấy review phòng
  const getAllReviewRoom = async () => {
    try {
      setLoading(true);
      const response = await getReviewRoom(Number(idRoom));
      setUserReview(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllReviewRoom();
    loadProfile();
  }, []);

  // 🚀 Thêm comment mới
  const handleAddComment = async () => {
    if (!newComment.rating || !newComment.comment.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn số sao và nhập cảm nhận!");
      return;
    }

    try {
      const newReview = {
        userId: userInfo?.id,
        roomId: idRoom,
        hotelId: idHotel,
        rating: newComment.rating,
        comment: newComment.comment,
      };

      setLoading(true);
      await createReviewRoom(newReview);
      await getAllReviewRoom();
      // Reset form
      setNewComment({ rating: 0, comment: "" });
      Keyboard.dismiss(); // 👈 ẩn bàn phím sau khi submit
      Alert.alert("Cảm ơn bạn!", "Đánh giá của bạn đã được gửi.");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/client/room/detailRoom",
              params: { idRoom, idHotel },
            })
          }
        >
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>Đánh giá phòng</Text>

      {/* Form nhập */}
      <View style={styles.form}>
        <Text style={styles.label}>Chọn số sao của bạn:</Text>
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          {renderStars(newComment.rating, true)}
        </View>

        <TextInput
          style={[styles.input, styles.commentInput]}
          placeholder="Viết cảm nhận của bạn..."
          multiline
          value={newComment.comment}
          onChangeText={(text) =>
            setNewComment({ ...newComment, comment: text })
          }
        />

        <TouchableOpacity style={styles.button} onPress={handleAddComment}>
          <Text style={styles.buttonText}>Gửi đánh giá</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách review */}
      <FlatList
        data={userReview}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.date}>{item.createdAt}</Text>
              </View>
              {renderStars(item.rating)}
            </View>
            <Text style={styles.comment}>{item.comment}</Text>
          </View>
        )}
      />

      <Loading loading={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1a1a1a",
    marginVertical: 10,
  },
  form: {
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  commentInput: {
    height: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  list: {
    paddingBottom: 100,
  },
  reviewCard: {
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  date: {
    fontSize: 12,
    color: "#777",
  },
  comment: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
});

export default RoomReviewScreen;
