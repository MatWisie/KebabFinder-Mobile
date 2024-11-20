import { Stack, Slot } from "expo-router";

export default function MainLayout() {
    return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="more" options={{ headerShown: true }} />
      </Stack>
    );
  }