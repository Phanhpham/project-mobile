import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { User, UserRequest } from "@/interface/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllUser, registerUser } from "@/apis/apiUser";

export default function RegisterScreen() {
  const [userRequest, setUserRequest] = useState<UserRequest>({
    username: "",
    email: "",
    password: "",
    avatar:
      "https://i.pinimg.com/originals/bc/43/98/bc439871417621836a0eeea768d60944.jpg",
    phone: "",
    gender: false,
    dob: "",
  });
  const router = useRouter();
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { data: users } = useQuery({
    queryFn: getAllUser,
    queryKey: ["users"],
  });

  const { mutate: registerMutation, isPending } = useMutation({
    mutationFn: registerUser,
    mutationKey: ["register"],
    onSuccess: () => {
      Alert.alert("Thanh cong!!!", "Dang ky thanh cong !");
      router.push("/authentication/login");
    },
    onError: (error: any) => {
      Alert.alert("That bai", JSON.stringify(error.response.data.message));
    },
  });

  const regexEmail = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
  const regexPhone = /^(0(3|5|7|8|9)\d{8}|\+84(3|5|7|8|9)\d{8})$/;

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
      handleChange("dob", selectedDate.toISOString().split("T")[0]);
    }
  };

  const handleChange = (field: string, value: any) => {
    setUserRequest({
      ...userRequest,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    let isValid = true;
    const newError = {
      username: "",
      email: "",
      password: "",
      phone: "",
    };

    const existingEmail = users?.find(
      (user: User) => user.email === userRequest.email
    );
    const existingPhone = users?.find(
      (user: User) => user.phone === userRequest.phone
    );

    if (!userRequest.username.trim()) {
      newError.username = "Ten khong duoc de trong !";
      isValid = false;
    }
    if (!userRequest.email.trim()) {
      newError.email = "Email khong duoc de trong !";
      isValid = false;
    } else if (!regexEmail.test(userRequest.email)) {
      newError.email = "Khong dung dinh dang email!";
      isValid = false;
    } else if (existingEmail) {
      newError.email = "email da ton tai !!";
      isValid = false;
    }

    if (!userRequest.phone.trim()) {
      newError.phone = "Sdt khong duoc de trong !";
      isValid = false;
    } else if (!regexPhone.test(userRequest.phone)) {
      newError.phone = "Khong dung dinh dang sdt!";
      isValid = false;
    } else if (existingPhone) {
      newError.phone = "Sdt da ton tai !!";
      isValid = false;
    }

    if (!userRequest.password.trim()) {
      newError.password = "Password khong duoc de trong !";
      isValid = false;
    }

    setError(newError);

    if (!isValid) return;

    registerMutation(userRequest);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>
              <Text style={{ color: "#5A5AED", fontWeight: "700" }}>Olive</Text>{" "}
              Green
            </Text>
          </View>

          <Text style={styles.title}>Register Now!</Text>
          <Text style={styles.subtitle}>Enter your information below</Text>

          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder="Curtis Weaver"
              value={userRequest.username}
              onChangeText={(text) => handleChange("username", text)}
              style={styles.input}
            />
            {error.username && (
              <Text style={{ color: "red" }}>{error.username}</Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              placeholder="curtis.weaver@example.com"
              keyboardType="email-address"
              value={userRequest.email}
              onChangeText={(text) => handleChange("email", text)}
              style={styles.input}
            />
            {error.email && <Text style={{ color: "red" }}>{error.email}</Text>}
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              placeholder="(209) 555-0104"
              keyboardType="phone-pad"
              value={userRequest.phone}
              onChangeText={(text) => handleChange("phone", text)}
              style={styles.input}
            />
            {error.phone && <Text style={{ color: "red" }}>{error.phone}</Text>}
          </View>

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={styles.datePicker}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {userRequest.dob
                  ? userRequest.dob
                  : "Select your date of birth"}
              </Text>

              <Ionicons name="calendar-outline" size={20} color="#5A5AED" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>
          {/* <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="password"
              value={userRequest.password}
              onChangeText={(text) => handleChange("password", text)}
              secureTextEntry={true}
              style={styles.input}
            />
            {error.password && (
              <Text style={{ color: "red" }}>{error.password}</Text>
            )}
          </View> */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="password"
                value={userRequest.password}
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry={!showPassword}
                style={[styles.input, { flex: 1, borderWidth: 0 }]}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#5A5AED"
                />
              </TouchableOpacity>
            </View>
            {error.password && (
              <Text style={{ color: "red" }}>{error.password}</Text>
            )}
          </View>

          {/* Gender */}
          <Text style={styles.genderTitle}>Gender</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => setUserRequest({ ...userRequest, gender: true })}
            >
              <View
                style={[
                  styles.radioOuter,
                  userRequest.gender && styles.radioOuterActive,
                ]}
              >
                {userRequest.gender && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.genderText}>Male</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => setUserRequest({ ...userRequest, gender: false })}
            >
              <View
                style={[
                  styles.radioOuter,
                  !userRequest.gender && styles.radioOuterActive,
                ]}
              >
                {!userRequest.gender && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.genderText}>Female</Text>
            </TouchableOpacity>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleSubmit}
          >
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already a member? </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/authentication/login")}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-end", // 👈 đẩy toàn bộ nội dung xuống dưới
    paddingTop: 100, // tạo khoảng cách với đầu màn hình
    paddingBottom: 50, // giữ khoảng thở dưới cùng
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
    width: "90%",
    alignSelf: "center",
    maxWidth: 400,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "700",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
    color: "#000",
  },
  subtitle: {
    textAlign: "center",
    color: "#A1A1A1",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: "#5A5AED",
    marginBottom: 5,
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: "#5A5AED",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#5A5AED",
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  datePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#5A5AED",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dateText: {
    color: "#000",
    fontSize: 14,
  },
  genderTitle: {
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  genderContainer: {
    flexDirection: "row",
    marginBottom: 25,
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#C8C8C8",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: {
    borderColor: "#5A5AED",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#5A5AED",
  },
  genderText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#000",
  },
  registerButton: {
    backgroundColor: "#5A5AED",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#5A5AED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  registerText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  footerText: {
    color: "#777",
    fontSize: 13,
  },
  loginText: {
    color: "#5A5AED",
    fontWeight: "600",
    fontSize: 13,
  },
});
