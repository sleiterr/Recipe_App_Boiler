import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  LinearTransition,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useFavorites } from "../../context/FavoritesContext";
import { Image } from "expo-image";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function DraggableRecipeCard({ recipe, isDraggingGlobal }) {
  console.log(isDraggingGlobal);
  const { toggleFavorite } = useFavorites();
  const router = useRouter();
  // Global state to track if any card is being dragged
  const translateX = useSharedValue(0);
  // This shared value will be used to track the dragging state across all cards
  const translateY = useSharedValue(0);
  // This shared value will be used to track the dragging state across all cards
  const scale = useSharedValue(1);
  // This shared value will be used to track the dragging state across all cards
  const zIndex = useSharedValue(1);

  // This shared value will be used to track the dragging state across all cards
  const pan = Gesture.Pan()
    .activateAfterLongPress(200)
    .runOnJS(true)
    .onStart(() => {
      isDraggingGlobal.value = withSpring(1);
      zIndex.value = 100;
      scale.value = withSpring(1.1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    })
    // The onUpdate callback will be called continuously as the user drags the card
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;

      if (e.absoluteY > SCREEN_HEIGHT - 180) {
        if (isDraggingGlobal.value !== 1.5) {
          isDraggingGlobal.value = withSpring(1.5);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } else {
        isDraggingGlobal.value = withSpring(1);
      }
    })

    // The onEnd callback will be called when the user releases the card
    .onEnd((e) => {
      isDraggingGlobal.value = withSpring(0);
      scale.value = withSpring(1);
      zIndex.value = 1;

      if (e.absoluteY > SCREEN_HEIGHT - 180) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        toggleFavorite(recipe);
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  // The tap gesture will be used to navigate to the recipe details screen when the user taps on the card
  const tap = Gesture.Tap()
    .runOnJS(true)
    .onStart(() => router.push(`/recipe/${recipe.id}`));

  // The gesture will be a combination of the pan and tap gestures, allowing the user to either drag the card or tap on it to navigate to the details screen
  const gesture = Gesture.Exclusive(pan, tap);

  // The animated style will be applied to the card, allowing it to move and scale based on the user's interactions
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],

    zIndex: zIndex.value,
  }));

  return (
    <Animated.View
      layout={LinearTransition.springify()}
      style={[styles.cardContainer, animatedStyle]}
      entering={FadeIn}
      exiting={FadeOut}
    >
      <GestureDetector gesture={gesture}>
        <View>
          <View style={styles.imageContainer}>
            <Image
              source={recipe.image}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          </View>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {recipe.title}
          </Text>
          <View style={styles.statsContainer}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.statsText}>{recipe.time}</Text>
            <Ionicons
              name="flame-outline"
              size={14}
              color="#666"
              style={{ marginLeft: 8 }}
            />
            <Text style={styles.statsText}>{recipe.calories}</Text>
          </View>
        </View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: { width: "48%", marginBottom: 25 },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 10,
  },
  image: { width: "100%", height: "100%" },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 6,
  },
  statsContainer: { flexDirection: "row", alignItems: "center" },
  statsText: { fontSize: 12, color: "#666", marginLeft: 4 },
});
