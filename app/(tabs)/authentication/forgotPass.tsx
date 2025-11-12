import { forgotPassword } from "@/apis/apiUser";
import Loading from "@/components/Loading";
import { useRouter } from "expo-router";
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

const ForgotPasswordScreen = ({ navigation }: any) => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<"sms" | "email" | null>(
    null
  );
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const regexEmail = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;

  const handleForgotPassword = async (email: string) => {
    try {
      setLoading(true);
      await forgotPassword(email);
      Alert.alert("Forgot Password", `Đã gửi OTP đến ${email}`);
      router.push({
        pathname: "/(tabs)/authentication/verifyOTP",
        params: { email },
      });
    } catch (error: any) {
      Alert.alert("Forgot Password", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (selectedOption !== "email") {
      Alert.alert("Thông báo", "Vui lòng chọn phương thức gửi OTP qua Email!");
      return;
    }

    if (!email.trim()) {
      setError("Email không được để trống!");
      return;
    }

    if (!regexEmail.test(email)) {
      setError("Email không hợp lệ!");
      return;
    }

    setError("");
    handleForgotPassword(email);
  };
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Select which contact details should we use to reset your password
        </Text>

        <View style={[styles.optionBox, { opacity: 0.4 }]}>
          <Text style={styles.optionTitle}>Send OTP via SMS</Text>
          <Text style={styles.optionSubtitle}>(209) 555-0104</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.optionBox,
            selectedOption === "email" && styles.selectedBox,
          ]}
          onPress={() => setSelectedOption("email")}
        >
          <Text style={styles.optionTitle}>Send OTP via Email</Text>
          <Text style={styles.optionSubtitle}>example@email.com</Text>
        </TouchableOpacity>

        {/* Hiện ô nhập email nếu chọn Email */}
        {selectedOption === "email" && (
          <View style={{ marginBottom: 20 }}>
            <TextInput
              placeholder="Nhập email của bạn"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      <Loading loading={loading} />
    </>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: { fontSize: 24, fontWeight: "700", color: "#000", marginBottom: 10 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 30 },
  optionBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  optionTitle: { fontWeight: "600", color: "#000" },
  optionSubtitle: { fontSize: 14, color: "#666" },
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
  selectedBox: {
    borderColor: "#4B56F9",
    borderWidth: 2,
    backgroundColor: "#EEF0FF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#4B56F9",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    marginTop: 5,
  },
  errorText: { color: "red", marginTop: 4, fontSize: 13 },
});
