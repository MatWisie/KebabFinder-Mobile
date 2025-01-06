import { Stack, Slot, Tabs } from "expo-router";
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function MainLayout() {
    return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="more"
        options={{
          headerShown: true, 
          title: "More Details",
        }}
      />
      <Stack.Screen
        name="editUserData"
        options={{
          headerShown: true, 
          title: "Edit",
        }}
      />
      <Stack.Screen
        name="editUserPassword"
        options={{
          headerShown: true, 
          title: "Edit password",
        }}
      />
      <Stack.Screen
        name="kebabList"
        options={{
          headerShown: true, 
          title:''
        }}
      />

      <Stack.Screen
        name="kebabReport"
        options={{
          headerShown: true, 
          title:''
        }}
      />
    </Stack>
    );
  }