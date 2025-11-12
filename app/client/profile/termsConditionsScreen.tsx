import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const TermsConditionsScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 24 }} /> {/* placeholder for spacing */}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.dateText}>Last update: 25/6/2022</Text>
        <Text style={styles.text}>
          Please read these terms of service carefully before using our app operated by us.
        </Text>

        <Text style={styles.linkText}>Conditions of Uses</Text>
        <Text style={styles.text}>
          It is a long established fact that a reader will be distracted by the readable content
          of a page when looking at its layout. The point of using Lorem Ipsum is that it has a
          more-or-less normal distribution of letters, as opposed to using ‘Content here, content
          here’, making it look like readable English. Many desktop publishing packages and web
          page editors now use Lorem Ipsum as their default model text, and a search for ‘lorem
          ipsum’ will uncover many web sites still in their infancy. Various versions have evolved
          over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
        </Text>
      </ScrollView>
    </View>
  );
};

export default TermsConditionsScreen;

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
