import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ScreenHeader({
  title,
  enableSearch = false,
  searchDisplayMode = "always",
  forceHideSearch = false,
  onSearchButtonPress,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search recipes...",
}) {
  const shouldUseToggle = searchDisplayMode === "toggle";
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isSearchVisible =
    enableSearch &&
    (!shouldUseToggle || isSearchOpen || searchValue.length > 0) &&
    !forceHideSearch;
  
  const searchAnimation = useRef(
    new Animated.Value(isSearchVisible ? 1 : 0),
  ).current;

  useEffect(() => {
    Animated.timing(searchAnimation, {
      toValue: isSearchVisible ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [isSearchVisible, searchAnimation]);

  const animatedContainerStyle = {
    opacity: searchAnimation,
    maxHeight: searchAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 70],
    }),
    marginBottom: searchAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 14],
    }),
    transform: [
      {
        translateY: searchAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [-6, 0],
        }),
      },
    ],
  };

  const handleSearchPress = () => {
    onSearchButtonPress?.();

    if (!enableSearch) return;

    if (shouldUseToggle) {
      const nextOpen = !isSearchOpen;
      setIsSearchOpen(nextOpen);

      if (!nextOpen && onSearchChange) {
        onSearchChange("");
      }
      return;
    }

    if (onSearchChange) {
      onSearchChange("");
    }
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Pressable style={styles.searchButton} onPress={handleSearchPress}>
          <Ionicons name="search" size={24} color="#222" />
        </Pressable>
      </View>

      {enableSearch ? (
        <Animated.View
          style={[styles.searchAnimatedContainer, animatedContainerStyle]}
          pointerEvents={isSearchVisible ? "auto" : "none"}
        >
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search" size={18} color="#666" />
            <TextInput
              value={searchValue}
              onChangeText={onSearchChange}
              placeholder={searchPlaceholder}
              style={styles.searchInput}
              placeholderTextColor="#888"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </Animated.View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#222",
  },

  searchButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EBE9E0",
  },

  searchInputWrapper: {
    marginHorizontal: 16,
    marginTop: -6,
    minHeight: 44,
    borderRadius: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EBE9E0",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  searchAnimatedContainer: {
    overflow: "hidden",
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    paddingVertical: 10,
  },
});
