import { Stack } from "expo-router";
import React from "react";
import { Text } from "react-native";

export default function RoomLayout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="searchRoom" options={{ headerShown: false }} />
      <Stack.Screen name="listRoom" options={{ headerShown: false }} />
      <Stack.Screen name="listHotel" options={{ headerShown: false }} />
      <Stack.Screen name="detailRoom" options={{ headerShown: false }} />
      <Stack.Screen name="photoScreen" options={{ headerShown: false }} />
      <Stack.Screen name="detailPhoto" options={{headerShown:false}}/>
      <Stack.Screen name="payment" options={{headerShown:false}}/>
    </Stack>
  );
}
