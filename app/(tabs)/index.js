import { useState, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list"; // use for rendering large lists efficiently
import ScreenHeader from "../../components/ui/ScreenHeader";
import { RECIPES, CATEGORIES } from "../../constants/data";
import CategoryBar from "../../components/features/CategoryBar";
import RecipeCard from "../../components/features/RecipeCard";

export default function DiscoverScreen() {
  const [activeCategory, setActiveCategory] = useState("All Recipes");

  // Filter recipes based on the active category
  const filtered =
    activeCategory === "All Recipes"
      ? RECIPES
      : RECIPES.filter((recipe) => recipe.categories?.includes(activeCategory));

  // Ref for the FlashList to enable scrolling to top when category changes
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [activeCategory]);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Recipes" />
      <CategoryBar
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <FlashList
        ref={listRef}
        data={filtered}
        key={(item) => item.id}
        numColumns={2}
        estimatedItemSize={200}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => <RecipeCard recipe={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F8F4",
  },
});
