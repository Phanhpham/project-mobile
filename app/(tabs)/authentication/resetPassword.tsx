import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { resetPassword } from "@/apis/apiUser";

const NewPasswordScreen = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  const validate = () => {
    const newErrors: any = {};

    if (!password.trim()) {
      newErrors.password = "Password không được để trống!";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Mật khẩu phải có ít nhất 8 ký tự, 1 chữ in hoa và 1 ký tự đặc biệt!";
    }

    if (!confirm.trim()) {
      newErrors.confirm = "Vui lòng nhập lại mật khẩu!";
    } else if (password !== confirm) {
      newErrors.confirm = "Mật khẩu xác nhận không khớp!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const body = {
        email,
        newPassword: password,
        newPasswordConfirm: confirm,
      };

      await resetPassword(body);

      Alert.alert("Thành công", "Đổi mật khẩu thành công!");
      router.push("/(tabs)/authentication/login");
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Không thể đổi mật khẩu!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter New Password</Text>
      <Text style={styles.subtitle}>Please enter new password for {email}</Text>

      {/* Password */}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="New Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors({ ...errors, password: "" });
          }}
          style={[
            styles.input,
            errors.password ? styles.inputError : styles.inputNormal,
          ]}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#4B56F9"
          />
        </TouchableOpacity>
      </View>
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      {/* Confirm Password */}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry={!showConfirm}
          value={confirm}
          onChangeText={(text) => {
            setConfirm(text);
            if (errors.confirm) setErrors({ ...errors, confirm: "" });
          }}
          style={[
            styles.input,
            errors.confirm ? styles.inputError : styles.inputNormal,
          ]}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowConfirm(!showConfirm)}
        >
          <Ionicons
            name={showConfirm ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#4B56F9"
          />
        </TouchableOpacity>
      </View>
      {errors.confirm && <Text style={styles.errorText}>{errors.confirm}</Text>}

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        disabled={loading}
        onPress={handleSave}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default NewPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: { fontSize: 24, fontWeight: "700", color: "#000", marginBottom: 10 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 30 },

  inputWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    paddingRight: 45,
    fontSize: 16,
  },
  inputNormal: { borderColor: "#ccc" },
  inputError: { borderColor: "red" },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 16,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
  },
  button: {
    backgroundColor: "#4B56F9",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
