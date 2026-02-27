// app/_layout.js
import { Stack } from "expo-router"; // Import the GestureHandlerRootView

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FavoritesProvider } from "../context/FavoritesContext";
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Wrap the entire app in the FavoritesProvider to provide context to all screens */}
      <FavoritesProvider>
        {/* Your app content goes here */}
        <Stack>
          {/* Define your screens here, for example: */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="recipe/[id]"
            options={{ headerShown: false, animation: "slide_from_right" }}
          />

          <Stack.Screen name="+not-found" />
        </Stack>
      </FavoritesProvider>
    </GestureHandlerRootView>
  );
}
