import AsyncStorage from '@react-native-async-storage/async-storage';

const WISHLIST_KEY = 'WISHLIST_ITEMS';

// संपूर्ण wishlist मिळवणे
export const getWishlist = async () => {
  try {
    const data = await AsyncStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log('getWishlist error:', error);
    return [];
  }
};

// Wishlist मध्ये item add करणे
export const addToWishlist = async (product) => {
  try {
    const current = await getWishlist();
    const exists = current.some(
      (item) => (item._id || item.productId) === (product._id || product.productId)
    );
    if (exists) return current; // already added असेल तर काही न करता return

    const updated = [...current, product];
    await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.log('addToWishlist error:', error);
    return [];
  }
};

// Wishlist मधून item remove करणे
export const removeFromWishlist = async (productId) => {
  try {
    const current = await getWishlist();
    const updated = current.filter(
      (item) => (item._id || item.productId) !== productId
    );
    await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.log('removeFromWishlist error:', error);
    return [];
  }
};

// एखादा product wishlist मध्ये आहे का चेक करणे
export const isInWishlist = async (productId) => {
  try {
    const current = await getWishlist();
    return current.some((item) => (item._id || item.productId) === productId);
  } catch (error) {
    console.log('isInWishlist error:', error);
    return false;
  }
};