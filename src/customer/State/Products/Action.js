import { api } from "../../../config/apiConfig";

export const findProduct=(reqData)=>async(dispatch)=>{
  //(dispatch) => { ... }: Redux Thunk cho phép bạn trả về một hàm, chứ không chỉ là một object.
  //Hàm này nhận vào dispatch — là hàm dùng để gửi (dispatch) một action đến Redux store.
  //dispatch giúp bạn “bắn tín hiệu” cho reducer biết rằng có sự kiện (action) vừa xảy ra, để reducer cập nhật state tương ứng
  dispatch({ type: "FIND_PRODUCTS_REQUEST" });
  const {
    color,
    size,
    minPrice,
    maxPrice,
    minDiscount,
    category,
    stock,
    sort,
    pageNumber,
    pageSize,
  } = reqData;
  try {
    const { data } = await api.get(
      `/api/products?colors=${color}&size=${size}&minPrice=${minPrice}&maxPrice=${maxPrice}&minDiscount=${minDiscount}&category=${category}&stock=${stock}&sort=${sort}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    console.log("p data",data)
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
    const { data } = api.get(
      `/api/products/${productId}`
    );
    dispatch({ type: "FIND_PRODUCTS_BY_ID_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "FIND_PRODUCTS_BY_ID_FAILURE", payload: error.message });
  }
};