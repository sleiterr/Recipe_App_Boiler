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
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchHiddenByScroll, setIsSearchHiddenByScroll] = useState(false);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const categoryFiltered =
    activeCategory === "All Recipes"
      ? RECIPES
      : RECIPES.filter((recipe) => recipe.categories?.includes(activeCategory));

  const filtered =
    normalizedQuery.length === 0
      ? categoryFiltered
      : categoryFiltered.filter((recipe) =>
          recipe.title.toLowerCase().includes(normalizedQuery),
        );

  // Ref for the FlashList to enable scrolling to top when category changes
  const listRef = useRef(null);
  const lastScrollOffsetRef = useRef(0);

  const handleListScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const previousOffset = lastScrollOffsetRef.current;
    const delta = currentOffset - previousOffset;

    if (delta > 3 && currentOffset > 16) {
      setIsSearchHiddenByScroll(true);
    }

    lastScrollOffsetRef.current = Math.max(currentOffset, 0);
  };

  const handleSearchButtonPress = () => {
    setIsSearchHiddenByScroll(false);
  };

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [activeCategory]);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Recipes"
        enableSearch
        searchDisplayMode="toggle"
        forceHideSearch={isSearchHiddenByScroll}
        onSearchButtonPress={handleSearchButtonPress}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search recipes by name"
      />
      <CategoryBar
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <FlashList
        ref={listRef}
        data={filtered}
        onScroll={handleListScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
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
