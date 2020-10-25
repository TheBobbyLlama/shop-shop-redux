export const UPDATE_PRODUCTS = "UPDATE_PRODUCTS";
export const UPDATE_CATEGORIES = "UPDATE_CATEGORIES";
export const UPDATE_CURRENT_CATEGORY = "UPDATE_CURRENT_CATEGORY";
export const ADD_TO_CART = 'ADD_TO_CART';
export const ADD_MULTIPLE_TO_CART = 'ADD_MULTIPLE_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_CART_QUANTITY = 'UPDATE_CART_QUANTITY';
export const CLEAR_CART = 'CLEAR_CART';
export const TOGGLE_CART = 'TOGGLE_CART';

// ACTION CREATORS
export function updateProducts(products) {
	return { type: UPDATE_PRODUCTS, products };
}

export function updateCategories(categories) {
	return { type: UPDATE_CATEGORIES, categories };
}

export function updateCurrentCategory(currentCategory) {
	return { type: UPDATE_CURRENT_CATEGORY, currentCategory};
}

export function addToCart(product) {
	return { type: ADD_TO_CART, product };
}

export function addMultipleToCart(products) {
	return { type: ADD_MULTIPLE_TO_CART, products };
}

export function removeFromCart(_id) {
	return { type: REMOVE_FROM_CART, _id };
}

export function updateCartQuantity({ _id, purchaseQuantity }) {
	return { type: UPDATE_CART_QUANTITY, _id, purchaseQuantity };
}

export function clearCart() {
	return { type: CLEAR_CART };
}

export function toggleCart() {
	return { type: TOGGLE_CART };
}