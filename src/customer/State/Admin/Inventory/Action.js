import { api } from "../../../../config/apiConfig";
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

export const getInventory = () => {
  return async (dispatch) => {
    dispatch({ type: GET_INVENTORY_REQUEST });
    try {
      const response = await api.get("/api/admin/inventory/");
      dispatch({ type: GET_INVENTORY_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: GET_INVENTORY_FAILURE, payload: error.message });
    }
  };
};

export const updateInventory = (productId, quantity) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_INVENTORY_REQUEST });
    try {
      const response = await api.put(`/api/admin/inventory/${productId}?quantity=${quantity}`);
      dispatch({ type: UPDATE_INVENTORY_SUCCESS, payload: response.data });
      // Refresh danh sách inventory
      dispatch(getInventory());
    } catch (error) {
      dispatch({ type: UPDATE_INVENTORY_FAILURE, payload: error.message });
    }
  };
};

export const addInventory = (productId, quantity) => {
  return async (dispatch) => {
    dispatch({ type: ADD_INVENTORY_REQUEST });
    try {
      const response = await api.post(`/api/admin/inventory/${productId}/add?quantity=${quantity}`);
      dispatch({ type: ADD_INVENTORY_SUCCESS, payload: response.data });
      // Refresh danh sách inventory
      dispatch(getInventory());
    } catch (error) {
      dispatch({ type: ADD_INVENTORY_FAILURE, payload: error.message });
    }
  };
};

export const reduceInventory = (productId, quantity) => {
  return async (dispatch) => {
    dispatch({ type: REDUCE_INVENTORY_REQUEST });
    try {
      const response = await api.post(`/api/admin/inventory/${productId}/reduce?quantity=${quantity}`);
      dispatch({ type: REDUCE_INVENTORY_SUCCESS, payload: response.data });
      // Refresh danh sách inventory
      dispatch(getInventory());
    } catch (error) {
      dispatch({ type: REDUCE_INVENTORY_FAILURE, payload: error.message });
    }
  };
};

export const deleteInventory = (productId) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_INVENTORY_REQUEST });
    try {
      await api.delete(`/api/admin/inventory/${productId}`);
      dispatch({ type: DELETE_INVENTORY_SUCCESS, payload: productId });
      // Refresh danh sách inventory
      dispatch(getInventory());
    } catch (error) {
      dispatch({ type: DELETE_INVENTORY_FAILURE, payload: error.message });
    }
  };
};
