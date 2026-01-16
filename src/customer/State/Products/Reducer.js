import { deleteProduct } from "./Action";
import {
  DELETE_PRODUCT_SUCCESS,
  FIND_PRODUCTS_BY_ID_FAILURE,
  FIND_PRODUCTS_BY_ID_REQUEST,
  FIND_PRODUCTS_BY_ID_SUCCESS,
  FIND_PRODUCTS_FAILURE,
  FIND_PRODUCTS_REQUEST,
  FIND_PRODUCTS_SUCCESS,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  RESET_PRODUCT_STATE,
  FIND_PRODUCTS_BY_CATEGORY_NAME_REQUEST,
  FIND_PRODUCTS_BY_CATEGORY_NAME_SUCCESS,
  FIND_PRODUCTS_BY_CATEGORY_NAME_FAILURE,
  FETCH_CATEGORIES_WITH_PRODUCTS_REQUEST,
  FETCH_CATEGORIES_WITH_PRODUCTS_SUCCESS,
  FETCH_CATEGORIES_WITH_PRODUCTS_FAILURE,
} from "./ActionType";

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  success: false,
  // Store products by category name for homepage sections
  productsByCategory: {},
  categoryLoading: {},
  // Categories that have products (for homepage)
  categoriesWithProducts: [],
  categoriesLoading: false,
};

export const customerProductReducer = (state = initialState, action) => {
    console.log("🧾 Reducer received action:", action);
  switch (action.type) {
    case FIND_PRODUCTS_REQUEST:
    case FIND_PRODUCTS_BY_ID_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case CREATE_PRODUCT_REQUEST:
    case UPDATE_PRODUCT_REQUEST:
      return { ...state, loading: true, error: null, success: false };

    case FIND_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        success: false,
        products: action.payload,
      };

    case FIND_PRODUCTS_BY_ID_SUCCESS:
      return { ...state, loading: false, error: null, success: false, product: action.payload };

    case CREATE_PRODUCT_SUCCESS:
    case UPDATE_PRODUCT_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        error: null, 
        success: true,
        product: action.payload 
      };

    case DELETE_PRODUCT_SUCCESS:
      return { ...state, loading: false, error: null, success: false, deleteProduct: action.payload };

    case FIND_PRODUCTS_FAILURE:
    case FIND_PRODUCTS_BY_ID_FAILURE:
      return { ...state, loading: false, error: action.payload, success: false };

    case CREATE_PRODUCT_FAILURE:
    case UPDATE_PRODUCT_FAILURE:
      return { ...state, loading: false, error: action.payload, success: false };

    case RESET_PRODUCT_STATE:
      return { ...state, success: false, error: null, loading: false };

    // Handle products by category name (for homepage sections)
    case FIND_PRODUCTS_BY_CATEGORY_NAME_REQUEST:
      return {
        ...state,
        categoryLoading: {
          ...state.categoryLoading,
          [action.payload]: true,
        },
      };

    case FIND_PRODUCTS_BY_CATEGORY_NAME_SUCCESS:
      return {
        ...state,
        productsByCategory: {
          ...state.productsByCategory,
          [action.payload.categoryName]: action.payload.products,
        },
        categoryLoading: {
          ...state.categoryLoading,
          [action.payload.categoryName]: false,
        },
      };

    case FIND_PRODUCTS_BY_CATEGORY_NAME_FAILURE:
      return {
        ...state,
        categoryLoading: {
          ...state.categoryLoading,
          [action.payload.categoryName]: false,
        },
        error: action.payload.error,
      };

    // Handle fetching categories with products
    case FETCH_CATEGORIES_WITH_PRODUCTS_REQUEST:
      return {
        ...state,
        categoriesLoading: true,
      };

    case FETCH_CATEGORIES_WITH_PRODUCTS_SUCCESS:
      return {
        ...state,
        categoriesWithProducts: action.payload,
        categoriesLoading: false,
      };

    case FETCH_CATEGORIES_WITH_PRODUCTS_FAILURE:
      return {
        ...state,
        categoriesLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
