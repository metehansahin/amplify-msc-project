import * as actionTypes from "./actionTypes";

export const addToBasket = (product) => {
  return {
    type: actionTypes.ADD_TO_BASKET,
    product: product,
  };
};

export const removeFromBasket = (productId) => {
  return {
    type: actionTypes.REMOVE_FROM_BASKET,
    productId: productId,
  };
};

export const updateProductStock = (productId, stock) => {
  return {
    type: actionTypes.UPDATE_PRODUCT_STOCK,
    productId: productId,
    stock: stock,
  };
};

export const clearBasket = () => {
  return {
    type: actionTypes.CLEAR_BASKET,
  };
};
