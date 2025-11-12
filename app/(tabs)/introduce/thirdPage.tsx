import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

export default function ThirdPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://i.pinimg.com/736x/63/e1/82/63e18240c3d0128ec696b02aa856f972.jpg",
        }}
        style={styles.image}
      >
        <View style={styles.bottomCard}>
          <View style={styles.indicatorContainer}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <Text style={styles.title}>Discover and find your perfect healing place </Text>
          <Text style={styles.subtitle}>
            It is a long established fact that a reader will be distracted by
            the readable content.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => router.push("/(tabs)/authentication/login")}
            >
              <Text style={styles.nextText}>Get started →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bottomCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  indicatorContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#4E6EF2",
    width: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    color: "#777",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 25,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  skipText: {
    color: "#000",
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#4E6EF2",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  nextText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
