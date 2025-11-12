import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const PrivacyPolicyScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.dateText}>Last update: 25/6/2022</Text>
        <Text style={styles.text}>
          Please read these privacy policy carefully before using our app operated by us.
        </Text>

        <Text style={styles.linkText}>Privacy Policy</Text>
        <Text style={styles.text}>
          There are many variations of passages of Lorem Ipsum available, but the majority have
          suffered alteration in some form, by injected humour, or randomised words which don’t look
          even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be
          sure there isn’t anything embarrassing hidden in the middle of text.
        </Text>
        <Text style={styles.text}>
          All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as
          necessary, making this the first true generator on the Internet. It uses a dictionary of
          over 200 Latin words, combined with a handful of model sentence structures, to generate
          Lorem Ipsum which looks reasonable.
        </Text>
        <Text style={styles.text}>
          The generated Lorem Ipsum is therefore always free from repetition, injected humour, or
          non-characteristic words etc.
        </Text>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  dateText: {
    color: "#9CA3AF",
    marginBottom: 12,
    fontSize: 13,
  },
  text: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 14,
  },
  linkText: {
    color: "#2563EB",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 8,
  },
});
