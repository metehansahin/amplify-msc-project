import * as actionTypes from "./actionTypes";

const loadBasketFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("basketState");
    if (serializedState === null) {
      return {
        products: [],
        totalCost: 0,
      }; // No basket in localStorage, use default initialState
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return initialState; // In case of an error, use default initialState
  }
};

const initialState = loadBasketFromLocalStorage();

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_TO_BASKET: {
      const product = action.product;
      const existingProductIndex = state.products.findIndex(
        (p) => p._id === product._id
      );

      if (existingProductIndex !== -1) {
        const existingProduct = state.products[existingProductIndex];
        const updatedProducts = state.products.map((p, index) => {
          if (index === existingProductIndex) {
            return {
              ...existingProduct,
              quantity: existingProduct.quantity + product.quantity,
            };
          }
          return p;
        });
        const newTotalCost =
          state.totalCost +
          parseInt(product.price) * parseInt(product.quantity);
        return {
          ...state,
          products: updatedProducts,
          totalCost: newTotalCost,
        };
      } else {
        const newTotalCost =
          state.totalCost +
          parseInt(product.price) * parseInt(product.quantity);
        return {
          ...state,
          products: [...state.products, product],
          totalCost: newTotalCost,
        };
      }
    }

    case actionTypes.REMOVE_FROM_BASKET: {
      const productToRemoveIndex = state.products.findIndex(
        (p) => p._id === action.productId
      );
      if (productToRemoveIndex !== -1) {
        const productToRemove = state.products[productToRemoveIndex];
        if (parseInt(productToRemove.quantity) === 1) {
          const newTotalCost =
            parseInt(state.totalCost) -
            parseInt(productToRemove.price) *
              parseInt(productToRemove.quantity);
          const updatedProducts = state.products.filter(
            (p) => p._id !== action.productId
          );

          return {
            ...state,
            products: updatedProducts,
            totalCost: newTotalCost,
          };
        } else {
          const productToRemove = state.products[productToRemoveIndex];
          const updatedProducts = state.products.map((p, index) => {
            if (index === productToRemoveIndex) {
              return {
                ...productToRemove,
                quantity: parseInt(productToRemove.quantity) - 1,
              };
            }
            return p;
          });
          const newTotalCost =
            parseInt(state.totalCost) - parseInt(productToRemove.price);
          return {
            ...state,
            products: updatedProducts,
            totalCost: newTotalCost,
          };
        }
      }
      return state;
    }

    case actionTypes.UPDATE_PRODUCT_STOCK: {
      // Handle the new action type
      const updatedProducts = state.products.map((product) =>
        product._id === action.productId
          ? { ...product, stock: action.stock }
          : product
      );
      return {
        ...state,
        products: updatedProducts,
      };
    }

    case actionTypes.CLEAR_BASKET: {
      return {
        products: [],
        totalCost: 0,
      };
    }

    default:
      return state;
  }
};

export default reducer;
