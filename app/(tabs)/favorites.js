import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFavorites } from "../../context/FavoritesContext";
import DraggableRecipeCard from "../../components/features/DraggableRecipeCard";
import TrashButton from "../../components/features/TrashButton";
import EmptyState from "../../components/ui/EmptyState";
import ScreenHeader from "../../components/ui/ScreenHeader";

export default function FavoritesScreen() {
  const { favorites } = useFavorites();

  const insets = useSafeAreaInsets();

  const isDraggingGlobal = useSharedValue(0);

  return (
    <SafeAreaView style={[styles.container]}>
      <ScreenHeader title="Favorites" />

      {favorites.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          text="You haven't saved any recipes yet."
          subText="Double tap recipes in Explore to save them here."
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 120 },
          ]}
        >
          <View style={styles.grid}>
            {favorites.map((recipe) => (
              <DraggableRecipeCard
                key={recipe.id}
                recipe={recipe}
                isDraggingGlobal={isDraggingGlobal}
              />
            ))}
          </View>
        </ScrollView>
      )}
      <TrashButton isDraggingGlobal={isDraggingGlobal} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F8F4",
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#222",
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
