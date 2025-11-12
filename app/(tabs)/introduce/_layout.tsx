import { Stack } from "expo-router";

export default function IntroduceLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="firstPage" />
      <Stack.Screen name="secondPage" />
      <Stack.Screen name="thirdPage" />
    </Stack>
  );
}
