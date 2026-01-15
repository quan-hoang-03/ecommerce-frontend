import {
  GET_INVENTORY_REQUEST,
  GET_INVENTORY_SUCCESS,
  GET_INVENTORY_FAILURE,
  UPDATE_INVENTORY_REQUEST,
  UPDATE_INVENTORY_SUCCESS,
  UPDATE_INVENTORY_FAILURE,
  ADD_INVENTORY_REQUEST,
  ADD_INVENTORY_SUCCESS,
  ADD_INVENTORY_FAILURE,
  REDUCE_INVENTORY_REQUEST,
  REDUCE_INVENTORY_SUCCESS,
  REDUCE_INVENTORY_FAILURE,
  DELETE_INVENTORY_REQUEST,
  DELETE_INVENTORY_SUCCESS,
  DELETE_INVENTORY_FAILURE,
} from "./ActionType";

const initialState = {
  inventory: [],
  loading: false,
  error: null,
};

export const adminInventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INVENTORY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_INVENTORY_SUCCESS:
      return {
        ...state,
        inventory: action.payload,
        loading: false,
        error: null,
      };
    case GET_INVENTORY_FAILURE:
      return {
        ...state,
        inventory: [],
        loading: false,
        error: action.payload,
      };

    case UPDATE_INVENTORY_REQUEST:
    case ADD_INVENTORY_REQUEST:
    case REDUCE_INVENTORY_REQUEST:
    case DELETE_INVENTORY_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_INVENTORY_SUCCESS:
    case ADD_INVENTORY_SUCCESS:
    case REDUCE_INVENTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case DELETE_INVENTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case UPDATE_INVENTORY_FAILURE:
    case ADD_INVENTORY_FAILURE:
    case REDUCE_INVENTORY_FAILURE:
    case DELETE_INVENTORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
