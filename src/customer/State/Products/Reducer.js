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
} from "./ActionType";

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  success: false,
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

    default:
      return state;
  }
};
