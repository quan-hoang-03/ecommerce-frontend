import { api } from "../../../config/apiConfig";

export const findProduct=(reqData)=>async(dispatch)=>{
    dispatch({ type: "FIND_PRODUCTS_REQUEST" });
    const {color,size,minPrice,maxPrice,minDiscount,category,stock,sort,pageNumber,pageSize}=reqData;
    try {
        const { data } = api.get(
          `/api/products/color=${color}&size=${size}&minPrice=${minPrice}&maxPrice=${maxPrice}&minDiscount=${minDiscount}&category=${category}&stock=${stock}&sort=${sort}&pageNumber=${pageNumber}&pageSize=${pageSize}`
        );
        dispatch({type:"FIND_PRODUCTS_SUCCESS",payload:data})
    } catch (error) {
        dispatch({type:"FIND_PRODUCTS_FAILURE",payload:error.message})
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