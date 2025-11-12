import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
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
import { verifyOtp } from "@/apis/apiUser";

const EnterOTPScreen = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move focus forward
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }

    // Khi đủ 6 số, tự call API
    if (newOtp.join("").length === 6) {
      handleVerifyOtp(newOtp.join(""));
    }
  };

  const handleVerifyOtp = async (otpCode: string) => {
    try {
      setLoading(true);
      const bodyPayload = {
        email,
        otp: otpCode,
      };
      await verifyOtp(bodyPayload);
      Alert.alert("Thành công", "Xác thực OTP thành công!");
      router.push({
        pathname: "/(tabs)/authentication/resetPassword",
        params: { email },
      });
    } catch (error: any) {
      Alert.alert(
        "Sai OTP",
        error.response?.data?.message || "OTP không hợp lệ!"
      );
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP Code</Text>
      <Text style={styles.subtitle}>
        OTP code has been sent to {email || "your email"}
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={(ref: any) => (inputs.current[i] = ref!)}
            style={styles.otpInput}
            value={digit}
            maxLength={1}
            keyboardType="number-pad"
            onChangeText={(text) => handleChange(text, i)}
          />
        ))}
      </View>

      {loading && <ActivityIndicator size="large" color="#4B56F9" />}

      <TouchableOpacity>
        <Text style={styles.resendText}>Resend code 00:52s</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EnterOTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: { fontSize: 24, fontWeight: "700", color: "#000", marginBottom: 10 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 30 },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    width: 50,
    height: 60,
  },
  resendText: { textAlign: "center", color: "#4B56F9", marginTop: 20 },
});
