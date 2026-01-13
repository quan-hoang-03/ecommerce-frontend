import { api, API_BASE_URL } from "../../../config/apiConfig";
import { CREATE_ORDER_SUCCESS } from "../Order/ActionType";
import { CREATE_PRODUCT_FAILURE, CREATE_PRODUCT_REQUEST, CREATE_PRODUCT_SUCCESS, DELETE_PRODUCT_SUCCESS, UPDATE_PRODUCT_REQUEST, UPDATE_PRODUCT_SUCCESS, UPDATE_PRODUCT_FAILURE, RESET_PRODUCT_STATE } from "./ActionType";

export const findProduct=(reqData)=>async(dispatch)=>{
  //(dispatch) => { ... }: Redux Thunk cho phép bạn trả về một hàm, chứ không chỉ là một object.
  //Hàm này nhận vào dispatch — là hàm dùng để gửi (dispatch) một action đến Redux store.
  //dispatch giúp bạn “bắn tín hiệu” cho reducer biết rằng có sự kiện (action) vừa xảy ra, để reducer cập nhật state tương ứng
  dispatch({ type: "FIND_PRODUCTS_REQUEST" });
   const {
     colors = "",
     size = "",
     minPrice = 0,
     maxPrice = 0,
     minDiscount = 0,
     category = "",
     stock = "",
     sort = "price_low",
     pageNumber = 0,
     pageSize = 10,
   } = reqData;
   try {
     const { data } = await api.get(`/api/products`, {
       params: {
         colors,
         size,
         minPrice,
         maxPrice,
         minDiscount,
         category,
         stock,
         sort,
         pageNumber,
         pageSize,
       },
     });
     console.log("p data", data);
     dispatch({ type: "FIND_PRODUCTS_SUCCESS", payload: data });
   } catch (error) {
     dispatch({ type: "FIND_PRODUCTS_FAILURE", payload: error.message });
   }
}

export const findProductById = (reqData) => async (dispatch) => {
  dispatch({ type: "FIND_PRODUCTS_BY_ID_REQUEST" });
  const {
    productId
  } = reqData;
  try {
    const {data} = await api.get(
      `/api/products/${productId}`
    );
    dispatch({ type: "FIND_PRODUCTS_BY_ID_SUCCESS", payload: data });
    console.log(data,"dataaaaa")
  } catch (error) {
    dispatch({ type: "FIND_PRODUCTS_BY_ID_FAILURE", payload: error.message });
  }
};

export const createProduct = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "CREATE_PRODUCT_REQUEST" });
    const { data } = await api.post("/api/admin/products/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Created product:", data);
    dispatch({ type: "CREATE_PRODUCT_SUCCESS", payload: data });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    const errorMessage = e.response?.data?.message || e.message || "Có lỗi xảy ra khi tạo sản phẩm";
    dispatch({ type: "CREATE_PRODUCT_FAILURE", payload: errorMessage });
    throw e;
  }
};

export const updateProduct = (productId, formData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });
    const { data } = await api.put(`/api/admin/products/${productId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Updated product:", data);
    dispatch({ type: UPDATE_PRODUCT_SUCCESS, payload: data });
    return { success: true, data };
  } catch (e) {
    console.error(e);
    const errorMessage = e.response?.data?.message || e.message || "Có lỗi xảy ra khi cập nhật sản phẩm";
    dispatch({ type: UPDATE_PRODUCT_FAILURE, payload: errorMessage });
    throw e;
  }
};

export const deleteProduct = (productId) => async (dispatch) => {
  try {
    dispatch({ type: "DELETE_PRODUCT_REQUEST" });
    const { data } = await api.post(
      `${API_BASE_URL}/api/products/delete/${productId}`
    );
    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: productId,
    });
  } catch (e) {
    dispatch({ type: "DELETE_PRODUCT_FAILURE", payload: e.message });
  }
};

export const resetProductState = () => (dispatch) => {
  dispatch({ type: RESET_PRODUCT_STATE });
}; 