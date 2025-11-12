import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const CITIES = [
  {
    id: "1",
    name: "Hà Nội",
    img: "https://i.pinimg.com/1200x/07/e9/64/07e964d3f1fe1daf98e67c67eb53f8e3.jpg",
  },
  {
    id: "2",
    name: "Sài Gòn",
    img: "https://i.pinimg.com/1200x/28/af/b1/28afb1f24d9f50182b17d592e25f72bd.jpg",
  },
  {
    id: "3",
    name: "Đà Nẵng",
    img: "https://i.pinimg.com/1200x/b6/c9/c0/b6c9c0e8ed5023f45947148679aa1f3f.jpg",
  },
];

const BEST_HOTELS = [
  {
    id: "h1",
    name: "Malon Greens",
    img: "https://i.pinimg.com/1200x/e7/c5/e9/e7c5e9120409503f0bcd69a4f86d4af0.jpg",
    rating: 5.0,
    reviews: 120,
    price: 120,
    location: "Mumbai, Maharashtra",
  },
  {
    id: "h2",
    name: "Fortune Landmark",
    img: "https://i.pinimg.com/736x/18/96/db/1896db173f7298f8cd2ddf779b8a2629.jpg",
    rating: 4.8,
    reviews: 100,
    price: 150,
    location: "Goa, Maharashtra",
  },
];

const NEARBY = [
  {
    id: "n1",
    name: "Malon Greens",
    img: "https://i.pinimg.com/1200x/53/d7/14/53d714ee0529a4296aa6bfe98f39ac23.jpg",
    rating: 4.0,
    reviews: 80,
    price: 110,
    location: "Mumbai, Maharashtra",
  },
  {
    id: "n2",
    name: "Sabro Prime",
    img: "https://i.pinimg.com/736x/40/22/f7/4022f7715fb0b96b09edffae75c6078b.jpg",
    rating: 5.0,
    reviews: 76,
    price: 90,
    location: "Mumbai, Maharashtra",
  },
  {
    id: "n3",
    name: "Paradise Mint",
    img: "https://i.pinimg.com/736x/4f/bf/0e/4fbf0e285f53200a6616ce7daed1e4fe.jpg",
    rating: 4.0,
    reviews: 115,
    price: 120,
    location: "Mumbai, Maharashtra",
  },
];

export default function HotelBookingMobileUI() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="apps-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.logo}>Live Green</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="options-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchWrap}>
          <View style={styles.searchInputWrap}>
            <Ionicons
              name="search-outline"
              size={20}
              color="#cfd8ff"
              style={{ marginRight: 8 }}
            />
            <TextInput
              onPress={() => router.push("/client/room/searchRoom")}
              placeholder="Search"
              placeholderTextColor="#cfd8ff"
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="filter-outline" size={22} color="#5867ff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <FlatList
          horizontal
          data={CITIES}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          style={styles.cityList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/client/room/listHotel",
                  params: { id: item.id, nameHotel: item.name },
                })
              }
              style={styles.cityItem}
            >
              <Image source={{ uri: item.img }} style={styles.cityImg} />
              <Text style={styles.cityName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Best Hotels</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.bestScroll}
        >
          {BEST_HOTELS.map((h) => (
            <View key={h.id} style={styles.card}>
              <Image source={{ uri: h.img }} style={styles.cardImg} />
              <TouchableOpacity style={styles.heartIcon}>
                <Ionicons name="heart-outline" size={20} color="#fff" />
              </TouchableOpacity>
              <View style={styles.cardBody}>
                <Text style={styles.rating}>
                  ★★★★★ {h.rating} ({h.reviews} Reviews)
                </Text>
                <Text style={styles.cardTitle}>{h.name}</Text>
                <View style={styles.locRow}>
                  <Ionicons name="location-outline" size={14} color="#777" />
                  <Text style={styles.cardLoc}>{h.location}</Text>
                </View>
                <Text style={styles.cardPrice}>${h.price}/night</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={[styles.sectionHead, { marginTop: 18 }]}>
          <Text style={styles.sectionTitle}>Nearby your location</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        {NEARBY.map((n) => (
          <View key={n.id} style={styles.nearbyCard}>
            <Image source={{ uri: n.img }} style={styles.nearbyImg} />
            <TouchableOpacity style={styles.heartSmall}>
              <Ionicons name="heart-outline" size={18} color="#fff" />
            </TouchableOpacity>
            <View style={styles.nearbyBody}>
              <Text style={styles.ratingSmall}>
                ★★★★☆ {n.rating} ({n.reviews} Reviews)
              </Text>
              <Text style={styles.nearbyTitle}>{n.name}</Text>
              <View style={styles.locRow}>
                <Ionicons name="location-outline" size={14} color="#777" />
                <Text style={styles.cardLoc}>{n.location}</Text>
              </View>
              <Text style={styles.nearbyPrice}>${n.price}/night</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
  header: {
    padding: 18,
    backgroundColor: "#5867ff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBtn: {
    width: 38,
    height: 38,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { color: "#fff", fontSize: 18, fontWeight: "700" },

  searchWrap: { flexDirection: "row", marginTop: 14, alignItems: "center" },
  searchInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  searchInput: { color: "#fff", fontSize: 14, flex: 1 },
  filterBtn: {
    width: 44,
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  container: { paddingHorizontal: 18, marginTop: 12 },
  cityList: { marginBottom: 10 },
  cityItem: { alignItems: "center", width: 76, marginRight: 12 },
  cityImg: { width: 64, height: 64, borderRadius: 12 },
  cityName: { marginTop: 6, fontSize: 12, color: "#333" },

  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  seeAll: { color: "#6b6bff", fontWeight: "600" },

  bestScroll: { marginTop: 12, paddingLeft: 2 },
  card: {
    width: width * 0.75,
    backgroundColor: "#fff",
    borderRadius: 14,
    marginRight: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    position: "relative",
  },
  cardImg: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 5,
  },
  cardBody: { padding: 12 },
  rating: { fontSize: 12, color: "#f2b705", marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  locRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  cardLoc: { fontSize: 12, color: "#777", marginLeft: 4 },
  cardPrice: { fontSize: 16, fontWeight: "800" },

  nearbyCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
  },
  nearbyImg: { width: 86, height: 86, borderRadius: 10, marginRight: 12 },
  heartSmall: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 4,
  },
  nearbyBody: { flex: 1 },
  ratingSmall: { color: "#f2b705", fontSize: 12 },
  nearbyTitle: { fontSize: 15, fontWeight: "700", marginTop: 4 },
  nearbyPrice: { fontSize: 16, fontWeight: "800", marginTop: 6 },

  tabBar: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 18,
    height: 64,
    backgroundColor: "#fff",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 6,
  },
  tabItem: { alignItems: "center", justifyContent: "center" },
  tabItemActive: { alignItems: "center", justifyContent: "center" },
  tabText: { color: "#777", fontSize: 12, marginTop: 4 },
  tabTextActive: {
    color: "#5867ff",
    fontWeight: "700",
    fontSize: 12,
    marginTop: 4,
  },
});
