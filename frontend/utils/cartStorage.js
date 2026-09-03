import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = 'cart';

export const getCart = async () => {
  const cartStr = await AsyncStorage.getItem(CART_KEY);
  return cartStr ? JSON.parse(cartStr) : [];
};

const saveCart = async (cart) => {
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = async (product, quantity = 1) => {
  const cart = await getCart();
  const existingIndex = cart.findIndex((item) => item.productId === product._id);

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : null,
      quantity,
    });
  }

  await saveCart(cart);
  return cart;
};

export const updateCartQuantity = async (productId, quantity) => {
  let cart = await getCart();

  if (quantity <= 0) {
    cart = cart.filter((item) => item.productId !== productId);
  } else {
    const index = cart.findIndex((item) => item.productId === productId);
    if (index >= 0) cart[index].quantity = quantity;
  }

  await saveCart(cart);
  return cart;
};

export const removeFromCart = async (productId) => {
  const cart = await getCart();
  const updated = cart.filter((item) => item.productId !== productId);
  await saveCart(updated);
  return updated;
};

export const clearCart = async () => {
  await AsyncStorage.removeItem(CART_KEY);
};

export const getCartCount = async () => {
  const cart = await getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};