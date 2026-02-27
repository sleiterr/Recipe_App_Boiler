import { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // import { useContext } from "react" async-storage is used to store data locally on the device;

const FavoritesContext = createContext();

const STORAGE_KEY = "@my_favorites";

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);// Initialize favorites state as an empty array

  // Load favorites from AsyncStorage when the component mounts
  useEffect(() => {
    loadFavorites();
  }, []);

  // Save favorites to AsyncStorage whenever the favorites state changes
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  // Function to save favorites to AsyncStorage
  const saveFavorites = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  const loadFavorites = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setFavorites(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const toggleFavorite = (recipe) => {
    setFavorites((prev) => {
      const alredySaved = prev.find((item) => item.id === recipe.id);

      if (alredySaved) {
        return prev.filter((item) => item.id !== recipe.id);
      }

      return [...prev, recipe];
    });
  };
  const isFavorite = (id) => favorites.some((item) => item.id === id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
