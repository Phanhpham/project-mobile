import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LoginUser } from "@/interface/user";
import { useMutation } from "@tanstack/react-query";
import { loginUsers } from "@/apis/apiUser";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const router = useRouter();

  const [loginUser, setLoginUser] = useState<LoginUser>({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: loginUsers,
    mutationKey: ["login"],
    onSuccess: async (response) => {
      const infoUser = {
        id: response.id,
        username: response.username,
        email: response.email,
        avatar: response.avatar,
        phone: response.phone,
        gender: response.gender,
      };

      await AsyncStorage.setItem("user", JSON.stringify(infoUser));
      Alert.alert("Thanh cong!!!", "Dang nhap thanh cong !");
      router.push("/client/room/home");
    },
    onError: () => {
      Alert.alert("That bai", "email hoac mat khau khong dung");
    },
  });

  const handleChange = (field: string, value: any) => {
    setLoginUser({
      ...loginUser,
      [field]: value,
    });
  };
  const regexEmail = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
  const handleSubmit = async () => {
    let isValid = true;
    const newError = {
      email: "",
      password: "",
    };

    if (!loginUser.email.trim()) {
      newError.email = "Email khong duoc de trong !";
      isValid = false;
    } else if (!regexEmail.test(loginUser.email)) {
      newError.email = "Khong dung dinh dang email!";
      isValid = false;
    }

    if (!loginUser.password.trim()) {
      newError.password = "Password khong duoc de trong !";
      isValid = false;
    }
    setError(newError);

    if (!isValid) return;
    loginMutation(loginUser);

    // await AsyncStorage.setItem("user", JSON.stringify(loginUser));
  };

  const handleForgotPassword = () => {
    router.push("/(tabs)/authentication/forgotPass")
  }
  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>
          <Text style={{ color: "#5A5AED", fontWeight: "700" }}>Olive</Text>{" "}
          Green
        </Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Let’s get you Login!</Text>
      <Text style={styles.subtitle}>Enter your information below</Text>

      {/* Social Buttons */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Google_2015_logo.svg",
            }}
            style={styles.icon}
          />
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
            }}
            style={styles.icon}
          />
          <Text style={styles.socialText}>Facebook</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>Or login with</Text>
        <View style={styles.line} />
      </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} color="#BEBEBE" />
          <TextInput
            placeholder="Enter Email"
            style={styles.input}
            value={loginUser.email}
            onChangeText={(text) => handleChange("email", text)}
          />
        </View>
        {error.email && <Text style={{ color: "red" }}>{error.email}</Text>}

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#BEBEBE" />
          <TextInput
            placeholder="Enter Password"
            style={styles.input}
            secureTextEntry
            value={loginUser.password}
            onChangeText={(text) => handleChange("password", text)}
          />
        </View>
        {error.password && (
          <Text style={{ color: "red" }}>{error.password}</Text>
        )}
      </View>
      <TouchableOpacity
        onPress={handleForgotPassword}
      >
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* Register Link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don’t have an account? </Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/authentication/register")}
        >
          <Text style={styles.registerText}>Register Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 25,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoText: {
    fontSize: 26,
    fontWeight: "700",
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 5,
    color: "#000",
  },
  subtitle: {
    textAlign: "center",
    color: "#A1A1A1",
    marginBottom: 25,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 5,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  socialText: {
    fontSize: 15,
    fontWeight: "500",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#EAEAEA",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#9E9E9E",
    fontSize: 13,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  forgotPassword: {
    textAlign: "right",
    color: "#5A5AED",
    marginBottom: 25,
  },
  loginButton: {
    backgroundColor: "#5A5AED",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 25,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    color: "#777",
  },
  registerText: {
    color: "#5A5AED",
    fontWeight: "600",
  },
});
